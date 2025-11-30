import { useState } from 'react';
import { Suit } from '@truco4ar/shared';
import { Hand } from './components/Hand';
import { Table } from './components/Table';
import { PlayerList } from './components/PlayerList';
import { Score } from './components/Score';
import './App.css';

function App() {
  // Mock data for demonstration
  const [playerHand] = useState([
    { suit: Suit.ESPADAS, rank: 1 as const },
    { suit: Suit.OROS, rank: 7 as const },
    { suit: Suit.BASTOS, rank: 3 as const }
  ]);

  const [playedCards] = useState([
    {
      card: { suit: Suit.COPAS, rank: 12 as const },
      playerId: 'p1',
      playerName: 'Juan'
    },
    {
      card: { suit: Suit.BASTOS, rank: 11 as const },
      playerId: 'p2',
      playerName: 'María'
    }
  ]);

  const [players] = useState([
    { id: 'p1', name: 'Juan', teamId: 1, isDealer: true, hasPlayed: true },
    { id: 'p2', name: 'María', teamId: 2, hasPlayed: true },
    { id: 'p3', name: 'Pedro', teamId: 1 },
    { id: 'p4', name: 'Ana', teamId: 2 }
  ]);

  const [teams] = useState([
    { teamId: 1, score: 12, buenas: 2, malas: 1 },
    { teamId: 2, score: 8, buenas: 1, malas: 0 }
  ]);

  const handleCardClick = (card: { suit: Suit; rank: number }, index: number) => {
    console.log(`Played card: ${card.rank} de ${card.suit} (index ${index})`);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎴 Truco4AR</h1>
        <p>Multi-device Argentine Truco</p>
      </header>
      <main className="app-main">
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={{ flex: '0 0 auto' }}>
            <PlayerList players={players} currentPlayerId="p3" currentUserId="p3" />
          </div>
          <div style={{ flex: '1 1 400px', minWidth: '300px' }}>
            <Score teams={teams} targetScore={30} />
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <Table playedCards={playedCards} maxPlayers={4} />
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>Tu Mano</h3>
          <Hand
            cards={playerHand}
            onCardClick={handleCardClick}
            playableIndices={[0, 1, 2]}
            playedIndices={[]}
          />
        </div>

        <p className="read-the-docs">Componentes UI del Truco - Fase 4</p>
      </main>
    </div>
  );
}

export default App;
