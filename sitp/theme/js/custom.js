document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("code.language-lean").forEach(function (block) {
    if (typeof hljs !== "undefined") hljs.highlightBlock(block);
  });
});

// Custom "> [!QUESTION]" admonition. mdBook's built-in GFM-style alerts only
// recognize NOTE/TIP/IMPORTANT/WARNING/CAUTION (hardcoded in the mdBook
// binary, not configurable from book.toml), so an unrecognized tag like
// [!QUESTION] is left as a plain blockquote with the literal "[!QUESTION]"
// marker as text. This finds that marker, strips it, and rebuilds the same
// `blockquote-tag`/`blockquote-tag-title` markup mdBook emits for its native
// alert types (styled in custom.css), so "pause and think" prompts get their
// own title bar and accent color instead of inheriting [!WARNING]'s.
document.addEventListener("DOMContentLoaded", function () {
  var QUESTION_ICON =
    '<svg viewbox="0 0 16 16" width="18" height="18">' +
    '<path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16z"></path>' +
    '<path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"></path>' +
    "</svg>";

  document.querySelectorAll("blockquote").forEach(function (bq) {
    var p = bq.firstElementChild;
    if (!p || p.tagName !== "P") return;
    var node = p.firstChild;
    if (!node || node.nodeType !== Node.TEXT_NODE) return;
    var m = /^\s*\[!QUESTION\]\s*/.exec(node.textContent);
    if (!m) return;

    node.textContent = node.textContent.slice(m[0].length);
    bq.classList.add("blockquote-tag", "blockquote-tag-question");
    var title = document.createElement("p");
    title.className = "blockquote-tag-title";
    title.innerHTML = QUESTION_ICON + "Question";
    bq.insertBefore(title, p);
  });
});

// Tag links whose visible text IS a bare URL (e.g. wikipedia / SEP / nlab
// references written as [`https://...`](...) or bare autolinks) so CSS can set
// them in New Computer Modern Mono. Prose links like [probabilistic logic](...) and code
// identifiers like `numpy` are untouched — their link text isn't a URL.
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("a[href]").forEach(function (a) {
    if (/^https?:\/\/\S+$/.test(a.textContent.trim())) {
      a.classList.add("url-mono");
    }
  });
});

// Auto-number the definition/theorem/lemma "snackbars" like LaTeX amsthm.
// Terms are only ever defined inside the prelude or an intermezzo, so numbering
// is scoped to each: the prelude is section 0, and the Nth intermezzo (in
// document order) is section N. A single counter — shared across all box types —
// runs through each section. So the Prelude yields "Definition 0.1", "0.2", ...,
// Intermezzo One yields "Definition 1.1", "Theorem 1.2", ..., and Intermezzo Two
// restarts at "Definition 2.1". Sections are detected by a heading whose text
// starts with "Prelude" or "Intermezzo"; non-section headings are ignored
// (numbering runs continuously through a section's subheadings).
// Authoring is unchanged — data-title="Definition: Name" -> "Definition 0.1: Name".
// To number each type separately instead, key `n` by `word` (a per-type map).
document.addEventListener("DOMContentLoaded", function () {
  var BOX = "div.definition, div.theorem, div.lemma";
  var root = document.querySelector(".content") || document.body;
  var section = null; // section prefix: "0" for prelude, "1".. per intermezzo
  var inter = 0;      // intermezzo ordinal (1st intermezzo -> 1)
  var n = 0;          // running counter within the current section
  root.querySelectorAll("h1, h2, h3, h4, " + BOX).forEach(function (el) {
    if (/^H[1-4]$/.test(el.tagName)) {
      if (/^\s*Intermezzo\b/i.test(el.textContent)) { inter += 1; section = String(inter); n = 0; }
      else if (/^\s*Prelude\b/i.test(el.textContent)) { section = "0"; n = 0; }
      return;
    }
    if (el.dataset.numbered) return; // idempotent guard
    n += 1;
    var num = section !== null ? section + "." + n : String(n); // plain fallback outside sections
    var title = (el.getAttribute("data-title") || "").trim();
    var i = title.indexOf(":");
    var word = (i >= 0 ? title.slice(0, i) : title).trim();
    var name = (i >= 0 ? title.slice(i + 1) : "").trim();
    el.setAttribute("data-title", name ? word + " " + num + ": " + name
                                       : word + " " + num);
    el.dataset.numbered = "1";
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
    note.addEventListener("click", function (e) {
      // A refinement ladder (see preprocessors/mdbook-refine) lives inside the
      // note and carries its own links; let those navigate instead of being
      // overwritten by this note's own hash.
      if (e.target.closest(".refine-ladder")) return;
      // Update the URL hash and snap the page to the defnote, like mdbook
      // headers. Clearing the hash first guarantees navigation fires even when
      // the hash already equals this slug.
      history.replaceState(null, "", location.pathname + location.search);
      location.hash = slug;
    });
  });
});

