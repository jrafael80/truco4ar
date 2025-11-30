import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the app', () => {
    render(<App />);
    expect(screen.getByText('🎴 Truco4AR')).toBeInTheDocument();
  });

  it('renders multi-device description', () => {
    render(<App />);
    expect(screen.getByText('Multi-device Argentine Truco')).toBeInTheDocument();
  });

  it('renders game components', () => {
    render(<App />);
    expect(screen.getByLabelText('Players')).toBeInTheDocument();
    expect(screen.getByLabelText('Game score')).toBeInTheDocument();
    expect(screen.getByLabelText('Played cards')).toBeInTheDocument();
    expect(screen.getByLabelText('Player hand')).toBeInTheDocument();
  });

  it('displays player hand with cards', () => {
    render(<App />);
    expect(screen.getByText('Tu Mano')).toBeInTheDocument();
  });
});
