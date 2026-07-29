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

// Hover previews for numpy documentation links. numpy.org/doc/ serves its
// Sphinx-generated pages with `access-control-allow-origin: *` and no
// X-Frame-Options, so on hover we can fetch the target page cross-origin,
// pull out just the function signature + one-line summary, and float them in a
// small popup — no iframe, no server, no build step. Results are cached per URL,
// and a hover-intent delay keeps incidental mouse passes from firing fetches.
// To extend to other pydata-Sphinx sites (scipy, pandas), widen NP_MATCH — the
// extraction below keys off the `dt[id]` / `dd` structure every such page shares.
document.addEventListener("DOMContentLoaded", function () {
  var NP_MATCH = 'a[href*="numpy.org/doc"]';
  var links = document.querySelectorAll(NP_MATCH);
  if (links.length === 0) return;

  var HOVER_DELAY = 250; // ms of hover intent before fetching
  var HIDE_DELAY = 160;  // ms grace so the cursor can travel link -> popup
  var cache = new Map(); // href -> Promise<{sig, summary}>
  var pop = null;        // single shared popup element
  var anchor = null;     // link the popup currently belongs to
  var showTimer = null;
  var hideTimer = null;

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
    var p = fetch(href, { credentials: "omit" })
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
    pop.className = "np-preview";
    pop.setAttribute("role", "tooltip");
    // Staying over the popup keeps it open; leaving it dismisses.
    pop.addEventListener("mouseenter", function () {
      clearTimeout(hideTimer);
    });
    pop.addEventListener("mouseleave", scheduleHide);
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
    var host;
    try {
      host = new URL(href, location.href).host;
    } catch (e) {
      host = "numpy.org";
    }
    var parts = [];
    if (data.sig) parts.push('<div class="np-preview-sig"></div>');
    if (data.summary) parts.push('<p class="np-preview-summary"></p>');
    parts.push('<div class="np-preview-src"></div>');
    fill(parts.join(""));
    // Assign as text (not HTML) so page content can't inject markup.
    if (data.sig) pop.querySelector(".np-preview-sig").textContent = data.sig;
    if (data.summary)
      pop.querySelector(".np-preview-summary").textContent = data.summary;
    pop.querySelector(".np-preview-src").textContent = host;
  }

  function show(a) {
    anchor = a;
    var href = a.href;
    ensurePop();
    fill('<div class="np-preview-loading">Loading…</div>');
    pop.classList.add("visible");
    position();
    load(href)
      .then(function (data) {
        if (anchor !== a) return; // hovered elsewhere meanwhile
        if (!data.sig && !data.summary) {
          fill('<div class="np-preview-loading">' + a.textContent + "</div>");
        } else {
          render(data, href);
        }
        position();
      })
      .catch(function () {
        if (anchor !== a) return;
        fill('<div class="np-preview-loading">Preview unavailable</div>');
        position();
      });
  }

  function scheduleHide() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(function () {
      if (pop) pop.classList.remove("visible");
      anchor = null;
    }, HIDE_DELAY);
  }

  links.forEach(function (a) {
    a.addEventListener("mouseenter", function () {
      clearTimeout(hideTimer);
      clearTimeout(showTimer);
      showTimer = setTimeout(function () {
        show(a);
      }, HOVER_DELAY);
    });
    a.addEventListener("mouseleave", function () {
      clearTimeout(showTimer);
      scheduleHide();
    });
    // Keyboard/assistive parity: focusing the link previews immediately.
    a.addEventListener("focus", function () {
      clearTimeout(hideTimer);
      show(a);
    });
    a.addEventListener("blur", scheduleHide);
  });

  // Anything that moves the anchor out from under the popup dismisses it.
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") scheduleHide();
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
