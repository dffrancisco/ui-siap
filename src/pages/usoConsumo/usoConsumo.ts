import { reactive } from "vue";
import Swal from "sweetalert2";
import utils, { iColumnPrint } from "@/ts/utils";
import moment from "moment";
import serviceUsoConsumo from "./services/usoConsumo.service";
import { iParamsUsoConsumo, iResponseUsoConsumo, iDadosUsoConsumo } from "./interfaces";

export const state = reactive({
    loading: false,
    dataInicio: moment().startOf("month").format("YYYY-MM-DD"),
    dataFim: moment().endOf("month").format("YYYY-MM-DD"),
    dadosRelatorio: [] as iDadosUsoConsumo[],
    dataInicioImpressao: null,
    dataFimImpressao: null,

    headers: <any>[
        { title: "Data", key: "DATA", sortable: true, align: "left" },
        { title: "Descrição", key: "DESCRICAO", sortable: true, align: "left" },
        { title: "Chave", key: "CHAVE", sortable: true, align: "center" },
        { title: "Valor", key: "VALOR", sortable: true, align: "right" },
    ],
});

export const actions = {
    init: async function () {
        await this.onClickBuscar();
    },

    validarInputs: function () {
        if (!state.dataInicio || !state.dataFim) {
            Swal.fire({
                icon: "error",
                title: "Erro",
                text: "Os campos de data são obrigatórios.",
            });
            return false;
        }

        if (moment(state.dataInicio).isAfter(moment(state.dataFim))) {
            Swal.fire({
                icon: "warning",
                text: "A data de início não pode ser posterior à data de fim!",
            });
            return false;
        }

        const diferencaEmMeses = moment(state.dataFim).diff(moment(state.dataInicio), "months", true);
        if (diferencaEmMeses > 6) {
            Swal.fire({
                icon: "warning",
                text: "O intervalo entre as datas não pode ser maior que 6 meses!",
            });
            return false;
        }

        return true;
    },

    onClickBuscar: async function () {
        if (this.validarInputs()) {
            await this.getDadosParaRelatorio();
        }
    },

    getDadosParaRelatorio: async function () {
        try {
            state.loading = true;

            console.log("Iniciando busca com os parâmetros:", {
                dataInicio: state.dataInicio,
                dataFim: state.dataFim,
            });

            const response = await serviceUsoConsumo.getDadosParaRelatorio({

                dataInicio: state.dataInicio,
                dataFim: state.dataFim,
            });



            if (response && response.length > 0) {
                state.dadosRelatorio = response;
            } else {

                state.dadosRelatorio = [];
            }
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
            Swal.fire({
                icon: "error",
                text: "Erro ao buscar dados do relatório.",
            });
        } finally {
            state.loading = false;
        }
    },

    async onClickImprimir() {
        try {
            state.loading = true;

            const columns: iColumnPrint[] = [

                { key: "DATA", label: "Data", align: "left" },
                { key: "DESCRICAO", label: "Descrição", align: "left" },
                { key: "CHAVE", label: "Chave", align: "center" },
                { key: "VALOR", label: "Valor", align: "right" },
            ];

            const titulo = `
                <div style="display: flex; justify-content: space-between; width: 100%; margin-top: 10px">
                    <span>Período: ${moment(state.dataInicioImpressao).format('DD/MM/YYYY')} até ${moment(state.dataFimImpressao).format('DD/MM/YYYY')}</span>
                    <strong style="font-size: 16px;">Relatório Produtos Vendidos</strong>
                </div>
            `;

            await utils.printComCabecalho(columns, state.dadosRelatorio, titulo);

        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao imprimir o relatório."
            });
        } finally {
            state.loading = false;
        }
    },

    getClassCorLinha: function (dados) {
        const classe = dados.index % 2 === 0 ? "cor-zebrada-1" : "cor-zebrada-2";
        return { class: classe };
    },
};
