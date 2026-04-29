# 🤖 AI DevTools Toolkit

Autonomous debugging agents, skills, and commands for **Gemini CLI** and **Codex CLI**.

Turn your terminal into a self-healing coding teammate with one command.

---

## 🚀 Quick Start

### Prerequisites
- [Gemini CLI](https://github.com/google-gemini/gemini-cli) installed (`gemini --version`)
- OR [Codex CLI](https://github.com/openai/codex) installed (`codex --version`)
- Git (for safety guardrails)

### Install

```bash
# Install into the current project
curl -fsSL https://raw.githubusercontent.com/Rajvardhan7030/ai-devlopment-toolkit-/main/install.sh | bash

# Or clone locally and run the installer from your project root
git clone https://github.com/Rajvardhan7030/ai-devlopment-toolkit-.git .gemini
bash .gemini/install.sh
```

---

## 📋 Available Commands

| Command | CLI | Description |
|---------|-----|-------------|
| `/debug-fix` | Gemini | Autonomous debug → fix → verify loop |
| `/review` | Gemini | Structured code review with severity ratings |
| `/refactor` | Gemini | Safe refactoring with test verification |
| `@debugger` | Gemini | Delegate to debugger subagent |
| `@reviewer` | Gemini | Delegate to reviewer subagent |
| `@fixer` | Gemini | Delegate to fixer subagent |
| `@verifier` | Gemini | Delegate to verifier subagent |
| `codex --agent debugger` | Codex | Autonomous debugger agent |

---

## 🎒 Skills

| Skill | Description | Best For |
|-------|-------------|----------|
| `debugger` | Root cause analysis + minimal patching | Bug fixes, crashes |
| `security-audit` | Vulnerability scanning + remediation | Dependency checks, secrets |
| `performance` | Bottleneck detection + optimization | Slow queries, memory leaks |

---

## 🏗️ Architecture

```
┌─────────────────┐     ┌──────────────────┐
│   User Input    │────▶│  /debug-fix Cmd  │
└─────────────────┘     └────────┬─────────┘
                                 │
                    ┌────────────┼────────────┐
                    ▼            ▼            ▼
              ┌─────────┐ ┌──────────┐ ┌──────────┐
              │Reviewer │ │  Fixer   │ │ Verifier │
              │Subagent │ │ Subagent │ │ Subagent │
              └────┬────┘ └────┬─────┘ └────┬─────┘
                   │           │            │
                   └───────────┴────────────┘
                               │
                        ┌──────▼──────┐
                        │  MCP Tools  │
                        │ Test Runner │
                        │ Git Helper  │
                        └─────────────┘
```

---

## ⚙️ Configuration

### Project-Level Context

Copy the templates into your project root:

```bash
cp .gemini/GEMINI.md ./GEMINI.md
cp .gemini/AGENTS.md ./AGENTS.md
```

Edit them with your team's coding standards, test commands, and architecture rules.

---

## 🛡️ Safety First

Every agent follows these guardrails:

- ✅ Runs `git status` before any edit
- ✅ Shows diff before applying changes
- ✅ Limits to 3 auto-retry iterations
- ✅ Stops on dirty working trees
- ✅ Never deletes files without confirmation

---

## 🤝 Contributing

1. Fork the repo
2. Create a new skill in `.gemini/skills/YOUR_SKILL/`
3. Add a test case in `tests/`
4. Open a PR

See [docs/writing-skills.md](docs/writing-skills.md) for the skill authoring guide.

---

## 📄 License

MIT License — see [LICENSE](LICENSE).

---

## 🙏 Acknowledgments

Built with ❤️ for the agentic coding community. Inspired by Gemini CLI's ReAct architecture and Codex CLI's extensibility.
