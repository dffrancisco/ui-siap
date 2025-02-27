import { reactive } from 'vue';
import Swal from 'sweetalert2';
import moment from 'moment';
import serviceConsultaValePecas from './services/consultaValePecas.service';
import { iParamsValePeca, iFuncionario } from './interfaces';
import utils, { iColumnPrint, dataBrasil } from "@/ts/utils";
import { mesesToSelect } from "@/constants/constants";


export const meses = mesesToSelect;
const ano = moment().year();

export const state = reactive({
    loading: false,
    ano: ano,
    dadosRelatorio: [] as iParamsValePeca[],
    itensOrcamento: [] as any[],
    selectedFuncionario: <number[]>[],
    funcionarios: <iFuncionario[]>[],
    modalValeOpened: false,
    total: '',
    dbSelectItem: {} as iParamsValePeca,
    headers: <any>[
        { key: 'V_NOME_FUNCIONARIO', title: 'Nome', sortable: true, align: 'left', width: '80px' },
        { key: 'NUM_ORCAMENTO', title: 'Nº Orçamento', sortable: true, align: 'left', width: '60px' },
        { key: 'DATA_ORCAMENTO', title: 'Vencimento', sortable: true, align: 'left', value: (item: iParamsValePeca) => dataBrasil(item.DATA_ORCAMENTO) },
        { key: 'VALOR', title: 'Valor', sortable: true, align: 'left', width: '50px' },
        { key: 'MES', title: 'Mês', sortable: true, align: 'left', width: '30px' },
        { key: 'ANO', title: 'Ano', sortable: true, align: 'left', width: '30px' },
        { key: 'DIV', title: 'Parcela', sortable: true, align: 'left', width: '60px' },
        {
            key: 'total',
            title: 'Total',
            sortable: true,
            align: 'left',
            value: (item: iParamsValePeca) => {
                const totalMes = state.dadosRelatorio
                    .filter(i => i.MES === item.MES)
                    .reduce((somatoria, armazena) => somatoria + Number(armazena.VALOR || 0), 0);
                return totalMes.toFixed(2);
            }
        },
        { key: 'acao', title: 'Detalhes', sortable: true, align: 'left', width: '20px' },
    ],
});

export const actions = {
    async init() {
        await actions.getFuncionarios();
    },



    validarInputs() {
        if (!state.ano) {
            Swal.fire({
                icon: 'warning',
                text: 'O campo ano é obrigatório.',
            });
            return false;
        }
        actions.getConsultarVales();
        return true;
    },

    async getFuncionarios() {
        state.loading = true;

        try {
            state.funcionarios = await serviceConsultaValePecas.getFuncionarios();
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Ocorreu um erro ao buscar os funcionários.",
            });
        } finally {
            state.loading = false;
        }
    },

    abrirModal(item) {
        state.dbSelectItem = item;
        state.modalValeOpened = true;
    },

    async getConsultarVales() {
        try {
            state.loading = true;

            let param: iParamsValePeca = {
                ano: state.ano,
                cod_funcionarios: state.selectedFuncionario,
            }

            const data = await serviceConsultaValePecas.consultarVales(param);
            state.dadosRelatorio = data;
            return data;
        } catch (error) {
            Swal.fire({
                text: "Erro ao buscar os Vales",
                icon: "error",
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
                { key: 'V_NOME_FUNCIONARIO', label: 'Funcionário', align: 'left' },
                { key: 'NUM_ORCAMENTO', label: 'Orçamento', align: 'left' },
                { key: 'DATA_ORCAMENTO', label: 'Data Venc.', align: 'left' },
                { key: 'VALOR', label: 'Valor', align: 'right' },
                { key: 'MES', label: 'Mês', align: 'center' },
                { key: 'ANO', label: 'Ano', align: 'center' },
                { key: 'DIV', label: 'Parcela', align: 'center' },
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
            DATA_ORCAMENTO: item.DATA_ORCAMENTO ? utils.dataBrasil(item.DATA_ORCAMENTO) : '-----',
            VALOR: item.VALOR ? utils.formatValor(item.VALOR) : '-----',
        }));
    },

    getClassCorLinha(dados: any) {
        let classe = dados.index % 2 == 0 ? 'cor-zebrada-1' : 'cor-zebrada-2';
        return { class: classe };
    },
};