// Keep left-margin notes from overlapping. Each .defnote and .lecnote is
// absolutely positioned at the static top of its term's line, so terms that sit
// on the same line — or on close lines with multi-line labels — collide. We
// sweep the notes top-to-bottom and push any note that would overlap the
// previous one down to clear its bottom (plus a gap), using each label's real
// measured height so tall multi-line labels reserve the space they need. Runs
// on load and resize since wrapping changes which terms collide.
//
// This sweep is also what attaches a lecture to its term. A .lecnote authored
// right after a term's .defnote takes its static position from the same line,
// so the two tie on `top`; the sort below is stable, so document order breaks
// the tie and the lecture lands directly under the label it belongs to. Write
// the lecnote after the defnote and the pairing needs no other machinery.
//
// A .gutter-figure-left is swept too — it is the tallest thing the gutter
// holds, and a term landing on top of a picture is the one collision here that
// cannot be read around. The cost is that notes clearing a tall figure drift
// from the lines of their terms, so hang a figure beside a passage with few
// definitions in it. (The right gutter needs no equivalent: a
// .gutter-figure-right is a float and stacks with the sidenotes by itself.)
document.addEventListener("DOMContentLoaded", function () {
  const defnotes = Array.prototype.slice.call(
    document.querySelectorAll(".defnote, .lecnote, .gutter-figure-left")
  );
  if (defnotes.length === 0) return;

  const GAP = 8; // px of breathing room between stacked notes

  function restack() {
    // Reset to CSS base (0.3rem) so measurements reflect natural positions.
    defnotes.forEach(function (n) {
      n.style.marginTop = "";
    });

    // Skip hidden notes (mobile collapses .defnote to display:none).
    const visible = defnotes.filter(function (n) {
      return n.offsetParent !== null;
    });

    // Snapshot each note's natural geometry before mutating any margins, so
    // heights reflect the label's own size and tops reflect flow position.
    const items = visible.map(function (n) {
      const rect = n.getBoundingClientRect();
      return { note: n, top: rect.top, height: rect.height };
    });
    items.sort(function (a, b) {
      return a.top - b.top;
    });

    // Greedy sweep: each note starts at its natural top unless that would
    // overlap the note above, in which case it drops to that note's bottom.
    let prevBottom = -Infinity;
    items.forEach(function (item) {
      const placedTop = Math.max(item.top, prevBottom + GAP);
      const delta = placedTop - item.top;
      if (delta > 0.5) {
        item.note.style.marginTop =
          "calc(0.3rem - var(--margin-note-raise, 0px) + " + delta + "px)";
      }
      prevBottom = placedTop + item.height;
    });
  }

  restack();
  window.addEventListener("load", restack);
  window.addEventListener("resize", restack);

  // Embedded content — tweet iframes above all, but also images and KaTeX —
  // finishes rendering after both of those events, and a note that measured
  // ~100px as a placeholder ends up ~900px tall once the widget swaps in. The
  // sweep above has already committed its margins by then, so the stack
  // overlaps. Re-sweep whenever a note's own box changes size. No feedback
  // loop: restack only writes margin-top, which is outside the border box
  // ResizeObserver reports on.
  if (typeof ResizeObserver === "function") {
    let pending = false;
    const observer = new ResizeObserver(function () {
      if (pending) return;
      pending = true;
      requestAnimationFrame(function () {
        pending = false;
        restack();
      });
    });
    defnotes.forEach(function (n) {
      observer.observe(n);
    });
  }
});

