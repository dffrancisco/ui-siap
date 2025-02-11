import moment from "moment";
import { reactive } from "vue";
import serviceRevisaoAvarias from "./services/relatorioAvarias.service";
import { iDadosRelatorioAvarias, iMarcas } from "./interfaces";
import Swal from "sweetalert2";
import utils, { dataBrasil, iColumnPrint } from "@/ts/utils";

export const state = reactive({
    loading: false,
    dataInicio: moment().startOf('month').format('YYYY-MM-DD'),
    dataFim: moment().format('YYYY-MM-DD'),
    inputDataFinal: <HTMLInputElement>{},
    dataInicioImpressao: null,
    dataFimImpressao: null,
    marcas: <iMarcas[]>[],
    marcaSelecionada: null,
    dadosRelatorioAvarias: <iDadosRelatorioAvarias[]>[],
    headers: <any>[
        {
            title: "Data", key: "DATA_HORA_INCLUSAO", sortable: true, align: "left",
            value: (item: iDadosRelatorioAvarias) => dataBrasil(item.DATA_HORA_INCLUSAO)
        },
        {
            title: "Nº Fabricante | Produto | Marca", key: "PRODUTO", sortable: true, align: "left",
            value: (item: iDadosRelatorioAvarias) => `${item.NUM_FABRICANTE} - ${item.PRODUTO} - ${item.MARCA}`,
            width: '40%',
        },
        { title: "Avaria", key: "DESCRICAO", sortable: true, align: "left" },
        { title: "Qtd", key: "QTD", sortable: true, align: "center" },
        {
            title: "Origem", key: "ORIGEM_AVARIA", sortable: true, align: "left",
            value: (item: iDadosRelatorioAvarias) => actions.origemAvaria(item.ORIGEM_AVARIA)
        },
        {
            title: "Destino", key: "DESCRICAO_DESTINO", sortable: true, align: "left",
            value: (item: iDadosRelatorioAvarias) => item.DESCRICAO_DESTINO ? item.DESCRICAO_DESTINO : 'Aguardando'
        },
        { title: "Identificado por", key: "FUNCIONARIO_IDENTIFICOU", sortable: true, align: "left" }
    ],
})

export const actions = {
    async init() {
        await actions.getMarcas();
        state.inputDataFinal = <any>document.getElementById('dataFim')
        await actions.validarInputs();
    },

    async getMarcas() {
        state.loading = true;
        try {
            let data = await serviceRevisaoAvarias.getMarcas()
            state.marcas = data;
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao buscar as marcas.",
            });
        }
        state.loading = false;
    },

    async validarInputs() {
        const { dataInicio, dataFim } = state;

        if (!dataInicio || !dataFim || moment(dataInicio).isAfter(moment(dataFim))) {
            await Swal.fire({
                text: !dataInicio || !dataFim
                    ? "Data Inválida!"
                    : "Data inicial deve ser menor que a data final!",
                icon: "warning"
            });
            return;
        }

        if (moment(dataFim).diff(moment(dataInicio), "months") > 3) {
            await Swal.fire({
                text: "O intervalo entre as datas não pode ser maior que 3 meses!",
                icon: "warning"
            });
            return;
        }

        actions.getDadosRelatorioAvarias();
    },


    async getDadosRelatorioAvarias() {
        state.loading = true;
        try {

            let param = {
                dataInicio: state.dataInicio,
                dataFim: state.dataFim,
                marca: state.marcaSelecionada
            }

            let data = await serviceRevisaoAvarias.getDadosRelatorioAvarias(param)
            state.dadosRelatorioAvarias = data;
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: error?.response?.data?.msg || "Erro ao trazer os dados para relatório!"
            });
        }
        state.loading = false;
    },

    async imprimirRelatorioAvarias() {
        try {
            const dadosRelatorioAvarias = actions.formatarDadosImpressao([...state.dadosRelatorioAvarias]);

            const columns: iColumnPrint[] = [
                { key: 'DATA_HORA_INCLUSAO', width: '10%', label: 'Data' },
                { key: 'NUM_FABRICANTE_PRODUTO', width: '50%', label: 'Nº Fabricante | Produto | Marca' },
                { key: 'DESCRICAO', label: 'Avaria' },
                { key: 'QTD', label: 'Qtd', width: '5%', align: 'center' },
                { key: 'ORIGEM_AVARIA', label: 'Origem' },
                { key: 'FUNCIONARIO_IDENTIFICOU', label: 'Identificado Por' },
                { key: 'DESCRICAO_DESTINO', label: 'Destino' },
            ];

            const titulo = `
                        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-top: 10px">
                            <span>Data: ${moment().format('DD/MM/YYYY')}</span>
                            <strong style="font-size: 20px;">Relatório de Avarias</strong>
                        </div>
                    `;

            await utils.printComCabecalho(columns, dadosRelatorioAvarias, titulo);

        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao imprimir o relatório."
            });
        }
    },

    formatarDadosImpressao(data: iDadosRelatorioAvarias[]) {
        return data.map(item => ({
            ...item,
            NUM_FABRICANTE_PRODUTO: `${item.NUM_FABRICANTE} - ${item.PRODUTO} - ${item.MARCA}`,
            DATA_HORA_INCLUSAO: dataBrasil(item.DATA_HORA_INCLUSAO),
            DESCRICAO_DESTINO: item.DESCRICAO_DESTINO ? item.DESCRICAO_DESTINO : 'Aguardando',
            ORIGEM_AVARIA: actions.origemAvaria(item.ORIGEM_AVARIA)
        }))
    },

    getClassCorLinha(dados: any) {
        const classe = dados.index % 2 === 0 ? "cor-zebrada-1" : "cor-zebrada-2";
        return { class: classe };
    },

    origemAvaria(origem: string) {
        switch (origem) {
            case 'F':
                return 'Fornecedor';
            case 'D':
                return 'Cliente';
            case 'L':
                return 'Loja';
            default:
                return '';
        }
    }
}