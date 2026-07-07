// Hover cards for Lean code embedded by the `mdbook-lean` preprocessor.
// Each token span carries its signature/docstring as *rendered HTML* in a
// `data-hover` attribute; we show it in one shared floating element.
(function () {
  var card = null;
  var hideTimer = null;

  function cancelHide() { if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; } }

  function ensureCard() {
    if (!card) {
      card = document.createElement("div");
      card.className = "lean-hover-card";
      card.setAttribute("role", "tooltip");
      // Keep the card open while the pointer is over it (crossing the arrow gap
      // fires the token's mouseleave, so we defer hiding — see hideSoon).
      card.addEventListener("mouseenter", cancelHide);
      card.addEventListener("mouseleave", hideSoon);
      document.body.appendChild(card);
    }
    return card;
  }

  function show(e) {
    cancelHide();
    var el = e.currentTarget;
    var htmlContent = el.getAttribute("data-hover");
    if (!htmlContent) return;
    var c = ensureCard();
    c.innerHTML = htmlContent;
    c.classList.remove("lean-hover-flipped");
    c.style.display = "block";

    var r = el.getBoundingClientRect();
    var vw = document.documentElement.clientWidth;
    var top = window.scrollY + r.top - c.offsetHeight - 8;
    if (top < window.scrollY + 4) {
      top = window.scrollY + r.bottom + 8; // flip below
      c.classList.add("lean-hover-flipped");
    }
    var left = window.scrollX + r.left;
    var maxLeft = window.scrollX + vw - c.offsetWidth - 8;
    if (left > maxLeft) left = Math.max(window.scrollX + 4, maxLeft);
    c.style.top = top + "px";
    c.style.left = left + "px";

    // Point the arrow at the token's horizontal center, clamped to the card.
    var arrow = r.left + r.width / 2 - (left - window.scrollX);
    arrow = Math.max(12, Math.min(c.offsetWidth - 12, arrow));
    c.style.setProperty("--arrow-left", (arrow - 8) + "px");
  }

  function hide() { cancelHide(); if (card) card.style.display = "none"; }

  // Defer hiding briefly so the pointer can travel across the gap/arrow onto
  // the card (which cancels the timer via its mouseenter handler).
  function hideSoon() {
    cancelHide();
    hideTimer = setTimeout(hide, 150);
  }

  function attach() {
    document.querySelectorAll("pre.lean [data-hover]").forEach(function (el) {
      el.addEventListener("mouseenter", show);
      el.addEventListener("mouseleave", hideSoon);
    });
  }

  if (document.readyState !== "loading") attach();
  else document.addEventListener("DOMContentLoaded", attach);
})();
