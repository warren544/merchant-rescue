MERCHANT RESCUE: COPY-READY CODEX / CURSOR BUILD SPEC
Prepared October 3, 2026

Paste this entire file into Codex or Cursor in your project folder.

You are implementing a solo hackathon MVP, not writing another planning document. Inspect the repo, choose the smallest workable approach, and start building. Keep a short checklist and run the app and tests before calling it done.

1. THE PRODUCT

Build "Merchant Rescue": a device-ops agent for a small cafe whose checkout is interrupted by a POS connectivity drop or receipt-printer jam.

The story: "A cafe loses checkout connectivity during lunch. Merchant Rescue checks the evidence and the merchant's safety rules, proposes a safe next step, asks the operator, and records what happened. When a printer needs physical repair, it prepares a targeted service ticket instead of repeatedly restarting it."

The user is a merchant operator, not a bank. Make checkout continuity, operator control, and repair handoff obvious. Do not build an ATM fleet dashboard, cash forecasting, computer vision, a payments app, or real remote device control. Cash dispensers, skimmer detection, predictive wear models, technician routing, and SIM failover are out of MVP scope. Show cash/hardware-jam extensibility only in the README, not as unfinished UI.

Confirmed requirements supplied by Warren:
- Commerce related.
- Must use ZooWork.ai.
- Judging: approach & idea, technical execution, design, X factor, presentation.
- Solo build; submission deadline 5pm today. Aim for a ready submission at 4:30pm.

These criteria are not weighted here because no weights were supplied.

All stores, telemetry, fault codes, policies, tickets, action outcomes, and monetary examples are synthetic. No actual checkout, payments, devices, customer messages, dispatches, or purchases. Do not collect card numbers or PINs. Do not claim actual recovered revenue, proven diagnosis accuracy, or predictive maintenance.

2. STACK AND SCOPE

First inspect the existing repo. Keep its stack if usable. For an empty repo, default to Next.js + TypeScript, a single page, server API routes, Zod validation, and minimal CSS. Use the existing package manager. Avoid extra libraries unless they remove work.

Use local JSON seed fixtures and a small server-side store. An in-memory store is acceptable for one local demo if its reset/restart limitation is documented; a tiny local SQLite store is better only if already easy in this repo. One demo operator, no auth UI, no multi-tenancy, no deployment requirement unless organizers ask. Bind local-only by default. If deployed, protect mutation routes with an operator session or server-checked demo access gate; do not expose unauthenticated action endpoints publicly.

Spend effort on one finished screen, one real ZooWork diagnosis run, a guarded approval flow, and a second scenario that demonstrates restraint. Do not spend the morning designing abstractions.

3. ZOOWORK IS THE REAL AGENT RUNTIME

Verified official starting point:
https://zoowork.ai/docs/en/get-started/overview

As checked October 3, the overview describes Managed Agents, Agent/Session/Event resources, TypeScript/Python SDK or HTTP API, application-executed tools, saved events and streaming. It says the API is in developer preview and may change. It also says getting started involves an API key and funds. Do not assume free access, available credits, SDK names, endpoint paths, event payloads, or a particular approval API.

Before implementing any ZooWork call:
- Open the overview and follow its current Quickstart, Agent configuration, tool, Start a session, and Events and streaming links.
- Record the actual documentation URLs and dependency versions you used in README.
- Use the documented SDK or HTTP API. Never invent an import, method, endpoint, tool schema, event name, or field.
- Keep the API key in server environment variables only. Provide .env.example with an empty placeholder. Never print secrets or commit .env. Ask the developer to enter a key through their local secret setup, not into a prompt or source file.
- Run a minimal actual ZooWork request immediately, before polishing the UI.
- If account/credits/access block this for 20 minutes, ask the sponsor mentor for the supported route or hackathon access. Do not auto-buy credits, promise an unsupported free tier, or quietly replace ZooWork with another provider.

Integration contract below is OUR application interface, not a ZooWork SDK contract:

diagnoseIncident(incidentId) -> a validated DiagnosisProposal plus real runtime evidence.

