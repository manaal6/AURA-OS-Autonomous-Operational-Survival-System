import React, { useState, useEffect, useRef, useCallback } from "react";
// ═══════════════════════════════════════════════════════
// AURA OS — UPGRADED FOR GOOGLE ANTIGRAVITY HACKATHON
// Modifications:
//   A) ORCH-ID session identity
//   B) StateTicker contrast fixed
//   C) Antigravity API call panel (sidebar)
//   D) Sequential execution box animation
//   E) Cross-agent memory citations
//   F) Post-stabilization heartbeat
//   G) Confidence propagation mini-bar
//   H) Idle state pre-mission briefing
//   I) Risk score drop animation
//   J) Outcome numbers count-up animation
// ═══════════════════════════════════════════════════════

// ── Mobile detection hook (reactive, not one-shot) ──
function useIsMobile() {
  const [mobile, setMobile] = React.useState(() => window.innerWidth < 768);
  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e) => setMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return mobile;
}

const jitter = (base, pct = 0.18) => base + (Math.random() - 0.5) * 2 * base * pct;
const conf   = (base) => Math.min(0.99, Math.max(0.41, +(base + (Math.random()-0.5)*0.1).toFixed(2)));
const fmtC   = (v) => (v * 100).toFixed(0) + "%";

// ── A) Session identity ──
const makeOrchId = () =>
  `ORCH-${Date.now().toString(36).toUpperCase().slice(-5)}-${Math.random().toString(36).slice(2,6).toUpperCase()}`;

const makeState = () => ({
  orchId: makeOrchId(),
  sessionStart: Date.now(),
  riskScore: +(8.2 + Math.random()*1.4).toFixed(1),
  inventoryRaw: 1840 + Math.floor(Math.random()*8),
  complaintsRaw: 40 + Math.floor(Math.random()*5),
  inventoryRunway: 48,
  stockoutProbability: 0,
  revenueAtRisk: 0,
  demandVelocity: 0,
  urgencyScore: 0,
  poAmountPlan: 0,
  supplierHealth: { A:"UNKNOWN", B:"UNKNOWN", C:"UNKNOWN", D:"UNKNOWN" },
  confidenceMap: {},
  contraResolved: false,
  executionFailures: 0,
  fallbackActivated: false,
  poNumber: null,
  poAmount: 0,
  qty: 0,
  ordersUpdated: 0,
  phase: "INITIALIZING",
});

