document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("code.language-lean").forEach(function (block) {
    if (typeof hljs !== "undefined") hljs.highlightBlock(block);
  });
});

// Tag paragraphs whose entire content IS an <em> (standalone italic lines like
// "*Forward Pass*") so CSS can tighten only those. A pure `p:has(> em:only-child)`
// rule over-matches: :only-child ignores text nodes, so inline *phrases* with
// surrounding text matched too and lost their margins.
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("p > em:only-child").forEach(function (em) {
    const p = em.parentElement;
    if (p.textContent.trim() === em.textContent.trim()) {
      p.classList.add("em-only");
    }
  });
});

// Give each defnote a slug id and make it clickable like an mdbook header,
// so clicking it updates the URL hash to that id (and the id is linkable).
document.addEventListener("DOMContentLoaded", function () {
  const defnotes = document.querySelectorAll(".defnote");
  if (defnotes.length === 0) return;

  function slugify(text) {
    return text
      .trim()
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  }

  const seen = Object.create(null);
  defnotes.forEach(function (note) {
    let slug = slugify(note.textContent);
    if (!slug) return;
    if (seen[slug] !== undefined) {
      seen[slug] += 1;
      slug = slug + "-" + seen[slug];
    } else {
      seen[slug] = 0;
    }

    note.id = slug;
    note.classList.add("defnote-link");
    note.addEventListener("click", function () {
      // Update the URL hash and snap the page to the defnote, like mdbook
      // headers. Clearing the hash first guarantees navigation fires even when
      // the hash already equals this slug.
      history.replaceState(null, "", location.pathname + location.search);
      location.hash = slug;
    });
  });
});

// Stack defnotes whose terms share a wrapped line so they sit in the margin
// instead of overlapping. Each .defnote is absolutely positioned at the static
// top of its term's line; two terms on one line collide at the same top. We
// group notes by their natural top and push each later note in a group down by
// one body line (2.32rem = 1.45 line-height x 1.6rem font), matching the gap of
// notes on consecutive lines. Runs on load and resize since wrapping changes.
document.addEventListener("DOMContentLoaded", function () {
  const defnotes = Array.prototype.slice.call(
    document.querySelectorAll(".defnote")
  );
  if (defnotes.length === 0) return;

  const TOL = 12; // px; notes within this vertical distance share a line
  const STEP = 2.32; // rem per stacked note (one body line)

  function restack() {
    // Reset to CSS base (0.3rem) so measurements reflect natural positions.
    defnotes.forEach(function (n) {
      n.style.marginTop = "";
    });

    // Skip hidden notes (mobile collapses .defnote to display:none).
    const visible = defnotes.filter(function (n) {
      return n.offsetParent !== null;
    });
    visible.sort(function (a, b) {
      return a.getBoundingClientRect().top - b.getBoundingClientRect().top;
    });

    // Walk top-sorted notes, bucketing any within TOL of the group's first top.
    const groups = [];
    visible.forEach(function (n) {
      const top = n.getBoundingClientRect().top;
      const last = groups[groups.length - 1];
      if (last && Math.abs(top - last.top) <= TOL) {
        last.notes.push(n);
      } else {
        groups.push({ top: top, notes: [n] });
      }
    });

    groups.forEach(function (group) {
      if (group.notes.length < 2) return;
      // Leftmost term keeps the top slot; later terms stack below it.
      group.notes.sort(function (a, b) {
        return a.getBoundingClientRect().left - b.getBoundingClientRect().left;
      });
      group.notes.forEach(function (n, i) {
        if (i > 0) n.style.marginTop = "calc(0.3rem + " + i * STEP + "rem)";
      });
    });
  }

  restack();
  window.addEventListener("load", restack);
  window.addEventListener("resize", restack);
});

document.addEventListener("DOMContentLoaded", function () {
  const content = document.querySelector(".content main");
  if (!content) return;

  const sidenotes = document.querySelectorAll(".sidenote");
  if (sidenotes.length === 0) return;

  function buildSection() {
    const section = document.createElement("section");
    section.className = "mobile-sidenotes";

    const heading = document.createElement("h6");
    heading.textContent = "Sidenotes";
    section.appendChild(heading);

    const ol = document.createElement("ol");
    sidenotes.forEach(function (sn) {
      const li = document.createElement("li");
      li.innerHTML = sn.innerHTML;
      ol.appendChild(li);
    });
    section.appendChild(ol);
    return section;
  }

  function update() {
    const existing = content.querySelector(".mobile-sidenotes");
    if (window.innerWidth <= 1000) {
      if (!existing) content.appendChild(buildSection());
    } else {
      if (existing) existing.remove();
    }
  }

  update();
  window.addEventListener("resize", update);
});
