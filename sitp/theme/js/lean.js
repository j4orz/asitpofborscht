// Hover cards for Lean code embedded by the `mdbook-lean` preprocessor.
// Each token span carries its signature/docstring as *rendered HTML* in a
// `data-hover` attribute; we show it in one shared floating element.
(function () {
  var card = null;

  function ensureCard() {
    if (!card) {
      card = document.createElement("div");
      card.className = "lean-hover-card";
      card.setAttribute("role", "tooltip");
      card.addEventListener("mouseenter", function () { card.style.display = "block"; });
      card.addEventListener("mouseleave", hide);
      document.body.appendChild(card);
    }
    return card;
  }

  function show(e) {
    var el = e.currentTarget;
    var htmlContent = el.getAttribute("data-hover");
    if (!htmlContent) return;
    var c = ensureCard();
    c.innerHTML = htmlContent;
    c.style.display = "block";

    var r = el.getBoundingClientRect();
    var vw = document.documentElement.clientWidth;
    var top = window.scrollY + r.top - c.offsetHeight - 8;
    if (top < window.scrollY + 4) top = window.scrollY + r.bottom + 8; // flip below
    var left = window.scrollX + r.left;
    var maxLeft = window.scrollX + vw - c.offsetWidth - 8;
    if (left > maxLeft) left = Math.max(window.scrollX + 4, maxLeft);
    c.style.top = top + "px";
    c.style.left = left + "px";
  }

  function hide() { if (card) card.style.display = "none"; }

  function attach() {
    document.querySelectorAll("pre.lean [data-hover]").forEach(function (el) {
      el.addEventListener("mouseenter", show);
      el.addEventListener("mouseleave", hide);
    });
  }

  if (document.readyState !== "loading") attach();
  else document.addEventListener("DOMContentLoaded", attach);
})();
