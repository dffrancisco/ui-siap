import utils, { iColumnPrint, msgConfirmSemCodigo } from '@/ts/utils';
import Swal from "sweetalert2";
import { computed, reactive } from "vue";
import serviceFiltro from './services/filtro.service';
import { iDadosFiltro, iFiltros, iUpdateNomeFiltro } from "./interfaces";
import { msgConfirm } from '@/ts/message';

export const state = reactive({
    loading: false,
    filtros: <iFiltros[]>[],
    selectedFiltro: null,
    idFiltro: 0,
    conferente: null,
    dadosDoFiltroSelecionado: <iDadosFiltro[]>[],
    searchFiltro: "",
    filtroEditar: <iFiltros[]>[],
    modalVisualizarFiltroOpened: false,
    modalNovoFiltroOpened: false,
    modalAddItensFiltroOpened: false,
    nomeNovoFiltro: "",
    nomeConferente: "",
    headers: <any>[
        {
            title: "Data Início",
            key: "DATA_INICIO",
            sortable: true,
            value: (item: any) => utils.dataBrasil(item.DATA_INICIO)
        },
        {
            title: "Data Fim",
            key: "DATA_FIM",
            sortable: true,
            align: 'center',
            value: (item: any) => utils.dataBrasil(item.DATA_FIM)
        },
        {
            title: "Nome do Filtro",
            key: "NOME_FILTRO",
            align: 'center',
        },
        {
            title: "Criado Por",
            key: "CRIADOR"
        },
        {
            title: "Conferente",
            key: "CONFERENTE",
        },
        {
            title: "Qtd Itens",
            key: "QTD_ITENS",
            align: 'center',
        },
        {
            title: 'Ações',
            key: 'acoes',
            sortable: false,
            align: 'center',
        },
    ]
})

export const computeds = {
    filtros: computed(() => {
        const searchFiltro = state.searchFiltro?.toLowerCase().trim() || '';

        // Se não houver termo de busca, retorne todos os filtros
        if (!searchFiltro) {
            return state.filtros;
        }

        // Caso contrário, aplique o filtro
        return state.filtros.filter(filtro => {
            const nomeFiltro = filtro.NOME_FILTRO ? filtro.NOME_FILTRO.toLowerCase() : '';
            const criador = filtro.CRIADOR ? filtro.CRIADOR.toLowerCase() : '';
            const conferente = filtro.CONFERENTE ? filtro.CONFERENTE.toLowerCase() : '';
            const dataInicio = filtro.DATA_INICIO ? new Date(filtro.DATA_INICIO).toLocaleDateString() : '';
            const dataFim = filtro.DATA_FIM ? new Date(filtro.DATA_FIM).toLocaleDateString() : '';

            return (
                nomeFiltro.includes(searchFiltro) ||
                criador.includes(searchFiltro) ||
                conferente.includes(searchFiltro) ||
                dataInicio.includes(searchFiltro) ||
                dataFim.includes(searchFiltro)
            );
        });
    }),
};

