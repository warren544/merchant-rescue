# Merchant Rescue

Merchant Rescue is a synthetic cafe device-ops demo. It moves one P&L line—lost sales per hour of POS downtime—without claiming that revenue was recovered. Enter an hourly estimate from a real cafe or retail owner; the app shows only “sales at risk” and labels the estimate.

## Run

Requires Node 22.20+ (Node 24.20.0 was available during this build).

```powershell
npm install
Copy-Item .env.example .env.local
# Add ZOOWORK_API_KEY and ZOOWORK_AGENT_ID to .env.local only when the sponsor provides them.
npm run dev
```

Open http://localhost:3000. `npm test` runs the safety tests and `npm run build` verifies the production build.

## ZooWork integration

The requested `npx skills add SerendipityOneInc/zoowork-sdk-skills` command was attempted, but the local npx shim failed because `npm/bin/npx-cli.js` is missing. `npm exec` also produced no installed skill. The public publisher material was used as a fallback: [ZooWork quickstarts](https://github.com/SerendipityOneInc/zoowork-quickstarts), [ZooWork managed-agent skill](https://www.skills.sh/serendipityoneinc/zoowork-sdk-skills/zoowork-managed-agents), and [ZooWork docs repository](https://github.com/SerendipityOneInc/zoowork-agents-docs). The live overview URL was opened through the browser tool but was inaccessible there, so the current docs page remains an integration blocker to verify before submission.

The adapter follows the documented managed-agent concepts: agent ID + session, server-side Bearer key, user-message event, durable events stream, real session ID, and explicit failure if no structured diagnosis returns. It does not expose restart or dispatch tools to ZooWork. The qualifying path is labeled `ZooWork live` only when both env values exist. Without them the UI says `Fixture rehearsal - no live ZooWork call`.

## Synthetic scenarios

- `INC-101`: fresh POS link-down evidence → one operator-approved simulated restart → separate follow-up heartbeat after 2 seconds.
- `INC-102`: repeated printer jams → one internal sandbox inspection ticket; no technician dispatch or repair claim.
- `INC-103`: active transaction → `ESCALATE_ONLY`; restart is unavailable and the server also refuses a malicious direct approval.

All telemetry, fault codes, policies, tickets, actions, and money examples are synthetic. Reset recreates fixture state and does not erase the in-memory audit list in a persistent database because this MVP intentionally uses a server memory store; a process restart resets everything.

## Monday test

1. A cafe owner connects their reader/printer status feed.
2. Real today: the ZooWork diagnosis agent, operator approval gate, verification state, and audit record.
3. Synthetic today: telemetry, device actions, and ticket records.

## Tests and limitations

Tests cover a valid approval, separate verification, active-transaction refusal, stale evidence, changed evidence, duplicate approval, rejection, and printer ticket restraint. A live ZooWork call, sponsor credentials/credits, mobile visual QA, and organizer submission flow were not testable in this environment. Do not use this MVP with live payments, devices, customers, dispatches, or purchases.
