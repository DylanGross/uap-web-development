import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ReviewForm from '../src/components/Reseña';

// Mock onSubmit
const mockOnSubmit = vi.fn();

describe('ReviewForm', () => {
  it('renderiza el formulario y permite escribir una reseña', () => {
    render(<ReviewForm onSubmit={mockOnSubmit} />);
  expect(screen.getByLabelText(/Reseña/i)).toBeTruthy();
  });

  it('envía una reseña válida', () => {
    render(<ReviewForm onSubmit={mockOnSubmit} />);
    fireEvent.change(screen.getByLabelText(/Reseña/i), { target: { value: 'Excelente libro!' } });
    // Si hay más de un botón, usa el primero
    fireEvent.click(screen.getAllByText(/Enviar Reseña/i)[0]);
    expect(mockOnSubmit).toHaveBeenCalledWith({ rating: 1, text: 'Excelente libro!' });
  });

  it('incrementa votos positivos y negativos en cada reseña', () => {
    render(<ReviewForm onSubmit={mockOnSubmit} />);
    fireEvent.change(screen.getByLabelText(/Reseña/i), { target: { value: 'Muy bueno' } });
    fireEvent.click(screen.getAllByText(/Enviar Reseña/i)[0]);
    // Votar positivo
    fireEvent.click(screen.getAllByText('👍')[1]);
    // Buscar el span con el voto positivo actualizado
    const upVoteSpan = screen.getAllByText((content, element) => {
      return !!element && element.tagName.toLowerCase() === 'span' && content === '1';
    })[0];
    expect(upVoteSpan).toBeTruthy();
    // Votar negativo
    fireEvent.click(screen.getAllByText('👎')[1]);
    const downVoteSpan = screen.getAllByText((content, element) => {
      return !!element && element.tagName.toLowerCase() === 'span' && content === '1';
    })[1];
    expect(downVoteSpan).toBeTruthy();
  });

  it('no permite enviar reseña vacía', () => {
    render(<ReviewForm onSubmit={mockOnSubmit} />);
    fireEvent.click(screen.getAllByText(/Enviar Reseña/i)[0]);
    expect(mockOnSubmit).not.toHaveBeenCalledWith({ rating: 1, text: '' });
  });
});
