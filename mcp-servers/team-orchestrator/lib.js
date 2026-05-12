import { mkdirSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";

export function normalizeList(value) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map(item => String(item).trim()).filter(Boolean);
  }
  return String(value)
    .split(/\r?\n|,/)
    .map(item => item.trim())
    .filter(Boolean);
}

export function buildManagerBrief(args = {}) {
  const task = String(args.task || "").trim();
  const constraints = normalizeList(args.constraints);
  const nonGoals = normalizeList(args.non_goals);
  const files = normalizeList(args.files);
  const risks = normalizeList(args.risks);
  const verificationTarget = String(
    args.verification_target || "Run targeted verification first, then broaden if needed."
  ).trim();

  return {
    objective: task || "Unspecified task",
    success_criteria:
      normalizeList(args.success_criteria).length > 0
        ? normalizeList(args.success_criteria)
        : [
            "Implementation satisfies the requested behavior",
            "Changes remain inside approved scope",
            "Relevant verification completes with clear results",
          ],
    non_goals: nonGoals,
    constraints,
    likely_files: files,
    risks,
    verification_target: verificationTarget,
  };
}

export function buildWorkerContract(worker, brief) {
  const commonInputs = [
    `Objective: ${brief.objective}`,
    `Success criteria: ${brief.success_criteria.join("; ")}`,
  ];

  if (brief.constraints.length > 0) {
    commonInputs.push(`Constraints: ${brief.constraints.join("; ")}`);
  }

  if (brief.non_goals.length > 0) {
    commonInputs.push(`Non-goals: ${brief.non_goals.join("; ")}`);
  }

  if (brief.likely_files.length > 0) {
    commonInputs.push(`Likely files: ${brief.likely_files.join(", ")}`);
  }

  if (worker === "planner") {
    return {
      worker: "planner",
      objective: "Convert the request into an execution-ready plan.",
      inputs: commonInputs,
      allowed_scope: [
        "Inspect and reason about scope, files, risks, and verification strategy",
        "Do not edit code",
      ],
      deliverable: [
        "Objective",
        "Constraints",
        "Assumptions",
        "Risks",
        "Files",
        "Implementation order",
        "Verification plan",
        "Task contract for coder",
        "Task contract for QA reviewer",
      ],
      verification_needed: ["Confirm the plan is scoped, reversible, and testable"],
      escalate_if: [
        "The request is ambiguous",
        "The feature spans too many unrelated modules",
        "Constraints conflict with the requested behavior",
      ],
    };
  }

  if (worker === "coder") {
    return {
      worker: "coder",
      objective: "Implement the smallest safe change that satisfies the approved plan.",
      inputs: commonInputs,
      allowed_scope: [
        "Only the files and code paths required for the requested change",
        "Tests directly related to the change",
        "No unrelated refactors",
      ],
      deliverable: [
        "Changed files",
        "Implementation summary",
        "Why the change satisfies the requirement",
        "Anything left unverified or out of scope",
      ],
      verification_needed: [
        "Run the most relevant targeted verification",
        "Record any verification that did not run",
      ],
      escalate_if: [
        "The assignment requires broader refactoring",
        "The root cause or implementation path is unclear",
        "The task cannot be completed inside the assigned scope",
      ],
    };
  }

  return {
    worker: "qa_reviewer",
    objective: "Verify the implementation and review it for regressions and residual risk.",
    inputs: commonInputs,
    allowed_scope: [
      "Inspect diff and changed files",
      "Run targeted verification first, then broader tests if needed",
      "Do not edit code",
    ],
    deliverable: [
      "Pass/fail status",
      "Verification evidence",
      "Findings",
      "Residual risk",
      "Follow-up actions",
    ],
    verification_needed: [brief.verification_target],
    escalate_if: [
      "Verification cannot run",
      "Failures indicate broader regressions",
      "The implementation appears to exceed scope",
    ],
  };
}

export function buildExecutionPlan(brief) {
  const plan = [
    "Planner defines scope, risks, target files, and verification approach.",
    "Coder implements the minimum scoped change.",
    "QA reviewer validates behavior, checks regressions, and reports residual risk.",
    "Manager reconciles outputs and returns the final delivery report.",
  ];

  if (brief.likely_files.length > 0) {
    plan.splice(1, 0, `Primary files to inspect: ${brief.likely_files.join(", ")}.`);
  }

  return plan;
}

export function createPlanningPacket(args = {}) {
  const brief = buildManagerBrief(args);
  return {
    manager_brief: brief,
    execution_order: ["planner", "coder", "qa_reviewer"],
    execution_plan: buildExecutionPlan(brief),
    worker_contracts: {
      planner: buildWorkerContract("planner", brief),
      coder: buildWorkerContract("coder", brief),
      qa_reviewer: buildWorkerContract("qa_reviewer", brief),
    },
  };
}