// ─── PIPELINE: 10 reactive agent functions ───
const PIPELINE = [

  (s) => {
    const u = s.inventoryRaw, t = s.complaintsRaw;
    return {
      agent:"input", event_type:"AGENT_STEP", confidence:conf(0.97),
      title:"Ingesting multi-source operational intelligence",
      decision:"Accept all streams. Normalize timestamps. Flag 2 URGENT.",
      next_action:"signal_extraction",
      // E) Memory citation
      memory: null,
      stateUpdate:(st)=>({...st, phase:"INGESTING"}),
      outputs:[
        {label:"supplier_emails.txt",     value:`3 emails — 2 flagged URGENT`,                 type:"doc"},
        {label:"warehouse_inventory.csv", value:`SKU-4471: ${u.toLocaleString()} units logged`, type:"data"},
        {label:"sales_dashboard_feed",    value:"Real-time POS stream active — +340% velocity", type:"api"},
        {label:"logistics_shipment_api",  value:"SHP-9921 tracked — ETA mismatch detected",     type:"api"},
        {label:"news_signal_feed",        value:"Chennai port: cyclone advisory, 60% throughput cut", type:"news"},
        {label:"customer_crm_feed",       value:`${t} CX tickets in 6h — +280% vs baseline`,   type:"crm"},
      ],
      logs:[
        {d:0,   t:"ANTIGRAVITY → [AGENT_STEP] routing to INPUT_PROCESSING_AGENT"},
        {d:300, t:`INPUT_AGENT: Stream parser active. 6 feeds registered.`},
        {d:600, t:"INPUT_AGENT: Timestamp normalization applied — UTC sync complete."},
        {d:900, t:`INPUT_AGENT: 2 URGENT flags in email corpus. WMS: ${u} units.`},
        {d:1200,t:`INPUT_AGENT: CRM: ${t} tickets. POS stream live.`},
        {d:1500,t:"INPUT_AGENT: ✓ Complete. Passing to SIGNAL_EXTRACTION_AGENT."},
      ],
      duration:jitter(1800),
    };
  },

  (s) => {
    const vel = 334 + Math.floor(Math.random()*14), t = s.complaintsRaw;
    return {
      agent:"signal", event_type:"AGENT_STEP", confidence:conf(0.93),
      title:"Extracting non-trivial anomaly signals — 0 summaries",
      decision:`${vel}% demand spike + 9d delay + ${t} CX surge + port disruption — 4 signals queued.`,
      next_action:"contradiction_detection",
      memory: `↑ INPUT_AGENT committed 6 feeds (orch_id: ${s.orchId})`,
      stateUpdate:(st)=>({...st, phase:"SIGNAL_EXTRACTION", demandVelocity:vel}),
      outputs:[
        {label:"DEMAND_SPIKE",    value:`SKU-4471 velocity ↑${vel}% (72h window) — non-linear`, type:"alert"},
        {label:"SHIPMENT_DELAY",  value:"SHP-9921 delayed 9 days — ETA structurally mismatched", type:"alert"},
        {label:"COMPLAINT_SURGE", value:`${t} CX tickets — fulfillment SLA breach imminent`,    type:"alert"},
        {label:"PORT_DISRUPTION", value:"Chennai: 60% throughput. Suppliers B/C affected.",      type:"news"},
      ],
      logs:[
        {d:0,   t:"ANTIGRAVITY → [AGENT_STEP] routing to SIGNAL_EXTRACTION_AGENT"},
        {d:280, t:`SIGNAL_AGENT: Anomaly threshold — z-score >2.4.`},
        {d:560, t:`SIGNAL_AGENT: ↑${vel}% demand spike — SKU-4471. Non-linear growth.`},
        {d:840, t:"SIGNAL_AGENT: SHP-9921 ETA conflict flagged."},
        {d:1100,t:`SIGNAL_AGENT: CRM surge ${t} tickets — correlation 0.87.`},
        {d:1400,t:"SIGNAL_AGENT: ✓ 4 signals. 0 summaries. Handing to CONTRA_AGENT."},
      ],
      duration:jitter(2000),
    };
  },

  (s) => {
    const wh=conf(0.34), sh=conf(0.91), pos=conf(0.96);
    const stale=(5+Math.floor(Math.random()*2))+"h";
    const cscore=+(0.86+Math.random()*0.1).toFixed(2);
    return {
      agent:"contra", event_type:"CONTRADICTION_EVENT", confidence:conf(0.94),
      title:"⚡ CONFLICT DETECTED — Multi-source inventory contradiction",
      decision:`WH credibility ${wh} (${stale} stale) overridden. Trust POS(${pos})+Ship(${sh}). Runway=48h.`,
      next_action:"insight_credibility",
      contradiction:true,
      credScores:{wh,sh,pos,stale}, conflictScore:cscore,
      memory: `↑ SIGNAL_AGENT flagged 3 conflicting inventory signals for resolution`,
      stateUpdate:(st)=>({...st, phase:"CONTRADICTION_RESOLVED", contraResolved:true, inventoryRunway:48, confidenceMap:{...st.confidenceMap, contra:cscore}}),
      outputs:[
        {label:"SOURCE A — Warehouse DB",  value:`${(s.inventoryRaw||1840).toLocaleString()} units (10-day cover) — STALE: ${stale}`, type:"stale"},
        {label:"SOURCE B — Shipment API",  value:"SHP-9921 delayed 9 days — replenishment BLOCKED — FRESH: 4min",                    type:"fresh"},
        {label:"SOURCE C — Sales POS",     value:"Depletion model → stockout in 48h — FRESH: live",                                  type:"fresh"},
        {label:"⚡ CONFLICT SCORE",         value:`${cscore}/1.0 — severity: CRITICAL`,                                               type:"critical"},
        {label:"RESOLUTION",               value:`WH OVERRIDDEN (cred:${wh}). POS+Ship trusted. Runway: 48h NOT 10d`,               type:"resolved"},
      ],
      logs:[
        {d:0,   t:"ANTIGRAVITY → [CONTRADICTION_EVENT] routing to CONTRADICTION_DETECTION_AGENT"},
        {d:220, t:`CONTRA_AGENT: Timestamp compare — WH:${stale} | POS:realtime | SHIP:4min`},
        {d:480, t:"CONTRA_AGENT: ⚡ CONFLICT DETECTED — 3 sources disagree on inventory"},
        {d:700, t:`CONTRA_AGENT: Credibility — WH=${wh} SHIP=${sh} POS=${pos}`},
        {d:950, t:`CONTRA_AGENT: WH score ${wh} < 0.50 threshold — STALE. INVALIDATING.`},
        {d:1200,t:`CONTRA_AGENT: Conflict severity: ${cscore}/1.0 — CRITICAL`},
        {d:1550,t:"CONTRA_AGENT: RESOLUTION — runway=48h. WH data OVERRIDDEN."},
        {d:1950,t:"ANTIGRAVITY: Contradiction resolved. Escalating urgency. → INSIGHT_AGENT."},
      ],
      duration:jitter(2400),
    };
  },

  (s) => {
    const rate = 36 + Math.floor(Math.random()*5);
    return {
      agent:"insight", event_type:"AGENT_STEP", confidence:conf(0.94),
      title:"Synthesizing credibility-weighted actionable insights",
      decision:"4 insights committed. 0 summaries. Confidence: 0.88–0.96. → IMPACT_AGENT.",
      next_action:"impact_analysis",
      // E) Cross-agent memory
      memory: s.contraResolved
        ? `↑ CONTRA_AGENT resolved inventory conflict — runway=48h (overriding WMS 10d figure)`
        : null,
      stateUpdate:(st)=>({...st, phase:"INSIGHT_SYNTHESIS", demandRate:rate, confidenceMap:{...st.confidenceMap, insight:conf(0.94)}}),
      outputs:[
        {label:"Insight #1 — CRITICAL", value:`Effective stock ~48h. ${(s.inventoryRaw||1840).toLocaleString()} unit WMS figure INVALID`, type:"critical"},
        {label:"Insight #2 — HIGH",     value:`Demand rate: ${rate} units/h. 9-day gap if unresolved.`,                                  type:"high"},
        {label:"Insight #3 — HIGH",     value:"CX complaint surge r=0.87 correlated with fulfillment SLA breach.",                        type:"high"},
        {label:"Insight #4 — MEDIUM",   value:"Port disruption eliminates Suppliers B/C. Single-supplier risk elevated.",                  type:"medium"},
      ],
      logs:[
        {d:0,   t:"ANTIGRAVITY → [AGENT_STEP] routing to INSIGHT_CREDIBILITY_AGENT"},
        {d:300, t:"INSIGHT_AGENT: Weighted synthesis from contradiction-resolved state."},
        {d:600, t:`INSIGHT_AGENT: Demand rate ${rate} units/h. Gap: 9d if no action.`},
        {d:900, t:"INSIGHT_AGENT: CRM correlation 0.87 — causal link to SLA breach confirmed."},
        {d:1400,t:"INSIGHT_AGENT: ✓ 4 insights committed. → IMPACT_AGENT."},
      ],
      duration:jitter(1600),
    };
  },

  (s) => {
    const sp=Math.min(97, 91+Math.floor(Math.random()*5));
    const rev=210000+Math.floor(Math.random()*15000);
    const sla=70+Math.floor(Math.random()*7);
    const churn=(11+Math.random()*2).toFixed(1);
    const nps=-(16+Math.floor(Math.random()*4));
    const urg=(9.2+Math.random()*0.4).toFixed(1);
    return {
      agent:"impact", event_type:"AGENT_STEP", confidence:conf(0.91),
      title:"Modeling operational consequence vectors",
      decision:`Urgency ${urg}/10 — ESCALATION THRESHOLD EXCEEDED. Immediate action.`,
      urgencyScore:urg,
      next_action:"action_planning",
      memory: `↑ INSIGHT_AGENT confirmed 48h runway + demand rate ${s.demandRate||36} units/h`,
      stateUpdate:(st)=>({...st, phase:"IMPACT_MODELED", stockoutProbability:sp, revenueAtRisk:rev, urgencyScore:urg}),
      outputs:[
        {label:"Stockout Probability", value:`${sp}% within 48h — CRITICAL`,                     type:"risk-high"},
        {label:"Revenue at Risk",      value:`$${rev.toLocaleString()} (3-day window)`,           type:"risk-high"},
        {label:"SLA Breach Risk",      value:`${sla}% enterprise contracts — penalty triggers`,   type:"risk-high"},
        {label:"Customer Churn",       value:`${churn}% retention loss projected >72h`,           type:"risk-med"},
        {label:"Reputational Signal",  value:`NPS degradation: ${nps} pts (72h model)`,          type:"risk-med"},
      ],
      logs:[
        {d:0,   t:`ANTIGRAVITY → [AGENT_STEP] routing to IMPACT_ANALYSIS_AGENT`},
        {d:300, t:`IMPACT_AGENT: Monte Carlo stockout — ${sp}% probability at 48h.`},
        {d:600, t:`IMPACT_AGENT: Revenue model: $${rev.toLocaleString()} over 3-day exposure.`},
        {d:900, t:`IMPACT_AGENT: SLA exposure: ${sla}% contracts. Auto-penalty threshold crossed.`},
        {d:1300,t:`IMPACT_AGENT: Urgency score: ${urg}/10 — ESCALATION THRESHOLD EXCEEDED.`},
        {d:1700,t:"ANTIGRAVITY: High-urgency signal. Elevating action chain priority. → ACTION_AGENT."},
      ],
      duration:jitter(2000),
    };
  },

  (s) => {
    const amt = 41000+Math.floor(Math.random()*4000);
    return {
      agent:"action", event_type:"AGENT_STEP", confidence:conf(0.92),
      title:"Generating reactive chained action plan",
      decision:`5 actions. Dependency graph resolved. Budget: $${amt.toLocaleString()}.`,
      next_action:"constraint_validation",
      memory: `↑ IMPACT_AGENT urgency=${s.urgencyScore||"9.3"}/10 → action chain priority: CRITICAL`,
      stateUpdate:(st)=>({...st, phase:"ACTIONS_PLANNED", poAmountPlan:amt}),
      outputs:[
        {label:"ACTION 1 — VALIDATE", value:"Cross-check WMS physical count vs ERP inventory",           type:"action"},
        {label:"ACTION 2 — NOTIFY",   value:"Slack: procurement URGENT reorder trigger + brief",          type:"action"},
        {label:"ACTION 3 — ORDER",    value:`Emergency PO to Supplier A — $${amt.toLocaleString()} — 36h`, type:"action"},
        {label:"ACTION 4 — ADJUST",   value:"Bulk ETA update: +9d on affected SKU-4471 orders (CRM)",    type:"action"},
        {label:"ACTION 5 — MONITOR",  value:"Enable 30-min inventory heartbeat until risk < 15%",         type:"action"},
      ],
      logs:[
        {d:0,   t:"ANTIGRAVITY → [AGENT_STEP] routing to ACTION_PLANNING_AGENT"},
        {d:260, t:"ACTION_AGENT: Dependency graph construction — 5 nodes."},
        {d:520, t:"ACTION_AGENT: Actions 1–2 parallelizable. Action 3 gated on Action 1."},
        {d:800, t:`ACTION_AGENT: PO scoped: $${amt.toLocaleString()} — within auto-approve.`},
        {d:1200,t:"ACTION_AGENT: ✓ 5-step chain committed. → CONSTRAINT_AGENT."},
      ],
      duration:jitter(1700),
    };
  },

  (s) => {
    const budget=s.poAmountPlan||42000, limit=75000;
    return {
      agent:"constraint", event_type:"AGENT_STEP", confidence:conf(0.97),
      title:"Validating execution gates — budget, compliance, API",
      decision:"4/5 gates PASSED. Supplier B/C excluded (port). Execution AUTHORIZED.",
      next_action:"execution_simulation",
      memory: `↑ ACTION_AGENT: 5-step plan received. Budget $${budget.toLocaleString()} queued for gate check`,
      stateUpdate:(st)=>({...st, phase:"CONSTRAINTS_CLEARED", supplierHealth:{...st.supplierHealth, B:"BLOCKED", C:"BLOCKED"}}),
      outputs:[
        {label:"Budget Gate",     value:`PO $${budget.toLocaleString()} < $${limit.toLocaleString()} — ✓ PASS`,       type:"pass"},
        {label:"Lead Time Gate",  value:"Supplier A: 36h lead < 48h window — ✓ PASS",                                 type:"pass"},
        {label:"API Rate Gate",   value:"ERP: 12 req/min — within 60/min quota — ✓ PASS",                            type:"pass"},
        {label:"Compliance Gate", value:`PO auto-approve <$50k: ${budget<50000?"✓ PASS":"⚠ MANUAL REVIEW"}`,         type:budget<50000?"pass":"alert"},
        {label:"Supplier B/C",    value:"Port disruption confirmed — both routes BLOCKED — ✗ SKIP",                   type:"fail"},
      ],
      logs:[
        {d:0,   t:"ANTIGRAVITY → [AGENT_STEP] routing to CONSTRAINT_VALIDATION_AGENT"},
        {d:200, t:`CONSTRAINT_AGENT: Budget gate — $${budget.toLocaleString()} vs $${limit.toLocaleString()} — PASS.`},
        {d:440, t:"CONSTRAINT_AGENT: Lead time gate — 36h vs 48h — PASS."},
        {d:660, t:"CONSTRAINT_AGENT: Supplier B/C — port block verified — EXCLUDED."},
        {d:1100,t:"CONSTRAINT_AGENT: ✓ 4/5 PASSED. Execution AUTHORIZED. → EXECUTION_AGENT."},
      ],
      duration:jitter(1400),
    };
  },

  (s) => {
    const qty=1950+Math.floor(Math.random()*100);
    const poNum=`PO-${new Date().getFullYear()}${Math.floor(1000+Math.random()*8999)}`;
    const poAmt=(s.poAmountPlan||42000)+2000+Math.floor(Math.random()*1200);
    const orders=840+Math.floor(Math.random()*20);
    return {
      agent:"execution", event_type:"EXECUTION_EVENT", confidence:conf(0.88),
      title:"Executing action chain via Antigravity mock API orchestration",
      decision:`Supplier A FAILED (503×2). Fallback D activated. ${poNum}. ${orders} ETAs updated.`,
      execution:true, poNumber:poNum, poAmount:poAmt, qty, ordersUpdated:orders,
      next_action:"recovery_handling",
      memory: `↑ CONSTRAINT_AGENT: 4/5 gates PASSED — execution authority granted`,
      stateUpdate:(st)=>({...st, phase:"EXECUTING", executionFailures:2, fallbackActivated:true, poNumber:poNum, poAmount:poAmt, qty, ordersUpdated:orders, supplierHealth:{...st.supplierHealth, A:"FAILED", D:"ACTIVE"}}),
      outputs:[
        {label:"POST /erp/inventory/validate",               value:`{"sku":"4471","wms":${s.inventoryRaw||1840},"physical":${(s.inventoryRaw||1840)+2},"delta":2} → 200 OK`, type:"api-ok"},
        {label:"POST /notify/procurement",                   value:'{"channel":"slack","urgency":"CRITICAL","ack":true} → 200 OK',                                          type:"api-ok"},
        {label:"POST /supplier/A/emergency-order",           value:"→ 503 SERVICE UNAVAILABLE — timeout 8.4s ✗",                                                            type:"api-fail"},
        {label:"POST /supplier/A/emergency-order [RETRY 1]", value:"→ 503 STILL FAILING — connection refused ✗",                                                            type:"api-fail"},
        {label:"POST /supplier/A/emergency-order [RETRY 2]", value:"→ 503 PERSISTENT — SUPPLIER A UNREACHABLE — TRIGGERING FALLBACK ✗",                                    type:"api-fail"},
        {label:`POST /supplier/D/emergency-order [FALLBACK]`,value:`{"po":"${poNum}","qty":${qty},"eta_h":40,"amount":${poAmt}} → 201 CREATED ✓`,                         type:"api-ok"},
        {label:"PUT /crm/delivery-etas/bulk",                 value:`{"affected_orders":${orders},"sku":"4471","eta_delta":"+9d"} → 200 OK`,                                type:"api-ok"},
      ],
      // D) execLogs drive sequential box animation
      execLogs:[
        {d:0,    t:"EXEC_AGENT: Action chain started. 5 tasks queued.",                                   c:"normal", boxEvent:null},
        {d:400,  t:"→ POST /erp/inventory/validate ...",                                                   c:"normal", boxEvent:null},
        {d:700,  t:`   ← 200 OK {delta:2} — physical count verified ✓`,                                  c:"ok",     boxEvent:null},
        {d:1000, t:"→ POST /notify/procurement [urgency:CRITICAL] ...",                                    c:"normal", boxEvent:null},
        {d:1300, t:"   ← 200 OK — Slack delivered. Team ack received ✓",                                  c:"ok",     boxEvent:"api_ok"},
        {d:1600, t:"→ POST /supplier/A/emergency-order ...",                                               c:"normal", boxEvent:null},
        {d:2200, t:"   ← 503 SERVICE UNAVAILABLE (timeout: 8.4s) ✗",                                     c:"err",    boxEvent:"fail1"},
        {d:2500, t:"   ↺ Retry 1/2 → POST /supplier/A/emergency-order ...",                               c:"warn",   boxEvent:null},
        {d:2900, t:"   ← 503 STILL FAILING — connection refused ✗",                                       c:"err",    boxEvent:"fail2"},
        {d:3100, t:"   ↺ Retry 2/2 → POST /supplier/A/emergency-order ...",                               c:"warn",   boxEvent:null},
        {d:3500, t:"   ← 503 PERSISTENT — SUPPLIER A UNREACHABLE ✗✗✗",                                   c:"err",    boxEvent:"fail3"},
        {d:3700, t:"💥 EXEC_AGENT: PRIMARY SUPPLIER FAILED — escalating to RECOVERY_AGENT",               c:"err",    boxEvent:"fallback"},
      ],
      logs:[
        {d:0,   t:"ANTIGRAVITY → [EXECUTION_EVENT] routing to EXECUTION_SIMULATION_AGENT"},
        {d:500, t:"EXEC_AGENT: ERP validate → 200 OK. Delta: 2 units."},
        {d:900, t:"EXEC_AGENT: Procurement notification → 200 OK."},
        {d:1400,t:"EXEC_AGENT: Supplier A → 503 SERVICE UNAVAILABLE."},
        {d:1800,t:"⚠  EXEC_AGENT: Retry 1/2 → Supplier A → 503 STILL FAILING."},
        {d:2200,t:"⚠  EXEC_AGENT: Retry 2/2 → Supplier A → 503 PERSISTENT."},
        {d:2600,t:"💥 EXEC_AGENT: Supplier A UNREACHABLE. Escalating to RECOVERY_AGENT."},
      ],
      duration:jitter(3800),
    };
  },

  (s) => {
    const dScore=(0.80+Math.random()*0.06).toFixed(2);
    const extra=3+Math.floor(Math.random()*3);
    const delta=(0.03+Math.random()*0.03).toFixed(2);
    return {
      agent:"recovery", event_type:"RECOVERY_EVENT", confidence:conf(0.89),
      title:"Failure classified — Antigravity fallback intelligence activated",
      decision:`TRANSIENT. Supplier D (score:${dScore}) selected. Lead +${extra}h — within tolerance.`,
      next_action:"monitoring_outcome",
      memory: `↑ EXEC_AGENT: Supplier A UNREACHABLE (503×3) — failure class: TRANSIENT`,
      stateUpdate:(st)=>({...st, phase:"RECOVERY_COMPLETE", supplierHealth:{...st.supplierHealth, D:"CONFIRMED"}, confidenceMap:{...st.confidenceMap, recovery:+dScore}}),
      outputs:[
        {label:"FAILURE CLASSIFICATION", value:"Supplier A: TRANSIENT — infrastructure outage (not geo-political)",      type:"fail"},
        {label:"FALLBACK EVALUATION",     value:`D:${dScore}✓ | E:0.71 | F:0.64 — D SELECTED`,                          type:"recovery"},
        {label:"PO CONFIRMED",            value:`${s.poNumber||"PO-PENDING"} — ${(s.qty||2000)} units — $${(s.poAmount||44100).toLocaleString()} — ETA 40h`, type:"pass"},
        {label:"RISK DELTA",              value:`Lead +${extra}h vs primary. Risk delta: +${delta} — WITHIN TOLERANCE`,  type:"recovery"},
        {label:"AUDIT ENTRY",             value:`Failure+recovery logged to ops ledger ${new Date().toISOString().slice(0,19)} UTC`, type:"log"},
      ],
      logs:[
        {d:0,   t:"ANTIGRAVITY → [RECOVERY_EVENT] routing to RECOVERY_FAILURE_AGENT"},
        {d:280, t:"RECOVERY_AGENT: Failure classification: TRANSIENT (not systemic)."},
        {d:560, t:`RECOVERY_AGENT: Fallback pool — D(${dScore}), E(0.71), F(0.64).`},
        {d:840, t:`RECOVERY_AGENT: Supplier D selected — score ${dScore} within tolerance.`},
        {d:1100,t:`RECOVERY_AGENT: Lead time impact +${extra}h — within 48h window.`},
        {d:1500,t:`RECOVERY_AGENT: ${s.poNumber||"PO"} confirmed. Resuming action chain.`},
        {d:1700,t:"RECOVERY_AGENT: ✓ Recovery complete. Audit committed. → MONITORING_AGENT."},
      ],
      duration:jitter(1800),
    };
  },

  (s) => {
    const sAfter=Math.floor(6+Math.random()*5);
    const rAfter=(1.0+Math.random()*0.5).toFixed(1);
    const sBefore=s.stockoutProbability||94;
    const rBefore=s.revenueAtRisk||218400;
    return {
      agent:"monitoring", event_type:"OUTCOME_EVENT", confidence:conf(0.98),
      title:"Outcome evaluation — Antigravity system state committed",
      decision:`Crisis resolved. Risk ${s.urgencyScore||9.4}→${rAfter}. Monitoring: 30-min heartbeat.`,
      final:true, riskAfter:rAfter, sAfter, sBefore, rBefore,
      memory: `↑ RECOVERY_AGENT: PO ${s.poNumber||"confirmed"} — ${s.ordersUpdated||847} ETAs updated`,
      stateUpdate:(st)=>({...st, phase:"STABILIZED", riskScore:+rAfter, stockoutProbability:sAfter}),
      outputs:[
        {label:"BEFORE: Stockout Risk",   value:`${sBefore}% → AFTER: ${sAfter}%`,                           type:"improvement"},
        {label:"BEFORE: Revenue at Risk", value:`$${rBefore.toLocaleString()} → AFTER: $0 (PO covers)`,      type:"improvement"},
        {label:"BEFORE: SLA Status",      value:"73% breach risk → AFTER: ETAs updated, SLAs preserved",      type:"improvement"},
        {label:"BEFORE: Supplier Status", value:"Primary UNKNOWN → AFTER: Supplier D CONFIRMED inbound",      type:"improvement"},
        {label:"Monitoring Mode",         value:"30-min heartbeat ACTIVE — Antigravity watching 6 signals",   type:"active"},
        {label:s.poNumber||"PO",          value:`${s.qty||2000} units — ETA 40h — Supplier D — CONFIRMED`,   type:"pass"},
      ],
      logs:[
        {d:0,   t:"ANTIGRAVITY → [OUTCOME_EVENT] routing to MONITORING_OUTCOME_AGENT"},
        {d:300, t:`MONITOR_AGENT: Pre/post diff — Risk ${s.urgencyScore||9.4} → ${rAfter}.`},
        {d:600, t:`MONITOR_AGENT: Stockout: ${sBefore}% → ${sAfter}%.`},
        {d:900, t:`MONITOR_AGENT: Revenue: $${rBefore.toLocaleString()} → $0.`},
        {d:1200,t:`MONITOR_AGENT: ${s.ordersUpdated||847} ETAs updated. SLA penalties avoided.`},
        {d:1500,t:"MONITOR_AGENT: 30-min heartbeat ACTIVE. Antigravity standing by."},
        {d:1800,t:"ANTIGRAVITY: All 10 agents complete. Crisis resolution: CONFIRMED."},
        {d:2000,t:"✅ AURA_OS: SYSTEM STABILIZED. Full audit trail committed. Monitoring: ON."},
      ],
      duration:jitter(2000),
    };
  },
];

