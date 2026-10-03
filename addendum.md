MERCHANT RESCUE - ADDENDUM (paste after the main spec; this wins on any conflict)

Why: the hackathon deck says "Pick a real merchant. Pick one line of their P&L. Move it." and the bar for the ZooWork agent is one a merchant would pay for and could run on Monday. Judging: approach & idea, technical execution, design, X factor, presentation. Must use ZooWork.ai and be commerce related. Submit by 5pm. Top 5-8 present on the main stage at 6:15pm, so a polished live demo beats breadth.

1. P&L LINE (pitch + UI)
- The one line we move: lost sales per hour of POS downtime.
- Add a small input in the UI: "Merchant's lost sales per hour ($)". It starts EMPTY and the money banner stays hidden until a value is entered.
- The number must come from a real cafe/retail owner the builder talks to at the event. Never invent or default a figure. If none is gathered, the pitch says "ask any owner: what does one hour of POS down cost you?" and shows no dollar claim.
- Any dollar figure on screen is labeled "per merchant's own estimate". Never claim revenue actually recovered.
- Outage-time math: minutes down x (hourly figure / 60), shown as "sales at risk", not "saved".

2. BUILD WITH THE ZOOWORK SKILL
- First step, before writing app code: run
    npx skills add SerendipityOneInc/zoowork-sdk-skills
  then follow that skill and the current ZooWork docs (https://zoowork.ai/docs/en/get-started/overview). No invented SDK/API syntax.
- Requires Node 22.20 or newer. Check with: node -v
- API key comes from platform.zoowork.ai. Store it as ZOOWORK_API_KEY in a server-side .env file only. Never in client code, never committed, never in this repo's README or logs.
- Do not create accounts, add funds, or spend anything on the builder's behalf. If key or credit access blocks for 20 minutes, the builder asks the sponsor mentor.

3. RUN AS A ZOOWORK MANAGED AGENT, SHOW IT LIVE
- The diagnosis agent runs as a ZooWork managed agent (agent + session, per the current docs).
- Stream or poll the session events into a visible "Agent activity" panel on the main screen: tool calls, tool results, the final diagnosis. Show real events from the real session only. If anything is replayed, label it "REPLAY".
- Get one real ZooWork session returning a diagnosis within the first hour. Fixture-only mode does not meet the ZooWork requirement.
- If ZooWork documents commerce data or "ZooData" capabilities, use them only if they fit and are quick to wire. Check the docs first. Do not claim a ZooData integration that is not working.

4. DEMO MUST SHOW THE REFUSAL
- The 90-second demo includes this beat: a restart is proposed, a sale is in progress, and the agent REFUSES to restart, says why, and offers a safe alternative (wait for sale to end, or open a ticket).
- Order: (a) enter the merchant's real hourly number, (b) connectivity fault, agent diagnoses live, operator approves, follow-up heartbeat confirms recovery, (c) the refusal case, (d) printer-jam ticket, (e) close on the P&L line.
- Everything device-side stays labeled SYNTHETIC on screen.

5. MONDAY TEST (put on the last slide / README)
- Three lines: what a cafe owner does Monday to use it (connect their reader/printer status feed), what is real today (ZooWork agent, approval flow), what is synthetic today (telemetry, device actions).

6. TIME
- Submit by 5pm. Freeze features at 4:00pm. 4:00-4:45: rehearse the demo twice, fix only demo-breaking bugs. Prepare to present at 6:15pm if selected.
