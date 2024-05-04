import { reactive, computed } from "vue";
import { iFuncionario, iGetMesEAno, iTotalizador, iGetDadosParaImpressao } from "./interface";
import gerenciarFolhaPontoService from "./services/gerenciarFolhaPonto.service";
import Swal from "sweetalert2";
import router from "@/router";
import xModal, { iModalCreate } from "@/plugins/xModal/xModal";
import { mesesToSelect } from "@/constants/constants";
import { iEmpresa } from "@/models/interfaces";

export const state = reactive({
    funcionarios: {},
    mes: new Date().getMonth() + 1,
    ano: new Date().getFullYear(),
    selectedFuncionario: <number | null>null,
    loading: false,
    modalImprimirFolhaPonto: <iModalCreate>(<unknown>null),
    modalImprimirFolhaPontoOpened: false,
    dadosParaModalImpressao: {},
    empresa: <iEmpresa>{}
});

export const meses = mesesToSelect;

export const anos = computed(() => {
    const anosArray: number[] = [];
    const anoAtual = new Date().getFullYear();

    for (let i = 0; i < 10; i++) {
        const ano = anoAtual - 9 + i;
        anosArray.push(ano);
    }

    return anosArray;
});

export const funcionariosOrdenados = computed(() => {
    let funcionariosArray = <iFuncionario[]>[];

    for (let indexFuncionario in state.funcionarios) {
        funcionariosArray.push(state.funcionarios[indexFuncionario]);
    }

    funcionariosArray.sort((funcionario1, funcionario2) => {
        return funcionario1.NOME_COMP > funcionario2.NOME_COMP ? 1 : -1;
    });

    return funcionariosArray;
});

export const totalizador = computed(() => {
    const total: iTotalizador = {
        QTD_A_JUSTIFICAR: 0,
        QTD_FALTAS_JUSTIFICADAS: 0,
        QTD_PONTOS_INCOMPLETOS: 0,
        QTD_PONTOS_NAO_BATIDOS: 0,
        QTD_PONTOS_BATIDOS: 0,
        QTD_FUNCIONARIOS: 0,
        QTD_FUNCIONARIOS_COM_PENDENCIAS: 0,
        QTD_FUNCIONARIOS_SEM_PENDENCIAS: 0
    };

    let funcionarios: iFuncionario[] = Object.values(state.funcionarios);

    for (const func of funcionarios) {

        total.QTD_FALTAS_JUSTIFICADAS += func.QTD_FALTAS_JUSTIFICADAS;
        total.QTD_PONTOS_INCOMPLETOS += func.QTD_PONTOS_INCOMPLETOS;
        total.QTD_PONTOS_NAO_BATIDOS += func.QTD_PONTOS_NAO_BATIDOS;
        total.QTD_PONTOS_BATIDOS += func.QTD_PONTOS_BATIDOS;

        total.QTD_FUNCIONARIOS++;

        let pendencia = func.QTD_PONTOS_INCOMPLETOS + func.QTD_PONTOS_NAO_BATIDOS - func.QTD_FALTAS_JUSTIFICADAS;

        if (pendencia > 0) {
            total.QTD_FUNCIONARIOS_COM_PENDENCIAS++;
        } else {
            total.QTD_FUNCIONARIOS_SEM_PENDENCIAS++;
        }
    }

    total.QTD_A_JUSTIFICAR = total.QTD_PONTOS_INCOMPLETOS + total.QTD_PONTOS_NAO_BATIDOS - total.QTD_FALTAS_JUSTIFICADAS;

    return total;
});

export const actions = {
    async onFuncionarioChange() {
        await actions.getResumoPontosFuncionario(state.selectedFuncionario, state.mes, state.ano);
    },

    async getResumoPontosFuncionario(cod_funcionario: number, mes: number, ano: number) {
        state.loading = true;

        const param: iGetMesEAno = {
            cod_funcionario: cod_funcionario,
            mes: mes,
            ano: ano,
        };

        try {
            state.funcionarios = await gerenciarFolhaPontoService.getResumoPontosFuncionario(param);
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Ocorreu um erro ao buscar os funcionários",
            });
        } finally {
            state.loading = false;
        }
    },

    async getEmpresa() {
        try {
            const dados = await gerenciarFolhaPontoService.getEmpresa();
            state.empresa = dados[0];
        } catch (error) {
            console.error('Ocorreu um erro ao buscar os dados da empresa');
        }
    },

    async dadosParaImpressao(mes: number, ano: number) {
        const param: iGetDadosParaImpressao = {
            mes: mes,
            ano: ano,
        };

        state.loading = true;

        try {
            state.dadosParaModalImpressao = await gerenciarFolhaPontoService.getDadosParaImpressao(param);
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Ocorreu um erro ao buscar os dados para impressão",
            });
        }
        finally {
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

    onClickFuncionario(codFuncionario: number, mes: number, ano: number) {
        let query = {
            cod_funcionario: codFuncionario,
            mes: mes,
            ano: ano,
        };

        router.push({
            name: "gerenciarFolhaPontoDetalhes",
            query,
        });
    },

    async init(codFuncionario: number, mes: number, ano: number) {
        state.loading = true;

        await actions.getEmpresa();
        await actions.getResumoPontosFuncionario(codFuncionario, mes, ano);
        actions.modal();

        state.loading = false;
    },

    modal() {
        state.modalImprimirFolhaPonto = new xModal.create({
            height: 850,
            width: 1000,
            el: "#modalImprimirPontos",
            theme: "xModal-blue",
            onOpen: () => {
                state.modalImprimirFolhaPontoOpened = true;
            },
            onClose: () => {
                state.modalImprimirFolhaPontoOpened = false;
            },
        });
    },

    imprimirFolhaPontoTodosFuncionarios() {
        actions.dadosParaImpressao(state.mes, state.ano);

        state.modalImprimirFolhaPonto.open();
    },
};

export default { state, actions, meses, anos, totalizador };
