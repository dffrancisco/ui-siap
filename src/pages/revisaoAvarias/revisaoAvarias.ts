import { computed, reactive } from "vue";
import { iFiltro, iAvariaDestino, iAvaria, iFuncionario, iDadosPreencherAvaria } from "./interfaces";
import Swal from "sweetalert2";
import serviceRevisaoAvarias from "./services/serviceRevisaoAvarias.service";
import { msgConfirm } from "@/ts/message";

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
        sortable: true,
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
        sortable: true,
        value: (item: iAvaria) => item.FINALIZADO == 'S' ? 'Sim' : 'Não'
    },
    {
        title: "Destino",
        key: "DESTINO",
        sortable: true,
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
    funcionariosLista: <iFuncionario[]>[]
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
            state.dbAvarias = await serviceRevisaoAvarias.getAvarias(state.filtros)
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

    async preencherDadosAoFinalizarAvaria(dadosAvariaPreencher: iDadosPreencherAvaria) {
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
            state.dbAvarias = [...state.dbAvarias]
        }

        state.modalRevisaoAvariasOpen = false
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
    }
}

export const computeds = {
    avariasSemRevisao: computed(() => {
        return state.dbAvarias.filter(avaria => avaria.FINALIZADO === 'N')
    })
}