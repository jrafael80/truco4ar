import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Score } from './Score';

describe('Score', () => {
  const mockTeams = [
    {
      teamId: 1,
      score: 15,
      buenas: 2,
      malas: 1
    },
    {
      teamId: 2,
      score: 10,
      buenas: 1,
      malas: 0
    }
  ];

  describe('Rendering', () => {
    it('renders the score component', () => {
      render(<Score teams={mockTeams} />);
      expect(screen.getByRole('region', { name: 'Game score' })).toBeInTheDocument();
    });

    it('renders the title', () => {
      render(<Score teams={mockTeams} />);
      expect(screen.getByText('Puntaje')).toBeInTheDocument();
    });

    it('renders target score with default value', () => {
      render(<Score teams={mockTeams} />);
      expect(screen.getByText('A 30 puntos')).toBeInTheDocument();
    });

    it('renders custom target score', () => {
      render(<Score teams={mockTeams} targetScore={15} />);
      expect(screen.getByText('A 15 puntos')).toBeInTheDocument();
    });

    it('renders all teams', () => {
      render(<Score teams={mockTeams} />);
      expect(screen.getByText('Equipo 1')).toBeInTheDocument();
      expect(screen.getByText('Equipo 2')).toBeInTheDocument();
    });

    it('renders team scores', () => {
      render(<Score teams={mockTeams} />);
      expect(screen.getByText('15')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
    });
  });

  describe('Progress Bars', () => {
    it('renders progress bars for each team', () => {
      render(<Score teams={mockTeams} />);
      const progressBars = screen.getAllByRole('progressbar');
      expect(progressBars).toHaveLength(2);
    });

    it('sets correct aria attributes on progress bars', () => {
      render(<Score teams={mockTeams} targetScore={30} />);
      const progressBars = screen.getAllByRole('progressbar');

      expect(progressBars[0]).toHaveAttribute('aria-valuenow', '15');
      expect(progressBars[0]).toHaveAttribute('aria-valuemin', '0');
      expect(progressBars[0]).toHaveAttribute('aria-valuemax', '30');

      expect(progressBars[1]).toHaveAttribute('aria-valuenow', '10');
      expect(progressBars[1]).toHaveAttribute('aria-valuemin', '0');
      expect(progressBars[1]).toHaveAttribute('aria-valuemax', '30');
    });

    it('calculates correct percentage for progress bars', () => {
      render(<Score teams={mockTeams} targetScore={30} />);
      const progressBars = screen.getAllByRole('progressbar');

      // Team 1: 15/30 = 50%
      expect(progressBars[0]).toHaveStyle({ width: '50%' });

      // Team 2: 10/30 = 33.33%
      expect(progressBars[1]).toHaveStyle({ width: '33.33333333333333%' });
    });

    it('caps progress at 100% when score exceeds target', () => {
      const overTargetTeams = [
        { teamId: 1, score: 35 },
        { teamId: 2, score: 40 }
      ];

      render(<Score teams={overTargetTeams} targetScore={30} />);
      const progressBars = screen.getAllByRole('progressbar');

      expect(progressBars[0]).toHaveStyle({ width: '100%' });
      expect(progressBars[1]).toHaveStyle({ width: '100%' });
    });
  });

  describe('Winning Team Indicator', () => {
    it('applies winning class to team with highest score', () => {
      const { container } = render(<Score teams={mockTeams} />);
      const teamElements = container.querySelectorAll('.score__team');

      expect(teamElements[0]).toBeDefined();
      expect(teamElements[1]).toBeDefined();
      expect(teamElements[0]!.className).toContain('score__team--winning');
      expect(teamElements[1]!.className).not.toContain('score__team--winning');
    });

    it('applies winning class to both teams when tied', () => {
      const tiedTeams = [
        { teamId: 1, score: 15 },
        { teamId: 2, score: 15 }
      ];

      const { container } = render(<Score teams={tiedTeams} />);
      const teamElements = container.querySelectorAll('.score__team');

      expect(teamElements[0]).toBeDefined();
      expect(teamElements[1]).toBeDefined();
      expect(teamElements[0]!.className).toContain('score__team--winning');
      expect(teamElements[1]!.className).toContain('score__team--winning');
    });

    it('handles single team correctly', () => {
      const singleTeam = [{ teamId: 1, score: 10 }];

      const { container } = render(<Score teams={singleTeam} />);
      const teamElement = container.querySelector('.score__team');

      expect(teamElement?.className).toContain('score__team--winning');
    });
  });

  describe('Buenas and Malas Display', () => {
    it('displays buenas when present and greater than 0', () => {
      render(<Score teams={mockTeams} />);
      expect(screen.getByText('Buenas: 2')).toBeInTheDocument();
      expect(screen.getByText('Buenas: 1')).toBeInTheDocument();
    });

    it('displays malas when present and greater than 0', () => {
      render(<Score teams={mockTeams} />);
      expect(screen.getByText('Malas: 1')).toBeInTheDocument();
    });

    it('does not display malas when value is 0', () => {
      render(<Score teams={mockTeams} />);
      const malasElements = screen.queryAllByText(/Malas: 0/);
      expect(malasElements).toHaveLength(0);
    });

    it('does not display buenas or malas when undefined', () => {
      const teamsWithoutDetails = [
        { teamId: 1, score: 15 },
        { teamId: 2, score: 10 }
      ];

      render(<Score teams={teamsWithoutDetails} />);
      expect(screen.queryByText(/Buenas:/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Malas:/)).not.toBeInTheDocument();
    });

    it('displays both buenas and malas when both present', () => {
      const teamsWithBoth = [
        { teamId: 1, score: 15, buenas: 3, malas: 2 }
      ];

      render(<Score teams={teamsWithBoth} />);
      expect(screen.getByText('Buenas: 3')).toBeInTheDocument();
      expect(screen.getByText('Malas: 2')).toBeInTheDocument();
    });

    it('displays empty details section when buenas is 0 (still renders section)', () => {
      const teamsWithZeroBuenas = [
        { teamId: 1, score: 15, buenas: 0 }
      ];

      const { container } = render(<Score teams={teamsWithZeroBuenas} />);
      // The section renders but no content inside since buenas=0 doesn't show
      expect(container.querySelector('.score__details')).toBeInTheDocument();
      expect(screen.queryByText(/Buenas:/)).not.toBeInTheDocument();
    });
  });

  describe('Multiple Teams', () => {
    it('handles 3 teams', () => {
      const threeTeams = [
        { teamId: 1, score: 15 },
        { teamId: 2, score: 10 },
        { teamId: 3, score: 20 }
      ];

      render(<Score teams={threeTeams} />);
      expect(screen.getByText('Equipo 1')).toBeInTheDocument();
      expect(screen.getByText('Equipo 2')).toBeInTheDocument();
      expect(screen.getByText('Equipo 3')).toBeInTheDocument();
    });

    it('identifies correct winner among multiple teams', () => {
      const multipleTeams = [
        { teamId: 1, score: 15 },
        { teamId: 2, score: 25 },
        { teamId: 3, score: 10 }
      ];

      const { container } = render(<Score teams={multipleTeams} />);
      const teamElements = container.querySelectorAll('.score__team');

      expect(teamElements[0]).toBeDefined();
      expect(teamElements[1]).toBeDefined();
      expect(teamElements[2]).toBeDefined();
      expect(teamElements[0]!.className).not.toContain('score__team--winning');
      expect(teamElements[1]!.className).toContain('score__team--winning');
      expect(teamElements[2]!.className).not.toContain('score__team--winning');
    });
  });

  describe('Edge Cases', () => {
    it('handles zero scores', () => {
      const zeroScoreTeams = [
        { teamId: 1, score: 0 },
        { teamId: 2, score: 0 }
      ];

      render(<Score teams={zeroScoreTeams} />);
      expect(screen.getAllByText('0')).toHaveLength(2);

      const progressBars = screen.getAllByRole('progressbar');
      expect(progressBars[0]).toHaveStyle({ width: '0%' });
      expect(progressBars[1]).toHaveStyle({ width: '0%' });
    });

    it('handles very high scores', () => {
      const highScoreTeams = [
        { teamId: 1, score: 999 },
        { teamId: 2, score: 888 }
      ];

      render(<Score teams={highScoreTeams} targetScore={30} />);
      expect(screen.getByText('999')).toBeInTheDocument();
      expect(screen.getByText('888')).toBeInTheDocument();

      const progressBars = screen.getAllByRole('progressbar');
      expect(progressBars[0]).toHaveStyle({ width: '100%' });
      expect(progressBars[1]).toHaveStyle({ width: '100%' });
    });

    it('handles single team', () => {
      const singleTeam = [{ teamId: 1, score: 10 }];

      render(<Score teams={singleTeam} />);
      expect(screen.getByText('Equipo 1')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
    });

    it('handles empty teams array', () => {
      const { container } = render(<Score teams={[]} />);
      const teamElements = container.querySelectorAll('.score__team');
      expect(teamElements).toHaveLength(0);
    });

    it('handles very small target score', () => {
      render(<Score teams={mockTeams} targetScore={1} />);
      expect(screen.getByText('A 1 puntos')).toBeInTheDocument();

      const progressBars = screen.getAllByRole('progressbar');
      expect(progressBars[0]).toHaveStyle({ width: '100%' });
    });

    it('handles very large target score', () => {
      render(<Score teams={mockTeams} targetScore={1000} />);
      expect(screen.getByText('A 1000 puntos')).toBeInTheDocument();

      const progressBars = screen.getAllByRole('progressbar');
      // 15/1000 = 1.5%
      expect(progressBars[0]).toHaveStyle({ width: '1.5%' });
    });
  });

  describe('CSS Classes', () => {
    it('applies correct base classes', () => {
      const { container } = render(<Score teams={mockTeams} />);
      expect(container.querySelector('.score')).toBeInTheDocument();
      expect(container.querySelector('.score__header')).toBeInTheDocument();
      expect(container.querySelector('.score__teams')).toBeInTheDocument();
    });

    it('applies team classes correctly', () => {
      const { container } = render(<Score teams={mockTeams} />);
      const teamElements = container.querySelectorAll('.score__team');
      expect(teamElements).toHaveLength(2);
    });

    it('applies detail classes for buenas and malas', () => {
      const { container } = render(<Score teams={mockTeams} />);
      expect(container.querySelector('.score__detail--buenas')).toBeInTheDocument();
      expect(container.querySelector('.score__detail--malas')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper region role with label', () => {
      render(<Score teams={mockTeams} />);
      expect(screen.getByRole('region', { name: 'Game score' })).toBeInTheDocument();
    });

    it('has proper progressbar roles with aria attributes', () => {
      render(<Score teams={mockTeams} targetScore={30} />);
      const progressBars = screen.getAllByRole('progressbar');

      progressBars.forEach((bar) => {
        expect(bar).toHaveAttribute('aria-valuenow');
        expect(bar).toHaveAttribute('aria-valuemin');
        expect(bar).toHaveAttribute('aria-valuemax');
      });
    });

    it('updates aria-valuenow correctly for different scores', () => {
      const differentScores = [
        { teamId: 1, score: 5 },
        { teamId: 2, score: 20 }
      ];

      render(<Score teams={differentScores} />);
      const progressBars = screen.getAllByRole('progressbar');

      expect(progressBars[0]).toHaveAttribute('aria-valuenow', '5');
      expect(progressBars[1]).toHaveAttribute('aria-valuenow', '20');
    });
  });

  describe('Score Percentage Calculation', () => {
    it('calculates 0% for score of 0', () => {
      const teams = [{ teamId: 1, score: 0 }];
      render(<Score teams={teams} targetScore={30} />);
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveStyle({ width: '0%' });
    });

    it('calculates 50% for half the target score', () => {
      const teams = [{ teamId: 1, score: 15 }];
      render(<Score teams={teams} targetScore={30} />);
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveStyle({ width: '50%' });
    });

    it('calculates 100% for exact target score', () => {
      const teams = [{ teamId: 1, score: 30 }];
      render(<Score teams={teams} targetScore={30} />);
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveStyle({ width: '100%' });
    });

    it('caps at 100% for score exceeding target', () => {
      const teams = [{ teamId: 1, score: 45 }];
      render(<Score teams={teams} targetScore={30} />);
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveStyle({ width: '100%' });
    });
  });
});
