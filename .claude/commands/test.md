---
description: Add or run tests following project testing strategy
---

# Test Command

Generate and run tests for the current changes, following Truco4AR's testing strategy.

## Testing Strategy

This project follows the testing guidelines defined in [TESTING_STRATEGY.md](docs/TESTING_STRATEGY.md).

### Test Coverage Requirements
- **Unit Tests**: Required for all business logic and utility functions
- **Integration Tests**: Required for external services and inter-service communication
- **Coverage Target**: Minimum 80% overall, 100% for critical paths

## Tasks to Perform

### 1. Identify Testing Needs

Analyze the current changes and identify what needs to be tested:

**For new code:**
- [ ] What business logic was added?
- [ ] What external services are integrated?
- [ ] What edge cases exist?
- [ ] What error scenarios need handling?

**For modified code:**
- [ ] Do existing tests still pass?
- [ ] Are existing tests still relevant?
- [ ] Do new behaviors need new tests?
- [ ] Are there new edge cases to cover?

### 2. Unit Tests

Generate unit tests for modules that contain business logic:

**Game Logic Service:**
- Card dealing logic
- Card hierarchy comparisons
- Trick resolution
- Hand winner calculation
- Rule enforcement

**Bet Handler Service:**
- Bet validation (Envido, Truco, Flor)
- Bet progression (Retruco, Vale Cuatro)
- Stake calculations
- Acceptance/declining logic

**Score Manager Service:**
- Score updates
- Game end detection
- Falta Envido calculations

**Utilities:**
- Card shuffling
- Data transformations
- Validation functions

### 3. Integration Tests

Generate integration tests for inter-service communication:

**Service Integration:**
- Game flow with betting
- Session management with player connections
- State synchronization across services

**External Services:**
- Voice recognition API
- QR code generation
- Database operations (if applicable)

**WebSocket Communication:**
- Real-time state synchronization
- Connection/disconnection handling
- Message ordering

### 4. Test Structure

Follow the **Arrange-Act-Assert (AAA)** pattern:

```javascript
describe('ModuleName', () => {
  describe('functionName', () => {
    it('should [expected behavior] when [scenario]', () => {
      // Arrange: Set up test data and dependencies
      const input = createTestData()
      const expectedOutput = defineExpectation()

      // Act: Execute the function under test
      const result = functionName(input)

      // Assert: Verify the result
      expect(result).toBe(expectedOutput)
    })
  })
})
```

### 5. Test Naming

Use descriptive test names:

**Good:**
- `should calculate Envido score of 33 when holding 7 and 6 of same suit`
- `should award 2 points when Truco is accepted`
- `should reject bet when called out of sequence`

**Bad:**
- `test1`
- `it works`
- `should work correctly`

### 6. Edge Cases and Error Handling

Ensure tests cover:
- **Boundary conditions**: Empty inputs, maximum values, null/undefined
- **Error scenarios**: Invalid inputs, network failures, timeouts
- **Race conditions**: Concurrent operations
- **State transitions**: Invalid state changes

### 7. Mocking Dependencies

Mock external dependencies to isolate the unit under test:

```javascript
// Mock external service
const mockVoiceService = {
  recognize: jest.fn().mockResolvedValue({
    text: 'envido veintisiete',
    confidence: 0.9
  })
}

// Use mock in test
const result = await processor.processVoice(audioData, mockVoiceService)
```

### 8. Run Tests

After generating tests, run them to verify:

```bash
# Run all tests
npm test

# Run specific test file
npm test -- path/to/test.test.js

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

> Note: Actual commands depend on chosen tech stack

### 9. Verify Coverage

Check test coverage report:
- [ ] Overall coverage meets 80% minimum
- [ ] New code is covered
- [ ] Critical paths have 100% coverage
- [ ] No untested error paths

### 10. Review Test Quality

Ensure tests are:
- [ ] **Fast**: Each test runs in milliseconds
- [ ] **Independent**: Tests don't depend on each other
- [ ] **Repeatable**: Same results every time
- [ ] **Self-validating**: Clear pass/fail
- [ ] **Isolated**: No external dependencies

## Testing Specific Features

### Game Logic Tests

```javascript
// Example: Card hierarchy tests
describe('CardHierarchy', () => {
  it('should rank Ancho de Espadas as highest card', () => {
    const anchoEspadas = { rank: 1, suit: 'espadas' }
    const anchoBastos = { rank: 1, suit: 'bastos' }

    const result = compareCards(anchoEspadas, anchoBastos)

    expect(result).toBe(1) // anchoEspadas wins
  })
})
```

### Bet Handler Tests

```javascript
// Example: Envido calculation tests
describe('EnvidoCalculator', () => {
  it('should calculate 33 for 7 and 6 of same suit', () => {
    const cards = [
      { rank: 7, suit: 'espadas' },
      { rank: 6, suit: 'espadas' },
      { rank: 3, suit: 'bastos' }
    ]

    const score = calculateEnvido(cards)

    expect(score).toBe(33) // 7 + 6 + 20
  })
})
```

### Integration Tests

```javascript
// Example: Game flow integration test
describe('Game Flow Integration', () => {
  it('should complete Envido bet flow', async () => {
    const game = await createTestGame()

    // Player 1 calls Envido
    await game.callBet('envido', player1.id)

    // Player 2 accepts
    await game.respondToBet('accept', player2.id)

    // Verify scores calculated
    const scores = await game.getScores()
    expect(scores.teamA).toBeGreaterThan(0)
  })
})
```

## Regression Testing

For bug fixes:
1. Write a test that reproduces the bug (should fail)
2. Fix the bug
3. Verify the test now passes
4. Keep the test to prevent regression

## Test Documentation

- Comment complex test setups
- Explain non-obvious expectations
- Link to relevant documentation:
  - [TRUCO_RULES.md](docs/TRUCO_RULES.md) for game rules
  - [ARCHITECTURE.md](docs/ARCHITECTURE.md) for service interactions
  - [PRODUCT_SPECS.md](docs/PRODUCT_SPECS.md) for feature behavior

## Common Pitfalls to Avoid

❌ **Don't:**
- Test implementation details (test behavior, not internals)
- Use sleep/arbitrary waits (use proper async handling)
- Write tests that depend on execution order
- Test too many things in one test

✅ **Do:**
- Test observable behavior
- Use proper async/await or promise handling
- Keep tests independent
- One concept per test

## Output

After completing testing tasks, provide:

1. **Summary of Tests Added/Modified:**
   - Number of unit tests added
   - Number of integration tests added
   - Coverage percentage change

2. **Test Results:**
   - All tests passing?
   - Any failures that need attention?
   - Coverage report summary

3. **Gaps Identified:**
   - Untested edge cases
   - Areas needing integration tests
   - Coverage gaps

4. **Recommendations:**
   - Additional tests to consider
   - Refactoring opportunities for testability
   - Mocking strategies

## References

- [Testing Strategy](docs/TESTING_STRATEGY.md) - Comprehensive testing guidelines
- [Contributing Guide](CONTRIBUTING.md#testing-requirements) - Testing requirements
- [Architecture](docs/ARCHITECTURE.md) - Service boundaries for integration tests
