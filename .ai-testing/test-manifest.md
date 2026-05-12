# Test Manifest

## Test Commands
- Unit and regression tests: `node --test tests/*.test.js`
- Coverage check: `node --test --experimental-test-coverage tests/*.test.js`
- CLI smoke test: `node mcp-servers/team-orchestrator/team-flow.js lifecycle --idea "Make delivery lifecycle automatic" --output /tmp/team-flow-lifecycle-check`

## Integration Scenarios
- Generate a lifecycle archive into a temporary directory.
- Confirm `.ai-plan/worker-contracts.json` is valid JSON.
- Confirm missing `--idea` exits non-zero with a clear error.

## Environment Requirements
- Node.js with built-in `node:test` support.
- No new package installation required.

## Acceptance Criteria
- All tests pass.
- Lifecycle command writes all expected stage artifacts.
- Missing required input is rejected.
- No external dependencies are added.
