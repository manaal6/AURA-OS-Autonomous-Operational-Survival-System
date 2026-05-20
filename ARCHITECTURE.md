# AURA OS — System Architecture

> Autonomous Operational Survival System · 10-Agent Reactive Orchestration Pipeline

---

## Overview

AURA OS implements a fully reactive, event-driven multi-agent orchestration pipeline. Each agent is a pure function that receives accumulated system state, performs its computation, and commits a state mutation. No agent has side effects outside its `stateUpdate` call. The pipeline is deterministic given a fixed random seed — same state, same output.

---

## Pipeline DAG

```
┌─────────────────────────────────────────────────────────────────┐
│                      ANTIGRAVITY RUNTIME                        │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  ANTIGRAVITY EVENT BUS                   │   │
│  │   AGENT_STEP · CONTRADICTION_EVENT · EXECUTION_EVENT    │   │
│  │   RECOVERY_EVENT · OUTCOME_EVENT                        │   │
│  └──────────────────────────┬──────────────────────────────┘   │
│                             │ routes typed events               │
│  ┌──────────────────────────▼──────────────────────────────┐   │
│  │               SHARED ORCHESTRATION MEMORY               │   │
│  │  orchId · riskScore · confidenceMap · contraResolved    │   │
│  │  supplierHealth · poNumber · fallbackActivated · phase  │   │
│  └──┬───┬───┬───┬───┬───┬───┬───┬───┬──────────────────────┘   │
│     │   │   │   │   │   │   │   │   │                          │
│    A1  A2  A3  A4  A5  A6  A7  A8  A9  A10                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Agent Specifications

### A1 — Input Processing Agent
- **Event Type**: `AGENT_STEP`
- **Input**: 6 raw data feeds (WMS, shipment API, POS stream, CRM, weather, port status)
- **Output**: Normalized, timestamped signal set with urgency flag
- **Key Logic**: Timestamp normalization, feed deduplication, urgency threshold gate

### A2 — Signal Extraction Agent
- **Event Type**: `AGENT_STEP`
- **Input**: Normalized feed from A1
- **Output**: Anomaly signals with z-scores; no summaries, only deviations
- **Key Logic**: Z-score computation on demand velocity; demand rate extracted as `units/hour`

### A3 — Contradiction Detection Agent
- **Event Type**: `CONTRADICTION_EVENT`
- **Input**: Signal set from A2 + raw inventory claims from three sources
- **Output**: `conflictScore`, per-source `credibility[]`, resolved inventory truth
- **Key Logic**:
  ```
  credibility(source) = baseScore × (1 − decayRate × hoursStale)

  WMS:      baseScore=0.85, hoursStale=6   → credibility ≈ 0.34  ← INVALIDATED
  Shipment: baseScore=0.92, hoursStale=0.07 → credibility ≈ 0.91
  POS:      baseScore=0.97, hoursStale=0   → credibility ≈ 0.96

  conflictScore = 0.91  (CRITICAL)
  Resolved truth: runway = 48h  (WMS 10-day figure overridden)
  ```

### A4 — Insight / Credibility Synthesis Agent
- **Event Type**: `AGENT_STEP`
- **Input**: Contradiction-resolved state from A3
- **Output**: Actionable insight set with confidence values
- **Cites**: `↑ CONTRA_AGENT resolved inventory conflict — runway=48h`

### A5 — Impact Analysis Agent
- **Event Type**: `AGENT_STEP`
- **Input**: Insight set from A4
- **Output**: `stockoutProbability`, `revenueAtRisk`, SLA exposure score, `urgencyScore`
- **Cites**: `↑ SIGNAL_AGENT confirmed demand rate 36 units/h`

### A6 — Action Planning Agent
- **Event Type**: `AGENT_STEP`
- **Input**: Impact model from A5
- **Output**: Dependency-resolved 5-step execution chain with priority labels
- **Cites**: `↑ IMPACT_AGENT urgencyScore=9.3 → chain priority: CRITICAL`

### A7 — Constraint Validation Agent
- **Event Type**: `AGENT_STEP`
- **Input**: Action plan from A6
- **Output**: 5-gate compliance result; grants or blocks execution authority
- **Gates**: Budget ceiling · Supplier contract status · Regulatory compliance · Inventory floor · SLA delta

### A8 — Execution Simulation Agent
- **Event Type**: `EXECUTION_EVENT`
- **Input**: Validated action chain from A7
- **Output**: Per-task API result (200/201/503), retry logs, PO number on success
- **Key Logic**:
  ```
  Supplier A: p(success) = 0.31 under load
  Retry policy: exponential backoff (2.1s → 4.4s → escalate)
  Max retries: 3 → escalate to RECOVERY_AGENT on exhaustion
  ```
- **Cites**: `↑ CONSTRAINT_AGENT: 4/5 gates PASSED — execution authority granted`

### A9 — Recovery / Failure Arbitration Agent
- **Event Type**: `RECOVERY_EVENT`
- **Input**: Failure event from A8
- **Output**: Failure classification, fallback supplier selection, PO issuance
- **Key Logic**:
  ```
  Failure classes: TRANSIENT · SYSTEMIC · PARTIAL
  Fallback scoring: f(reliability, leadTime, activeContracts)

  Supplier D: 0.84  ← selected (lead: 40h, reliability: 0.94)
  Supplier E: 0.71
  Supplier F: 0.64
  ```
- **Cites**: `↑ EXEC_AGENT: Supplier A UNREACHABLE (503×3) — class: TRANSIENT`

### A10 — Monitoring & Outcome Agent
- **Event Type**: `OUTCOME_EVENT`
- **Input**: Full accumulated state
- **Output**: Pre/post delta metrics, heartbeat activation, audit ledger commit
- **Final payload**:
  ```json
  {
    "event_type": "OUTCOME_EVENT",
    "agent": "monitoring_agent",
    "orch_id": "ORCH-XXXXX-XXXX",
    "confidence": "98%",
    "phase": "STABILIZED",
    "riskScore": 1.2,
    "fallbackActivated": true,
    "poNumber": "PO-20261337",
    "next_action": "standby_monitor"
  }
  ```

---

## Event Taxonomy

| Event Type | Emitted By | Carries |
|---|---|---|
| `AGENT_STEP` | A1, A2, A4, A5, A6, A7 | agent ID, confidence, stateUpdate |
| `CONTRADICTION_EVENT` | A3 | conflictScore, credibility[], resolvedTruth |
| `EXECUTION_EVENT` | A8 | taskResults[], retryLog, poNumber |
| `RECOVERY_EVENT` | A9 | failureClass, fallbackScores, selectedSupplier |
| `OUTCOME_EVENT` | A10 | delta metrics, auditPayload, heartbeatActivated |

---

## Architectural Principles

### 1. Reactive State Propagation
Each agent receives the complete accumulated system state from all prior agents. There is no inter-agent messaging — agents read from and write to a single shared state object via a pure `stateUpdate(state) → newState` function.

### 2. Orchestration Session Identity
Every run generates a unique `ORCH-ID` at session init:
```javascript
ORCH-${Date.now().toString(36).toUpperCase().slice(-5)}-${Math.random().toString(36).slice(2,6).toUpperCase()}
```
This ID is threaded through every agent event and committed to the final audit ledger.

### 3. Cross-Agent Memory Citations
Each agent explicitly references its predecessor's key decision in its reasoning output. This makes the full reasoning chain auditable without replaying the pipeline.

### 4. Contradiction Resolution as First-Class Primitive
The contradiction engine (A3) is not a filter or validation step. It is a probabilistic credibility graph that produces a `conflictScore` propagated into every downstream agent's confidence model.

### 5. Probabilistic Execution
Supplier API failures are modeled with realistic probability distributions. The execution engine expects failures and handles them through a structured retry + escalation path, not exception handling.

---

## Production Mapping

| Simulation Component | Production Equivalent |
|---|---|
| Agent functions | Independent microservices (containerized) |
| `stateUpdate` chain | Apache Kafka consumer groups |
| Shared state object | Redis (shared orchestration memory) |
| Contradiction engine | Neo4j (credibility graph) |
| Event bus | AWS EventBridge / Antigravity runtime |
| Execution retries | AWS Step Functions |
| Audit ledger | Immutable append-only datastore (e.g. QLDB) |
| ORCH-ID session | Distributed trace ID (OpenTelemetry) |

One AURA OS instance handles one crisis session. In production, 1,000+ concurrent crises run as isolated orchestration sessions.

---

## Data Flow Diagram

```
Raw Feeds (6)
     │
     ▼
[A1] Normalize + timestamp
     │
     ▼
[A2] Extract anomalies (z-scores)
     │
     ▼
[A3] Contradiction engine → conflictScore=0.91 → resolved runway=48h
     │
     ▼
[A4] Synthesize insights (confidence-weighted)
     │
     ▼
[A5] Model impact → stockout=94%, revenue_at_risk=$218,400
     │
     ▼
[A6] Plan actions → 5-step execution chain (CRITICAL priority)
     │
     ▼
[A7] Validate constraints → 4/5 gates PASSED → authority granted
     │
     ▼
[A8] Execute API calls → Supplier A: 503×3 → escalate
     │
     ▼
[A9] Classify failure (TRANSIENT) → score fallbacks → select Supplier D
     │
     ▼
[A10] Compute delta → commit audit → activate heartbeat
     │
     ▼
OUTCOME: stockout 94%→7% · revenue_at_risk $218,400→$0 · riskScore 8.2→1.2
```

---

*AURA OS Architecture · Manaal Pervaiz · #AISeekho 2026*
