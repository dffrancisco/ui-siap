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
    headers: <any>[
        { key: 'V_NOME_FUNCIONARIO', title: 'Nome do Funcionário', sortable: true, align: 'center' },
        { key: 'NUM_ORCAMENTO', title: 'Nº Orçamento', sortable: true, align: 'left' },
        { key: 'DATA_ORCAMENTO', title: 'Data Vencimento', sortable: true, align: 'left' },
        { key: 'VALOR', title: 'Valor', sortable: true, align: 'left' },
        { key: 'MES', title: 'Mês', sortable: true, align: 'left' },
        { key: 'ANO', title: 'Ano', sortable: true, align: 'left' },
        { key: 'DIV', title: 'Parcela.', sortable: true, align: 'left' },
    ],
    filtroOptions: [


    ]
});

export const actions = {
    async init() {
        await actions.getMarcas();
    },

    validarInputs(): boolean {


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
                filtro: state.filtro || undefined,
                page: state.page,
                itemsPerPage: state.itemsPerPage,
            };

            const { dadosRelatorio, totalDadosRelatorio }: iParamsValePeca =
                await serviceConsultaValePeças.getDadosParaRelatorio(params);

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
            const data = await serviceConsultaValePeças.getMarcas();
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
                { key: 'V_NOME_FUNCIONARIO', label: 'Nome do Funcionário', align: 'center' },
                { key: 'NUM_ORCAMENTO', label: 'Nº Orçamento', align: 'left' },
                { key: 'DATA_ORCAMENTO', label: 'Data Vencimento', align: 'left' },
                { key: 'VALOR', label: 'Valor', align: 'left' },
                { key: 'MES', label: 'Mês', align: 'left' },
                { key: 'ANO', label: 'Ano', align: 'left' },
                { key: 'DIV', label: 'Parcela.', align: 'left' },
            ];

            const titulo = `
                <div style="text-align: center;">
                    <strong style="font-size: 16px;"> Consulta Vale Peças </strong>
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