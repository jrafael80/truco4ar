import { Card as CardType } from '@truco4ar/shared';
import { Card } from './Card';
import './Table.css';

interface PlayedCard {
  card: CardType;
  playerId: string;
  playerName: string;
}

interface TableProps {
  playedCards: PlayedCard[];
  maxPlayers?: number;
}

export function Table({ playedCards, maxPlayers = 4 }: TableProps) {
  // Create positions for cards based on max players (2, 4, or 6)
  const positions = Array.from({ length: maxPlayers }, (_, i) => i);

  return (
    <div className={`table table--${maxPlayers}-players`} role="region" aria-label="Played cards">
      <div className="table__center">
        {positions.map(position => {
          const playedCard = playedCards.find((_pc, index) => index === position);

          return (
            <div key={position} className={`table__position table__position--${position}`}>
              {playedCard ? (
                <div className="table__card-wrapper">
                  <Card card={playedCard.card} />
                  <div className="table__player-label">{playedCard.playerName}</div>
                </div>
              ) : (
                <div className="table__placeholder" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
