import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PlayerList } from './PlayerList';

describe('PlayerList', () => {
  const mockPlayers = [
    {
      id: 'player1',
      name: 'Alice',
      teamId: 1,
      isDealer: true,
      hasPlayed: false
    },
    {
      id: 'player2',
      name: 'Bob',
      teamId: 2,
      isDealer: false,
      hasPlayed: true
    },
    {
      id: 'player3',
      name: 'Charlie',
      teamId: 1,
      isDealer: false,
      hasPlayed: false
    },
    {
      id: 'player4',
      name: 'Diana',
      teamId: 2,
      isDealer: false,
      hasPlayed: true
    }
  ];

  describe('Rendering', () => {
    it('renders all players', () => {
      render(<PlayerList players={mockPlayers} />);
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
      expect(screen.getByText('Charlie')).toBeInTheDocument();
      expect(screen.getByText('Diana')).toBeInTheDocument();
    });

    it('renders empty list when no players provided', () => {
      const { container } = render(<PlayerList players={[]} />);
      const listItems = container.querySelectorAll('.player-item');
      expect(listItems).toHaveLength(0);
    });

    it('has proper accessibility attributes', () => {
      render(<PlayerList players={mockPlayers} />);
      expect(screen.getByRole('list', { name: 'Players' })).toBeInTheDocument();
    });

    it('renders correct number of list items', () => {
      render(<PlayerList players={mockPlayers} />);
      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(4);
    });
  });

  describe('Team Display', () => {
    it('displays team numbers correctly', () => {
      render(<PlayerList players={mockPlayers} />);
      const team1Labels = screen.getAllByText('Equipo 1');
      const team2Labels = screen.getAllByText('Equipo 2');
      expect(team1Labels).toHaveLength(2);
      expect(team2Labels).toHaveLength(2);
    });

    it('handles players from different teams', () => {
      const mixedTeams = [
        { id: 'p1', name: 'Alice', teamId: 1 },
        { id: 'p2', name: 'Bob', teamId: 2 },
        { id: 'p3', name: 'Charlie', teamId: 3 }
      ];

      render(<PlayerList players={mixedTeams} />);
      expect(screen.getByText('Equipo 1')).toBeInTheDocument();
      expect(screen.getByText('Equipo 2')).toBeInTheDocument();
      expect(screen.getByText('Equipo 3')).toBeInTheDocument();
    });
  });

  describe('Dealer Indicator', () => {
    it('shows dealer indicator for dealer player', () => {
      render(<PlayerList players={mockPlayers} />);
      expect(screen.getByText('🎴 Mano')).toBeInTheDocument();
    });

    it('shows dealer indicator only for the dealer', () => {
      render(<PlayerList players={mockPlayers} />);
      const dealerIndicators = screen.getAllByText('🎴 Mano');
      expect(dealerIndicators).toHaveLength(1);
    });

    it('does not show dealer indicator when no dealer', () => {
      const noDealerPlayers = [
        { id: 'p1', name: 'Alice', teamId: 1, isDealer: false },
        { id: 'p2', name: 'Bob', teamId: 2, isDealer: false }
      ];

      render(<PlayerList players={noDealerPlayers} />);
      expect(screen.queryByText('🎴 Mano')).not.toBeInTheDocument();
    });
  });

  describe('Current Turn Indicator', () => {
    it('shows turn indicator for current player', () => {
      render(<PlayerList players={mockPlayers} currentPlayerId="player2" />);
      expect(screen.getByLabelText('Current turn')).toBeInTheDocument();
    });

    it('applies active class to current turn player', () => {
      const { container } = render(<PlayerList players={mockPlayers} currentPlayerId="player2" />);

      const playerItems = container.querySelectorAll('.player-item');
      expect(playerItems[0]).toBeDefined();
      expect(playerItems[1]).toBeDefined();
      expect(playerItems[1]!.className).toContain('player-item--active');
      expect(playerItems[0]!.className).not.toContain('player-item--active');
    });

    it('shows only one turn indicator at a time', () => {
      render(<PlayerList players={mockPlayers} currentPlayerId="player3" />);
      const turnIndicators = screen.getAllByLabelText('Current turn');
      expect(turnIndicators).toHaveLength(1);
    });

    it('does not show turn indicator when no current player', () => {
      render(<PlayerList players={mockPlayers} />);
      expect(screen.queryByLabelText('Current turn')).not.toBeInTheDocument();
    });
  });

  describe('Played Indicator', () => {
    it('shows played indicator for players who have played', () => {
      render(<PlayerList players={mockPlayers} />);
      const playedIndicators = screen.getAllByLabelText('Has played');
      expect(playedIndicators).toHaveLength(2);
    });

    it('does not show played indicator for players who have not played', () => {
      const noPlayedPlayers = [
        { id: 'p1', name: 'Alice', teamId: 1, hasPlayed: false },
        { id: 'p2', name: 'Bob', teamId: 2, hasPlayed: false }
      ];

      render(<PlayerList players={noPlayedPlayers} />);
      expect(screen.queryByLabelText('Has played')).not.toBeInTheDocument();
    });
  });

  describe('Current User Indicator', () => {
    it('shows (Tú) badge for current user', () => {
      render(<PlayerList players={mockPlayers} currentUserId="player1" />);
      expect(screen.getByText('(Tú)')).toBeInTheDocument();
    });

    it('applies current-user class to current user', () => {
      const { container } = render(<PlayerList players={mockPlayers} currentUserId="player1" />);

      const playerItems = container.querySelectorAll('.player-item');
      expect(playerItems[0]).toBeDefined();
      expect(playerItems[1]).toBeDefined();
      expect(playerItems[0]!.className).toContain('player-item--current-user');
      expect(playerItems[1]!.className).not.toContain('player-item--current-user');
    });

    it('shows only one (Tú) badge', () => {
      render(<PlayerList players={mockPlayers} currentUserId="player2" />);
      const badges = screen.getAllByText('(Tú)');
      expect(badges).toHaveLength(1);
    });

    it('does not show (Tú) badge when no current user', () => {
      render(<PlayerList players={mockPlayers} />);
      expect(screen.queryByText('(Tú)')).not.toBeInTheDocument();
    });
  });

  describe('Combined States', () => {
    it('shows both turn and current user indicators', () => {
      render(
        <PlayerList players={mockPlayers} currentPlayerId="player1" currentUserId="player1" />
      );
      expect(screen.getByText('(Tú)')).toBeInTheDocument();
      expect(screen.getByLabelText('Current turn')).toBeInTheDocument();
    });

    it('shows turn indicator and played indicator', () => {
      render(<PlayerList players={mockPlayers} currentPlayerId="player2" />);
      expect(screen.getByLabelText('Current turn')).toBeInTheDocument();
      expect(screen.getAllByLabelText('Has played')).toHaveLength(2);
    });

    it('shows dealer indicator with other indicators', () => {
      render(
        <PlayerList players={mockPlayers} currentPlayerId="player1" currentUserId="player1" />
      );
      expect(screen.getByText('🎴 Mano')).toBeInTheDocument();
      expect(screen.getByText('(Tú)')).toBeInTheDocument();
      expect(screen.getByLabelText('Current turn')).toBeInTheDocument();
    });
  });

  describe('Player Names', () => {
    it('handles special characters in names', () => {
      const specialNames = [
        { id: 'p1', name: 'José María', teamId: 1 },
        { id: 'p2', name: "O'Brien", teamId: 2 }
      ];

      render(<PlayerList players={specialNames} />);
      expect(screen.getByText('José María')).toBeInTheDocument();
      expect(screen.getByText("O'Brien")).toBeInTheDocument();
    });

    it('handles very long names', () => {
      const longName = [{ id: 'p1', name: 'Alexander Maximiliano Rodriguez Fernández', teamId: 1 }];

      render(<PlayerList players={longName} />);
      expect(screen.getByText('Alexander Maximiliano Rodriguez Fernández')).toBeInTheDocument();
    });

    it('handles short names', () => {
      const shortNames = [
        { id: 'p1', name: 'A', teamId: 1 },
        { id: 'p2', name: 'Bo', teamId: 2 }
      ];

      render(<PlayerList players={shortNames} />);
      expect(screen.getByText('A')).toBeInTheDocument();
      expect(screen.getByText('Bo')).toBeInTheDocument();
    });
  });

  describe('CSS Classes', () => {
    it('applies base player-list class', () => {
      const { container } = render(<PlayerList players={mockPlayers} />);
      expect(container.querySelector('.player-list')).toBeInTheDocument();
    });

    it('applies player-item class to each player', () => {
      const { container } = render(<PlayerList players={mockPlayers} />);
      const items = container.querySelectorAll('.player-item');
      expect(items).toHaveLength(4);
    });

    it('applies active class only to current turn player', () => {
      const { container } = render(<PlayerList players={mockPlayers} currentPlayerId="player2" />);

      const items = container.querySelectorAll('.player-item');
      expect(items[0]).toBeDefined();
      expect(items[1]).toBeDefined();
      expect(items[2]).toBeDefined();
      expect(items[3]).toBeDefined();
      expect(items[1]!.className).toContain('player-item--active');
      expect(items[0]!.className).not.toContain('player-item--active');
      expect(items[2]!.className).not.toContain('player-item--active');
      expect(items[3]!.className).not.toContain('player-item--active');
    });
  });

  describe('Edge Cases', () => {
    it('handles single player', () => {
      const firstPlayer = mockPlayers[0];
      expect(firstPlayer).toBeDefined();
      render(<PlayerList players={[firstPlayer!]} />);
      expect(screen.getByText('Alice')).toBeInTheDocument();
    });

    it('handles large number of players', () => {
      const manyPlayers = Array.from({ length: 10 }, (_, i) => ({
        id: `player${i}`,
        name: `Player ${i}`,
        teamId: (i % 2) + 1
      }));

      render(<PlayerList players={manyPlayers} />);
      const items = screen.getAllByRole('listitem');
      expect(items).toHaveLength(10);
    });

    it('handles player with undefined optional properties', () => {
      const minimalPlayer = [{ id: 'p1', name: 'Alice', teamId: 1 }];

      render(<PlayerList players={minimalPlayer} />);
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.queryByText('🎴 Mano')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Has played')).not.toBeInTheDocument();
    });

    it('handles non-existent currentPlayerId', () => {
      render(<PlayerList players={mockPlayers} currentPlayerId="nonexistent" />);
      expect(screen.queryByLabelText('Current turn')).not.toBeInTheDocument();
    });

    it('handles non-existent currentUserId', () => {
      render(<PlayerList players={mockPlayers} currentUserId="nonexistent" />);
      expect(screen.queryByText('(Tú)')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper list role', () => {
      render(<PlayerList players={mockPlayers} />);
      expect(screen.getByRole('list')).toBeInTheDocument();
    });

    it('has proper listitem roles', () => {
      render(<PlayerList players={mockPlayers} />);
      const items = screen.getAllByRole('listitem');
      expect(items).toHaveLength(4);
    });

    it('has descriptive aria-labels for indicators', () => {
      render(<PlayerList players={mockPlayers} currentPlayerId="player1" />);
      expect(screen.getByLabelText('Current turn')).toBeInTheDocument();
      expect(screen.getAllByLabelText('Has played')).toHaveLength(2);
    });
  });
});
