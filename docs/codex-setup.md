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
```

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
