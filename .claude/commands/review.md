---
description: Comprehensive code review following project standards
---

# Code Review

Please perform a comprehensive code review of the current changes, following Truco4AR's development standards.

## Review Checklist

### 1. Documentation Compliance ⭐ (HIGHEST PRIORITY)
- [ ] Does the documentation reflect the changes made?
- [ ] Are public API changes properly documented?
- [ ] Have user-facing changes updated relevant docs in [docs/](docs/)?
- [ ] Are complex logic sections commented?
- [ ] Is the [ARCHITECTURE.md](docs/ARCHITECTURE.md) still accurate?

### 2. Security 🔒
Check for OWASP Top 10 vulnerabilities:
- [ ] No SQL injection vulnerabilities
- [ ] No Cross-Site Scripting (XSS) vulnerabilities
- [ ] No command injection risks
- [ ] No insecure direct object references
- [ ] Input validation implemented where needed
- [ ] No hardcoded secrets or credentials
- [ ] Sensitive data properly handled (encryption, sanitization)
- [ ] Authentication and authorization properly implemented
- [ ] No security misconfigurations
- [ ] Dependencies checked for known vulnerabilities

### 3. Performance ⚡
- [ ] No obvious performance bottlenecks
- [ ] Database queries optimized (indexed fields, no N+1 queries)
- [ ] No unnecessary API calls or external requests
- [ ] Proper use of caching where applicable
- [ ] No memory leaks introduced
- [ ] Async operations handled correctly (no blocking calls)
- [ ] Large data sets handled efficiently
- [ ] WebSocket messages optimized (delta updates, not full state)

### 4. Architecture and Design Patterns 🏗️
- [ ] Follows patterns established in [ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [ ] Proper separation of concerns (services, logic, presentation)
- [ ] Consistent with existing project structure
- [ ] Appropriate use of design patterns
- [ ] No tight coupling between components
- [ ] Interfaces and abstractions used properly
- [ ] Service boundaries respected (see [ARCHITECTURE.md](docs/ARCHITECTURE.md))
- [ ] Dependencies flow in the correct direction

### 5. SOLID Principles 📐
- [ ] **Single Responsibility**: Each class/module has one reason to change
- [ ] **Open/Closed**: Open for extension, closed for modification
- [ ] **Liskov Substitution**: Subtypes can replace parent types without issues
- [ ] **Interface Segregation**: No clients forced to depend on unused interfaces
- [ ] **Dependency Inversion**: Depends on abstractions, not concretions

See [CONTRIBUTING.md](CONTRIBUTING.md#solid-principles) for detailed examples.

### 6. Testing 🧪
- [ ] Unit tests included for new business logic
- [ ] Integration tests added for service integrations
- [ ] Tests follow patterns in [TESTING_STRATEGY.md](docs/TESTING_STRATEGY.md)
- [ ] Edge cases covered
- [ ] Test names are descriptive
- [ ] All tests pass
- [ ] No flaky tests introduced
- [ ] Test coverage meets minimum 80% requirement

### 7. Code Quality 💎
- [ ] Code is readable and maintainable
- [ ] No code duplication (DRY principle)
- [ ] Functions/methods are small and focused
- [ ] Variable and function names are clear and descriptive
- [ ] No commented-out code (remove or explain why kept)
- [ ] No unnecessary complexity (KISS principle)
- [ ] Error handling is appropriate and informative
- [ ] Follows existing code style guidelines
- [ ] No console.log or debug statements left in production code

### 8. Git and Commits 📝
- [ ] Commit messages follow Conventional Commits format
- [ ] Format: `<type>(<scope>): <subject>`
- [ ] Types: feat, fix, docs, style, refactor, perf, test, chore, ci
- [ ] Commits are logical and well-organized
- [ ] No WIP or "temp" commits
- [ ] No merge commits (rebase preferred)

See [CONTRIBUTING.md](CONTRIBUTING.md#commit-standards) for commit guidelines.

## Review Focus Areas

Based on the type of change, focus on:

**For new features:**
- Product specs alignment ([PRODUCT_SPECS.md](docs/PRODUCT_SPECS.md))
- User flows documented ([USER_FLOWS.md](docs/USER_FLOWS.md))
- Game rules correctly implemented ([TRUCO_RULES.md](docs/TRUCO_RULES.md))

**For bug fixes:**
- Root cause identified and addressed
- Regression test added
- Similar issues checked in codebase

**For refactoring:**
- Behavior unchanged (tests still pass)
- Complexity reduced
- Performance improved or maintained

## Output Format

Provide feedback as:

1. **Summary**: Overall assessment (Approve, Request Changes, Comment)

2. **Critical Issues**: Must be fixed before merge
   - Security vulnerabilities
   - Breaking changes
   - Test failures
   - Documentation gaps

3. **Suggestions**: Improvements that would be beneficial
   - Performance optimizations
   - Code quality improvements
   - Better naming or structure

4. **Nitpicks**: Minor issues (don't block merge)
   - Style inconsistencies
   - Typos
   - Minor refactoring opportunities

5. **Praise**: Highlight good practices
   - Excellent test coverage
   - Clean implementation
   - Good documentation

## Additional Context

- Review in context of [Game Architecture](docs/ARCHITECTURE.md)
- Consider [Product Requirements](docs/PRODUCT_SPECS.md)
- Verify [Truco Rules](docs/TRUCO_RULES.md) are correctly implemented
- Check alignment with [User Flows](docs/USER_FLOWS.md)
