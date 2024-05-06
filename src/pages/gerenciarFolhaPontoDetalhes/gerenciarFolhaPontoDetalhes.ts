import { computed, nextTick, reactive } from "vue";
import { RouteLocationNormalizedLoaded } from "vue-router";
import {
    iDadosDocumento,
    iGetDadosParaImpressaoIndividual,
    iListaCodFuncionario,
    iParamDocumentoAusencia,
    iParamGetListaCodFuncionarios,
    iPonto,
    iTipoFaltas,
    iTotalizadorDeFaltas,
} from "./interface";
import Swal from "sweetalert2";
import gerenciarFolhaPontoDetalhesService from "./services/gerenciarFolhaPontoDetalhes.service";
import xModal, { iModalCreate } from "@/plugins/xModal/xModal";
import moment from "moment";
import router from "@/router";
import { mesesToSelect } from "@/constants/constants";
import { iEmpresa } from "@/models/interfaces";

export const state = reactive({
    empresa: <iEmpresa>{},
    detalhes: {} as any,
    pontos: {},
    resumoPontos: {},
    tipoFaltas: <iTipoFaltas[]>[],
    loading: false,
    loadingCalendar: false,
    nome: <string | null>null,
    cargo: <string | null>null,
    loginFuncionario: <string | null>null,
    codFuncionario: 0,
    dataAdmissao: null,
    dadosFuncionario: {} as any,
    cpf: <string | null>null,
    QTD_A_JUSTIFICAR: 0,
    QTD_FALTAS_JUSTIFICADAS: 0,
    QTD_PONTOS_INCOMPLETOS: 0,
    QTD_PONTOS_NAO_BATIDOS: 0,
    mes: new Date().getMonth() + 1,
    ano: new Date().getFullYear(),
    meses: mesesToSelect,
    initialDate: <any>new Date(),
    modalJustificarFalta: <iModalCreate>(<unknown>null),
    modalJustificarFaltaOpened: false,
    dataAusencia: <any>new Date(),
    diaSelecionado: undefined,
    documentoFalta: <iDadosDocumento[]>[],
    modalImprimirFolhaPonto: <iModalCreate>(<unknown>null),
    modalImprimirFolhaPontoOpened: false,
    dadosParaModalImpressao: {},
    totalizadorFaltas: <iTotalizadorDeFaltas[]>[],
    listaCodFuncionarios: <iListaCodFuncionario[]>[],
    nextFuncionarioBtnDisabled: false,
    backFuncionarioBtnDisabled: false
});

export const anos = computed(() => {
    const anosArray: number[] = [];
    const anoAtual = new Date().getFullYear();

    for (let i = 0; i < 10; i++) {
        const ano = anoAtual - 9 + i;
        anosArray.push(ano);
    }

    return anosArray
});

