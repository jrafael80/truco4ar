import { describe, it, expect } from '@jest/globals';
import { generateRoomCode, isValidRoomCode } from './roomCode';

describe('roomCode', () => {
  describe('generateRoomCode', () => {
    it('generates a 6-character code', () => {
      const code = generateRoomCode();
      expect(code).toHaveLength(6);
    });

    it('generates uppercase alphanumeric codes', () => {
      const code = generateRoomCode();
      expect(code).toMatch(/^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{6}$/);
    });

    it('excludes confusing characters (0, O, I, 1)', () => {
      // Generate many codes to check pattern
      for (let i = 0; i < 100; i++) {
        const code = generateRoomCode();
        expect(code).not.toContain('0');
        expect(code).not.toContain('O');
        expect(code).not.toContain('I');
        expect(code).not.toContain('1');
      }
    });

    it('generates unique codes (statistically)', () => {
      const codes = new Set<string>();
      const iterations = 1000;

      for (let i = 0; i < iterations; i++) {
        codes.add(generateRoomCode());
      }

      // With 31 possible characters and 6 positions, collisions should be rare
      // Expect at least 95% unique codes
      expect(codes.size).toBeGreaterThan(iterations * 0.95);
    });
  });

  describe('isValidRoomCode', () => {
    it('validates correct room codes', () => {
      expect(isValidRoomCode('ABC234')).toBe(true);
      expect(isValidRoomCode('XYZ789')).toBe(true);
      expect(isValidRoomCode('2A3B4C')).toBe(true);
    });

    it('rejects codes with wrong length', () => {
      expect(isValidRoomCode('ABC12')).toBe(false);
      expect(isValidRoomCode('ABC1234')).toBe(false);
      expect(isValidRoomCode('')).toBe(false);
    });

    it('rejects codes with invalid characters', () => {
      expect(isValidRoomCode('ABC01O')).toBe(false); // Contains 0, O, 1
      expect(isValidRoomCode('ABCDEF')).toBe(true); // All valid
      expect(isValidRoomCode('ABC!@#')).toBe(false); // Special characters
      expect(isValidRoomCode('abc123')).toBe(false); // Lowercase
    });

    it('rejects codes with spaces', () => {
      expect(isValidRoomCode('ABC 123')).toBe(false);
      expect(isValidRoomCode(' ABC123')).toBe(false);
      expect(isValidRoomCode('ABC123 ')).toBe(false);
    });
  });
});
