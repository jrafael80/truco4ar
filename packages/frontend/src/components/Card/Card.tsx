import { Card as CardType, Suit, Rank } from '@truco4ar/shared';
import './Card.css';

interface CardProps {
  card: CardType;
  onClick?: () => void;
  isPlayable?: boolean;
  isPlayed?: boolean;
  isFaceDown?: boolean;
}

const SUIT_SYMBOLS: Record<Suit, string> = {
  [Suit.ESPADAS]: '⚔️',
  [Suit.BASTOS]: '🏑',
  [Suit.OROS]: '🪙',
  [Suit.COPAS]: '🍷'
};

const SUIT_NAMES: Record<Suit, string> = {
  [Suit.ESPADAS]: 'Espadas',
  [Suit.BASTOS]: 'Bastos',
  [Suit.OROS]: 'Oros',
  [Suit.COPAS]: 'Copas'
};

const RANK_DISPLAY: Record<Rank, string> = {
  1: '1',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  10: '10',
  11: '11',
  12: '12'
};

export function Card({
  card,
  onClick,
  isPlayable = false,
  isPlayed = false,
  isFaceDown = false
}: CardProps) {
  const suitSymbol = SUIT_SYMBOLS[card.suit];
  const suitName = SUIT_NAMES[card.suit];
  const rankDisplay = RANK_DISPLAY[card.rank];

  const classNames = [
    'card',
    `card--${card.suit.toLowerCase()}`,
    isPlayable && 'card--playable',
    isPlayed && 'card--played',
    isFaceDown && 'card--face-down',
    onClick && 'card--clickable'
  ]
    .filter(Boolean)
    .join(' ');

  if (isFaceDown) {
    return (
      <div className={classNames} onClick={onClick}>
        <div className="card__back">
          <div className="card__back-pattern">🎴</div>
        </div>
      </div>
    );
  }

  return (
    <div className={classNames} onClick={onClick} role="button" tabIndex={isPlayable ? 0 : -1}>
      <div className="card__inner">
        <div className="card__rank">{rankDisplay}</div>
        <div className="card__suit" aria-label={suitName}>
          {suitSymbol}
        </div>
        <div className="card__rank card__rank--bottom">{rankDisplay}</div>
      </div>
    </div>
  );
}
