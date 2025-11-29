# @truco4ar/shared

Shared game logic and types for Truco4AR. This package contains the core game rules and logic, independent of any specific backend or frontend implementation.

## Features

- **Card Types**: Type-safe card definitions with Spanish deck suits
- **Card Hierarchy**: Complete implementation of Argentine Truco card rankings
- **Game Logic**: Pure TypeScript game logic that can be used in any environment
- **Well Tested**: 100% test coverage for critical game logic

## Installation

This is an internal package for the Truco4AR monorepo. Install dependencies:

```bash
npm install
```

## Usage

```typescript
import { createCard, Suit, compareCards, SPECIAL_CARDS } from '@truco4ar/shared';

// Create cards
const anchoEspadas = SPECIAL_CARDS.ANCHO_ESPADAS;
const three = createCard(3, Suit.ESPADAS);

// Compare cards
const result = compareCards(anchoEspadas, three); // Returns 1 (ancho wins)
```

## Development

```bash
# Build
npm run build

# Watch mode
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Lint
npm run lint

# Format
npm run format
```

## Game Rules

This package implements the Argentine Truco rules as documented in [../../docs/TRUCO_RULES.md](../../docs/TRUCO_RULES.md).

### Card Hierarchy (Highest to Lowest)

1. Ancho de Espadas (1 of Swords) - Highest
2. Ancho de Bastos (1 of Clubs)
3. Siete de Espadas (7 of Swords)
4. Siete de Oro (7 of Coins)
5. All 3s (equal)
6. All 2s (equal)
7. 1 of Oros and 1 of Copas (equal)
8. All Kings (equal)
9. All Knights (equal)
10. All Jacks (equal)
11. 7 of Bastos and 7 of Copas (equal)
12. All 6s (equal)
13. All 5s (equal)
14. All 4s (equal) - Lowest

## Testing

Tests follow the testing strategy defined in [../../docs/TESTING_STRATEGY.md](../../docs/TESTING_STRATEGY.md).

- Unit tests for all game logic
- 80% minimum coverage (100% for critical paths)
- AAA pattern (Arrange-Act-Assert)
- Descriptive test names

Run tests:

```bash
npm test
```

## Architecture

This package is designed to be framework-agnostic:

- No external dependencies (except dev dependencies)
- Pure TypeScript/JavaScript
- Can be used in Node.js, browsers, or other runtimes
- Supports multiple backend/frontend implementations

See [../../docs/ARCHITECTURE.md](../../docs/ARCHITECTURE.md) for overall architecture.

## License

MIT - See [../../LICENSE](../../LICENSE)
