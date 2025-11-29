# Testing Strategy

This document outlines the testing approach for Truco4AR, covering unit tests, integration tests, and quality standards.

## Overview

Our testing philosophy:
- **Tests as Documentation**: Tests should clearly document expected behavior
- **Fast Feedback**: Tests should run quickly to enable rapid development
- **Reliable**: Tests should be deterministic and not flaky
- **Maintainable**: Tests should be easy to understand and update

## Testing Pyramid

```
        ╱╲
       ╱  ╲
      ╱ E2E╲         ← Not in initial scope
     ╱──────╲
    ╱        ╲
   ╱Integration╲     ← External services, inter-service communication
  ╱────────────╲
 ╱              ╲
╱  Unit Tests    ╲   ← Business logic, utilities, components
──────────────────
```

### Test Distribution (Target)

- **Unit Tests**: ~70% of test suite
- **Integration Tests**: ~30% of test suite
- **E2E Tests**: Future scope (not initially implemented)

## Unit Testing

### Scope

Unit tests verify individual functions, methods, or components in isolation.

### What to Test

✅ **Must Test**:
- Game logic (card hierarchy, trick resolution, winner calculation)
- Bet handling (Envido, Truco, Flor calculations)
- Score calculations
- Input validation
- Business rules enforcement
- Utility functions
- Data transformations

✅ **Should Test**:
- UI component logic (state management, event handlers)
- Error handling paths
- Edge cases and boundary conditions

❌ **Don't Test**:
- Third-party libraries
- Framework internals
- Trivial getters/setters with no logic
- Generated code

### Unit Test Requirements

1. **Isolated**: No dependencies on external services or databases
2. **Fast**: Each test should run in milliseconds
3. **Independent**: Tests can run in any order
4. **Repeatable**: Same results every time
5. **Self-validating**: Clear pass/fail with no manual verification

### Unit Test Structure

Use the **Arrange-Act-Assert (AAA)** pattern:

```javascript
describe('CardHierarchy', () => {
  describe('compareCards', () => {
    it('should rank Ancho de Espadas higher than Ancho de Bastos', () => {
      // Arrange
      const anchoEspadas = { rank: 1, suit: 'espadas' }
      const anchoBastos = { rank: 1, suit: 'bastos' }

      // Act
      const result = CardHierarchy.compareCards(anchoEspadas, anchoBastos)

      // Assert
      expect(result).toBe(1) // anchoEspadas wins
    })

    it('should return 0 for equal non-special cards', () => {
      // Arrange
      const threeEspadas = { rank: 3, suit: 'espadas' }
      const threeBastos = { rank: 3, suit: 'bastos' }

      // Act
      const result = CardHierarchy.compareCards(threeEspadas, threeBastos)

      // Assert
      expect(result).toBe(0) // tie
    })
  })
})
```

### Test Naming Conventions

Use descriptive test names that explain the scenario:

**Pattern**: `should [expected behavior] when [condition/scenario]`

**Good Examples**:
```javascript
it('should return Envido score of 33 when holding 7 and 6 of same suit')
it('should award 2 points when Truco is accepted')
it('should reject bet when called out of sequence')
it('should handle player disconnection during betting phase')
```

**Bad Examples**:
```javascript
it('test1')
it('works')
it('should return correct value')
```

### Mocking and Stubbing

Use mocks/stubs to isolate the unit under test:

```javascript
describe('GameLogicService', () => {
  it('should deal 3 cards to each player', () => {
    // Mock the random shuffle
    const mockShuffler = {
      shuffle: jest.fn(cards => cards) // return unshuffled for predictability
    }

    const gameLogic = new GameLogicService(mockShuffler)
    const players = [player1, player2, player3, player4]

    const hands = gameLogic.dealCards(players)

    expect(hands.get(player1.id)).toHaveLength(3)
    expect(hands.get(player2.id)).toHaveLength(3)
  })
})
```

### Coverage Targets

- **Overall**: Minimum 80% code coverage
- **Critical paths**: 100% coverage for game logic, bet handling, scoring
- **Error handling**: All error paths tested
- **Edge cases**: Boundary conditions covered

### Coverage Exceptions

Coverage requirements can be relaxed for:
- UI rendering code (covered by integration tests)
- Configuration files
- Type definitions
- Logging statements

## Integration Testing

### Scope

Integration tests verify that different services/modules work together correctly.

### What to Test

✅ **Must Test**:
- API endpoints (request/response contracts)
- Database operations (CRUD operations)
- External service integrations (voice recognition, QR generation)
- WebSocket communication (state synchronization)
- Service-to-service communication
- Authentication and authorization flows

### Integration Test Categories

#### 1. Service Integration Tests

Test interactions between internal services:

