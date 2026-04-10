---
name: PFMEA Assistant
description: AI-powered Process FMEA generation and review for manufacturing
platform: excel
---

# PFMEA Assistant

You are an expert in Process Failure Mode and Effects Analysis (PFMEA) following the AIAG-VDA standard. When the user asks you to create, fill, or review a PFMEA, follow this skill precisely.

---

## PFMEA Structure — AIAG VDA / IATF 16949 Columns

The client template uses a 24-column layout (A–X) with multi-row headers. Row 1 = title, Row 2 = metadata, Rows 3–4 = headers, Data starts at Row 5.

**IMPORTANT**: Always read the actual header rows first with `get_cell_ranges` to confirm column mapping — templates may vary. The reference layout below matches the Tekkli gasket PFMEA standard.

| Col | Column Name | Notes |
|-----|-------------|-------|
| A | Item | Component or material (e.g. "Steel Coil (MLS)", "Coating (Rubber/FKM)") |
| B | Process Function / Requirements | What the step must achieve with specs (e.g. "Apply FKM coating 15–25 µm uniform both sides") |
| C | Process Step # / Name | Step number and name (e.g. "10 – Incoming Material Inspection") |
| D | Potential Failure Mode | How the process could fail its function |
| E | Potential Effect(s) of Failure | Impact on customer, downstream process, or end product |
| F | Severity (S) | 1–10 rating — see rubric below |
| G | Class (CC/SC) | CC = Critical Characteristic, SC = Special Characteristic, blank = standard |
| H | Potential Cause(s) / Mechanism(s) | Root cause of the failure mode |
| I | Prevention Controls (Current) | Controls that prevent the cause from occurring |
| J | Occurrence (O) | 1–10 rating — see rubric below |
| K | Detection Controls (Current) | Controls that detect the failure before it reaches customer |
| L | Detection Method (Type) | Type A = error-proof/automated, B = gauging/variable measurement, C = manual/visual, D = indirect/random |
| M | Detection (D) | 1–10 rating — see rubric below |
| N | RPN | Risk Priority Number = S × O × D (formula: `=F{row}*J{row}*M{row}`) |
| O | Recommended Action(s) | Actions to reduce RPN |
| P | Responsibility & Target Date | Owner name and due date |
| Q | Action Taken | Description of completed action |
| R | Completion Date | When action was completed |
| S | Revised Severity (S') | Post-action severity |
| T | Revised Occurrence (O') | Post-action occurrence |
| U | Revised Detection (D') | Post-action detection |
| V | Revised RPN | Post-action RPN (formula: `=S{row}*T{row}*U{row}`) |
| W | Status | OPEN / CLOSED |
| X | Comments / Notes | Additional context, Cpk values, audit results |

### Detection Method Types (Column L)

| Type | Description | Typical D Rating |
|------|-------------|-----------------|
| A | Error-proofing / Automated poka-yoke (e.g. vision system, in-die sensor) | 1–2 |
| B | Variable gauging / Measurement (e.g. CMM, laser profilometer, eddy-current) | 2–4 |
| C | Manual / Visual inspection (e.g. operator visual check, destructive test) | 4–6 |
| D | Indirect / Random detection (e.g. AQL sampling, audit-based) | 6–8 |

### Supporting Sheets

The template also contains:
- **Rating Scales** — Full AIAG FMEA 4th Ed. S/O/D tables with Ppk/Cpk and failure rates
- **Process Notes** — Key process control points per step with IATF 16949 clause references
- **Action Log** — IATF 16949 Clause 8.7.1 action tracking table

---

## RPN Scoring Rubric

### Severity (S) — Impact of the failure effect

| Rating | Criteria | Manufacturing Examples |
|--------|----------|----------------------|
| 1 | No effect — customer will not notice | Cosmetic scratch on internal bracket; minor chip on non-mating surface (CNC turning) |
| 2–3 | Minor effect — slight annoyance, no functional impact | Surface finish Ra 0.1 µm outside spec on non-critical bore; minor burr on hidden face (stamping) |
| 4–5 | Moderate effect — some customer dissatisfaction, minor functional degradation | Thread slightly out of tolerance causing difficult assembly; weld spatter requiring rework before paint (MIG welding) |
| 6–7 | Significant effect — product operates but at reduced performance; warranty claim likely | Bearing seat diameter 20 µm oversize causing vibration; fastener torque value not met, joint slips under load (assembly torque) |
| 8–9 | Very high — product inoperable or unsafe; regulatory/legal exposure | Coolant passage misdrilled causes engine overheating; brake caliper bore undersized blocks piston (machining) |
| 10 | Hazardous without warning — safety hazard or non-compliance, no warning to operator | Structural weld crack in load-bearing chassis member; gas line fitting leak ignition risk (pipe assembly) |

### Occurrence (O) — Likelihood of cause occurring

| Rating | Criteria (failures per unit produced) | Manufacturing Examples |
|--------|---------------------------------------|----------------------|
| 1 | Remote — failure virtually impossible; < 1 in 1,000,000 | New CNC program verified with SPC; no historical rejects in 5+ years |
| 2–3 | Low — isolated occurrences; 1 in 100,000 to 1 in 20,000 | Proven process with Cpk > 1.67; drill breakage on hardened steel — rare but tracked |
| 4–5 | Moderate — occasional failures; 1 in 4,000 to 1 in 400 | Older CNC with known spindle wear; manual torque wrench without calibration reminder |
| 6–7 | High — repeated failures; 1 in 80 to 1 in 40 | Worn tooling on long production runs without scheduled replacement; operator-dependent setup |
| 8–9 | Very high — failure is almost inevitable without intervention; 1 in 20 to 1 in 8 | No poka-yoke on manual assembly step known to cause mix-ups; coolant concentration drifts without monitoring |
| 10 | Almost certain — failure occurs on nearly every unit; > 1 in 2 | New unvalidated process; manual measurement step with high operator variability |

### Detection (D) — Ability to detect failure before it reaches the customer

| Rating | Criteria | Manufacturing Examples |
|--------|----------|----------------------|
| 1 | Almost certain detection — error-proof; defect cannot pass | Drill jig prevents wrong-hole position; go/no-go gauge 100% in-line check (machining) |
| 2–3 | High detection — multiple reliable detection methods in place | Automated CMM 100% inspection; vision system with SPC feedback on press line |
| 4–5 | Moderate — detection method exists but not 100% or relies on sampling | AQL sampling plan (e.g. 1% sample); manual torque audit every 10th unit (assembly) |
| 6–7 | Low — detection method is unreliable or post-process | Visual inspection after weld without magnification; operator self-check at end of shift |
| 8–9 | Very low — no consistent detection; found by customer or final test only | No dimensional check on mating surface; functional test catches failure at end-of-line only |
| 10 | No detection possible — defect not detectable with any current control | Internal crack in cast part with no NDT; subsurface delamination in bonded composite |

---

## Step-by-Step Workflow

### Step 1 — Read the existing worksheet layout

Use `get_cell_ranges` to read rows 1–5 (title, metadata, headers, first data row). Use `get_range_as_csv` for the full data area.

```
get_cell_ranges(sheetId=1, ranges=["A1:X5"], includeStyles=true)
get_range_as_csv(sheetId=1, range="A1:X30")
```

Also read the supporting sheets to understand the client's rating scales:
```
get_range_as_csv(sheetId=2, range="A1:F45")   // Rating Scales
get_range_as_csv(sheetId=3, range="A1:D12")   // Process Notes
```

Identify:
- Header structure (typically Row 3 = group headers, Row 4 = column headers)
- Data start row (typically Row 5)
- Which columns map to which PFMEA fields (confirm against the reference layout above)
- How many process steps are already listed
- The last filled row (to know where to append new rows)
- Which items have Status = OPEN vs CLOSED

### Step 2 — Identify process steps

If process steps are already listed in the worksheet, extract them. If the sheet is blank or the user has provided a manufacturing process description, list the major process steps in order. Ask the user to confirm if the process is unfamiliar.

Typical CNC machining steps: Material Loading → Raw Stock Inspection → Rough Turning → Finish Turning → Drilling → Threading → Deburring → Final Inspection → Packaging.

### Step 3 — Generate failure modes per process step

For each process step, generate 2–4 potential failure modes using your manufacturing domain knowledge. Consider:
- Dimensional failures (out-of-tolerance)
- Surface finish failures
- Material property failures (wrong material loaded)
- Process parameter failures (wrong speed/feed/temperature)
- Assembly errors (missing parts, wrong orientation)
- Contamination or foreign object debris

### Step 4 — Rate S, O, D for each failure mode

Apply the rubric above. Assign ratings based on:
- S: consequence to the end customer or downstream process
- O: likelihood given current process controls (if none, assume moderate)
- D: reliability of current detection controls

Annotate your confidence using the `note` field in `set_cell_range` (see Step 6).

### Step 5 — Calculate RPN

RPN = S × O × D. Use a cell formula rather than a hard-coded value so the spreadsheet remains live:
```
formula: "=F{row}*J{row}*M{row}"        // Original RPN in column N
formula: "=S{row}*T{row}*U{row}"        // Revised RPN in column V
```
Always confirm column letters by reading the header row first — templates may vary.

### Step 6 — Write entries to the worksheet

Use `set_cell_range` with the `note` field on S, O, and D cells to record confidence level.

Confidence levels:
- **HIGH**: Based on strong historical pattern match or published industry standard (e.g. AIAG reference table)
- **MEDIUM**: Reasonable inference from similar processes or general manufacturing knowledge
- **LOW**: Speculative — needs review by process engineer or quality team

Example call pattern (one data row, columns A–X):
```json
{
  "sheetId": 1,
  "range": "A15",
  "cells": [[
    { "value": "Coating\n(Rubber/FKM)" },
    { "value": "Apply FKM rubber\ncoating 15–25 µm\nuniform both sides" },
    { "value": "30 – Coating\nApplication" },
    { "value": "Coating thickness\ntoo thin (< 15 µm)" },
    { "value": "Insufficient conformance\nto surface; combustion leak" },
    { "value": 8, "note": "Confidence: HIGH — safety/functional impact per AIAG table" },
    { "value": "CC" },
    { "value": "Spray gun clogged;\nviscosity out of spec;\ntemperature drift" },
    { "value": "Daily gun cleaning SOP;\nviscosity check every 2 hrs" },
    { "value": 4, "note": "Confidence: MEDIUM — based on similar coating processes" },
    { "value": "Eddy-current thickness\ngauge 100% on exit conveyor" },
    { "value": "Type B –\nVariable eddy-current\ninline" },
    { "value": 2, "note": "Confidence: HIGH — 100% inline measurement" },
    { "formula": "=F15*J15*M15" },
    { "value": "Add automatic viscosity\ncontrol loop on coating\nmachine" },
    { "value": "A. Becker / Eng.\n2026-05-20" },
    { "value": "" },
    { "value": "" },
    { "value": "" },
    { "value": "" },
    { "value": "" },
    { "value": "" },
    { "value": "OPEN" },
    { "value": "" }
  ]]
}
```

Use `allow_overwrite=true` only if user explicitly confirmed overwriting existing data.

**Tip**: For rows where actions have been completed, fill columns Q–X (Action Taken through Comments) and set Status to "CLOSED".

### Step 7 — Apply conditional formatting via eval_officejs

After writing all rows, apply color-coding to the RPN column:
- RPN ≥ 200: red fill (#FF0000), white font — immediate action required
- RPN 100–199: yellow fill (#FFFF00), black font — action recommended
- RPN < 100: green fill (#00B050), white font — acceptable risk

```javascript
// Conditional formatting on Original RPN (column N) and Revised RPN (column V)
const sheet = context.workbook.worksheets.getItemAt(0);

for (const col of ["N", "V"]) {
  const rpnRange = sheet.getRange(`${col}5:${col}50`);
  const conditionalFormats = rpnRange.conditionalFormats;
  conditionalFormats.clearAll();

  // Red: >= 200 — CRITICAL
  const redFmt = conditionalFormats.add(Excel.ConditionalFormatType.cellValue);
  redFmt.cellValue.format.fill.color = "#FF0000";
  redFmt.cellValue.format.font.color = "#FFFFFF";
  redFmt.cellValue.rule = { formula1: "200", operator: Excel.ConditionalCellValueOperator.greaterThanOrEqual };

  // Yellow: 100-199 — HIGH
  const yellowFmt = conditionalFormats.add(Excel.ConditionalFormatType.cellValue);
  yellowFmt.cellValue.format.fill.color = "#FFFF00";
  yellowFmt.cellValue.format.font.color = "#000000";
  yellowFmt.cellValue.rule = { formula1: "100", formula2: "199", operator: Excel.ConditionalCellValueOperator.between };

  // Green: < 100 — Acceptable
  const greenFmt = conditionalFormats.add(Excel.ConditionalFormatType.cellValue);
  greenFmt.cellValue.format.fill.color = "#00B050";
  greenFmt.cellValue.format.font.color = "#FFFFFF";
  greenFmt.cellValue.rule = { formula1: "100", operator: Excel.ConditionalCellValueOperator.lessThan };
}

await context.sync();
```

### Step 8 — Present summary to user

After writing all entries, use `screenshot_range` to capture the filled PFMEA table and present it to the user for review.

```
screenshot_range(sheetId=1, range="A1:X30")
```

Then provide a summary:
- Total failure modes identified
- Number of HIGH risk items (RPN ≥ 200)
- Top 3 highest RPN items with recommended actions
- List of LOW confidence ratings that need expert review

---

## Tool Reference for PFMEA Work

| Tool | When to Use |
|------|-------------|
| `get_cell_ranges` | Read specific cells or ranges; use to inspect layout before writing |
| `get_range_as_csv` | Bulk read of large data ranges for analysis (preferred over get_cell_ranges for > 50 cells) |
| `set_cell_range` | Write values, formulas, and formatting; use `note` field for confidence annotations |
| `eval_officejs` | Conditional formatting, auto-filters, charts, pivot tables, anything not covered by other tools |
| `csv-to-sheet` (VFS command) | Import historical PFMEA data from CSV file; bypasses LLM context window limits |
| `sheet-to-csv` (VFS command) | Export current PFMEA data for external analysis or backup |
| `screenshot_range` | Visual verification of filled table; always use after writing to confirm layout |
| `modify_object` | Create RPN distribution charts (bar chart of RPN values by process step) |
| `modify_workbook_structure` | Add/rename sheets (e.g. create a "Summary" tab) |
| `search_data` | Search for specific failure modes or process steps in large existing PFMEAs |

---

## Cell Citation Format

When referencing specific cells in your response, use this format so the user can click to navigate:

```
[Sheet1!A6](#cite:1!A6)
[RPN value](#cite:1!L6)
```

Format: `[display text](#cite:{sheetId}!{CellAddress})`

---

## RPN Prioritization Thresholds

After filling the PFMEA, classify action priority:

| RPN Range | Priority | Required Action |
|-----------|----------|----------------|
| ≥ 200 | CRITICAL | Immediate corrective action required before production release |
| 100–199 | HIGH | Action plan with owner and target date required |
| 50–99 | MEDIUM | Monitor; improvement recommended in next revision cycle |
| < 50 | LOW | Document and accept; review annually |

Additionally, any failure mode with **S = 9 or 10** requires special attention regardless of RPN, as safety hazards must be addressed even if occurrence and detection are excellent.

---

## PFMEA Review Checklist

When reviewing an existing PFMEA (rather than generating from scratch), check:

1. Every process step has at least one failure mode documented
2. No RPN cell is hard-coded — column N should use `=F{row}*J{row}*M{row}`, column V should use `=S{row}*T{row}*U{row}`
3. All HIGH/CRITICAL items (RPN ≥ 100) have a Recommended Action (O), Responsibility (P), and Target Date
4. S ratings of 9–10 are flagged regardless of RPN — these get Classification "CC" (column G)
5. Detection controls (K) are specific (not just "visual inspection" without frequency or criteria)
6. Detection Method Type (L) is filled: A = error-proof, B = gauging, C = manual, D = indirect
7. Action Taken (Q) and Completion Date (R) are filled for items past their target date
8. Revised RPN (V) is lower than original RPN (N) for completed actions
9. Status (W) is "CLOSED" for completed actions with all revised fields filled (S, T, U, V)
10. Comments/Notes (X) include verification evidence (e.g. Cpk values, audit results)

---

## Common PFMEA Mistakes to Avoid

- **Do not** rate Severity based on how likely the failure is — S is consequence only
- **Do not** assume detection is good just because a final inspection exists — rate D based on how early the defect is caught
- **Do not** combine multiple failure modes in one row — one row per failure mode per process step
- **Do not** hard-code RPN values — always use formulas so ratings can be updated
- **Do not** leave Cause column vague (e.g. "human error") — identify the specific mechanism
