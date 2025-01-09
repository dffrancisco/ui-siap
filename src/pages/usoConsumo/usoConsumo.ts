import { reactive } from "vue";
import Swal from "sweetalert2";
import utils, { iColumnPrint, dataBrasil, formatValor } from "@/ts/utils";
import moment from "moment";
import serviceUsoConsumo from "./services/usoConsumo.service";
import { iDadosUsoConsumo } from "./interfaces";

export const state = reactive({
    loading: false,
    dataInicio: moment().startOf("month").format("YYYY-MM-DD"),
    dataFim: moment().endOf("month").format("YYYY-MM-DD"),
    dadosRelatorio: <iDadosUsoConsumo[]>[],
    dataInicioImpressao: null,
    dataFimImpressao: null,
    inputDataFinal: <HTMLInputElement>{},

    headers: <any>[
        { title: "Data", key: "DATA", sortable: true, align: "left", value: (item: iDadosUsoConsumo) => dataBrasil(item.DATA) },
        { title: "Descrição", key: "DESCRICAO", sortable: true, align: "left" },
        { title: "Chave", key: "CHAVE", sortable: true, align: "center" },
        { title: "Valor", key: "VALOR", sortable: true, align: "right", value: (item: iDadosUsoConsumo) => formatValor(item.VALOR) },
    ],
});

export const actions = {
    async init() {
        state.inputDataFinal = <any>document.getElementById("dataFim");
        await this.onClickBuscar();
    },

    validarInputs() {
        if (!state.dataInicio || !state.dataFim) {
            Swal.fire({
                icon: "warning",
                text: "Preencha data inicio e data fim."
            });
            return false;
        }

        if (moment(state.dataInicio).isAfter(moment(state.dataFim))) {
            Swal.fire({
                icon: "warning",
                text: "A data de início não pode ser posterior à data de fim."
            });
            return false;
        }

        const dataInicioMoment = moment(state.dataInicio);
        const dataFimMoment = moment(state.dataFim);
        const diferencaEmMeses = dataFimMoment.diff(dataInicioMoment, "months", true);
        if (diferencaEmMeses > 12) {
            Swal.fire({
                icon: "warning",
                text: "O intervalo entre as datas não pode ser maior que 12 meses."
            });
            return false;
        }

        return true;
    },

    async onClickBuscar() {
        if (actions.validarInputs()) {
            await actions.getDadosParaRelatorio();
        }
    },

    async getDadosParaRelatorio() {
        try {
            state.loading = true;

            const data = await serviceUsoConsumo.getDadosParaRelatorio({
                dataInicio: state.dataInicio,
                dataFim: state.dataFim,
            });

            if (data) {

                state.dadosRelatorio = data.map((item: iDadosUsoConsumo) => ({
                    ...item,
                    DATA: (item.DATA),
                    VALOR: (item.VALOR),
                }));
                state.dataInicioImpressao = state.dataInicio;
                state.dataFimImpressao = state.dataFim;
            } else {
                Swal.fire({
                    icon: "warning",
                    text: "Não foram encontrados dados para os filtros aplicados.",
                });
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
            let relatorio = state.dadosRelatorio
            const relatorioFormatado = actions.formatarDadosImpressao([...relatorio])

            const columns: iColumnPrint[] = [
                { key: "DATA", label: "Data", align: "left" },
                { key: "DESCRICAO", label: "Descrição", align: "left" },
                { key: "CHAVE", label: "Chave", align: "center" },
                { key: "VALOR", label: "Valor", align: "right" },
            ];

            const titulo = `
                <div style="display: flex; justify-content: space-between; width: 100%; margin-top: 10px">
                    <span>Período: ${moment(state.dataInicioImpressao).format(
                "DD/MM/YYYY"
            )} até ${moment(state.dataFimImpressao).format("DD/MM/YYYY")}</span>
                    <strong style="font-size: 16px;">Relatório Uso Consumo</strong>
                </div>
            `;

            await utils.printComCabecalho(columns, relatorioFormatado, titulo);

        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao imprimir o relatório.",
            });
        } finally {
            state.loading = false;
        }
    },

    formatarDadosImpressao(data) {
        return data.map(item => ({
            ...item,
            DATA: item.DATA ? utils.dataBrasil(item.DATA) : '-----',
            VALOR: item.VALOR ? utils.formatValor(item.VALOR) : '-----',
        }));
    },

    getClassCorLinha(dados: any) {
        const classe = dados.index % 2 === 0 ? "cor-zebrada-1" : "cor-zebrada-2";
        return { class: classe };
    },
};