export const actions = {
    getFotoFuncionarioURL(cpf: string) {
        if (!cpf) {
            return "";
        }

        const cpfSanitizado = cpf.replaceAll(".", "").replaceAll("-", "");
        return `https://www.reallatas.com.br/_serverAPP/thumb.php?img=http://www.reallatas.com.br/foto_funcionarios/${cpfSanitizado}.jpg`;
    },

    onClickVoltar() {
        router.push("gerenciarFolhaPonto");
    },

    async atualizarTela() {
        state.modalJustificarFalta.close();
        state.loading = true;
        await actions.getDetalhes(state.codFuncionario, state.mes, state.ano);
        state.loading = false;
    },

    fecharModal() {
        state.modalJustificarFalta.close();
    },

    preencherBackgroundColorDataIncompleta() {
        let diasSemPonto = [];
        let dataInicio = moment({ year: state.ano, month: state.mes - 1, day: 1 })

        let dataFim = moment(dataInicio).endOf("month")

        let diasNoMes = dataFim.diff(dataInicio, 'days') + 1


        for (let dia = 1; dia <= diasNoMes; dia++) {
            if (state.pontos[`Dia:${dia}`] == undefined) {
                let data = moment({ year: state.ano, month: state.mes - 1, day: dia });

                let isDomingo = data.weekday() == 0 ? true : false;

                if (isDomingo == false && data.isBefore(moment().add(-1, 'day'))) {
                    diasSemPonto.push(data.format('YYYY-MM-DD'));
                }
            }
        }

        diasSemPonto.forEach((data) => {
            const elemento = document.querySelector(`td[data-date='${data}']`);
            elemento.classList.add('calendario_data_sem_ponto');
        })

    },

    async btnMesSeguinte() {
        let dataHoje = moment()
        let mesSelecionado = moment({ year: state.ano, month: state.mes - 1, day: 1 });

        mesSelecionado.add(1, 'month');

        let mesSeguinte = mesSelecionado.month() + 1;
        let anoSeguinte = mesSelecionado.year();

        if (dataHoje.isBefore(mesSelecionado)) {
            return false;
        }

        state.mes = mesSeguinte;
        state.ano = anoSeguinte;

        await actions.carregarDados()

        state.initialDate = new Date(state.ano, state.mes - 1, 1);
    },

    async btnMesAnterior() {
        let mesSelecionado = moment({ year: state.ano, month: state.mes - 1, day: 1 });

        mesSelecionado.subtract(1, 'month');

        let mesSeguinte = mesSelecionado.month() + 1;
        let anoSeguinte = mesSelecionado.year();

        state.mes = mesSeguinte;
        state.ano = anoSeguinte;

        await actions.carregarDados()

        state.initialDate = new Date(state.ano, state.mes - 1, 1);
    },


    async getDetalhes(cod_funcionario: number, mes: number, ano: number) {

        state.loadingCalendar = true
        state.loading = true;

        try {
            const detalhes = await gerenciarFolhaPontoDetalhesService.getDetalhes({ cod_funcionario, mes, ano });
            state.empresa = detalhes.empresa;
            state.dadosFuncionario = detalhes.dadosFuncionario;
            state.pontos = detalhes.pontos;
            state.tipoFaltas = detalhes.tipoFaltas;
            state.nome = state.dadosFuncionario.NOME_COMP;
            state.cpf = state.dadosFuncionario.CPF;
            state.cargo = state.dadosFuncionario.CARGO;
            state.loginFuncionario = state.dadosFuncionario.LOGIN;
            state.dataAdmissao = state.dadosFuncionario.DATA_ADMISSAO;

            await nextTick();
            state.initialDate = new Date(state.ano, state.mes - 1, 1);


        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                text: "Ocorreu um erro ao buscar os dados do funcionário.",
            });
        } finally {
            state.loading = false;
            state.loadingCalendar = false;
        }

        setTimeout(() => {
            actions.preencherBackgroundColorDataIncompleta()
        }, 100)
    },

    async getTotalizadorFuncionario(cod_funcionario: number, mes: number, ano: number) {
        state.loading = true;

        try {
            const totais = await gerenciarFolhaPontoDetalhesService.getTotalizadorFuncionario({
                cod_funcionario,
                mes,
                ano
            });

            state.resumoPontos = totais.resumoPontos;
            state.totalizadorFaltas = totais.totalizadorDeFaltas;
            state.QTD_PONTOS_NAO_BATIDOS = totais.resumoPontos.QTD_PONTOS_NAO_BATIDOS;
            state.QTD_FALTAS_JUSTIFICADAS = totais.resumoPontos.QTD_FALTAS_JUSTIFICADAS;
            state.QTD_PONTOS_INCOMPLETOS = totais.resumoPontos.QTD_PONTOS_INCOMPLETOS;
            state.QTD_A_JUSTIFICAR = totais.resumoPontos.QTD_A_JUSTIFICAR;

        } catch (error) {
            console.error(error)
        } finally {
            state.loading = false;
        }
    },

    async getDocumento() {
        let data = state.dataAusencia;
        data = actions.formatarData(data);
        let cpf = state.cpf;

        const param: iParamDocumentoAusencia = {
            data: data,
            cpf: cpf,
        };

        try {
            state.documentoFalta = await gerenciarFolhaPontoDetalhesService.getDocumentoAusencia(param);
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Ocorreu um erro ao visualizar o documento.",
            });
        }
    },

    formatarEvento(titulo: string, dataInicio: string, dataFim: string, jaFoiJustificado: boolean, qtdPontosDia: number, status: string, cor = "#6495ED") {

        let isSabado = moment(dataInicio).weekday() == 6;
        let pontosBatidosPar = qtdPontosDia % 2 == 0;

        if (titulo == null && isSabado == true && pontosBatidosPar) {
            titulo = "---------";
            cor = "#acc8fb";
        }

        if (titulo == null && status) {
            titulo = status;
            cor = actions.setarCorFalta(status)
        }

        if (titulo == null) {
            titulo = "---------";
            cor = "#FF6347";
        }

        if (jaFoiJustificado == true) {
            titulo = "Justificado";
            cor = "#FF6347";
        }

        return {
            title: titulo,
            start: dataInicio,
            end: dataFim,
            color: cor,
            allDay: true,
        };
    },

    formatarHora(hora) {
        if (hora) {
            return moment(hora).format('HH:mm');
        }

        return null;
    },

    verificarAtraso(hora) {
        let horaFormatada = moment(hora).format('HH:mm:ss');

        let atraso = moment(horaFormatada, 'HH:mm:ss').isAfter(moment('08:04:59', 'HH:mm:ss'))

        if (atraso) {
            return true
        }

        return false
    },

    verificarSaidaMaisCedo(hora) {
        let horaFormatada = moment(hora).format('HH:mm:ss');

        let saidaMaisCedo = moment(horaFormatada, 'HH:mm:ss').isBefore(moment('17:54:59', 'HH:mm:ss'))

        if (saidaMaisCedo) {
            return true
        }

        return false
    },


    formatarData(data) {
        const partesData = data.split("/");
        const dataObjeto = new Date(partesData[2], partesData[1] - 1, partesData[0]);
        const ano = dataObjeto.getFullYear();
        let mes = dataObjeto.getMonth() + 1;
        let dia = dataObjeto.getDate();
        const dataFormatada = `${ano}-${mes < 10 ? "0" + mes : mes}-${dia < 10 ? "0" + dia : dia}`;

        return dataFormatada;
    },

    clickModalJustificarAusencia(event: any) {
        const data = event.date || new Date(event.start);

        let dia = data.getDate();
        let mes = data.getMonth() + 1;
        let ano = data.getFullYear();
        let diaFormatado = dia < 10 ? "0" + dia : dia;
        let mesFormatado = mes < 10 ? "0" + mes : mes;
        let dataFormatada = `${diaFormatado}/${mesFormatado}/${ano}`;

        state.dataAusencia = dataFormatada;
        state.diaSelecionado = dia;

        actions.getDocumento();

        state.modalJustificarFalta.open();
    },

    modal() {
        state.modalJustificarFalta = new xModal.create({
            height: 486,
            width: 700,
            el: "#modalJustificarFalta",
            theme: "xModal-blue",
            onOpen: () => {
                state.modalJustificarFaltaOpened = true;
            },
            onClose: () => {
                state.modalJustificarFaltaOpened = false;
            },
        });

        state.modalImprimirFolhaPonto = new xModal.create({
            height: 800,
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

    setarCorFalta(status: string) {
        switch (status) {
            case "Atestado":
                return "#33691E";
            case "Falta Abonada":
                return "#7e57c2";
            case "Falta":
                return "#7e57c2";
            case "Falta Justificada":
                return "#7e57c2";
            case "Suspenso":
                return "#dd2c00";
            case "Feriado":
                return "#4caf50";
            case "Dia de Folga":
                return "#4caf50";
            case "Em outra Loja":
                return "#c494f3";
            case "Meia Falta":
                return "#7e57c2";
            case "Meio Afastamento":
                return "#33691E";
            case "Atraso Justificado":
                return "#127071";
            default:
                return "#8d6e63";
        }
    },

    init(route: RouteLocationNormalizedLoaded) {
        nextTick(async () => {

            actions.modal();

            state.codFuncionario = Number(route.query.cod_funcionario);
            state.mes = Number(route.query.mes);
            state.ano = Number(route.query.ano);
            state.initialDate = new Date(state.ano, state.mes - 1, 1);

            actions.getListaCodFuncionarios();

            actions.carregarDados();
        });
    },

    nextFuncionario() {
        const currentIndex = state.listaCodFuncionarios.findIndex(funcionario =>
            funcionario.COD_FUNCIONARIO == state.codFuncionario
        );

        const nextIndex = currentIndex + 1;

        state.codFuncionario = state.listaCodFuncionarios[nextIndex].COD_FUNCIONARIO;
        state.nextFuncionarioBtnDisabled = nextIndex == state.listaCodFuncionarios.length - 1

        state.backFuncionarioBtnDisabled = false;

        actions.carregarDados();
    },

    backFuncionario() {
        const currentIndex = state.listaCodFuncionarios.findIndex(funcionario =>
            funcionario.COD_FUNCIONARIO == state.codFuncionario
        );

        const nextIndex = currentIndex - 1;

        state.codFuncionario = state.listaCodFuncionarios[nextIndex].COD_FUNCIONARIO;
        state.backFuncionarioBtnDisabled = currentIndex == 1

        state.nextFuncionarioBtnDisabled = false

        actions.carregarDados();
    },

    async carregarDados() {
        await actions.getDetalhes(state.codFuncionario, state.mes, state.ano);
        await actions.getTotalizadorFuncionario(state.codFuncionario, state.mes, state.ano);
    },

    imprimirFolhaPonto() {
        actions.dadosParaImpressao(state.mes, state.ano);
        state.modalImprimirFolhaPonto.open();
    },

    async dadosParaImpressao(mes: number, ano: number) {
        const param: iGetDadosParaImpressaoIndividual = {
            cod_funcionario: state.codFuncionario,
            mes: mes,
            ano: ano,
        };

        try {
            state.dadosParaModalImpressao = await gerenciarFolhaPontoDetalhesService.getDadosParaImpressao(param);
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Ocorreu um erro ao buscar os dados para impressão",
            });
        }
    },

    async getListaCodFuncionarios() {
        try {
            state.loading = true;

            let param: iParamGetListaCodFuncionarios = {
                mes: state.mes,
                ano: state.ano,
            };

            state.listaCodFuncionarios = await gerenciarFolhaPontoDetalhesService.getListaCodFuncionarios(param);

            const currentIndex = state.listaCodFuncionarios.findIndex(funcionario =>
                funcionario.COD_FUNCIONARIO == state.codFuncionario
            );

            if (currentIndex != -1) {
                state.nextFuncionarioBtnDisabled = currentIndex == state.listaCodFuncionarios.length - 1;
                state.backFuncionarioBtnDisabled = currentIndex == 0;
            }

            state.loading = false;
        } catch (error) {
            state.loading = false;
            Swal.fire({
                icon: "error",
                text: "Ocorreu um erro ao buscar a lista de funcionários",
            });
        }
    }
};

