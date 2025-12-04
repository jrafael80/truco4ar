import './Score.css';

interface TeamScore {
  teamId: number;
  score: number;
  buenas?: number;
  malas?: number;
}

interface ScoreProps {
  teams: TeamScore[];
  targetScore?: number;
}

export function Score({ teams, targetScore = 30 }: ScoreProps) {
  const getScorePercentage = (score: number) => {
    return Math.min((score / targetScore) * 100, 100);
  };

  return (
    <div className="score" role="region" aria-label="Game score">
      <div className="score__header">
        <h3 className="score__title">Puntaje</h3>
        <div className="score__target">A {targetScore} puntos</div>
      </div>

      <div className="score__teams">
        {teams.map(team => {
          const percentage = getScorePercentage(team.score);
          const isWinning = team.score === Math.max(...teams.map(t => t.score));

          return (
            <div
              key={team.teamId}
              className={`score__team ${isWinning ? 'score__team--winning' : ''}`}
            >
              <div className="score__team-header">
                <span className="score__team-name">Equipo {team.teamId}</span>
                <span className="score__team-score">{team.score}</span>
              </div>

              <div className="score__progress-bar">
                <div
                  className="score__progress-fill"
                  style={{ width: `${percentage}%` }}
                  role="progressbar"
                  aria-valuenow={team.score}
                  aria-valuemin={0}
                  aria-valuemax={targetScore}
                />
              </div>

              {(team.buenas !== undefined || team.malas !== undefined) && (
                <div className="score__details">
                  {team.buenas !== undefined && team.buenas > 0 && (
                    <span className="score__detail score__detail--buenas">
                      Buenas: {team.buenas}
                    </span>
                  )}
                  {team.malas !== undefined && team.malas > 0 && (
                    <span className="score__detail score__detail--malas">Malas: {team.malas}</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