```javascript
describe('Game Flow Integration', () => {
  it('should complete full hand with betting', async () => {
    const sessionManager = new SessionManager()
    const gameLogic = new GameLogicService()
    const betHandler = new BetHandler()
    const scoreManager = new ScoreManager()

    // Create session
    const session = await sessionManager.createSession({
      maxPlayers: 4,
      rules: defaultRules
    })

    // Add players
    await sessionManager.addPlayer(session.id, player1)
    // ... add more players

    // Start game
    const gameState = await gameLogic.startGame(session.id)

    // Player calls Envido
    const betState = await betHandler.callBet(gameState, 'envido', player1.id)
    expect(betState.type).toBe('envido')

    // Opponent accepts
    const resolvedBet = await betHandler.respondToBet(betState, 'accept', player2.id)

    // Verify scores updated
    const scores = await scoreManager.getScores(session.id)
    expect(scores.teamA).toBeGreaterThan(0)
  })
})
```

#### 2. Database Integration Tests

Test data persistence and retrieval:

```javascript
describe('SessionStore Integration', () => {
  let sessionStore

  beforeAll(async () => {
    // Setup test database
    sessionStore = new SessionStore(testDatabaseConfig)
    await sessionStore.connect()
  })

  afterAll(async () => {
    // Cleanup
    await sessionStore.disconnect()
  })

  afterEach(async () => {
    // Clear test data
    await sessionStore.clearAll()
  })

  it('should persist and retrieve session', async () => {
    const session = {
      id: 'test-session',
      code: 'ABC123',
      maxPlayers: 4,
      createdAt: new Date()
    }

    await sessionStore.save(session)
    const retrieved = await sessionStore.findById('test-session')

    expect(retrieved).toMatchObject(session)
  })
})
```

#### 3. External Service Integration Tests

Test integrations with third-party services:

```javascript
describe('Voice Recognition Integration', () => {
  let voiceService

  beforeAll(() => {
    voiceService = new VoiceRecognitionService(testApiKey)
  })

  it('should recognize Envido announcement from audio', async () => {
    // Use pre-recorded test audio file
    const audioBuffer = await loadTestAudio('envido-27.wav')

    const result = await voiceService.recognize(audioBuffer, {
      language: 'es',
      context: 'truco-game'
    })

    expect(result.text).toContain('envido')
    expect(result.confidence).toBeGreaterThan(0.8)
    expect(result.parsedScore).toBe(27)
  })

  it('should handle recognition failure gracefully', async () => {
    const noisyAudio = await loadTestAudio('noise.wav')

    const result = await voiceService.recognize(noisyAudio)

    expect(result.confidence).toBeLessThan(0.6)
    expect(result.requiresConfirmation).toBe(true)
  })
})
```

#### 4. WebSocket Integration Tests

Test real-time communication:

```javascript
describe('State Synchronization Integration', () => {
  let server
  let client1, client2

  beforeAll(async () => {
    server = await startTestWebSocketServer()
    client1 = await connectClient(server.url)
    client2 = await connectClient(server.url)
  })

  afterAll(async () => {
    await client1.disconnect()
    await client2.disconnect()
    await server.stop()
  })

  it('should synchronize card play across clients', async () => {
    const sessionId = 'test-session'

    // Both clients join session
    await client1.send({ type: 'join', sessionId })
    await client2.send({ type: 'join', sessionId })

    // Client 1 plays card
    const cardPlayed = { type: 'playCard', card: { rank: 7, suit: 'espadas' } }
    await client1.send(cardPlayed)

    // Client 2 should receive update
    const update = await client2.waitForMessage()
    expect(update.type).toBe('cardPlayed')
    expect(update.card).toMatchObject(cardPlayed.card)
  })
})
```

### Integration Test Requirements

1. **Use Test Environment**: Separate test database, test API keys
2. **Cleanup**: Reset state between tests
3. **Isolation**: Each test should be independent
4. **Realistic Data**: Use production-like test data
5. **Error Scenarios**: Test failure cases, not just happy path

### Test Data Management

#### Fixtures

Create reusable test data:

```javascript
// test/fixtures/players.js
export const players = {
  player1: {
    id: 'player-1',
    deviceId: 'device-1',
    team: 'A',
    position: 0
  },
  player2: {
    id: 'player-2',
    deviceId: 'device-2',
    team: 'B',
    position: 1
  },
  // ... more players
}

// test/fixtures/cards.js
export const cards = {
  anchoEspadas: { rank: 1, suit: 'espadas' },
  anchoBastos: { rank: 1, suit: 'bastos' },
  // ... more cards
}
```

#### Factory Functions

Generate test data programmatically:

```javascript
// test/factories/session.factory.js
export function createTestSession(overrides = {}) {
  return {
    id: `session-${Date.now()}`,
    code: generateRandomCode(),
    maxPlayers: 4,
    createdAt: new Date(),
    status: 'waiting',
    ...overrides
  }
}
```

## Test Organization

### Directory Structure

