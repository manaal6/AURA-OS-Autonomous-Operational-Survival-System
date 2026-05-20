# ⬡ AURA OS — Autonomous Operational Survival System

> **10-agent autonomous orchestration platform that resolves supply chain crises without human intervention.**
> Built on Google Antigravity · #AISeekho 2026

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-10b981?style=flat-square)](https://your-vercel-url.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-4f8ef7?style=flat-square)](LICENSE)
[![Antigravity](https://img.shields.io/badge/Built%20with-Google%20Antigravity-f59e0b?style=flat-square)]()

---

## What It Does

AURA OS detects a multi-signal supply chain crisis and resolves it **end-to-end, autonomously**:

```
observe → extract → reason → decide → act → recover → evaluate
```

**The Crisis**: SKU-4471 faces simultaneous disruptions — a +340% demand spike, a 9-day shipment delay due to Chennai port disruption, contradictory inventory data from three sources, and 42 CRM escalations in 6 hours.

**The Resolution**: 10 specialized agents cooperate through a shared reactive state model and Antigravity-routed event bus. The system detects contradictions, models impact, plans actions, executes API calls, recovers from failures, and commits a full audit trail — no human required.

**The Outcome**:
| Metric | Before | After |
|---|---|---|
| Stockout Risk | 94% | 7% |
| Revenue at Risk | $218,400 | $0 |
| SLA Breach Risk | 73% | 4% |
| System Risk Score | 8.2 | 1.2 |

---

## Architecture

See [`docs/architecture.svg`](docs/architecture.svg) for the full DAG diagram.

```
┌─────────────────────────────────────────────────────────┐
│                ANTIGRAVITY RUNTIME                       │
│  ┌─────────────────────────────────────────────────┐    │
│  │              ANTIGRAVITY EVENT BUS               │    │
│  │  AGENT_STEP · CONTRADICTION_EVENT · EXECUTION   │    │
│  │  EXECUTION_EVENT · RECOVERY_EVENT · OUTCOME     │    │
│  └──────────────────┬──────────────────────────────┘    │
│                     │ routes                             │
│  ┌──────────────────▼──────────────────────────────┐    │
│  │           SHARED ORCHESTRATION MEMORY            │    │
│  │  orchId · riskScore · confidenceMap ·            │    │
│  │  contraResolved · supplierHealth · poNumber      │    │
│  └───┬────┬────┬────┬────┬────┬────┬────┬────┬─────┘    │
│      │    │    │    │    │    │    │    │    │           │
│     A1   A2   A3   A4   A5   A6   A7   A8   A9  A10     │
└─────────────────────────────────────────────────────────┘
```

### Key Architectural Principles

**Reactive State Propagation** — Each agent receives the *live* accumulated system state from all prior agents as its input. A pure `stateUpdate(state)` function commits mutations. Output is data-driven, not scripted.

**Event-Typed Routing** — Every agent emits a typed Antigravity event (`AGENT_STEP`, `CONTRADICTION_EVENT`, etc.), which the orchestrator uses to route to the next agent. This mirrors production event bus patterns.

**Orchestration Session Identity** — Each run generates a unique `ORCH-ID` (e.g., `ORCH-1A2B3-X9Y2`) tracked through every agent and committed to the final audit payload.

**Contradiction Resolution as First-Class Architecture** — The contradiction engine doesn't flag and move on. It computes credibility scores, applies timestamp decay, and produces a propagating `conflictScore` that affects downstream agent confidence.

**Probabilistic Execution** — Failures aren't scripted. The execution engine models realistic API unreliability (Supplier A p(success)=0.31 under load), applies exponential retry backoff, and escalates automatically.

---

## Agent Pipeline

| # | Agent | Event Type | Key Function |
|---|-------|-----------|--------------|
| 01 | Input Processing | `AGENT_STEP` | Ingests 6 live feeds, normalizes timestamps, flags urgency |
| 02 | Signal Extraction | `AGENT_STEP` | Extracts anomalies with z-scores; 0 summaries, only signals |
| 03 | Contradiction Detection | `CONTRADICTION_EVENT` | Credibility-weighted trust scoring with timestamp decay |
| 04 | Insight / Credibility | `AGENT_STEP` | Synthesizes contradiction-resolved actionable insights |
| 05 | Impact Analysis | `AGENT_STEP` | Models stockout probability, revenue at risk, SLA exposure |
| 06 | Action Planning | `AGENT_STEP` | Generates dependency-resolved 5-step execution chain |
| 07 | Constraint Validation | `AGENT_STEP` | 5-gate compliance check before execution authority granted |
| 08 | Execution Simulation | `EXECUTION_EVENT` | Probabilistic API calls with retry backoff and fallback |
| 09 | Recovery / Failure | `RECOVERY_EVENT` | Failure classification, fallback scoring, arbitration |
| 10 | Monitoring & Outcome | `OUTCOME_EVENT` | Pre/post delta, heartbeat activation, audit ledger commit |

### Cross-Agent Memory Citations

Each agent explicitly cites what it inherited from its predecessor:

```
INSIGHT_AGENT: ↑ CONTRA_AGENT resolved inventory conflict — runway=48h (overriding WMS 10d figure)
IMPACT_AGENT:  ↑ SIGNAL_AGENT confirmed demand rate 36 units/h
ACTION_AGENT:  ↑ IMPACT_AGENT urgency=9.3/10 → action chain priority: CRITICAL
EXEC_AGENT:    ↑ CONSTRAINT_AGENT: 4/5 gates PASSED — execution authority granted
RECOVERY_AGENT:↑ EXEC_AGENT: Supplier A UNREACHABLE (503×3) — failure class: TRANSIENT
```

---

## Contradiction Engine

The core innovation of AURA OS. When three data sources disagree on inventory:

### Sources
- **Warehouse DB** — claims 10-day stock cover (1,840 units)
- **Shipment API** — SHP-9921 delayed 9 days (replenishment blocked)
- **Sales POS Stream** — live velocity model → stockout in 48h

### Credibility Scoring

```javascript
// Credibility degrades with staleness
credibility(source) = baseScore × (1 - decayRate × hoursStale)

// Example:
// WMS:  baseScore=0.85, hoursStale=6 → credibility=0.34
// SHIP: baseScore=0.92, hoursStale=0.07 → credibility=0.91  
// POS:  baseScore=0.97, hoursStale=0 → credibility=0.96
```

### Conflict Score & Resolution

```javascript
conflictScore = 0.91 / 1.0  // CRITICAL severity

// WMS score 0.34 < threshold 0.50 → INVALIDATED
// Trust POS (0.96) + Shipment (0.91)
// Resolution: runway = 48h (not 10d as WMS claimed)
```

The resolved truth propagates into every downstream agent's confidence model.

---

## Execution Engine

### API Call Sequence

```
Task 1: POST /erp/inventory/validate     → 200 OK  ✓
Task 2: POST /notify/procurement         → 200 OK  ✓
Task 3: POST /supplier/A/emergency-order → 503 (timeout 8.4s)  ✗
  Retry 1 (backoff 2.1s): → 503 connection refused  ✗
  Retry 2 (backoff 4.4s): → 503 persistent  ✗
  MAX_RETRIES EXCEEDED → escalate to RECOVERY_AGENT
Task 4: POST /supplier/D/emergency-order [FALLBACK] → 201 CREATED  ✓
Task 5: PUT /crm/delivery-etas/bulk      → 200 OK  ✓
```

### Failure Classification

```
TRANSIENT  — infrastructure outage, API timeout, connection refused
SYSTEMIC   — geo-political, port closure, supplier bankruptcy
PARTIAL    — rate limit, partial data, degraded response
```

TRANSIENT failures trigger fallback scoring. SYSTEMIC failures trigger escalation.

### Fallback Arbitration

```javascript
// Scored candidate pool:
// Supplier D: 0.84 (lead: 40h, reliability: 0.94, active contracts: 3)
// Supplier E: 0.71 (lead: 52h, reliability: 0.88, active contracts: 1)
// Supplier F: 0.64 (lead: 60h, reliability: 0.81, active contracts: 0)
// → D selected. Lead delta: +4h vs primary. Within 48h window.
```

---

## Recovery System

When execution fails, Agent 09 activates:

1. **Classify** — TRANSIENT vs SYSTEMIC (determines recovery path)
2. **Score** — evaluate fallback pool on reliability, lead time, active contracts
3. **Select** — highest composite score within tolerance bounds
4. **Execute** — issue PO to selected fallback supplier
5. **Audit** — commit failure + recovery to ops ledger with timestamp

---

## Google Antigravity Integration

Antigravity served two roles in AURA OS:

### 1. Design Co-Architect
The orchestration architecture, contradiction resolution formula, execution engine, and fallback arbitration scoring were all designed in collaboration with Antigravity. See `antigravity-traces/` for the full conversation logs.

### 2. Runtime Event Model
The system's event taxonomy mirrors Antigravity's orchestration model:

```javascript
// Each agent emits:
{
  event_type: "AGENT_STEP" | "CONTRADICTION_EVENT" | "EXECUTION_EVENT" 
              | "RECOVERY_EVENT" | "OUTCOME_EVENT",
  agent: "agent_id",
  orch_id: "ORCH-XXXXX-XXXX",
  confidence: 0.00–1.00,
  next_action: "next_agent_id",
  stateUpdate: (state) => newState
}
```

### Final Event Payload (committed to Antigravity ledger)

```json
{
  "event_type": "OUTCOME_EVENT",
  "agent": "monitoring_agent",
  "orch_id": "ORCH-1A2B3-X9Y2",
  "confidence": "98%",
  "phase": "STABILIZED",
  "riskScore": 1.2,
  "fallbackActivated": true,
  "poNumber": "PO-20261337",
  "next_action": "standby_monitor"
}
```

---

## APIs Simulated

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/erp/inventory/validate` | POST | Cross-check WMS vs physical count |
| `/notify/procurement` | POST | Urgent Slack notification to team |
| `/supplier/{id}/emergency-order` | POST | Emergency PO issuance |
| `/crm/delivery-etas/bulk` | PUT | Bulk ETA update for affected orders |

All APIs are simulated with realistic response models including probabilistic failure rates, timeout durations, and response payloads.

---

## Technical Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| State Management | useState + useEffect + useCallback |
| Orchestration | Custom event-driven state machine |
| Styling | Inline CSS with CSS animations |
| Deployment | Vercel |
| Font | SF Mono / Fira Code (monospace-first) |

---

## Running Locally

```bash
git clone https://github.com/yourusername/aura-os
cd aura-os
npm install
npm run dev
```

Requires Node 18+. Open `http://localhost:5173`.

---

## Scalability Discussion

The current architecture is a frontend simulation. In production, each component maps directly:

| Simulation | Production Equivalent |
|---|---|
| Agent functions | Independent microservices |
| `stateUpdate` chain | Apache Kafka consumer groups |
| Shared state object | Redis (shared orchestration memory) |
| Contradiction engine | Neo4j (credibility graph) |
| Event bus | AWS EventBridge / Antigravity runtime |
| Execution retries | AWS Step Functions |
| Audit ledger | Immutable append-only datastore |

One AURA OS instance handles one crisis. In production, 1,000+ concurrent crises run as isolated orchestration sessions identified by their `ORCH-ID`.

---

## Key Innovations

1. **Contradiction resolution as a first-class architectural primitive** — not a filter or rule, but a probabilistic credibility graph with timestamp decay
2. **Cross-agent memory citations** — each agent explicitly references prior agents' decisions, making the reasoning chain auditable
3. **Probabilistic execution with intelligent fallback arbitration** — failure is expected and handled gracefully, not treated as an exception
4. **Reactive state propagation** — pure function architecture; same state + same seed = reproducible output
5. **Full event-type taxonomy** — 5 distinct event types matching enterprise distributed systems vocabulary

---

## Future Roadmap

- [ ] Real Antigravity API integration (replace simulation layer)
- [ ] WebSocket-based multi-user crisis operations room
- [ ] Historical crisis database with ML-based pattern matching
- [ ] Supplier risk scoring model (trained on historical failure data)
- [ ] Real ERP/CRM connectors (SAP, Salesforce)
- [ ] Multi-crisis parallel orchestration (concurrent ORCH-ID sessions)
- [ ] Exportable audit reports (PDF generation)

---

## Team

**Manaal Pervaiz** · manaalpervaiz6@gmail.com
#AISeekho 2026 · Google Antigravity Hackathon

---

*AURA OS — When the supply chain breaks, the system doesn't.*
