import { useCallback, useEffect, useRef, useState } from 'react';
import api from '../api';
import styles from './AlterarFundo.module.css';

function AlterarFundo() {
    const [imagem, setImagem] = useState(null);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState('');
    const urlImagemRef = useRef(null);
    const [modalAberto, setModalAberto] = useState(false);

    const carregarFundo = useCallback(async () => {
        try {
            const resposta = await api.get('/fundos', {
                responseType: 'blob'
            });

            const novaUrl = URL.createObjectURL(resposta.data);

            if (urlImagemRef.current) {
                URL.revokeObjectURL(urlImagemRef.current);
            }

            urlImagemRef.current = novaUrl;
            setImagem(novaUrl);

            document.body.style.backgroundImage =
                `linear-gradient(rgba(30, 41, 59, 90%), rgba(30, 41, 59, 90%)), url("${novaUrl}")`;
        } catch (erroBusca) {
            if (erroBusca.response?.status === 404) {
                if (urlImagemRef.current) {
                    URL.revokeObjectURL(urlImagemRef.current);
                    urlImagemRef.current = null;
                }

                setImagem(null);
                document.body.style.backgroundImage = '';
                return;
            }

            console.error('Erro ao carregar fundo:', erroBusca);
        }
    }, []);

    useEffect(() => {
        carregarFundo();

        return () => {
            if (urlImagemRef.current) {
                URL.revokeObjectURL(urlImagemRef.current);
                urlImagemRef.current = null;
            }

            document.body.style.backgroundImage = '';
        };
    }, [carregarFundo]);

    async function alterarFundo(event) {
        const arquivo = event.target.files?.[0];

        if (!arquivo) return;

        const tiposPermitidos = [
            'image/jpeg',
            'image/png',
            'image/webp'
        ];

        if (!tiposPermitidos.includes(arquivo.type)) {
            setErro('Selecione uma imagem JPG, PNG ou WEBP.');
            event.target.value = '';
            return;
        }

        if (arquivo.size > 5 * 1024 * 1024) {
            setErro('A imagem deve ter no máximo 5 MB.');
            event.target.value = '';
            return;
        }

        const dados = new FormData();
        dados.append('imagem', arquivo);

        try {
            setCarregando(true);
            setErro('');

            await api.post('/fundos', dados);
            await carregarFundo();
        } catch (erroUpload) {
            console.error('Erro ao atualizar fundo:', erroUpload);
            setErro('Não foi possível atualizar o fundo.');
        } finally {
            setCarregando(false);
            event.target.value = '';
        }
    }

    async function removerFundo() {
        try {
            setCarregando(true);
            setErro('');

            await api.delete('/fundos');

            if (urlImagemRef.current) {
                URL.revokeObjectURL(urlImagemRef.current);
                urlImagemRef.current = null;
            }

            setImagem(null);
            document.body.style.backgroundImage = '';
        } catch (erroRemocao) {
            console.error('Erro ao remover fundo:', erroRemocao);
            setErro('Não foi possível remover o fundo.');
        } finally {
            setCarregando(false);
        }
    }


    return (
        <>
            {/* Botão flutuante na parte inferior */}
            <button
                type="button"
                className={styles.botaoFundo}
                onClick={() => setModalAberto(true)}
                title="Alterar imagem de fundo"
            >
                <span>🖼️</span>
                Personalizar fundo
            </button>

            {/* Modal */}
            {modalAberto && (
                <div
                    className={styles.overlay}
                    onClick={() => setModalAberto(false)}
                >
                    <div
                        className={styles.modal}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="titulo-modal-fundo"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            className={styles.fechar}
                            onClick={() => setModalAberto(false)}
                            aria-label="Fechar modal"
                        >
                            ✕
                        </button>

                        <h2 id="titulo-modal-fundo">
                            Personalizar aparência
                        </h2>

                        <p>
                            Escolha uma imagem para usar como fundo do TaskFlow.
                        </p>

                        <label htmlFor="imagem-fundo">
                            Escolher imagem
                        </label>

                        <input
                            id="imagem-fundo"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={alterarFundo}
                            disabled={carregando}
                        />

                        {carregando && (
                            <p>Salvando imagem...</p>
                        )}

                        {erro && (
                            <p className={styles.erro}>{erro}</p>
                        )}

                        {imagem && (
                            <>
                                <img
                                    src={imagem}
                                    alt="Prévia do fundo personalizado"
                                    className={styles.preview}
                                />

                                <button
                                    type="button"
                                    className={styles.botaoRemover}
                                    onClick={removerFundo}
                                    disabled={carregando}
                                >
                                    Restaurar fundo padrão
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );

}

export default AlterarFundo;
