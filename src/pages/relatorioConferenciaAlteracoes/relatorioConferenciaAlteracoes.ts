import { mesesToSelect } from "@/constants/constants";
import moment from "moment";
import Swal from "sweetalert2";
import { reactive } from "vue";
import serviceRelatorioConferenciaAlteracoes from './services/relatorioConferencia.service';
import { iDadosRelatorio, iFuncionarios, iTelas } from "./interfaces";
import utils, { iColumnPrint } from "@/ts/utils";


export const meses = mesesToSelect;
const ano = moment().year();
const mes = moment().month() + 1;

export const state = reactive({
    loading: false,
    mes: mes,
    ano: ano || "",
    funcionarios: <iFuncionarios[]>[],
    selectedFuncionario: <number[]>[],
    telas: <iTelas[]>[],
    conteudo: ['Conferido', 'Quantidade', 'End.Estoque', 'End.Excesso'],
    selectTela: 'CONFERENCIA',
    selectedConteudo: <string[]>[],
    numFabricante: "",
    totalItems: 0,
    itemsPerPage: 30,
    page: 1,
    dadosRelatorio: <iDadosRelatorio[]>[],
    mesImpressao: null,
    anoImpressao: null,
    headers: <any>[
        {
            title: "Produto",
            key: "DESC_PRODUTO",
            sortable: true,
            align: 'left',
        },
        {
            title: "Nº Fabricante",
            key: "NUM_FABRICANTE",
            sortable: true,
            align: 'left',
        },
        {
            title: "Marca",
            key: "MARCA",
            sortable: true,
            align: 'left',
        },
        {
            title: "Conteúdo",
            key: "CONTEUDO",
            sortable: true,
            align: 'left',
        },
        {
            title: "Funcionário",
            key: "LOGIN",
            sortable: true,
            align: 'right',
        },
        {
            title: "Data",
            key: "DATA",
            sortable: true,
            align: 'right',
            value: (item: any) => moment(item.DATA).format('DD/MM/YYYY')
        }
    ]
})

export const actions = {
    async init() {
        actions.validarInputs()
        actions.getDadosParaInputs()
    },

    validarInputs() {
        if (state.ano === "" || state.ano > ano.toString()) {
            Swal.fire({
                icon: "error",
                text: "Insira um ano válido para continuar"
            });
            return
        }

        if (state.mes > mes) {
            Swal.fire({
                icon: "error",
                text: "Insira um mês válido para continuar"
            });
            return
        }
        actions.getDadosParaRelatorio();
    },

    async getDadosParaInputs() {
        try {
            state.loading = true;
            const data = await serviceRelatorioConferenciaAlteracoes.getDadosParaInputs();
            state.funcionarios = data.funcionarios
            state.telas = data.telas
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
        try {
            state.loading = true;

            const data = await serviceRelatorioConferenciaAlteracoes.getDadosParaRelatorio({
                page: state.page,
                itemsPerPage: state.itemsPerPage,
                mes: state.mes,
                ano: state.ano,
                conteudo: state.selectedConteudo,
                tela: state.selectTela,
                numFabricante: state.numFabricante,
                funcionario: state.selectedFuncionario

            });
            state.dadosRelatorio = data.dadosRelatorio;
            state.totalItems = data.totalDadosRelatorio[0].TOTAL;

            state.mesImpressao = state.mes
            state.anoImpressao = state.ano

        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao trazer os dados para relatório!"
            });
        } finally {
            state.loading = false;
        }
    },

    getClassCorLinha(dados: any) {
        let classe = dados.index % 2 == 0 ? 'cor-zebrada-1' : 'cor-zebrada-2'
        return { class: classe }
    },

    updatePage(newPage: number) {
        state.page = newPage;
        actions.getDadosParaRelatorio();
    },

    async onClickImprimir() {
        try {
            let relatorio = state.dadosRelatorio
            const relatorioAjustado = actions.formatarDadosImpressao([...relatorio]);

            const columns: iColumnPrint[] = [
                { key: 'DESC_PRODUTO', label: 'Produto', width: '25%', align: 'left' },
                { key: 'NUM_FABRICANTE', label: 'Nº Fabricante', width: '10%', align: 'left' },
                { key: 'MARCA', label: 'Marca', width: '10%', align: 'left' },
                { key: 'CONTEUDO', label: 'Conteúdo', width: '30%', align: 'left' },
                { key: 'LOGIN', label: 'Funcionário', width: '10%', align: 'left' },
                { key: 'DATA', label: 'Data', width: '15%', align: 'center' }
            ];

            const titulo = `
                <div style="display: flex; justify-content: center; width: 100%; margin-top: 10px">
                    <span>&nbsp;</span>
                    <strong style="font-size: 16px;">Relatório Conferência - Alterações</strong>
                </div>
            `;

            await utils.printComCabecalho(columns, relatorioAjustado, titulo);

        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao imprimir o relatório."
            });
        }
    },

    formatarDadosImpressao(data) {
        return data.map(item => ({
            ...item,
            DATA: item.DATA ? utils.dataBrasil(item.DATA) : '-------',
        }));
    },
}