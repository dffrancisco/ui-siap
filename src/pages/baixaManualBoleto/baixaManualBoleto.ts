import { computed, reactive } from "vue";
import { iBoleto, iClientesFaturados, iOrcamento } from "./interfaces";
import Swal from "sweetalert2";
import serviceBaixaManualBoleto from "./services/baixaManualBoleto.service";
import utils from "@/ts/utils";

export const computeds = {
    totalMarcado: computed(() => {
        const totalOrcamentos = state.dadosOrcamento
            .filter(item => item.checked)
            .reduce((sum, item) => sum + item.VALOR, 0);

        const totalBoletos = state.dadosBoletos
            .filter(item => item.checked)
            .reduce((sum, item) => sum + item.VALOR, 0);

        return totalOrcamentos + totalBoletos;
    })
};


export const state = reactive({
    modalClienteFaturadoOpened: false,
    clienteFaturadoSelecionado: <iClientesFaturados>{},
    nomeClienteFaturadoSelecionado: '',
    loading: false,
    dadosOrcamento: [] as iOrcamento[],
    dadosBoletos: [] as iBoleto[],
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

            console.log(response);


            state.dadosOrcamento = response.orcamentos.map((item: iOrcamento) => ({
                ...item,
                checked: false
            }));
            state.dadosBoletos = response.boletos.map((item: iBoleto) => ({
                ...item,
                checked: false
            }));
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

    toggleOrcamento(item: any) {
        console.log(item.checked);
        item.checked = !item.checked;
    },

    toggleBoleto(item: any) {
        console.log(item.checked);
        item.checked = !item.checked;
    }

}