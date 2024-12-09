import { computed, reactive, watch } from "vue";
import { iFiltro, iAvariaDestino, iAvaria, iFuncionario, iDadosPreencherAvaria } from "./interfaces";
import Swal from "sweetalert2";
import serviceRevisaoAvarias from "./services/serviceRevisaoAvarias.service";
import { msgConfirm } from "@/ts/message";
import utils, { iColumnPrint } from "@/ts/utils";
import moment from "moment";

export const revisadaConteudo = [{
    value: 'S',
    label: "Sim"
},
{
    value: 'N',
    label: "Não"
}];

export const headersDataTable = [
    {
        title: "Nº Fabricante | Produto",
        key: "NUM_FABRICANTE_PRODUTO",
        width: '30%',
        sortable: false,
        value: (item: iAvaria) => `${item.NUM_FABRICANTE} - ${item.DESC_PRODUTO}`
    },
    {
        title: "Identificado por",
        key: "NOME_FUNCIONARIO_IDENTIFICOU",
        width: '20%',
        align: 'left',
        sortable: true,
    },
    {
        title: "Revisada",
        key: "FINALIZADO",
        width: '10%',
        align: 'center',
        sortable: false,
        value: (item: iAvaria) => item.FINALIZADO == 'S' ? 'Sim' : 'Não'
    },
    {
        title: "Destino",
        key: "DESTINO",
        sortable: false,
    },
    {
        title: "Ações",
        width: "18%",
        key: "ACAO",
        align: 'center',
        sortable: false,
    }
]

export const state = reactive({
    loading: false,
    avariasDestinosLista: <iAvariaDestino[]>[],
    filtros: <iFiltro>{},
    dbAvarias: <iAvaria[]>[],
    modalRevisaoAvariasOpen: false,
    avariaSelecionada: <iAvaria>{},
    funcionariosLista: <iFuncionario[]>[],
    totalItems: 0,
    itemsPerPage: 30,
    page: 1,
    modalConfigurarImpressao: false
})

export const actions = {
    async init() {
        await actions.getDadosToSelect()
        await actions.getAvarias()
    },

    async openModalRevisao(avaria: iAvaria) {
        state.avariaSelecionada = avaria
        state.modalRevisaoAvariasOpen = true
    },

    async getDadosToSelect() {
        try {
            state.loading = true
            const data = await serviceRevisaoAvarias.getDadosToSelects()

            state.avariasDestinosLista = data.avariasDestinos
            state.funcionariosLista = data.funcionarios

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Ocorreu um erro ao buscar os dados para os selects.',
                text: error.message
            })
        } finally {
            state.loading = false
        }
    },

    async getAvarias() {
        try {
            state.loading = true
            const data = await serviceRevisaoAvarias.getAvarias(state.filtros, state.itemsPerPage, state.page)

            state.dbAvarias = data.avarias
            state.totalItems = data.total

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Ocorreu um erro ao buscar as avarias',
                text: error.message
            })
        } finally {
            state.loading = false
        }
    },

    async finalizarAvaria(dadosAvariaPreencher: iDadosPreencherAvaria) {
        let avariaLocalizada = state.dbAvarias.find(avaria => avaria.ID_AVARIA == dadosAvariaPreencher.ID_AVARIA)
        let funcionarioIdentificouLocalizado = state.funcionariosLista.find(funcionario => {
            return funcionario.COD_FUNCIONARIO == dadosAvariaPreencher.COD_FUNCIONARIO_IDENTIFICOU
        })
        let destinoLocalizado = state.avariasDestinosLista.find(destino => {
            return destino.ID_AVARIA_DESTINO == dadosAvariaPreencher.ID_AVARIA_DESTINO
        })

        if (avariaLocalizada) {
            avariaLocalizada.FINALIZADO = 'S'
            avariaLocalizada.NOME_FUNCIONARIO_IDENTIFICOU = funcionarioIdentificouLocalizado.LOGIN
            avariaLocalizada.NOME_FUNCIONARIO_VALIDOU = dadosAvariaPreencher.NOME_FUNCIONARIO_VALIDOU
            avariaLocalizada.COD_FUNCIONARIO_IDENTIFICOU = dadosAvariaPreencher.COD_FUNCIONARIO_IDENTIFICOU
            avariaLocalizada.DESTINO = destinoLocalizado.DESCRICAO
            avariaLocalizada.ID_AVARIA_DESTINO = dadosAvariaPreencher.ID_AVARIA_DESTINO
            avariaLocalizada.DATA_HORA_VALIDACAO = dadosAvariaPreencher.DATA_HORA_VALIDACAO
            avariaLocalizada.ORIGEM_AVARIA = dadosAvariaPreencher.ORIGEM_AVARIA
            avariaLocalizada.DESCRICAO_AVARIA = dadosAvariaPreencher.DESCRICAO_AVARIA
            avariaLocalizada.QTD = dadosAvariaPreencher.QTD
            state.dbAvarias = [...state.dbAvarias]
        }

        state.modalRevisaoAvariasOpen = false

        state.modalConfigurarImpressao = true
    },

    async btnDeletarAvaria(idAvaria: number) {
        if (await msgConfirm('Confirmação', 'Deseja deletar essa avaria?')) {
            await actions.deletarAvaria(idAvaria)
        }
    },

    async deletarAvaria(idAvaria: number) {
        try {
            state.loading = true
            const data = await serviceRevisaoAvarias.deletarAvaria(idAvaria)

            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: data.msg,
                })

                state.dbAvarias = state.dbAvarias.filter(avaria => avaria.ID_AVARIA !== idAvaria)
            }

        } catch (error) {

        } finally {
            state.loading = false
        }
    },

    formatarDadosImpressao(data: iAvaria[]) {
        return data.map(item => ({
            ...item,
            NUM_FABRICANTE_PRODUTO: `${item.NUM_FABRICANTE} - ${item.DESC_PRODUTO}`,
            FINALIZADO: item.FINALIZADO == 'S' ? 'Sim' : 'Não',
            DESTINO: item.DESTINO || ''
        }))
    },

    async imprimirAvarias() {
        try {
            const dadosAvariasFormatado = actions.formatarDadosImpressao([...state.dbAvarias]);

            const columns: iColumnPrint[] = [
                { key: 'NUM_FABRICANTE_PRODUTO', label: 'Nº Fabricante | Produto', width: '50%' },
                { key: 'NOME_FUNCIONARIO_IDENTIFICOU', label: 'Identificado Por', width: '25%' },
                { key: 'FINALIZADO', label: 'Revisada', width: '5%', align: 'center' },
                { key: 'DESTINO', label: 'Destino' },
            ];

            const titulo = `
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-top: 10px">
                    <span>Data: ${moment().format('DD/MM/YYYY')}</span>
                    <strong style="font-size: 20px;">Avarias</strong>
                </div>
            `;

            await utils.printComCabecalho(columns, dadosAvariasFormatado, titulo);

        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao imprimir o relatório."
            });
        }
    },

    async updatePage(newPage: number) {
        state.page = newPage
        await actions.getAvarias()
    },
}

export const computeds = {
    avariasSemRevisao: computed(() => {
        return state.dbAvarias.filter(avaria => avaria.FINALIZADO === 'N')
    })
}

watch(
    () => state.itemsPerPage,
    () => {
        actions.getAvarias();
    }
);