// Inside a definition/theorem/lemma "snackbar", render sidenotes as footnotes at
// the bottom of the box instead of in the page margin. Each .sidenote is moved
// into a .box-notes footer, and its marker number is FROZEN into data-n — the
// live CSS counter would misnumber once the note leaves document order. Runs
// before the mobile-sidenotes block below so those notes are excluded there.
document.addEventListener("DOMContentLoaded", function () {
  // number every marker by document order, matching the CSS sidenote-counter
  var order = new Map();
  document.querySelectorAll(".content .sidenote-number").forEach(function (m, i) {
    order.set(m, i + 1);
  });
  document
    .querySelectorAll("div.definition, div.theorem, div.lemma")
    .forEach(function (box) {
      var notes = box.querySelectorAll(".sidenote");
      if (!notes.length) return;
      var footer = document.createElement("div");
      footer.className = "box-notes";
      notes.forEach(function (note) {
        var marker = note.previousElementSibling;
        note.setAttribute("data-n", order.has(marker) ? order.get(marker) : "");
        footer.appendChild(note); // moves the note out of the paragraph
      });
      box.appendChild(footer);
    });
});

// Hover previews for library documentation links. These sites publish
// Sphinx-generated pages, so on hover we fetch the target page, pull out just
// the object's signature + one-line summary, and float them in a small popup —
// no iframe, no build step. Results are cached per URL, and a hover-intent
// delay keeps incidental mouse passes from firing fetches.
//
// SITES lists what to preview and how to reach it. numpy.org serves
// `access-control-allow-origin: *`, so its pages are readable cross-origin and
// are fetched directly. matplotlib.org sends no CORS header at all, so a direct
// read is blocked by the browser; its fetches are rewritten onto this site's own
// origin, where the /docs-proxy/ rule in netlify.toml forwards them upstream.
// The links themselves are never rewritten — clicking still goes to the real
// docs, and the proxy only ever carries these previews. (The proxy is a Netlify
// rule, so under a local `mdbook serve` the matplotlib fetch 404s and the popup
// falls back to "Preview unavailable"; numpy previews still work locally.)
//
// To add another pydata-Sphinx site (scipy, pandas), add a SITES entry — the
// extraction below keys off the `dt[id]` / `dd` structure every such page shares
// — and check whether it needs a proxy: `curl -sI <page> | grep -i access-control`.
//
// A finger has no hover, so on touch the same popup is driven by taps instead:
// the first tap on a link peeks (its navigation is cancelled), a second tap on
// the link or on the popup follows through to the docs, and a tap anywhere else
// dismisses. Which mode is live is asked per event rather than once at load, so
// an iPad that acquires a trackpad — or a laptop whose reader is using the
// touchscreen — is never stuck with the wrong one.
document.addEventListener("DOMContentLoaded", function () {
  var SITES = [
    { match: 'a[href*="numpy.org/doc"]', proxy: null },
    {
      match: 'a[href*="matplotlib.org/"]',
      proxy: { from: /^https?:\/\/matplotlib\.org\//, to: "/docs-proxy/matplotlib/" },
    },
  ];

  var links = document.querySelectorAll(
    SITES.map(function (s) {
      return s.match;
    }).join(", ")
  );
  if (links.length === 0) return;

  // Where to actually fetch a link's page from: itself, unless its site needs
  // the same-origin proxy to get past a missing CORS header.
  function fetchUrl(href) {
    for (var i = 0; i < SITES.length; i++) {
      var p = SITES[i].proxy;
      if (p && p.from.test(href)) return href.replace(p.from, p.to);
    }
    return href;
  }

  var HOVER_DELAY = 250; // ms of hover intent before fetching
  var HIDE_DELAY = 160;  // ms grace so the cursor can travel link -> popup
  var cache = new Map(); // href -> Promise<{sig, summary}>
  var pop = null;        // single shared popup element
  var anchor = null;     // link the popup currently belongs to
  var peeked = null;     // link whose peek a tap has already paid for (touch)
  var showTimer = null;
  var hideTimer = null;

  // True where there is no pointer to hover with. The mouse listeners below
  // stand down in that mode: iOS Safari synthesizes a mouseover/mouseout pair
  // around every tap, and letting both paths drive one popup makes the peek
  // open and close on the same tap.
  function touch() {
    return window.matchMedia("(hover: none)").matches;
  }

  // The anchor a doc page hangs its content on: numpy.argsort.html documents
  // the id "numpy.argsort". Prefer an explicit #fragment when the link has one.
  function targetId(href) {
    try {
      var u = new URL(href, location.href);
      if (u.hash) return decodeURIComponent(u.hash.slice(1));
      var last = u.pathname.split("/").pop() || "";
      return last.replace(/\.html?$/, "");
    } catch (e) {
      return "";
    }
  }

  // Text of a node minus Sphinx's "¶" headerlink anchors, whitespace-collapsed.
  function cleanText(node) {
    var c = node.cloneNode(true);
    // Drop Sphinx chrome: the "¶" headerlink and the "[source]" viewcode link.
    c.querySelectorAll(".headerlink, .viewcode-link").forEach(function (x) {
      x.remove();
    });
    return c.textContent
      .replace(/¶/g, "")
      .replace(/\[source\]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function extract(doc, href) {
    var id = targetId(href);
    var dt = id ? doc.getElementById(id) : null;
    var sig, summary;
    if (dt && dt.tagName === "DT") {
      // The signature <dt> and its description <dd> are siblings under one <dl>.
      sig = cleanText(dt);
      var dl = dt.closest("dl");
      var dd = dl ? dl.querySelector(":scope > dd") : null;
      var p = dd ? dd.querySelector(":scope > p") : null;
      if (p) summary = cleanText(p);
    }
    if (!sig) {
      // Fallback for pages without a single documented object (e.g. topic pages).
      var h1 = doc.querySelector("h1");
      if (h1) sig = cleanText(h1);
      var mp = doc.querySelector("main p, [role=main] p, .body p, article p");
      if (mp) summary = cleanText(mp);
    }
    return { sig: sig || "", summary: summary || "" };
  }

  function load(href) {
    if (cache.has(href)) return cache.get(href);
    var p = fetch(fetchUrl(href), { credentials: "omit" })
      .then(function (r) {
        if (!r.ok) throw new Error(r.status);
        return r.text();
      })
      .then(function (html) {
        return extract(new DOMParser().parseFromString(html, "text/html"), href);
      });
    cache.set(href, p);
    return p;
  }

  function ensurePop() {
    if (pop) return pop;
    pop = document.createElement("div");
    pop.className = "doc-preview";
    pop.setAttribute("role", "tooltip");
    // Staying over the popup keeps it open; leaving it dismisses.
    pop.addEventListener("mouseenter", function () {
      if (touch()) return;
      clearTimeout(hideTimer);
    });
    pop.addEventListener("mouseleave", function () {
      if (touch()) return;
      scheduleHide();
    });
    // Under tap-to-peek the popup is the second half of the link: tapping it is
    // the same "yes, take me there" as tapping the link again.
    pop.addEventListener("click", function () {
      if (touch() && anchor) window.location.href = anchor.href;
    });
    document.body.appendChild(pop);
    return pop;
  }

  // Place the popup under the link, flipping above when it would overflow the
  // bottom, and clamp horizontally so it never leaves the viewport. Uses fixed
  // positioning off the link's viewport rect.
  function position() {
    if (!anchor || !pop) return;
    var r = anchor.getBoundingClientRect();
    pop.style.visibility = "hidden";
    pop.style.display = "block";
    var pr = pop.getBoundingClientRect();
    var m = 8;
    var left = Math.min(Math.max(m, r.left), window.innerWidth - pr.width - m);
    var top = r.bottom + 6;
    if (top + pr.height > window.innerHeight - m && r.top - pr.height - 6 > m) {
      top = r.top - pr.height - 6;
    }
    pop.style.left = Math.max(m, left) + "px";
    pop.style.top = top + "px";
    pop.style.visibility = "";
    pop.style.display = "";
  }

  function fill(html) {
    ensurePop().innerHTML = html;
  }

  function render(data, href) {
    // Always the link's own host, never the proxy path the fetch went through.
    var host;
    try {
      host = new URL(href, location.href).host;
    } catch (e) {
      host = "";
    }
    var parts = [];
    if (data.sig) parts.push('<div class="doc-preview-sig"></div>');
    if (data.summary) parts.push('<p class="doc-preview-summary"></p>');
    parts.push('<div class="doc-preview-src"></div>');
    fill(parts.join(""));
    // Assign as text (not HTML) so page content can't inject markup.
    if (data.sig) pop.querySelector(".doc-preview-sig").textContent = data.sig;
    if (data.summary)
      pop.querySelector(".doc-preview-summary").textContent = data.summary;
    pop.querySelector(".doc-preview-src").textContent = host;
  }

  function show(a) {
    anchor = a;
    var href = a.href;
    ensurePop();
    fill('<div class="doc-preview-loading">Loading…</div>');
    pop.classList.add("visible");
    position();
    load(href)
      .then(function (data) {
        if (anchor !== a) return; // hovered elsewhere meanwhile
        if (!data.sig && !data.summary) {
          fill('<div class="doc-preview-loading">' + a.textContent + "</div>");
        } else {
          render(data, href);
        }
        position();
      })
      .catch(function () {
        if (anchor !== a) return;
        fill('<div class="doc-preview-loading">Preview unavailable</div>');
        position();
      });
  }

  function scheduleHide() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(function () {
      if (pop) pop.classList.remove("visible");
      anchor = null;
      // Dismissed, so the next tap on that link is peeking again rather than
      // cashing in a peek the reader has already dismissed unread.
      peeked = null;
    }, HIDE_DELAY);
  }

  links.forEach(function (a) {
    a.addEventListener("mouseenter", function () {
      if (touch()) return;
      clearTimeout(hideTimer);
      clearTimeout(showTimer);
      showTimer = setTimeout(function () {
        show(a);
      }, HOVER_DELAY);
    });
    a.addEventListener("mouseleave", function () {
      if (touch()) return;
      clearTimeout(showTimer);
      scheduleHide();
    });
    // Keyboard/assistive parity: focusing the link previews immediately.
    a.addEventListener("focus", function () {
      clearTimeout(hideTimer);
      show(a);
    });
    a.addEventListener("blur", scheduleHide);
    // Tap to peek, tap again to go. The peek is only worth a stolen tap while
    // it is the thing the reader has not seen yet; once this link has spent one
    // the tap belongs to the link again.
    //
    // What is remembered is the tap, not whether the popup happens to be up: a
    // tap focuses the link before it clicks it, so the `focus` handler above has
    // already opened this very popup by the time the click arrives. Reading the
    // popup's state here would see the peek the tap itself caused and wave the
    // first tap straight through to numpy.
    a.addEventListener("click", function (e) {
      if (!touch() || peeked === a) return;
      e.preventDefault();
      peeked = a;
      clearTimeout(hideTimer);
      clearTimeout(showTimer);
      show(a);
    });
  });

  // Anything that moves the anchor out from under the popup dismisses it.
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") scheduleHide();
  });
  // Touch's stand-in for "the pointer left": a tap that landed on neither the
  // popup nor the link it belongs to. Runs after the handlers above, so the
  // second tap on a link has already claimed its own event.
  document.addEventListener("click", function (e) {
    if (!touch() || !pop || !pop.classList.contains("visible")) return;
    if (pop.contains(e.target)) return;
    if (e.target.closest && e.target.closest("a") === anchor) return;
    scheduleHide();
  });
  window.addEventListener(
    "scroll",
    function () {
      if (pop && pop.classList.contains("visible")) scheduleHide();
    },
    true
  );
});

