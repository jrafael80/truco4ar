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
});
