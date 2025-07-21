import { reactive } from "vue"
import { getOrcamento } from "../trocarMontador/trocarMontador"
import moment from "moment"
import cabongoService from "./service/cabongo.service"
import { iOrcamento, iParamOrcamento } from "./interface"
import Swal from "sweetalert2"
import { dataBrasil, dataUSA } from "@/ts/utils"

export const state = reactive({
    modalEscolherDataOpened: false,
    dataEnviada: moment().format('DD/MM/YYYY') || '',
    sociedades: [],
    objSociedades: {},
    totalPendentes: 0,
    totalConferidos: 0,
    cnpj: "",
    dataRegex: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
    headers: [
        { title: "Data", width: "240px" },
        { title: "Qtd", key: "COD_PRODUTO" },
    ],
    orcamentos: <iOrcamento[]>[],
    lojasComErro: [],
    requisicaoTamanho: 3
})



export const actions = {
    async init() {
        await actions.getEmpresa()
        await actions.getSociedade()
        actions.getOrcamento()
        state.orcamentos = []
        state.totalPendentes = 0
        state.totalConferidos = 0

    },

    async onclickCardData(pendente: any) {

        try {
            // state dataPendente = await cabongoService.getOrcamentoData(pendente.idSociedade, pendente.cnpj)
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
            state.objSociedades[sociedade.ID_EMPRESA] = sociedade
        })
    },

    async getEmpresa() {
        const cnpj = await cabongoService.getEmpresa()
        state.cnpj = cnpj.CGC_EMPRESA
    },



    async getOrcamento() {

        if (!state.dataRegex.test(state.dataEnviada)) {
            Swal.fire({
                icon: 'warning',
                text: 'Por favor, insira uma data válida.',
            })
            return
        }

        if (!state.dataEnviada) {
            Swal.fire({
                icon: 'warning',
                text: 'Por favor, insira uma data válida.',
            })
            return
        }

        state.orcamentos = []
        state.totalPendentes = 0
        state.totalConferidos = 0

        for (let i = 0; i < state.sociedades.length; i += state.requisicaoTamanho) {

            const lote = state.sociedades.slice(i, i + state.requisicaoTamanho);
            const promises = lote.map((empresa) =>

                cabongoService.getOrcamento({
                    id_sociedade: empresa.ID_EMPRESA,
                    cnpj: state.cnpj,
                    dataOrcamentoPesquisa: moment(state.dataEnviada, 'DD/MM/YYYY').format('YYYY-MM-DD')
                }),


            )
            const resultadoLote = await Promise.allSettled(promises);

            resultadoLote.forEach((res: any) => {
                if (res.status === "fulfilled") {
                    const dados = { ...res.value, ...state.objSociedades[res.value.idSociedade] }
                    state.orcamentos.push(dados);
                    state.totalPendentes += res.value.qtdOrcamentosPendentes || 0;
                    state.totalConferidos += res.value.qtdOrcamentosConferidos || 0;

                } else {
                    state.lojasComErro.push();
                    console.warn("Falha ao buscar orçamento:", res.reason);
                }
            });
        }

    },


}