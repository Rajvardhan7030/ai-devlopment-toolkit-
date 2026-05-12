 Gemini CLI Setup Guide

## Installation

```bash
# Install Gemini CLI (requires Node.js 18+)
npm install -g @google/gemini-cli

# Verify
gemini --version
```

## Installing This Toolkit

### Option 1: Per-Project
```bash
cd your-project/
git clone https://github.com/Rajvardhan7030/ai-devlopment-toolkit-.git .gemini
bash .gemini/install.sh
```

### Option 2: Global
```bash
curl -fsSL https://raw.githubusercontent.com/Rajvardhan7030/ai-devlopment-toolkit-/main/install.sh | bash
```

### Option 3: Automated
```bash
curl -fsSL https://raw.githubusercontent.com/Rajvardhan7030/ai-devlopment-toolkit-/main/install.sh | bash
```

## Using Commands

```bash
# Autonomous debug loop
gemini /debug-fix "fix the memory leak in cache.go"

# Manager-led team execution
gemini /team-task "build a multi-agent workflow for planning, coding, and QA"

# Strict feature delivery workflow
gemini /feature-delivery "add bulk user import with validation and QA review"

# Code review
gemini /review "check auth module"

# Safe refactoring
gemini /refactor "extract validation logic from controllers"
```

## Using Skills

```bash
# Install a skill
gemini skills install ./.gemini/skills/debugger

# Use a skill
gemini @debugger "fix race condition"

# List installed skills
gemini skills list
```

## Using Subagents

```bash
# Manager orchestrates the team
gemini @manager "implement feature X using planning, coding, and QA review"

# Direct worker access when needed
gemini @planner "plan the implementation for feature X"
gemini @coder "implement the approved plan for feature X"
gemini @qa-reviewer "verify and review the implementation of feature X"

# Delegate to reviewer
gemini @reviewer "check login endpoint"

# Chain agents manually
gemini @reviewer "find bugs" > /tmp/bugs.md
gemini @fixer "fix these: $(cat /tmp/bugs.md)"
gemini @verifier "run tests"
```

## Example Team Flow

Client request:

```text
I want to add bulk user import with validation, tests, and review.
```

Manager entry:

```bash
gemini /feature-delivery "add bulk user import with validation, tests, and review"
```

Expected flow:

```text
Manager
- Calls team-orchestrator.create_planning_packet
- Objective: add bulk user import
- Success criteria: accepts CSV, validates rows, reports failures, includes tests
- Non-goals: UI redesign, background job rewrite

Planner
- Files: api/users.py, services/import_users.py, tests/test_import_users.py
- Risks: partial writes, bad CSV rows, duplicate emails
- Verification: targeted import tests, then full user-service suite

Coder
- Implements CSV parsing, validation, duplicate handling, and tests
- Reports exact files changed and why
- Manager records output with team-orchestrator.record_worker_result

QA Reviewer
- Runs targeted tests
- Reviews error paths and regression risk
- Reports pass/fail and residual risk

Manager
- Calls team-orchestrator.assemble_final_report
- Returns implementation summary, verification summary, and residual risk
```

## Project Context

Create a `GEMINI.md` in your project root:

```markdown
# Project Context

## Stack
- Python 3.11, FastAPI, PostgreSQL
- Testing: pytest
- Linting: ruff, mypy

## Debug Rules
- Check for missing `await` on async calls
- Verify SQLAlchemy session lifecycle
```

Gemini CLI will automatically read this file for context.

## Adding MCP Servers

```bash
# Add the test runner MCP
gemini mcp add test-runner node ./mcp-servers/test-runner/index.js

# Add the git helper MCP
gemini mcp add git-helper python3 ./mcp-servers/git-helper/main.py

# Add the team orchestrator MCP
gemini mcp add team-orchestrator node ./mcp-servers/team-orchestrator/index.js
```

## Local Team Flow CLI

Generate workflow artifacts locally:

```bash
node mcp-servers/team-orchestrator/team-flow.js init --task "add bulk user import" --output .team-flow
node mcp-servers/team-orchestrator/team-flow.js worker --worker planner --status done --summary "planned implementation" --output .team-flow
node mcp-servers/team-orchestrator/team-flow.js worker --worker coder --status done --summary "implemented feature" --changed_files api/users.py,services/import_users.py --output .team-flow
node mcp-servers/team-orchestrator/team-flow.js worker --worker qa_reviewer --status done --summary "verified targeted tests" --verification "pytest tests/test_import_users.py" --output .team-flow
node mcp-servers/team-orchestrator/team-flow.js finalize --output .team-flow
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Command not found | Run from project root where `.gemini/` exists |
| Skill not loading | Check `SKILL.md` syntax and file path |
| Agent not responding | Verify YAML frontmatter format in `.md` files |
| Tests not detected | Ensure `verify.sh` has execute permissions: `chmod +x` |
