import utils from '@/ts/utils';
import Swal from "sweetalert2";
import { computed, reactive } from "vue";
import serviceFiltro from './services/filtro.service';
import { iDadosFiltro, iFiltros } from "./interfaces";
import { msgConfirm } from '@/ts/message';

export const state = reactive({
    loading: false,
    filtros: <iFiltros[]>[],
    selectedFiltro: null,
    idFiltro: 0,
    conferente: "",
    dadosDoFiltroSelecionado: <iDadosFiltro[]>[],
    searchFiltro: "",
    modalVisualizarFiltroOpened: false,
    modalNovoFiltroOpened: false,
    modalAddItensFiltroOpened: false,
    nomeNovoFiltro: "",
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
                text: "Erro ao exibir as trazer os dados!"
            });
        } finally {
            state.loading = false;
        }
    },

    getClassCorLinha(dados: any) {
        let classe = dados.index % 2 == 0 ? 'cor-zebrada-1' : 'cor-zebrada-2'
        return { class: classe }
    },

    async onClickImprimir() {
        console.log('imprimir');
    },

    novoFiltro() {
        state.modalNovoFiltroOpened = true;
    },

    async finalizarFiltro(idFiltro) {
        state.idFiltro = idFiltro;
        if (await msgConfirm("Confirmação", "Confirma a finalização desse filtro?")) {

            try {
                state.loading = true;
                let param = state.idFiltro
                await serviceFiltro.finalizarFiltro(param)
                Swal.fire({
                    icon: "success",
                    text: "Filtro finalizado com sucesso!",
                    timer: 1500
                });
                actions.getFiltros()
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

    async reabrirFiltro(idFiltro) {
        state.idFiltro = idFiltro;
        if (await msgConfirm("Confirmação", "Confirma a reabertura desse filtro?")) {

            try {
                state.loading = true;
                let param = state.idFiltro
                await serviceFiltro.reabrirFiltro(param)
                Swal.fire({
                    icon: "success",
                    text: "Filtro atualizado com sucesso!",
                    timer: 1500
                });
                actions.getFiltros()
            } catch {
                Swal.fire({
                    icon: "error",
                    text: "Erro ao reabrir o filtro!"
                });
            } finally {
                state.loading = false;
            }

        }
    },

    addItensNovoFiltro(nomeFiltro: string) {
        state.nomeNovoFiltro = nomeFiltro;
        state.idFiltro = 0
        state.conferente = "";
        state.modalAddItensFiltroOpened = true
    },

    addItensFiltroExistente(idFiltro: number, conferente: string, nomeFiltro: string) {
        state.idFiltro = idFiltro
        state.conferente = conferente;
        state.nomeNovoFiltro = nomeFiltro;
        state.modalAddItensFiltroOpened = true
    },

    closeModalVisualizarFiltro() {
        state.modalVisualizarFiltroOpened = false;
    },

    closeModalNovoFiltro() {
        state.modalNovoFiltroOpened = false;
    },

    closeModalAddItensFiltro() {
        state.modalAddItensFiltroOpened = false;
        actions.getFiltros()
    }
}