export const actions = {
    async init() {
        actions.getFiltros()
    },

    async selectFiltro(idFiltro: number) {
        state.selectedFiltro = idFiltro;

        try {
            state.loading = true;
            const data = await serviceFiltro.getFiltroSelected(state.selectedFiltro)
            state.dadosDoFiltroSelecionado = data
            state.modalVisualizarFiltroOpened = true;

        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao buscar o filtro!"
            });
        } finally {
            state.loading = false;
        }
    },

    async getFiltros() {
        try {
            state.loading = true;
            const filtros = await serviceFiltro.getFiltros()
            state.filtros = filtros
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao trazer os dados!"
            });
        } finally {
            state.loading = false;
        }
    },

    getClassCorLinha(dados: any) {
        let classe = dados.index % 2 == 0 ? 'cor-zebrada-1' : 'cor-zebrada-2'
        return { class: classe }
    },

    async onClickImprimirFiltros() {
        try {
            let filtros = state.filtros
            const filtroFormatado = actions.formatarDadosImpressaoFiltros([...filtros]);

            const columns: iColumnPrint[] = [
                { key: 'DATA_INICIO', label: 'Data Início', width: '20%' },
                { key: 'DATA_FIM', label: 'Data Fim', width: '20%' },
                { key: 'NOME_FILTRO', label: 'Nome do Filtro', width: '15%' },
                { key: 'QTD_ITENS', label: 'Qtd Itens', width: '15%', align: 'center' },
                { key: 'CRIADOR', label: 'Criador', width: '15%', align: 'center' },
                { key: 'CONFERENTE', label: 'Conferente', width: '15%', align: 'center' }
            ];

            const titulo = `
                <div style="display: flex; justify-content: center; width: 100%; margin-top: 10px">
                    <span>&nbsp;</span>
                    <strong style="font-size: 16px;">Filtro para conferência</strong>
                </div>
            `;

            await utils.printComCabecalho(columns, filtroFormatado, titulo);

        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao imprimir o relatório."
            });
        }
    },

    formatarDadosImpressaoFiltros(data) {
        return data.map(item => ({
            ...item,
            DATA_INICIO: item.DATA_INICIO ? utils.dataBrasil(item.DATA_INICIO) : '-------',
            DATA_FIM: item.DATA_FIM ? utils.dataBrasil(item.DATA_FIM) : '---------',
            NOME_FILTRO: item.NOME_FILTRO ? item.NOME_FILTRO : '--------'
        }));
    },

    async imprimirFiltroSelecionado(idFiltro: number) {
        try {
            const filtro = await serviceFiltro.getFiltroSelected(idFiltro)
            const filtroFormatado = actions.formatarDadosImpressao([...filtro]);

            const columns: iColumnPrint[] = [
                { key: 'DESC_PRODUTO', label: 'Produto', width: '30%' },
                { key: 'NUM_FABRICANTE', label: 'Nº Fabricante', width: '15%' },
                { key: 'NUM_FABRICANTE2', label: 'Nº Fabricante2', width: '15%' },
                { key: 'QTO_OLD', label: 'Qtd velha', width: '5%', align: 'center' },
                { key: 'QUANTIDADE', label: 'Qtd nova', width: '5%', align: 'center' },
                { key: 'END_ESTOQUE', label: 'End. Estoque', width: '15%', align: 'right' },
                { key: 'END_EXCESSO', label: 'End. Excesso', width: '15%', align: 'right' },
                { key: 'CONFERIDO', label: 'Conferido', width: '10%', align: 'center' }

            ];

            const titulo = `
                <div style="display: flex; justify-content: center; width: 100%; margin-top: 10px">
                    <span>&nbsp;</span>
                    <strong style="font-size: 16px;">Filtro para conferência</strong>
                </div>
            `;

            await utils.printComCabecalho(columns, filtroFormatado, titulo);

        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao imprimir o relatório."
            });
        }
    },

    formatarDadosImpressao(data) {
        return data.map(item => ({
            ...item,
            DESC_PRODUTO: item.DESC_PRODUTO || '-----',
            NUM_FABRICANTE: item.NUM_FABRICANTE || '-----',
            NUM_FABRICANTE2: item.NUM_FABRICANTE2 || '-----',
            QTO_OLD: item.QTO_OLD || 0,
            QUANTIDADE: item.QUANTIDADE || '-----',
            END_ESTOQUE: item.END_ESTOQUE || '-----',
            END_EXCESSO: item.END_EXCESSO || '-----',
            DATA: item.DATA ? utils.dataBrasil(item.DATA) : '-----',
            CONFERIDO: item.CONFERIDO || '-----',
        }));
    },

    novoFiltro() {
        state.filtroEditar = []
        state.idFiltro = null;
        state.modalNovoFiltroOpened = true;
    },

    async finalizarFiltro(idFiltro) {
        state.idFiltro = idFiltro;
        if (await msgConfirmSemCodigo("Confirmação", "Deseja finalizar esse filtro?")) {

            try {
                state.loading = true;
                let param = state.idFiltro
                await serviceFiltro.finalizarFiltro(param)

                // Atualizar o filtro na state
                const filtroIndex = state.filtros.findIndex(filtro => filtro.ID_FILTRO === idFiltro);
                if (filtroIndex !== -1) {
                    state.filtros[filtroIndex].DATA_FIM = new Date().toISOString();
                }

                Swal.fire({
                    icon: "success",
                    text: "Filtro finalizado com sucesso!",
                    timer: 1500
                });
            } catch {
                Swal.fire({
                    icon: "error",
                    text: "Erro ao finalizar o filtro!"
                });
            } finally {
                state.loading = false;
            }

        }
    },

    async deletarFiltro(idFiltro) {
        state.idFiltro = idFiltro;
        if (await msgConfirm("Confirmação", "Confirma que deseja excluir esse filtro? Todos os itens relativos serão removidos.")) {

            try {
                state.loading = true;
                let param = state.idFiltro
                await serviceFiltro.deletarFiltro(param)

                // Remover filtro da state
                state.filtros = state.filtros.filter(filtro => filtro.ID_FILTRO !== idFiltro);

                Swal.fire({
                    icon: "success",
                    text: "Filtro deletado com sucesso!",
                    timer: 1500
                });
            } catch {
                Swal.fire({
                    icon: "error",
                    text: "Erro ao excluir o filtro!"
                });
            } finally {
                state.loading = false;
            }

        }
    },

    criarNovoFiltro(conferente: number | string, nomeFiltro: string, nomeConferente: string) {
        state.conferente = conferente;
        state.nomeNovoFiltro = nomeFiltro;
        state.nomeConferente = nomeConferente;
        state.modalAddItensFiltroOpened = true
    },

    addItensFiltro(idFiltro: number, conferente: number | string, nomeFiltro: string, nomeConferente: string) {
        state.idFiltro = idFiltro
        state.conferente = conferente;
        state.nomeNovoFiltro = nomeFiltro;
        state.nomeConferente = nomeConferente
        state.modalAddItensFiltroOpened = true
    },

    updateFiltroEConferente(idFiltro: number, conferente: number | string, nomeFiltro: string, nomeConferente: string) {
        //atualizando states para upload e states que sao enviadas como props
        state.idFiltro = idFiltro
        state.conferente = conferente;
        state.nomeNovoFiltro = nomeFiltro;
        state.nomeConferente = nomeConferente
        state.dadosDoFiltroSelecionado[0].ID_FILTRO = state.idFiltro
        state.dadosDoFiltroSelecionado[0].CONFERENTE = state.conferente
        state.dadosDoFiltroSelecionado[0].NOME_FILTRO = state.nomeNovoFiltro
        state.dadosDoFiltroSelecionado[0].COD_FUNCIONARIO = state.conferente
        actions.updateConferenteNomeFiltro()
    },

    async updateConferenteNomeFiltro() {
        try {
            state.loading = true;
            let param: iUpdateNomeFiltro = {
                idFiltro: state.idFiltro,
                nomeFiltro: state.nomeNovoFiltro,
                funcionario: state.conferente
            }
            await serviceFiltro.updateConferenteNomeFiltro(param)
            Swal.fire({
                icon: "success",
                text: "Filtro atualizado com sucesso!",
                timer: 1500
            });

            // Atualizar o filtro na state
            const filtroIndex = state.filtros.findIndex(filtro => filtro.ID_FILTRO === state.idFiltro);
            if (filtroIndex !== -1) {
                state.filtros[filtroIndex].NOME_FILTRO = state.nomeNovoFiltro
                state.filtros[filtroIndex].CONFERENTE = state.nomeConferente
            }
            // Atualizar o filtro na state.dadosDoFiltroSelecionado
            const filtroSelecionadoIndex = state.dadosDoFiltroSelecionado.findIndex(filtro => filtro.ID_FILTRO === state.idFiltro);
            if (filtroSelecionadoIndex !== -1) {
                state.dadosDoFiltroSelecionado[filtroSelecionadoIndex].NOME_FILTRO = state.nomeNovoFiltro;
                state.dadosDoFiltroSelecionado[filtroSelecionadoIndex].CONFERENTE = state.nomeConferente;
            }

        } catch {
            Swal.fire({
                icon: "error",
                text: "Erro ao atualizar o filtro!"
            });
        } finally {
            state.loading = false;
        }
    },

    editarDadosFiltroSelecionado(filtro) {
        state.filtroEditar = filtro
        state.modalNovoFiltroOpened = true
    },

    removerItemState({ idItem, idFiltro }) {
        state.dadosDoFiltroSelecionado = state.dadosDoFiltroSelecionado.filter(
            (filtroItem) => filtroItem.ID_ITENS_FILTRO !== idItem
        );

        // Encontrar o filtro correspondente e diminuir a quantidade de itens
        const filtro = state.filtros.find((filtro) => filtro.ID_FILTRO === idFiltro);
        if (filtro) {
            filtro.QTD_ITENS -= 1;
        }
    },

    closeModalVisualizarFiltro() {
        state.modalVisualizarFiltroOpened = false;
    },

    closeModalNovoFiltro() {
        state.modalNovoFiltroOpened = false;
    },

    closeModalAddItensFiltro() {
        state.modalAddItensFiltroOpened = false;
        state.modalVisualizarFiltroOpened = false
        actions.getFiltros()
    },

    cancelarModalAddItensFiltro() {
        state.modalAddItensFiltroOpened = false;
        state.modalVisualizarFiltroOpened = false
    }

}