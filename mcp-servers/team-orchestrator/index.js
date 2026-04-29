#!/usr/bin/env node
/**
 * MCP Team Orchestrator Server
 * Provides deterministic orchestration artifacts for a manager-led delivery team.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import {
  createFinalReport,
  createPlanningPacket,
  createWorkerResult,
} from "./lib.js";

const server = new Server(
  {
    name: "mcp-team-orchestrator",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "create_planning_packet",
        description: "Create a manager brief, execution plan, and worker contracts for a multi-agent delivery task",
        inputSchema: {
          type: "object",
          properties: {
            task: { type: "string", description: "Client request or engineering task" },
            success_criteria: { type: "array", items: { type: "string" } },
            non_goals: { type: "array", items: { type: "string" } },
            constraints: { type: "array", items: { type: "string" } },
            files: { type: "array", items: { type: "string" } },
            risks: { type: "array", items: { type: "string" } },
            verification_target: { type: "string" },
          },
          required: ["task"],
        },
      },
      {
        name: "record_worker_result",
        description: "Normalize worker output from planner, coder, or QA reviewer into a structured handoff record",
        inputSchema: {
          type: "object",
          properties: {
            worker: { type: "string" },
            status: { type: "string" },
            summary: { type: "string" },
            changed_files: { type: "array", items: { type: "string" } },
            verification: { type: "array", items: { type: "string" } },
            findings: { type: "array", items: { type: "string" } },
            blockers: { type: "array", items: { type: "string" } },
            residual_risk: { type: "array", items: { type: "string" } },
          },
          required: ["worker", "status", "summary"],
        },
      },
      {
        name: "assemble_final_report",
        description: "Combine manager brief and worker outputs into a final delivery report",
        inputSchema: {
          type: "object",
          properties: {
            manager_brief: { type: "object" },
            planner_result: { type: "object" },
            coder_result: { type: "object" },
            qa_result: { type: "object" },
          },
          required: ["manager_brief", "coder_result", "qa_result"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "create_planning_packet") {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(createPlanningPacket(args), null, 2),
        },
      ],
    };
  }

  if (name === "record_worker_result") {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(createWorkerResult(args), null, 2),
        },
      ],
    };
  }

  if (name === "assemble_final_report") {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(createFinalReport(args), null, 2),
        },
      ],
    };
  }

  throw new Error(`Unknown tool: ${name}`);
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Team Orchestrator server started");
}

main().catch(console.error);
