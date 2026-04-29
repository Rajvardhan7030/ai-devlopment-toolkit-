# Codex CLI Setup Guide

## Installation

```bash
# Install Codex CLI (requires Node.js 18+)
npm install -g @openai/codex

# Verify
codex --version
```

## Installing This Toolkit

```bash
# Copy config to Codex config directory
cp .codex/config.toml ~/.codex/config.toml
```

Or use the installer:
```bash
./install.sh
```

## Using Agents

```bash
# Run the debugger agent
codex --agent debugger "fix the auth bug in login.py"

# Run the reviewer agent
codex --agent reviewer "check the API endpoints"

# Run the manager-led team
codex --agent manager "implement feature X using planning, coding, and QA review"

# Run workers directly when needed
codex --agent planner "plan the implementation for feature X"
codex --agent coder "implement feature X"
codex --agent qa_reviewer "verify and review feature X"
```

## Example Team Flow

```bash
codex --agent manager "add bulk user import with validation, tests, and QA review"
```

Expected execution:
- manager calls `team-orchestrator.create_planning_packet`
- planner identifies files, risks, and verification plan
- coder implements the scoped change
- qa_reviewer runs verification and reports residual risk
- manager calls `team-orchestrator.assemble_final_report`

## Configuring Agents

Edit `~/.codex/config.toml`:

```toml
[agents.debugger]
name = "My Custom Debugger"
system_prompt = """
Your custom instructions here...
"""

[agents.debugger.tools]
allow_edit = true
allow_shell = true
allowed_commands = ["npm test", "pytest", "git status"]
```

## Adding MCP Servers

Expose the orchestration helper and existing runtime helpers from your project root:

```bash
codex mcp add team-orchestrator ./mcp-servers/team-orchestrator
codex mcp add test-runner ./mcp-servers/test-runner
codex mcp add git-helper ./mcp-servers/git-helper
```

## Local Team Flow CLI

Generate and persist the manager workflow artifacts locally:

```bash
node mcp-servers/team-orchestrator/team-flow.js init --task "add bulk user import" --output .team-flow
node mcp-servers/team-orchestrator/team-flow.js worker --worker planner --status done --summary "planned implementation" --output .team-flow
node mcp-servers/team-orchestrator/team-flow.js worker --worker coder --status done --summary "implemented feature" --changed_files api/users.py,services/import_users.py --output .team-flow
node mcp-servers/team-orchestrator/team-flow.js worker --worker qa_reviewer --status done --summary "verified targeted tests" --verification "pytest tests/test_import_users.py" --output .team-flow
node mcp-servers/team-orchestrator/team-flow.js finalize --output .team-flow
```

## Project Context

Create an `AGENTS.md` in your project root. Codex CLI will read this for context.

```markdown
# Project Context

## Stack
- TypeScript, Node.js, Express
- Testing: Jest
- Linting: ESLint

## Guidelines
- Always validate request bodies with Zod
- Use dependency injection for testability
```

## Safety Settings

Codex CLI has approval modes:

```bash
# Full auto (dangerous — use with caution)
codex --agent debugger --approval-mode auto-fix "fix bug"

# Suggest only (safest)
codex --agent debugger --approval-mode suggest "fix bug"

# Confirm each change (recommended)
codex --agent debugger --approval-mode auto-edit "fix bug"
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Agent not found | Check `~/.codex/config.toml` syntax |
| Commands blocked | Add commands to `allowed_commands` list |
| Context missing | Ensure `AGENTS.md` is in project root |
