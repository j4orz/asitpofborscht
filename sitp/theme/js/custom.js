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
// them in CMU Typewriter. Prose links like [probabilistic logic](...) and code
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
    note.addEventListener("click", function () {
      // Update the URL hash and snap the page to the defnote, like mdbook
      // headers. Clearing the hash first guarantees navigation fires even when
      // the hash already equals this slug.
      history.replaceState(null, "", location.pathname + location.search);
      location.hash = slug;
    });
  });
});

// Keep defnotes from overlapping in the margin. Each .defnote is absolutely
// positioned at the static top of its term's line, so terms that sit on the
// same line — or on close lines with multi-line labels — collide. We sweep the
// notes top-to-bottom and push any note that would overlap the previous one
// down to clear its bottom (plus a gap), using each label's real measured
// height so tall multi-line labels reserve the space they need. Runs on load
// and resize since wrapping changes which terms collide.
document.addEventListener("DOMContentLoaded", function () {
  const defnotes = Array.prototype.slice.call(
    document.querySelectorAll(".defnote")
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
        item.note.style.marginTop = "calc(0.3rem + " + delta + "px)";
      }
      prevBottom = placedTop + item.height;
    });
  }

  restack();
  window.addEventListener("load", restack);
  window.addEventListener("resize", restack);
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

document.addEventListener("DOMContentLoaded", function () {
  const content = document.querySelector(".content main");
  if (!content) return;

  // Exclude notes already relocated into a box footer (rendered there instead).
  const sidenotes = Array.prototype.slice
    .call(document.querySelectorAll(".sidenote"))
    .filter(function (sn) { return !sn.closest(".box-notes"); });
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