document.addEventListener("DOMContentLoaded", function () {
  const content = document.querySelector(".content main");
  if (!content) return;

  // Exclude notes already relocated into a box footer (rendered there instead).
  const sidenotes = Array.prototype.slice
    .call(document.querySelectorAll(".sidenote"))
    .filter(function (sn) { return !sn.closest(".box-notes"); });
  // Lectures hang in the left gutter, which mobile does not have. A .defnote
  // may simply disappear there — it only repeats a term that is already inline
  // in the sentence — but a lecture link is content with nowhere else to be, so
  // it lands here instead. Its own list, not the sidenotes' <ol>: a lecture
  // carries no marker in the text, and numbering it would walk that list out of
  // step with the .sidenote-number markers the reader is actually tapping.
  const lecnotes = Array.prototype.slice.call(
    document.querySelectorAll(".lecnote")
  );
  if (sidenotes.length === 0 && lecnotes.length === 0) return;

  function buildList(tag, notes) {
    const list = document.createElement(tag);
    notes.forEach(function (n) {
      const li = document.createElement("li");
      li.innerHTML = n.innerHTML;
      list.appendChild(li);
    });
    return list;
  }

  function buildSection() {
    const section = document.createElement("section");
    section.className = "mobile-sidenotes";

    function addBlock(title, tag, notes) {
      if (notes.length === 0) return;
      const heading = document.createElement("h6");
      heading.textContent = title;
      section.appendChild(heading);
      section.appendChild(buildList(tag, notes));
    }

    addBlock("Sidenotes", "ol", sidenotes);
    addBlock("Lectures", "ul", lecnotes);
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

// Video gallery (`.video-row` in the Markdown, holding bare <iframe>s): one
// video on stage, the rest in a rail beside it, and clicking a rail video swaps
// it onto the stage. All of the layout is in custom.css and keys off
// `.is-active` on the chosen cell, so nothing here moves an iframe: re-parenting
// one reloads it, which would restart whatever the reader had playing — the
// video a reader steps away from keeps its place when it drops into the rail.
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".video-row").forEach(function (row) {
    // Authoring stays "some iframes in a div" — wrap each one here so the click
    // overlay has a box to share. This is the one re-parent we do, and it
    // happens before first paint on lazy iframes, so nothing is loaded yet to be
    // thrown away.
    row.querySelectorAll(":scope > iframe").forEach(function (frame) {
      var cell = document.createElement("div");
      cell.className = "video-cell";
      row.insertBefore(cell, frame);
      cell.appendChild(frame);
    });

    var cells = Array.prototype.slice.call(
      row.querySelectorAll(":scope > .video-cell")
    );
    if (cells.length === 0) return;

    // The rail holds every video except the one on stage, and CSS cannot count
    // children — hand it the row count.
    row.style.setProperty("--rail-rows", String(Math.max(1, cells.length - 1)));

    function select(index) {
      cells.forEach(function (cell, i) {
        var active = i === index;
        cell.classList.toggle("is-active", active);
        var toggle = cell.querySelector(":scope > .video-cell-toggle");
        toggle.setAttribute("aria-pressed", String(active));
        toggle.setAttribute(
          "aria-label",
          active ? "Playing on the main stage" : "Move this video to the main stage"
        );
      });
    }

    cells.forEach(function (cell, i) {
      var toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "video-cell-toggle";
      cell.appendChild(toggle);
      toggle.addEventListener("click", function () {
        select(i);
      });
    });

    select(0); // the first video in source order opens on stage
  });
});

