import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Table } from './Table';
import { Suit, Rank } from '@truco4ar/shared';

describe('Table', () => {
  const mockPlayedCards = [
    {
      card: { suit: Suit.ESPADAS, rank: 1 as Rank },
      playerId: 'player1',
      playerName: 'Alice'
    },
    {
      card: { suit: Suit.BASTOS, rank: 7 as Rank },
      playerId: 'player2',
      playerName: 'Bob'
    }
  ];

  describe('Rendering', () => {
    it('renders the table with correct aria-label', () => {
      render(<Table playedCards={[]} />);
      expect(screen.getByRole('region', { name: 'Played cards' })).toBeInTheDocument();
    });

    it('renders played cards with player names', () => {
      render(<Table playedCards={mockPlayedCards} />);
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
    });

    it('renders cards with correct suits and ranks', () => {
      render(<Table playedCards={mockPlayedCards} />);
      expect(screen.getAllByText('1')).toHaveLength(2); // Rank appears twice on card
      expect(screen.getAllByText('7')).toHaveLength(2);
    });

    it('renders empty table when no cards are played', () => {
      const { container } = render(<Table playedCards={[]} />);
      const placeholders = container.querySelectorAll('.table__placeholder');
      expect(placeholders).toHaveLength(4); // Default 4 player positions
    });
  });

  describe('Player Count Configurations', () => {
    it('renders 2 player positions when maxPlayers is 2', () => {
      const { container } = render(<Table playedCards={[]} maxPlayers={2} />);
      const positions = container.querySelectorAll('.table__position');
      expect(positions).toHaveLength(2);
      expect(container.querySelector('.table--2-players')).toBeInTheDocument();
    });

    it('renders 4 player positions by default', () => {
      const { container } = render(<Table playedCards={[]} />);
      const positions = container.querySelectorAll('.table__position');
      expect(positions).toHaveLength(4);
      expect(container.querySelector('.table--4-players')).toBeInTheDocument();
    });

    it('renders 4 player positions when maxPlayers is 4', () => {
      const { container } = render(<Table playedCards={[]} maxPlayers={4} />);
      const positions = container.querySelectorAll('.table__position');
      expect(positions).toHaveLength(4);
    });

    it('renders 6 player positions when maxPlayers is 6', () => {
      const { container } = render(<Table playedCards={[]} maxPlayers={6} />);
      const positions = container.querySelectorAll('.table__position');
      expect(positions).toHaveLength(6);
      expect(container.querySelector('.table--6-players')).toBeInTheDocument();
    });
  });

  describe('Card Positioning', () => {
    it('places cards in correct positions based on array order', () => {
      const { container } = render(<Table playedCards={mockPlayedCards} maxPlayers={4} />);

      const positions = container.querySelectorAll('.table__position');
      const firstPosition = positions[0];
      const secondPosition = positions[1];

      expect(firstPosition).toBeDefined();
      expect(secondPosition).toBeDefined();
      expect(firstPosition!.querySelector('.table__player-label')?.textContent).toBe('Alice');
      expect(secondPosition!.querySelector('.table__player-label')?.textContent).toBe('Bob');
    });

    it('shows placeholders for empty positions', () => {
      const firstCard = mockPlayedCards[0];
      expect(firstCard).toBeDefined();
      const { container } = render(<Table playedCards={[firstCard!]} maxPlayers={4} />);

      const placeholders = container.querySelectorAll('.table__placeholder');
      expect(placeholders).toHaveLength(3);

      const cardWrappers = container.querySelectorAll('.table__card-wrapper');
      expect(cardWrappers).toHaveLength(1);
    });

    it('assigns correct position classes', () => {
      const { container } = render(<Table playedCards={[]} maxPlayers={4} />);

      expect(container.querySelector('.table__position--0')).toBeInTheDocument();
      expect(container.querySelector('.table__position--1')).toBeInTheDocument();
      expect(container.querySelector('.table__position--2')).toBeInTheDocument();
      expect(container.querySelector('.table__position--3')).toBeInTheDocument();
    });
  });

  describe('Card Display', () => {
    it('renders each card in a wrapper with player label', () => {
      const { container } = render(<Table playedCards={mockPlayedCards} />);

      const wrappers = container.querySelectorAll('.table__card-wrapper');
      expect(wrappers).toHaveLength(2);

      expect(wrappers[0]).toBeDefined();
      expect(wrappers[1]).toBeDefined();
      expect(wrappers[0]!.querySelector('.table__player-label')).toBeInTheDocument();
      expect(wrappers[1]!.querySelector('.table__player-label')).toBeInTheDocument();
    });

    it('renders card component inside wrapper', () => {
      const { container } = render(<Table playedCards={mockPlayedCards} />);

      const wrappers = container.querySelectorAll('.table__card-wrapper');
      expect(wrappers[0]).toBeDefined();
      expect(wrappers[1]).toBeDefined();
      expect(wrappers[0]!.querySelector('.card')).toBeInTheDocument();
      expect(wrappers[1]!.querySelector('.card')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles single played card', () => {
      const firstCard = mockPlayedCards[0];
      expect(firstCard).toBeDefined();
      render(<Table playedCards={[firstCard!]} />);
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.queryByText('Bob')).not.toBeInTheDocument();
    });

    it('handles maximum cards for player count', () => {
      const card0 = mockPlayedCards[0];
      const card1 = mockPlayedCards[1];
      expect(card0).toBeDefined();
      expect(card1).toBeDefined();
      const fourCards = [
        card0!,
        card1!,
        { card: { suit: Suit.OROS, rank: 12 as Rank }, playerId: 'p3', playerName: 'Charlie' },
        { card: { suit: Suit.COPAS, rank: 5 as Rank }, playerId: 'p4', playerName: 'Diana' }
      ];

      render(<Table playedCards={fourCards} maxPlayers={4} />);
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
      expect(screen.getByText('Charlie')).toBeInTheDocument();
      expect(screen.getByText('Diana')).toBeInTheDocument();
    });

    it('handles empty playedCards array', () => {
      const { container } = render(<Table playedCards={[]} />);
      const placeholders = container.querySelectorAll('.table__placeholder');
      expect(placeholders.length).toBeGreaterThan(0);
    });

    it('handles cards with special characters in player names', () => {
      const specialCards = [
        {
          card: { suit: Suit.ESPADAS, rank: 1 as Rank },
          playerId: 'p1',
          playerName: 'José María'
        },
        {
          card: { suit: Suit.BASTOS, rank: 2 as Rank },
          playerId: 'p2',
          playerName: "O'Brien"
        }
      ];

      render(<Table playedCards={specialCards} />);
      expect(screen.getByText('José María')).toBeInTheDocument();
      expect(screen.getByText("O'Brien")).toBeInTheDocument();
    });

    it('handles very long player names', () => {
      const longNameCards = [
        {
          card: { suit: Suit.ESPADAS, rank: 1 as Rank },
          playerId: 'p1',
          playerName: 'Alexander Maximiliano Rodriguez'
        }
      ];

      render(<Table playedCards={longNameCards} />);
      expect(screen.getByText('Alexander Maximiliano Rodriguez')).toBeInTheDocument();
    });
  });

  describe('CSS Classes', () => {
    it('applies correct table class', () => {
      const { container } = render(<Table playedCards={[]} />);
      expect(container.querySelector('.table')).toBeInTheDocument();
    });

    it('applies correct player count class', () => {
      const { container } = render(<Table playedCards={[]} maxPlayers={4} />);
      expect(container.querySelector('.table--4-players')).toBeInTheDocument();
    });

    it('has table center container', () => {
      const { container } = render(<Table playedCards={[]} />);
      expect(container.querySelector('.table__center')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper region role', () => {
      render(<Table playedCards={[]} />);
      expect(screen.getByRole('region')).toBeInTheDocument();
    });

    it('has descriptive aria-label', () => {
      render(<Table playedCards={[]} />);
      expect(screen.getByLabelText('Played cards')).toBeInTheDocument();
    });
  });

  describe('Player Names', () => {
    it('displays all unique player names', () => {
      const uniquePlayers = [
        { card: { suit: Suit.ESPADAS, rank: 1 as Rank }, playerId: 'p1', playerName: 'Alice' },
        { card: { suit: Suit.BASTOS, rank: 2 as Rank }, playerId: 'p2', playerName: 'Bob' },
        { card: { suit: Suit.OROS, rank: 3 as Rank }, playerId: 'p3', playerName: 'Charlie' }
      ];

      render(<Table playedCards={uniquePlayers} />);
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
      expect(screen.getByText('Charlie')).toBeInTheDocument();
    });

    it('handles duplicate player names', () => {
      const duplicatePlayers = [
        { card: { suit: Suit.ESPADAS, rank: 1 as Rank }, playerId: 'p1', playerName: 'Alice' },
        { card: { suit: Suit.BASTOS, rank: 2 as Rank }, playerId: 'p2', playerName: 'Alice' }
      ];

      render(<Table playedCards={duplicatePlayers} />);
      const aliceLabels = screen.getAllByText('Alice');
      expect(aliceLabels).toHaveLength(2);
    });
  });
});
