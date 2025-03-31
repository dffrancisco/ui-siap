import utils from './../../ts/utils';
import moment from "moment";
import { computed, nextTick, reactive } from "vue";
import {
    iCaixas, iDevolucoes, iFuncionarios, iOptions, iParamFecharCaixa, iParamsAbrirCaixa,
    iParamSangria, iSangrias, iTodasAsCompras, iTotalizadores, iTotalizadoresAgrupados
} from "./interfaces";
// import { stateLancamentos } from "./components/ModalConferirCaixaAbaLancamentos.vue"
import serviceConferenciaDeCaixa from "./services/conferenciaDeCaixa.service";
import Swal from "sweetalert2";
import { msgConfirm } from "@/ts/message";
import xAuthManager from "@/plugins/xAuthManager";

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
    //novos states
    filtrosAdicionais: {
        orcamento: '',
        autorizacao: '',
        apenasNaoConferidos: false,
        valorConferido: ''
    },
    valoresConferidos: [] as { caixa: number, nossoNum: number, numOrcamento: number, valor: number }[],
    somatorioLista: [] as { orcamento: string; valor: number }[],
    //observacoes: [] as { caixa: number, nossoNum: number, observacao: string, usuario: string, dataHora: string }[]
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

    selecionarPagamentoModal(tipoPagamento: string) {
        if (tipoPagamento === "TODOS") {
            state.pagamentosSelecionadosModal = ["TODOS"];
            return;
        }

        state.pagamentosSelecionadosModal = state.pagamentosSelecionadosModal.includes(tipoPagamento)
            ? state.pagamentosSelecionadosModal.filter(p => p !== tipoPagamento)
            : [...state.pagamentosSelecionadosModal.filter(p => p !== "TODOS"), tipoPagamento];
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
        state.modalConferirCaixaOpened = true;
    },

    //novas actions 

    filtrarPorOrcamento(numOrcamento: string) {
        state.filtrosAdicionais.orcamento = numOrcamento;
    },

    filtrarPorAutorizacao(autorizacao: string) {
        state.filtrosAdicionais.autorizacao = autorizacao;
    },

    toggleApenasNaoConferidos() {
        state.filtrosAdicionais.apenasNaoConferidos = !state.filtrosAdicionais.apenasNaoConferidos;
        console.log('Estado do toggle:', state.filtrosAdicionais.apenasNaoConferidos);

        // Debug: Verificar valores conferidos
        console.log('Valores conferidos:', state.valoresConferidos);

        // Forçar recálculo
        state.todasAsCompras = [...state.todasAsCompras];

        // Debug: Verificar compras após filtro
        nextTick(() => {
            console.log('Compras filtradas:', computeds.comprasFiltradasPorCaixa.value);
        });
    },

    conferirValor(valorDigitado: string) {
        if (!valorDigitado.trim()) return;

        const valor = parseFloat(valorDigitado.replace(",", "."));
        if (isNaN(valor)) {
            //utils.toastError("Valor inválido");
            return;
        }

        // RN8: Busca apenas nos orçamentos filtrados
        const comprasFiltradas = computeds.comprasFiltradasPorCaixa.value;

        // Encontrar o primeiro pagamento não conferido com o valor especificado
        let pagamentoEncontrado = null;

        outerLoop:
        for (const compra of comprasFiltradas) {
            for (const pagamento of compra.TIPOS_PAGAMENTO) {
                // Verifica se o valor bate e se não está já conferido
                if (Math.abs(pagamento.VALOR - valor) < 0.01 &&
                    !state.valoresConferidos.some(vc =>
                        vc.nossoNum === compra.NOSSO_NUM &&
                        vc.numOrcamento === pagamento.NUM_ORCAMENTO &&
                        Math.abs(vc.valor - valor) < 0.01
                    )) {
                    pagamentoEncontrado = {
                        caixa: compra.CAIXA,
                        nossoNum: compra.NOSSO_NUM,
                        numOrcamento: pagamento.NUM_ORCAMENTO,
                        valor: valor
                    };
                    break outerLoop;
                }
            }
        }

        if (pagamentoEncontrado) {
            // RN9: Adiciona apenas o primeiro valor encontrado
            state.valoresConferidos.push(pagamentoEncontrado);
            // RN11: O input é limpo no método da modal
        } else {
            //utils.toastError("O valor digitado não foi localizado");
            console.log("O valor digitado não foi localizado");
        }
    },
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

        let compras = state.todasAsCompras.filter(
            (c) => c.CAIXA === state.caixaSelected.COD_FUNCIONARIO
        );

        // Filtro por tipo de pagamento
        const estaFiltrandoPagamentos = state.pagamentosSelecionadosModal.length > 0 &&
            !state.pagamentosSelecionadosModal.includes("TODOS");

        // Aplica todos os filtros
        compras = compras.map((compra) => {
            // Filtra os pagamentos conforme os critérios
            let pagamentosFiltrados = [...compra.TIPOS_PAGAMENTO];

            // Filtro por tipo de pagamento
            if (estaFiltrandoPagamentos) {
                pagamentosFiltrados = pagamentosFiltrados.filter(p =>
                    state.pagamentosSelecionadosModal.includes(p.TIPO_PAGAMENTO)
                );
            }

            // Filtro por número de orçamento (RN5)
            if (state.filtrosAdicionais.orcamento) {
                pagamentosFiltrados = pagamentosFiltrados.filter(p =>
                    p.NUM_ORCAMENTO?.toString().includes(state.filtrosAdicionais.orcamento) ||
                    compra.ORCAMENTOS?.some(o => o.NUM_ORCAMENTO.toString().includes(state.filtrosAdicionais.orcamento))
                );
            }

            // Filtro por autorização de cartão (RN5)
            if (state.filtrosAdicionais.autorizacao) {
                pagamentosFiltrados = pagamentosFiltrados.filter(p =>
                    p.AUTORIZACAO?.includes(state.filtrosAdicionais.autorizacao)
                );
            }

            // Filtro por apenas não conferidos (RN6)
            if (state.filtrosAdicionais.apenasNaoConferidos) {
                pagamentosFiltrados = pagamentosFiltrados.filter(p => {
                    const valorConferido = state.valoresConferidos.some(vc =>
                        vc.nossoNum === compra.NOSSO_NUM &&
                        vc.numOrcamento === p.NUM_ORCAMENTO
                    );

                    // Mostra apenas pagamentos não conferidos
                    return !valorConferido;
                });
            }

            // Se não houver pagamentos após os filtros, retorna null
            if (pagamentosFiltrados.length === 0) return null;

            // Calcula o valor filtrado
            const valorFiltrado = pagamentosFiltrados.reduce((sum, p) => sum + p.VALOR, 0);

            return {
                ...compra,
                TIPOS_PAGAMENTO: pagamentosFiltrados,
                VALOR_FILTRADO: valorFiltrado,
                // Adiciona flag para pagamentos conferidos (para estilização)
                PAGAMENTOS_CONFERIDOS: pagamentosFiltrados.map(p => ({
                    ...p,
                    CONFERIDO: state.valoresConferidos.some(vc =>
                        vc.nossoNum === compra.NOSSO_NUM &&
                        vc.numOrcamento === p.NUM_ORCAMENTO &&
                        Math.abs(vc.valor - p.VALOR) < 0.01
                    )
                }))
            };
        }).filter(compra => compra !== null);

        // Ordena por hora
        compras.sort((a, b) => new Date(a.HORA).getTime() - new Date(b.HORA).getTime());

        // Adiciona índice
        return compras.map((compra, index) => ({
            ...compra,
            INDEX: index + 1,
        }));
    }),
    //     if (!state.caixaSelected) return [];

    //     let compras: any[] = state.todasAsCompras.filter(
    //         (c) => c.CAIXA === state.caixaSelected.COD_FUNCIONARIO
    //     );

    //     // RN5: Filtragem por orçamento e autorização do cartão
    //     if (stateLancamentos.inputLocalizarOrcamento) {
    //         compras = compras.filter((c) =>
    //             c.ORCAMENTOS.some((orc) =>
    //                 orc.NUM_ORCAMENTO.toString().includes(stateLancamentos.inputLocalizarOrcamento)
    //             )
    //         );
    //     }

    //     if (stateLancamentos.inputLocalizarAutCartao) {
    //         compras = compras.filter((c) =>
    //             c.TIPOS_PAGAMENTO.some((p) =>
    //                 p.AUTORIZACAO?.toString().includes(stateLancamentos.inputLocalizarAutCartao)
    //             )
    //         );
    //     }

    //     // RN6: Exibir apenas valores não conferidos
    //     if (state.exibirApenasNaoConferidos) {
    //         compras = compras.map((c) => {
    //             const pagamentosNaoConferidos = c.TIPOS_PAGAMENTO.filter((p) => !p.CONFERIDO);
    //             return pagamentosNaoConferidos.length > 0
    //                 ? { ...c, TIPOS_PAGAMENTO: pagamentosNaoConferidos }
    //                 : null;
    //         }).filter((item) => item !== null) as any[];
    //     }

    //     // RN4: Filtro por formas de pagamento
    //     if (!state.pagamentosSelecionadosModal.includes("TODOS")) {
    //         compras = compras
    //             .map((c) => {
    //                 const pagamentosFiltrados = c.TIPOS_PAGAMENTO.filter((p) =>
    //                     state.pagamentosSelecionadosModal.includes(p.TIPO_PAGAMENTO)
    //                 );
    //                 return pagamentosFiltrados.length > 0 ? { ...c, TIPOS_PAGAMENTO: pagamentosFiltrados } : null;
    //             })
    //             .filter((item) => item !== null) as any[];
    //     }

    //     // RN7 e RN8: Buscar valor de conferência
    //     if (stateLancamentos.inputLocalizarValorSomatorio) {
    //         let encontrouValor = false;
    //         compras = compras.map((c) => {
    //             if (encontrouValor) return c; // Apenas o primeiro valor será marcado

    //             const pagamentos = c.TIPOS_PAGAMENTO.map((p) => {
    //                 if (
    //                     !p.CONFERIDO &&
    //                     parseFloat(p.VALOR) === parseFloat(stateLancamentos.inputLocalizarValorSomatorio)
    //                 ) {
    //                     encontrouValor = true;
    //                     return { ...p, CONFIRMADO: true }; // Marca o valor como encontrado (verde)
    //                 }
    //                 return p;
    //             });

    //             return { ...c, TIPOS_PAGAMENTO: pagamentos };
    //         });

    //         // RN10: Exibir toast se o valor não foi encontrado
    //         if (!encontrouValor) {
    //             toast.error("O valor digitado não foi localizado", { timeout: 3000 });
    //         }

    //         // RN11: Resetar input e focar novamente
    //         setTimeout(() => {
    //             stateLancamentos.inputLocalizarValorSomatorio = "";
    //             document.getElementById("inputLocalizarValorSomatorio")?.focus();
    //         }, 100);
    //     }

    //     return compras
    //         .sort((a, b) => new Date(a.HORA).getTime() - new Date(b.HORA).getTime())
    //         .map((compra, index) => ({
    //             ...compra,
    //             INDEX: index + 1,
    //         }));
    // }),

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