```
project/
├── src/
│   ├── services/
│   │   ├── game-logic.service.js
│   │   └── bet-handler.service.js
│   └── utils/
│       └── card-hierarchy.js
└── test/
    ├── unit/
    │   ├── services/
    │   │   ├── game-logic.service.test.js
    │   │   └── bet-handler.service.test.js
    │   └── utils/
    │       └── card-hierarchy.test.js
    ├── integration/
    │   ├── api/
    │   │   └── game-endpoints.integration.test.js
    │   ├── services/
    │   │   └── game-flow.integration.test.js
    │   └── external/
    │       └── voice-recognition.integration.test.js
    ├── fixtures/
    │   ├── players.js
    │   ├── cards.js
    │   └── sessions.js
    └── factories/
        ├── session.factory.js
        └── game-state.factory.js
```

### File Naming

- Unit tests: `*.test.js` or `*.spec.js`
- Integration tests: `*.integration.test.js`
- Test fixtures: `*.fixture.js`
- Factories: `*.factory.js`

## Running Tests

### Commands

> Note: Specific commands will depend on chosen tech stack

```bash
# Run all tests
npm test

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run with coverage
npm run test:coverage

# Run in watch mode (for development)
npm run test:watch

# Run specific test file
npm test -- path/to/test.test.js

# Run tests matching pattern
npm test -- --testNamePattern="Envido"
```

### CI/CD Integration

Tests run automatically in CI pipeline:

1. **Pre-commit**: Fast unit tests (optional hook)
2. **Pull Request**: All unit tests + affected integration tests
3. **Pre-merge**: Full test suite
4. **Deployment**: Smoke tests in target environment

## Debugging Tests

### Test Isolation

Run single test to debug:

```javascript
// Use .only to run just this test
it.only('should calculate Envido score correctly', () => {
  // ... test code
})

// Use .skip to skip this test
it.skip('temporarily disabled test', () => {
  // ... test code
})
```

### Debug Output

```javascript
it('should do something', () => {
  const result = someFunction()

  // Log output for debugging
  console.log('Result:', result)

  // Use debugger statement
  debugger

  expect(result).toBe(expected)
})
```

## Test Quality Standards

### Code Review Checklist

When reviewing test code:

- [ ] Tests have descriptive names
- [ ] AAA pattern followed
- [ ] Tests are independent
- [ ] No hardcoded values without explanation
- [ ] Edge cases covered
- [ ] Error paths tested
- [ ] No sleeps or arbitrary waits
- [ ] Appropriate assertions (specific, not just truthy)
- [ ] Test data is realistic
- [ ] Cleanup properly handled

### Anti-Patterns to Avoid

❌ **Don't**: Test implementation details
```javascript
// Bad - testing internal structure
expect(gameLogic._internalState).toBeDefined()
```

✅ **Do**: Test behavior
```javascript
// Good - testing observable behavior
expect(gameLogic.getCurrentPlayer()).toBe(player1.id)
```

---

❌ **Don't**: Use sleep/wait with arbitrary timeouts
```javascript
// Bad
await sleep(1000)
expect(result).toBe(expected)
```

✅ **Do**: Use proper async handling
```javascript
// Good
await waitFor(() => expect(result).toBe(expected))
```

---

❌ **Don't**: Write tests that depend on other tests
```javascript
// Bad - order dependent
it('test 1', () => { globalState.value = 5 })
it('test 2', () => { expect(globalState.value).toBe(5) })
```

✅ **Do**: Keep tests independent
```javascript
// Good - each test sets up its own state
beforeEach(() => { globalState.value = 5 })
it('test 2', () => { expect(globalState.value).toBe(5) })
```

---

❌ **Don't**: Test multiple things in one test
```javascript
// Bad - testing too much
it('should do everything', () => {
  expect(a).toBe(1)
  expect(b).toBe(2)
  expect(c).toBe(3)
  // ... 20 more assertions
})
```

✅ **Do**: One concept per test
```javascript
// Good - focused tests
it('should set value a to 1', () => {
  expect(a).toBe(1)
})

it('should set value b to 2', () => {
  expect(b).toBe(2)
})
```

## Performance Testing

### Load Testing (Future Scope)

When needed, add load tests:
- Simulate concurrent games
- Test WebSocket connection limits
- Measure latency under load
- Identify bottlenecks

### Performance Budgets

Monitor test execution time:
- Unit tests: <5 minutes total
- Integration tests: <15 minutes total
- Individual test: <5 seconds (flag if slower)

## Continuous Improvement

### Test Metrics to Track

- Code coverage percentage
- Test execution time
- Flaky test rate
- Time to fix failing tests
- Bug escape rate (bugs found in production)

### Refactoring Tests

Regularly review and refactor tests:
- Remove redundant tests
- Improve test clarity
- Update to match current patterns
- Fix flaky tests immediately

## Resources

### Testing Tools (Examples)

> Specific tools will be chosen with tech stack

- **Unit Testing**: Jest, Vitest, Mocha, pytest
- **Integration Testing**: Supertest, TestContainers
- **Mocking**: Jest, Sinon, unittest.mock
- **Assertions**: Expect, Chai, assert
- **Coverage**: Istanbul, Coverage.py

### Best Practices References

- [Testing Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html)
- [AAA Pattern](https://xp123.com/articles/3a-arrange-act-assert/)
- [Test Naming](https://stackoverflow.com/questions/155436/unit-test-naming-best-practices)