const AGENTS = [
  {id:"input",      label:"Input Processing",        icon:"⬇", color:"#4f8ef7"},
  {id:"signal",     label:"Signal Extraction",       icon:"📡", color:"#a78bfa"},
  {id:"contra",     label:"Contradiction Detection", icon:"⚡", color:"#f59e0b"},
  {id:"insight",    label:"Insight / Credibility",   icon:"🧠", color:"#06b6d4"},
  {id:"impact",     label:"Impact Analysis",         icon:"📊", color:"#f97316"},
  {id:"action",     label:"Action Planning",         icon:"🎯", color:"#10b981"},
  {id:"constraint", label:"Constraint Validation",   icon:"🔒", color:"#8b5cf6"},
  {id:"execution",  label:"Execution Simulation",    icon:"⚙",  color:"#ec4899"},
  {id:"recovery",   label:"Recovery / Failure",      icon:"🔄", color:"#ef4444"},
  {id:"monitoring", label:"Monitoring & Outcome",    icon:"📈", color:"#22c55e"},
];

const FEED = [
  {source:"SUPPLIER EMAIL", msg:"⚠ SHP-9921 delayed — port congestion Chennai",         sev:"high"},
  {source:"WAREHOUSE WMS",  msg:"SKU-4471: 1,840 units (system: 10-day cover)",          sev:"low"},
  {source:"SALES POS",      msg:"🔴 SKU-4471 velocity +340% over 72h baseline",          sev:"critical"},
  {source:"CRM TICKETS",    msg:"42 fulfillment complaints in 6h — SLA breach imminent", sev:"high"},
  {source:"NEWS FEED",      msg:"Chennai port: 60% throughput cut (cyclone Mandous)",    sev:"high"},
  {source:"LOGISTICS API",  msg:"SHP-9921 ETA +9d. Alt route: unavailable",             sev:"critical"},
];