ZooWork must do the reasoning step: inspect supplied telemetry and policy/runbook evidence, select a permitted recommendation or escalation, and return evidence-backed reasoning. Prefer a real read-only tool loop using the current documented application-executed tool mechanism:
- getIncidentEvidence(incidentId)
- getRunbook(deviceType, faultCode)
- getMerchantPolicy(storeId)

Expose these narrowly scoped read tools only. If application-tool setup is too slow or unsupported in the available account, send the exact incident, runbook, and policy evidence in the real ZooWork session and have it produce a structured proposal. Document this as a context-fed diagnosis, not a tool-calling implementation. A live runtime call is still essential; ask the mentor if there are additional sponsor-use requirements.

The app, not the model, owns approvals and execution. Do not expose a privileged restart or dispatch tool to the model. No model text can count as operator approval.

Render real runtime evidence: actual session identifier if returned, real event timestamps, tool activity when it truly occurs, and the resulting proposal. Map actual documented events to short display labels; do not fabricate a trace. Inspect run termination fields before marking the diagnosis finished; stream closure alone is not success. Handle timeout, failure, invalid output, and incomplete/yielded runs explicitly. Closing a stream may not stop the run; follow documented cancellation behavior and prevent duplicate sessions on repeated clicks.

Deterministic fixture mode may help offline development and rehearse the UI. Always label it "Fixture rehearsal - no live ZooWork call". It is not the qualifying submission path. Recorded playback must say "Recorded ZooWork run" and cannot masquerade as live. If real ZooWork remains blocked, report that blocker clearly; do not claim the mandatory requirement is met.

4. SYNTHETIC FIXTURES

Use one synthetic store: Juniper Cafe, two checkout lanes. All device models are generic, not claimed vendor integrations. Fault codes below are invented demo codes with local demo runbooks, not real manufacturer codes.

Store policy:
- Never restart a terminal with an active transaction or unknown transaction state.
- One operator-approved restart attempt per incident at most.
- Only a POS connectivity fault with fresh evidence, no active transaction, and no tamper signal is eligible for the simulated restart.
- Printer jams require physical inspection; propose a sandbox service ticket, not remote clearing or a guaranteed part replacement.
- Tamper signals, unknown fault codes, stale/missing evidence, or contradictory telemetry require manual review.
- Service tickets are internal sandbox records only. No technician is contacted, scheduled, or charged.

Scenario A, "Checkout connection lost":
- incident id INC-101, device POS-01, checkout lane 1.
- fault DEMO_POS_LINK_DOWN; connection offline for 3 minutes.
- heartbeat observed 20 seconds before diagnosis; activeTransaction false.
- tamperSignal false; restartAttempts 0; evidenceVersion 1.
- recent demo history: connectivity drop, reconnect failed, no active sale.
- local runbook permits one operator-approved connection-service restart.
- expected proposal: SIMULATE_RESTART, with citations to these evidence fields and the policy. Say "likely connectivity-service issue" rather than claiming a proven cause.
- after approval, the simulator acknowledges the command. The UI stays "Verification pending" until a separate synthetic follow-up heartbeat is emitted 2 seconds later showing online status. Only then show "Recovered in simulation".

Scenario B, "Receipt printer jam":
- incident INC-102, device PRINTER-02, lane 2.
- fault DEMO_PAPER_PATH_JAM; repeatedJamCount 3 in 30 minutes.
- paperPresent true; observed 20 seconds ago; tamperSignal false.
- runbook: repeated jams need onsite inspection of paper loading/path and rollers; these logs do not establish a worn roller or a particular replacement part.
- expected proposal: CREATE_SANDBOX_TICKET. Ticket contains evidence, troubleshooting checklist, and suggested inspection items, not an invented confirmed repair.
- after approval, create exactly one local ticket. Device remains "Needs physical inspection". Do not mark it repaired or call this a scheduled dispatch.

Scenario C, "Sale in progress":
- clone A as INC-103, activeTransaction true.
- expected proposal: ESCALATE_ONLY. Show "Restart blocked: a sale is in progress". Offer a manual-review record, not an executable restart button. No automatic retries or changes to the transaction.

Optional developer-only safety fixture: unknown transaction state or tamperSignal true also blocks restart. Do not add extra demo screens.

