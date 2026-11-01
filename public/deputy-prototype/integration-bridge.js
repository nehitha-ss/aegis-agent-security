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
        "SECURE SANDBOX · This workspace uses synthetic policy data. Authenticated AEGIS events appear separately in Integrations.";
      header.after(note);
    }
  }

  function installEnforcementPath() {
    const workspace = document.querySelector("main main");
    if (!workspace || document.getElementById("aegis-enforcement-path")) return;

    const panel = document.createElement("section");
    panel.id = "aegis-enforcement-path";
    panel.setAttribute("aria-label", "AEGIS verification gateway");
    panel.innerHTML = `
      <div class="aegis-flow-header">
        <div><p class="aegis-flow-kicker">VERIFICATION GATEWAY</p><h2>AEGIS verifies delegated access before payroll</h2><p>One policy checkpoint before a protected Payroll Ledger boundary.</p></div>
        <span class="aegis-flow-badge">SECURE SANDBOX</span>
      </div>
      <div class="aegis-operator-strip" aria-label="Operator authentication and connected systems">
        <div class="aegis-operator-identity"><span class="aegis-operator-avatar" aria-hidden="true">↗</span><strong>Operator authentication</strong><small>Sign in to unlock protected AEGIS actions</small></div>
        <div class="aegis-auth-action"><span>OPERATOR AUTHENTICATION</span><a class="aegis-auth-button" href="/api/auth/google">Continue with Google <b aria-hidden="true">→</b></a></div>
      </div>
      <section class="aegis-command-grid" aria-label="AEGIS control room status">
        <article><span>LIVE REQUESTS</span><strong>03</strong><small>1 is waiting at policy review</small></article>
        <article class="is-protected"><span>RISK POSTURE</span><strong>GUARDED</strong><small>Payroll remains behind AEGIS</small></article>
        <article class="is-pending"><span>APPROVAL QUEUE</span><strong>01</strong><small>Recovery-vault request pending</small></article>
        <article class="is-evidence"><span>EVIDENCE</span><strong>ACTIVE</strong><small>Decision receipts enabled</small></article>
      </section>
      <nav class="aegis-workflow-links" aria-label="Verification workflow navigation">
        <p><span>WORKFLOW</span> Continue the evidence review in the detector</p>
        <div>
          <a href="?stage=1#aegis-enforcement-path"><b>01</b> Identity Discovery</a>
          <a href="?stage=4#aegis-enforcement-path"><b>02</b> Permission Analysis</a>
          <a href="?stage=8#aegis-enforcement-path"><b>03</b> Evidence Ledger</a>
          <a class="is-integration" href="/integrations"><b>↗</b> Authenticated events</a>
        </div>
      </nav>
      <ol class="aegis-flow-steps" aria-label="Request processing steps">
        <li class="is-current"><span>01 · REQUEST</span><strong>Capture caller intent</strong><small>Expense Intake → Finance</small></li>
        <li><span>02 · VERIFY</span><strong>Check identity and scope</strong><small>Caller context · trust · authority</small></li>
        <li><span>03 · DECIDE</span><strong>Allow or block payroll</strong><small>Decision returned before access</small></li>
      </ol>
      <div class="aegis-flow-actions">
        <div><p class="aegis-flow-label">OPERATOR TEST</p><p class="aegis-flow-copy">Run a controlled delegation check through the server-side policy detector.</p><div class="aegis-flow-buttons"><button type="button" data-aegis-test="unsafe">Test unsafe request</button><button type="button" data-aegis-test="safe">Test verified request</button></div><div class="aegis-tool-row"><button type="button" data-aegis-tool="payroll-summary">Protected payroll summary <em>MASK</em></button><button type="button" data-aegis-tool="recovery-vault">Recovery access <em>APPROVAL</em></button></div><p class="aegis-flow-note">Synthetic data only. AEGIS never stores or exposes direct production credentials.</p></div>
        <div class="aegis-flow-result" aria-live="polite"><p class="aegis-flow-label">POLICY OUTCOME</p><strong>Ready for evaluation</strong><p>Choose a test to calculate the policy decision.</p><div class="aegis-live-event"><i></i> Live policy event stream</div></div>
      </div>`;
    workspace.prepend(panel);
    // The host prototype uses one shared workspace for its nine views. Keep
    // this gateway in the Microservices view only, rather than duplicating it
    // above every analysis stage.
    const stageButtons = [...document.querySelectorAll('[data-sidebar="menu-button"]')];
    const syncStageLayout = (activeIndex) => {
      document.querySelectorAll(".aegis-stacked-stage-layout").forEach((node) => node.classList.remove("aegis-stacked-stage-layout"));
      if (![5, 7].includes(activeIndex)) return;
      const layout = [...workspace.querySelectorAll("section, div")].find((node) => {
        const classes = typeof node.className === "string" ? node.className : "";
        const cards = [...node.children].filter((child) => child.classList?.contains("overflow-hidden"));
        return classes.includes("grid-cols") && cards.length >= 2;
      });
      layout?.classList.add("aegis-stacked-stage-layout");
    };
    const syncGatewayVisibility = () => {
      const active = document.querySelector('[data-sidebar="menu-button"][data-active="true"]');
      const activeIndex = stageButtons.indexOf(active);
      if (activeIndex >= 0) {
        document.documentElement.dataset.aegisStage = String(activeIndex);
        syncStageLayout(activeIndex);
      }
      panel.hidden = active ? active !== stageButtons[0] : false;
    };
    syncGatewayVisibility();
    stageButtons.forEach((stageButton, index) => stageButton.addEventListener("click", () => {
      document.documentElement.dataset.aegisStage = String(index);
      syncStageLayout(index);
      [0, 80, 300, 850].forEach((delay) => window.setTimeout(syncGatewayVisibility, delay));
    }));
    fetch("/api/auth/session", { credentials: "same-origin" }).then((response) => response.ok ? response.json() : null).then((data) => {
      const operator = panel.querySelector(".aegis-operator-identity");
      const authAction = panel.querySelector(".aegis-auth-action");
      if (!operator || !authAction) return;
      if (!data?.user) {
        operator.innerHTML = '<span class="aegis-operator-avatar" aria-hidden="true">↗</span><strong>Secure workspace</strong><small>Sign in to unlock protected AEGIS actions</small>';
        return;
      }
      operator.innerHTML = `<span class="aegis-operator-avatar" aria-hidden="true">${data.user.name.slice(0, 2).toUpperCase()}</span><strong>${data.user.name}</strong><small>Verified Google identity · protected actions unlocked</small>`;
      authAction.innerHTML = '<span>AUTHENTICATED OPERATOR</span><button type="button" class="aegis-auth-button is-authenticated" data-aegis-signout>Sign out <b aria-hidden="true">→</b></button>';
      authAction.querySelector("[data-aegis-signout]")?.addEventListener("click", async () => {
        const button = authAction.querySelector("button");
        if (button) { button.disabled = true; button.textContent = "Signing out…"; }
        await fetch("/api/auth/signout", { method: "POST", credentials: "same-origin" });
        window.location.reload();
      });
    }).catch(() => {});

    const presets = {
      unsafe: { callerService: "Expense Intake API", deputyService: "Finance Orchestrator", sensitiveResource: "Payroll Ledger", callerCanInvokeDeputy: true, deputyUsesOwnIdentity: true, callerContextPropagated: false, resourceAuthorizesDeputyOnly: true, deputyHasSensitiveScope: true },
      safe: { callerService: "Expense Intake API", deputyService: "Finance Orchestrator", sensitiveResource: "Payroll Ledger", callerCanInvokeDeputy: true, deputyUsesOwnIdentity: false, callerContextPropagated: true, resourceAuthorizesDeputyOnly: false, deputyHasSensitiveScope: false },
    };
    const result = panel.querySelector(".aegis-flow-result");
    const steps = [...panel.querySelectorAll(".aegis-flow-steps li")];
    panel.querySelectorAll("[data-aegis-test]").forEach((button) => button.addEventListener("click", async () => {
      const test = button.getAttribute("data-aegis-test");
      const buttons = [...panel.querySelectorAll("[data-aegis-test]")];
      buttons.forEach((control) => control.disabled = true);
      steps.forEach((step, index) => step.classList.toggle("is-current", index === 1));
      result.className = "aegis-flow-result is-checking";
      result.innerHTML = '<p class="aegis-flow-label">POLICY OUTCOME</p><strong>Checking delegation…</strong><p>AEGIS is evaluating the request before Payroll Ledger receives it.</p>';
      try {
        const response = await fetch("/api/detector/analyze", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(presets[test]) });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "The policy check could not be completed.");
        const blocked = data.decision === "ALERT";
        steps.forEach((step, index) => { step.classList.toggle("is-complete", index < 2); step.classList.toggle("is-current", index === 2); });
        result.className = `aegis-flow-result ${blocked ? "is-blocked" : "is-allowed"}`;
        result.innerHTML = "";
        const label = document.createElement("p"); label.className = "aegis-flow-label"; label.textContent = "POLICY OUTCOME";
        const headline = document.createElement("strong"); headline.textContent = blocked ? "BLOCKED BEFORE PAYROLL" : "VERIFIED FOR RELEASE";
        const explanation = document.createElement("p"); explanation.textContent = data.explanation;
        const detail = document.createElement("small"); detail.textContent = `${data.matchedConditions}/5 signals · ${data.runId}`;
        const event = document.createElement("div"); event.className = "aegis-live-event"; event.innerHTML = "<i></i> Decision receipt recorded";
        const next = document.createElement("div"); next.className = "aegis-result-links";
        next.innerHTML = '<a href="?stage=4#aegis-enforcement-path">Review permissions →</a><a href="?stage=8#aegis-enforcement-path">Open evidence ledger →</a>';
        result.append(label, headline, explanation, detail, event, next);
      } catch (error) {
        result.className = "aegis-flow-result is-error";
        result.innerHTML = '<p class="aegis-flow-label">POLICY OUTCOME</p><strong>Check unavailable</strong><p></p>';
        result.querySelector("p:last-child").textContent = error instanceof Error ? error.message : "The policy check could not be completed.";
      } finally {
        buttons.forEach((control) => control.disabled = false);
      }
    }));
    panel.querySelectorAll("[data-aegis-tool]").forEach((button) => button.addEventListener("click", async () => {
      const tool = button.getAttribute("data-aegis-tool");
      const controls = [...panel.querySelectorAll("[data-aegis-tool]")];
      controls.forEach((control) => control.disabled = true);
      result.className = "aegis-flow-result is-checking";
      result.innerHTML = '<p class="aegis-flow-label">POLICY OUTCOME</p><strong>Verifying protected request…</strong><p>AEGIS is evaluating the requested business action.</p>';
      try {
        const request = tool === "payroll-summary"
          ? fetch("/api/aegis/requests", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ scenario: "payroll-summary", actor: "demo-agent", period: "2026-09" }) })
          : fetch("/api/aegis/approval-requests", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "recovery-vault", requesterRole: "analyst" }) });
        const response = await request;
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "The policy check could not be completed.");
        const approval = data.decision === "APPROVAL";
        result.className = `aegis-flow-result ${approval ? "is-approval" : "is-allowed"}`;
        result.innerHTML = "";
        const label = document.createElement("p"); label.className = "aegis-flow-label"; label.textContent = `DECISION · ${data.decision}`;
        const headline = document.createElement("strong"); headline.textContent = approval ? "HUMAN APPROVAL REQUIRED" : "MASKED RESULT RELEASED";
        const explanation = document.createElement("p"); explanation.textContent = data.summary;
        const detail = document.createElement("small"); detail.textContent = `${data.policy || "recovery-vault-gate"} · ${data.requestId || data.approvalId}`;
        const event = document.createElement("div"); event.className = "aegis-live-event"; event.innerHTML = "<i></i> Decision receipt recorded";
        const next = document.createElement("div"); next.className = "aegis-result-links";
        next.innerHTML = approval
          ? '<a href="?stage=4#aegis-enforcement-path">Review permission scope →</a><a href="/integrations">View authenticated events →</a>'
          : '<a href="?stage=8#aegis-enforcement-path">Open evidence ledger →</a><a href="/integrations">View authenticated events →</a>';
        result.append(label, headline, explanation, detail, event, next);
      } catch (error) {
        result.className = "aegis-flow-result is-error";
        result.innerHTML = '<p class="aegis-flow-label">POLICY OUTCOME</p><strong>Check unavailable</strong><p></p>';
        result.querySelector("p:last-child").textContent = error instanceof Error ? error.message : "The policy check could not be completed.";
      } finally {
        controls.forEach((control) => control.disabled = false);
      }
    }));
  }
  function installCompactBackend() {
    if (document.getElementById("aegis-compact-backend")) return;
    const backendStyle = document.createElement("link");
    backendStyle.rel = "stylesheet";
    backendStyle.href = "/deputy-prototype/professional.css?backend=2";
    document.head.append(backendStyle);
    document.body.classList.add("aegis-compact-backend");
    const view = document.createElement("main");
    view.id = "aegis-compact-backend";
    view.setAttribute("aria-label", "AEGIS security control room");
    view.innerHTML = `
      <header class="aegis-backend-header"><a class="aegis-backend-brand" href="/deputy-prototype/index.html?backend=1" aria-label="AEGIS control room"><span>◈</span><b>AEGIS</b><small>SECURITY CONTROL ROOM</small></a><div><a class="aegis-backend-link" href="/deputy-prototype/index.html">Full detector</a><span class="aegis-backend-live"><i></i> Policy gateway online</span></div></header>
      <section class="aegis-backend-intro"><div><p>OPERATOR BACKEND</p><h1>Northstar Finance protection</h1><span>Enforce a policy decision before payroll access is released.</span></div><a href="https://northstar-finance-demo.onrender.com/payroll" target="_blank" rel="noopener noreferrer">Open payroll vault ↗</a></section>
      <section class="aegis-backend-stats" aria-label="Security status"><article><span>RISK POSTURE</span><strong>GUARDED</strong><small>Payroll boundary protected</small></article><article><span>ACCESS REQUESTS</span><strong>01</strong><small>Review pending</small></article><article><span>PAYROLL DATA</span><strong>MASKED</strong><small>Owner verification required</small></article><article><span>DECISION LOG</span><strong data-aegis-log-count>00</strong><small>This session</small></article></section>
      <section class="aegis-backend-grid">
        <article class="aegis-backend-card aegis-backend-action"><div class="aegis-backend-card-head"><div><p>ACCESS DECISION</p><h2>Test a delegated request</h2></div><span>SERVER-SIDE</span></div><p>AEGIS checks identity propagation and sensitive authority before Payroll Ledger is reached.</p><div class="aegis-backend-actions"><button type="button" data-aegis-compact-test="unsafe">Block unsafe request</button><button type="button" data-aegis-compact-test="safe">Verify safe request</button></div><div class="aegis-backend-result" aria-live="polite"><strong>Ready for review</strong><span>Select a request to record a policy decision.</span></div></article>
        <article class="aegis-backend-card"><div class="aegis-backend-card-head"><div><p>PAYROLL PROTECTION</p><h2>Restricted company data</h2></div><span class="aegis-backend-mask">MASKED</span></div><dl class="aegis-backend-fields"><div><dt>Data source</dt><dd>Northstar Payroll Vault</dd></div><div><dt>Default handling</dt><dd>Masked at retrieval</dd></div><div><dt>Unmask authority</dt><dd>Verified Finance owner</dd></div></dl><a class="aegis-backend-primary-link" href="https://northstar-finance-demo.onrender.com/payroll" target="_blank" rel="noopener noreferrer">Open protected payroll folder ↗</a></article>
        <article class="aegis-backend-card"><div class="aegis-backend-card-head"><div><p>APPROVALS</p><h2>Recovery access</h2></div><span class="aegis-backend-pending">PENDING</span></div><p>A sensitive recovery-vault request is paused until a named approver reviews it.</p><button type="button" class="aegis-backend-outline" data-aegis-compact-approval>Request approval</button><div class="aegis-backend-approval" aria-live="polite">No approval requested in this session.</div></article>
        <article class="aegis-backend-card"><div class="aegis-backend-card-head"><div><p>AUDIT</p><h2>Decision activity</h2></div><span>SESSION</span></div><ol class="aegis-backend-log" aria-live="polite"><li><time>NOW</time><span>Control room opened</span><b>READY</b></li></ol><small class="aegis-backend-note">Session activity is shown here. Durable evidence is retained only when a configured integration records it.</small></article>
      </section>`;
    document.body.append(view);
    const log = view.querySelector(".aegis-backend-log");
    const count = view.querySelector("[data-aegis-log-count]");
    let decisions = 0;
    const addLog = (label, status) => { decisions += 1; count.textContent = String(decisions).padStart(2, "0"); const item = document.createElement("li"); const time = document.createElement("time"); time.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); const text = document.createElement("span"); text.textContent = label; const badge = document.createElement("b"); badge.textContent = status; item.append(time, text, badge); log.prepend(item); };
    const result = view.querySelector(".aegis-backend-result");
    const presets = { unsafe: { callerService: "Expense Intake API", deputyService: "Finance Orchestrator", sensitiveResource: "Payroll Ledger", callerCanInvokeDeputy: true, deputyUsesOwnIdentity: true, callerContextPropagated: false, resourceAuthorizesDeputyOnly: true, deputyHasSensitiveScope: true }, safe: { callerService: "Expense Intake API", deputyService: "Finance Orchestrator", sensitiveResource: "Payroll Ledger", callerCanInvokeDeputy: true, deputyUsesOwnIdentity: false, callerContextPropagated: true, resourceAuthorizesDeputyOnly: false, deputyHasSensitiveScope: false } };
    view.querySelectorAll("[data-aegis-compact-test]").forEach((button) => button.addEventListener("click", async () => {
      const kind = button.getAttribute("data-aegis-compact-test"); view.querySelectorAll("[data-aegis-compact-test]").forEach((control) => { control.disabled = true; }); result.dataset.state = "checking"; result.innerHTML = "<strong>Evaluating request…</strong><span>Policy gateway is checking delegated authority.</span>";
      try { const response = await fetch("/api/detector/analyze", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(presets[kind]) }); const data = await response.json(); if (!response.ok) throw new Error(data.error || "Policy check unavailable."); const blocked = data.decision === "ALERT"; result.dataset.state = blocked ? "blocked" : "allowed"; result.innerHTML = `<strong>${blocked ? "BLOCKED BEFORE PAYROLL" : "VERIFIED FOR RELEASE"}</strong><span></span>`; result.querySelector("span").textContent = data.explanation; addLog(blocked ? "Unsafe delegated payroll request blocked" : "Verified payroll request released", blocked ? "BLOCKED" : "ALLOW"); }
      catch (error) { result.dataset.state = "error"; result.innerHTML = "<strong>Policy check unavailable</strong><span></span>"; result.querySelector("span").textContent = error instanceof Error ? error.message : "Policy check unavailable."; addLog("Policy check could not complete", "ERROR"); }
      finally { view.querySelectorAll("[data-aegis-compact-test]").forEach((control) => { control.disabled = false; }); }
    }));
    const approvalButton = view.querySelector("[data-aegis-compact-approval]"); const approval = view.querySelector(".aegis-backend-approval");
    approvalButton.addEventListener("click", async () => { approvalButton.disabled = true; approval.textContent = "Submitting the review request…"; try { const response = await fetch("/api/aegis/approval-requests", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "recovery-vault", requesterRole: "analyst" }) }); const data = await response.json(); if (response.status === 401) { approval.innerHTML = '<a href="/api/auth/google">Sign in with Google to request approval →</a>'; addLog("Approval requires an authenticated operator", "SIGN IN"); return; } if (!response.ok) throw new Error(data.error || "Approval request unavailable."); approval.textContent = `Approval ${data.approvalId} is pending named Finance Security review.`; addLog("Recovery-vault approval submitted", "PENDING"); } catch (error) { approval.textContent = error instanceof Error ? error.message : "Approval request unavailable."; addLog("Approval request could not complete", "ERROR"); } finally { approvalButton.disabled = false; } });
  }

  // The recovered client bundle hydrates after this deferred file. Install
  // after hydration (with one bounded retry) so React does not replace the
  // extension surface with its original static tree.
  const compactBackend = new URLSearchParams(location.search).get("backend") === "1";
  const installExtensions = () => { if (compactBackend) installCompactBackend(); else { install(); installEnforcementPath(); } };
  if (document.readyState === "complete") installExtensions();
  else window.addEventListener("load", installExtensions, { once: true });
  window.setTimeout(installExtensions, 750);
  const stage = new URLSearchParams(location.search).get("stage");
  if (!compactBackend && stage && /^\d$/.test(stage) && Number(stage) < 9) {
    const requestedStage = Number(stage);
    // The recovered client replaces its sidebar while hydrating. Re-apply the
    // requested stage after hydration so workflow links never fall back to
    // Microservices on a slower public load.
    const select = () => {
      const buttons = document.querySelectorAll('[data-sidebar="menu-button"]');
      const target = buttons[requestedStage];
      if (target && target.getAttribute("data-active") !== "true") target.click();
    };
    const selectAfterHydration = () => {
      requestAnimationFrame(() => requestAnimationFrame(select));
      [250, 800, 1600].forEach((delay) => window.setTimeout(select, delay));
    };
    if (document.readyState === "complete") selectAfterHydration();
    else window.addEventListener("load", selectAfterHydration, { once: true });
  }
})();
