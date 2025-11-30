import { Card as CardType } from '@truco4ar/shared';
import { Card } from './Card';
import './Hand.css';

interface HandProps {
  cards: CardType[];
  onCardClick?: (card: CardType, index: number) => void;
  playableIndices?: number[];
  playedIndices?: number[];
  isFaceDown?: boolean;
}

export function Hand({
  cards,
  onCardClick,
  playableIndices = [],
  playedIndices = [],
  isFaceDown = false
}: HandProps) {
  const handleCardClick = (card: CardType, index: number) => {
    if (onCardClick && playableIndices.includes(index)) {
      onCardClick(card, index);
    }
  };

  return (
    <div className="hand" role="group" aria-label="Player hand">
      {cards.map((card, index) => (
        <div key={`${card.suit}-${card.rank}-${index}`} className="hand__card">
          <Card
            card={card}
            onClick={() => handleCardClick(card, index)}
            isPlayable={playableIndices.includes(index)}
            isPlayed={playedIndices.includes(index)}
            isFaceDown={isFaceDown}
          />
        </div>
      ))}
    </div>
  );
}
