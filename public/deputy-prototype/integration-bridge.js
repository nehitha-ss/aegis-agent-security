/* Local extension to the recovered published build. No credentials or event data. */
(() => {
  function install() {
    for (const navigation of document.querySelectorAll('[data-sidebar="menu"]')) {
      if (navigation.querySelector('[data-aegis-integration-link]')) continue;
      const template = navigation.querySelector('[data-sidebar="menu-button"]');
      const item = document.createElement("li");
      item.setAttribute('data-aegis-integration-link', 'true');
      item.style.marginTop = "14px";
      const link = document.createElement("a");
      link.href = "/integrations";
      link.className = template?.className || "";
      link.style.cssText =
        "display:flex;align-items:center;gap:10px;text-decoration:none;border:1px solid var(--border);padding:10px;border-radius:8px;";
      link.innerHTML =
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M8 8h8v8H8zM12 2v6m0 8v6M2 12h6m8 0h6"/></svg><span>Integrations</span><small style="margin-left:auto;font-size:9px;opacity:.7">CONNECT</small>';
      item.append(link);
      navigation.append(item);
    }
    const header = document.querySelector("main header");
    if (header && !document.getElementById("aegis-demo-boundary")) {
      const note = document.createElement("div");
      note.id = "aegis-demo-boundary";
      note.style.cssText =
        "padding:8px 28px;font-size:11px;border-bottom:1px solid var(--border);color:var(--muted-foreground);";
      note.textContent =
        "PROTOTYPE DEMONSTRATION · These screens use sample data and manual inputs. Authenticated Northstar events appear separately in Integrations.";
      header.after(note);
    }
    const workspace = document.querySelector("main main");
    if (workspace && !document.getElementById("aegis-workspace-chrome")) {
      const chrome = document.createElement("section");
      chrome.id = "aegis-workspace-chrome";
      chrome.setAttribute("aria-label", "AEGIS workspace status");
      chrome.innerHTML = `
        <div class="aegis-crumb"><span>WORKSPACE</span><i></i><strong>DEPUTY ANALYSIS</strong></div>
        <div class="aegis-chrome-grid">
          <div><p class="aegis-eyebrow">CONFUSED-DEPUTY CONTROL ROOM</p><h1 id="aegis-stage-title">Microservices</h1><p id="aegis-stage-description">Map the service path and establish the authorization boundary.</p></div>
          <div class="aegis-health"><span class="aegis-pulse" aria-hidden="true"></span><div><b>Detector online</b><small>Northstar finance APIs · sample environment</small></div></div>
        </div>`;
      workspace.prepend(chrome);
    }
    const active = document.querySelector('[data-sidebar="menu-button"][data-active="true"]');
    const title = document.getElementById("aegis-stage-title");
    const description = document.getElementById("aegis-stage-description");
    if (active && title) {
      const name = active.querySelector("span span")?.textContent?.trim() || active.textContent?.trim() || "Analysis";
      title.textContent = name;
      const copy = {
        "Microservices": "Map the service path and establish the authorization boundary.",
        "Identity Discovery": "Verify the workload identities and actor context behind each request.",
        "Security Twin": "Inspect the security twin before a privileged dependency can act.",
        "Trust Graph": "Trace where caller context ends and implicit deputy trust begins.",
        "Permission Analysis": "Compare caller authority with the permissions exercised downstream.",
        "Confused-Deputy Detection": "Evaluate evidence against the delegated-access safety boundary.",
        "Risk Alert": "Prioritize the exposed path and document its operational impact.",
        "Recommended Policy Fix": "Generate a least-privilege control that preserves the approved workflow.",
        "Evidence Ledger": "Review the complete, explainable record for this analysis run."
      };
      if (description) description.textContent = copy[name] || "Review the current AEGIS analysis stage.";
    }
  }
  new MutationObserver(install).observe(document.documentElement, {
    subtree: true,
    childList: true,
  });
  install();
  // The recovered export streams its nested workspace after the deferred
  // bridge is evaluated. Retry at the browser lifecycle boundaries so the
  // presentation frame is present on both a cold load and client navigation.
  document.addEventListener("DOMContentLoaded", install, { once: true });
  window.addEventListener("load", install, { once: true });
  setTimeout(install, 120);
  let workspaceAttempts = 0;
  const workspaceTimer = setInterval(() => {
    install();
    workspaceAttempts += 1;
    if (document.getElementById("aegis-workspace-chrome") || workspaceAttempts >= 30) {
      clearInterval(workspaceTimer);
    }
  }, 100);
  document.addEventListener("click", event => {
    if (event.target.closest('[data-sidebar="menu-button"]')) requestAnimationFrame(install);
  });
  const stage = new URLSearchParams(location.search).get("stage");
  if (stage && /^\d$/.test(stage) && Number(stage) < 9) {
    const select = () =>
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          const buttons = document.querySelectorAll(
            '[data-sidebar="menu-button"]',
          );
          buttons[Number(stage)]?.click();
        }),
      );
    if (document.readyState === "complete") select();
    else window.addEventListener("load", select, { once: true });
  }
})();
