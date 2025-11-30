/**
 * @truco4ar/shared - Shared game logic and types
 *
 * This package contains the core game logic for Truco4AR,
 * independent of any specific backend or frontend implementation.
 */

// Types
export * from './types/card';
export * from './types/player';
export * from './types/game-state';
export * from './types/betting';
export * from './types/game-config';

// Game Logic
export * from './game/card-hierarchy';
export * from './game/deck';
export * from './game/game-setup';
export * from './game/trick-resolution';
export * from './game/envido';
export * from './game/bet-validation';
