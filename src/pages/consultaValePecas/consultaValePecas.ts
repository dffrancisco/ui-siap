import { reactive, computed } from 'vue';
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
    dbSelectItem: {} as iParamsValePeca,
    currentMes: null as number | null,
    headers: <any>[
        { key: 'NUM_ORCAMENTO', title: 'Nº Orçamento', sortable: true, align: 'left', width: '100px' },
        { key: 'DATA_ORCAMENTO', title: 'Vencimento', sortable: true, align: 'left', value: (item: iParamsValePeca) => dataBrasil(item.DATA_ORCAMENTO), width: '90px' },
        { key: 'VALOR', title: 'Valor', sortable: true, align: 'left', width: '100px' },
        { key: 'MES', title: 'Mês', sortable: true, align: 'left', width: '100px' },
        { key: 'ANO', title: 'Ano', sortable: true, align: 'left', width: '90px' },
        { key: 'DIV', title: 'Parcela', sortable: true, align: 'left', width: '100px' },
        { key: 'acao', title: 'Detalhes', sortable: true, align: 'left', width: '100px' },
    ],
});

export const totalGeral = computed(() => {
    return state.dadosRelatorio.reduce((acc, item) => acc + Number(item.VALOR || 0), 0).toFixed(2);
});

export const getMonthName = (monthNumber: number): string => {
    return meses.find((m) => m.value === monthNumber)?.title || "";
};



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
        if (state.ano > moment().year()) {
            Swal.fire({
                icon: 'warning',
                text: 'O ano não pode ser maior que o ano atual.',
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
                { key: 'V_NOME_FUNCIONARIO', label: 'Funcionário', align: 'left', width: '150px' },
                { key: 'NUM_ORCAMENTO', label: 'Orçamento', align: 'left', width: '100px' },
                { key: 'DATA_ORCAMENTO', label: 'Data Venc.', align: 'left', width: '100px' },
                { key: 'VALOR', label: 'Valor', align: 'right', width: '100px' },
                { key: 'MES', label: 'Mês', align: 'center', width: '50px' },
                { key: 'ANO', label: 'Ano', align: 'center', width: '50px' },
                { key: 'DIV', label: 'Parcela', align: 'center', width: '100px' },
            ];

            const titulo = `
                    <div style="display: flex; justify-content: space-between; width: 100%; margin-top: 10px">
                        <span>Ano do filtro: ${moment(state.ano).format(
                "DD/MM/YYYY"
            )} 
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
