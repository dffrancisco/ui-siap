import { computed, reactive } from "vue";
import { iBoleto, iClientesFaturados, iOrcamento } from "./interfaces";
import Swal from "sweetalert2";
import serviceBaixaManualBoleto from "./services/baixaManualBoleto.service";
import utils from "@/ts/utils";

export const computeds = {
    totalOrcamentosEBoletos: computed(() => {
        const totalOrcamentos = state.dadosOrcamento
            .filter(item => item.checked)
            .reduce((sum, item) => sum + item.VALOR, 0);

        const totalBoletos = state.dadosBoletos
            .filter(item => item.checked)
            .reduce((sum, item) => sum + item.VALOR, 0);

        let total = totalOrcamentos + totalBoletos
        // return utils.formatValor(total);
        return total;
    })
};


export const state = reactive({
    modalClienteFaturadoOpened: false,
    clienteFaturadoSelecionado: <iClientesFaturados>{},
    nomeClienteFaturadoSelecionado: '',
    loading: false,
    dadosOrcamento: [] as iOrcamento[],
    dadosBoletos: [] as iBoleto[],
    filtroOrcamento: '',
    filtroBoleto: '',
    dadosOrcamentoFiltrados: [] as iOrcamento[],
    dadosBoletosFiltrados: [] as iBoleto[],
    headersOrcamento: [
        { key: "NUM_ORCAMENTO", title: "N° Orç.", width: "100px", sortable: true },
        { key: "DATA", title: "Data", width: "100px", sortable: true, value: (item: any) => utils.dataBrasil(item.DATA) },
        { key: "VALOR", title: "Valor", width: "100px", sortable: true, value: (item: any) => utils.formatValor(item.VALOR) },
        { key: "checked", title: "Conferido", width: "50px", align: "center" },
    ],
    headersBoletos: [
        { key: "NUM_BOLETO", title: "N° Boleto", width: "100px", sortable: true },
        { key: "DATA_VENCIMENTO", title: "Data Vencimento", width: "100px", sortable: true, value: (item: any) => utils.dataBrasil(item.DATA_VENCIMENTO) },
        { key: "VALOR", title: "Valor", width: "100px", sortable: true, value: (item: any) => utils.formatValor(item.VALOR) },
        { key: "checked", title: "Conferido", width: "50px", align: "center" },
    ]
})

export const actions = {

    async salvarClienteFaturadoSelecionado(clienteFaturadoSelecionado: iClientesFaturados) {
        state.clienteFaturadoSelecionado = clienteFaturadoSelecionado;
        state.nomeClienteFaturadoSelecionado = clienteFaturadoSelecionado.CLIENTE;

        await actions.getOrcamentosEBoletosEmAberto()
    },

    async getOrcamentosEBoletosEmAberto() {
        try {
            state.loading = true;
            let param = {
                CNPJ: state.clienteFaturadoSelecionado.CNPJ,
                ID_CLIENTE: state.clienteFaturadoSelecionado.ID_CLIENTE,
            }

            let response = await serviceBaixaManualBoleto.getOrcamentosEBoletosEmAberto(param);

            state.dadosOrcamento = response.orcamentos.map((item: iOrcamento) => ({
                ...item,
                checked: false
            }));
            state.dadosOrcamentoFiltrados = state.dadosOrcamento;

            state.dadosBoletos = response.boletos.map((item: iBoleto) => ({
                ...item,
                checked: false
            }));
            state.dadosBoletosFiltrados = state.dadosBoletos;

        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao buscar os orçamentos e boletos do cliente.",
            });
            return;
        } finally {
            state.loading = false;
        }
    },

    getClassCorLinha(dados: any) {
        let classe = dados.index % 2 == 0 ? "cor-zebrada-1" : "cor-zebrada-2";
        return { class: classe };
    },

    filtrarOrcamentos() {
        if (state.filtroOrcamento) {
            state.dadosOrcamentoFiltrados = state.dadosOrcamento.filter(item =>
                item.NUM_ORCAMENTO.toString().includes(state.filtroOrcamento)
            );
        } else {
            state.dadosOrcamentoFiltrados = state.dadosOrcamento;
        }
    },

    filtrarBoletos() {
        if (state.filtroBoleto) {
            state.dadosBoletosFiltrados = state.dadosBoletos.filter(item =>
                item.NUM_BOLETO.toString().includes(state.filtroBoleto)
            );
        } else {
            state.dadosBoletosFiltrados = state.dadosBoletos;
        }
    },

}