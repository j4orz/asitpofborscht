document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("code.language-lean").forEach(function (block) {
    if (typeof hljs !== "undefined") hljs.highlightBlock(block);
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
