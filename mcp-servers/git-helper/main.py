#!/usr/bin/env python3
"""
MCP Git Helper Server
Provides safe git operations for AI agents
"""

import asyncio
import json
import os
import subprocess
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import TextContent, Tool

app = Server("mcp-git-helper")


def run_git(args: list[str], cwd: str | None = None) -> tuple[str, str, int]:
    """Run a git command safely."""
    try:
        result = subprocess.run(
            ["git"] + args,
            capture_output=True,
            text=True,
            cwd=cwd or os.getcwd(),
            timeout=30,
        )
        return result.stdout, result.stderr, result.returncode
    except subprocess.TimeoutExpired:
        return "", "Command timed out", 1
    except FileNotFoundError:
        return "", "git not found", 127


@app.list_tools()
async def list_tools() -> list[Tool]:
    return [
        Tool(
            name="git_status",
            description="Check git status and detect uncommitted changes",
            inputSchema={
                "type": "object",
                "properties": {},
            },
        ),
        Tool(
            name="git_diff",
            description="Show current diff (staged and unstaged)",
            inputSchema={
                "type": "object",
                "properties": {
                    "staged": {
                        "type": "boolean",
                        "description": "Show only staged changes",
                        "default": False,
                    },
                },
            },
        ),
        Tool(
            name="git_log",
            description="Show recent commit history",
            inputSchema={
                "type": "object",
                "properties": {
                    "count": {
                        "type": "integer",
                        "description": "Number of commits to show",
                        "default": 10,
                    },
                },
            },
        ),
        Tool(
            name="git_branch",
            description="Show current branch and recent branches",
            inputSchema={
                "type": "object",
                "properties": {},
            },
        ),
        Tool(
            name="check_safe_to_edit",
            description="Check if working tree is clean and safe to edit",
            inputSchema={
                "type": "object",
                "properties": {},
            },
        ),
    ]


@app.call_tool()
async def call_tool(name: str, arguments: dict | None) -> list[TextContent]:
    arguments = arguments or {}

    if name == "git_status":
        stdout, stderr, rc = run_git(["status", "--porcelain", "-b"])
        status_lines = stdout.splitlines()
        branch_line = status_lines[0] if status_lines and status_lines[0].startswith("##") else ""
        lines = [line for line in status_lines if line and not line.startswith("##")]

        return [TextContent(
            type="text",
            text=json.dumps({
                "is_clean": len(lines) == 0,
                "branch": branch_line.replace("## ", "").split("...")[0] if branch_line else "unknown",
                "changed_files": len(lines),
                "files": lines[:20],  # Limit output
                "raw": stdout[:1000],
                "error": stderr if rc != 0 else None,
            }, indent=2)
        )]

    elif name == "git_diff":
        args = ["diff", "--stat"]
        if arguments.get("staged"):
            args = ["diff", "--staged", "--stat"]
        stdout, stderr, rc = run_git(args)
        return [TextContent(
            type="text",
            text=json.dumps({
                "has_changes": len(stdout.strip()) > 0,
                "summary": stdout,
                "error": stderr if rc != 0 else None,
            }, indent=2)
        )]

    elif name == "git_log":
        count = arguments.get("count", 10)
        stdout, stderr, rc = run_git(["log", "--oneline", f"-{count}"])
        return [TextContent(
            type="text",
            text=json.dumps({
                "commits": stdout.strip().splitlines() if stdout.strip() else [],
                "error": stderr if rc != 0 else None,
            }, indent=2)
        )]

    elif name == "git_branch":
        stdout, stderr, rc = run_git(["branch", "-vv"])
        current = ""
        branches = []
        for line in stdout.splitlines():
            if line.startswith("*"):
                current = line[2:].split()[0]
            if line.strip():
                branches.append(line.strip())

        return [TextContent(
            type="text",
            text=json.dumps({
                "current": current,
                "branches": branches[:10],
                "error": stderr if rc != 0 else None,
            }, indent=2)
        )]

    elif name == "check_safe_to_edit":
        stdout, stderr, rc = run_git(["status", "--porcelain"])
        lines = [l for l in stdout.splitlines() if l.strip()]
        is_safe = len(lines) == 0

        return [TextContent(
            type="text",
            text=json.dumps({
                "safe_to_edit": is_safe,
                "message": "Working tree is clean" if is_safe else f"{len(lines)} uncommitted changes detected",
                "recommendation": "Commit or stash changes before running auto-fix" if not is_safe else None,
                "error": stderr if rc != 0 else None,
            }, indent=2)
        )]

    else:
        return [TextContent(type="text", text=json.dumps({"error": f"Unknown tool: {name}"}))]


async def main():
    async with stdio_server() as streams:
        await app.run(
            streams[0],
            streams[1],
            app.create_initialization_options(),
        )


if __name__ == "__main__":
    asyncio.run(main())
