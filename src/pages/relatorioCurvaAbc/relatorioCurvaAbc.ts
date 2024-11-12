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
    filtro: '',
    numFabricante: '',
    marcas: [] as any[],
    dadosRelatorio: [] as iDadosRelatorio[],
    totalItems: 0,
    searchMarca: '',
    itemsPerPage: 30,
    page: 1,
    headers: <any>[
        { key: 'NUM_FABRICANTE', title: 'Nº Fabricante', sortable: true, align: 'centrer' },
        { key: 'DESC_PRODUTO', title: 'Descrição', sortable: true, align: 'left' },
        { key: 'MARCA', title: 'Marca', sortable: true, align: 'left' },
        { key: 'END_ESTOQUE', title: 'Endereço', sortable: true, align: 'left' },
        { key: 'QUANTIDADE', title: 'Qtd', sortable: true, align: 'left' },
        { key: 'QTD_VENDIDA', title: 'Vendas', sortable: true, align: 'left' },
        { key: 'CURVA_ABC_G', title: 'ABC G.', sortable: true, align: 'left' },
        { key: 'CURVA_ABC_M', title: 'ABC M.', sortable: true, align: 'left' },
    ],
});

export const actions = {
    async init() {
        await actions.getMarcas();
        await actions.getDadosParaRelatorio();
    },


    validarInputs(): boolean {
        if (!state.curva.length) {
            return false;
        }


        return true;
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

    handleSearchMarca() {
        if (state.searchMarca) {
            state.dbSelectMarca = state.marcas.filter((marca: any) =>
                marca.label.toLowerCase().includes(state.searchMarca.toLowerCase())
            );
        } else {
            state.dbSelectMarca = [...state.marcas];
        }
    },

    async getDadosParaRelatorio() {
        if (!actions.validarInputs()) return;

        try {
            state.loading = true;


            const params = {
                curva: state.curva.length > 0 ? state.curva : undefined,
                marca: state.dbSelectMarca,
                filtro: state.filtro || undefined,   //alterei para undefined

                page: state.page,
                itemsPerPage: state.itemsPerPage,
            };

            const data: iResponseRelatorio = await serviceRelatorioCurvaAbc.getDadosParaRelatorio(params);

            state.dadosRelatorio = data.dadosRelatorio;
            state.totalItems = data.totalDadosRelatorio[0].TOTAL;



        } catch (error) {
            console.error("Erro ao buscar os produtos", error);
            Swal.fire({
                icon: 'info',
                text: 'Selecione uma marca para realizar o filtro',
            });
        } finally {
            state.loading = false;
        }
    },

    async onClickImprimir() {
        if (!state.dadosRelatorio.length) {
            Swal.fire({
                icon: 'info',
                text: 'Não há dados para realizar a impressão.',
            });
            return;
        }

        try {
            state.loading = true;
            let relatorio = state.dadosRelatorio;
            const relatorioAjustado = actions.formatarDadosImpressao([...relatorio]);

            if (!relatorioAjustado || !relatorioAjustado.length) {
                Swal.fire({
                    icon: 'info',
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
            console.error("Erro ao imprimir o relatorio:", error);
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

    getClassCorLinha(dados: any) {
        let classe = dados.index % 2 == 0 ? 'cor-zebrada-1' : 'cor-zebrada-2';
        return { class: classe };
    },

    updatePage(page: number) {
        if (page > 0 && page <= Math.ceil(state.totalItems / state.itemsPerPage)) {
            state.page = page;
            actions.getDadosParaRelatorio();
        }
    },
};