// ═══════════════════════════════════════════════════════
// UI COMPONENTS
// ═══════════════════════════════════════════════════════

function TypeBadge({type}) {
  const m = {
    alert:["#f59e0b","#1c1007"], critical:["#ef4444","#1a0000"], high:["#f97316","#1a0800"],
    medium:["#06b6d4","#001a1f"], "risk-high":["#ef4444","#1a0000"], "risk-med":["#f59e0b","#1c1007"],
    action:["#10b981","#001a0d"], pass:["#22c55e","#011507"], fail:["#ef4444","#1a0000"],
    "api-ok":["#22c55e","#011507"], "api-fail":["#ef4444","#1a0000"], recovery:["#a78bfa","#0d0014"],
    improvement:["#10b981","#001a0d"], active:["#06b6d4","#001a1f"], stale:["#ef4444","#1a0000"],
    fresh:["#22c55e","#011507"], resolved:["#a78bfa","#0d0014"], doc:["#4f8ef7","#00102a"],
    data:["#a78bfa","#0d0014"], api:["#06b6d4","#001a1f"], news:["#f59e0b","#1c1007"],
    crm:["#f97316","#1a0800"], log:["#555","#111"],
  };
  const [fg,bg] = m[type]||["#888","#111"];
  return <span style={{color:fg,background:bg,fontSize:9,fontWeight:700,padding:"1px 5px",borderRadius:3,fontFamily:"monospace",letterSpacing:.5,textTransform:"uppercase",border:`1px solid ${fg}30`,whiteSpace:"nowrap",flexShrink:0}}>{type.replace(/-/g," ")}</span>;
}

function AgentRow({agent, active, completed, idx}) {
  const isA = active===agent.id, isD = completed.includes(agent.id);
  return (
    <div style={{display:"flex",alignItems:"center",gap:9,padding:"6px 10px",borderRadius:6,marginBottom:3,background:isA?`${agent.color}15`:isD?"#091209":"#0c0c0c",border:`1px solid ${isA?agent.color:isD?"#22c55e30":"#161616"}`,transition:"all .35s",position:"relative",overflow:"hidden"}}>
      {isA && <div style={{position:"absolute",inset:0,background:`linear-gradient(90deg,transparent,${agent.color}0a,transparent)`,animation:"sweep 1.6s linear infinite"}}/>}
      <span style={{fontSize:12}}>{agent.icon}</span>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:9,fontWeight:700,color:isA?agent.color:isD?"#22c55e":"#4b5563",fontFamily:"monospace",letterSpacing:.5}}>AGENT {String(idx+1).padStart(2,"0")}</div>
        <div style={{fontSize:11,color:isA?"#fff":isD?"#86efac":"#4b5563",fontWeight:isA?600:400}}>{agent.label}</div>
      </div>
      <div style={{width:6,height:6,borderRadius:"50%",background:isA?agent.color:isD?"#22c55e":"#1a1a1a",boxShadow:isA?`0 0 7px ${agent.color}`:"none",transition:"all .35s",flexShrink:0}}/>
    </div>
  );
}

// ── B) StateTicker — contrast fixed ──
function StateTicker({state}) {
  const items = [
    {k:"ORCH-ID",  v:(state.orchId||"—").slice(-9),     hi:false, accent:"#4f8ef7"},
    {k:"RISK",     v:state.riskScore?.toFixed(1)||"—",  hi:(state.riskScore||0)>5},
    {k:"RUNWAY",   v:state.inventoryRunway?state.inventoryRunway+"h":"—"},
    {k:"PHASE",    v:(state.phase||"IDLE").slice(0,14)},
    {k:"STOCKOUT", v:state.stockoutProbability?state.stockoutProbability+"%":"—", hi:(state.stockoutProbability||0)>80},
    {k:"SUP-A",    v:state.supplierHealth?.A||"—",      hi:state.supplierHealth?.A==="FAILED"},
    {k:"SUP-D",    v:state.supplierHealth?.D||"—",      hi:state.supplierHealth?.D==="CONFIRMED", ok:true},
    {k:"PO#",      v:state.poNumber?.slice(-6)||"—",    hi:!!state.poNumber, ok:true},
    {k:"FAILURES", v:String(state.executionFailures||0),hi:(state.executionFailures||0)>0},
  ];
  return (
    <div style={{display:"flex",gap:6,overflowX:"auto",padding:"7px 16px",background:"#060606",borderBottom:"1px solid #0f0f0f"}}>
      {items.map(e=>(
        <div key={e.k} style={{flexShrink:0,padding:"3px 9px",borderRadius:5,background:"#0a0a0a",border:`1px solid ${e.hi?"#ef444440":e.ok&&e.hi?"#22c55e40":e.accent?"#4f8ef720":"#1e1e1e"}`}}>
          <div style={{fontSize:8,color:"#6b7280",letterSpacing:1,marginBottom:1}}>{e.k}</div>
          <div style={{fontSize:10,fontFamily:"monospace",fontWeight:700,
            color:e.hi&&!e.ok?"#f87171":e.ok&&(e.hi||e.v!=="—")?"#4ade80":e.accent?"#4f8ef7":"#9ca3af",
            transition:"color 0.5s ease"}}>{e.v}</div>
        </div>
      ))}
    </div>
  );
}

// ── C) Antigravity API call panel ──
function AntigravityCallPanel({step, orchId}) {
  if (!step) return null;
  return (
    <div style={{marginTop:10,padding:"9px 10px",background:"#05000f",border:"1px solid #4f8ef730",borderRadius:6,animation:"slideIn .3s ease"}}>
      <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:6}}>
        <span style={{fontSize:10}}>⬡</span>
        <span style={{fontSize:7,color:"#4f8ef7",fontWeight:700,letterSpacing:1}}>ANTIGRAVITY CALL</span>
        <span style={{fontSize:7,color:"#4f8ef740",marginLeft:"auto"}}>200 OK</span>
      </div>
      <div style={{fontSize:8,color:"#1e3a5f",fontFamily:"monospace",lineHeight:1.8}}>
        <div style={{color:"#4f8ef755"}}>POST /v1/orchestrate</div>
        <div>event_type: <span style={{color:"#a78bfa"}}>{step.event_type}</span></div>
        <div>agent: <span style={{color:"#06b6d4"}}>{step.agent}</span></div>
        <div style={{fontSize:7}}>orch_id: <span style={{color:"#4f8ef7"}}>{orchId||"—"}</span></div>
        <div>confidence: <span style={{color:"#10b981"}}>{(step.confidence*100).toFixed(0)}%</span></div>
        <div style={{color:"#4f8ef740",marginTop:2}}>← routing → {step.next_action}</div>
      </div>
    </div>
  );
}

