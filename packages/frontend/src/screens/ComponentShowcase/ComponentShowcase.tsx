import { useState } from 'react';
import { Suit } from '@truco4ar/shared';
import { Card, Hand, Table, PlayerList, Score } from '../../components';
import './ComponentShowcase.css';

export function ComponentShowcase() {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  // Mock data
  const sampleCards = [
    { suit: Suit.ESPADAS, rank: 1 as const },
    { suit: Suit.OROS, rank: 7 as const },
    { suit: Suit.BASTOS, rank: 3 as const }
  ];

  const allCards = [
    { suit: Suit.ESPADAS, rank: 1 as const },
    { suit: Suit.ESPADAS, rank: 7 as const },
    { suit: Suit.OROS, rank: 7 as const },
    { suit: Suit.COPAS, rank: 12 as const },
    { suit: Suit.BASTOS, rank: 11 as const },
    { suit: Suit.BASTOS, rank: 3 as const }
  ];

  const playedCards = [
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
  ];

  const players = [
    { id: 'p1', name: 'Juan', teamId: 1, isDealer: true, hasPlayed: true },
    { id: 'p2', name: 'María', teamId: 2, hasPlayed: true },
    { id: 'p3', name: 'Pedro', teamId: 1 },
    { id: 'p4', name: 'Ana', teamId: 2 }
  ];

  const teams = [
    { teamId: 1, score: 12, buenas: 2, malas: 1 },
    { teamId: 2, score: 8, buenas: 1, malas: 0 }
  ];

  const handleCardClick = (card: { suit: Suit; rank: number }, index: number) => {
    setSelectedCard(index);
    console.log(`Clicked card: ${card.rank} de ${card.suit} (index ${index})`);
  };

  return (
    <div className="showcase">
      <header className="showcase__header">
        <h1>🎴 Truco4AR - Component Showcase</h1>
        <p>Prueba interactiva de todos los componentes</p>
      </header>

      <div className="showcase__content">
        {/* Card Component */}
        <section className="showcase__section">
          <h2>1. Componente Card</h2>
          <p>Cartas individuales con diferentes estados</p>
          <div className="showcase__cards">
            <div className="showcase__card-demo">
              <Card card={{ suit: Suit.ESPADAS, rank: 1 }} />
              <span>Normal</span>
            </div>
            <div className="showcase__card-demo">
              <Card card={{ suit: Suit.OROS, rank: 7 }} isPlayable />
              <span>Jugable</span>
            </div>
            <div className="showcase__card-demo">
              <Card card={{ suit: Suit.BASTOS, rank: 3 }} isPlayed />
              <span>Jugada</span>
            </div>
            <div className="showcase__card-demo">
              <Card card={{ suit: Suit.COPAS, rank: 12 }} isFaceDown />
              <span>Boca abajo</span>
            </div>
          </div>
        </section>

        {/* All Cards */}
        <section className="showcase__section">
          <h2>2. Todas las cartas del mazo</h2>
          <div className="showcase__all-cards">
            {allCards.map((card, index) => (
              <Card key={index} card={card} />
            ))}
          </div>
        </section>

        {/* Hand Component */}
        <section className="showcase__section">
          <h2>3. Componente Hand</h2>
          <p>Mano del jugador (haz click en las cartas)</p>
          <Hand
            cards={sampleCards}
            onCardClick={handleCardClick}
            playableIndices={[0, 1, 2]}
            playedIndices={selectedCard !== null ? [selectedCard] : []}
          />
          {selectedCard !== null && (
            <p className="showcase__info">
              Seleccionaste: {sampleCards[selectedCard]?.rank} de {sampleCards[selectedCard]?.suit}
            </p>
          )}
        </section>

        {/* Table Component */}
        <section className="showcase__section">
          <h2>4. Componente Table</h2>
          <p>Mesa de juego con cartas jugadas</p>
          <Table playedCards={playedCards} maxPlayers={4} />
        </section>

        {/* PlayerList Component */}
        <section className="showcase__section showcase__section--row">
          <div>
            <h2>5. Componente PlayerList</h2>
            <p>Lista de jugadores con turno actual</p>
            <PlayerList players={players} currentPlayerId="p3" currentUserId="p3" />
          </div>

          {/* Score Component */}
          <div>
            <h2>6. Componente Score</h2>
            <p>Puntaje de equipos</p>
            <Score teams={teams} targetScore={30} />
          </div>
        </section>

        {/* Full Game View */}
        <section className="showcase__section">
          <h2>7. Vista completa del juego</h2>
          <div className="showcase__game-view">
            <div className="showcase__sidebar">
              <PlayerList players={players} currentPlayerId="p3" currentUserId="p3" />
            </div>
            <div className="showcase__game-main">
              <Score teams={teams} targetScore={30} />
              <Table playedCards={playedCards} maxPlayers={4} />
              <div>
                <h3 style={{ textAlign: 'center', margin: '20px 0 10px' }}>Tu Mano</h3>
                <Hand
                  cards={sampleCards}
                  onCardClick={handleCardClick}
                  playableIndices={[0, 1, 2]}
                  playedIndices={[]}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
