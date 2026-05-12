# Current Coding Task

## Module
`team-orchestrator` lifecycle command.

## References
- Architecture: `.ai-plan/architecture.md`
- Execution plan: `.ai-plan/execution-plan.md`
- Worker contracts: `.ai-plan/worker-contracts.json`

## Scope
Allowed source files:
- `mcp-servers/team-orchestrator/lib.js`
- `mcp-servers/team-orchestrator/team-flow.js`
- `mcp-servers/team-orchestrator/package.json`
- `tests/team-flow-lifecycle.test.js`
- `README.md`

## Requirements
- Add a deterministic `lifecycle` CLI command.
- Generate all five stage workspaces and `PROJECT-DELIVERY-REPORT.md`.
- Validate missing `--idea`.
- Add tests using Node built-in test runner.
- Do not add external dependencies.
