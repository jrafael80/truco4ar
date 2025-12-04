export interface Player {
  id: string;
  name: string;
  socketId: string;
  connected: boolean;
  joinedAt: Date;
}

export interface Room {
  id: string;
  code: string;
  players: Map<string, Player>;
  maxPlayers: number;
  createdAt: Date;
  lastActivityAt: Date;
  gameStarted: boolean;
}

export interface RoomCreationOptions {
  maxPlayers?: number;
}
