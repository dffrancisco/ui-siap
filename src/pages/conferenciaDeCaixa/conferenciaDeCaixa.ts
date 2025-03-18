import utils from './../../ts/utils';
import moment from "moment";
import { computed, reactive } from "vue";
import { iCaixas, iDevolucoes, iFuncionarios, iOptions, iParamFecharCaixa, iParamsAbrirCaixa, iParamSangria, iSangrias, iTodasAsCompras, iTotalizadores } from "./interfaces";
import serviceConferenciaDeCaixa from "./services/conferenciaDeCaixa.service";
import Swal from "sweetalert2";
import { msgConfirm } from "@/ts/message";
import xAuthManager from "@/plugins/xAuthManager";

export const state = reactive({
    data: moment().format("YYYY-MM-DD"),
    selectedOption: "caixas",
    loading: false,
    mdcAberto: true,
    msgAberturaMDC: '',
    caixas: <iCaixas[]>[],
    caixaSelected: <iCaixas>{},
    funcionarios: <iFuncionarios[]>[],
    todasAsCompras: <iTodasAsCompras[]>[],
    totalizadores: <iTotalizadores[]>[],
    sangrias: <iSangrias[]>[],
    devolucoes: <iDevolucoes[]>[],
    modalAbrirCaixaOpened: false,
    modalSangriaOpened: false,
    pagamentoSelecionado: null,
    headersLancamentos: [
        { title: "#", key: "INDEX", width: "50px" },
        { title: "N° Orçamento / Valor", key: "NUM_ORCAMENTO", width: "220px" },
        { title: "Hora", key: "HORA", width: "60px", value: (item: any) => utils.formatHora(item.HORA) },
        { title: "Pagamentos", key: "PAGAMENTOS", width: "300px" },
        { title: "Total", key: "VALOR", width: "120px", value: (item: any) => utils.formatValor(item.VALOR_TOTAL) },
    ],
});

export const options: iOptions[] = [
    { value: "caixas", label: "Caixas" },
    { value: "lancamentos", label: "Lançamentos" },
    { value: "sangria", label: "Sangria" },
    { value: "devolucao", label: "Devolução" },
];

export const actions = {
    async init() {
        await actions.getDadosIniciaisConfCaixa();
    },

    async getDadosIniciaisConfCaixa() {
        try {
            state.loading = true;
            let param = state.data;
            const data = await serviceConferenciaDeCaixa.getDadosIniciaisConfCaixa(param);

            if (data.mdc.length == 0) {
                actions.limparStates();
                return;
            } else {
                state.mdcAberto = true;
                state.msgAberturaMDC = data.mdc[0].OPEN_CLOSE;
                state.funcionarios = data.funcionarios;
                state.caixas = data.caixas;
                state.todasAsCompras = data.comprasAgrupadas;
                state.totalizadores = data.totalizadores;
                state.sangrias = data.sangrias;
                state.devolucoes = data.devolucoes;
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao trazer os dados de conferência de caixa!"
            });
        } finally {
            state.loading = false;
        }
    },

    limparStates() {
        state.mdcAberto = false;
        state.msgAberturaMDC = "";
        state.funcionarios = [];
        state.caixas = [];
        state.todasAsCompras = [];
        state.totalizadores = [];
        state.sangrias = [];
        state.devolucoes = [];
    },

    async validarDataAtual(caixaData) {
        const hoje = moment().format("YYYY-MM-DD");

        if (!moment(caixaData, "YYYY-MM-DD", true).isValid() || caixaData !== hoje) {
            await Swal.fire({
                title: "Atenção",
                text: "Só é possível abrir o caixa ou MDC na data atual!",
                icon: "warning",
                confirmButtonText: "OK",
            });
            return false;
        }
        return true;
    },

    async abrirMDC() {
        const caixaData = state.data;

        if (!(await actions.validarDataAtual(caixaData))) {
            return;
        }

        if (await msgConfirm("Confirmação", "Gostaria de Abrir o MDC do dia " + utils.dataBrasil(state.data) + "?")) {
            try {
                state.loading = true;
                await serviceConferenciaDeCaixa.abrirMDC(state.data);
                await actions.getDadosIniciaisConfCaixa();
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    text: "Erro ao abrir o MDC!"
                });
            } finally {
                state.loading = false;
            }

        }
    },

    async openModalAbrirCaixa() {
        const caixaData = state.data;

        if (!(await actions.validarDataAtual(caixaData))) {
            return;
        }
        state.modalAbrirCaixaOpened = true;
    },

    async abrirCaixa(codFuncionario: number, valorTroco: string) {
        try {
            state.loading = true;

            let param: iParamsAbrirCaixa = {
                COD_FUNCIONARIO: codFuncionario,
                VALOR_TROCO: utils.formatValorUSA(valorTroco),
                LOGIN: state.funcionarios.find(f => f.COD_FUNCIONARIO === codFuncionario)?.LOGIN || ""
            }

            let caixas = await serviceConferenciaDeCaixa.abrirCaixa(param);
            state.caixas = caixas;

            Swal.fire({
                icon: "success",
                title: "Caixa aberto com sucesso.",
                showConfirmButton: false,
                timer: 1000,
            });

        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao abrir o caixa"
            });
        } finally {
            state.loading = false;
        }
    },

    getFotoFuncionarioURL(cpf: string) {
        if (!cpf) {
            return "";
        }
        const cpfSanitizado = cpf.replaceAll(".", "").replaceAll("-", "");
        return `https://www.reallatas.com.br/_serverAPP/thumb.php?img=http://www.reallatas.com.br/foto_funcionarios/${cpfSanitizado}.jpg`;
    },

    async fecharCaixa(funcionario) {

        let param: iParamFecharCaixa = {
            ID_ABERTURA_CAIXA: funcionario.ID_ABERTURA_CAIXA
        }

        xAuthManager("Autorizar fechamento de caixa?", async () => {
            try {
                state.loading = true;

                let caixasAbertoAtualizados = await serviceConferenciaDeCaixa.fecharCaixa(param);
                state.caixas = caixasAbertoAtualizados;

                // Reintroduzir o funcionário na lista de funcionários disponíveis
                const funcionarioFechado = state.funcionarios.find(
                    f => f.COD_FUNCIONARIO === funcionario.COD_FUNCIONARIO
                );
                if (!funcionarioFechado) {
                    const retornarFuncionarioParaState = {
                        COD_FUNCIONARIO: funcionario.COD_FUNCIONARIO,
                        LOGIN: funcionario.LOGIN
                    };
                    state.funcionarios.push(retornarFuncionarioParaState);
                }


                Swal.fire({
                    icon: "success",
                    title: "Caixa fechado com sucesso.",
                    showConfirmButton: false,
                    timer: 1000,
                });

            } catch (error) {
                Swal.fire({
                    icon: "error",
                    text: "Erro ao fechar o caixa"
                });
            } finally {
                state.loading = false
            }
        });
    },

    selecionarPagamento(tipoPagamento: string) {
        state.pagamentoSelecionado = tipoPagamento;
    },

    obterDescricaoPagamento(tipoPagamento: string) {
        const pagamento = state.totalizadores.find(p => p.TIPO_PAGAMENTO === tipoPagamento);
        return pagamento ? pagamento.DESCRICAO_PAGAMENTO : "Desconhecido";
    },

    async modalSangria(caixa) {
        const hoje = moment().format("YYYY-MM-DD");

        if (state.data !== hoje) {
            await Swal.fire({
                title: "Atenção",
                text: "Só é possível fazer sangria na data atual!",
                icon: "warning",
                confirmButtonText: "OK",
            });
            return false;
        }

        state.caixaSelected = caixa

        xAuthManager("Autorizar sangria?", async () => {
            state.modalSangriaOpened = true;
        });
    },

    async efetuarSangria(valorSangria: string, caixaSelecionado: iCaixas) {
        try {
            state.loading = true;

            let param: iParamSangria = {
                loginCaixa: caixaSelecionado.LOGIN,
                idAberturaCaixa: caixaSelecionado.ID_ABERTURA_CAIXA,
                valor: parseFloat(valorSangria.replace(/\./g, "").replace(",", "."))
            };

            let sangrias = await serviceConferenciaDeCaixa.efetuarSangria(param);
            state.sangrias = sangrias;

            Swal.fire({
                icon: "success",
                title: "Sangria feita com sucesso.",
                showConfirmButton: false,
                timer: 1000,
            });
            state.modalSangriaOpened = false;

        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao fazer sangria"
            });
        } finally {
            state.loading = false;
        }
    }
}

