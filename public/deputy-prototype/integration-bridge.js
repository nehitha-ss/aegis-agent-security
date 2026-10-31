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
  }

  function installEnforcementPath() {
    const workspace = document.querySelector("main main");
    if (!workspace || document.getElementById("aegis-enforcement-path")) return;

    const panel = document.createElement("section");
    panel.id = "aegis-enforcement-path";
    panel.setAttribute("aria-label", "AEGIS three-step enforcement path");
    panel.innerHTML = `
      <div class="aegis-flow-header">
        <div><p class="aegis-flow-kicker">LIVE POLICY CHECKPOINT</p><h2>AEGIS enforcement path</h2><p>AEGIS evaluates the delegation request before the simulated Payroll Ledger boundary.</p></div>
        <span class="aegis-flow-badge">FICTIONAL DEMO</span>
      </div>
      <ol class="aegis-flow-steps" aria-label="Request processing steps">
        <li class="is-current"><span>01</span><strong>Request enters AEGIS</strong><small>Expense Intake requests payroll validation through Finance.</small></li>
        <li><span>02</span><strong>AEGIS verifies delegation</strong><small>Identity, caller context, downstream trust, and sensitive scope are checked.</small></li>
        <li><span>03</span><strong>Payroll access is decided</strong><small>AEGIS allows a verified request or blocks the deputy path before access.</small></li>
      </ol>
      <div class="aegis-flow-actions">
        <div><p class="aegis-flow-label">OPERATOR TEST</p><p class="aegis-flow-copy">Send a fictional request through the same server-side detector used by this prototype.</p><div class="aegis-flow-buttons"><button type="button" data-aegis-test="unsafe">Test unsafe request</button><button type="button" data-aegis-test="safe">Test verified request</button></div><p class="aegis-flow-note">Unsafe: Finance substitutes its own payroll identity. Verified: the caller context is retained and deputy-only payroll authority is removed.</p></div>
        <div class="aegis-flow-result" aria-live="polite"><p class="aegis-flow-label">POLICY OUTCOME</p><strong>Ready for evaluation</strong><p>Choose a test to calculate the policy decision.</p></div>
      </div>`;
    workspace.prepend(panel);

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
        result.append(label, headline, explanation, detail);
      } catch (error) {
        result.className = "aegis-flow-result is-error";
        result.innerHTML = '<p class="aegis-flow-label">POLICY OUTCOME</p><strong>Check unavailable</strong><p></p>';
        result.querySelector("p:last-child").textContent = error instanceof Error ? error.message : "The policy check could not be completed.";
      } finally {
        buttons.forEach((control) => control.disabled = false);
      }
    }));
  }
  // The recovered client bundle hydrates after this deferred file. Install
  // after hydration (with one bounded retry) so React does not replace the
  // extension surface with its original static tree.
  const installExtensions = () => { install(); installEnforcementPath(); };
  if (document.readyState === "complete") installExtensions();
  else window.addEventListener("load", installExtensions, { once: true });
  window.setTimeout(installExtensions, 750);
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
