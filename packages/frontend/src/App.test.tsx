import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the app header', () => {
    render(<App />);
    expect(screen.getByText('🎴 Truco4AR')).toBeInTheDocument();
  });

  it('renders welcome message', () => {
    render(<App />);
    expect(screen.getByText('Bienvenido al Truco Argentino')).toBeInTheDocument();
  });

  it('renders development status', () => {
    render(<App />);
    expect(screen.getByText('Aplicación en desarrollo - Fase 4: Frontend')).toBeInTheDocument();
  });

  it('renders link to showcase', () => {
    render(<App />);
    expect(screen.getByText('Component Showcase')).toBeInTheDocument();
  });
});
