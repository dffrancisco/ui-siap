import { computed, reactive } from "vue";
import { iBoleto, iClientesFaturados, iOrcamento } from "./interfaces";
import Swal from "sweetalert2";
import serviceBaixaManualBoleto from "./services/baixaManualBoleto.service";
import utils from "@/ts/utils";

export const state = reactive({
    modalClienteFaturadoOpened: false,
    modalUploadComprovanteOpened: false,
    clienteFaturadoSelecionado: <iClientesFaturados>{},
    nomeClienteFaturadoSelecionado: '',
    loading: false,
    dadosOrcamento: [] as iOrcamento[],
    dadosBoletos: [] as iBoleto[],
    filtroOrcamento: '',
    filtroBoleto: '',
    dadosOrcamentoFiltrados: [] as iOrcamento[],
    dadosBoletosFiltrados: [] as iBoleto[],
    extratoBancario: [],
    headersExtrato: [
        { key: "checked", title: "Conf.", width: "50px", align: "center" },
        { key: "DATA", title: "Data", width: "100px", sortable: true },
        { key: "VALOR", title: "Valor", width: "100px", sortable: true, value: (item) => utils.formatValor(item.VALOR) },
    ],
    headersOrcamento: [
        { key: "checked", title: "Conferido", width: "50px", align: "center" },
        { key: "NUM_ORCAMENTO", title: "N° Orç.", width: "100px", sortable: true },
        { key: "DATA", title: "Data", width: "100px", sortable: true, value: (item: any) => utils.dataBrasil(item.DATA) },
        { key: "VALOR", title: "Valor", width: "100px", sortable: true, value: (item: any) => utils.formatValor(item.VALOR) },
    ],
    headersBoletos: [
        { key: "checked", title: "Conferido", width: "50px", align: "center" },
        { key: "NUM_BOLETO", title: "N° Boleto", width: "100px", sortable: true },
        { key: "DATA_VENCIMENTO", title: "Data Vencimento", width: "100px", sortable: true, value: (item: any) => utils.dataBrasil(item.DATA_VENCIMENTO) },
        { key: "VALOR", title: "Valor", width: "100px", sortable: true, value: (item: any) => utils.formatValor(item.VALOR) },
    ],
    totalSelecionadoExtrato: computed(() => {
        const totalExtrato = state.extratoBancario
            .filter(item => item.checked)
            .reduce((sum, item) => sum + item.VALOR, 0);

        return parseFloat(totalExtrato.toFixed(2));
    }),
    totalOrcamentosEBoletos: computed(() => {
        const totalOrcamentos = state.dadosOrcamento
            .filter(item => item.checked)
            .reduce((sum, item) => sum + item.VALOR, 0);

        const totalBoletos = state.dadosBoletos
            .filter(item => item.checked)
            .reduce((sum, item) => sum + item.VALOR, 0);

        let total = totalOrcamentos + totalBoletos;
        return parseFloat(total.toFixed(2));
    }),
    podeBaixarManual: computed(() => {
        return (
            state.totalOrcamentosEBoletos === state.totalSelecionadoExtrato &&
            state.nomeClienteFaturadoSelecionado !== '' &&
            state.totalOrcamentosEBoletos !== 0
        );
    }),
    cnpjEmpresa: ""
})

