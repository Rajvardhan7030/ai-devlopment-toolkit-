# AI DevTools Toolkit

AI DevTools Toolkit turns Gemini CLI or Codex CLI into a structured software delivery team. It provides agent roles, command prompts, MCP helper servers, and local workflow generators so an AI assistant can research, plan, code, review, test, and report work instead of responding with one unstructured answer.

The toolkit is local-first. It is designed for developers, small teams, founders, and non-technical users who want safer AI-assisted development with visible planning, scoped implementation, verification evidence, and final delivery reports.

## What It Solves

Normal AI coding sessions often mix planning, implementation, review, and testing in one conversation. That makes it hard to know what was changed, what was verified, and what risks remain.

This toolkit separates responsibilities:

```text
User request
  -> Manager
  -> Research / planning artifacts
  -> Planner
  -> Coder
  -> QA reviewer
  -> Tests and final report
```

The result is a repeatable workflow where each stage has a clear job and a written output.

## Key Features

- Gemini CLI commands for review, debugging, refactoring, team tasks, and feature delivery.
- Codex CLI agent configuration for manager, planner, coder, reviewer, debugger, and QA reviewer roles.
- MCP servers for test execution, git inspection, and team orchestration.
- Local `team-flow` CLI for generating planning packets, worker contracts, worker result records, and final reports.
- Full lifecycle archive generator for non-technical users and manager agents.
- Starter context files: `GEMINI.md` and `AGENTS.md`.
- Node built-in tests for the team orchestration lifecycle generator.

## Repository Structure

```text
.
|-- .codex/                         # Codex CLI configuration template
|-- .gemini/
|   |-- agent/                      # Gemini agent role prompts
|   `-- commands/                   # Gemini slash command definitions
|-- docs/
|   |-- codex-setup.md              # Codex setup guide
|   |-- gemini-setup.md             # Gemini setup guide
|   `-- writing-skills.md           # Skill authoring guide
|-- mcp-servers/
|   |-- git-helper/                 # Python MCP server for safe git inspection
|   |-- team-orchestrator/          # Node MCP server and local workflow CLI
|   `-- test-runner/                # Node MCP server for structured test runs
|-- tests/                          # Node test files
|-- AGENTS.md                       # Codex project context template
|-- GEMINI.md                       # Gemini project context template
|-- PROJECT-DELIVERY-REPORT.md      # Latest generated delivery report
|-- install.sh                      # Installer for Gemini/Codex assets
`-- README.md
```

Local workflow runs may also create `.ai-manager`, `.ai-research`, `.ai-plan`, `.ai-coding`, `.ai-review`, and `.ai-testing`. These are audit artifacts for the current run and normally should not be committed unless you intentionally want to preserve them.

## Requirements

- `git`
- Node.js 18 or newer for the Node MCP servers and `team-flow` CLI
- Gemini CLI or Codex CLI
- Python 3 for the `git-helper` MCP server

Check your environment:

```bash
git --version
node --version
python3 --version
gemini --version
codex --version
```

You only need one of `gemini` or `codex` to use the toolkit. You can install both.

## Installation

### One-Command Install

Run this from the project where you want to use the toolkit:

```bash
curl -fsSL https://raw.githubusercontent.com/Rajvardhan7030/ai-devlopment-toolkit-/main/install.sh | bash
```

The installer:

- detects Gemini CLI and Codex CLI
- asks whether to install project-level or global assets
- installs Gemini commands and agents when Gemini is available
- installs Codex config when Codex is available
- copies `GEMINI.md` and `AGENTS.md` into the current project for project-level installs
- backs up an existing `~/.codex/config.toml` before replacing it

### Manual Install

```bash
git clone https://github.com/Rajvardhan7030/ai-devlopment-toolkit-.git .gemini
bash .gemini/install.sh
```

### Project Context Files

After installation, edit:

- `GEMINI.md` for Gemini CLI project rules
- `AGENTS.md` for Codex CLI project rules

Add your stack, package manager, test command, lint command, deployment rules, and security requirements.

## Quick Start

### Gemini

```bash
gemini /review "review this project"
gemini /debug-fix "fix the login bug"
gemini /feature-delivery "add bulk user import with validation, tests, and review"
```

### Codex

```bash
codex --agent reviewer "review this project"
codex --agent debugger "fix the login bug"
codex --agent manager "add bulk user import with validation, tests, and review"
```

### Full Lifecycle Archive

Use this when you want the toolkit to create the complete research, planning, coding, review, testing, and delivery-report structure for an idea:

```bash
node mcp-servers/team-orchestrator/team-flow.js lifecycle \
  --idea "automate the manual research, planning, development, review, and testing cycle" \
  --user "non-technical founder" \
  --constraints "budget-sensitive,local-first" \
  --done "production-ready workflow"
```

This writes:

- `.ai-manager/project-charter.md`
- `.ai-manager/stage-log.json`
- `.ai-research/brief.md`
- `.ai-research/research-report.md`
- `.ai-plan/architecture.md`
- `.ai-plan/execution-plan.md`
- `.ai-plan/worker-contracts.json`
- `.ai-coding/current-task.md`
- `.ai-review/review-brief.md`
- `.ai-testing/test-manifest.md`
- `PROJECT-DELIVERY-REPORT.md`

To generate the archive somewhere else:

```bash
node mcp-servers/team-orchestrator/team-flow.js lifecycle \
  --idea "build a customer support dashboard" \
  --output /tmp/support-dashboard-workflow
```

## Gemini Commands

| Command | Purpose |
| --- | --- |
| `/debug-fix` | Investigate, fix, and verify a bug |
| `/review` | Review code and report issues |
| `/refactor` | Improve code without changing behavior |
| `/team-task` | Run a manager-led workflow |
| `/feature-delivery` | Run a stricter feature workflow with worker contracts |

## Gemini Agents

| Agent | Role |
| --- | --- |
| `@manager` | Coordinates the full workflow |
| `@planner` | Creates implementation plans |
| `@coder` | Makes scoped code changes |
| `@qa-reviewer` | Tests and reviews the result |
| `@debugger` | Focuses on bug investigation and fixes |
| `@reviewer` | Reviews code without implementing |
| `@fixer` | Applies focused fixes |
| `@verifier` | Runs verification and reports evidence |
| `@architect` | Helps with architecture and design analysis |

## Codex Agents

| Agent | Role |
| --- | --- |
| `manager` | Coordinates the multi-agent team |
| `planner` | Creates implementation plans |
| `coder` | Implements scoped changes |
| `qa_reviewer` | Tests and reviews implementation quality |
| `debugger` | Fixes bugs with focused diagnosis |
| `reviewer` | Reviews code for correctness, security, and regression risk |

## MCP Servers

MCP servers expose helper tools to compatible AI clients.

| Server | Location | Runtime | Purpose |
| --- | --- | --- | --- |
| `team-orchestrator` | `mcp-servers/team-orchestrator` | Node.js | Builds planning packets, worker contracts, worker result records, lifecycle artifacts, and final reports |
| `test-runner` | `mcp-servers/test-runner` | Node.js | Detects common project types and runs tests with structured output |
| `git-helper` | `mcp-servers/git-helper` | Python | Reports git status, diffs, recent logs, branch info, and safe-to-edit checks |

### Add MCP Servers To Gemini

Run these from the repository root so the relative entrypoint paths resolve correctly:

```bash
gemini mcp add team-orchestrator node ./mcp-servers/team-orchestrator/index.js
gemini mcp add test-runner node ./mcp-servers/test-runner/index.js
gemini mcp add git-helper python3 ./mcp-servers/git-helper/main.py
```

### Add MCP Servers To Codex

Run these from the repository root so the relative entrypoint paths resolve correctly:

```bash
codex mcp add team-orchestrator node ./mcp-servers/team-orchestrator/index.js
codex mcp add test-runner node ./mcp-servers/test-runner/index.js
codex mcp add git-helper python3 ./mcp-servers/git-helper/main.py
```

## Team-Orchestrator CLI

The local CLI lives at:

```bash
node mcp-servers/team-orchestrator/team-flow.js
```

### `init`

Creates a planning packet and worker contracts.

```bash
node mcp-servers/team-orchestrator/team-flow.js init \
  --task "add bulk user import" \
  --success "CSV upload,validation errors,tests pass" \
  --constraints "no database schema rewrite" \
  --files "api/users.py,services/import_users.py" \
  --risks "partial writes,duplicate emails" \
  --verification_target "pytest tests/test_import_users.py" \
  --output .team-flow
```

Creates:

- `.team-flow/planning-packet.json`
- `.team-flow/planner-contract.json`
- `.team-flow/coder-contract.json`
- `.team-flow/qa-reviewer-contract.json`

### `worker`

Records a worker result in the same output directory.

```bash
node mcp-servers/team-orchestrator/team-flow.js worker \
  --worker coder \
  --status done \
  --summary "implemented CSV import validation" \
  --changed_files "api/users.py,services/import_users.py,tests/test_import_users.py" \
  --verification "pytest tests/test_import_users.py" \
  --output .team-flow
```

Supported fields:

- `--worker`
- `--status`
- `--summary`
- `--changed_files`
- `--verification`
- `--findings`
- `--blockers`
- `--residual_risk`
- `--output`

### `finalize`

Combines planning and worker outputs into a final JSON report.

```bash
node mcp-servers/team-orchestrator/team-flow.js finalize --output .team-flow
```

Creates:

- `.team-flow/final-report.json`

### `lifecycle`

Creates a complete five-stage workflow archive from a plain-language idea.

```bash
node mcp-servers/team-orchestrator/team-flow.js lifecycle \
  --idea "create an AI workflow that researches, plans, codes, reviews, and tests automatically" \
  --user "non-technical operator" \
  --constraints "local-first,no paid services required" \
  --done "production-ready workflow archive" \
  --domain "AI-assisted software development tooling" \
  --output .
```

Required:

- `--idea`

Optional:

- `--user`
- `--constraints`
- `--done`
- `--domain`
- `--output`

If `--idea` is missing, the command exits non-zero with:

```text
Missing required --idea
```

## Test Runner MCP Behavior

`test-runner` detects common project files and chooses a test command:

| Project marker | Command |
| --- | --- |
| `package.json` with `scripts.test` | `npm test` |
| `package.json` without `scripts.test` | `npx jest` |
| `pyproject.toml` or `pytest.ini` | `pytest -xvs` |
| `Cargo.toml` | `cargo test` |
| `go.mod` | `go test ./...` |
| `pom.xml` | `mvn test` |

It returns structured JSON with success status, command, summary counts when detectable, failures, and the last part of test output.

## Git Helper MCP Behavior

`git-helper` exposes:

- `git_status`
- `git_diff`
- `git_log`
- `git_branch`
- `check_safe_to_edit`

It is intentionally read-oriented. It helps agents inspect state before editing and avoid overwriting uncommitted work.

## Running Tests For This Repository

The current test suite uses Node's built-in test runner.

```bash
node --test tests/*.test.js
```

Coverage:

```bash
node --test --experimental-test-coverage tests/*.test.js
```

You can also run the package-local script from `mcp-servers/team-orchestrator`:

```bash
cd mcp-servers/team-orchestrator
npm test
```

No external test dependency is required for the current `team-orchestrator` tests.

## Development Workflow

Recommended steps for changes:

1. Run `git status --short`.
2. Inspect the relevant files before editing.
3. Keep changes scoped to one workflow or module.
4. Update tests when behavior changes.
5. Run targeted tests.
6. Run broader tests if the change affects shared helpers.
7. Update README or setup docs when commands, outputs, or behavior change.

For this repository, the main verification command is:

```bash
node --test tests/*.test.js
```

## Safety Model

This toolkit is designed to make AI-assisted development safer than free-form prompting.

Guardrails:

- role separation between manager, planner, coder, reviewer, and tester
- scoped worker contracts
- explicit verification reporting
- git status checks before edits
- review-first mode for review requests
- no invented test results
- no silent failure handling
- audit artifacts for long workflows

Limitations:

- It does not replace human judgment.
- It does not guarantee production safety by itself.
- It does not automatically deploy code.
- It depends on the underlying AI client approval settings.
- The lifecycle generator creates structured artifacts; a manager or user still needs to complete real research, implementation, review, and testing for a specific product.

## For Non-Technical Users

Start with the lifecycle command:

```bash
node mcp-servers/team-orchestrator/team-flow.js lifecycle --idea "describe your project idea"
```

Then open:

- `.ai-manager/project-charter.md` to confirm the problem and definition of done
- `.ai-research/research-report.md` to fill or review sources and risks
- `.ai-plan/execution-plan.md` to see the implementation phases
- `.ai-review/review-brief.md` to understand what review must check
- `.ai-testing/test-manifest.md` to see how the result should be verified
- `PROJECT-DELIVERY-REPORT.md` for the final summary

For active AI work, use:

```bash
gemini /feature-delivery "your request"
```

or:

```bash
codex --agent manager "your request"
```

## Troubleshooting

| Problem | Likely Cause | Fix |
| --- | --- | --- |
| `gemini` command not found | Gemini CLI is not installed | Install Gemini CLI, then rerun the installer |
| `codex` command not found | Codex CLI is not installed | Install Codex CLI, then rerun the installer |
| Agent not found | Config was not installed or loaded | Check `.gemini/agent` or `~/.codex/config.toml` |
| MCP server not available | MCP server was not added to the client | Run the relevant `gemini mcp add` or `codex mcp add` command |
| Tests not detected | Project does not use a recognized test marker | Add the project test command to context files or run tests manually |
| `Missing required --idea` | `lifecycle` was run without an idea | Add `--idea "your project idea"` |
| Dirty working tree warning | Existing uncommitted changes | Commit, stash, or explicitly tell the agent how to handle them |

## FAQ

### Is this a hosted app?

No. It is a local toolkit for Gemini CLI, Codex CLI, and MCP-compatible workflows.

### Does it write code automatically?

It can, depending on the AI client, agent, and approval mode. The toolkit's job is to structure the work and encourage scoped, reviewed, verified changes.

### Can non-technical users use it?

Yes, but basic terminal comfort helps. The lifecycle generator is the easiest entry point because it creates readable workflow files from a plain idea.

### Can I use it with only Gemini?

Yes.

### Can I use it with only Codex?

Yes.

### Should I commit `.ai-*` folders?

Usually no. Treat them as local audit artifacts unless you intentionally want to preserve a workflow run in git.

### What is the difference between `.team-flow` and `.ai-*`?

`.team-flow` is the compact JSON workflow output from the `init`, `worker`, and `finalize` commands. `.ai-*` is the full five-stage lifecycle archive from the `lifecycle` command or manager pipeline.

## Contributing

Good contributions include:

- clearer prompts and agent roles
- safer workflow gates
- better beginner documentation
- new MCP helper tools
- tests for orchestration behavior
- installer fixes

Before opening a pull request:

1. Keep the change focused.
2. Preserve existing command names unless there is a strong reason to change them.
3. Update docs for behavior changes.
4. Add or update tests for code changes.
5. Run `node --test tests/*.test.js` when touching `team-orchestrator`.

For skill authoring, read [docs/writing-skills.md](docs/writing-skills.md).

## License

MIT License.