Store observations as relative seconds or stamp them at fixture load, so they do not become stale merely because rehearsal happened earlier. Each incident keeps a stable id, evidence version, lifecycle status, and action count. Reset recreates the fixture state and clearly resets a demo run; it must not erase the operator's audit history by surprise.

5. PROPOSAL AND STATE MODEL

Define a typed proposal with:
- id, incidentId, evidenceVersion, createdAt, expiresAt.
- diagnosisSummary: cautious, evidence-backed hypothesis.
- evidenceRefs: exact keys/record ids used, not arbitrary invented quotes.
- missingEvidence: list, empty when none.
- recommendation: SIMULATE_RESTART | CREATE_SANDBOX_TICKET | ESCALATE_ONLY.
- rationale, safetyChecks, expectedOutcome, limits.

Use Zod or equivalent to validate the actual model result. Permit one bounded repair attempt for malformed structure using the real runtime if practical. If still invalid, show a clear failure and allow the operator to retry. Do not replace invalid output with a fake live result.

Validate evidence references against supplied fixtures. Unsupported statements should be omitted or flagged. Do not use a numeric "AI confidence" meter without calibration; use "Evidence sufficient for this demo action" or "Manual review required".

Lifecycle:
DETECTED -> DIAGNOSING -> AWAITING_APPROVAL -> EXECUTING -> VERIFYING -> RECOVERED_SIMULATION
or -> TICKET_CREATED
or -> MANUAL_REVIEW

Command acknowledgement is not recovery. Ticket creation is not device repair. Failed calls do not create success states. Rejecting a proposal records the rejection with no action.

Server approval/execution gate:
- Bind approval to the exact proposal, incident id, evidenceVersion, and action, not a generic incident approval.
- Re-read current device facts and policy immediately before execution.
- Refuse expired proposals (use a 5-minute demo expiry), changed evidence, an active/unknown transaction state, tamper, unsupported actions, or a previous restart attempt.
- "Fresh" in this synthetic demo means observed within 60 seconds. If stale, refresh through the simulator and rediagnose; do not change the threshold silently to pass.
- Always enforce policy on the server even if the LLM recommends something unsafe.
- Use an idempotency key derived from proposal id + action, and an atomic guard against double-click/concurrent execution. Return the stored action result on a repeated request.
- Record operator decision, proposal/evidence version, timestamps, chosen action, result, and verification observation in an append-only audit list.
- Disable buttons while requests run, but do not rely on UI disabling for safety.

Keep these mutation endpoints strictly local/sandbox. No vendor calls, no payments, no emails/SMS, no device administration, no real dispatch integrations.

6. ONE-PAGE DESIGN

Make a polished operator workspace, not a graph-heavy dashboard.

Header: "Merchant Rescue" and a persistent "Synthetic merchant data / Sandbox actions" badge. Separate runtime badge: "ZooWork live", "Recorded ZooWork run", or "Fixture rehearsal" based on reality, never just on whether a key exists.

Left: three scenario cards with device, checkout lane, issue, and status. Default select A. Include a "Load demo scenario" action and explicit reset.

Center: incident detail and a short real activity timeline:
1. Evidence received.
2. ZooWork diagnosis running.
3. Proposal ready.
4. Operator decision.
5. Sandbox action result.
6. Follow-up verification, where applicable.

Right: decision card with concise diagnosis, evidence, recommended action, safety checks, limitations, and "Approve sandbox action" / "Reject". For scenario C, show the blocked policy plainly and no restart button.

After execution show BEFORE / AFTER with exact state labels. For B show a readable ticket with evidence and checklist. A collapsible audit section reveals actual records without flooding the screen.

Use a light background, dark text, generous spacing, one restrained accent, and red only for faults/blocked actions. Use short labels, accessible contrast, readable type, keyboard-operable buttons, loading states, and a narrow-screen layout. No decorative charts, autoplay animations, stock photos, huge empty hero, or toast-only critical errors. Avoid color as the sole status signal.

X factor: visibly protect the merchant's sale. The same agent that proposes a helpful recovery refuses a restart during an active transaction. This is product differentiation to demonstrate, not an official promise of extra judging points.

7. BUILD ORDER AND TIME BOXES

