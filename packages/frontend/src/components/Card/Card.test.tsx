import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Card } from './Card';
import { Suit, Rank } from '@truco4ar/shared';

describe('Card', () => {
  const mockCard = {
    suit: Suit.ESPADAS,
    rank: 1 as Rank
  };

  describe('Rendering', () => {
    it('renders the card with correct rank and suit', () => {
      render(<Card card={mockCard} />);
      expect(screen.getAllByText('1')[0]).toBeInTheDocument();
      expect(screen.getByLabelText('Espadas')).toBeInTheDocument();
    });

    it('renders all suits correctly', () => {
      const suits = [Suit.ESPADAS, Suit.BASTOS, Suit.OROS, Suit.COPAS];
      const suitNames = ['Espadas', 'Bastos', 'Oros', 'Copas'];

      suits.forEach((suit, index) => {
        const { unmount } = render(<Card card={{ suit, rank: 1 as Rank }} />);
        const suitName = suitNames[index];
        expect(suitName).toBeDefined();
        expect(screen.getByLabelText(suitName!)).toBeInTheDocument();
        unmount();
      });
    });

    it('renders all ranks correctly', () => {
      const ranks: Rank[] = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12];
      const rankDisplays = ['1', '2', '3', '4', '5', '6', '7', '10', '11', '12'];

      ranks.forEach((rank, index) => {
        const { unmount } = render(<Card card={{ suit: Suit.ESPADAS, rank }} />);
        const rankDisplay = rankDisplays[index];
        expect(rankDisplay).toBeDefined();
        const elements = screen.getAllByText(rankDisplay!);
        expect(elements[0]).toBeInTheDocument();
        unmount();
      });
    });

    it('renders face down card when isFaceDown is true', () => {
      render(<Card card={mockCard} isFaceDown={true} />);
      expect(screen.getByText('🎴')).toBeInTheDocument();
      expect(screen.queryByText('1')).not.toBeInTheDocument();
    });
  });

  describe('CSS Classes', () => {
    it('applies base card class', () => {
      const { container } = render(<Card card={mockCard} />);
      const cardElement = container.querySelector('.card');
      expect(cardElement).toBeInTheDocument();
    });

    it('applies suit-specific class', () => {
      const { container } = render(<Card card={mockCard} />);
      const cardElement = container.querySelector('.card--espadas');
      expect(cardElement).toBeInTheDocument();
    });

    it('applies playable class when isPlayable is true', () => {
      const { container } = render(<Card card={mockCard} isPlayable={true} />);
      const cardElement = container.querySelector('.card--playable');
      expect(cardElement).toBeInTheDocument();
    });

    it('applies played class when isPlayed is true', () => {
      const { container } = render(<Card card={mockCard} isPlayed={true} />);
      const cardElement = container.querySelector('.card--played');
      expect(cardElement).toBeInTheDocument();
    });

    it('applies face-down class when isFaceDown is true', () => {
      const { container } = render(<Card card={mockCard} isFaceDown={true} />);
      const cardElement = container.querySelector('.card--face-down');
      expect(cardElement).toBeInTheDocument();
    });

    it('applies clickable class when onClick is provided', () => {
      const { container } = render(<Card card={mockCard} onClick={() => {}} />);
      const cardElement = container.querySelector('.card--clickable');
      expect(cardElement).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('calls onClick when card is clicked', () => {
      const handleClick = vi.fn();
      render(<Card card={mockCard} onClick={handleClick} />);

      const cardElement = screen.getByRole('button');
      fireEvent.click(cardElement);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClick when face down card is clicked', () => {
      const handleClick = vi.fn();
      const { container } = render(<Card card={mockCard} isFaceDown={true} onClick={handleClick} />);

      const cardElement = container.querySelector('.card');
      if (cardElement) {
        fireEvent.click(cardElement);
      }

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('has button role even when onClick is not provided', () => {
      render(<Card card={mockCard} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('is keyboard accessible when playable', () => {
      render(<Card card={mockCard} isPlayable={true} />);
      const cardElement = screen.getByRole('button');
      expect(cardElement).toHaveAttribute('tabIndex', '0');
    });

    it('is not keyboard accessible when not playable', () => {
      render(<Card card={mockCard} isPlayable={false} onClick={() => {}} />);
      const cardElement = screen.getByRole('button');
      expect(cardElement).toHaveAttribute('tabIndex', '-1');
    });
  });

  describe('Accessibility', () => {
    it('has proper aria-label for suit', () => {
      render(<Card card={mockCard} />);
      expect(screen.getByLabelText('Espadas')).toBeInTheDocument();
    });

    it('has button role when interactive', () => {
      render(<Card card={mockCard} onClick={() => {}} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles all suit and rank combinations', () => {
      const suits = [Suit.ESPADAS, Suit.BASTOS, Suit.OROS, Suit.COPAS];
      const ranks: Rank[] = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12];

      suits.forEach((suit) => {
        ranks.forEach((rank) => {
          const { unmount } = render(<Card card={{ suit, rank }} />);
          expect(screen.getAllByText(rank.toString())[0]).toBeInTheDocument();
          unmount();
        });
      });
    });

    it('handles multiple state combinations', () => {
      const { container } = render(
        <Card card={mockCard} isPlayable={true} isPlayed={true} onClick={() => {}} />
      );

      const cardElement = container.querySelector('.card');
      expect(cardElement?.className).toContain('card--playable');
      expect(cardElement?.className).toContain('card--played');
      expect(cardElement?.className).toContain('card--clickable');
    });
  });
});
