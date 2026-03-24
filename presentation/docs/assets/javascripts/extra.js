// After Mermaid renders, fix quadrant chart text visibility on dark theme
document.addEventListener("DOMContentLoaded", function () {
  var observer = new MutationObserver(function () {
    document.querySelectorAll(".mermaid svg text").forEach(function (el) {
      var current = window.getComputedStyle(el).fill;
      // If text is near-black or transparent, make it white
      if (
        current === "rgb(0, 0, 0)" ||
        current === "#000000" ||
        current === "rgba(0, 0, 0, 0)" ||
        current === "rgb(51, 51, 51)" ||
        current === "rgb(30, 30, 30)"
      ) {
        el.style.fill = "#ffffff";
      }
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
});
