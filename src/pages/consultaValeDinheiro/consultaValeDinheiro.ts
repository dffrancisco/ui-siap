
import Swal from "sweetalert2";
import { reactive } from "vue";
import serviceConsultaValeDinheiro from './services/consultaValeDinheiro.service';
import { iFuncionarios, iLojas, iResponseVales } from "./interfaces";
import utils, { dataBrasil, formatValor, iColumnPrint } from '@/ts/utils';
import { mesesToSelect } from "../../constants/constants";

export const state = reactive({
    loading: false,
    ano: new Date().getFullYear(),

    selectedFuncionario: <iFuncionarios>{},
    dadosRelatorio: <iResponseVales[]>[],
    funcionarios: <iFuncionarios[]>[],
    codFuncionario: <number[]>[],
    lojas: <iLojas[]>[],
    headers: <any>[
        { title: "Nome do Funcionario", key: "NOME_COMP", sortable: true, align: "left", width: "30%" },
        { title: "Valor", key: "VALOR", sortable: true, align: "left", value: (item: iResponseVales) => formatValor(item.VALOR), width: "20%" },
        { title: "Data", key: "DATA", sortable: true, align: "left", value: (item: iResponseVales) => dataBrasil(item.DATA), width: "20%" },
        { title: "Ano", key: "ANO", sortable: true, align: "left", width: "15%" },
        {
            title: "Mês",
            key: "MES",
            sortable: true,
            align: "left",
            value: (item: iResponseVales) => {
                const mesEncontrado = mesesToSelect.find(mes => mes.value === item.MES);
                return mesEncontrado ? mesEncontrado.title : "";
            },
            width: "15%"
        },
        { title: "Forma de Pagamento", key: "FORMA_PAGAMENTO", sortable: true, align: "left", width: "20%", value: (item: iResponseVales) => item.FORMA_PAGAMENTO === "D" ? "Dinheiro" : "Pix", },
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
            state.dadosRelatorio = await serviceConsultaValeDinheiro.getDadosParaRelatorio(
                params.codFuncionario,
                params.ano
            );
        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: 'Erro ao buscar dados do relatório.',
            });
            state.dadosRelatorio;
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
            if (!state.dadosRelatorio || state.dadosRelatorio.length === 0) {
                Swal.fire({ icon: "warning", text: "Nenhum dado disponível para impressão." });
                return;
            }

            state.loading = true;
            const relatorioAjustado = actions.formatarDadosImpressao(state.dadosRelatorio).map(item => ({
                ...item,
                MES: (() => {
                    const mesEncontrado = mesesToSelect.find(mes => mes.value === item.MES);
                    return mesEncontrado ? mesEncontrado.title : "";
                })(),
                FORMA_PAGAMENTO: item.FORMA_PAGAMENTO === "D" ? "Dinheiro" : "Pix",
            }));

            const columns: iColumnPrint[] = [
                { key: "NOME_COMP", label: "Nome do Funcionario", align: "left" },
                { key: "VALOR", label: "Valor", align: "left" },
                { key: "DATA", label: "Data", align: "left" },
                { key: "ANO", label: "Ano", align: "left" },
                { key: "MES", label: "Mês", align: "left" },
                { key: "FORMA_PAGAMENTO", label: "Forma de Pagamento", align: "left" },
            ];

            const titulo = `
            <div style="text-align: center; margin-top: 10px;">
            <strong style="font-size: 16px;">Consulta Vale Dinheiro</strong>
            </div>
            `;

            await utils.printComCabecalho(columns, relatorioAjustado, titulo);
        } catch (error) {
            console.error("Erro ao imprimir o relatório:", error);
            Swal.fire({ icon: "error", text: "Erro ao imprimir o relatório." });
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
        const classe = dados.index % 2 === 0 ? 'cor-zebrada-1' : 'cor-zebrada-2';
        return { class: classe };
    },
};
