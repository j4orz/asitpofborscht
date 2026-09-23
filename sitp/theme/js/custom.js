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
//
// Takes the document to number rather than assuming the page's own, and is
// exposed, because these numbers exist only at runtime: no build step writes
// them into the HTML. The cross-reference previews further down fetch *other*
// chapters as bare documents, and a box quoted out of one has to carry the
// number the reader will see when they arrive.
window.sitpNumberBoxes = function (doc) {
  var BOX = "div.definition, div.theorem, div.lemma";
  var root = doc.querySelector(".content") || doc.body || doc;
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
};

document.addEventListener("DOMContentLoaded", function () {
  window.sitpNumberBoxes(document);
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
// A `.defnote-embed` sits this out: it repeats no term, so its slug would be a
// whole quotation, and the hijacked click would swallow taps on the links the
// embed's own fallback markup carries before the widget swaps itself in.
//
// The id-assigning half takes a document and is exposed, for the same reason
// `sitpNumberBoxes` above is: nothing in the build writes these ids, so a
// chapter fetched for a cross-reference preview has none until this is run over
// it, and a link like `#vector` cannot be resolved inside it.
window.sitpDefnoteIds = function (doc) {
  function slugify(text) {
    return text
      .trim()
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  }

  const seen = Object.create(null);
  doc.querySelectorAll(".defnote:not(.defnote-embed)").forEach(function (note) {
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
  });
};

document.addEventListener("DOMContentLoaded", function () {
  window.sitpDefnoteIds(document);
  document.querySelectorAll(".defnote-link").forEach(function (note) {
    note.addEventListener("click", function (e) {
      // A refinement ladder (see preprocessors/mdbook-refine) lives inside the
      // note and carries its own links; let those navigate instead of being
      // overwritten by this note's own hash.
      if (e.target.closest(".refine-ladder")) return;
      // Update the URL hash and snap the page to the defnote, like mdbook
      // headers. Clearing the hash first guarantees navigation fires even when
      // the hash already equals this slug.
      history.replaceState(null, "", location.pathname + location.search);
      location.hash = note.id;
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
// A .cppnote is absolutely positioned in this same gutter, so it joins the
// sweep for the same reason a .lecnote does — and gains the same pairing for
// free: one written right after a term's defnote ties with it on `top` and the
// stable sort drops it directly under that label.
document.addEventListener("DOMContentLoaded", function () {
  const defnotes = Array.prototype.slice.call(
    document.querySelectorAll(".defnote, .lecnote, .cppnote")
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

// ===========================================================================
// Hover previews. Two kinds of link get a peek before the reader commits to
// the jump, and both are the same popup, the same hover-intent delay and the
// same touch model; they differ only in where the content comes from, which is
// all the two PROVIDERS below define.
//
//   docs — links into library documentation (numpy, matplotlib). Those sites
//          publish Sphinx-generated pages, so on hover we fetch the target
//          page, pull out just the object's signature + one-line summary, and
//          float them in the popup — no iframe, no build step.
//
//   xref — links into the book itself: "see §1.3.1", a chapter link, a
//          refinement dot. The target is one of our own pages, so rather than
//          summarize it we clone the very block the anchor lands on — math,
//          emphasis, inline icons and all — and show that. A cross-reference
//          then costs a glance instead of a jump, and the reader who does jump
//          knows what they are jumping to.
//
// Results are cached (per URL for docs, per parsed page for xrefs) and a
// hover-intent delay keeps incidental mouse passes from firing fetches.
//
// A finger has no hover, so on touch the popup is driven by taps instead: the
// first tap on a link peeks (its navigation is cancelled), a second tap on the
// link or on the popup follows through, and a tap anywhere else dismisses.
// Which mode is live is asked per event rather than once at load, so an iPad
// that acquires a trackpad — or a laptop whose reader is using the touchscreen
// — is never stuck with the wrong one.
//
// Styling for both lives in theme/css/custom.css (`.doc-preview*`).
// ===========================================================================
document.addEventListener("DOMContentLoaded", function () {
  var HOVER_DELAY = 250; // ms of hover intent before fetching
  var HIDE_DELAY = 160;  // ms grace so the cursor can travel link -> popup

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
    // the same "yes, take me there" as tapping the link again. An xref preview
    // quotes real prose, so it can carry links of its own — those are the
    // reader's to follow, and are left alone.
    pop.addEventListener("click", function (e) {
      if (e.target.closest("a")) return;
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

  // The popup's one-line states: "Loading…", "Preview unavailable", or a link's
  // own text when its target turned out to hold nothing worth quoting. Assigned
  // as text, never as HTML — some of it comes from a fetched page.
  function message(p, text) {
    p.replaceChildren();
    var d = document.createElement("div");
    d.className = "doc-preview-loading";
    d.textContent = text;
    p.appendChild(d);
  }

  function show(a) {
    anchor = a;
    var provider = a.__peek;
    var p = ensurePop();
    p.className = "doc-preview " + provider.cls;

    function done(data) {
      if (anchor !== a) return; // hovered elsewhere meanwhile
      if (!data) {
        message(p, "Preview unavailable");
      } else {
        provider.fill(p, a, data);
      }
      p.classList.add("visible");
      position();
    }
    function failed() {
      if (anchor !== a) return;
      message(p, "Preview unavailable");
      p.classList.add("visible");
      position();
    }

    var data;
    try {
      data = provider.load(a);
    } catch (e) {
      failed();
      return;
    }
    if (data && typeof data.then === "function") {
      // Only a fetch is slow enough to be worth a "Loading…" frame; a preview
      // taken from the page the reader is already on is in hand already.
      message(p, "Loading…");
      p.classList.add("visible");
      position();
      data.then(done, failed);
    } else {
      done(data);
    }
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

  /* -- provider: library documentation links ------------------------------- */
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
  var docs = (function () {
    var SITES = [
      { match: 'a[href*="numpy.org/doc"]', proxy: null },
      {
        match: 'a[href*="matplotlib.org/"]',
        proxy: { from: /^https?:\/\/matplotlib\.org\//, to: "/docs-proxy/matplotlib/" },
      },
    ];

    var cache = new Map(); // href -> Promise<{sig, summary}>

    // Where to actually fetch a link's page from: itself, unless its site needs
    // the same-origin proxy to get past a missing CORS header.
    function fetchUrl(href) {
      for (var i = 0; i < SITES.length; i++) {
        var p = SITES[i].proxy;
        if (p && p.from.test(href)) return href.replace(p.from, p.to);
      }
      return href;
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

    return {
      cls: "doc-preview-docs",

      links: function () {
        return document.querySelectorAll(
          SITES.map(function (s) {
            return s.match;
          }).join(", ")
        );
      },

      load: function (a) {
        var href = a.href;
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
      },

      fill: function (p, a, data) {
        if (!data.sig && !data.summary) {
          message(p, a.textContent);
          return;
        }
        // Always the link's own host, never the proxy path the fetch went through.
        var host;
        try {
          host = new URL(a.href, location.href).host;
        } catch (e) {
          host = "";
        }
        p.replaceChildren();
        // Assigned as text (not HTML) so a fetched page can't inject markup.
        if (data.sig) {
          var sig = document.createElement("div");
          sig.className = "doc-preview-sig";
          sig.textContent = data.sig;
          p.appendChild(sig);
        }
        if (data.summary) {
          var sum = document.createElement("p");
          sum.className = "doc-preview-summary";
          sum.textContent = data.summary;
          p.appendChild(sum);
        }
        var src = document.createElement("div");
        src.className = "doc-preview-src";
        src.textContent = host;
        p.appendChild(src);
      },
    };
  })();

  /* -- provider: cross-references inside the book -------------------------- */
  // A link is a cross-reference when it resolves to a fragment of this page or
  // to another chapter of this book. Its anchor comes in one of three shapes,
  // and each wants a different slice of the target:
  //
  //   a heading (#13-parameterizing-classification-...) — the section: the
  //        heading itself, then the blocks of prose under it.
  //   a box — the `.definition`/`.theorem` itself, quoted whole, since it
  //        already draws its own numbered title bar.
  //   anything else — a defnote slug (#vector), a refinement rung
  //        (#refine-vector-2) — the sentence the term sits in, titled by the
  //        section it belongs to, with the term marked so the reader can see
  //        what they were sent to look at.
  //
  // Whichever shape it is, the card is a window onto the chapter rather than a
  // fragment cut out of it: it takes the blocks either side of the quote as
  // well, through the heading above and the one below and the ones past those,
  // and it scrolls both ways. It opens scrolled to the quote, with the tail of
  // the block before it showing above and fading up into the card's edge — the
  // page the reader would be arriving out of — so that a peek lands somewhere
  // in a chapter instead of arriving out of nowhere, and a reader who wants the
  // sentence before the one they were sent to has it without leaving the page.
  // A peek is what the card opens on; how far it goes from there, and which
  // way, is the reader's to decide, and the ones who decide to keep going never
  // have to leave the page they are on to do it.
  //
  // A link into another chapter fetches it once and keeps the parsed document,
  // so it costs one round trip per chapter per session rather than one per
  // hover, and re-runs the two runtime passes (box numbers, defnote ids) over
  // it so that its anchors resolve and its boxes are numbered as they will be
  // on arrival.
  var xref = (function () {
    var HERE = location.pathname;
    var pages = Object.create(null); // pathname -> Document | Promise<Document>

    // Margin apparatus and heavy embeds. All of it is positioned against the
    // page — the gutter, the notebook column — so it has nowhere to go in a
    // card, and the note the reader is being shown often *is* one of them.
    var STRIP =
      ".defnote, .lecnote, .cppnote, .sidenote, .sidenote-number, .refine-ladder," +
      " .quiz, .nb-cell, .mobile-only, script, iframe, video, audio," +
      // mdBook hangs copy/run buttons off every code block at load. They act on
      // the page's own block, and a card is a quotation of one.
      " pre > .buttons";
    // What counts as prose worth quoting (see `quotable` for the rest).
    var PROSE = /^(P|UL|OL|BLOCKQUOTE|DL)$/;
    var HEADING = /^H[1-6]$/;
    var BOX = ".definition, .theorem, .lemma, .example";
    // How far a card will read out from the block it was opened for, in each
    // direction. Not a measure of the card, which is a fixed 16em and scrolls: a
    // measure of how much of a chapter is worth carrying into one, past which
    // the reader who is still going wants the chapter itself and the link is
    // right there.
    var MAX_BLOCKS = 40;
    var MAX_CHARS = 8000;

    // {path, id, cross, url} for a link into the book, or null for anything else.
    function where(a) {
      // A placeholder link ([text]() — a forward reference not yet written) has
      // nothing to preview, and a heading's own "¶" link points at itself.
      if (!a.getAttribute("href")) return null;
      if (a.classList.contains("header")) return null;
      var u;
      try {
        u = new URL(a.href, location.href);
      } catch (e) {
        return null;
      }
      if (u.origin !== location.origin) return null;
      if (u.pathname !== HERE && !/\.html$/.test(u.pathname)) return null;
      var id = u.hash ? decodeURIComponent(u.hash.slice(1)) : "";
      if (u.pathname === HERE && !id) return null; // "back to the top of this page"
      return { path: u.pathname, id: id, cross: u.pathname !== HERE, url: u.href };
    }

    function page(path) {
      if (path === HERE) return document;
      if (pages[path]) return pages[path];
      var p = fetch(path, { credentials: "omit" })
        .then(function (r) {
          if (!r.ok) throw new Error(r.status);
          return r.text();
        })
        .then(function (html) {
          var d = new DOMParser().parseFromString(html, "text/html");
          window.sitpNumberBoxes(d);
          window.sitpDefnoteIds(d);
          pages[path] = d; // later hovers into this chapter resolve with no round trip
          return d;
        });
      pages[path] = p;
      return p;
    }

    function text(node) {
      return node ? (node.textContent || "").replace(/\s+/g, " ").trim() : "";
    }

    // Text of the nearest heading above `el`: from the top-level block it sits
    // in (see `outer`), walk back through the siblings.
    function section(el, root) {
      if (!root.contains(el)) return "";
      var node = outer(el, root);
      while (node) {
        if (HEADING.test(node.tagName)) return text(node);
        node = node.previousElementSibling;
      }
      return "";
    }

    // One top-level block as a card would take it, or null for one it won't.
    //
    // A section's opening paragraph is wrapped in a `.dropcap` div carrying its
    // initial; the paragraph inside is ordinary prose and sets as such once
    // quoted out of that wrapper, so that is what comes back for one.
    function quotable(n) {
      var q = n.classList.contains("dropcap") ? n.querySelector("p") : n;
      if (!q) return null;
      // Apparatus with nowhere to stand in a card. STRIP takes these out of a
      // block's insides (see `snippet`); a block that *is* one has nothing left
      // once they are out, so it is dropped whole. A contents list, and the
      // heading over it, say only what the card's own title already says.
      if (q.matches(STRIP) || q.matches(".toc") || isContents(q)) return null;
      // A heading is exempt from the isNav() test below: mdBook wraps every
      // heading's title in its own `.header` anchor, so one looks exactly like
      // a block that is nothing but a link — which is what that test throws
      // out. The test never saw a heading while the walk stopped at them.
      if (HEADING.test(q.tagName)) return q;
      if (PROSE.test(q.tagName) || q.matches(BOX)) return isNav(q) ? null : q;
      // A figure, a table, a code block: not prose, but stepping over one in
      // silence would run together two paragraphs that do not follow each
      // other — and in a book like this one a section can be mostly code, which
      // used to leave its card with nothing to show at all. Kept when a card
      // can show something of it, which an interactive embed cannot be.
      if (q.matches(".table-wrapper") || q.tagName === "PRE") return q;
      if (q.querySelector("img") && !q.querySelector(STRIP)) return q;
      return null;
    }

    // A card's worth of the chapter, taking `step` siblings from `from` until
    // the chapter runs out or the budget above does, whichever comes first.
    //
    // This used to stop at the next heading: a card held a section's opening
    // and no more, because a fixed card was all there was to hold it. A card
    // that scrolls can carry the reader past that boundary, so the walk goes
    // through the headings and takes them along — they are what tells a reader
    // who has scrolled out of the quote that the run has crossed into another
    // section.
    function run(from, step) {
      var out = [];
      var chars = 0;
      for (var n = from; n && out.length < MAX_BLOCKS && chars < MAX_CHARS; n = n[step]) {
        var q = quotable(n);
        if (!q) continue;
        // A prose block whose text is all apparatus has nothing left once that
        // is out (see `snippet`), and an empty paragraph in a card is a gap the
        // reader has to scroll over — a run-up made of one would open the card
        // on a blank strip. A paragraph carrying a figure shows the figure, and
        // the blocks that are not prose at all are not asked.
        if (PROSE.test(q.tagName) && !shown(q) && !q.querySelector("img")) continue;
        out.push(q);
        chars += text(q).length;
      }
      return out;
    }

    // The chapter from the quote onwards.
    function blocks(from) {
      var out = run(from, "nextElementSibling");
      // A run that happens to stop on a heading ends the card with a title and
      // nothing under it — an invitation to scroll that goes nowhere.
      while (out.length && HEADING.test(out[out.length - 1].tagName)) out.pop();
      return out;
    }

    // The chapter up to it, in reading order too: the walk goes back, the card
    // reads down, so the run is turned around before it is handed over. Nothing
    // is trimmed off its head the way `blocks` trims its tail — a heading is
    // exactly what a reader arriving at the top of the run wants to find, and it
    // has its whole section under it.
    function blocksBack(from) {
      return run(from, "previousElementSibling").reverse();
    }

    // The top-level block a quote sits in. mdBook flattens a chapter into a
    // single <main>, so the run either side of a quote is found among that
    // block's siblings — a quote taken from inside a list or a table resumes
    // after the whole list rather than after the row, and is preceded by what
    // came before the list rather than by the row above it. "And then" is a
    // relation between the blocks of a page, not between the cells of one.
    function outer(el, root) {
      var node = el;
      while (node.parentElement && node.parentElement !== root) node = node.parentElement;
      return node;
    }

    // The chapter continuing from just after the block a card is quoting, and
    // the chapter running up to just before it.
    function readOn(from, root) {
      if (!from || !root.contains(from)) return [];
      return blocks(outer(from, root).nextElementSibling);
    }
    function readBack(from, root) {
      if (!from || !root.contains(from)) return [];
      return blocksBack(outer(from, root).previousElementSibling);
    }

    // A heading that introduces a table of contents: the book writes each one
    // as a `<div class="toc">` directly under its heading.
    function isContents(el) {
      var n = HEADING.test(el.tagName) ? el.nextElementSibling : null;
      return !!(n && n.classList.contains("toc"));
    }

    // A paragraph that is nothing but one link is navigation, not prose: every
    // section heading in this book is followed by a "↩ Table of Contents" line,
    // and quoting that back at the reader says nothing about the section.
    function isNav(n) {
      var links = n.querySelectorAll("a");
      return links.length === 1 && text(n) === text(links[0]);
    }

    // What a block would actually show if it were quoted: its text with the
    // margin apparatus taken out, since `snippet` takes that out of the copy. A
    // paragraph can be nothing but a figure's label and a sidenote hanging off
    // it, and on the card that is a label alone.
    function shown(n) {
      var c = n.cloneNode(true);
      c.querySelectorAll(STRIP).forEach(function (x) {
        x.remove();
      });
      return text(c);
    }

    // The word the reader was sent to look at. A rung's anchor lives inside the
    // margin note that trails the term, and the term is the bold run just
    // before that note.
    function term(el) {
      var note = el.classList.contains("defnote") ? el : el.closest(".defnote");
      if (!note) return null;
      var prev = note.previousElementSibling;
      return prev && /^(STRONG|EM|CODE)$/.test(prev.tagName) ? prev : null;
    }

    // `nodes` is the quote and the chapter after it, `back` the chapter before
    // it — one run, handed over in two pieces because the card is scrolled to
    // the seam between them on the way in (see `fill`). `back` is empty where
    // there is nothing above the quote to scroll to: a chapter's own opening.
    function card(title, where, nodes, mark, w, back) {
      if (!nodes.length) return null;
      return {
        title: title,
        where: where,
        nodes: nodes,
        back: back || [],
        mark: mark,
        // Relative URLs inside a block quoted out of another chapter are
        // resolved against that chapter, not against this page.
        base: w.cross ? w.url : null,
      };
    }

    function extract(d, w) {
      var root = d.querySelector(".content main") || d.querySelector("main");
      if (!root) return null;
      var h1 = root.querySelector("h1:not(.menu-title)");
      var chapter = text(h1);

      if (!w.id) {
        // A bare chapter link: the chapter's title and its opening prose. The
        // title is the top of the chapter, so nothing precedes the quote here.
        return card(chapter, "", blocks(h1 ? h1.nextElementSibling : root.firstElementChild), null, w);
      }

      var el = d.getElementById(w.id);
      if (!el) return null; // a stale or not-yet-written anchor

      if (HEADING.test(el.tagName)) {
        // The heading rides in the run rather than being lifted out of it into
        // the card's title, the way it did when a section's opening was all a
        // card could hold. It is the seam the card is pinned to, and the reader
        // who scrolls up off the top of the section has to be able to see where
        // the section began — so the card adds no title of its own, as with a
        // box below, and the heading rules itself off in the run instead.
        var under = blocks(el.nextElementSibling);
        if (!under.length) return null; // a heading with nothing quotable under it
        return card("", w.cross ? chapter : "", [el].concat(under), null, w,
                    readBack(el, root));
      }

      var box = el.closest(BOX);
      if (box) {
        // The box carries its own numbered title bar, so the card adds none.
        var place = [section(box, root), w.cross ? chapter : ""].filter(Boolean).join(" · ");
        return card("", place, [box].concat(readOn(box, root)), term(el), w,
                    readBack(box, root));
      }

      var blk = el.closest("p, li, blockquote, dd, figcaption, td") || el;
      return card(section(blk, root) || chapter, w.cross ? chapter : "",
                  [blk].concat(readOn(blk, root)), term(el), w,
                  readBack(blk, root));
    }

    function rebase(url, base) {
      try {
        return new URL(url, base).href;
      } catch (e) {
        return url;
      }
    }

    // One block, copied out of the book: margin apparatus taken out, ids dropped
    // (they would be duplicates of the real ones, and would capture
    // getElementById and :target), and relative URLs re-based when the block
    // came from another chapter.
    function snippet(node, mark, base) {
      // `mark` is a node in the source tree, so flag it before copying and
      // unflag it straight after — the flag rides along into the copy, which is
      // the only handle we have on it there.
      if (mark) mark.setAttribute("data-peek-term", "");
      var c = document.importNode(node, true);
      if (mark) mark.removeAttribute("data-peek-term");

      c.querySelectorAll(STRIP).forEach(function (x) {
        x.remove();
      });
      c.querySelectorAll("[id]").forEach(function (x) {
        x.removeAttribute("id");
      });
      if (base) {
        c.querySelectorAll("a[href]").forEach(function (x) {
          x.setAttribute("href", rebase(x.getAttribute("href"), base));
        });
        c.querySelectorAll("img[src]").forEach(function (x) {
          x.setAttribute("src", rebase(x.getAttribute("src"), base));
        });
      }
      var t = c.hasAttribute("data-peek-term") ? c : c.querySelector("[data-peek-term]");
      if (t) {
        t.removeAttribute("data-peek-term");
        t.classList.add("xref-term");
      }
      return c;
    }

    return {
      cls: "doc-preview-xref",

      links: function () {
        var out = [];
        document.querySelectorAll(".content main a[href]").forEach(function (a) {
          var w = where(a);
          if (!w) return;
          // None of the contents apparatus gets a peek: an entry in a table of
          // contents is already the title of the section it leads to, so a card
          // would only say it twice, and the "↩ Table of Contents" line under
          // every heading is a step the reader is already taking — whether it
          // goes to the contents list itself (where the card would quote a list
          // of links back at them) or up to the section's own heading. A
          // paragraph that is nothing but one link is that back-link and, in
          // this book, only ever that.
          if (a.closest(".toc")) return;
          var p = a.closest("p");
          if (p && isNav(p)) return;
          var t = w.id && !w.cross ? document.getElementById(w.id) : null;
          if (t && (t.closest(".toc") || isContents(t))) return;
          // A refinement dot already says which rung it leads to in a native
          // `title` tooltip. The popup says that and shows the rung itself, so
          // it takes the tooltip over — two tooltips for one dot is one too
          // many — and keeps the label for its own footer. The dot's
          // aria-label is untouched, so assistive tech loses nothing.
          if (a.classList.contains("refine-dot") && a.title) {
            a.dataset.peekLabel = a.title;
            a.removeAttribute("title");
          }
          out.push(a);
        });
        return out;
      },

      load: function (a) {
        var w = where(a);
        var d = page(w.path);
        if (d && typeof d.then === "function") {
          return d.then(function (doc) {
            return extract(doc, w);
          });
        }
        return extract(d, w);
      },

      fill: function (p, a, data) {
        p.replaceChildren();
        if (data.title) {
          var h = document.createElement("div");
          h.className = "xref-title";
          h.textContent = data.title;
          p.appendChild(h);
        }
        var body = document.createElement("div");
        body.className = "xref-body";
        function add(n) {
          var c = snippet(n, data.mark, data.base);
          // A section's opening paragraph is quoted out of the `.dropcap` div
          // that carries its initial on the page (see `quotable` above), so the
          // selector that draws the cap no longer reaches it. The class is the
          // handle the card's own, smaller cap hangs on.
          if (n.parentElement && n.parentElement.classList.contains("dropcap")) {
            c.classList.add("xref-dropcap");
          }
          body.appendChild(c);
          return c;
        }
        // The chapter before the quote, then the quote and the chapter after it,
        // all of it one scroller and all of it real prose. The run above used to
        // be a ghost of a single paragraph pinned outside the scroller, which is
        // why a card would only ever scroll down.
        data.back.forEach(add);
        var opening = null;
        data.nodes.forEach(function (n) {
          var c = add(n);
          opening = opening || c;
        });
        p.appendChild(body);

        var place = [data.where, a.dataset.peekLabel].filter(Boolean).join(" · ");
        if (place) {
          var src = document.createElement("div");
          src.className = "doc-preview-src";
          src.textContent = place;
          p.appendChild(src);
        }

        // A run too long for the card is capped, not cut off — it scrolls in
        // place (`.xref-body` in the stylesheet) — and the fade at each end is
        // only honest while there is something past it. So both are measured on
        // the way in and re-measured as the reader scrolls, and each comes off at
        // its own end of the run.
        function fade() {
          body.classList.toggle("xref-clipped-top", body.scrollTop > 4);
          body.classList.toggle(
            "xref-clipped",
            body.scrollHeight - body.scrollTop - body.clientHeight > 4
          );
        }

        // Where the card opens: on the quote, not at the top of the run, with
        // the tail of the block before it left showing above. That much is what
        // the head fade is drawn over (`--fade-top` in the stylesheet), so the
        // run-up still thins out into the card's edge the way the ghost it
        // replaces did, and the quote starts below the fade at full ink.
        //
        // LEAD is measured from the *bottom of that block's last line*, not from
        // the top of the quote, because what is between them is whitespace: a
        // paragraph's margin, and over a heading its rule and the 0.9em that
        // holds the rule off it. Measured from the quote, a heading's own
        // padding would push the whole run-up up into the fade and the card
        // would open on a blank strip.
        var LEAD = 2.4; // em of run-up left showing, over a 1.2em fade
        var placed = 0; // where we last put the scroll, to tell ours from theirs
        function pin() {
          if (!opening) return;
          var em = parseFloat(getComputedStyle(body).fontSize) || 16;
          var up = opening.previousElementSibling; // last block of the run-up
          var r = (up || opening).getBoundingClientRect();
          var edge = body.getBoundingClientRect().top - body.scrollTop;
          body.scrollTop = Math.max(0, (up ? r.bottom - LEAD * em : r.top) - edge);
          placed = body.scrollTop;
          fade();
        }
        // The reader's place, once they have one, is theirs: the pin is only
        // re-taken while the card is still sitting where it was put. Layout above
        // the quote settles after the card is up — an image arriving at its real
        // height would slide the quote out of view — and WebKit has no scroll
        // anchoring to catch that for us.
        var held = true;
        body.addEventListener("scroll", function () {
          if (Math.abs(body.scrollTop - placed) > 2) held = false;
          fade();
        });
        pin();
        body.querySelectorAll("img").forEach(function (img) {
          if (img.complete) return;
          img.addEventListener(
            "load",
            function () {
              if (held) pin();
            },
            { once: true }
          );
        });
      },
    };
  })();

  /* -- wiring -------------------------------------------------------------- */
  function attach(a) {
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
    // first tap straight through to the target.
    a.addEventListener("click", function (e) {
      if (!touch() || peeked === a) return;
      e.preventDefault();
      peeked = a;
      clearTimeout(hideTimer);
      clearTimeout(showTimer);
      show(a);
    });
  }

  [docs, xref].forEach(function (provider) {
    Array.prototype.forEach.call(provider.links(), function (a) {
      if (a.__peek) return; // the first provider to claim a link owns it
      a.__peek = provider;
      attach(a);
    });
  });

  // Anything that moves the anchor out from under the popup dismisses it.
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") scheduleHide();
  });
  // Keyboard parity for the wheel. A card opened by focusing its link has no
  // route into it — the popup is appended to the end of the body, so Tab leads
  // past it into the page, not in — and the scrolling keys would only slide the
  // link away and dismiss the card mid-sentence. So while such a card is up and
  // has more to show, those keys drive the quote instead. Anything else falls
  // through untouched: a card with nothing below the fold, a card the pointer
  // opened (the wheel is already over it), a shortcut carrying a modifier.
  var SCROLL_KEYS = { ArrowDown: 1, ArrowUp: -1, PageDown: 1, PageUp: -1 };
  document.addEventListener("keydown", function (e) {
    if (!(e.key in SCROLL_KEYS)) return;
    if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
    if (!pop || !pop.classList.contains("visible")) return;
    if (!anchor || document.activeElement !== anchor) return;
    var body = pop.querySelector(".xref-body");
    if (!body || body.scrollHeight - body.clientHeight <= 4) return;
    // A page key moves a cardful less an overlapping line, so the reader keeps
    // their place across the jump; an arrow moves about a line.
    var step = /^Page/.test(e.key) ? Math.max(body.clientHeight - 24, 24) : 28;
    body.scrollTop += SCROLL_KEYS[e.key] * step;
    e.preventDefault();
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
  // The page scrolling out from under a card dismisses it: the card is placed
  // against the link's viewport rect and has no way to follow it there. A scroll
  // *inside* the card is the reader reading it and must not, and it arrives here
  // all the same — a capturing listener on window sees scrolls that never bubble
  // out of the element they happened in.
  window.addEventListener(
    "scroll",
    function (e) {
      if (!pop || !pop.classList.contains("visible")) return;
      if (pop.contains(e.target)) return;
      scheduleHide();
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
  // C++ notes come down here for the same reason: an aside about the reference
  // implementation is a remark of its own, not a repetition of something
  // already in the sentence.
  const cppnotes = Array.prototype.slice.call(
    document.querySelectorAll(".cppnote")
  );
  if (sidenotes.length === 0 && lecnotes.length === 0 && cppnotes.length === 0)
    return;

  function buildList(tag, notes) {
    const list = document.createElement(tag);
    notes.forEach(function (n) {
      const li = document.createElement("li");
      // A lecture's icon is inline in its markup and rides along in the copied
      // innerHTML; a C++ note's is hung by CSS off the class, which the copy
      // leaves behind. Mark the list item so it can hang the same marker (see
      // `.cppnote-item` in custom.css).
      if (n.classList.contains("cppnote")) li.className = "cppnote-item";
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
    addBlock("C++ notes", "ul", cppnotes);
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
      .querySelectorAll(
        ".defnote, .lecnote, .cppnote, .sidenote, .sidenote-number"
      )
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

// Tall notebook outputs: clamp them and hand the reader a button, instead of
// capping them into little scroll boxes.
//
// The cap itself is wanted — a `print()` of a 400-row array should not run down
// the page — but paying for it with `overflow: auto` made every Out[] a nested
// vertical scroller, and a chapter like §1 carries twenty-odd of them. Scrolling
// with the pointer over one latches the gesture to that box: the page stops
// moving, and on macOS it stays stopped for the rest of the swipe even after the
// box has bottomed out, which reads as the page freezing at random. Worse, the
// cap was written in CSS, which cannot ask how tall anything is, so a two-line
// output was a scroll trap as surely as a two-hundred-line one — with no
// scrollbar visible to explain why the page had stopped.
//
// So the measuring happens here, and only outputs that actually exceed the cap
// are clamped. `overflow-y: hidden` in custom.css means even those are never
// vertically scrollable; the rest of the output arrives by button, expanded in
// place, and stays expanded. Sideways scrolling is untouched — a one-line array
// still scrolls horizontally, and a box that only scrolls horizontally does not
// latch a vertical gesture.
document.addEventListener("DOMContentLoaded", function () {
  const outs = Array.prototype.slice
    .call(document.querySelectorAll(".nb-out"))
    // `full-output` cells opt out of the cap entirely (see mdbook-nb). Skipping
    // them here is the whole of that opt-out now that no CSS rule caps them.
    .filter(function (out) { return !out.closest(".nb-cell.nb-full"); });
  if (outs.length === 0) return;

  function bodyOf(out) {
    return out.querySelector(
      ":scope > .nb-out-text, :scope > .nb-out-html, :scope > .nb-error"
    );
  }

  function label(out, expanded) {
    const button = out.querySelector(":scope > .nb-out-more");
    if (!button) return;
    button.textContent = expanded ? "show less" : "show all output";
    button.setAttribute("aria-expanded", String(expanded));
  }

  function measure(out) {
    const body = bodyOf(out);
    if (!body) return;
    // A reader who opened this one has said what they want; a re-measure on
    // resize or on late-loading fonts must not fold it back up.
    if (out.dataset.nbExpanded === "true") return;

    out.classList.add("nb-clamped");
    // The clamp is on, so clientHeight is the cap and scrollHeight the content.
    // A pixel of slack: subpixel line heights make these differ by a hair on
    // outputs that fit exactly.
    const overflows = body.scrollHeight > body.clientHeight + 1;
    if (!overflows) out.classList.remove("nb-clamped");

    let button = out.querySelector(":scope > .nb-out-more");
    if (overflows && !button) {
      button = document.createElement("button");
      button.type = "button";
      button.className = "nb-out-more";
      button.addEventListener("click", function () {
        const expanded = out.dataset.nbExpanded === "true";
        out.dataset.nbExpanded = String(!expanded);
        out.classList.toggle("nb-clamped", expanded);
        label(out, !expanded);
      });
      out.appendChild(button); // after the output; the prompt is the first child
    }
    if (button) button.hidden = !overflows;
    label(out, false);
  }

  function measureAll() {
    outs.forEach(measure);
  }

  measureAll();

  // The first pass runs in the body face and in whatever the browser has cached;
  // the mono face landing afterwards reflows every output by a line or two,
  // which is the difference between clamping and not for the ones sitting near
  // the cap. Measure again once the fonts are actually in.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(measureAll).catch(function () {});
  }

  // Width changes rewrap .nb-out-html (a pandas table relaying out) and move the
  // Tufte breakpoint, so what overflowed at one width may not at another.
  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(measureAll, 150);
  });
});