export const isSixWeeks = computed(() => {
    let primeiraSemanaMes = moment({ year: state.ano, month: state.mes - 1, day: 1 }).weeks();
    let ultimaSemanaMes = moment({ year: state.ano, month: state.mes - 1, day: 1 }).endOf('month').weeks();
    return (ultimaSemanaMes - primeiraSemanaMes) >= 5 ? true : false;
})

export const pontosCalendario = computed(() => {
    let eventos = [];

    for (let key of Object.keys(state.pontos)) {
        let ponto: iPonto = state.pontos[key];
        let dataInicio = moment(ponto.DATA).format('YYYY-MM-DD');
        let dataFim = moment(ponto.DATA).format('YYYY-MM-DD');

        const { HORA_CHEGADA, HORA_ALMOCO_FINAL, HORA_ALMOCO_INICIAL, HORA_SAIDA, TIPO } = ponto;

        const STATUS = state.tipoFaltas.find(tipo => tipo.TIPO == TIPO)?.DESCRICAO

        let qtdPontosDia = 0

        if (HORA_CHEGADA || HORA_ALMOCO_INICIAL || HORA_ALMOCO_FINAL || HORA_SAIDA) {

            if (HORA_CHEGADA) qtdPontosDia++;
            if (HORA_ALMOCO_INICIAL) qtdPontosDia++;
            if (HORA_ALMOCO_FINAL) qtdPontosDia++;
            if (HORA_SAIDA) qtdPontosDia++;

            let cor

            let jaFoiJustificado = HORA_CHEGADA == null && TIPO == 9;
            let atraso = actions.verificarAtraso(HORA_CHEGADA)

            if (atraso) {
                cor = '#f15500'
            }

            let horaFormatada = actions.formatarHora(HORA_CHEGADA);
            let eventoFormatado = actions.formatarEvento(horaFormatada, dataInicio, dataFim, jaFoiJustificado, qtdPontosDia, STATUS, cor);

            eventos.push(eventoFormatado);

            jaFoiJustificado = HORA_ALMOCO_INICIAL == null && TIPO == 9;
            horaFormatada = actions.formatarHora(HORA_ALMOCO_INICIAL);
            eventoFormatado = actions.formatarEvento(horaFormatada, dataInicio, dataFim, jaFoiJustificado, qtdPontosDia, STATUS);

            eventos.push(eventoFormatado);

            jaFoiJustificado = HORA_ALMOCO_FINAL == null && TIPO == 9;
            horaFormatada = actions.formatarHora(HORA_ALMOCO_FINAL);
            eventoFormatado = actions.formatarEvento(horaFormatada, dataInicio, dataFim, jaFoiJustificado, qtdPontosDia, STATUS);

            eventos.push(eventoFormatado);

            jaFoiJustificado = HORA_SAIDA == null && TIPO == 9;
            let saidaMaisCedo = actions.verificarSaidaMaisCedo(HORA_SAIDA)

            cor = '#6495ED'

            if (saidaMaisCedo) {
                cor = '#f15500'
            }

            horaFormatada = actions.formatarHora(HORA_SAIDA);
            eventoFormatado = actions.formatarEvento(horaFormatada, dataInicio, dataFim, jaFoiJustificado, qtdPontosDia, STATUS, cor);

            eventos.push(eventoFormatado);

        }

        if (STATUS && TIPO != 9 && qtdPontosDia == 0 || TIPO == 14) {
            let cor = actions.setarCorFalta(STATUS)

            let eventoFormatado = actions.formatarEvento(STATUS, dataInicio, dataFim, false, qtdPontosDia, STATUS, cor);

            eventos.push(eventoFormatado);
        }
    }

    return eventos;
});

