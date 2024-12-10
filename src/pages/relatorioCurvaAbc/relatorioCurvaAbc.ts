import { reactive } from 'vue';
import Swal from 'sweetalert2';
import moment from 'moment';
import serviceRelatorioCurvaAbc from './services/relatorioCurvaAbc.service';
import { iDadosRelatorio, iMarcas, iResponseRelatorio, iCount } from './interfaces';
import utils, { iColumnPrint } from "@/ts/utils";


export const state = reactive({
    loading: false,
    curva: [] as string[],
    dbSelectMarca: [] as any[],
    filtro: 'CURVA_ABC_G',
    numFabricante: '',
    marcas: [] as any[],
    dadosRelatorio: [] as iDadosRelatorio[],
    totalItems: 0,
    itemsPerPage: 30,
    page: 1,
    headers: <any>[
        { key: 'NUM_FABRICANTE', title: 'Nº Fabricante', sortable: true, align: 'center' },
        { key: 'DESC_PRODUTO', title: 'Descrição', sortable: true, align: 'left' },
        { key: 'MARCA', title: 'Marca', sortable: true, align: 'left' },
        { key: 'END_ESTOQUE', title: 'Endereço', sortable: true, align: 'left' },
        { key: 'QUANTIDADE', title: 'Qtd', sortable: true, align: 'left' },
        { key: 'QTD_VENDIDA', title: 'Vendas', sortable: true, align: 'left' },
        { key: 'CURVA_ABC_G', title: 'ABC G.', sortable: true, align: 'left' },
        { key: 'CURVA_ABC_M', title: 'ABC M.', sortable: true, align: 'left' },
    ],
    curvasOptions: [
        { value: 'AA', label: 'AA' },
        { value: 'A', label: 'A' },
        { value: 'B', label: 'B' },
        { value: 'C', label: 'C' },
        { value: 'D', label: 'D' },
        { value: 'E', label: 'E' },
        { value: 'F', label: 'F' },
    ],
    filtroOptions: [
        { value: 'CURVA_ABC_G', label: 'Curva ABC Geral' },
        { value: 'CURVA_ABC_M', label: 'Curva ABC Marca' },
    ]
});

export const actions = {
    async init() {
        await actions.getMarcas();
    },

    validarInputs(): boolean {
        if (!state.curva || state.curva.length === 0) {
            Swal.fire({
                icon: 'warning',
                text: 'Selecione uma curva para realizar o filtro.',
            });
            return false;
        }

        if (!state.filtro) {
            Swal.fire({
                icon: 'warning',
                text: 'Seleção de filtro obrigatória.',
            });
            return false;
        }

        if (state.filtro === 'CURVA_ABC_M' && (!state.dbSelectMarca || state.dbSelectMarca.length === 0)) {
            Swal.fire({
                icon: 'warning',
                text: 'Selecione uma marca para realizar o filtro quando usar "Curva ABC Marca".',
            });
            return false;
        }

        return true;
    },

    async buscarDadosComValidacao() {
        if (!actions.validarInputs()) {
            return;
        }
        await actions.getDadosParaRelatorio();
    },

    async getDadosParaRelatorio() {
        try {
            state.loading = true;

            const params = {
                curva: state.curva.length > 0 ? state.curva : undefined,
                marca: state.dbSelectMarca,
                filtro: state.filtro || undefined,
                page: state.page,
                itemsPerPage: state.itemsPerPage,
            };

            const { dadosRelatorio, totalDadosRelatorio }: iResponseRelatorio =
                await serviceRelatorioCurvaAbc.getDadosParaRelatorio(params);

            state.dadosRelatorio = dadosRelatorio;
            state.totalItems = totalDadosRelatorio[0]?.TOTAL || 0;
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



    async getMarcas() {
        try {
            state.loading = true;
            const data = await serviceRelatorioCurvaAbc.getMarcas();
            state.marcas = data.map((marca: iMarcas) => ({
                value: marca.ID_MARCA,
                label: marca.MARCA,
            }));
            state.dbSelectMarca = [];
        } catch (error) {
            console.error("Erro ao buscar marca:", error);
            Swal.fire({
                icon: 'error',
                text: 'Erro ao buscar marcas',
            });
        } finally {
            state.loading = false;
        }
    },

    async onClickImprimir() {
        if (!actions.validarInputs()) {
            return;
        }

        if (!state.dadosRelatorio) {
            Swal.fire({
                icon: 'warning',
                text: 'Não há dados para realizar a impressão.',
            });
            return;
        }

        try {
            state.loading = true;
            let relatorio = state.dadosRelatorio;
            const relatorioAjustado = actions.formatarDadosImpressao([...relatorio]);

            if (!relatorioAjustado || !relatorioAjustado) {
                Swal.fire({
                    icon: 'warning',
                    text: 'Não há dados ajustados para imprimir.',
                });
                return;
            }

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
                    <strong style="font-size: 16px;"> Relatório Curva ABC </strong>
                </div>
            `;

            await utils.printComCabecalho(columns, relatorioAjustado, titulo);
        } catch (error) {
            console.error("Erro ao imprimir o relatório:", error);
            Swal.fire({
                icon: 'error',
                text: 'Erro ao imprimir relatório.',
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
    updatePage(newPage: number) {
        state.page = newPage;
        actions.getDadosParaRelatorio();
    },


    getClassCorLinha(dados: any) {
        let classe = dados.index % 2 == 0 ? 'cor-zebrada-1' : 'cor-zebrada-2';
        return { class: classe };
    },
};