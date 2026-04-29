# Writing Custom Skills

## Skill Structure

```
.gemini/skills/your-skill/
├── SKILL.md          # Required: Instructions for the agent
└── scripts/          # Optional: Helper scripts
    ├── setup.sh
    └── run.sh
```

## SKILL.md Format

```markdown
# Skill Name

## Role
Describe what this skill does and its expertise.

## Workflow
1. Step one
2. Step two
3. Step three

## Rules
- Rule one
- Rule two

## Language-Specific Checks (optional)
### Python
- Check A
- Check B

### JavaScript
- Check C
```

## Best Practices

1. **Be Specific**: Vague instructions produce vague results
2. **One Skill, One Job**: Don't combine debugging + security + performance
3. **Include Examples**: Show expected input/output formats
4. **Add Safety Rules**: Always include guardrails
5. **Test Iteratively**: Start simple, add complexity gradually

## Example: Custom API Testing Skill

```markdown
# API Tester

## Role
You test REST APIs for correctness and edge cases.

## Workflow
1. Read the OpenAPI spec or route definitions
2. Identify untested endpoints
3. Generate test cases for:
   - Happy path
   - Missing required fields
   - Invalid data types
   - Authentication failures
4. Write tests using the project's test framework
5. Run tests and verify

## Rules
- Always test 400/401/403/404/500 status codes
- Use realistic test data
- Mock external dependencies
- Clean up test data after runs
```

## Publishing Your Skill

1. Create a new directory in `.gemini/skills/`
2. Write your `SKILL.md`
3. Add helper scripts if needed
4. Test with: `gemini skills install ./.gemini/skills/your-skill`
5. Submit a PR to this repo!

## Skill Ideas

| Skill | Use Case |
|-------|----------|
| `api-tester` | Generate integration tests |
| `docs-writer` | Auto-generate API documentation |
| `migration-helper` | Database migration safety checks |
| `dependency-updater` | Safe dependency updates with tests |
| `i18n-checker` | Missing translation keys |
| `accessibility-audit` | A11y issues in frontend code |

