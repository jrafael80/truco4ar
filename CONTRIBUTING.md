# Contributing to Truco4AR

Thank you for your interest in contributing to Truco4AR! This document provides guidelines and standards for contributing to the project.

## Table of Contents

- [Getting Started](#getting-started)
- [Git Workflow](#git-workflow)
- [Commit Standards](#commit-standards)
- [Code Standards](#code-standards)
- [Testing Requirements](#testing-requirements)
- [Pull Request Process](#pull-request-process)
- [Code Review Checklist](#code-review-checklist)
- [SOLID Principles](#solid-principles)

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Create a feature branch from `develop`
4. Make your changes
5. Submit a pull request

### Prerequisites

> Note: Specific prerequisites will be added once the technology stack is selected.

## Git Workflow

We follow **Git Flow** for branch management:

### Branch Structure

- **`main`**: Production-ready code. Only merge from `develop` or hotfix branches.
- **`develop`**: Integration branch for features. Default branch for development.
- **`feature/*`**: New features or enhancements
- **`bugfix/*`**: Bug fixes for develop branch
- **`hotfix/*`**: Critical fixes for production (branched from `main`)
- **`release/*`**: Release preparation (branched from `develop`)

### Branch Naming Conventions

```
feature/<short-description>
bugfix/<issue-number>-<short-description>
hotfix/<issue-number>-<short-description>
release/<version-number>
```

**Examples:**
```
feature/qr-code-generation
feature/voice-scoring
bugfix/123-card-display-issue
hotfix/456-critical-sync-bug
release/1.0.0
```

### Workflow Steps

1. **Create Feature Branch**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Develop and Commit**
   - Make changes
   - Write tests
   - Commit with conventional commit messages
   - Push to your fork

3. **Create Pull Request**
   - Target: `develop` branch
   - Fill out PR template
   - Link related issues
   - Request reviews

4. **Address Review Feedback**
   - Make requested changes
   - Push additional commits
   - Re-request review

5. **Merge**
   - Once approved, PR will be merged to `develop`
   - Delete feature branch after merge

## Commit Standards

We use **Conventional Commits** format for clear and semantic commit messages.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semicolons, etc.)
- **refactor**: Code refactoring (no feature change or bug fix)
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks, dependency updates, etc.
- **ci**: CI/CD configuration changes

### Scope (Optional)

The scope indicates which part of the codebase is affected:

- `game`: Game logic and rules
- `sync`: Device synchronization
- `voice`: Voice recognition and scoring
- `ui`: User interface components
- `api`: API endpoints or services
- `db`: Database changes
- `deps`: Dependency updates

### Examples

```
feat(game): implement Envido betting logic

Add complete Envido betting system including:
- Envido, Envido Envido, Real Envido progression
- Score calculation for card combinations
- Bet acceptance and declining logic

Closes #45

---

fix(sync): resolve device disconnect during game

Fixed race condition causing devices to lose sync
when multiple players act simultaneously.

Fixes #123

---

docs(rules): add Flor variant rules documentation

Added comprehensive documentation for Flor betting
rules including Contraflor and scoring calculations.

---

test(game): add unit tests for card hierarchy

Added tests for:
- Special card rankings
- Regular card comparisons
- Equal card scenarios

---

chore(deps): update dependencies to latest versions
```

### Commit Message Guidelines

1. **Subject Line**
   - Use imperative mood ("add" not "added" or "adds")
   - Don't capitalize first letter (except proper nouns)
   - No period at the end
   - Limit to 50 characters

2. **Body** (optional but recommended)
   - Wrap at 72 characters
   - Explain what and why, not how
   - Separate from subject with blank line

3. **Footer** (optional)
   - Reference issues: `Closes #123`, `Fixes #456`, `Refs #789`
   - Breaking changes: `BREAKING CHANGE: description`

## Code Standards

### General Principles

1. **Readability First**: Code is read more than written
2. **Self-Documenting**: Use clear variable and function names
3. **DRY (Don't Repeat Yourself)**: Avoid code duplication
4. **KISS (Keep It Simple, Stupid)**: Prefer simple solutions
5. **YAGNI (You Aren't Gonna Need It)**: Don't add unnecessary features

### Code Style

> Note: Specific style guidelines will be added once the technology stack is selected.

General rules:
- Use consistent naming conventions
- Follow language-specific best practices
- Use linters and formatters (configuration will be provided)
- Write meaningful comments for complex logic
- Keep functions small and focused

### Documentation

- **Public APIs**: Must have documentation
- **Complex Logic**: Add explanatory comments
- **TODO Comments**: Include issue number: `// TODO(#123): Implement retry logic`
- **Update Docs**: If code changes affect user-facing features, update relevant documentation

## Testing Requirements

All code contributions must include appropriate tests.

### Test Coverage

- **Unit Tests**: Required for all business logic and utility functions
- **Integration Tests**: Required for:
  - External service integrations
  - Inter-service communication
  - Database operations
  - API endpoints

See [Testing Strategy](docs/TESTING_STRATEGY.md) for detailed testing guidelines.

### Test Requirements

1. **New Features**: Must include tests covering core functionality
2. **Bug Fixes**: Must include regression test
3. **Refactoring**: Existing tests must continue to pass
4. **Test Naming**: Use descriptive names that explain what is being tested

### Running Tests

> Note: Specific test commands will be added once the technology stack is selected.

```bash
# Run all tests
npm test  # or equivalent command

# Run specific test suite
npm test -- path/to/test

# Run with coverage
npm run test:coverage
```

## Pull Request Process

### Before Creating PR

1. ✅ All tests pass locally
2. ✅ Code follows style guidelines
3. ✅ Documentation is updated
4. ✅ Commit messages follow conventions
5. ✅ Branch is up to date with target branch

### PR Template

When creating a PR, please include:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Breaking change (fix or feature causing existing functionality to break)
- [ ] Documentation update

## Related Issues
Closes #(issue number)

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Documentation
- [ ] Documentation updated
- [ ] Code comments added where needed

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have updated the documentation accordingly
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or feature works
- [ ] New and existing unit tests pass locally
- [ ] Any dependent changes have been merged
```

### PR Review Timeline

- Initial review: Within 2 business days
- Follow-up reviews: Within 1 business day
- Merging: After approval from at least 1 reviewer

## Code Review Checklist

Reviewers should verify the following:

### Documentation Compliance ⭐ (Priority)
- [ ] Documentation reflects the changes made
- [ ] Public API changes are documented
- [ ] User-facing changes have updated docs
- [ ] Code comments explain complex logic

### Security 🔒
- [ ] No OWASP Top 10 vulnerabilities introduced
- [ ] Input validation implemented where needed
- [ ] No hardcoded secrets or credentials
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] No command injection risks
- [ ] Sensitive data properly handled
- [ ] Authentication and authorization correct

### Performance ⚡
- [ ] No obvious performance bottlenecks
- [ ] Database queries optimized
- [ ] No unnecessary API calls
- [ ] Proper use of caching where applicable
- [ ] No memory leaks introduced
- [ ] Async operations handled correctly

### Architecture and Design Patterns 🏗️
- [ ] Follows existing architecture patterns
- [ ] Proper separation of concerns
- [ ] Consistent with project structure
- [ ] Appropriate use of design patterns
- [ ] No tight coupling introduced
- [ ] Interfaces and abstractions used properly

### SOLID Principles 📐
- [ ] **S**ingle Responsibility: Each class/module has one reason to change
- [ ] **O**pen/Closed: Open for extension, closed for modification
- [ ] **L**iskov Substitution: Subtypes can replace parent types
- [ ] **I**nterface Segregation: No unused interface methods
- [ ] **D**ependency Inversion: Depend on abstractions, not concretions

### Testing 🧪
- [ ] Unit tests included for new code
- [ ] Integration tests added where needed
- [ ] Tests are meaningful and test correct behavior
- [ ] Edge cases are covered
- [ ] Test names are descriptive
- [ ] All tests pass

### Code Quality 💎
- [ ] Code is readable and maintainable
- [ ] No code duplication (DRY principle)
- [ ] Functions/methods are small and focused
- [ ] Variable names are clear and descriptive
- [ ] No commented-out code
- [ ] No unnecessary complexity
- [ ] Error handling is appropriate
- [ ] Follows style guidelines

### Git and Commits 📝
- [ ] Commit messages follow Conventional Commits
- [ ] No WIP or temporary commits
- [ ] Logical commit organization
- [ ] No merge commits (rebase preferred)

## SOLID Principles

We enforce SOLID principles to maintain clean, maintainable code:

### Single Responsibility Principle (SRP)
> A class should have only one reason to change.

**Good Example:**
```javascript
// Each class has one responsibility
class CardDealer {
  dealCards(players, deckSize) { /* ... */ }
}

class ScoreCalculator {
  calculateEnvido(cards) { /* ... */ }
}
```

**Bad Example:**
```javascript
// This class has multiple responsibilities
class GameManager {
  dealCards() { /* ... */ }
  calculateScore() { /* ... */ }
  renderUI() { /* ... */ }
  saveToDatabase() { /* ... */ }
}
```

### Open/Closed Principle (OCP)
> Software entities should be open for extension but closed for modification.

**Good Example:**
```javascript
// Use interfaces/abstractions to allow extension
class BetHandler {
  handleBet(bet) { /* base implementation */ }
}

class EnvidoBetHandler extends BetHandler {
  handleBet(bet) { /* Envido-specific logic */ }
}

class TrucoBetHandler extends BetHandler {
  handleBet(bet) { /* Truco-specific logic */ }
}
```

### Liskov Substitution Principle (LSP)
> Objects of a superclass should be replaceable with objects of subclasses without breaking the application.

**Good Example:**
```javascript
class Player {
  playCard(card) { return this.validateAndPlay(card); }
}

class AIPlayer extends Player {
  playCard(card) {
    // AI logic, but still returns same type
    return this.validateAndPlay(card);
  }
}
```

### Interface Segregation Principle (ISP)
> Clients should not be forced to depend on interfaces they don't use.

**Good Example:**
```javascript
// Separate interfaces for different capabilities
interface Scorable {
  calculateScore(): number;
}

interface Bettable {
  placeBet(amount: number): void;
}

// Classes implement only what they need
class EnvidoRound implements Scorable {
  calculateScore() { /* ... */ }
}
```

### Dependency Inversion Principle (DIP)
> Depend on abstractions, not concretions.

**Good Example:**
```javascript
// Depend on abstract storage, not specific implementation
class GameState {
  constructor(storage: Storage) {
    this.storage = storage;
  }

  save() {
    this.storage.save(this.data);
  }
}

// Can inject any storage implementation
const game = new GameState(new LocalStorage());
// or
const game = new GameState(new DatabaseStorage());
```

## Questions or Issues?

- **Questions**: Open a discussion in GitHub Discussions
- **Bugs**: Open an issue with detailed reproduction steps
- **Feature Requests**: Open an issue with detailed use case
- **Security Issues**: Email security contact (to be added)

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.
