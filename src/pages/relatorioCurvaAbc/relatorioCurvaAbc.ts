import { reactive } from 'vue';
import Swal from 'sweetalert2';
import moment from 'moment';
import serviceRelatorioCurvaAbc from './services/relatorioCurvaAbc.service';
import { iDadosRelatorio, iResponseRelatorio } from './interfaces';
import utils, { iColumnPrint } from "@/ts/utils";

export const state = reactive({
    loading: false,
    curva: [] as string[],
    marca: [] as any[],
    filtro: '',
    numFabricante: '',
    marcas: [] as any[],
    dadosRelatorio: [] as iDadosRelatorio[],
    totalItems: 0,
    itemsPerPage: 30,
    page: 1,
    headers: <any>[

        { key: 'NUM_FABRICANTE', title: 'Nº Fabricante', sortable: true, align: 'left' },
        { key: 'DESC_PRODUTO', title: 'Descrição', sortable: true, align: 'left' },
        { key: 'MARCA', title: 'Marca', sortable: true, align: 'left' },
        { key: 'END_ESTOQUE', title: 'Endereço', sortable: true, align: 'left' },
        { key: 'QUANTIDADE', title: 'Qtd', sortable: true, align: 'right' },
        { key: 'QTD_VENDIDA', title: 'Vendas', sortable: true, align: 'right' },
        { key: 'CURVA_ABC_G', title: 'ABC G.', sortable: true, align: 'center' },
        { key: 'CURVA_ABC_M', title: 'ABC M.', sortable: true, align: 'center' },

    ],

});
;
export const actions = {
    async init() {
        await actions.getMarcas();
        await actions.getDadosParaRelatorio();
    },

    validarInputs(): boolean {
        if (!state.curva.length) {
            Swal.fire({
                icon: 'warning',
                text: 'Selecione uma curva a ser filtrada.',
            });
            return false;
        }

        if (state.numFabricante && state.numFabricante.trim().length === 0) {
            Swal.fire({
                icon: 'warning',
                text: 'Número do fabricante não pode estar vazio.',
            });
            return false;
        }

        return true;
    },

    async getMarcas() {
        try {
            state.loading = true;
            const response = await serviceRelatorioCurvaAbc.getMarcas();

            console.log("getMarcas:", response);

            if (response && response.marca) {
                state.marca = response.marca.map((marca: any) => ({
                    value: marca.ID_MARCA,
                    label: marca.MARCA,
                }));
            } else {
                state.marcas = [];
                Swal.fire({
                    icon: 'warning',
                    text: 'Nenhuma marca encontrada.',
                });
            }
        } catch (error) {
            console.error("Erro ao buscar marcas:", error);
            Swal.fire({
                icon: 'error',
                text: 'Erro ao buscar marcas',
            });
        } finally {
            state.loading = false;
        }
    },

    getClassCorLinha(dados: any) {
        let classe = dados.index % 2 == 0 ? 'cor-zebrada-1' : 'cor-zebrada-2'
        return { class: classe }
    },

    async getDadosParaRelatorio() {
        if (!actions.validarInputs()) return;

        try {
            state.loading = true;

            const params = {
                curva: state.curva.length > 0 ? state.curva : undefined,
                marca: state.marcas.length > 0 ? state.marcas : undefined,
                filtro: state.filtro,
                numFabricante: state.numFabricante ? state.numFabricante.trim() : undefined,
                page: state.page,
                itemsPerPage: state.itemsPerPage,
            };

            const data: iResponseRelatorio = await serviceRelatorioCurvaAbc.getDadosParaRelatorio(params);

            if (data && data.dadosRelatorio.length > 0) {
                state.dadosRelatorio = data.dadosRelatorio;
                state.totalItems = data.totalDadosRelatorio[0]?.TOTAL || 0;
            } else {
                state.dadosRelatorio = [];
                state.totalItems = 0;
                Swal.fire({
                    icon: 'info',
                    text: 'Nenhum dado foi encontrado com o filtro atual.',
                });
            }

        } catch (error) {
            console.error("Erro ao buscar os produtos", error);
            Swal.fire({
                icon: 'error',
                text: 'Erro ao buscar itens ou produtos.',
            });
        } finally {
            state.loading = false;
        }
    },

    async onClickImprimir() {
        if (!state.dadosRelatorio.length) {
            Swal.fire({
                icon: 'info',
                text: 'Não a dados para realizar a impressão.',
            });
            return;
        }

        try {
            state.loading = true;
            let relatorio = state.dadosRelatorio;
            const relatorioAjustado = actions.formatarDadosImpressao([...relatorio]);

            const columns: iColumnPrint[] = [
                { key: 'NUM_FABRICANTE', label: 'Nº Fabricante', align: 'left' },
                { key: 'DESC_PRODUTO', label: 'Descrição', align: 'left' },
                { key: 'MARCA', label: 'Marca', align: 'left' },
                { key: 'END_ESTOQUE', label: 'Endereço', align: 'left' },
                { key: 'QUANTIDADE', label: 'Qtd', align: 'right' },
                { key: 'QTD_VENDIDA', label: 'Vendas', align: 'right' },
                { key: 'CURVA_ABC_G', label: 'ABC G.', align: 'center' },
                { key: 'CURVA_ABC_M', label: 'ABC M.', align: 'center' },

            ];

            const titulo = `
                <div style="text-align: center;">
                    <strong style="font-size: 16px;"> Relatorio Curva ABC </strong>
                </div>
            `;

            await utils.printComCabecalho(columns, relatorioAjustado, titulo);
        } catch (error) {
            console.error("Erro ao imprimir o relatorio:", error);
            Swal.fire({
                icon: 'error',
                text: 'Erro ao imprimir relatorio:',
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

    limparFiltros() {
        state.curva = [];
        state.numFabricante = '';
        state.page = 1;
        state.itemsPerPage = 30;
    },

    updatePage(page: number) {
        state.page = page;
        actions.getDadosParaRelatorio();
    },
};
