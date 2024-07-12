import moment from "moment";
import Swal from "sweetalert2";
import { reactive } from "vue";
import { iListaMarcasGrupos, iParamGetVendasPorCategoria, iVendaPorCategoria } from "./interfaces";
import serviceVendaPorCategoria from './services/vendaPorCategoria.service'
import utils, { iColumnPrint } from "@/ts/utils";

export const dataHoje = moment().format('YYYY-MM-DD')

export const state = reactive({
    loading: false,
    dataInicial: moment().format('YYYY-MM-DD'),
    dataFinal: moment().format('YYYY-MM-DD'),
    inputElementDataFinal: <HTMLInputElement>{},
    headers: <any>[
        {
            title: 'Vendedor', key: 'VENDEDOR', align: 'start'
        },
        {
            title: 'Valor', key: 'VALOR', align: 'center'
        },
        {
            title: 'Categoria', key: 'GRUPO', align: 'center'
        }
    ],
    dbVendaPorCategoria: <iVendaPorCategoria[]>[],
    listaMarcasGrupos: <iListaMarcasGrupos[]>[],
    selectElementCategoria: <HTMLSelectElement>{},
    selectCategoria: 1
})

export const actions = {
    init() {
        state.inputElementDataFinal = <any>document.getElementById('DATA_FIM')
        state.selectElementCategoria = <any>document.getElementById('CATEGORIA')
        actions.getMarcasGrupos();
        actions.getVendasPorCategoria()
    },

    btnPesquisar() {
        const dataInicioMoment = moment(state.dataInicial)
        const dataFinalMoment = moment(state.dataFinal)
        const diffDatas = dataFinalMoment.diff(dataInicioMoment, 'months')

        if (dataInicioMoment.isAfter(dataFinalMoment)) {
            Swal.fire({
                text: 'A data inicial não pode ser posterior à data final.',
                icon: 'warning',
            })
            return
        }

        if (!dataInicioMoment.isValid() || !dataFinalMoment.isValid()) {
            Swal.fire({
                text: 'Data inicial ou data final inválidas.',
                icon: 'warning',
            })
            return
        }

        if (diffDatas >= 3) {
            Swal.fire({
                text: 'A diferença entre as datas não pode ser superior a 3 meses.',
                icon: 'warning',
            })
            return
        }

        actions.getVendasPorCategoria()
    },

    getClassCorLinha(dados: any) {
        if (dados.index % 2 == 0) {
            return { class: 'cor-zebrada-1' }
        }
    },

    async imprimirVendasPorCategoria() {
        let { dadosToPrint, columns } = actions.getDadosImpresaoArquivo();

        let titulo = `
      <div style="display: flex; justify-content: space-between; width: 100%; margin-top: 10px">
        <span>&nbsp;</span>
        <strong style="font-size: 20px">Venda por Categoria</strong>
      </div>
    `;

        let rodape = `
      <div style="margin-top: 10px">
        <span>Obs.: teste</span>
      </div>
    `;
        try {
            state.loading = true

            await utils.printComCabecalho(columns, dadosToPrint, titulo, rodape);
        } catch (error) {
            console.error(error);
        } finally {
            state.loading = false
        }
    },

    getDadosImpresaoArquivo() {
        let dadosToPrint = state.dbVendaPorCategoria

        let columns: iColumnPrint[] = [
            {
                key: 'VENDEDOR',
                label: "Vendedor",
                width: '70%'
            },
            {
                key: 'VALOR',
                label: "Valor",
            },
            {
                key: 'GRUPO',
                label: "Categoria",
            },
        ];

        return { columns, dadosToPrint };
    },

    formatarDadosImpressao(data) {
        return data.map(item => ({
            ...item,
            VALOR: utils.formatValor(item.VALOR)
        }))
    },

    formatarData(data: string) {
        return moment(data).format('DD/MM/YYYY')
    },

    async getMarcasGrupos() {
        try {
            state.loading = true

            const data = await serviceVendaPorCategoria.getMarcasGrupos()

            state.listaMarcasGrupos = data
        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: 'Ocorreu um erro ao buscar as categorias',
            })
        } finally {
            state.loading = false
        }
    },

    async getVendasPorCategoria() {
        try {
            state.loading = true

            const param: iParamGetVendasPorCategoria = {
                DATA_INICIO: state.dataInicial,
                DATA_FIM: state.dataFinal,
                ID_MARCA_GRUPO: state.selectCategoria
            }

            const data = await serviceVendaPorCategoria.getVendasPorCategoria(param)

            state.dbVendaPorCategoria = data

        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: error?.response?.data?.msg || 'Ocorreu um erro ao buscar as vendas por categoria.',
            })
        } finally {
            state.loading = false
        }
    }
}

export const computeds = {

}
