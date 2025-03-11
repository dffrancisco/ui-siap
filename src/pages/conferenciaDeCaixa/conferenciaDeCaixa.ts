import utils from './../../ts/utils';
import moment from "moment";
import { computed, reactive } from "vue";
import { iCaixas, iFuncionarios, iOptions, iParamFecharCaixa, iParamsAbrirCaixa, iTodasAsCompras, iValoresRecebidos } from "./interfaces";
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
    funcionarios: <iFuncionarios[]>[],
    todasAsCompras: <iTodasAsCompras[]>[],
    valoresRecebidos: <iValoresRecebidos[]>[],
    modalAbrirCaixaOpened: false,
    pagamentoSelecionado: null,
    headers: [
        { title: "#", key: "id", value: (item: any) => `#` + item.id },
        {
            title: "N° Orçamento / Valor",
            key: "NUM_ORCAMENTO",
            value: (item: any) => {
                if (item.DADOS_ORCAMENTO?.length) {
                    return item.DADOS_ORCAMENTO.map(d => d.NUM).join(", ");
                }
                return item.NUM_ORCAMENTO;
            }
        },
        { title: "Hora", key: "HORA", value: (item: any) => utils.formatHora(item.HORA) },
        { title: "Pagamentos", key: "DESCRICAO_PAGAMENTO" },
        { title: "Total", key: "VALOR", value: (item: any) => utils.formatValor(item.VALOR) },
    ],
});

export const options: iOptions[] = [
    { value: "caixas", label: "Caixas" },
    { value: "lancamentos", label: "Lançamentos" },
    { value: "sangria", label: "Sangria" },
    { value: "devolucao", label: "Devolução" },
];

export const funcionariosDisponiveis = computed(() =>
    state.funcionarios.filter(funcionario => {
        const temCaixaAberto = state.caixas.some(
            caixa => caixa.COD_FUNCIONARIO === funcionario.COD_FUNCIONARIO && caixa.STATUS === 1
        );
        return !temCaixaAberto;
    })
);

export const comprasFiltradas = computed(() => {
    let compras = state.pagamentoSelecionado
        ? state.todasAsCompras.filter(c =>
            c.TIPO_PAGAMENTO.split(",").map(tp => tp.trim()).includes(String(state.pagamentoSelecionado).trim())
        )
        : state.todasAsCompras;

    return compras
        .sort((a, b) => new Date(a.HORA).getTime() - new Date(b.HORA).getTime()) // Ordena por horário
        .map((compra, index) => ({
            ...compra,
            INDEX: index + 1,
        }));
});


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
                state.mdcAberto = false;
                state.msgAberturaMDC = "";
                state.funcionarios = [];
                state.caixas = [];
                state.todasAsCompras = [];
                state.valoresRecebidos = [];
                return;
            } else {
                state.mdcAberto = true;
                state.msgAberturaMDC = data.mdc[0].OPEN_CLOSE;
                state.funcionarios = data.funcionarios;
                state.caixas = data.caixas;
                state.todasAsCompras = data.comprasAgrupadas;
                state.valoresRecebidos = data.valoresRecebidosAll;
            }


        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao trazer os dados iniciais!"
            });
        } finally {
            state.loading = false;
        }
    },

    alterarOpcao(novaOpcao: string) {
        state.selectedOption = novaOpcao;
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
        const pagamento = state.valoresRecebidos.find(p => p.TIPO_PAGAMENTO === tipoPagamento);
        return pagamento ? pagamento.DESCRICAO_PAGAMENTO : "Desconhecido";
    }
}
