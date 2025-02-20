import { reactive } from 'vue';
import Swal from 'sweetalert2';
import moment from 'moment';
import serviceConsultaValePeças from './services/consultaValePeças.service';
import { iParamsValePeca } from './interfaces';
import utils, { iColumnPrint } from "@/ts/utils";
import { mesesToSelect } from "@/constants/constants";

export const meses = mesesToSelect;
const ano = moment().year();
const mes = moment().month() + 1;

export const state = reactive({
    loading: false,
    mes: mes,
    ano: ano || null,
    filtro: '',
    numFabricante: '',
    marcas: [] as any[],
    dadosRelatorio: [] as iParamsValePeca[],
    totalItems: 0,
    itemsPerPage: 30,
    page: 1,
    dbSelectItem: null,
    dataInicio: '',
    dataFim: '',
    mesSelecionado: null,
    numeroOrcamento: null,
    funcionario: [],
    headers: [
        { key: 'V_NOME_FUNCIONARIO', title: 'Nome do Funcionário', sortable: true, align: 'center' },
        { key: 'NUM_ORCAMENTO', title: 'Nº Orçamento', sortable: true, align: 'left' },
        { key: 'DATA_ORCAMENTO', title: 'Data Vencimento', sortable: true, align: 'left' },
        { key: 'VALOR', title: 'Valor', sortable: true, align: 'left' },
        { key: 'MES', title: 'Mês', sortable: true, align: 'left' },
        { key: 'ANO', title: 'Ano', sortable: true, align: 'left' },
        { key: 'DIV', title: 'Parcela.', sortable: true, align: 'left' },
    ],
    filtroOptions: mesesToSelect.map(mes => ({ value: mes.value, text: mes.title }))
});

export const actions = {
    async init() {
        await actions.getFuncionarios();
    },

    validarInputs(): boolean {

        if (!state.dataInicio || !state.dataFim) {
            Swal.fire({
                icon: 'warning',
                text: 'Selecione o período para consulta'
            });
            return false;
        }
        return true;
    },

    async buscarDadosComValidacao() {
        if (!actions.validarInputs()) return;
        await actions.getConsultarValePeca();
    },

    async getConsultarValePeca() {
        try {
            state.loading = true;

            const params: iParamsValePeca = {
                DATA_ORCAMENTO: state.dataInicio,
                DATA: state.dataFim,
                COD_FUNCIONARIO: state.funcionario.length ? state.funcionario[0].value : null,
                NUM_ORCAMENTO: state.numeroOrcamento || null
            };

            const response = await serviceConsultaValePeças.consultarValePeca(params);

            state.dadosRelatorio = response;
            state.totalItems = response.length;
        } catch (error) {
            console.error("Erro ao obter os dados:", error);
            Swal.fire({
                icon: 'error',
                text: 'Erro ao buscar dados para o relatório.',
            });
        } finally {
            state.loading = false;
        }
    },

    async getFuncionarios() {
        try {
            state.loading = true;
            const response = await serviceConsultaValePeças.getFuncionarios();
            state.funcionario = response.map((func: { COD_FUNCIONARIO: number; NOME_FUNCIONARIO: string }) => ({
                value: func.COD_FUNCIONARIO,
                text: func.NOME_FUNCIONARIO
            }));
        } catch (error) {
            console.error("Erro ao buscar funcionários:", error);
            Swal.fire({
                icon: 'error',
                text: 'Erro ao carregar lista de funcionários',
            });
        } finally {
            state.loading = false;
        }
    },

    async onClickImprimir() {
        if (!actions.validarInputs() || !state.dadosRelatorio?.length) {
            Swal.fire({
                icon: 'warning',
                text: 'Não há dados para realizar a impressão.',
            });
            return;
        }

        try {
            state.loading = true;

            const columns: iColumnPrint[] = [
                { key: 'V_NOME_FUNCIONARIO', label: 'Funcionário', align: 'center' },
                { key: 'NUM_ORCAMENTO', label: 'Orçamento', align: 'left' },
                { key: 'DATA_ORCAMENTO', label: 'Data Venc.', align: 'left' },
                { key: 'VALOR', label: 'Valor', align: 'right' },
                { key: 'MES', label: 'Mês', align: 'center' },
                { key: 'ANO', label: 'Ano', align: 'center' },
                { key: 'DIV', label: 'Parcela', align: 'center' },
            ];

            const titulo = `
                <div style="text-align: center;">
                    <strong style="font-size: 16px;">Relatório de Vale Peças</strong>
                    <div style="font-size: 14px;">Período: ${state.dataInicio} à ${state.dataFim}</div>
                </div>
            `;

            await utils.printComCabecalho(columns, state.dadosRelatorio, titulo);
        } catch (error) {
            console.error("Erro ao imprimir:", error);
            Swal.fire({
                icon: 'error',
                text: 'Erro ao gerar relatório impresso.',
            });
        } finally {
            state.loading = false;
        }
    },

    // Métodos auxiliares
    formatarDadosImpressao(data: any[]) {
        return data.map(item => ({
            ...item,
            ULTIMA_ENTRADA: item.ULTIMA_ENTRADA ? moment(item.ULTIMA_ENTRADA).format('DD/MM/YYYY') : '----',
        }));
    },
    updatePage(newPage: number) {
        state.page = newPage;
        actions.getConsultarValePeca();
    },


    getClassCorLinha(dados: any) {
        let classe = dados.index % 2 == 0 ? 'cor-zebrada-1' : 'cor-zebrada-2';
        return { class: classe };
    },
};
