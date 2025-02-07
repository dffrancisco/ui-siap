import moment from "moment";
import { reactive } from "vue";
import serviceRevisaoAvarias from "./services/relatorioAvarias.service";
import { iDadosRelatorioAvarias, iMarcas } from "./interfaces";
import Swal from "sweetalert2";
import { dataBrasil } from "@/ts/utils";

export const state = reactive({
    loading: false,
    dataInicio: moment().startOf('month').format('YYYY-MM-DD'),
    dataFim: moment().format('YYYY-MM-DD'),
    inputDataFinal: <HTMLInputElement>{},
    dataInicioImpressao: null,
    dataFimImpressao: null,
    marcas: <iMarcas[]>[],
    marcaSelecionada: null,
    dadosRelatorioAvarias: <iDadosRelatorioAvarias>{},
    headers: <any>[
        {
            title: "Data", key: "DATA_HORA_INCLUSAO", sortable: true, align: "left",
            value: (item: any) => dataBrasil(item.DATA_HORA_INCLUSAO)
        },
        { title: "Descrição", key: "DESCRICAO", sortable: true, align: "left" },
        { title: "Chave", key: "CHAVE", sortable: true, align: "center" },
        {
            title: "Valor", key: "VALOR", sortable: true, align: "right",
            // value: (item: iDadosUsoConsumo) => formatValor(item.VALOR) 
        },
    ],
})

export const actions = {
    async init() {
        actions.getMarcas();
        state.inputDataFinal = <any>document.getElementById('dataFim')
    },

    async getMarcas() {
        state.loading = true;
        try {
            let data = await serviceRevisaoAvarias.getMarcas()
            state.marcas = data;
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao buscar as marcas.",
            });
        }
        state.loading = false;
    },

    async getDadosRelatorioAvarias() {
        state.loading = true;
        try {

            let param = {
                dataInicio: state.dataInicio,
                dataFim: state.dataFim,
                marca: state.marcaSelecionada
            }

            let data = await serviceRevisaoAvarias.getDadosRelatorioAvarias(param)
            state.dadosRelatorioAvarias = data;
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao buscar os dados do relatório.",
            });
        }
        state.loading = false;
    },

    getClassCorLinha(dados: any) {
        const classe = dados.index % 2 === 0 ? "cor-zebrada-1" : "cor-zebrada-2";
        return { class: classe };
    },
}