// Fix mapTheme for material-lighter in REPL iframes
const REPL_LIGHT_THEMES = ["light", "rust", "material-lighter"];

function currentMdbookTheme() {
  return localStorage.getItem("mdbook-theme") ||
    [...document.documentElement.classList].find(c =>
      ["ayu", "coal", "navy", "light", "rust", "material-lighter"].includes(c)
    );
}

// Fix on initial iframe load: intercept the id==="" handshake
window.addEventListener("message", (event) => {
  const repl = event.data?.repl;
  if (!repl || repl.id !== "") return;
  const mdTheme = currentMdbookTheme();
  if (mdTheme !== "material-lighter") return;
  // Send corrected theme to all REPL iframes after the inline script responds
  setTimeout(() => {
    document.querySelectorAll(".repl").forEach((replElement) => {
      const iframe = replElement.querySelector("iframe");
      const id = replElement.getAttribute("data-id");
      iframe?.contentWindow?.postMessage({ repl: { id, editor: { theme: "light", backgroundColor: "#E0F7FA" } } }, "*");
    });
  }, 0);
});

// Fix on theme switch
document.querySelectorAll("button[role='menuitem'].theme").forEach((btn) => {
  btn.addEventListener("click", (event) => {
    if (event.target.id === "material-lighter") {
      setTimeout(() => {
        document.querySelectorAll(".repl").forEach((replElement) => {
          const iframe = replElement.querySelector("iframe");
          const id = replElement.getAttribute("data-id");
          iframe?.contentWindow?.postMessage({ repl: { id, editor: { theme: "light", backgroundColor: "#E0F7FA" } } }, "*");
        });
      }, 0);
    }
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
