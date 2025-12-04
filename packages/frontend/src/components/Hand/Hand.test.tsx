import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Hand } from './Hand';
import { Suit, Rank, Card } from '@truco4ar/shared';

describe('Hand', () => {
  const mockCards: Card[] = [
    { suit: Suit.ESPADAS, rank: 1 as Rank },
    { suit: Suit.BASTOS, rank: 7 as Rank },
    { suit: Suit.OROS, rank: 12 as Rank }
  ];

  describe('Rendering', () => {
    it('renders all cards in the hand', () => {
      render(<Hand cards={mockCards} />);
      expect(screen.getAllByText('1')).toHaveLength(2); // Rank appears twice on card
      expect(screen.getAllByText('7')).toHaveLength(2);
      expect(screen.getAllByText('12')).toHaveLength(2);
    });

    it('renders empty hand when no cards provided', () => {
      const { container } = render(<Hand cards={[]} />);
      const hand = container.querySelector('.hand');
      expect(hand?.children).toHaveLength(0);
    });

    it('renders correct number of cards', () => {
      const { container } = render(<Hand cards={mockCards} />);
      const cards = container.querySelectorAll('.hand__card');
      expect(cards).toHaveLength(3);
    });

    it('renders face down cards when isFaceDown is true', () => {
      render(<Hand cards={mockCards} isFaceDown={true} />);
      expect(screen.getAllByText('🎴')).toHaveLength(3);
      expect(screen.queryByText('1')).not.toBeInTheDocument();
    });

    it('has proper accessibility attributes', () => {
      render(<Hand cards={mockCards} />);
      expect(screen.getByRole('group', { name: 'Player hand' })).toBeInTheDocument();
    });
  });

  describe('Card Interactions', () => {
    it('calls onCardClick with correct card and index when playable card is clicked', () => {
      const handleClick = vi.fn();
      render(<Hand cards={mockCards} onCardClick={handleClick} playableIndices={[0, 2]} />);

      const cards = screen.getAllByRole('button');
      expect(cards[0]).toBeDefined();
      fireEvent.click(cards[0]!);

      expect(handleClick).toHaveBeenCalledTimes(1);
      expect(handleClick).toHaveBeenCalledWith(mockCards[0], 0);
    });

    it('does not call onCardClick when non-playable card is clicked', () => {
      const handleClick = vi.fn();
      render(<Hand cards={mockCards} onCardClick={handleClick} playableIndices={[0]} />);

      const cards = screen.getAllByRole('button');
      expect(cards[1]).toBeDefined();
      fireEvent.click(cards[1]!); // Click second card which is not playable

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('handles multiple card clicks correctly', () => {
      const handleClick = vi.fn();
      render(<Hand cards={mockCards} onCardClick={handleClick} playableIndices={[0, 1, 2]} />);

      const cards = screen.getAllByRole('button');
      expect(cards[0]).toBeDefined();
      expect(cards[2]).toBeDefined();
      fireEvent.click(cards[0]!);
      fireEvent.click(cards[2]!);

      expect(handleClick).toHaveBeenCalledTimes(2);
      expect(handleClick).toHaveBeenNthCalledWith(1, mockCards[0], 0);
      expect(handleClick).toHaveBeenNthCalledWith(2, mockCards[2], 2);
    });

    it('does not call onCardClick when handler is not provided', () => {
      const { container } = render(<Hand cards={mockCards} playableIndices={[0, 1, 2]} />);
      const cards = container.querySelectorAll('.hand__card');

      expect(cards[0]).toBeDefined();
      fireEvent.click(cards[0]!);

      // Should not throw error
      expect(cards).toHaveLength(3);
    });
  });

  describe('Playable State', () => {
    it('marks correct cards as playable', () => {
      const { container } = render(<Hand cards={mockCards} playableIndices={[0, 2]} />);

      const cards = container.querySelectorAll('.hand__card .card');
      expect(cards[0]).toBeDefined();
      expect(cards[1]).toBeDefined();
      expect(cards[2]).toBeDefined();
      expect(cards[0]!.className).toContain('card--playable');
      expect(cards[1]!.className).not.toContain('card--playable');
      expect(cards[2]!.className).toContain('card--playable');
    });

    it('handles empty playableIndices array', () => {
      const { container } = render(<Hand cards={mockCards} playableIndices={[]} />);

      const cards = container.querySelectorAll('.hand__card .card');
      cards.forEach((card) => {
        expect(card.className).not.toContain('card--playable');
      });
    });

    it('handles all cards being playable', () => {
      const { container } = render(<Hand cards={mockCards} playableIndices={[0, 1, 2]} />);

      const cards = container.querySelectorAll('.hand__card .card');
      cards.forEach((card) => {
        expect(card.className).toContain('card--playable');
      });
    });
  });

  describe('Played State', () => {
    it('marks correct cards as played', () => {
      const { container } = render(<Hand cards={mockCards} playedIndices={[1]} />);

      const cards = container.querySelectorAll('.hand__card .card');
      expect(cards[0]).toBeDefined();
      expect(cards[1]).toBeDefined();
      expect(cards[2]).toBeDefined();
      expect(cards[0]!.className).not.toContain('card--played');
      expect(cards[1]!.className).toContain('card--played');
      expect(cards[2]!.className).not.toContain('card--played');
    });

    it('handles multiple played cards', () => {
      const { container } = render(<Hand cards={mockCards} playedIndices={[0, 2]} />);

      const cards = container.querySelectorAll('.hand__card .card');
      expect(cards[0]).toBeDefined();
      expect(cards[1]).toBeDefined();
      expect(cards[2]).toBeDefined();
      expect(cards[0]!.className).toContain('card--played');
      expect(cards[1]!.className).not.toContain('card--played');
      expect(cards[2]!.className).toContain('card--played');
    });

    it('handles cards that are both playable and played', () => {
      const { container } = render(
        <Hand cards={mockCards} playableIndices={[0]} playedIndices={[0]} />
      );

      const cards = container.querySelectorAll('.hand__card .card');
      expect(cards[0]).toBeDefined();
      expect(cards[0]!.className).toContain('card--playable');
      expect(cards[0]!.className).toContain('card--played');
    });
  });

  describe('Card Keys', () => {
    it('generates unique keys for each card', () => {
      const { container } = render(<Hand cards={mockCards} />);
      const cards = container.querySelectorAll('.hand__card');

      expect(cards[0]).toBeDefined();
      expect(cards[1]).toBeDefined();
      expect(cards[2]).toBeDefined();
      expect(cards[0]!.querySelector('.card')).toBeInTheDocument();
      expect(cards[1]!.querySelector('.card')).toBeInTheDocument();
      expect(cards[2]!.querySelector('.card')).toBeInTheDocument();
    });

    it('handles duplicate cards with different indices', () => {
      const duplicateCards: Card[] = [
        { suit: Suit.ESPADAS, rank: 1 as Rank },
        { suit: Suit.ESPADAS, rank: 1 as Rank }
      ];

      const { container } = render(<Hand cards={duplicateCards} />);
      const cards = container.querySelectorAll('.hand__card');

      expect(cards).toHaveLength(2);
    });
  });

  describe('Edge Cases', () => {
    it('handles single card hand', () => {
      const firstCard = mockCards[0];
      expect(firstCard).toBeDefined();
      render(<Hand cards={[firstCard!]} />);
      expect(screen.getAllByText('1')).toHaveLength(2); // Rank appears twice
    });

    it('handles large hand (more than 3 cards)', () => {
      const largeHand: Card[] = [
        { suit: Suit.ESPADAS, rank: 1 as Rank },
        { suit: Suit.BASTOS, rank: 2 as Rank },
        { suit: Suit.OROS, rank: 3 as Rank },
        { suit: Suit.COPAS, rank: 4 as Rank },
        { suit: Suit.ESPADAS, rank: 5 as Rank }
      ];

      const { container } = render(<Hand cards={largeHand} />);
      expect(container.querySelectorAll('.hand__card')).toHaveLength(5);
    });

    it('handles out of range playableIndices gracefully', () => {
      const { container } = render(<Hand cards={mockCards} playableIndices={[0, 10, 20]} />);

      const cards = container.querySelectorAll('.hand__card .card');
      expect(cards[0]).toBeDefined();
      expect(cards[1]).toBeDefined();
      expect(cards[2]).toBeDefined();
      expect(cards[0]!.className).toContain('card--playable');
      expect(cards[1]!.className).not.toContain('card--playable');
      expect(cards[2]!.className).not.toContain('card--playable');
    });

    it('handles negative playableIndices gracefully', () => {
      const { container } = render(<Hand cards={mockCards} playableIndices={[-1, 0]} />);

      const cards = container.querySelectorAll('.hand__card .card');
      expect(cards[0]).toBeDefined();
      expect(cards[0]!.className).toContain('card--playable');
    });
  });

  describe('Face Down Mode', () => {
    it('renders all cards face down when isFaceDown is true', () => {
      render(<Hand cards={mockCards} isFaceDown={true} />);

      const backPatterns = screen.getAllByText('🎴');
      expect(backPatterns).toHaveLength(3);
    });

    it('ignores playable state when face down', () => {
      const { container } = render(
        <Hand cards={mockCards} isFaceDown={true} playableIndices={[0, 1, 2]} />
      );

      const cards = container.querySelectorAll('.hand__card .card');
      cards.forEach((card) => {
        expect(card.className).toContain('card--face-down');
      });
    });
  });
});
