import { computed, reactive } from "vue"
import moment from "moment"
import cabongoService from "./service/cabongo.service"
import Swal from "sweetalert2"
import { iOrcamento, iOrcamentosData } from "./interface"
import { useRoute } from "vue-router";
import router from "@/router"

const route = useRoute();

export const state = reactive({
    modalEscolherDataOpened: false,
    modalOrcamentoOpened: false,
    data: moment().format('DD/MM/YYYY'),
    sociedades: <iOrcamento[]>[],
    objSociedades: <iOrcamento>{},
    loadingConferidos: true,
    loadingPendentes: true,
    meuCNPJ: "",
    lojasComErro: <string[]>[],
    qtdOrcamentosPorData: <iOrcamentosData[]>[],
})

const totalPendentes = computed(() => {
    return state.sociedades.reduce((soma, item) => {
        return soma + item.qtdOrcamentosPendentes;
    }, 0);
})

const totalConferidos = computed(() => {
    return state.sociedades.reduce((soma, item) => {
        return soma + item.qtdOrcamentosConferidos;
    }, 0);


})

const sociedadesOrdenadasConferidos = computed(() =>
    [...state.sociedades].sort((a, b) => b.qtdOrcamentosConferidos - a.qtdOrcamentosConferidos)

);
const sociedadesOrdenadasPendentes = computed(() =>
    [...state.sociedades].sort((a, b) => b.qtdOrcamentosPendentes - a.qtdOrcamentosPendentes)

);



export const computeds = {
    totalConferidos,
    totalPendentes,
    sociedadesOrdenadasPendentes,
    sociedadesOrdenadasConferidos
}

export const actions = {
    async init() {
        await actions.getEmpresa()
        await actions.getSociedade()
        actions.getOrcamento()
    },

    redirectToCabongoOrcamentos: (id_sociedade: number, meuCNPJ, data: string) => {
        router.push({
            name: "cabongoOrcamento",
            query: {
                id_sociedade,
                meuCNPJ,
                data
            },
        });
    },

    async onClickCardPendente(id_sociedade: number, cnpj: string) {

        try {
            state.qtdOrcamentosPorData = await cabongoService.getOrcamentoData({
                id_sociedade,
                cnpj: cnpj
            })
            if (state.qtdOrcamentosPorData.length > 1) {
                state.modalEscolherDataOpened = true
            }
            else {
                actions.redirectToCabongoOrcamentos(id_sociedade, state.meuCNPJ, state.qtdOrcamentosPorData[0].DATA)
            }


        }
        catch (error) {
            Swal.fire({
                icon: "error",
                text: "Ocorreu um erro ao Abrir Datas"
            });

        }

    },

    onClickCardConcluido(id_sociedade: number, cnpj: string) {
        actions.redirectToCabongoOrcamentos(id_sociedade, state.meuCNPJ, state.data)
    },

    async getSociedade() {
        state.sociedades = await cabongoService.getSociedade()

        state.sociedades.forEach(sociedade => {
            sociedade.loading = true
            sociedade.qtdOrcamentosPendentes = 0
            sociedade.qtdOrcamentosConferidos = 0

            state.objSociedades[sociedade.ID_EMPRESA] = sociedade
        })
    },

    async getEmpresa() {
        const cnpj = await cabongoService.getEmpresa()
        state.meuCNPJ = cnpj.CGC_EMPRESA
    },

    async resetarSociedade() {
        state.sociedades.forEach(sociedade => {
            sociedade.loading = true
            sociedade.qtdOrcamentosPendentes = 0
            sociedade.qtdOrcamentosConferidos = 0
        })

        state.sociedades.sort((a, b) => b.qtdOrcamentosConferidos - a.qtdOrcamentosConferidos)
    },

    async getOrcamento() {


        const dataVerificacao = moment(state.data, 'DD/MM/YYYY', true);
        const hoje = moment().startOf('day');
        const dataRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/

        if (!dataRegex.test(state.data)) {
            Swal.fire({
                icon: 'warning',
                text: 'Por favor, insira uma data válida.',
            })
            return
        }

        if (dataVerificacao.isAfter(hoje)) {
            Swal.fire({
                icon: 'warning',
                text: 'Por favor, informe uma data igual ou anterior à data de hoje.',
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
                        cnpj: state.meuCNPJ,
                        dataOrcamentoPesquisa: moment(state.data, 'DD/MM/YYYY').format('YYYY-MM-DD')
                    })
                }

            })

            const resultadoOrcamento = await Promise.allSettled(promises.map(p => p.promise));


            resultadoOrcamento.forEach((res: any, index) => {
                const idSociedade = promises[index].id_sociedade;

                if (res.status === "fulfilled") {

                    state.objSociedades[res.value.idSociedade].loading = false
                    state.objSociedades[res.value.idSociedade].qtdOrcamentosPendentes = res.value.qtdOrcamentosPendentes
                    state.objSociedades[res.value.idSociedade].qtdOrcamentosConferidos = res.value.qtdOrcamentosConferidos

                } else {
                    const nomeEmpresa: string = promises[index].nomeEmpresa
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