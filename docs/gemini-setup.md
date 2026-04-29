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
# Delegate to reviewer
gemini @reviewer "check login endpoint"

# Chain agents manually
gemini @reviewer "find bugs" > /tmp/bugs.md
gemini @fixer "fix these: $(cat /tmp/bugs.md)"
gemini @verifier "run tests"
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
gemini mcp add test-runner ./mcp-servers/test-runner

# Add the git helper MCP
gemini mcp add git-helper ./mcp-servers/git-helper
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Command not found | Run from project root where `.gemini/` exists |
| Skill not loading | Check `SKILL.md` syntax and file path |
| Agent not responding | Verify YAML frontmatter format in `.md` files |
| Tests not detected | Ensure `verify.sh` has execute permissions: `chmod +x` |
