# Project Context for Gemini CLI

## Project Overview
<!-- Describe your project in 2-3 sentences -->

## Technology Stack
<!-- Fill in your stack -->
- Language:
- Framework:
- Database:
- Testing:
- Linting:

## Coding Standards
<!-- Your team's rules -->
- Use meaningful variable names (no single letters except loops)
- Maximum function length: 50 lines
- Always handle errors explicitly (no silent catches)
- Write tests for all new features
- Document public APIs with docstrings

## Debug Rules
<!-- Specific to your codebase -->
- Check for missing `await` on all async calls
- Verify database session is properly committed/closed
- Validate all user inputs at API boundaries
- Check for N+1 query issues
- Ensure proper error logging (no sensitive data)

## Test Commands
<!-- How to run tests -->
```bash
# Unit tests

# Integration tests

# Linting

# Type checking
```

## Architecture Notes
<!-- High-level design decisions -->
- Layer structure:
- Data flow:
- External dependencies:

## Common Issues
<!-- Known pitfalls in this codebase -->
1.
2.
3.
