// CORE Stage: select the application's real All tab when Financial Approvals opens.
// No fake rows, no data modification. Works with the existing CSS that hides tabs.
(() => {
  "use strict";

  const ROUTE = /^\/financial-approvals(?:\/|$)/;
  const TABLIST = '[role="tablist"][aria-label="What to show"]';
  let lastPath = "";
  let selectedForThisVisit = false;
  let attempts = 0;

  function chooseAllOnEntry() {
    const path = location.pathname;
    if (path !== lastPath) {
      lastPath = path;
      selectedForThisVisit = false;
      attempts = 0;
    }
    if (!ROUTE.test(path) || selectedForThisVisit || attempts >= 120) return;

    const group = document.querySelector(`main ${TABLIST}`);
    if (!group) return;

    const tabs = Array.from(group.querySelectorAll('[role="tab"]'));
    const allTab = tabs.find(tab => tab.textContent.trim().toLowerCase() === "all");
    if (!allTab) return;

    if (allTab.getAttribute("aria-selected") === "true") {
      selectedForThisVisit = true;
      return;
    }
    if (allTab.matches(":disabled, [aria-disabled='true']")) return;

    attempts += 1;
    // A programmatic click works even when CSS has hidden the original tab.
    allTab.click();
  }

  chooseAllOnEntry();
  const timer = setInterval(chooseAllOnEntry, 350);
  window.addEventListener("pageshow", chooseAllOnEntry);
  window.addEventListener("popstate", chooseAllOnEntry);
  window.addEventListener("hashchange", chooseAllOnEntry);
  window.addEventListener("beforeunload", () => clearInterval(timer), { once: true });
})();
