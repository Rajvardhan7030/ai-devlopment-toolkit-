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
