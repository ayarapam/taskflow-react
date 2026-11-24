import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ModalTarefa from './ModalTarefa';
import { AuthProvider } from '../contexts/AuthContext';

const prioridades = [
    { id: 9, descricao: 'alta' },
    { id: 8, descricao: 'medio' },
    { id: 7, descricao: 'baixo' },
];

const usuarios = [
    { id: 1, nome: 'Ana Lima' },
    { id: 2, nome: 'Bruno Melo' },
];

const projetos = [
    { id: 10, nome: 'TaskFlow' },
    { id: 20, nome: 'Site da Escola' },
];

function abrirModal(props = {}) {
    render(
        <AuthProvider>
            <ModalTarefa
                aberto={true}
                onFechar={vi.fn()}
                onSalvar={vi.fn()}
                prioridades={prioridades}
                usuarios={usuarios}
                projetos={projetos}
                {...props}
            />
        </AuthProvider>
    );
}

describe('ModalTarefa', () => {
    test('fechado, não mostra nada', () => {
        abrirModal({ aberto: false });

        expect(screen.queryByText('Nova tarefa'))
            .not.toBeInTheDocument();
    });

    test('aberto para criar, mostra o título e os campos', () => {
        abrirModal();
        expect(screen.getByRole('heading', { name: 'Nova tarefa' }))
            .toBeInTheDocument();
        expect(screen.getByLabelText('Tarefa')).toHaveValue('');
        expect(screen.getByLabelText('Responsável')).toHaveValue('1');
        expect(screen.getByLabelText('Projeto')).toHaveValue('10');
        expect(screen.getByLabelText('Prioridade')).toHaveValue('2');
        
    });
});