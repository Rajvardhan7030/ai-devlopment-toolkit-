import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  buildManagerBrief,
  buildWorkerContract,
  buildLifecycleArtifacts,
  createFinalReport,
  createPlanningPacket,
  createWorkerResult,
  normalizeList,
  writeLifecycleArtifacts,
} from "../mcp-servers/team-orchestrator/lib.js";

test("buildLifecycleArtifacts creates required lifecycle files", () => {
  const artifacts = buildLifecycleArtifacts({
    idea: "Automate research, planning, coding, review, and testing",
    user: "Non-technical founder",
    constraints: "budget-sensitive,local-first",
    done: "Production ready",
  });

  const requiredFiles = [
    ".ai-manager/project-charter.md",
    ".ai-manager/stage-log.json",
    ".ai-research/brief.md",
    ".ai-research/research-report.md",
    ".ai-plan/architecture.md",
    ".ai-plan/execution-plan.md",
    ".ai-plan/worker-contracts.json",
    ".ai-coding/current-task.md",
    ".ai-review/review-brief.md",
    ".ai-docs/doc-update-brief.md",
    ".ai-testing/test-manifest.md",
    "PROJECT-DELIVERY-REPORT.md",
  ];

  for (const file of requiredFiles) {
    assert.ok(Object.hasOwn(artifacts, file), `missing ${file}`);
    assert.match(artifacts[file], /\S/, `${file} should not be empty`);
  }

  const contracts = JSON.parse(artifacts[".ai-plan/worker-contracts.json"]);
  assert.equal(contracts.research.deliverable, ".ai-research/research-report.md");
  assert.equal(contracts.reviewer.deliverable, ".ai-review/review-report.md");
  assert.deepEqual(contracts.doc_updater.deliverables, [
    "README.md",
    "docs/",
    "PROJECT-DELIVERY-REPORT.md",
  ]);
  assert.match(artifacts[".ai-manager/project-charter.md"], /Non-technical founder/);
  assert.match(artifacts["PROJECT-DELIVERY-REPORT.md"], /\.ai-docs\/doc-update-brief\.md/);
});

test("writeLifecycleArtifacts writes the workflow archive to the requested output directory", () => {
  const outputDir = mkdtempSync(join(tmpdir(), "team-flow-lifecycle-"));
  const summary = writeLifecycleArtifacts(outputDir, {
    idea: "Make the delivery lifecycle automatic",
    user: "Non-technical user",
    constraints: "local-first",
    done: "Production ready",
  });

  assert.equal(summary.status, "generated");
  assert.ok(summary.files.includes(".ai-testing/test-manifest.md"));

  const charter = readFileSync(join(outputDir, ".ai-manager/project-charter.md"), "utf8");
  assert.match(charter, /Make the delivery lifecycle automatic/);

  const workerContracts = JSON.parse(
    readFileSync(join(outputDir, ".ai-plan/worker-contracts.json"), "utf8")
  );
  assert.ok(workerContracts.coder.deliverable.length > 0);
});

test("lifecycle artifact generation fails clearly when idea is missing", () => {
  assert.throws(
    () => writeLifecycleArtifacts(mkdtempSync(join(tmpdir(), "team-flow-lifecycle-")), {}),
    /Missing required --idea/
  );
});

test("orchestrator helpers normalize inputs and build worker handoffs", () => {
  assert.deepEqual(normalizeList("alpha, beta\n gamma"), ["alpha", "beta", "gamma"]);

  const brief = buildManagerBrief({
    task: "Ship a feature",
    constraints: ["small scope"],
    non_goals: "unrelated refactor",
    files: "lib.js",
    risks: "regression",
  });

  assert.equal(brief.objective, "Ship a feature");
  assert.deepEqual(brief.constraints, ["small scope"]);

  const packet = createPlanningPacket({
    task: "Ship a feature",
    files: "lib.js",
    success_criteria: "tests pass",
  });
  assert.deepEqual(packet.execution_order, ["planner", "coder", "qa_reviewer", "doc_updater"]);
  assert.match(packet.execution_plan.join("\n"), /Primary files to inspect: lib.js/);

  const plannerContract = buildWorkerContract("planner", brief);
  const qaContract = buildWorkerContract("qa_reviewer", brief);
  const docContract = buildWorkerContract("doc_updater", brief);
  assert.equal(plannerContract.worker, "planner");
  assert.equal(qaContract.worker, "qa_reviewer");
  assert.equal(docContract.worker, "doc_updater");
  assert.match(docContract.objective, /documentation/);

  const workerResult = createWorkerResult({
    worker: "coder",
    status: "done",
    summary: "Implemented",
    changed_files: "lib.js,test.js",
  });
  assert.deepEqual(workerResult.changed_files, ["lib.js", "test.js"]);

  const finalReport = createFinalReport({
    manager_brief: brief,
    coder_result: workerResult,
    qa_result: { status: "passed", verification: ["node --test"], findings: [] },
    doc_updater_result: {
      status: "updated",
      summary: "Updated README",
      changed_files: ["README.md"],
    },
  });
  assert.equal(finalReport.final_status, "passed");
  assert.deepEqual(finalReport.changed_files, ["lib.js", "test.js"]);
  assert.equal(finalReport.documentation_summary, "Updated README");
  assert.equal(finalReport.documentation_status, "updated");
  assert.deepEqual(finalReport.documentation_files, ["README.md"]);
});
