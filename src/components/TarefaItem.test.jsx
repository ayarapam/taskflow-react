import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TarefaItem from './TarefaItem';

describe('TarefaItem', () => {
    test('mostra o texto e o rótulo da prioridade', () => {
        render(<TarefaItem texto="Estudar Vitest" rotuloPrioridade="Alto" />);

        expect(screen.getByText('Estudar Vitest')).toBeInTheDocument();
        expect(screen.getByText('Alto')).toBeInTheDocument();
    });

    // Testes 2 e 3: sem prioridade e modo lista

    test('sem prioridade, mostra "Sem prioridade"', () => {
        render(<TarefaItem texto="Estudar Vitest" />);

        expect(screen.getByText('Sem prioridade')).toBeInTheDocument();
    });

    test('no modo lista, não mostra as setas', () => {
        render(<TarefaItem texto="Estudar Vitest" />);

        const setaEsquerda = screen.queryByRole('button', { name: '←' });
        const setaDireita = screen.queryByRole('button', { name: '→' });
        const botaoX = screen.getByRole('button', { name: 'X' });

        expect(setaEsquerda).not.toBeInTheDocument();
        expect(setaDireita).not.toBeInTheDocument();
        expect(botaoX).toBeInTheDocument();
    });

    // Teste 4: primeira coluna do Kanban

    test('na primeira coluna, só mostra a seta →', () => {
        render(
            <TarefaItem
                texto="Estudar Vitest"
                onMover={vi.fn()}
                colunaProxima="andamento"
            />
        );

        const setaEsquerda = screen.queryByRole('button', { name: '←' });
        const setaDireita = screen.getByRole('button', { name: '→' });

        expect(setaEsquerda).not.toBeInTheDocument();
        expect(setaDireita).toBeInTheDocument();
    });

    // Teste 5: clicar na →

    test('clicar na → chama o onMover com a próxima coluna', async () => {
        const user = userEvent.setup();
        const onMover = vi.fn();
        render(
            <TarefaItem
                texto="Estudar Vitest"
                onMover={onMover}
                colunaProxima="andamento"
            />
        );

        await user.click(screen.getByRole('button', { name: '→' }));

        expect(onMover).toHaveBeenCalledTimes(1);
        expect(onMover).toHaveBeenCalledWith('andamento');
    });

    // Testes 6 e 7: o X e o duplo clique

    test('clicar no X chama o onDeletar', async () => {
        const user = userEvent.setup();
        const onDeletar = vi.fn();

        vi.spyOn(window, 'confirm').mockReturnValue(true);

        render(<TarefaItem texto="Estudar" onDeletar={onDeletar} />);

        await user.click(screen.getByRole('button', { name: 'X' }));

        expect(window.confirm).toHaveBeenCalled();
        expect(onDeletar).toHaveBeenCalledTimes(1);

        vi.restoreAllMocks();
    });

    test('duplo clique no texto chama o onEditar', async () => {
        const user = userEvent.setup();
        const onEditar = vi.fn();
        render(<TarefaItem texto="Estudar" onEditar={onEditar} />);

        await user.click(screen.getByRole('button', { name: '✎' }));

        expect(onEditar).toHaveBeenCalledTimes(1);
    });


});
