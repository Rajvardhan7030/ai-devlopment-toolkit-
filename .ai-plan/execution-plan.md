# Execution Plan

## Phase 1: Pure Lifecycle Builder
- Add `buildLifecycleArtifacts(args)` to `mcp-servers/team-orchestrator/lib.js`.
- Reuse existing `normalizeList` and planning helpers where practical.
- Return a map of relative file paths to text contents.
- Complexity: Medium.
- Tests: Assert required paths exist, user idea is preserved, and JSON contracts parse.

## Phase 2: CLI Command
- Add `lifecycle` command to `mcp-servers/team-orchestrator/team-flow.js`.
- Validate required `--idea`.
- Write generated artifacts to disk.
- Print JSON summary.
- Complexity: Medium.
- Tests: Use temporary directories and spawn the CLI with Node.

## Phase 3: Documentation
- Update README with a short non-technical usage example.
- Complexity: Low.
- Tests: Not code-tested; covered by review.

## Dependency Graph
```text
Phase 1 -> Phase 2 -> Phase 3 -> Review -> Test
```

## Acceptance Criteria
- Running `node mcp-servers/team-orchestrator/team-flow.js lifecycle --idea "..." --output /tmp/example` creates all five stage workspaces plus `PROJECT-DELIVERY-REPORT.md`.
- Generated `worker-contracts.json` is valid JSON.
- Missing `--idea` exits non-zero with a clear error.
- Tests run without installing new dependencies.

## Testing Strategy
- Unit tests for artifact generation and JSON validity.
- CLI integration tests using a temporary directory.
- Full test command: `node --test tests/*.test.js`.