export function createWorkerResult(args = {}) {
  return {
    worker: String(args.worker || "").trim(),
    status: String(args.status || "unknown").trim(),
    summary: String(args.summary || "").trim(),
    changed_files: normalizeList(args.changed_files),
    verification: normalizeList(args.verification),
    findings: normalizeList(args.findings),
    blockers: normalizeList(args.blockers),
    residual_risk: normalizeList(args.residual_risk),
  };
}

export function createFinalReport(args = {}) {
  const managerBrief = args.manager_brief || {};
  const plannerResult = args.planner_result || {};
  const coderResult = args.coder_result || {};
  const qaResult = args.qa_result || {};

  return {
    objective: managerBrief.objective || "",
    success_criteria: managerBrief.success_criteria || [],
    implementation_summary: coderResult.summary || "",
    changed_files: coderResult.changed_files || [],
    verification_summary: qaResult.verification || [],
    findings: qaResult.findings || [],
    residual_risk: qaResult.residual_risk || [],
    blockers: [
      ...(plannerResult.blockers || []),
      ...(coderResult.blockers || []),
      ...(qaResult.blockers || []),
    ],
    final_status: qaResult.status || coderResult.status || plannerResult.status || "unknown",
  };
}

function mdList(items) {
  const normalized = normalizeList(items);
  if (normalized.length === 0) return "- None";
  return normalized.map(item => `- ${item}`).join("\n");
}