// Color-key toggle (the droplet in the menu bar). The `.okabe-*` classes in
// custom.css — used both by prose ("the orange output ...") and by the
// \cin/\cparam/\cfun/\cout macros inside KaTeX — all resolve their color
// through `--okabe-*` variables, so turning the key off is one CSS rule that
// remaps those variables to `inherit`. Nothing needs to know where the colored
// spans are. The preference is per-reader and sticky, mirroring mdBook's own
// theme/sidebar handling; `data-colorkey` is set in index.hbs before first
// paint, so this only wires up the click and keeps the button's state in sync.
document.addEventListener("DOMContentLoaded", function () {
  const button = document.getElementById("colorkey-toggle");
  if (!button) return;
  const html = document.documentElement;

  function sync() {
    const on = html.dataset.colorkey !== "off";
    button.setAttribute("aria-pressed", String(on));
    button.title = on ? "Turn off color coding" : "Turn on color coding";
  }

  button.addEventListener("click", function () {
    const off = html.dataset.colorkey === "off";
    html.dataset.colorkey = off ? "on" : "off";
    try {
      localStorage.setItem("sitp-colorkey", html.dataset.colorkey);
    } catch (e) {}
    sync();
  });

  sync();
});

// Carry each subchapter's "In which ..." blurb into its expanded contents panel
// (the third TOC level; see `.toc ul ul ul` in custom.css), so opening an entry
// — by hover with a pointer, by tap on touch — previews what the section is
// about and not just how it is cut up.
// The blurb is borrowed from the blockquote under the section's own heading
// rather than written a second time into the TOC: the two copies would drift
// apart the moment the prose is rewritten, and these blurbs are still being
// written. Every entry in this TOC points at a heading on this same page, so
// the source is one getElementById away; when it isn't there (a stub link, a
// section that has no blurb yet) the panel simply stays a list.
document.addEventListener("DOMContentLoaded", function () {
  const panels = document.querySelectorAll(".toc ul ul ul");
  if (panels.length === 0) return;

  panels.forEach(function (panel) {
    const link = panel.parentElement.querySelector(":scope > a");
    if (!link) return;

    const href = link.getAttribute("href") || "";
    if (href.charAt(0) !== "#" || href.length < 2) return;

    let heading;
    try {
      heading = document.getElementById(decodeURIComponent(href.slice(1)));
    } catch (e) {
      return; // malformed percent-encoding in the href
    }
    if (!heading) return;

    // Walk forward from the heading to its blurb: an mdbook `<small>` back-link
    // to the contents sits in between. Stop at the next heading so a section
    // written without a blurb doesn't borrow the following section's.
    let blurb = null;
    for (let el = heading.nextElementSibling; el; el = el.nextElementSibling) {
      if (/^H[1-6]$/.test(el.tagName)) break;
      if (el.tagName === "BLOCKQUOTE") {
        blurb = el;
        break;
      }
    }
    if (!blurb) return;

    // The preview keeps the blurb's markup rather than flattening it to text.
    // KaTeX builds a formula out of ordinary characters wearing font classes —
    // `\mathscr{L}` is a plain "L" under `.mathscr` — so reading the subtree as
    // text silently demotes every formula to bare letters in the body face.
    // (mdbook-katex here emits HTML-only KaTeX, no MathML twin, so there is no
    // second copy of a formula to strip on the way through.)
    //
    // Cloning does mean minding what the listeners above have already annotated:
    // defnotes have been slugged and sidenote markers numbered by document
    // order, and a second copy of either would duplicate an id or shift the
    // margin numbering. The margin apparatus is dropped outright — a floating
    // panel has no margin to hold it, and the .defnote span only ever repeats a
    // term that is already inline in the sentence — and any id that survives
    // that is stripped.
    const source = blurb.cloneNode(true);
    source
      .querySelectorAll(".defnote, .lecnote, .sidenote, .sidenote-number")
      .forEach(function (n) {
        n.remove();
      });
    source.querySelectorAll("[id]").forEach(function (n) {
      n.removeAttribute("id");
    });

    // An <li>, because a <ul> may not hold the blurb's bare <p>.
    const note = document.createElement("li");
    note.className = "toc-blurb";
    note.innerHTML = source.innerHTML.trim();
    panel.insertBefore(note, panel.firstChild);
  });
});

