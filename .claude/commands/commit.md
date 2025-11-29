---
description: Validate commit message format and prepare for commit
---

# Commit Validation

Validate that the current commit follows Truco4AR's commit standards and prepare for a proper commit.

## Commit Message Format

This project uses **Conventional Commits** format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type (Required)

Must be one of:
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes only
- **style**: Code style changes (formatting, missing semicolons, etc.)
- **refactor**: Code refactoring (no feature or bug fix)
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks, dependency updates
- **ci**: CI/CD configuration changes

### Scope (Optional but Recommended)

Indicates which part of the codebase is affected:
- `game`: Game logic and rules
- `sync`: Device synchronization
- `voice`: Voice recognition and scoring
- `ui`: User interface components
- `api`: API endpoints or services
- `db`: Database changes
- `deps`: Dependency updates
- `config`: Configuration changes

### Subject (Required)

- Use imperative mood ("add" not "added" or "adds")
- Don't capitalize first letter
- No period at the end
- Maximum 50 characters
- Clear and descriptive

### Body (Optional but Recommended)

- Wrap at 72 characters
- Explain **what** and **why**, not **how**
- Separate from subject with blank line
- Can have multiple paragraphs

### Footer (Optional)

- Reference issues: `Closes #123`, `Fixes #456`, `Refs #789`
- Breaking changes: `BREAKING CHANGE: description`
- Multiple footers allowed

## Validation Checklist

### Format Validation

- [ ] Type is valid (feat, fix, docs, style, refactor, perf, test, chore, ci)
- [ ] Scope is appropriate (if provided)
- [ ] Subject is in imperative mood
- [ ] Subject doesn't end with period
- [ ] Subject is 50 characters or less
- [ ] Body is wrapped at 72 characters (if provided)
- [ ] Blank line between subject and body
- [ ] Footer references issues properly (if applicable)

### Content Validation

- [ ] Commit message clearly describes the change
- [ ] Explains WHY, not just WHAT
- [ ] References related issues/PRs
- [ ] Breaking changes are clearly marked
- [ ] Multiple unrelated changes are split into separate commits

### Code Validation

- [ ] All tests pass
- [ ] No debug code left (console.log, debugger, etc.)
- [ ] Documentation updated if needed
- [ ] No merge conflicts
- [ ] Follows code style guidelines

## Examples of Good Commit Messages

### Feature Addition

```
feat(game): implement Envido betting system

Add complete Envido betting logic including:
- Envido, Envido Envido, and Real Envido progression
- Score calculation based on card combinations
- Bet acceptance and declining flow
- Proper stake calculation for each bet level

Implements Envido rules as described in docs/TRUCO_RULES.md.

Closes #45
```

### Bug Fix

```
fix(sync): resolve device disconnect during betting phase

Fixed a race condition where devices would lose synchronization
when multiple players attempted to respond to bets simultaneously.

The issue was caused by missing mutex locks on bet state updates.
Added proper synchronization and retry logic.

Fixes #123
```

### Documentation

```
docs(rules): add Flor variant rules

Added comprehensive documentation for Flor betting rules including:
- Flor scoring calculation
- Contraflor and Contraflor al Resto
- When Flor takes precedence over other bets

References #78
```

### Test Addition

```
test(game): add unit tests for card hierarchy

Added comprehensive tests covering:
- Special card rankings (Anchos, 7s)
- Regular card comparisons
- Equal card scenarios (first played wins)
- Edge cases with multiple equal cards

Achieves 100% coverage for CardHierarchy module.
```

### Refactoring

```
refactor(bet): extract bet validation to separate module

Extracted bet validation logic into BetValidator module to improve
testability and follow Single Responsibility Principle.

No functionality changes, all existing tests still pass.
```

### Performance Improvement

```
perf(sync): optimize state synchronization with delta updates

Changed state synchronization to send only changed properties
instead of entire game state, reducing message size by ~80%.

Benchmarks show latency improvement from 150ms to 45ms on average
for game state updates.

Closes #234
```

## Examples of Bad Commit Messages

❌ **Too vague:**
```
fix: fixed bug
```

❌ **Not imperative:**
```
feat: added new feature
```

❌ **Capitalized subject:**
```
Fix: Update game logic
```

❌ **Period at end:**
```
feat: add Envido.
```

❌ **Too long subject:**
```
feat: add the complete Envido betting system with all the progression levels
```

❌ **Missing type:**
```
update documentation
```

❌ **Multiple unrelated changes:**
```
feat: add Envido, fix sync bug, update docs, refactor tests
```

## Commit Preparation Steps

### 1. Review Changes

```bash
# See what will be committed
git status

# Review diff
git diff --staged
```

### 2. Verify Tests Pass

```bash
# Run tests before committing
npm test
```

### 3. Check for Debug Code

Search for:
- `console.log`
- `debugger`
- `TODO` without issue number
- Commented-out code
- Temporary test skips (`.only`, `.skip`)

### 4. Update Documentation

If changes affect:
- Public APIs → Update relevant docs
- User-facing features → Update [PRODUCT_SPECS.md](docs/PRODUCT_SPECS.md)
- Architecture → Update [ARCHITECTURE.md](docs/ARCHITECTURE.md)
- Game rules → Verify [TRUCO_RULES.md](docs/TRUCO_RULES.md)

### 5. Split If Needed

If commit contains multiple unrelated changes:
```bash
# Unstage all
git reset

# Stage and commit related changes separately
git add <related-files>
git commit -m "feat(scope): first change"

git add <other-related-files>
git commit -m "fix(scope): second change"
```

## Interactive Commit Message Builder

Answer these questions to build your commit message:

1. **What type of change is this?**
   - New feature → `feat`
   - Bug fix → `fix`
   - Documentation → `docs`
   - Code style → `style`
   - Refactoring → `refactor`
   - Performance → `perf`
   - Tests → `test`
   - Chores → `chore`
   - CI/CD → `ci`

2. **What part of the codebase does this affect?**
   - Game logic → `game`
   - Synchronization → `sync`
   - Voice recognition → `voice`
   - UI → `ui`
   - API → `api`
   - Database → `db`
   - Dependencies → `deps`
   - Other → specify

3. **In one sentence, what does this change do?**
   - Start with a verb (add, fix, update, remove, refactor)
   - Be specific and clear
   - Keep under 50 characters

4. **Why was this change necessary?**
   - Explain the problem being solved
   - Describe the approach taken
   - Note any important decisions made

5. **Does this relate to any issues?**
   - Closes: `Closes #123`
   - Fixes: `Fixes #456`
   - References: `Refs #789`

6. **Are there breaking changes?**
   - If yes, add: `BREAKING CHANGE: description`

## Pre-Commit Checklist

Before committing, verify:

- [ ] Changes are complete and tested
- [ ] All tests pass
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] Commit message follows format
- [ ] No debug code left
- [ ] No sensitive data (credentials, keys)
- [ ] Related changes are grouped
- [ ] Unrelated changes are separated

## After Committing

1. **Verify commit:**
   ```bash
   git log -1
   ```

2. **Amend if needed (before pushing):**
   ```bash
   git commit --amend
   ```

3. **Push to remote:**
   ```bash
   git push origin <branch-name>
   ```

## References

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Contributing Guide](CONTRIBUTING.md#commit-standards)
- [Git Flow Workflow](CONTRIBUTING.md#git-workflow)
