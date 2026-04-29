#!/usr/bin/env node

import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import {
  createFinalReport,
  createPlanningPacket,
  createWorkerResult,
} from "./lib.js";

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
      continue;
    }
    args[key] = next;
    index += 1;
  }
  return args;
}

function ensureDir(path) {
  mkdirSync(path, { recursive: true });
}

function writeJson(path, data) {
  ensureDir(dirname(path));
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function parseListArg(value) {
  if (!value) return [];
  return String(value)
    .split(",")
    .map(item => item.trim())
    .filter(Boolean);
}

function usage() {
  console.error(`Usage:
  node team-flow.js init --task "..." [--output ./.team-flow]
  node team-flow.js worker --worker planner|coder|qa_reviewer --status done --summary "..." [--output ./.team-flow]
  node team-flow.js finalize [--output ./.team-flow]
`);
  process.exit(1);
}

function resolveOutputDir(args) {
  return resolve(process.cwd(), args.output || ".team-flow");
}

function initFlow(args) {
  if (!args.task) {
    throw new Error("Missing required --task");
  }

  const outputDir = resolveOutputDir(args);
  const packet = createPlanningPacket({
    task: args.task,
    success_criteria: parseListArg(args.success),
    non_goals: parseListArg(args.non_goals),
    constraints: parseListArg(args.constraints),
    files: parseListArg(args.files),
    risks: parseListArg(args.risks),
    verification_target: args.verification_target,
  });

  ensureDir(outputDir);
  writeJson(resolve(outputDir, "planning-packet.json"), packet);
  writeJson(resolve(outputDir, "planner-contract.json"), packet.worker_contracts.planner);
  writeJson(resolve(outputDir, "coder-contract.json"), packet.worker_contracts.coder);
  writeJson(resolve(outputDir, "qa-reviewer-contract.json"), packet.worker_contracts.qa_reviewer);

  console.log(JSON.stringify({
    status: "initialized",
    output_dir: outputDir,
    files: [
      "planning-packet.json",
      "planner-contract.json",
      "coder-contract.json",
      "qa-reviewer-contract.json",
    ],
  }, null, 2));
}

function recordWorker(args) {
  if (!args.worker || !args.status || !args.summary) {
    throw new Error("Missing required --worker, --status, or --summary");
  }

  const outputDir = resolveOutputDir(args);
  const result = createWorkerResult({
    worker: args.worker,
    status: args.status,
    summary: args.summary,
    changed_files: parseListArg(args.changed_files),
    verification: parseListArg(args.verification),
    findings: parseListArg(args.findings),
    blockers: parseListArg(args.blockers),
    residual_risk: parseListArg(args.residual_risk),
  });

  writeJson(resolve(outputDir, `${args.worker}-result.json`), result);

  console.log(JSON.stringify({
    status: "recorded",
    worker: args.worker,
    output_dir: outputDir,
    file: `${args.worker}-result.json`,
  }, null, 2));
}

function finalizeFlow(args) {
  const outputDir = resolveOutputDir(args);
  const packet = readJson(resolve(outputDir, "planning-packet.json"));
  const plannerResult = readJson(resolve(outputDir, "planner-result.json"));
  const coderResult = readJson(resolve(outputDir, "coder-result.json"));
  const qaResult = readJson(resolve(outputDir, "qa_reviewer-result.json"));

  const report = createFinalReport({
    manager_brief: packet.manager_brief,
    planner_result: plannerResult,
    coder_result: coderResult,
    qa_result: qaResult,
  });

  writeJson(resolve(outputDir, "final-report.json"), report);
  console.log(JSON.stringify(report, null, 2));
}

function main() {
  const [, , command, ...rest] = process.argv;
  if (!command) usage();

  const args = parseArgs(rest);

  if (command === "init") {
    initFlow(args);
    return;
  }

  if (command === "worker") {
    recordWorker(args);
    return;
  }

  if (command === "finalize") {
    finalizeFlow(args);
    return;
  }

  usage();
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
