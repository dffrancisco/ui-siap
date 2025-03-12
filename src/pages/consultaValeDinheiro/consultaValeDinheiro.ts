import moment from "moment";
import Swal from "sweetalert2";
import { reactive } from "vue";
import serviceConsultaValeDinheiro from './services/consultaValeDinheiro.service';
import { iFuncionarios, iLojas, iResponseVales } from "./interfaces";
import utils, { dataBrasil, formatValor, iColumnPrint } from '@/ts/utils';

export const state = reactive({
    loading: false,
    ano: new Date().getFullYear(),
    idempresa: <iResponseVales[]>[],
    dadosRelatorio: <iResponseVales[]>[],
    funcionarios: <iFuncionarios[]>[],
    codFuncionario: <number[]>[],
    lojas: <iLojas[]>[],
    headers: <any>[
        { title: "Nome do Funcionario", key: "NOME_COMP", sortable: true, align: "left", width: "30%" },
        { title: "Valor", key: "VALOR", sortable: true, align: "right", value: (item: iResponseVales) => formatValor(item.VALOR), width: "20%" },
        { title: "Data", key: "DATA", sortable: true, align: "left", value: (item: iResponseVales) => dataBrasil(item.DATA), width: "20%" },
        { title: "Ano", key: "ANO", sortable: true, align: "center", width: "20%" },
        { title: "Mês", key: "MES", sortable: true, align: "center", width: "20%" },

    ],
});

export const actions = {
    async init() {
        actions.getDadosParaInputs();
    },

    validarInputs() {
        if (!state.ano) {
            Swal.fire({
                icon: "warning",
                text: "Selecione um ano válido."
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
            const params = {
                codFuncionario: state.codFuncionario.length > 0 ? state.codFuncionario : null,
                ano: state.ano
            };

            state.dadosRelatorio = await serviceConsultaValeDinheiro.getDadosParaRelatorio(params);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: 'Erro ao buscar dados do relatório.',
            });
            state.dadosRelatorio = [];
        } finally {
            state.loading = false;
        }
    },

    async getDadosParaInputs() {
        try {
            state.loading = true;
            const data = await serviceConsultaValeDinheiro.getDadosParaInputs();
            state.funcionarios = data.funcionarios;
            state.lojas = data.lojas;
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
            const relatorio = state.dadosRelatorio;
            const relatorioFormatado = actions.formatarDadosImpressao([...relatorio]);

            const columns: iColumnPrint[] = [
                { key: "NOME_COMP", label: "Nome do Funcionario", align: "left" },
                { key: "VALOR", label: "Valor", align: "right" },
                { key: "DATA", label: "Data", align: "left" },
                { key: "ANO", label: "Ano", align: "center" },
                { key: "MES", label: "Mês", align: "center" },
            ];

            const titulo = `
                <div style="display: flex; justify-content: space-between; width: 100%; margin-top: 10px">
                    <span>Ano: ${state.ano}</span>
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
            VALOR: item.VALOR ? utils.formatValor(item.VALOR) : '-----',
        }));
    },

    getClassCorLinha(dados: any) {
        const classe = dados.index % 2 === 0 ? 'cor-zebrada-1' : 'cor-zebrada-2';
        return { class: classe };
    },
};
