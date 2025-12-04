/**
 * Generates a random 6-character alphanumeric room code
 * using uppercase letters and numbers (excluding confusing characters)
 */
export function generateRoomCode(): string {
  // Exclude similar looking characters: 0, O, I, 1
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code = '';

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }

  return code;
}

/**
 * Validates if a room code matches the expected format
 */
export function isValidRoomCode(code: string): boolean {
  if (code.length !== 6) {
    return false;
  }

  const validCharsRegex = /^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{6}$/;
  return validCharsRegex.test(code);
}
