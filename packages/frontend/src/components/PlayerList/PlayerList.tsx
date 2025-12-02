import './PlayerList.css';

interface Player {
  id: string;
  name: string;
  teamId: number;
  isDealer?: boolean;
  hasPlayed?: boolean;
}

interface PlayerListProps {
  players: Player[];
  currentPlayerId?: string;
  currentUserId?: string;
}

export function PlayerList({ players, currentPlayerId, currentUserId }: PlayerListProps) {
  return (
    <div className="player-list" role="list" aria-label="Players">
      {players.map(player => {
        const isCurrentTurn = player.id === currentPlayerId;
        const isCurrentUser = player.id === currentUserId;

        return (
          <div
            key={player.id}
            className={`player-item ${isCurrentTurn ? 'player-item--active' : ''} ${isCurrentUser ? 'player-item--current-user' : ''}`}
            role="listitem"
          >
            <div className="player-item__content">
              <div className="player-item__name">
                {player.name}
                {isCurrentUser && <span className="player-item__badge">(Tú)</span>}
              </div>
              <div className="player-item__info">
                <span className="player-item__team">Equipo {player.teamId}</span>
                {player.isDealer && <span className="player-item__dealer">🎴 Mano</span>}
              </div>
            </div>
            <div className="player-item__indicators">
              {isCurrentTurn && (
                <div className="player-item__turn-indicator" aria-label="Current turn">
                  ▶
                </div>
              )}
              {player.hasPlayed && (
                <div className="player-item__played-indicator" aria-label="Has played">
                  ✓
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
