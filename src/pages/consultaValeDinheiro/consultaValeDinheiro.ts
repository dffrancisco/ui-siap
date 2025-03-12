
import moment from "moment";
import Swal from "sweetalert2";
import { reactive } from "vue";
import serviceConsultaValeDinheiro from './services/consultaValeDinheiro.service';
import { iFuncionarios, iLojas, iResponseVales } from "./interfaces";
import utils, { dataBrasil, formatValor, iColumnPrint } from '@/ts/utils';



export const state = reactive({
    loading: false,
    dataInicioImpressao: null,
    cod_funcionario: '',
    dataFimImpressao: null,
    dadosRelatorio: <iResponseVales[]>[],
    funcionarios: <iFuncionarios[]>[],
    selectedFuncionario: <number[]>[],
    lojas: <iLojas[]>[],
    inputDataFinal: <HTMLInputElement>{},
    dataInicio: moment().startOf("month").format("YYYY-MM-DD"),
    dataFim: moment().endOf("month").format("YYYY-MM-DD"),
    headers: <any>[
        { title: "Nome do Funcionario", key: "NOME_COMP", sortable: true, align: "left", width: "30%" },
        { title: "Data", key: "DATA", sortable: true, align: "left", value: (item: iResponseVales) => dataBrasil(item.DATA), width: "20%" },
        { title: "Valor", key: "VALOR", sortable: true, align: "right", value: (item: iResponseVales) => formatValor(item.VALOR), width: "20%" },
        { title: "Mês", key: "MES", sortable: true, align: "center", width: "15%" },
        { title: "Ano", key: "ANO", sortable: true, align: "center", width: "15%" },
    ],
})

export const actions = {
    async init() {
        state.inputDataFinal = <any>document.getElementById("dataFim");
        actions.validarInputs()
        actions.getDadosParaInputs()
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

            const data = await serviceConsultaValeDinheiro.getDadosParaRelatorio(
                state.cod_funcionario,
                state.dataInicio,
                state.dataFim
            );

            if (data) {

                state.dadosRelatorio = Array.isArray(data) ? data.map((item: iResponseVales) => ({
                    ...item,
                    DATA: (item.DATA),
                    VALOR: (item.VALOR),
                })) : [];
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

    async getDadosParaInputs() {
        try {
            state.loading = true;
            const data = await serviceConsultaValeDinheiro.getDadosParaInputs();
            state.funcionarios = data.funcionarios
            state.lojas = data.lojas

        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao trazer os dados iniciais!"
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
                { key: "NOME_COMP", label: "Nome do Funcionario", align: "left" },
                { key: "DATA", label: "Data", align: "left" },
                { key: "VALOR", label: "Valor", align: "right" },
                { key: "MES", label: "Mês", align: "center" },
                { key: "ANO", label: "Ano", align: "center" },
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
        let classe = dados.index % 2 == 0 ? 'cor-zebrada-1' : 'cor-zebrada-2'
        return { class: classe }
    },




}