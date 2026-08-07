#!/usr/bin/env python3
"""retheme-figures: give notebook matplotlib figures light+dark theme variants.

Run this AFTER executing a notebook (which bakes a single opaque PNG per figure).
For every code cell that draws a figure, it re-renders the cell's plotting code
and rewrites the image output so mdbook-nb's theme-swap can use it:

  * light variant -> output["data"]["image/png"]        (transparent, dark ink)
  * dark  variant -> output["metadata"]["dark"]["image/png"] (transparent, light ink)

Both are transparent so the plot sits on the page color (works on mdBook's
`light` and `rust` as well as the dark themes). The cell's *own* colors are
preserved — only default-colored elements (text/axes/ticks) follow the ink
override — so an explicit `color="#0072B2"` bar stays that color in both.

Each cell is executed exactly ONCE. The dark variant is produced by recoloring
the live figure's default-colored artists and saving it again, not by re-running
the cell. That matters for correctness as much as speed: a cell that trains a
model or draws from an RNG mutates the shared namespace, so a second execution
would render a *different* figure than the first — the two themes would silently
disagree. One execution, two saves, identical geometry.

Why not recolor the PNG instead? A raster recolor can't retint anti-aliased
text/edges cleanly, and can't make an opaque background transparent. Recoloring
the artists and re-saving is a genuine re-render, so both come out clean.

Usage (with a Python that has the notebooks' imports, e.g. notebooks/.venv):
    python preprocessors/retheme-figures.py [notebook.ipynb ...]
With no args, processes every .ipynb under notebooks/ (skipping .venv and
checkpoints, and notebooks that never import matplotlib).

Caveat: it *executes* cell code (in the notebook's own directory, so relative
paths resolve), so a notebook costs whatever its cells cost to run — a training
loop is a training loop. IPython magics and `!shell` lines are skipped, not run.
A cell that raises is reported and skipped — the notebook's other figures still
get done.
"""
import base64
import contextlib
import io
import json
import os
import re
import sys
import warnings

DARK_INK = "#c9d1d9"  # light gray, legible on coal/navy/ayu
USES_MPL = re.compile(r"matplotlib|pyplot|\bplt\.")
MAGIC_LINE = re.compile(r"^\s*[%!]")  # `%matplotlib inline`, `!pip install ...`


def _fig_pngs(plt):
    """Save every currently-open figure to a transparent PNG (base64)."""
    out = []
    for num in plt.get_fignums():
        buf = io.BytesIO()
        plt.figure(num).savefig(buf, format="png", dpi=100,
                                bbox_inches="tight", transparent=True)
        out.append(base64.b64encode(buf.getvalue()).decode("ascii"))
    return out


def _default_ink(mpl):
    """The rc colors an *unstyled* artist carries, i.e. the ones we may override.

    Resolves the two indirections matplotlib allows: `axes.titlecolor: auto`
    means "follow text.color", and `[xy]tick.labelcolor: inherit` means "follow
    [xy]tick.color". Without resolving them, the comparison below would never
    match and titles/tick labels would stay black on dark themes.
    """
    rc = mpl.rcParams

    def deref(key, sentinel, fallback):
        val = rc[key]
        return rc[fallback] if str(val).lower() == sentinel else val

    return {
        "text": rc["text.color"],
        "label": rc["axes.labelcolor"],
        "edge": rc["axes.edgecolor"],
        "legend_edge": rc["legend.edgecolor"],
        "title": deref("axes.titlecolor", "auto", "text.color"),
        "xtick": rc["xtick.color"],
        "ytick": rc["ytick.color"],
        "xticklabel": deref("xtick.labelcolor", "inherit", "xtick.color"),
        "yticklabel": deref("ytick.labelcolor", "inherit", "ytick.color"),
    }


def _retint(artist, default, ink, to_rgba, get="get_color", set="set_color"):
    """Recolor `artist` to `ink`, but only if it still wears the rc default.

    This is what preserves the cell's own styling: an explicitly colored artist
    doesn't match `default`, so it's left alone. Compared on RGB only — alpha is
    the cell's business, not the theme's.
    """
    try:
        current = getattr(artist, get)()
        if to_rgba(current)[:3] == to_rgba(default)[:3]:
            getattr(artist, set)(ink)
    except (AttributeError, ValueError, TypeError):
        pass  # exotic artist (3D axes, custom spine); not worth failing over