function jsonBlock(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function buildLifecycleWorkerContracts(idea, constraints, done) {
  return {
    research: {
      objective: "Validate the domain, similar solutions, feasibility, risks, and sources before implementation planning.",
      inputs: ["Project charter", "User idea", "Known constraints"],
      deliverable: ".ai-research/research-report.md",
      acceptance_criteria: [
        "Contains at least three source references",
        "Contains a risk matrix",
        "Identifies technical feasibility and recommended architecture patterns",
      ],
    },
    planner: {
      objective: "Convert research into a scoped implementation blueprint.",
      inputs: [".ai-research/research-report.md"],
      deliverables: [
        ".ai-plan/architecture.md",
        ".ai-plan/execution-plan.md",
        ".ai-plan/worker-contracts.json",
      ],
      acceptance_criteria: [
        "Architecture has no undefined dependencies",
        "Execution plan has phases, acceptance criteria, and test strategy",
        "Worker contracts define allowed scope and review requirements",
      ],
    },
    coder: buildWorkerContract("coder", buildManagerBrief({
      task: idea,
      constraints,
      success_criteria: done,
      verification_target: "Run generated test manifest commands and record results.",
    })),
    reviewer: {
      objective: "Assume the implementation is broken until proven otherwise.",
      inputs: [".ai-plan/architecture.md", ".ai-plan/execution-plan.md", "Project code", "tests/"],
      deliverable: ".ai-review/review-report.md",
      acceptance_criteria: [
        "No critical or high-severity issues remain",
        "Security, architecture, test quality, and performance are reviewed",
        "High-severity findings produce fix tickets before testing proceeds",
      ],
    },
    tester: {
      objective: "Execute the test manifest and summarize pass/fail evidence.",
      inputs: [".ai-testing/test-manifest.md"],
      deliverables: [".ai-testing/unit-test-results.log", ".ai-testing/coverage.log"],
      acceptance_criteria: [
        "All required tests pass",
        "Failures produce a diagnostic report",
        "Final delivery report lists verification evidence",
      ],
    },
  };
}

export function buildLifecycleArtifacts(args = {}) {
  const idea = String(args.idea || args.task || "").trim();
  if (!idea) {
    throw new Error("Missing required --idea");
  }

  const user = String(args.user || "Non-technical user").trim();
  const constraints = normalizeList(args.constraints);
  const done = normalizeList(args.done || args.success || "Production-ready workflow artifacts with validation gates");
  const domain = String(args.domain || "AI-assisted software development tooling").trim();
  const contracts = buildLifecycleWorkerContracts(idea, constraints, done);

  const artifacts = {
    ".ai-manager/project-charter.md": `# Project Charter

## Core Problem
${idea}

## End User
${user}

## Constraints
${mdList(constraints)}

## Definition of Done
${mdList(done)}
`,
    ".ai-manager/stage-log.json": jsonBlock({
      stages: [
        { stage: "research", status: "pending", iterations: 0 },
        { stage: "plan", status: "pending", iterations: 0 },
        { stage: "coding", status: "pending", iterations: 0 },
        { stage: "review", status: "pending", iterations: 0 },
        { stage: "test", status: "pending", iterations: 0 },
      ],
    }),
    ".ai-research/brief.md": `# Research Brief

## User Idea
${idea}

## Intended Outcome
Create an auditable workflow that turns the idea into research, planning, coding, review, testing, and final delivery artifacts.

## Target Domain
${domain}

## Constraints
${mdList(constraints)}

## Similar Solutions To Analyze
- OpenAI Codex and Codex CLI
- GitHub Copilot code review
- Local MCP-based developer workflow tools
- CI/CD quality-gate workflows
`,
    ".ai-research/research-report.md": `# Research Report

## Domain Landscape
Use this file to record verified research before implementation planning starts.

## Verified Sources
- Source 1:
- Source 2:
- Source 3:

## Technical Feasibility
Document feasibility, constraints, and recommended implementation shape.

## Risk Matrix
| Risk | Severity | Likelihood | Mitigation |
| --- | --- | --- | --- |
| Unvalidated requirements | High | Medium | Confirm project charter and acceptance criteria before coding. |
| Scope creep | Medium | Medium | Enforce worker contracts and allowed file scopes. |
| Weak verification | High | Medium | Require test manifest execution and review sign-off. |
`,
    ".ai-plan/inputs.txt": ".ai-manager/project-charter.md\n.ai-research/brief.md\n.ai-research/research-report.md\n",
    ".ai-plan/planner-instructions.md": `# Planner Instructions

Read the project charter and research report. Produce architecture, execution plan, and worker contracts before coding starts.
`,
    ".ai-plan/architecture.md": `# Architecture

## System Diagram
\`\`\`text
User idea -> Research -> Plan -> Code -> Review -> Test -> Delivery report
\`\`\`

## Tech Stack
- Existing project stack unless research identifies a blocker.

## Data Flow
1. Capture project charter.
2. Verify research and risks.
3. Produce architecture and execution plan.
4. Implement one scoped module at a time.
5. Review and test before final delivery.

## Security Considerations
- Validate external inputs.
- Do not commit secrets.
- Do not bypass review or tests for protected behavior.

## Undefined Dependencies
- None identified yet.
`,
    ".ai-plan/execution-plan.md": `# Execution Plan

## Milestones
1. Complete research gate.
2. Complete architecture and worker contracts.
3. Implement one scoped module.
4. Review for critical and high-severity issues.
5. Run tests and generate final delivery report.

## Acceptance Criteria
${mdList(done)}

## Testing Strategy
- Run unit tests for changed behavior.
- Run integration tests when real external boundaries are changed.
- Capture logs in .ai-testing.
`,
    ".ai-plan/worker-contracts.json": jsonBlock(contracts),
    ".ai-coding/current-task.md": `# Current Coding Task

## User Idea
${idea}

## Scope Rule
Implement one module per delegation. Write tests with behavior changes. Record changed files and verification evidence.
`,
    ".ai-coding/changes.log": "",
    ".ai-review/review-brief.md": `# Review Brief

## Architecture
.ai-plan/architecture.md

## Plan
.ai-plan/execution-plan.md

## Code
Project directory

## Tests
tests/

## Mandate
Assume this code is broken until proven otherwise.
`,
    ".ai-review/iteration-count.txt": "0\n",
    ".ai-testing/test-manifest.md": `# Test Manifest

## Unit Tests
- Run the repository's unit test command.

## Integration Scenarios
- Exercise changed workflows end to end where practical.

## Environment Requirements
- Local project dependencies installed.

## Acceptance Criteria
${mdList(done)}
`,
    "PROJECT-DELIVERY-REPORT.md": `# Project Delivery Report

## Executive Summary
Lifecycle artifacts have been generated for: ${idea}

## Stage Archive
- Research: .ai-research/research-report.md
- Plan: .ai-plan/architecture.md and .ai-plan/execution-plan.md
- Coding: .ai-coding/current-task.md
- Review: .ai-review/review-brief.md
- Test: .ai-testing/test-manifest.md

## Deliverables
- Structured workflow archive
- Worker contracts
- Test manifest

## Next Steps
- Complete research sources.
- Fill implementation details during the coding stage.
- Run the test manifest and update this report with results.
`,
  };

  return artifacts;
}

export function writeLifecycleArtifacts(outputDir, args = {}) {
  const targetDir = resolve(outputDir || ".");
  const artifacts = buildLifecycleArtifacts(args);
  const files = [];

  for (const [relativePath, content] of Object.entries(artifacts)) {
    const targetPath = resolve(targetDir, relativePath);
    mkdirSync(dirname(targetPath), { recursive: true });
    writeFileSync(targetPath, String(content), "utf8");
    files.push(relativePath);
  }

  return {
    status: "generated",
    output_dir: targetDir,
    files,
  };
}
