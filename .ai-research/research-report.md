# Research Report

## Domain Landscape
AI software development tools have moved from autocomplete toward agentic workflows that inspect repositories, modify files, run commands, and manage longer tasks. OpenAI describes Codex as spanning CLI, IDE, app, and cloud surfaces, with the Codex app positioned as a command center for running multiple agents in parallel and reviewing changes. GitHub Copilot code review provides automated pull request review across several developer environments and is explicitly framed as feedback from multiple code-quality angles.

For this project, the practical opportunity is not to compete with full hosted coding platforms. The strongest fit is a local orchestration layer that makes existing AI coding assistants safer and easier for non-technical users by enforcing staged artifacts, validation gates, and final reports.

## Verified Sources
1. OpenAI, "Introducing the Codex app", February 2, 2026, updated March 4, 2026: https://openai.com/index/introducing-the-codex-app/
   - Supports multi-agent orchestration, parallel agent work, isolated worktrees, diff review, and Codex availability across CLI/app/IDE surfaces.
2. OpenAI, "Unrolling the Codex agent loop", January 23, 2026: https://openai.com/index/unrolling-the-codex-agent-loop/
   - Describes the agent loop as the core interaction among user, model, and tools for meaningful software work.
3. GitHub Docs, "About GitHub Copilot code review", crawled May 2026: https://docs.github.com/copilot/code-review
   - Documents automated code review as a premium workflow and notes policy, quota, and validation concerns.
4. OpenAI, "Unlocking the Codex harness: how we built the App Server", February 4, 2026: https://openai.com/index/unlocking-the-codex-harness/
   - Describes a JSON-RPC app server architecture and reuse of a shared harness across multiple developer surfaces.

## Technical Feasibility
The existing repository already contains:
- `mcp-servers/team-orchestrator`, a Node CLI/MCP server for planning packets, worker contracts, worker results, and final reports.
- `mcp-servers/test-runner`, an MCP server for detecting projects and running tests.
- Documentation for Codex/Gemini setup and role-based workflows.

The lowest-risk production-ready implementation is to extend the existing team orchestrator CLI with a deterministic lifecycle command. That command can generate a project charter, research brief/report placeholders, architecture plan, execution plan, worker contracts, coding brief, review brief, testing manifest, and delivery report. It should validate required sections and produce actionable files that Codex/Gemini agents can consume.

## Reference Architecture Pattern
```text
Non-technical user idea
        |
        v
Lifecycle CLI command
        |
        +--> .ai-manager/project-charter.md
        +--> .ai-research/brief.md + research-report.md
        +--> .ai-plan/architecture.md + execution-plan.md + worker-contracts.json
        +--> .ai-coding/current-task.md
        +--> .ai-review/review-brief.md
        +--> .ai-testing/test-manifest.md
        |
        v
Validation gates and final delivery report
```

## Data Source and Library Recommendations
- Continue using Node.js standard library for local file generation and validation.
- Reuse existing `lib.js` normalization and planning helpers where possible.
- Keep source URLs explicit in generated research reports so humans can inspect provenance.
- Avoid adding external dependencies for the first production-ready slice.

## Risk Matrix
| Risk | Severity | Likelihood | Mitigation |
| --- | --- | --- | --- |
| User assumes automation means unattended production deployment | High | Medium | Make the CLI generate validation gates, review briefs, and explicit acceptance criteria instead of silent deployment. |
| Generated plans become vague or non-actionable | High | Medium | Validate required files and sections; use worker contracts with explicit acceptance criteria. |
| Non-technical user cannot understand outputs | Medium | High | Use plain-language summaries and predictable file names. |
| AI agents modify files outside scope | High | Medium | Include scoped worker contracts and gate checks around changed files. |
| Test commands are unavailable in target project | Medium | Medium | Detect project type where possible and record missing test setup as a blocking diagnostic. |
| Source provenance is weak | Medium | Medium | Require at least three explicit sources in research artifacts. |

## Best-Practice Conclusions
1. The workflow should be artifact-first: every stage writes files before implementation begins.
2. The manager should enforce gates, not only produce a plan.
3. The first production slice should integrate with the existing CLI rather than introduce a hosted app.
4. Human-readable reports are essential because the target user is non-technical.