export const pontosDiaSelecionado = computed(() => {
    if (state.diaSelecionado == undefined) {
        return {} as iPonto;
    }

    let pontos = state.pontos["Dia:" + state.diaSelecionado];

    if (pontos == undefined) {
        return {} as iPonto;
    }

    const formatarData = (data) => {
        if (data) {
            return moment(data).format("HH:mm");
        }

        return null;
    };

    pontos = {
        ...pontos,
        nome: state.nome,
        cpf: state.cpf,
        cargo: state.cargo,
        HORA_CHEGADA: formatarData(pontos.HORA_CHEGADA),
        HORA_ALMOCO_INICIAL: formatarData(pontos.HORA_ALMOCO_INICIAL),
        HORA_ALMOCO_FINAL: formatarData(pontos.HORA_ALMOCO_FINAL),
        HORA_SAIDA: formatarData(pontos.HORA_SAIDA),
    };

    return pontos;
});

export const tipoFaltaModal = computed(() => {
    const { HORA_CHEGADA, HORA_ALMOCO_INICIAL, HORA_ALMOCO_FINAL, HORA_SAIDA } = pontosDiaSelecionado.value

    let tipoFaltas: iTipoFaltas[] = [...state.tipoFaltas];

    const temAlgumPontoBatido = [HORA_CHEGADA, HORA_ALMOCO_INICIAL, HORA_ALMOCO_FINAL, HORA_SAIDA];

    const pontosBatidos = temAlgumPontoBatido.filter(ponto => ponto);

    if (pontosBatidos.length == 4) {
        return tipoFaltas.filter(tipoFalta => [14].includes(tipoFalta.TIPO));
    }

    if (pontosBatidos.length == 3) {
        return tipoFaltas.filter(tipoFalta => ![7, 10, 11, 12, 13, 14].includes(tipoFalta.TIPO));
    }

    if (pontosBatidos.length == 1 || pontosBatidos.length == 2) {
        return tipoFaltas.filter(tipoFalta => ![7, 10, 13, 14].includes(tipoFalta.TIPO));
    }

    if (pontosBatidos.length == 0) {
        return tipoFaltas.filter(tipoFalta => ![9, 11, 12, 14].includes(tipoFalta.TIPO));
    }
});

export default { state, actions };
