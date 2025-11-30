# Truco4AR

A multi-device web application for playing Argentine Truco using mobile phones instead of physical cards.

## Overview

Truco4AR brings the traditional Argentine card game Truco into the digital age. Players sit together at a table and use their phones as digital cards, creating a seamless blend of physical and digital gameplay.

## Key Features

- **Multi-Device Gameplay**: Each player uses their phone as their hand of cards
- **QR Code Synchronization**: Easy device pairing to join game tables
- **Voice-Enabled Scoring**: Automatic point tracking through voice commands (with manual editing support)
- **Configurable Rules**: Customize game variants
  - 2 or 4 players
  - Enable/disable Flor betting
  - Flexible Envido rules (Real Envido multiple calls)
  - Falta Envido modes (to leader/to loser)
  - Custom winning scores (15 or 30 points)
- **Flexible Display Options**:
  - Player view on each device
  - Optional shared table view on a separate display
- **Multi-Language Support**: Available in English and Spanish

## Documentation

- [Product Specifications](docs/PRODUCT_SPECS.md) - Product vision and features
- [Truco Rules](docs/TRUCO_RULES.md) - Complete Argentine Truco rules
- [Game Configuration](docs/GAME_CONFIG.md) - Configurable rules and game variants
- [User Flows](docs/USER_FLOWS.md) - Detailed user experience flows
- [Architecture](docs/ARCHITECTURE.md) - System architecture and design
- [Testing Strategy](docs/TESTING_STRATEGY.md) - Testing approach and guidelines
- [Contributing](CONTRIBUTING.md) - Development guidelines and standards

## Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- Git

### Installation

```bash
# Clone the repository
git clone git@github.com:jrafael80/truco4ar.git
cd truco4ar

# Install dependencies for all packages
npm install

# Run tests
npm test

# Build all packages
npm run build
```

### Running in Development

```bash
# Run all packages in watch mode
npm run dev

# Run specific package
npm run dev:backend   # Backend only
npm run dev:frontend  # Frontend only
```

## Development

This project uses **TypeScript + Node.js + React** for the initial implementation, with a stack-agnostic architecture that allows for future experimentation with alternative technologies. The core game logic is separated in the `@truco4ar/shared` package, making it reusable across different implementations.

See [Architecture](docs/ARCHITECTURE.md) for design principles.

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
├── packages/                  # Monorepo packages (npm workspaces)
│   ├── shared/               # Core game logic (TypeScript)
│   │   ├── src/
│   │   │   ├── types/       # Card, Player, Game types
│   │   │   └── game/        # Card hierarchy, game rules
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── backend/              # Backend implementation (coming soon)
│   └── frontend/             # Frontend implementation (coming soon)
├── .editorconfig             # Editor configuration
├── .gitignore               # Git ignore patterns
├── .npmrc                   # npm configuration
├── CONTRIBUTING.md          # Development guidelines
├── LICENSE                  # MIT License
├── package.json            # Root package.json (workspaces)
├── tsconfig.json           # Base TypeScript config
└── README.md              # This file
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

This project requires comprehensive testing using **Jest**:
- **Unit Tests**: 80% minimum coverage (100% for critical paths)
- **Integration Tests**: Required for service integrations
- **E2E Tests**: Future scope (not initial release)

Run tests:
```bash
# Run all tests across packages
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run tests for specific package
npm test -w @truco4ar/shared
```

See [TESTING_STRATEGY.md](docs/TESTING_STRATEGY.md) for detailed testing guidelines.

### Current Implementation Status

✅ **Completed**:
- Monorepo structure with npm workspaces
- Core game logic package (`@truco4ar/shared`)
- Card hierarchy implementation with 100% test coverage
- TypeScript configuration with strict mode
- Jest testing framework
- ESLint and Prettier configuration

🚧 **In Progress**:
- Backend implementation (Node.js)
- Frontend implementation (React)
- Real-time synchronization
- Voice scoring feature

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Project Status

🚧 **In Development** - Initial setup and documentation phase