// ── G) Confidence propagation mini-bar ──
function ConfidencePropBar({allSteps}) {
  if (!allSteps.length) return null;
  return (
    <div style={{marginTop:10,padding:"8px 9px",background:"#050a0f",border:"1px solid #0b1e30",borderRadius:6}}>
      <div style={{fontSize:7,color:"#4f8ef755",letterSpacing:.8,marginBottom:7}}>CONFIDENCE PROPAGATION</div>
      {allSteps.slice(-5).map((s,i)=>{
        const ag=AGENTS.find(a=>a.id===s.agent);
        const pct=(s.confidence*100).toFixed(0);
        return (
          <div key={i} style={{marginBottom:4}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
              <span style={{fontSize:7,color:"#374151"}}>{ag?.icon} {ag?.label.slice(0,12)}</span>
              <span style={{fontSize:7,color:ag?.color,fontFamily:"monospace"}}>{pct}%</span>
            </div>
            <div style={{background:"#0c0c0c",borderRadius:2,height:3,overflow:"hidden"}}>
              <div style={{height:"100%",background:ag?.color,width:`${pct}%`,transition:"width .6s ease",opacity:0.7}}/>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── H) Idle pre-mission briefing ──
function IdleState({onRun}) {
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",padding:40,textAlign:"center"}}>
      <div style={{fontSize:28,marginBottom:16,animation:"pulse 2s infinite"}}>⬡</div>
      <div style={{fontSize:13,fontWeight:700,color:"#6b7280",letterSpacing:2,marginBottom:8}}>MISSION READY</div>
      <div style={{fontSize:11,color:"#374151",maxWidth:340,lineHeight:1.7,marginBottom:24}}>
        Supply chain crisis detected across 6 signals.<br/>
        <span style={{color:"#f59e0b"}}>SKU-4471</span> · Chennai port disruption · SHP-9921 delay<br/>
        <span style={{color:"#ef4444"}}>+340% demand spike</span> · <span style={{color:"#f97316"}}>42 CRM escalations</span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:28,width:"100%",maxWidth:380}}>
        {[
          {label:"Agents Ready",v:"10 / 10",c:"#10b981"},
          {label:"Signals",     v:"6 active",c:"#f59e0b"},
          {label:"Risk Level",  v:"CRITICAL",c:"#ef4444"},
        ].map(m=>(
          <div key={m.label} style={{background:"#090909",border:`1px solid ${m.c}25`,borderRadius:6,padding:"8px 6px"}}>
            <div style={{fontSize:8,color:"#4b5563",marginBottom:3}}>{m.label}</div>
            <div style={{fontSize:11,fontWeight:700,color:m.c,fontFamily:"monospace"}}>{m.v}</div>
          </div>
        ))}
      </div>
      <button className="rbtn" onClick={onRun} style={{maxWidth:220,fontSize:12,padding:"11px 28px"}}>▶  INITIATE CRISIS RESOLUTION</button>
      <div style={{marginTop:14,fontSize:8,color:"#1e1e1e",letterSpacing:.5}}>GOOGLE ANTIGRAVITY · AUTONOMOUS PIPELINE</div>
    </div>
  );
}

// ── J) Count-up animation hook ──
function useCountUp(target, active, duration=1500) {
  const [val, setVal] = useState(target);
  useEffect(() => {
    if (!active) { setVal(target); return; }
    const start = Date.now();
    const from = target * 6; // animate down from inflated value
    const raf = (id) => {
      const t = Math.min(1, (Date.now()-start)/duration);
      const ease = 1 - Math.pow(1-t, 3);
      setVal(Math.round(from + (target-from)*ease));
      if (t < 1) { const r = requestAnimationFrame(()=>raf()); return r; }
    };
    const r = requestAnimationFrame(()=>raf());
    return () => cancelAnimationFrame(r);
  }, [target, active]);
  return val;
}

// ═══════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════
export default function AuraOS() {
  const isMobile = useIsMobile();
  // Mobile panel: "agents" | "main" | "log"
  const [mobilePanel, setMobilePanel] = useState("main");

  const [phase, setPhase] = useState("idle");
  const [activeAgent, setActiveAgent] = useState(null);
  const [completedAgents, setCompletedAgents] = useState([]);
  const [sysState, setSysState] = useState(makeState());
  const [logs, setLogs] = useState([]);
  const [execLogs, setExecLogs] = useState([]);
  const [tab, setTab] = useState("reasoning");
  const [allSteps, setAllSteps] = useState([]);
  const [liveStep, setLiveStep] = useState(null);
  const [liveOuts, setLiveOuts] = useState([]);
  const [contraData, setContraData] = useState(null);
  const [outcomeData, setOutcomeData] = useState(null);
  const [confTick, setConfTick] = useState(null);
  // D) Execution box state — sequential reveal
  const [execBoxReveal, setExecBoxReveal] = useState([]);
  // F) Heartbeat countdown
  const [heartbeatSec, setHeartbeatSec] = useState(1800);
  const logRef = useRef(null);
  const execRef = useRef(null);
  const abortRef = useRef(false);

  useEffect(()=>{ if(logRef.current) logRef.current.scrollTop=logRef.current.scrollHeight; },[logs]);
  useEffect(()=>{ if(execRef.current) execRef.current.scrollTop=execRef.current.scrollHeight; },[execLogs]);

  // F) Heartbeat countdown after done
  useEffect(() => {
    if (phase !== "done") return;
    setHeartbeatSec(1800);
    const id = setInterval(() => {
      setHeartbeatSec(s => {
        if (s <= 1) { return 1800; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  const addLog = useCallback((msg)=>{ setLogs(p=>[...p.slice(-130),{t:msg,ts:Date.now()}]); },[]);

  const run = useCallback(async () => {
    abortRef.current = false;
    setPhase("running");
    setCompletedAgents([]); setLogs([]); setExecLogs([]); setAllSteps([]);
    setLiveStep(null); setLiveOuts([]); setContraData(null); setOutcomeData(null); setConfTick(null);
    setExecBoxReveal([]);
    const init = makeState();
    setSysState(init);

    addLog("AURA_OS: Autonomous Operational Survival System — BOOT");
    addLog(`AURA_OS: Session ${init.orchId} initialized`);
    addLog("ANTIGRAVITY: Orchestration engine — INITIALIZED");
    addLog("ANTIGRAVITY: Pipeline: observe→extract→reason→decide→act→recover→evaluate");
    addLog(`ANTIGRAVITY: Initial risk score: ${init.riskScore}`);
    await new Promise(r=>setTimeout(r,700));

    let cur = {...init};

    for (let i=0; i<PIPELINE.length; i++) {
      if (abortRef.current) break;
      const step = PIPELINE[i](cur);
      const ag = AGENTS.find(a=>a.id===step.agent);

      setActiveAgent(step.agent);
      setLiveStep(step);
      setLiveOuts([]);
      setConfTick({value:step.confidence, label:ag.label, color:ag.color});

      addLog(`ANTIGRAVITY → [${step.event_type}] agent=${step.agent} conf=${fmtC(step.confidence)} next=${step.next_action}`);
      if (step.urgencyScore) addLog(`ANTIGRAVITY: Urgency escalation: ${step.urgencyScore}/10 — elevating priority`);

      for (const le of (step.logs||[])) {
        if (abortRef.current) break;
        await new Promise(r=>setTimeout(r, Math.max(60, le.d / Math.max(step.logs.length,1) * 0.9 + jitter(120))));
        addLog(le.t);
        if (step.execution && step.execLogs) {
          const el = step.execLogs.find(e=>e.d===le.d);
          if (el) {
            setExecLogs(p=>{ if(p.some(x=>x.t===el.t)) return p; return [...p,el]; });
            // D) Drive sequential box reveal
            if (el.boxEvent === "api_ok") setExecBoxReveal(p=>[...p,"api_ok"]);
            if (el.boxEvent === "fail1")  setExecBoxReveal(p=>[...p,"fail1"]);
            if (el.boxEvent === "fail2")  setExecBoxReveal(p=>[...p,"fail2"]);
            if (el.boxEvent === "fail3")  setExecBoxReveal(p=>[...p,"fail3"]);
            if (el.boxEvent === "fallback") setExecBoxReveal(p=>[...p,"fallback"]);
          }
        }
      }

      if (step.contradiction) { setContraData(step); setTab("contradiction"); }
      if (step.execution) {
        setTab("execution");
        for (const el of (step.execLogs||[])) {
          if (abortRef.current) break;
          await new Promise(r=>setTimeout(r,jitter(310)));
          setExecLogs(p=>{ if(p.some(x=>x.t===el.t)) return p; return [...p,el]; });
        }
      }
      if (step.final) { setOutcomeData(step); setTab("outcome"); }

      const outDelay = Math.max(180, step.duration/(step.outputs.length+1));
      for (let j=0; j<step.outputs.length; j++) {
        if (abortRef.current) break;
        await new Promise(r=>setTimeout(r,jitter(outDelay)));
        setLiveOuts(p=>[...p,step.outputs[j]]);
      }

      await new Promise(r=>setTimeout(r,300));

      cur = step.stateUpdate(cur);
      setSysState({...cur});
      addLog(`ANTIGRAVITY: State committed — phase=${cur.phase} riskScore=${cur.riskScore?.toFixed?.(1)||cur.riskScore}`);

      setAllSteps(p=>[...p,{...step,_idx:i}]);
      setCompletedAgents(p=>[...p,step.agent]);
      setLiveStep(null); setLiveOuts([]);

      await new Promise(r=>setTimeout(r,jitter(280)));
    }

    if (!abortRef.current) { setActiveAgent(null); setPhase("done"); setConfTick(null); }
  },[addLog]);

  const reset = () => {
    abortRef.current = true;
    setTimeout(()=>{
      setPhase("idle"); setActiveAgent(null); setCompletedAgents([]); setSysState(makeState());
      setLogs([]); setExecLogs([]); setAllSteps([]); setLiveStep(null); setLiveOuts([]);
      setContraData(null); setOutcomeData(null); setConfTick(null); setExecBoxReveal([]);
      setTab("reasoning");
    },50);
  };

  const acol = AGENTS.find(a=>a.id===activeAgent)?.color||"#10b981";

  // ── D) Execution boxes driven by execBoxReveal ──
  const execBoxes = [
    {
      label:"PRIMARY API", desc:"POST /supplier/A/emergency-order",
      status: execBoxReveal.includes("fail1")?"fail":"pending",
      icon: execBoxReveal.includes("fail1")?"✗":"·",
      detail: execBoxReveal.includes("fail1")?"503 — timeout 8.4s":"awaiting...",
      show: execBoxReveal.includes("fail1"),
    },
    {
      label:"RETRY ×2", desc:"Supplier A — persistent failure",
      status: execBoxReveal.includes("fail3")?"fail":"pending",
      icon: execBoxReveal.includes("fail3")?"✗":"·",
      detail: execBoxReveal.includes("fail3")?"connection refused × 3":"awaiting...",
      show: execBoxReveal.includes("fail3"),
    },
    {
      label:"FALLBACK ACTIVE", desc:"Antigravity → Supplier D",
      status: execBoxReveal.includes("fallback")?"recovery":"pending",
      icon: execBoxReveal.includes("fallback")?"⚡":"·",
      detail: execBoxReveal.includes("fallback")
        ? `score: ${sysState.confidenceMap?.recovery?.toFixed(2)||"0.82"}`
        : "awaiting...",
      show: execBoxReveal.includes("fallback"),
    },
    {
      label:"PO CONFIRMED", desc:sysState.poNumber||"PO-PENDING",
      status: sysState.poNumber?"ok":"pending",
      icon: sysState.poNumber?"✓":"·",
      detail: sysState.ordersUpdated?`${sysState.ordersUpdated} ETAs updated`:"awaiting...",
      show: !!sysState.poNumber,
    },
  ];

  const fmtHB = (s) => `${String(Math.floor(s/60)).padStart(2,"0")}m ${String(s%60).padStart(2,"0")}s`;

  return (
    <div style={{background:"#050505",minHeight:"100vh",color:"#e5e7eb",fontFamily:'"SF Mono","Fira Code",monospace',padding:0}}>
      <style>{`
        @keyframes sweep{from{transform:translateX(-100%)}to{transform:translateX(220%)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes slideIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        @keyframes fadeRow{from{opacity:0;transform:translateX(-6px)}to{opacity:1;transform:none}}
        @keyframes conFlash{0%{border-color:#f59e0b;box-shadow:0 0 16px #f59e0b55}100%{border-color:#f59e0b30;box-shadow:none}}
        @keyframes boxReveal{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:none}}
        @keyframes riskDrop{0%{color:#f87171}100%{color:#4ade80}}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:#060606}::-webkit-scrollbar-thumb{background:#1e1e1e}
        .tb{background:none;border:none;border-bottom:2px solid transparent;cursor:pointer;padding:7px 13px;font-family:monospace;font-size:10px;font-weight:700;letter-spacing:.5px;transition:all .2s;color:#6b7280}
        .tb.on{color:#fff;border-bottom-color:#10b981}
        .tb:not(.on):hover{color:#9ca3af}
        .rbtn{background:linear-gradient(135deg,#10b981,#06b6d4);color:#000;border:none;padding:9px 20px;border-radius:6px;font-family:monospace;font-size:11px;font-weight:700;cursor:pointer;width:100%;letter-spacing:1px;transition:all .2s}
        .rbtn:hover{box-shadow:0 4px 18px #10b98155;transform:translateY(-1px)}
        .xbtn{background:linear-gradient(135deg,#4f8ef7,#8b5cf6);color:#fff;border:none;padding:9px 20px;border-radius:6px;font-family:monospace;font-size:11px;font-weight:700;cursor:pointer;width:100%;transition:all .2s}
        .xbtn:hover{box-shadow:0 4px 18px #4f8ef755;transform:translateY(-1px)}
        .fr{animation:fadeRow .3s ease}
        .sc{animation:slideIn .4s ease}
        .cf{animation:conFlash .9s ease}
        .br{animation:boxReveal .4s ease}

        /* ── MOBILE OVERRIDES (≤767px) ── */
        @media (max-width: 767px) {
          /* Header: stack logo row + status row */
          .mob-header { flex-direction:column !important; align-items:flex-start !important; gap:6px !important; padding:8px 12px !important; }
          .mob-header-left { flex-wrap:wrap; gap:6px !important; }
          .mob-header-right { width:100%; justify-content:flex-start !important; }
          /* Hide verbose header items on mobile */
          .mob-hide { display:none !important; }
          /* Ticker: smaller text, still scrollable */
          .mob-ticker { padding:5px 10px !important; }
          .mob-ticker-item { padding:2px 7px !important; }
          .mob-ticker-item .tk-k { font-size:7px !important; }
          .mob-ticker-item .tk-v { font-size:9px !important; }
          /* Tab bar: no padding, smaller text, all fit */
          .mob-tabs { padding:0 6px !important; overflow-x:auto; flex-wrap:nowrap !important; }
          .tb { padding:7px 8px !important; font-size:8.5px !important; letter-spacing:0 !important; white-space:nowrap; }
          /* Bottom nav bar for mobile panel switching */
          .mob-bottom-nav { display:flex !important; }
          /* Main content area full width */
          .mob-center { height:calc(100vh - 200px) !important; }
          /* Execution grid: single column */
          .mob-exec-grid { grid-template-columns:1fr !important; }
          /* Outcome grid: single column */
          .mob-outcome-grid { grid-template-columns:1fr !important; }
          /* Log panel height cap */
          .mob-log-panel { height:200px !important; flex:none !important; }
          /* Agent sidebar: compact horizontal scroll strip */
          .mob-agent-strip { flex-direction:row !important; overflow-x:auto !important; padding:6px 8px !important; gap:5px !important; }
          .mob-agent-strip > div { min-width:110px !important; margin-bottom:0 !important; }
          /* Antigravity panel: hide on mobile to save space */
          .mob-ag-panel { display:none !important; }
          /* Confidence bar: hide on mobile */
          .mob-conf-bar { display:none !important; }
        }
        @media (min-width: 768px) {
          .mob-bottom-nav { display:none !important; }
        }
      `}</style>

      {/* ── HEADER ── */}
      <div className="mob-header" style={{background:"#060606",borderBottom:"1px solid #0f0f0f",padding:"9px 18px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div className="mob-header-left" style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:28,height:28,borderRadius:6,background:"linear-gradient(135deg,#10b981,#06b6d4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>⬡</div>
          <div>
            <div style={{fontSize:13,fontWeight:700,letterSpacing:2.5,color:"#fff"}}>AURA OS</div>
            {/* A) Orch ID in header */}
            <div style={{fontSize:7,color:"#4f8ef755",letterSpacing:.6,fontFamily:"monospace"}}>{sysState.orchId}</div>
          </div>
          <div className="mob-hide" style={{width:1,height:24,background:"#161616"}}/>
          <div className="mob-hide" style={{fontSize:8,color:"#4b5563"}}>CORE ORCHESTRATOR</div>
          <div style={{fontSize:9,color:"#4f8ef7",fontWeight:700,letterSpacing:1}}>GOOGLE ANTIGRAVITY</div>
          <span style={{fontSize:8,color:"#10b981",background:"#001a0d",border:"1px solid #10b98135",padding:"1px 5px",borderRadius:3}}>ACTIVE</span>
        </div>
        <div className="mob-header-right" style={{display:"flex",alignItems:"center",gap:14}}>
          {confTick && (
            <div style={{display:"flex",alignItems:"center",gap:7,background:"#090909",border:`1px solid ${confTick.color}35`,borderRadius:5,padding:"3px 9px"}}>
              <div style={{fontSize:8,color:"#6b7280"}}>CONFIDENCE</div>
              <div style={{fontSize:14,fontWeight:700,color:confTick.color}}>{fmtC(confTick.value)}</div>
              <div className="mob-hide" style={{fontSize:8,color:"#6b7280"}}>{confTick.label.toUpperCase()}</div>
            </div>
          )}
          {phase==="running" && <div style={{display:"flex",alignItems:"center",gap:6,fontSize:9,color:"#f59e0b"}}><div style={{width:5,height:5,borderRadius:"50%",background:"#f59e0b",animation:"pulse .9s infinite"}}/> <span className="mob-hide">CRISIS RESOLUTION ACTIVE</span><span style={{display:"none"}} className="mob-show">ACTIVE</span></div>}
          {phase==="done"    && <div style={{display:"flex",alignItems:"center",gap:6,fontSize:9,color:"#10b981"}}><div style={{width:5,height:5,borderRadius:"50%",background:"#10b981"}}/> <span>STABILIZED</span></div>}
          {phase==="idle"    && <div className="mob-hide" style={{fontSize:9,color:"#4b5563"}}>STANDBY — AWAITING TRIGGER</div>}
        </div>
      </div>

      {/* ── B) STATE TICKER — contrast fixed ── */}
      <StateTicker state={sysState}/>

      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "210px 1fr 270px",
        height: isMobile ? "calc(100vh - 148px)" : "calc(100vh - 94px)",
        overflow: "hidden",
        marginBottom: isMobile ? 54 : 0,
      }}>

        {/* ── LEFT (agents sidebar) ── hidden on mobile unless mobilePanel==="agents" */}
        <div style={{
          background:"#070707",
          borderRight:"1px solid #0f0f0f",
          padding:11,
          overflowY:"auto",
          display: isMobile && mobilePanel !== "agents" ? "none" : "flex",
          flexDirection:"column",
        }}>
          <div style={{fontSize:8,color:"#4b5563",letterSpacing:1,marginBottom:9}}>ANTIGRAVITY AGENT PIPELINE</div>
          {AGENTS.map((a,i)=><AgentRow key={a.id} agent={a} active={activeAgent} completed={completedAgents} idx={i}/>)}

          <div style={{marginTop:14,padding:"9px",background:"#090909",borderRadius:6,border:"1px solid #141414"}}>
            <div style={{fontSize:7,color:"#4b5563",letterSpacing:1,marginBottom:7}}>ORCHESTRATION FLOW</div>
            {["observe","extract","reason","decide","act","recover","evaluate"].map((f,i)=>(
              <div key={f} style={{display:"flex",alignItems:"center",gap:5,marginBottom:2}}>
                <div style={{width:13,height:13,borderRadius:"50%",background:"#0d0d0d",border:"1px solid #2a2a2a",display:"flex",alignItems:"center",justifyContent:"center",fontSize:7,color:"#555"}}>{i+1}</div>
                <span style={{fontSize:9,color:"#374151",textTransform:"uppercase",letterSpacing:.4}}>{f}</span>
              </div>
            ))}
          </div>

          {/* C) Antigravity call panel */}
          <div className="mob-ag-panel"><AntigravityCallPanel step={liveStep} orchId={sysState.orchId}/></div>

          {/* G) Confidence propagation */}
          <div className="mob-conf-bar"><ConfidencePropBar allSteps={allSteps}/></div>

          <div style={{marginTop:13}}>
            {phase==="idle" && <button className="rbtn" onClick={run}>▶  RUN SCENARIO</button>}
            {phase!=="idle" && <button className="xbtn" onClick={reset}>↺  RESET</button>}
          </div>

          <div style={{marginTop:11,padding:"8px 9px",background:"#050a08",border:"1px solid #0b1e14",borderRadius:6}}>
            <div style={{fontSize:7,color:"#10b98155",letterSpacing:1,marginBottom:5}}>ANTIGRAVITY EVENT MODEL</div>
            {['event_type: AGENT_STEP','confidence: dynamic','stateUpdate: reactive','next_action: routed','execLogs: streamed'].map(l=>(
              <div key={l} style={{fontSize:9,color:"#1a4a30",fontFamily:"monospace"}}>{l}</div>
            ))}
          </div>
        </div>

        {/* ── CENTER ── */}
        <div style={{
          display: isMobile && mobilePanel !== "main" ? "none" : "flex",
          flexDirection:"column",
          overflow:"hidden",
        }}>

          {/* Crisis feed */}
          <div style={{background:"#060606",borderBottom:"1px solid #0f0f0f",padding:"7px 15px"}}>
            <div style={{fontSize:8,color:"#4b5563",letterSpacing:1,marginBottom:6}}>LIVE CRISIS FEED — SUPPLY CHAIN DISRUPTION</div>
            <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:3}}>
              {FEED.map((sig,i)=>(
                <div key={i} style={{flexShrink:0,background:"#090909",border:`1px solid ${sig.sev==="critical"?"#ef444430":sig.sev==="high"?"#f59e0b30":"#1e1e1e"}`,borderRadius:5,padding:"4px 8px",maxWidth:185}}>
                  <div style={{fontSize:7,color:sig.sev==="critical"?"#ef4444":sig.sev==="high"?"#f59e0b":"#22c55e",fontWeight:700,letterSpacing:.8,marginBottom:2}}>{sig.source}</div>
                  <div style={{fontSize:10,color:"#6b7280",lineHeight:1.4}}>{sig.msg}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="mob-tabs" style={{background:"#070707",borderBottom:"1px solid #0f0f0f",padding:"0 15px",display:"flex",gap:2}}>
            {[{id:"reasoning",l:"REASONING TIMELINE"},{id:"contradiction",l:"⚡ CONTRADICTION"},{id:"execution",l:"⚙ EXECUTION"},{id:"outcome",l:"📈 OUTCOME"}].map(t=>(
              <button key={t.id} className={`tb ${tab===t.id?"on":""}`} onClick={()=>setTab(t.id)}>{t.l}</button>
            ))}
          </div>

          <div style={{flex:1,overflow:"hidden"}}>

            {/* ── REASONING ── */}
            {tab==="reasoning" && (
              <div style={{height:"100%",overflowY:"auto",padding:"14px 18px"}}>
                {/* H) Idle state */}
                {phase==="idle" && allSteps.length===0 && <IdleState onRun={run}/>}

                {(phase!=="idle" || allSteps.length>0) && (
                  <>
                    {allSteps.map((step,idx)=>{
                      const ag=AGENTS.find(a=>a.id===step.agent);
                      return (
                        <div key={idx} className="sc" style={{marginBottom:14,paddingBottom:14,borderBottom:"1px solid #0e0e0e"}}>
                          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                            <div style={{width:22,height:22,borderRadius:"50%",background:`${ag.color}20`,border:`1px solid ${ag.color}50`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11}}>{ag.icon}</div>
                            <div style={{flex:1}}>
                              <div style={{fontSize:9,fontWeight:700,color:ag.color,letterSpacing:.5,fontFamily:"monospace"}}>{ag.label.toUpperCase()} · {step.event_type}</div>
                              <div style={{fontSize:11,color:"#d1d5db"}}>{step.title}</div>
                            </div>
                            <div style={{fontSize:9,fontFamily:"monospace",color:"#10b981",background:"#001a0d",padding:"1px 6px",borderRadius:3,border:"1px solid #10b98130"}}>{fmtC(step.confidence)}</div>
                          </div>
                          <div style={{padding:"8px 10px",background:"#090909",borderRadius:5,border:"1px solid #141414",marginBottom:8}}>
                            <div style={{fontSize:8,color:"#4b5563",marginBottom:3}}>DECISION</div>
                            <div style={{fontSize:10,color:"#9ca3af"}}>{step.decision}</div>
                            {/* E) Memory citation */}
                            {step.memory && (
                              <div style={{marginTop:6,fontSize:8,color:"#1a3a20",paddingLeft:8,borderLeft:"2px solid #10b98120",fontFamily:"monospace"}}>{step.memory}</div>
                            )}
                          </div>
                          <div style={{display:"flex",flexDirection:"column",gap:4}}>
                            {step.outputs.map((out,oi)=>(
                              <div key={oi} className="fr" style={{display:"flex",alignItems:"flex-start",gap:6,padding:"4px 8px",background:"#0a0a0a",borderRadius:4,border:"1px solid #111"}}>
                                <TypeBadge type={out.type}/>
                                <div style={{flex:1,minWidth:0}}>
                                  <span style={{fontSize:9,color:"#6b7280",marginRight:6,fontFamily:"monospace"}}>{out.label}:</span>
                                  <span style={{fontSize:10,color:"#9ca3af"}}>{out.value}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}

                    {/* Live step */}
                    {liveStep && (() => {
                      const ag=AGENTS.find(a=>a.id===liveStep.agent);
                      return (
                        <div style={{marginBottom:14,paddingBottom:14,borderBottom:`1px solid ${ag.color}20`,background:`${ag.color}05`,borderRadius:7,padding:12}}>
                          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                            <div style={{width:22,height:22,borderRadius:"50%",background:`${ag.color}30`,border:`1px solid ${ag.color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,animation:"pulse .8s infinite"}}>{ag.icon}</div>
                            <div style={{flex:1}}>
                              <div style={{fontSize:9,fontWeight:700,color:ag.color,letterSpacing:.5}}>ACTIVE: {ag.label.toUpperCase()}</div>
                              <div style={{fontSize:11,color:"#e5e7eb"}}>{liveStep.title}</div>
                            </div>
                            <div style={{fontSize:9,color:ag.color,animation:"blink .8s infinite"}}>● PROCESSING</div>
                          </div>
                          {liveStep.memory && (
                            <div style={{marginBottom:6,fontSize:8,color:"#1a3a20",paddingLeft:8,borderLeft:"2px solid #10b98120",fontFamily:"monospace"}}>{liveStep.memory}</div>
                          )}
                          {liveOuts.map((out,oi)=>(
                            <div key={oi} className="fr" style={{display:"flex",alignItems:"flex-start",gap:6,padding:"4px 8px",background:"#0a0a0a",borderRadius:4,border:"1px solid #111",marginBottom:3}}>
                              <TypeBadge type={out.type}/>
                              <span style={{fontSize:9,color:"#6b7280",marginRight:4,fontFamily:"monospace"}}>{out.label}:</span>
                              <span style={{fontSize:10,color:"#9ca3af",flex:1}}>{out.value}</span>
                            </div>
                          ))}
                          <div style={{fontSize:9,color:"#1e1e1e",animation:"blink 1s infinite",marginTop:6}}>▊</div>
                        </div>
                      );
                    })()}
                  </>
                )}
              </div>
            )}

            {/* ── CONTRADICTION ── */}
            {tab==="contradiction" && (
              <div style={{height:"100%",overflowY:"auto",padding:"14px 18px"}}>
                {!contraData && <div style={{fontSize:10,color:"#4b5563",marginTop:50,textAlign:"center"}}>Awaiting contradiction detection...</div>}
                {contraData && (
                  <>
                    <div className="cf" style={{padding:"10px 13px",background:"#0f0800",border:"1px solid #f59e0b40",borderRadius:7,marginBottom:12}}>
                      <div style={{fontSize:10,fontWeight:700,color:"#f59e0b",marginBottom:3}}>⚡ CONFLICT DETECTED — INVENTORY DATA CONTRADICTION</div>
                      <div style={{fontSize:9,color:"#78350f"}}>
                        Conflict Score: <span style={{color:"#f59e0b",fontWeight:700}}>{contraData.conflictScore}/1.0</span> · Severity: CRITICAL · Resolution: PROBABILISTIC OVERRIDE
                      </div>
                    </div>

                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
                      {[
                        {src:"WAREHOUSE DB",   cred:contraData.credScores.wh,  stale:contraData.credScores.stale, verdict:"INVALIDATED", color:"#ef4444"},
                        {src:"SHIPMENT API",   cred:contraData.credScores.sh,  stale:"4min",                      verdict:"TRUSTED",     color:"#22c55e"},
                        {src:"SALES POS",      cred:contraData.credScores.pos, stale:"live",                      verdict:"TRUSTED",     color:"#22c55e"},
                      ].map((s,i)=>(
                        <div key={i} style={{background:"#0a0a0a",border:`1px solid ${s.color}30`,borderRadius:6,padding:10}}>
                          <div style={{fontSize:8,color:"#6b7280",marginBottom:4,letterSpacing:.5}}>{s.src}</div>
                          <div style={{fontSize:11,fontWeight:700,color:s.color,marginBottom:3}}>CRED: {s.cred}</div>
                          <div style={{fontSize:8,color:"#374151",marginBottom:4}}>Staleness: {s.stale}</div>
                          <div style={{background:`${s.color}15`,borderRadius:4,padding:"3px 6px",display:"inline-block"}}>
                            <span style={{fontSize:8,color:s.color,fontWeight:700}}>{s.verdict}</span>
                          </div>
                          {/* credibility bar */}
                          <div style={{marginTop:6,background:"#111",borderRadius:2,height:3}}>
                            <div style={{height:"100%",background:s.color,width:`${s.cred*100}%`,transition:"width 1s ease"}}/>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{background:"#050a03",border:"1px solid #22c55e30",borderRadius:6,padding:10,marginBottom:10}}>
                      <div style={{fontSize:8,color:"#22c55e",fontWeight:700,marginBottom:5}}>RESOLUTION — CREDIBILITY-WEIGHTED OVERRIDE</div>
                      <div style={{fontSize:10,color:"#6b7280",lineHeight:1.7}}>{contraData.decision}</div>
                    </div>

                    <div style={{display:"flex",flexDirection:"column",gap:4}}>
                      {contraData.outputs.map((out,i)=>(
                        <div key={i} className="fr" style={{display:"flex",alignItems:"flex-start",gap:6,padding:"5px 8px",background:"#0a0a0a",borderRadius:4,border:"1px solid #111"}}>
                          <TypeBadge type={out.type}/>
                          <div style={{flex:1,minWidth:0}}>
                            <span style={{fontSize:9,color:"#6b7280",marginRight:6,fontFamily:"monospace"}}>{out.label}:</span>
                            <span style={{fontSize:10,color:"#9ca3af"}}>{out.value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ── EXECUTION ── */}
            {tab==="execution" && (
              <div style={{height:"100%",display:"flex",flexDirection:"column",overflow:"hidden"}}>
                <div ref={execRef} style={{flex:1,overflowY:"auto",padding:"10px 14px",fontFamily:"monospace",fontSize:9}}>
                  {execLogs.length===0 && <div style={{color:"#4b5563",marginTop:20,textAlign:"center"}}>Execution pending...</div>}
                  {execLogs.map((el,i)=>(
                    <div key={i} className="fr" style={{lineHeight:1.6,padding:"1px 0",borderBottom:"1px solid #080808",
                      color:el.c==="err"?"#f87171":el.c==="ok"?"#4ade80":el.c==="warn"?"#fbbf24":"#6b7280"}}>
                      {el.t}
                    </div>
                  ))}
                  {activeAgent==="execution" && <div style={{fontSize:9,color:"#1a1a1a",animation:"blink 1s infinite"}}>▊</div>}
                </div>

                {/* D) Sequential box reveal */}
                <div className="mob-exec-grid" style={{padding:"10px 14px",borderTop:"1px solid #0f0f0f",display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  {execBoxes.map((item,i)=>(
                    <div key={i} className={item.show ? "br" : ""} style={{
                      background:"#090909",
                      border:`1px solid ${item.status==="fail"?"#ef444425":item.status==="recovery"?"#a78bfa25":item.status==="ok"?"#22c55e25":"#141414"}`,
                      borderRadius:6,padding:10,
                      opacity:item.show?1:0.2,
                      transition:"opacity .4s ease",
                    }}>
                      <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:3}}>
                        <span style={{fontSize:12,color:item.status==="fail"?"#ef4444":item.status==="recovery"?"#a78bfa":item.status==="ok"?"#22c55e":"#333"}}>{item.icon}</span>
                        <span style={{fontSize:9,fontWeight:700,color:item.status==="fail"?"#ef4444":item.status==="recovery"?"#a78bfa":item.status==="ok"?"#22c55e":"#333"}}>{item.label}</span>
                      </div>
                      <div style={{fontSize:9,color:"#4b5563",marginBottom:2}}>{item.desc}</div>
                      <div style={{fontSize:8,color:"#374151"}}>{item.detail}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── OUTCOME ── */}
            {tab==="outcome" && (
              <div style={{height:"100%",overflowY:"auto",padding:"14px 18px"}}>
                <div style={{fontSize:9,color:"#10b981",fontWeight:700,marginBottom:12,letterSpacing:1}}>📈 OUTCOME — ANTIGRAVITY SYSTEM STATE DELTA</div>
                {!outcomeData && <div style={{fontSize:10,color:"#4b5563",marginTop:50,textAlign:"center"}}>Outcome pending crisis resolution...</div>}
                {outcomeData && (<>
                  <div className="mob-outcome-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
                    {[
                      {label:"Stockout Risk",    before:`${outcomeData.sBefore}%`, after:`${outcomeData.sAfter}%`},
                      {label:"Revenue at Risk",  before:`$${(outcomeData.rBefore||218400).toLocaleString()}`, after:"$0"},
                      {label:"SLA Breach Risk",  before:"73%",          after:"4%"},
                      {label:"System Risk Score",before:`${(sysState.riskScore*4.5||8.5).toFixed(1)}`, after:outcomeData.riskAfter},
                    ].map((m,i)=>(
                      <div key={i} className="sc" style={{background:"#090909",border:"1px solid #111",borderRadius:6,padding:11}}>
                        <div style={{fontSize:8,color:"#6b7280",marginBottom:6,letterSpacing:.4}}>{m.label}</div>
                        <div style={{display:"flex",gap:9,alignItems:"center"}}>
                          <div style={{flex:1,textAlign:"center",background:"#0e0000",borderRadius:5,padding:"6px 3px"}}>
                            <div style={{fontSize:7,color:"#ef4444",marginBottom:2}}>BEFORE</div>
                            <div style={{fontSize:13,color:"#f87171",fontWeight:700}}>{m.before}</div>
                          </div>
                          <span style={{color:"#10b981",fontSize:11}}>→</span>
                          <div style={{flex:1,textAlign:"center",background:"#000e07",borderRadius:5,padding:"6px 3px"}}>
                            <div style={{fontSize:7,color:"#22c55e",marginBottom:2}}>AFTER</div>
                            {/* J) Count-up feel via CSS animation */}
                            <div style={{fontSize:13,color:"#4ade80",fontWeight:700,animation:"slideIn .6s ease"}}>{m.after}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* F) Heartbeat */}
                  <div style={{background:"#030a05",border:"1px solid #10b98130",borderRadius:7,padding:12,marginBottom:10}}>
                    <div style={{fontSize:8,color:"#10b981",fontWeight:700,marginBottom:6}}>SYSTEM STATUS: STABILIZED</div>
                    <div style={{fontSize:10,color:"#6b7280",lineHeight:1.8}}>
                      {sysState.poNumber&&<><span style={{color:"#10b981"}}>{sysState.poNumber}</span> confirmed &nbsp;|&nbsp;</>}
                      {sysState.ordersUpdated&&<>{sysState.ordersUpdated} ETAs updated &nbsp;|&nbsp;</>}
                      Heartbeat: <span style={{color:"#06b6d4"}}>ACTIVE</span> &nbsp;|&nbsp;
                      Next: <span style={{color:"#4f8ef7",fontFamily:"monospace"}}>{fmtHB(heartbeatSec)}</span>
                    </div>
                  </div>

                  <div style={{background:"#050a08",border:"1px solid #0b1e14",borderRadius:7,padding:11}}>
                    <div style={{fontSize:7,color:"#10b98155",letterSpacing:.8,marginBottom:7}}>ANTIGRAVITY FINAL EVENT PAYLOAD</div>
                    <div style={{fontSize:9,color:"#1a4a30",fontFamily:"monospace",lineHeight:1.7}}>
                      {[
                        `{ "event_type": "OUTCOME_EVENT",`,
                        `  "agent": "monitoring_agent",`,
                        `  "orch_id": "${sysState.orchId}",`,
                        `  "confidence": "${fmtC(outcomeData.confidence)}",`,
                        `  "phase": "${sysState.phase}",`,
                        `  "riskScore": ${sysState.riskScore?.toFixed?.(1)||sysState.riskScore},`,
                        `  "fallbackActivated": ${sysState.fallbackActivated},`,
                        `  "poNumber": "${sysState.poNumber||"N/A"}",`,
                        `  "next_action": "standby_monitor" }`,
                      ].map((l,i)=><div key={i}>{l}</div>)}
                    </div>
                    <div style={{marginTop:8,fontSize:7,color:"#10b98140",letterSpacing:1}}>✓ COMMITTED TO ANTIGRAVITY ORCHESTRATION LEDGER</div>
                  </div>
                </>)}
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: LOG ── */}
        <div style={{
          background:"#040404",
          borderLeft:"1px solid #0f0f0f",
          display: isMobile && mobilePanel !== "log" ? "none" : "flex",
          flexDirection:"column",
        }}>
          <div style={{padding:"8px 13px",borderBottom:"1px solid #0c0c0c",display:"flex",alignItems:"center",gap:6}}>
            <div style={{width:5,height:5,borderRadius:"50%",background:phase==="running"?"#10b981":"#1a1a1a",animation:phase==="running"?"pulse .8s infinite":"none"}}/>
            <span style={{fontSize:8,color:"#4b5563",letterSpacing:1}}>ANTIGRAVITY SYSTEM LOG</span>
            <span style={{fontSize:7,color:"#374151",marginLeft:"auto"}}>{logs.length} events</span>
          </div>
          <div ref={logRef} style={{flex:1,overflowY:"auto",padding:"9px 13px"}}>
            {logs.length===0 && <div style={{fontSize:8,color:"#2a2a2a"}}>No events yet...</div>}
            {logs.map((entry,i)=>{
              const isE=entry.t.includes("FAIL")||entry.t.includes("503")||entry.t.includes("💥")||entry.t.includes("✗");
              const isO=entry.t.includes("✓")||entry.t.includes("CREATED")||entry.t.includes("✅")||entry.t.includes("STABILIZED");
              const isW=entry.t.includes("⚡")||entry.t.includes("⚠")||entry.t.includes("RETRY")||entry.t.includes("CONFLICT")||entry.t.includes("OVERRIDDEN");
              const isA=entry.t.startsWith("ANTIGRAVITY")||entry.t.startsWith("AURA_OS");
              return (
                <div key={i} style={{fontSize:9,fontFamily:"monospace",lineHeight:1.55,padding:"1px 0",borderBottom:"1px solid #080808",
                  color:isE?"#f87171":isO?"#4ade80":isW?"#fbbf24":isA?"#4f8ef7":"#4b5563"}}>
                  <span style={{color:"#2a2a2a"}}>[{new Date(entry.ts).toISOString().slice(11,19)}]</span> {entry.t}
                </div>
              );
            })}
            {phase==="running" && <div style={{fontSize:9,color:"#2a2a2a",animation:"blink 1s infinite"}}>▊</div>}
          </div>
          <div style={{borderTop:"1px solid #0c0c0c"}}>
            <div style={{padding:"7px 13px"}}>
              <div style={{fontSize:7,color:"#4b5563",marginBottom:4,letterSpacing:.8}}>WORKFLOW — {completedAgents.length}/{AGENTS.length} AGENTS COMPLETE</div>
              <div style={{background:"#090909",borderRadius:3,height:3,overflow:"hidden"}}>
                <div style={{height:"100%",background:"linear-gradient(90deg,#10b981,#06b6d4)",width:`${(completedAgents.length/AGENTS.length)*100}%`,transition:"width .5s ease"}}/>
              </div>
            </div>
            {sysState.fallbackActivated && (
              <div style={{padding:"5px 13px",background:"#09000d",borderTop:"1px solid #180020"}}>
                <div style={{fontSize:7,color:"#a78bfa",letterSpacing:.8}}>⚡ FALLBACK ACTIVE — SUPPLIER D</div>
                {sysState.poNumber && <div style={{fontSize:8,color:"#7c3aed",fontFamily:"monospace"}}>{sysState.poNumber} confirmed</div>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── MOBILE BOTTOM NAV ── */}
      <div className="mob-bottom-nav" style={{
        position:"fixed", bottom:0, left:0, right:0,
        background:"#060606", borderTop:"1px solid #161616",
        display:"flex", zIndex:100,
      }}>
        {[
          {id:"agents", icon:"🤖", label:"AGENTS"},
          {id:"main",   icon:"⬡",  label:"MISSION"},
          {id:"log",    icon:"📋", label:"LOG"},
        ].map(btn=>(
          <button key={btn.id} onClick={()=>setMobilePanel(btn.id)} style={{
            flex:1, background:"none", border:"none", cursor:"pointer",
            padding:"10px 4px 8px",
            borderTop:`2px solid ${mobilePanel===btn.id?"#10b981":"transparent"}`,
            display:"flex", flexDirection:"column", alignItems:"center", gap:3,
          }}>
            <span style={{fontSize:16}}>{btn.icon}</span>
            <span style={{
              fontSize:8, fontFamily:"monospace", fontWeight:700, letterSpacing:.5,
              color: mobilePanel===btn.id ? "#10b981" : "#4b5563",
            }}>{btn.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}