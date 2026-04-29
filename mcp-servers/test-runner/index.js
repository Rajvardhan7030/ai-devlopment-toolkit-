#!/usr/bin/env node
/**
 * MCP Test Runner Server
 * Provides structured test execution for AI agents
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { execSync } from "child_process";
import { existsSync, readFileSync } from "fs";

// Detect project type and return test command
function detectTestCommand(suite) {
  if (existsSync("package.json")) {
    const pkg = JSON.parse(readFileSync("package.json", "utf8"));
    if (pkg.scripts?.test) {
      return suite ? `npm test -- ${escapeShellArg(suite)}` : "npm test";
    }
    return suite ? `npx jest ${escapeShellArg(suite)}` : "npx jest";
  }

  if (existsSync("pyproject.toml") || existsSync("pytest.ini")) {
    return suite ? `pytest -xvs ${escapeShellArg(suite)}` : "pytest -xvs";
  }

  if (existsSync("Cargo.toml")) {
    return suite ? `cargo test ${escapeShellArg(suite)}` : "cargo test";
  }

  if (existsSync("go.mod")) {
    return suite ? `go test -v ./... -run ${escapeShellArg(suite)}` : "go test ./...";
  }

  if (existsSync("pom.xml")) {
    return "mvn test";
  }

  throw new Error("No recognizable test configuration found");
}

function escapeShellArg(value) {
  return `'${String(value).replace(/'/g, `'\\''`)}'`;
}

// Parse test results into structured format
function parseTestResults(output, command) {
  const results = {
    success: false,
    command,
    summary: {},
    failures: [],
    output: output.slice(-2000), // Last 2000 chars
  };

  // Try to extract pass/fail counts
  const passMatch = output.match(/(\d+) passed/);
  const failMatch = output.match(/(\d+) failed/);
  const skipMatch = output.match(/(\d+) skipped/);

  if (passMatch) results.summary.passed = parseInt(passMatch[1]);
  if (failMatch) results.summary.failed = parseInt(failMatch[1]);
  if (skipMatch) results.summary.skipped = parseInt(skipMatch[1]);

  // Determine success
  results.success = !failMatch || results.summary.failed === 0;

  // Extract failure details (simple regex-based)
  const failureBlocks = output.match(/FAILED[\s\S]*?(?=FAILED|$)/g);
  if (failureBlocks) {
    results.failures = failureBlocks.map(block => ({
      test: block.match(/FAILED\s+(\S+)/)?.[1] || "unknown",
      error: block.slice(0, 500),
    }));
  }

  return results;
}

const server = new Server(
  {
    name: "mcp-test-runner",
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
        name: "run_tests",
        description: "Run project tests and return structured results",
        inputSchema: {
          type: "object",
          properties: {
            suite: {
              type: "string",
              description: "Optional test suite or pattern to run",
            },
            timeout: {
              type: "number",
              description: "Timeout in seconds (default: 120)",
              default: 120,
            },
          },
        },
      },
      {
        name: "detect_project",
        description: "Detect project type and available test frameworks",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "run_tests") {
    try {
      const command = detectTestCommand(args?.suite);
      const timeout = (args?.timeout || 120) * 1000;

      console.error(`Running: ${command}`);
      const output = execSync(command, {
        encoding: "utf8",
        timeout,
        cwd: process.cwd(),
      });

      const results = parseTestResults(output, command);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(results, null, 2),
          },
        ],
      };
    } catch (error) {
      // Command failed — tests didn't pass
      const output = `${error.stdout?.toString() || ""}\n${error.stderr?.toString() || ""}`.trim() || error.message || "";
      const results = parseTestResults(output, error.cmd || "unknown");
      results.success = false;
      results.error = error.message;

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(results, null, 2),
          },
        ],
      };
    }
  }

  if (name === "detect_project") {
    const projectTypes = [];
    if (existsSync("package.json")) projectTypes.push("nodejs");
    if (existsSync("pyproject.toml")) projectTypes.push("python");
    if (existsSync("Cargo.toml")) projectTypes.push("rust");
    if (existsSync("go.mod")) projectTypes.push("go");
    if (existsSync("pom.xml")) projectTypes.push("java-maven");

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ detected: projectTypes, cwd: process.cwd() }, null, 2),
        },
      ],
    };
  }

  throw new Error(`Unknown tool: ${name}`);
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Test Runner server started");
}

main().catch(console.error);
