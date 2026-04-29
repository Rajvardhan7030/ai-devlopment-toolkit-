# Project Context for Codex CLI

## Project Description
<!-- 2-3 sentences about what this project does -->

## Stack & Tools
- Language:
- Framework:
- Package Manager:
- Test Runner:
- Linter:

## Development Guidelines
1. Keep functions focused and small
2. Prefer composition over inheritance
3. Validate all external inputs
4. Log errors with context, never swallow exceptions
5. Update tests when changing behavior

## Testing Standards
- Minimum coverage: 80%
- Unit tests: fast, isolated, deterministic
- Integration tests: test real database interactions
- Mock external services, never the database

## Debugging Checklist
Before fixing a bug, verify:
- [ ] Can reproduce the issue consistently
- [ ] Have checked recent commits for regressions
- [ ] Have checked logs for error context
- [ ] Fix includes a regression test

## Build & Deploy
```bash
# Install dependencies

# Run tests

# Build

# Lint
```

## Security Notes
- Never commit `.env` files
- Rotate secrets quarterly
- Validate JWT tokens on every protected route
- Sanitize all user inputs before database queries