// The touch half of the TOC's third level. Hover opens those panels for a
// pointer; a finger has none, and the fallback used to be to give up and print
// every subsection at once — which turns a nine-line outline into a fifty-line
// one, i.e. exactly the thing the compact TOC exists to avoid. So each entry
// that has an expansion gets a real button beside it and the panels start
// closed, the reader opening the one they are actually deciding about.
//
// The button is a sibling of the link rather than something inside it, because
// the entry is still a link first: tapping the words navigates, and only the ▾
// toggles. It is built on every device and revealed by CSS under
// `@media (hover: none)` alone, so a pointer reader never sees a control they
// have no use for, and an iPad that acquires a trackpad crosses between the two
// behaviors without a reload (the panels' CSS answers the same media query).
document.addEventListener("DOMContentLoaded", function () {
  const items = document.querySelectorAll(".toc ul ul > li");
  let n = 0;

  items.forEach(function (li) {
    const panel = li.querySelector(":scope > ul");
    const link = li.querySelector(":scope > a");
    if (!panel || !link) return;

    if (!panel.id) panel.id = "toc-panel-" + ++n;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "toc-toggle";
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", panel.id);
    // The ▾ itself is CSS content, so it stays out of the accessible name.
    button.setAttribute(
      "aria-label",
      "Contents of " + link.textContent.trim()
    );

    button.addEventListener("click", function () {
      const open = li.hasAttribute("data-toc-open");
      if (open) li.removeAttribute("data-toc-open");
      else li.setAttribute("data-toc-open", "");
      button.setAttribute("aria-expanded", String(!open));
    });

    link.insertAdjacentElement("afterend", button);
  });
});