export const abaSelecionada = computed(() => state.selectedOption);

export const funcionariosDisponiveis = computed(() =>
    state.funcionarios.filter(funcionario => {
        const temCaixaAberto = state.caixas.some(
            caixa => caixa.COD_FUNCIONARIO === funcionario.COD_FUNCIONARIO && caixa.STATUS === 1
        );
        return !temCaixaAberto;
    })
);

export const totalDevolucoes = computed(() => {
    const totaisPorCaixa = state.devolucoes.reduce((acc, devolucao) => {
        if (!acc[devolucao.CAIXA]) {
            acc[devolucao.CAIXA] = 0;
        }
        acc[devolucao.CAIXA] += devolucao.VALOR;
        return acc;
    }, {} as Record<string, number>);

    const totalGeral = Object.values(totaisPorCaixa).reduce((acc, val) => acc + val, 0);

    return { totaisPorCaixa, totalGeral };
});

export const totalSangrias = computed(() => {
    const totaisPorPessoa = state.sangrias.reduce((acc, sangria) => {
        if (!acc[sangria.ENTREGUE_PARA]) {
            acc[sangria.ENTREGUE_PARA] = 0;
        }
        acc[sangria.ENTREGUE_PARA] += sangria.VALOR;
        return acc;
    }, {} as Record<string, number>);

    const totalGeral = Object.values(totaisPorPessoa).reduce((acc, val) => acc + val, 0);

    return { totaisPorPessoa, totalGeral };
});

export const comprasFiltradas = computed(() => {
    let compras = state.todasAsCompras;

    // Se um tipo de pagamento foi selecionado, filtrar os itens
    if (state.pagamentoSelecionado) {
        // if (state.pagamentoSelecionado == 6) {
        //     // Quando pagamentoSelecionado == 6, filtra por ENTREGAR_RECEBER
        //     compras = compras.filter(c =>
        //         c.ENTREGAR_RECEBER === true ||
        //         c.TIPOS_PAGAMENTO.some(tp => tp.TIPO_PAGAMENTO === "6")
        //     );
        // } else {
        // Filtragem normal pelo TIPO_PAGAMENTO
        compras = compras.filter(c =>
            c.TIPOS_PAGAMENTO.some(tp => tp.TIPO_PAGAMENTO === String(state.pagamentoSelecionado).trim())
        );
        // }
    }

    // Ordena as compras por hora antes de numerar
    return compras
        .sort((a, b) => new Date(a.HORA).getTime() - new Date(b.HORA).getTime())
        .map((compra, index) => ({
            ...compra,
            INDEX: index + 1, // A numeração é reiniciada sempre que a lista muda
        }));
});