def _recolor_dark(plt, mpl, ink):
    """Walk every open figure and swap default-colored ink for `ink`."""
    to_rgba = mpl.colors.to_rgba
    d = _default_ink(mpl)
    for num in plt.get_fignums():
        fig = plt.figure(num)
        for text in fig.texts:  # suptitle, fig.text(...)
            _retint(text, d["text"], ink, to_rgba)
        for ax in fig.axes:  # includes colorbar axes
            _retint(ax.title, d["title"], ink, to_rgba)
            _retint(ax.xaxis.label, d["label"], ink, to_rgba)
            _retint(ax.yaxis.label, d["label"], ink, to_rgba)
            for text in ax.texts:  # annotate(), ax.text(...)
                _retint(text, d["text"], ink, to_rgba)
            for spine in ax.spines.values():
                _retint(spine, d["edge"], ink, to_rgba,
                        "get_edgecolor", "set_edgecolor")
            for axis, tick_c, label_c in ((ax.xaxis, d["xtick"], d["xticklabel"]),
                                          (ax.yaxis, d["ytick"], d["yticklabel"])):
                for tick in axis.get_major_ticks() + axis.get_minor_ticks():
                    _retint(tick.tick1line, tick_c, ink, to_rgba)
                    _retint(tick.tick2line, tick_c, ink, to_rgba)
                    _retint(tick.label1, label_c, ink, to_rgba)
                    _retint(tick.label2, label_c, ink, to_rgba)
            legend = ax.get_legend()
            if legend is not None:
                for text in legend.get_texts():
                    _retint(text, d["text"], ink, to_rgba)
                _retint(legend.get_frame(), d["legend_edge"], ink, to_rgba,
                        "get_edgecolor", "set_edgecolor")


def _compile(src):
    """Compile a cell, tolerating IPython magics (`%matplotlib inline`) and shell
    escapes (`!pip install ...`) — Jupyter accepts those, Python doesn't. Only
    sources that fail to parse as-is get the treatment, so a `%`/`!` line inside
    a string literal (which compiles fine) is never touched. Blanking the lines
    instead of deleting them keeps traceback line numbers honest. Dropping
    `%matplotlib inline` is harmless here: the backend is forced to Agg."""
    try:
        return compile(src, "<cell>", "exec")
    except SyntaxError:
        kept = ["" if MAGIC_LINE.match(l) else l for l in src.splitlines()]
        return compile("\n".join(kept), "<cell>", "exec")


def _run(src, ns, plt):
    """Exec a cell, leaving whatever figures it opened open for the caller."""
    plt.close("all")
    with contextlib.redirect_stdout(io.StringIO()), warnings.catch_warnings():
        warnings.simplefilter("ignore")  # e.g. Agg's non-interactive plt.show()
        exec(_compile(src), ns)


def process_notebook(path):
    with open(path, encoding="utf-8") as f:
        nb = json.load(f)
    code = [c for c in nb.get("cells", []) if c.get("cell_type") == "code"]
    if not any(USES_MPL.search("".join(c.get("source", []))) for c in code):
        return 0  # no matplotlib anywhere -> nothing to do

    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    ns = {}
    cwd = os.getcwd()
    os.chdir(os.path.dirname(os.path.abspath(path)))  # relative data paths
    n_figs = 0
    try:
        for i, cell in enumerate(code, 1):
            src = "".join(cell.get("source", []))
            try:
                _run(src, ns, plt)  # also builds state for later cells
                if not plt.get_fignums():
                    continue                              # not a plot cell
                with warnings.catch_warnings():
                    warnings.simplefilter("ignore")  # e.g. tight-bbox complaints
                    light = _fig_pngs(plt)
                    _recolor_dark(plt, matplotlib, DARK_INK)  # same fig, dark ink
                    dark = _fig_pngs(plt)
            except Exception as e:
                # One unrunnable cell shouldn't cost the notebook its other
                # figures — report it and carry on. (Later cells may well fail
                # too, having lost this one's state; that's worth seeing.)
                sys.stderr.write("  ! %s cell %d: %s: %s\n"
                                 % (os.path.basename(path), i, type(e).__name__, e))
                continue
            finally:
                plt.close("all")
            img_outs = [o for o in cell.get("outputs", [])
                        if o.get("output_type") in ("display_data", "execute_result")
                        and "image/png" in o.get("data", {})]
            if not img_outs:
                sys.stderr.write(
                    "  ! %s: a cell drew a figure but has no saved image output "
                    "(execute the notebook first)\n" % os.path.basename(path))
                continue
            for o, lp, dp in zip(img_outs, light, dark):
                o["data"]["image/png"] = lp
                o.setdefault("metadata", {})["dark"] = {"image/png": dp}
                n_figs += 1
    finally:
        os.chdir(cwd)

    if n_figs:
        with open(path, "w", encoding="utf-8") as f:
            json.dump(nb, f, indent=1, ensure_ascii=False)
            f.write("\n")
    return n_figs


def find_notebooks(root):
    for dirpath, dirs, files in os.walk(root):
        dirs[:] = [d for d in dirs if d != ".venv" and "checkpoint" not in d]
        for fn in files:
            if fn.endswith(".ipynb"):
                yield os.path.join(dirpath, fn)


def main(argv):
    here = os.path.dirname(os.path.abspath(__file__))
    default_dir = os.path.normpath(os.path.join(here, "..", "notebooks"))
    paths = argv[1:] or sorted(find_notebooks(default_dir))
    total = 0
    for p in paths:
        try:
            n = process_notebook(p)
        except Exception as e:  # keep going across notebooks
            sys.stderr.write("  ! %s: %s\n" % (p, e))
            continue
        if n:
            print("  rethemed %d figure(s) in %s" % (n, os.path.relpath(p)))
            total += n
    print("done: %d figure(s) rethemed" % total)


if __name__ == "__main__":
    main(sys.argv)
