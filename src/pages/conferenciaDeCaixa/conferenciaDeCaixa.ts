import utils from './../../ts/utils';
import moment from "moment";
import { computed, reactive } from "vue";
import {
    iCaixas, iDevolucoes, iFuncionarios, iOptions, iParamFecharCaixa, iParamsAbrirCaixa,
    iParamSangria, iSangrias, iTodasAsCompras, iTotalizadores, iTotalizadoresAgrupados
} from "./interfaces";
import serviceConferenciaDeCaixa from "./services/conferenciaDeCaixa.service";
import Swal from "sweetalert2";
import { msgConfirm } from "@/ts/message";
import xAuthManager from "@/plugins/xAuthManager";
import toast from '@/plugins/toast/toast';

export const state = reactive({
    data: '2025-03-24',
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
        { title: "#", key: "INDEX", width: "20px" },
        { title: "Orçamentos", key: "NUM_ORCAMENTO", minWidth: "160px", sortable: false, },
        { title: "Hora", key: "HORA", width: "60px", value: (item: any) => utils.formatHora(item.HORA), sortable: false, },
        { title: "Pagamentos", key: "PAGAMENTOS", width: "100%", sortable: false, },
        { title: "Total", key: "VALOR", width: "120px", value: (item: any) => utils.formatValor(item.VALOR_FILTRADO ?? item.VALOR_TOTAL), },
    ],
    modalConferirCaixaOpened: false,
    selectOptionModal: "lancamentos",
    totalizadoresIndividuais: <iTotalizadoresAgrupados[]>[],
    pagamentosSelecionadosModal: [] as string[],
    pagamentosSelecionadosDevolucao: ["TODOS"] as string[],
    filtrosAdicionais: {
        orcamento: '',
        autorizacao: '',
        apenasNaoConferidos: false,
        valorConferido: ''
    },
    valoresConferidos: [] as { caixa: number, numOrcamento: number, valor: number }[],
    somatorioLista: [] as { orcamento: string; valor: number }[],
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
                state.sangrias = data.sangrias;
                state.devolucoes = data.devolucoes;

                state.totalizadores = [
                    { TIPO_PAGAMENTO: "TODOS", DESCRICAO_PAGAMENTO: "TODOS", VALOR: data.totalizadores.reduce((acc, item) => acc + item.VALOR, 0) },
                    ...data.totalizadores
                ];

                state.totalizadoresIndividuais = data.totalizadoresAgrupadosPorCaixa;
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
        state.totalizadoresIndividuais = [];
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
        state.modalConferirCaixaOpened = false;

        let param: iParamFecharCaixa = {
            ID_ABERTURA_CAIXA: funcionario.ID_ABERTURA_CAIXA,
            DATA: funcionario.DATA_ABERTURA,
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
        state.loading = true;
        state.pagamentoSelecionado = tipoPagamento === "TODOS" ? null : tipoPagamento;
        state.loading = false;
    },


    selecionarPagamentoDevolucao(tipoPagamento: string) {
        if (tipoPagamento === "TODOS") {
            state.pagamentosSelecionadosDevolucao = ["TODOS"];
            return;
        }
        state.pagamentosSelecionadosDevolucao = state.pagamentosSelecionadosDevolucao.includes(tipoPagamento)
            ? state.pagamentosSelecionadosDevolucao.filter(p => p !== tipoPagamento)
            : [...state.pagamentosSelecionadosDevolucao.filter(p => p !== "TODOS"), tipoPagamento];
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
    },

    abrirModalConferirCaixa(caixa) {
        state.caixaSelected = caixa;
        state.somatorioLista = []
        state.modalConferirCaixaOpened = true;
    },

    async salvarObs(obs: string) {
        try {
            state.loading = true;

            let param: any = {
                idAberturaCaixa: state.caixaSelected.ID_ABERTURA_CAIXA,
                observacao: obs
            };

            //let obs = await serviceConferenciaDeCaixa.salvarObs(param)

            Swal.fire({
                icon: "success",
                title: "Observação inserida com sucesso.",
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

    selecionarPagamentoModal(tipoPagamento: string) {
        if (tipoPagamento === "TODOS") {
            state.pagamentosSelecionadosModal = ["TODOS"];
            return;
        }

        state.pagamentosSelecionadosModal = state.pagamentosSelecionadosModal.includes(tipoPagamento)
            ? state.pagamentosSelecionadosModal.filter(p => p !== tipoPagamento)
            : [...state.pagamentosSelecionadosModal.filter(p => p !== "TODOS"), tipoPagamento];
    },


    filtrarPorOrcamento(numOrcamento: string) {
        state.filtrosAdicionais.orcamento = numOrcamento;
    },

    filtrarPorAutorizacao(autorizacao: string) {
        state.filtrosAdicionais.autorizacao = autorizacao;
    },

    toggleApenasNaoConferidos() {
        state.filtrosAdicionais.apenasNaoConferidos = !state.filtrosAdicionais.apenasNaoConferidos;
        state.todasAsCompras = [...state.todasAsCompras];
        state.valoresConferidos = [...state.valoresConferidos];
    }
}

export const computeds = {
    abaSelecionada: computed(() => {
        return state.selectedOption;
    }),

    abaSelecionadaModal: computed(() => {
        return state.selectOptionModal;
    }),

    funcionariosDisponiveis: computed(() => {
        state.funcionarios.filter(funcionario => {
            const temCaixaAberto = state.caixas.some(
                caixa => caixa.COD_FUNCIONARIO === funcionario.COD_FUNCIONARIO && caixa.STATUS === 1
            );
            return !temCaixaAberto;
        })
    }),

    comprasFiltradas: computed(() => {
        let compras = state.todasAsCompras;

        if (state.pagamentoSelecionado) {
            compras = compras.filter(c =>
                c.TIPOS_PAGAMENTO.some(tp => tp.TIPO_PAGAMENTO === String(state.pagamentoSelecionado).trim())
            );
        }

        return compras
            .sort((a, b) => new Date(a.HORA).getTime() - new Date(b.HORA).getTime())
            .map((compra, index) => ({
                ...compra,
                INDEX: index + 1,
            }));
    }),

    comprasFiltradasPorCaixa: computed(() => {
        if (!state.caixaSelected) return [];

        // Filtro inicial por caixa
        let compras = state.todasAsCompras.filter(c => c.CAIXA === state.caixaSelected.COD_FUNCIONARIO);

        // Aplicar filtros em cada compra
        compras = compras.map(compra => {
            const pagamentosFiltrados = compra.TIPOS_PAGAMENTO.filter(pagamento => {
                // Filtro por tipo de pagamento selecionado
                if (state.pagamentosSelecionadosModal.length > 0 &&
                    !state.pagamentosSelecionadosModal.includes("TODOS")) {
                    if (!state.pagamentosSelecionadosModal.includes(pagamento.TIPO_PAGAMENTO)) {
                        return false;
                    }
                }

                // Filtro por número de orçamento
                if (state.filtrosAdicionais.orcamento &&
                    !pagamento.NUM_ORCAMENTO?.toString().includes(state.filtrosAdicionais.orcamento) &&
                    !compra.ORCAMENTOS?.some(o => o.NUM_ORCAMENTO.toString().includes(state.filtrosAdicionais.orcamento))) {
                    return false;
                }

                // Filtro por autorização
                if (state.filtrosAdicionais.autorizacao &&
                    !pagamento.AUTORIZACAO?.includes(state.filtrosAdicionais.autorizacao)) {
                    return false;
                }

                // Filtro por não conferidos
                if (state.filtrosAdicionais.apenasNaoConferidos) {
                    const foiConferido = state.somatorioLista.some(item =>
                        item.orcamento === pagamento.NUM_ORCAMENTO?.toString() &&
                        Math.abs(parseFloat(item.valor.toString()) - pagamento.VALOR) < 0.01
                    );
                    if (foiConferido) return false;
                }

                return true;
            });

            if (pagamentosFiltrados.length === 0) return null;

            return {
                ...compra,
                TIPOS_PAGAMENTO: pagamentosFiltrados,
                VALOR_FILTRADO: pagamentosFiltrados.reduce((sum, p) => sum + p.VALOR, 0),
                PAGAMENTOS_CONFERIDOS: pagamentosFiltrados.map(p => ({
                    ...p,
                    CONFERIDO: state.valoresConferidos.some(conferidos =>
                        conferidos.numOrcamento === p.NUM_ORCAMENTO &&
                        Math.abs(conferidos.valor - p.VALOR) < 0.01
                    )
                }))
            };
        }).filter(Boolean); // Remove compras nulas (sem pagamentos após filtro)

        // Ordena por hora
        compras.sort((a, b) => new Date(a.HORA).getTime() - new Date(b.HORA).getTime());

        // Adiciona índice
        return compras.map((compra, index) => ({
            ...compra,
            INDEX: index + 1
        }));
    }),

    sangriasPorCaixa: computed(() => {
        if (!state.caixaSelected) return [];
        return state.sangrias.filter(s => s.COD_FUNCIONARIO === state.caixaSelected.COD_FUNCIONARIO);
    }),

    observacoesPorCaixa: computed(() => {
        if (!state.caixaSelected) return [];

        let compras = state.todasAsCompras.filter(
            (c) => c.CAIXA === state.caixaSelected.COD_FUNCIONARIO
        );

        compras.filter(o => o.CAIXA === state.caixaSelected.COD_FUNCIONARIO);
        return compras.map(compra => compra.TIPOS_PAGAMENTO.map(pagamento => pagamento.OBS));
    }),

    devolucoesPorCaixa: computed(() => {
        if (!state.caixaSelected) return [];

        let devolucoesFiltradasPorCaixa = state.devolucoes.filter(d => d.COD_FUNCIONARIO === state.caixaSelected.COD_FUNCIONARIO);

        // Se nenhum pagamento foi selecionado ou "TODOS" está na lista, mostra tudo
        if (
            state.pagamentosSelecionadosDevolucao.length === 0 ||
            state.pagamentosSelecionadosDevolucao.includes("TODOS")
        ) {
            return devolucoesFiltradasPorCaixa.map((compra, index) => ({
                ...compra,
                INDEX: index + 1,
            }));
        }

        // Filtra pelo tipo de pagamento selecionado
        devolucoesFiltradasPorCaixa = devolucoesFiltradasPorCaixa.filter(d =>
            state.pagamentosSelecionadosDevolucao.includes(d.DESCRICAO_PAGAMENTO)
        );

        return devolucoesFiltradasPorCaixa.map((compra, index) => ({
            ...compra,
            INDEX: index + 1,
        }));
    }),

    totalSangriasPorCaixa: computed(() => {
        return computeds.sangriasPorCaixa.value.reduce((acc, s) => acc + s.VALOR, 0);
    }),

    totalizadoresFiltradosPorCaixa: computed<iTotalizadores[]>(() => {
        if (!state.caixaSelected || !state.totalizadoresIndividuais) {
            return [];
        }

        const codFuncionario = state.caixaSelected.COD_FUNCIONARIO;
        const totalizadores = state.totalizadoresIndividuais[codFuncionario] ?? [];

        return [
            {
                TIPO_PAGAMENTO: "TODOS",
                DESCRICAO_PAGAMENTO: "TODOS",
                VALOR: Array.isArray(totalizadores)
                    ? totalizadores.reduce((sum, t) => sum + t.VALOR, 0)
                    : 0
            },
            ...(Array.isArray(totalizadores) ? totalizadores : [totalizadores])
        ];
    }),

    totalizadorDevolucaoPorCaixa: computed(() => {
        if (!state.caixaSelected) return [];

        const devolucoesPorCaixa = state.devolucoes.filter(d => d.COD_FUNCIONARIO === state.caixaSelected.COD_FUNCIONARIO);

        // Agrupa os pagamentos e soma os valores por tipo de pagamento
        const pagamentosMap = new Map<string, number>();

        devolucoesPorCaixa.forEach(({ DESCRICAO_PAGAMENTO, VALOR }) => {
            const valorAtual = pagamentosMap.get(DESCRICAO_PAGAMENTO) || 0;
            pagamentosMap.set(DESCRICAO_PAGAMENTO, valorAtual + VALOR);
        });

        // Converte o Map para um array de objetos com os totalizadores
        const totalizadores = Array.from(pagamentosMap, ([DESCRICAO_PAGAMENTO, VALOR]) => ({
            DESCRICAO_PAGAMENTO,
            VALOR,
        }));

        // Adiciona a opção "TODOS" com a soma total de todas as devoluções do caixa
        const totalTodos = totalizadores.reduce((acc, item) => acc + item.VALOR, 0);
        totalizadores.unshift({ DESCRICAO_PAGAMENTO: "TODOS", VALOR: totalTodos });

        return totalizadores;
    }),

    totalDevolucoes: computed(() => {
        const totaisPorCaixa = state.devolucoes.reduce((acc, devolucao) => {
            if (!acc[devolucao.CAIXA]) {
                acc[devolucao.CAIXA] = 0;
            }
            acc[devolucao.CAIXA] += devolucao.VALOR;
            return acc;
        }, {} as Record<string, number>);

        const totalGeral = Object.values(totaisPorCaixa).reduce((acc, val) => acc + val, 0);

        return { totaisPorCaixa, totalGeral };
    }),

    totalSangrias: computed(() => {
        const totaisPorPessoa = state.sangrias.reduce((acc, sangria) => {
            if (!acc[sangria.ENTREGUE_PARA]) {
                acc[sangria.ENTREGUE_PARA] = 0;
            }
            acc[sangria.ENTREGUE_PARA] += sangria.VALOR;
            return acc;
        }, {} as Record<string, number>);

        const totalGeral = Object.values(totaisPorPessoa).reduce((acc, val) => acc + val, 0);

        return { totaisPorPessoa, totalGeral };
    })
}

