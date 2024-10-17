import moment from "moment";
import Swal from "sweetalert2";
import { reactive } from "vue";
import serviceRelatorioCurvaAbc from './services/relatorioCurvaAbc.service';
import { iDadosRelatorio, iResponseRelatorio } from "./interfaces";
import utils, { iColumnPrint } from "@/ts/utils";

export const state = reactive({
    loading: false,
    curva: "",
    marca: null,
    filtro: "",
    numFabricante: "",
    marcas: [],
    dadosRelatorio: <iDadosRelatorio[]>[],
    totalItems: 0,
    itemsPerPage: 30,
    page: 1,
    headers: <any>[
        { text: "Nº Fabricante", key: "NUM_FABRICANTE", sortable: true, align: 'left' },
        { text: "Ult. Entrada", key: "ULTIMA_ENTRADA", sortable: true, align: 'left' },
        { text: "Descrição", key: "DESCRICAO", sortable: true, align: 'left' },
        { text: "Marca", key: "MARCA", sortable: true, align: 'left' },
        { text: "Endereço", key: "ENDERECO", sortable: true, align: 'left' },
        { text: "Qtd", key: "QUANTIDADE", sortable: true, align: 'right' },
        { text: "Vendas", key: "VENDAS", sortable: true, align: 'right' },
        { text: "ABC G.", key: "ABC_GERAL", sortable: true, align: 'center' },
        { text: "ABC M.", key: "ABC_MARCA", sortable: true, align: 'center' },
    ],
});

// Ações
export const actions = {

    async init() {
        await actions.getDadosParaInputs();
        await actions.getDadosParaRelatorio();
    },

    validarInputs() {
        if (!state.curva) {
            Swal.fire({
                icon: "warning",
                text: "Selecione uma curva para continuar."
            });
            return false;
        }
        return true;
    },

    async getDadosParaInputs() {
        try {
            state.loading = true;
            const data = await serviceRelatorioCurvaAbc.getDadosParaInputs();

            state.marcas = data.marcas;
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao trazer os dados iniciais!"
            });
        } finally {
            state.loading = false;
        }
    },

    async getDadosParaRelatorio() {
        if (!actions.validarInputs()) return;

        try {
            state.loading = true;
            const params = {
                curva: [state.curva],
                marca: state.marca,
                filtro: state.filtro,
                numFabricante: state.numFabricante,
                page: state.page,
                itemsPerPage: state.itemsPerPage,
            };

            const data: iResponseRelatorio = await serviceRelatorioCurvaAbc.getDadosParaRelatorio(params);
            state.dadosRelatorio = data.dadosRelatorio;
            state.totalItems = data.totalDadosRelatorio[0].TOTAL;

        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao trazer os dados para o relatório!"
            });
        } finally {
            state.loading = false;
        }
    },

    updatePage(newPage: number) {
        state.page = newPage;
        actions.getDadosParaRelatorio();
    },

    async onClickImprimir() {
        try {
            state.loading = true;
            const relatorio = state.dadosRelatorio;
            const relatorioAjustado = actions.formatarDadosImpressao([...relatorio]);

            const columns: iColumnPrint[] = [
                { key: 'NUM_FABRICANTE', label: 'Nº Fabricante', width: '15%', align: 'left' },
                { key: 'ULTIMA_ENTRADA', label: 'Ult. Entrada', width: '15%', align: 'left' },
                { key: 'DESCRICAO', label: 'Descrição', width: '20%', align: 'left' },
                { key: 'MARCA', label: 'Marca', width: '10%', align: 'left' },
                { key: 'ENDERECO', label: 'Endereço', width: '10%', align: 'left' },
                { key: 'QUANTIDADE', label: 'Qtd', width: '10%', align: 'right' },
                { key: 'VENDAS', label: 'Vendas', width: '10%', align: 'right' },
                { key: 'ABC_GERAL', label: 'ABC G.', width: '5%', align: 'center' },
                { key: 'ABC_MARCA', label: 'ABC M.', width: '5%', align: 'center' },
            ];

            const titulo = `
                <div style="text-align: center;">
                    <strong style="font-size: 16px;">Relatório Curva ABC</strong>
                </div>
            `;

            await utils.printComCabecalho(columns, relatorioAjustado, titulo);

        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao imprimir o relatório."
            });
        } finally {
            state.loading = false;
        }
    },

    formatarDadosImpressao(data: any[]) {
        return data.map(item => ({
            ...item,
            ULTIMA_ENTRADA: item.ULTIMA_ENTRADA ? moment(item.ULTIMA_ENTRADA).format('DD/MM/YYYY') : '----',
        }));
    },
};