If starting around 11am, use these targets. If starting later, preserve the order and cut polish, not the live integration or gates.

11:00-11:25: inspect repo, open current ZooWork docs, get a real minimal run working. Ask mentor promptly for access issues. Do not spend 25 minutes installing UI kits.
11:25-12:15: fixtures, policies, types, simulator, state store, server approval gate, idempotency.
12:15-1:15: actual ZooWork diagnosis adapter, validation, error handling, real evidence timeline. Happy path end to end by 1:15.
1:15-2:15: single screen, printer ticket, active-transaction refusal, clear mode badges.
2:15-3:00: tests and one full live run; fix errors, inspect actual screen at desktop and narrow width.
3:00: freeze features. Write README, rehearse, prepare a labeled recording as backup.
3:00-4:00: fix demo blockers, prepare submission material. At the published 4pm review, seek one specific improvement if the schedule still applies.
4:00-4:30: submit via the actual organizer instructions. Check submission format now; it is not assumed here. Leave 30 minutes before the stated 5pm deadline.

Do not build full hardware integrations, predictive models, billing, auth screens, map dispatch, fleet analytics, scheduling, live payment data, or third-party notifications.

8. TESTS AND ACCEPTANCE

Minimum automated tests:
- A: valid proposal + explicit approval yields one simulated restart, then separate verification updates state.
- A: command accepted but follow-up remains offline does NOT report recovery.
- C: active or unknown transaction blocks a restart, including a malicious direct API request bypassing UI.
- Tamper signal or stale/missing evidence blocks restart.
- Model recommends an action forbidden by policy: server refuses it.
- Changed evidenceVersion or expired proposal rejects approval and asks for rediagnosis.
- Double click/repeated/concurrent request yields one action or ticket, same result.
- Reject produces audit entry but no action.
- Printer ticket does not mark printer healthy or claim a technician was dispatched.
- ZooWork failure, timeout, invalid output, or unfinished run produces an honest error/pending state, not fabricated success.

Acceptance:
- Fresh checkout of repo can run from README instructions with example env file.
- At least one actual ZooWork run is completed and displayed with real evidence.
- No secret in client bundle, logs, screenshots, or git.
- A and C fit a 90-second demo; B works without extra setup.
- Actual screenshots have been inspected for readable layout, clipped content, and state consistency.
- README explains synthetic fault codes, sandbox-only actions, runtime integration route, verification behavior, known limitations, tests, and reset behavior.
- No unsupported business or hardware claims, hidden external effects, or paid API-credit purchase automation.

9. 90-SECOND DEMO

0-12s: "This cafe can't take orders on lane one. Merchant Rescue turns a device fault into a safe, operator-approved recovery. Everything here is synthetic; ZooWork is the actual diagnosis runtime."

12-35s: Select A, run diagnosis, show real ZooWork progress and the evidence. "The agent checks the incident and the policy. No sale is in progress, so one restart is eligible." Explain tool use only if actual tools were used; otherwise say the agent inspected the provided evidence.

35-55s: Approve. Show the sandbox command, verification pending, and then the new synthetic heartbeat. "It doesn't declare recovery from a command acknowledgement. It waits for the follow-up check."

55-75s: Select C. "Now the same fault happens during a sale." Show restart refused and the policy reason. No action executes.

75-90s: "For physical faults, it prepares a targeted inspection ticket instead of guessing a repair. We built a commerce workflow with actual ZooWork reasoning, explicit operator control, server-enforced safety, and an audit trail. Next step is a vendor sandbox and evaluation against real incident logs."

If the live runtime is slow, say so; do not fake streaming. Use a clearly labeled recording of a prior real run as backup and disclose it. Record a real completed run once the app works. Do not claim measured uptime gains, reduced repair costs, prediction accuracy, or recovered sales from these fixtures.

10. WHAT TO RETURN WHEN FINISHED

Return the run commands, completed checklist, tests actually run and results, current integration mode, real ZooWork documentation used, known blockers, and the shortest demo instructions. Mark anything untested as untested. Do not say "production ready".

Start now by inspecting the repo and validating ZooWork access. Implement the smallest finished version of this spec before adding anything else.
