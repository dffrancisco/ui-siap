import { computed, reactive } from "vue"
import moment from "moment"
import cabongoService from "./service/cabongo.service"
import { iParamOrcamento } from "./interface"
import Swal from "sweetalert2"

export const state = reactive({
    modalEscolherDataOpened: false,
    modalOrcamentoOpened: false,
    dataEnviada: moment().format('DD/MM/YYYY'),
    sociedades: [],
    objSociedades: {},
    loadingConferidos: true,
    loadingPendentes: true,
    cnpj: "",
    dataRegex: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
    headers: [
        { title: "Data", width: "240px" },
        { title: "Qtd", key: "COD_PRODUTO" },
    ],
    lojasComErro: [],
    dataPendente: [],
})

const totalPendentes = computed(() => {
    return state.sociedades.reduce((soma, item) => {
        return soma + item.qtdPendente;
    }, 0);
})

const totalConferidos = computed(() => {
    return state.sociedades.reduce((soma, item) => {
        return soma + item.qtdConcluida;
    }, 0);
})

export const computeds = {
    totalConferidos,
    totalPendentes
}

export const actions = {
    async init() {
        await actions.getEmpresa()
        await actions.getSociedade()
        actions.getOrcamento()
    },

    async onclickCardData(id_sociedade: number, cnpj: string) {

        try {
            state.dataPendente = await cabongoService.getOrcamentoData({
                id_sociedade,
                cnpj: cnpj
            })
            if (state.dataPendente.length > 1) {
                state.modalEscolherDataOpened = true
            }
            else {
                state.modalOrcamentoOpened = true
            }


        }
        catch (error) {
            Swal.fire({
                icon: "error",
                text: "Ocorreu um erro ao Abrir Datas"
            });

        }

    },

    async getSociedade() {
        state.sociedades = await cabongoService.getSociedade()

        state.sociedades.forEach(sociedade => {
            sociedade.loading = true
            sociedade.qtdPendente = 0
            sociedade.qtdConcluida = 0

            state.objSociedades[sociedade.ID_EMPRESA] = sociedade
        })
    },

    async getEmpresa() {
        const cnpj = await cabongoService.getEmpresa()
        state.cnpj = cnpj.CGC_EMPRESA
    },

    async resetarSociedade() {
        state.sociedades.forEach(sociedade => {
            sociedade.loading = true
            sociedade.qtdConcluida = 0
            sociedade.qtdPendente = 0
        })
    },

    async getOrcamento() {
        const data = moment(state.dataEnviada, 'DD/MM/YYYY', true);
        const hoje = moment().startOf('day');

        if (!state.dataRegex.test(state.dataEnviada)) {
            Swal.fire({
                icon: 'warning',
                text: 'Por favor, insira uma data válida.',
            })
            return
        }

        if (data.isAfter(hoje)) {
            Swal.fire({
                icon: 'warning',
                text: 'Por favor, insira uma data válida.',
            })
            return
        }


        state.loadingPendentes = true
        state.loadingConferidos = true

        let requisicaoTamanho = 3

        actions.resetarSociedade();
        state.lojasComErro = []

        for (let i = 0; i < state.sociedades.length; i += requisicaoTamanho) {

            const lote = state.sociedades.slice(i, i + requisicaoTamanho);
            const promises = lote.map((empresa) => {

                return {

                    id_sociedade: empresa.ID_EMPRESA,
                    nomeEmpresa: empresa.FANTASIA,
                    promise: cabongoService.getOrcamento({
                        id_sociedade: empresa.ID_EMPRESA,
                        cnpj: state.cnpj,
                        dataOrcamentoPesquisa: moment(state.dataEnviada, 'DD/MM/YYYY').format('YYYY-MM-DD')
                    })
                }

            })

            const resultadoOrcamento = await Promise.allSettled(promises.map(p => p.promise));

            resultadoOrcamento.forEach((res: any, index) => {
                const idSociedade = promises[index].id_sociedade;

                if (res.status === "fulfilled") {

                    state.objSociedades[res.value.idSociedade].loading = false
                    state.objSociedades[res.value.idSociedade].qtdPendente = res.value.qtdOrcamentosPendentes
                    state.objSociedades[res.value.idSociedade].qtdConcluida = res.value.qtdOrcamentosConferidos

                } else {
                    const nomeEmpresa = promises[index].nomeEmpresa
                    state.lojasComErro.push(nomeEmpresa);
                    console.warn("Falha ao buscar orçamento:", res.reason);
                    state.objSociedades[idSociedade].loading = false
                }

            });

        }
        state.loadingConferidos = false;
        state.loadingPendentes = false;
    },


}