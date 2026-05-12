# AI DevTools Toolkit

AI DevTools Toolkit helps you turn an AI coding assistant into a small software team.

Instead of asking one agent to do everything, you can use:
- a `manager` to understand the request
- a `planner` to break the work into steps
- a `coder` to make the change
- a `qa reviewer` to test and review the result

It works with **Gemini CLI** and **Codex CLI**.

---

## 5-Minute Quick Start

If you want the fastest path:

1. Install `Gemini CLI` or `Codex CLI`.
2. Open your project folder in the terminal.
3. Run:

```bash
curl -fsSL https://raw.githubusercontent.com/Rajvardhan7030/ai-devlopment-toolkit-/main/install.sh | bash
```

4. Try one of these:

```bash
gemini /review "review this project"
gemini /debug-fix "fix the login bug"
gemini /feature-delivery "build this feature using planning, coding, testing, and review"
```

Or with Codex:

```bash
codex --agent reviewer "review this project"
codex --agent debugger "fix the login bug"
codex --agent manager "build this feature using planning, coding, testing, and review"
```

---

## Summary

This project gives you ready-made prompts, agent roles, and helper tools so you can say things like:
- "review my code"
- "fix this bug"
- "deliver this feature using planning, coding, and testing"

The toolkit is useful if you want:
- clearer AI workflows
- safer code changes
- better testing and review habits
- a manager-style multi-agent setup

If you are not technical, you can think of it like this:
- the `manager` receives your request
- the `planner` decides the steps
- the `coder` does the implementation
- the `qa reviewer` checks whether it works

---

## Who This Is For

This project is useful for:
- developers who want more structured AI help
- teams who want safer AI-assisted coding
- founders or product people who want the AI to behave more like a small engineering team
- non-technical users who want a manager-style workflow instead of raw coding prompts

This project may not be ideal if:
- you want a fully automatic no-review production deployment system
- you do not want to use a terminal
- you are looking for a hosted web app instead of a local toolkit

---

## What This Project Includes

- Gemini commands such as `/debug-fix`, `/review`, `/team-task`, and `/feature-delivery`
- Codex agent configurations such as `manager`, `debugger`, `planner`, `coder`, and `qa_reviewer`
- MCP helper servers for:
  - test running
  - git inspection
  - team orchestration
- a local CLI that can save the team workflow as JSON files

---

## Installation

### Before You Start