export const actions = {

    async init() {
        await actions.getCnpjEmpresa();
    },

    async salvarClienteFaturadoSelecionado(clienteFaturadoSelecionado: iClientesFaturados) {
        actions.limparStatesAnteriores();

        state.clienteFaturadoSelecionado = clienteFaturadoSelecionado;
        state.nomeClienteFaturadoSelecionado = clienteFaturadoSelecionado.CLIENTE;

        await actions.getOrcamentosEBoletosEmAberto()
    },

    limparStatesAnteriores() {
        state.dadosOrcamento = [];
        state.dadosBoletos = [];
        state.filtroOrcamento = '';
        state.filtroBoleto = '';
        state.dadosOrcamentoFiltrados = [];
        state.dadosBoletosFiltrados = [];
    },

    limparExtratoBancarioECliente() {
        state.extratoBancario = [];
        state.clienteFaturadoSelecionado = [];
        state.nomeClienteFaturadoSelecionado = '';
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

    abrirSeletorDeArquivo() {
        const input = document.getElementById('fileInput') as HTMLInputElement;
        if (input) input.click()
    },

    async processarArquivoBancario(event: Event) {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];

        if (!file || !file.name.toLowerCase().endsWith(".ofx")) {
            Swal.fire({ icon: "warning", text: "Por favor, selecione um arquivo .OFX válido." });
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            actions.extrairTransacoes(text);
        };
        reader.readAsText(file);
        target.value = "";
    },

    extrairTransacoes(ofxText) {
        const transacoes = [];
        const linhas = ofxText.split("\n");
        let dataTransacao = "", valor = 0, tipo = "", idTransacao = "";

        for (let i = 0; i < linhas.length; i++) {
            const linha = linhas[i].trim();
            if (linha.startsWith("<DTPOSTED>")) {
                dataTransacao = linha.replace("<DTPOSTED>", "").substring(0, 8);
                dataTransacao = `${dataTransacao.substring(6, 8)}/${dataTransacao.substring(4, 6)}/${dataTransacao.substring(0, 4)}`;
            }

            if (linha.startsWith("<TRNAMT>")) {
                valor = parseFloat(linha.replace("<TRNAMT>", "").replace(",", "."));
            }

            if (linha.startsWith("<TRNTYPE>")) {
                tipo = linha.replace("<TRNTYPE>", "");
            }

            if (linha.startsWith("<FITID>")) {
                idTransacao = linha.replace("<FITID>", "");
            }

            if (linha.startsWith("</STMTTRN>")) {
                if (valor > 0) {
                    transacoes.push({ DATA: dataTransacao, VALOR: valor, TIPO: tipo, ID: idTransacao, checked: false });
                }
            }
        }

        const datasUnicas = new Set(transacoes.map(t => t.DATA));
        if (datasUnicas.size > 1) {
            Swal.fire({ icon: "warning", text: "O extrato deve conter transações de apenas um dia." });
            return;
        }

        state.extratoBancario = transacoes;
    },

    async baixarBoletosEOrcamentos(justificativaBaixaManual: string) {
        const orcamentosSelecionadosBaixa = computeds.orcamentosSelecionados.value.map(orcamento => ({
            numOrcamento: orcamento.NUM_ORCAMENTO,
            dataOrcamento: orcamento.DATA,
            valorOrcamento: orcamento.VALOR
        }));

        const boletosSelecionadosBaixa = computeds.boletosSelecionados.value.map(boleto => ({
            numBoleto: boleto.NUM_BOLETO,
            valorBoleto: boleto.VALOR
        }));

        const dataExtrato = computeds.extratoSelecionado.value.length > 0 ? computeds.extratoSelecionado.value[0].DATA : null;
        const extratoSelecionadoIds = computeds.extratoSelecionado.value.map(transacao => transacao.ID);

        const dadosParaLog = {
            dataExtrato,
            idsExtrato: extratoSelecionadoIds,
            numOrcamentos: computeds.orcamentosSelecionados.value.map(orcamento => orcamento.NUM_ORCAMENTO),
            numBoletos: computeds.boletosSelecionados.value.map(boleto => boleto.NUM_BOLETO),
            totalBaixa: Number(state.totalOrcamentosEBoletos)
        };

        let param = {
            orcamentosSelecionadosBaixa,
            boletosSelecionadosBaixa,
            dadosParaLog,
            justificativaBaixaManual: justificativaBaixaManual
        };

        try {
            state.loading = true;
            let data = await serviceBaixaManualBoleto.baixarBoletosEOrcamentos(param);

            actions.limparStatesAnteriores()
            actions.limparExtratoBancarioECliente();

            if (data.success) {
                Swal.fire({
                    icon: "success",
                    title: data.msg,
                    text: "Baixa manual realizada com sucesso!"
                });

            } else {
                Swal.fire({
                    icon: "error",
                    title: data.msg,
                    text: "Erro ao dar baixa nos boletos e orçamentos."
                });
            }
        } catch (err) {
            Swal.fire({ icon: "error", text: "Erro ao dar baixa nos boletos e orçamentos." });
        } finally {
            state.loading = false;
        }
    },

    async getCnpjEmpresa() {
        try {
            state.loading = true;
            let data = await serviceBaixaManualBoleto.getCnpjEmpresa();
            state.cnpjEmpresa = data.CGC_EMPRESA;
        } catch (err) {
            Swal.fire({ icon: "error", text: "Erro ao buscar CNPJ da empresa." });
        } finally {
            state.loading = false;
        }
    }

}

export const computeds = {
    boletosSelecionados: computed(() => {
        return state.dadosBoletosFiltrados.filter(boleto => boleto.checked);
    }),
    orcamentosSelecionados: computed(() => {
        return state.dadosOrcamentoFiltrados.filter(orcamento => orcamento.checked);
    }),
    extratoSelecionado: computed(() => {
        return state.extratoBancario.filter(transacao => transacao.checked);
    })
}