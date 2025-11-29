# Truco4AR

A multi-device web application for playing Argentine Truco using mobile phones instead of physical cards.

## Overview

Truco4AR brings the traditional Argentine card game Truco into the digital age. Players sit together at a table and use their phones as digital cards, creating a seamless blend of physical and digital gameplay.

## Key Features

- **Multi-Device Gameplay**: Each player uses their phone as their hand of cards
- **QR Code Synchronization**: Easy device pairing to join game tables
- **Voice-Enabled Scoring**: Automatic point tracking through voice commands (with manual editing support)
- **Flexible Display Options**:
  - Player view on each device
  - Optional shared table view on a separate display
- **Multi-Language Support**: Available in English and Spanish

## Documentation

- [Product Specifications](docs/PRODUCT_SPECS.md) - Product vision and features
- [Truco Rules](docs/TRUCO_RULES.md) - Complete Argentine Truco rules
- [User Flows](docs/USER_FLOWS.md) - Detailed user experience flows
- [Architecture](docs/ARCHITECTURE.md) - System architecture and design
- [Testing Strategy](docs/TESTING_STRATEGY.md) - Testing approach and guidelines
- [Contributing](CONTRIBUTING.md) - Development guidelines and standards

## Quick Start

> Note: Development setup instructions will be added once the technology stack is selected.

## Development

This project follows a stack-agnostic approach, allowing for technology stack changes without affecting core functionality. See [Architecture](docs/ARCHITECTURE.md) for design principles.

### Development Standards

- **Git Flow**: Feature branch workflow with PR reviews
- **Commits**: Conventional Commits format (feat, fix, docs, etc.)
- **Testing**: Unit and integration tests required (80% coverage minimum)
- **CI/CD**: GitHub Actions → GCP deployment
- **Code Review**: Mandatory PR reviews before merge

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed development guidelines.

### Claude Code Integration

This project includes Claude Code configuration for AI-assisted development:

**Slash Commands** (`.claude/commands/`):
- `/review` - Comprehensive code review against project standards
- `/test` - Generate and run tests following testing strategy
- `/commit` - Validate commit message format

**Hooks** (`.claude/hooks/`):
- Pre-commit: Validates commits, checks for debug code, runs unit tests
- Pre-push: Runs full test suite, verifies commit messages

### Working with This Project

1. **Clone the repository**
   ```bash
   git clone git@github.com:jrafael80/truco4ar.git
   cd truco4ar
   ```

2. **Create feature branch** (following Git Flow)
   ```bash
   git checkout develop
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow [CONTRIBUTING.md](CONTRIBUTING.md) guidelines
   - Write tests for new code
   - Update documentation as needed

4. **Use Claude Code commands**
   ```bash
   # Before committing
   /review    # Review your changes
   /test      # Generate/run tests
   /commit    # Validate commit format
   ```

5. **Commit using Conventional Commits**
   ```bash
   git add .
   git commit -m "feat(game): add Envido betting logic"
   ```

6. **Push and create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   # Then create PR on GitHub targeting 'develop' branch
   ```

### Project Structure

```
truco4ar/
├── .claude/                    # Claude Code configuration
│   ├── commands/              # Slash commands (review, test, commit)
│   └── hooks/                 # Pre-commit and pre-push hooks
├── .github/
│   └── workflows/             # CI/CD pipelines
│       ├── ci.yml            # Continuous Integration
│       ├── cd-dev.yml        # Deploy to development
│       └── cd-prod.yml       # Deploy to production
├── docs/                      # Project documentation
│   ├── ARCHITECTURE.md       # System architecture
│   ├── PRODUCT_SPECS.md      # Product specifications
│   ├── TRUCO_RULES.md        # Game rules
│   ├── USER_FLOWS.md         # User experience flows
│   └── TESTING_STRATEGY.md   # Testing guidelines
├── .editorconfig             # Editor configuration
├── .gitignore               # Git ignore patterns
├── CONTRIBUTING.md          # Development guidelines
├── LICENSE                  # MIT License
└── README.md               # This file
```

### CI/CD Pipeline

**Continuous Integration** (on PR and push):
- Lint and format check
- Unit tests
- Integration tests
- Security scanning
- Build verification
- Documentation validation
- Commit message validation

**Continuous Deployment**:
- **Development**: Auto-deploy on merge to `develop` branch
- **Production**: Auto-deploy on merge to `main` branch

See [`.github/workflows/`](.github/workflows/) for pipeline details.

### Testing

This project requires comprehensive testing:
- **Unit Tests**: 80% minimum coverage (100% for critical paths)
- **Integration Tests**: Required for service integrations
- **E2E Tests**: Future scope (not initial release)

Run tests: (commands will be added with stack choice)
```bash
npm test              # or equivalent
npm run test:coverage # with coverage report
```

See [TESTING_STRATEGY.md](docs/TESTING_STRATEGY.md) for detailed testing guidelines.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Project Status

🚧 **In Development** - Initial setup and documentation phase