You need:
- [Gemini CLI](https://github.com/google-gemini/gemini-cli) or [Codex CLI](https://github.com/openai/codex)
- `git`
- `node` for the MCP servers and local CLI wrapper

Check what is installed:

```bash
gemini --version
codex --version
git --version
node --version
```

### Quick Install

From inside your project folder:

```bash
curl -fsSL https://raw.githubusercontent.com/Rajvardhan7030/ai-devlopment-toolkit-/main/install.sh | bash
```

### Manual Install

```bash
git clone https://github.com/Rajvardhan7030/ai-devlopment-toolkit-.git .gemini
bash .gemini/install.sh
```

### What Installation Does

The installer:
- copies Gemini command files
- copies Gemini agent files
- copies Codex config
- copies starter context files such as `GEMINI.md` and `AGENTS.md`

---

## What Happens After Installation

After installation, you can give plain requests such as:
- "review my auth code"
- "fix this bug"
- "implement this feature using manager, planner, coder, and QA"

The toolkit then gives the AI a more structured way to respond.

Instead of one generic answer, the workflow can:
- inspect the code
- create a plan
- apply a scoped change
- run tests
- report what was verified

---

## How To Use

### 1. Simple Bug Fix

If you want the AI to investigate and try to fix a bug:

Gemini:
```bash
gemini /debug-fix "fix the login bug"
```

Codex:
```bash
codex --agent debugger "fix the login bug"
```

### 2. Code Review

If you want the AI to inspect code and report problems:

Gemini:
```bash
gemini /review "review the auth module"
```

Codex:
```bash
codex --agent reviewer "review the auth module"
```

### 3. Multi-Agent Team Workflow

If you want one manager and three workers:

Gemini:
```bash
gemini /feature-delivery "add bulk user import with validation, tests, and review"
```

Codex:
```bash
codex --agent manager "add bulk user import with validation, tests, and review"
```

What happens:
1. The manager understands your request.
2. The planner turns it into a clear plan.
3. The coder implements the change.
4. The QA reviewer checks tests, regressions, and risk.
5. The manager returns the final result.

### 4. Generate a Full Lifecycle Archive

If you are non-technical and want the toolkit to create the research, planning, coding, review, testing, and delivery-report structure for an idea:

```bash
node mcp-servers/team-orchestrator/team-flow.js lifecycle \
  --idea "automate the manual research, planning, development, review, and testing cycle" \
  --user "non-technical founder" \
  --constraints "budget-sensitive,local-first" \
  --done "production-ready workflow"
```

This writes `.ai-manager`, `.ai-research`, `.ai-plan`, `.ai-coding`, `.ai-review`, `.ai-testing`, and `PROJECT-DELIVERY-REPORT.md` in the current project.

---

## Example Request

Here is a simple real-world style request:

```text
I want to add bulk user import with validation, tests, and review.
```

With Gemini:

```bash
gemini /feature-delivery "add bulk user import with validation, tests, and review"
```

With Codex:

```bash
codex --agent manager "add bulk user import with validation, tests, and review"
```

Expected result:
- manager understands the feature
- planner defines steps and risks
- coder makes the change
- QA reviewer checks it
- manager returns a final summary

---

## Main Commands And Agents

### Gemini Commands

| Command | Purpose |
|---------|---------|
| `/debug-fix` | Investigate, fix, and verify a bug |
| `/review` | Review code and report issues |
| `/refactor` | Improve code without changing behavior |
| `/team-task` | Run a manager-led workflow |
| `/feature-delivery` | Run a stricter feature workflow with worker contracts |

### Gemini Agents

| Agent | Role |
|-------|------|
| `@manager` | Coordinates the full workflow |
| `@planner` | Creates the implementation plan |
| `@coder` | Makes the code change |
| `@qa-reviewer` | Tests and reviews the result |
| `@debugger` | Focuses on bug fixing |
| `@reviewer` | Focuses on review only |
| `@fixer` | Focuses on making a scoped fix |
| `@verifier` | Focuses on verification |

### Codex Agents

| Agent | Role |
|-------|------|
| `manager` | Coordinates the multi-agent team |
| `planner` | Creates the implementation plan |
| `coder` | Makes the code change |
| `qa_reviewer` | Tests and reviews the result |
| `debugger` | Fixes bugs |
| `reviewer` | Reviews code |

---

## How The Team Workflow Works

The team system uses a helper called `team-orchestrator`.

It creates:
- a manager brief
- worker contracts
- a final delivery report

The flow looks like this:

```text
Client Request
  -> Manager
  -> Planning Packet
  -> Planner / Coder / QA Reviewer
  -> Final Report
```

This makes the AI workflow easier to follow and reduces vague or mixed responsibilities.

---

## MCP Servers

MCP servers are helper tools the agents can use.

| Server | What It Does |
|--------|---------------|
| `test-runner` | Runs tests and returns structured output |
| `git-helper` | Checks git status, diff, branches, and logs |
| `team-orchestrator` | Builds planning packets, worker contracts, and final reports |

---

## Local Team Flow CLI

If you want to save the manager workflow as files on your machine, use the local CLI wrapper.

Example:

```bash
node mcp-servers/team-orchestrator/team-flow.js init --task "add bulk user import" --output .team-flow
node mcp-servers/team-orchestrator/team-flow.js worker --worker planner --status done --summary "planned implementation" --output .team-flow
node mcp-servers/team-orchestrator/team-flow.js worker --worker coder --status done --summary "implemented feature" --changed_files api/users.py,services/import_users.py --output .team-flow
node mcp-servers/team-orchestrator/team-flow.js worker --worker qa_reviewer --status done --summary "verified targeted tests" --verification "pytest tests/test_import_users.py" --output .team-flow
node mcp-servers/team-orchestrator/team-flow.js finalize --output .team-flow
```

This creates files such as:
- `planning-packet.json`
- `planner-contract.json`
- `coder-contract.json`
- `qa-reviewer-contract.json`
- `planner-result.json`
- `coder-result.json`
- `qa_reviewer-result.json`
- `final-report.json`

---

## What You Will See As Output

Depending on the workflow, the output may include:
- a review report
- a bug diagnosis
- a plan
- changed files
- verification results
- residual risks
- a final delivery summary

This is helpful because you can see not only what changed, but also what was checked.

---

## Recommended Setup

Copy the starter context files into your project:

```bash
cp .gemini/GEMINI.md ./GEMINI.md
cp .gemini/AGENTS.md ./AGENTS.md
```

Then edit them with:
- your project rules
- your test commands
- your stack details
- coding standards for your team

---

## Rules And Safety

This toolkit is designed to be safer than free-form AI editing.

Core rules:
- agents should inspect the code before editing
- agents should keep changes small and focused
- agents should not invent test results
- agents should report what was verified
- agents should avoid touching unrelated files
- agents should not overwrite your existing work in a dirty git tree
- agents should stop and report when the request is unclear

Practical safety guardrails:
- runs `git status` before editing
- favors targeted tests before broad test suites
- keeps manager and worker roles separate
- requires verification reporting

You should still review AI-generated changes before merging them.

---

## FAQ

### Do I need to know programming to use this?

Not fully, but basic terminal comfort helps. If you are non-technical, start with:
- `/review`
- `/debug-fix`
- `/feature-delivery`

### Does this automatically change my code?

Some workflows can propose or apply changes depending on the CLI and approval settings. You should still review the output.

### Is this safe for production?

It is safer than unstructured prompting, but it is still an AI-assisted toolkit. Human review is still recommended.

### What is the difference between `team-task` and `feature-delivery`?

- `/team-task` is a general manager-led workflow
- `/feature-delivery` is a stricter version focused on feature implementation with worker contracts

### What is `team-orchestrator`?

It is a helper that creates:
- a manager brief
- worker contracts
- final delivery reports

### Can I use this without Gemini?

Yes, if you use Codex CLI.

### Can I use this without Codex?

Yes, if you use Gemini CLI.

---

## Contribution Guide

Contributions are welcome.

### Good Contributions

- improving prompts
- adding safer workflows
- improving docs for beginners
- adding useful MCP tools
- fixing bugs in installer or orchestration logic

### Before You Contribute

- keep changes focused
- do not break existing command names unless necessary
- update docs when behavior changes
- keep prompts clear and production-oriented
- prefer small pull requests over large rewrites

### Basic Contribution Steps

1. Fork the repository.
2. Create a branch for your change.
3. Make your update.
4. Test the part you changed.
5. Update the README or setup docs if needed.
6. Open a pull request with a clear summary.

If you are adding a new skill, see [docs/writing-skills.md](docs/writing-skills.md).

---

## For Non-Technical Users

If you are not a developer, the easiest way to think about this project is:
- you type a request
- the `manager` understands it
- the workers split the work
- the system gives back a result and what was checked

Start with:
- `/review` if you want an explanation of problems
- `/debug-fix` if you want help fixing a bug
- `/feature-delivery` if you want the AI to behave like a small team

---

## License

MIT License.
