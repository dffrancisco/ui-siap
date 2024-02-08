import { computed, nextTick, reactive, ref, watch } from "vue";
import { RouteLocationNormalizedLoaded } from "vue-router";
import { iCodFunc, iParam, iParamComCPF, iPonto, iTipoFaltasCount } from "./interface";
import Swal from "sweetalert2";
import gerenciarFolhaPontoDetalhesService from "./services/gerenciarFolhaPontoDetalhes.service";
import xModal, { iModalCreate } from "@/plugins/xModal/xModal";
import moment from "moment";

export const state = reactive({
  pontos: {},
  resumoPontosFuncionario: {},
  tipoFaltas: <iTipoFaltasCount[]>[],
  contadorDeFaltas: {},
  loading: false,
  loadingCalendar: false,
  nome: <string | null>null,
  cargo: <string | null>null,
  codFuncionario: 0,
  dadosFuncionario: {},
  cpf: <string | null>null,
  QTD_A_JUSTIFICAR: 0,
  QTD_FALTAS_JUSTIFICADAS: 0,
  QTD_PONTOS_INCOMPLETOS: 0,
  QTD_PONTOS_NAO_BATIDOS: 0,
  mes: 1,
  ano: 2024,
  initialDate: <any>new Date(),
  modalJustificarFalta: <iModalCreate>(<unknown>null),
  modalJustificarFaltaOpened: false,
  dataAusencia: <any>new Date(),
  diaSelecionado: undefined,
});

export const actions = {
  getFotoFuncionarioURL(cpf: string) {
    if (!cpf) {
      return "";
    }

    const cpfSanitizado = cpf.replaceAll(".", "").replaceAll("-", "");
    return `http://www.reallatas.com.br/foto_funcionarios/${cpfSanitizado}.jpg`;
  },

  async getDadosFuncionario(cod_funcionario: number) {
    const param: iCodFunc = {
      cod_funcionario: cod_funcionario,
    };

    try {
      state.dadosFuncionario = await gerenciarFolhaPontoDetalhesService.getDadosFuncionario(param);
      state.nome = state.dadosFuncionario[0].NOME_COMP;
      state.cpf = state.dadosFuncionario[0].CPF;
      state.cargo = state.dadosFuncionario[0].CARGO;
      // console.log(state.dadosFuncionario[0].CARGO);
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Ocorreu um erro ao buscar os dados do funcionário.",
      });
    }
  },

  async getPontos(cod_funcionario: number, cpf: string, mes: number, ano: number) {
    const param: iParamComCPF = {
      cod_funcionario: cod_funcionario,
      cpf: cpf,
      mes: mes,
      ano: ano,
    };

    try {
      state.pontos = await gerenciarFolhaPontoDetalhesService.getPontos(param);
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Ocorreu um erro ao buscar os pontos do funcionário.",
      });
    }
  },

  async getTipoFaltas(cod_funcionario: number, mes: number, ano: number) {
    const param: iParam = {
      cod_funcionario: cod_funcionario,
      mes: mes,
      ano: ano,
    };
    try {
      //@ts-ignore
      state.tipoFaltas = await gerenciarFolhaPontoDetalhesService.getTipoFaltas(param);
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Ocorreu um erro ao buscar os tipos de faltas.",
      });
    }
  },

  async getResumoPontosFuncionario(cod_funcionario: number, mes: number, ano: number) {
    const param: iParam = {
      cod_funcionario: cod_funcionario,
      mes: mes,
      ano: ano,
    };

    try {
      state.resumoPontosFuncionario = await gerenciarFolhaPontoDetalhesService.getResumoPontosFuncionario(param);

      for (const value of Object.values(state.resumoPontosFuncionario)) {
        for (const [prop, val] of Object.entries(value)) {
          if (state.hasOwnProperty(prop)) {
            state[prop] = val;
          }
        }
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Ocorreu um erro ao buscar o resumo dos pontos do funcionário.",
      });
    }
  },

  formatarEvento(titulo: string, dataInicio: Date, dataFim: Date, cor = "#6495ED") {
    if (titulo == null) {
      titulo = "---------";
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
      return new Date(hora).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else {
      return null;
    }
  },

  clickModalJustificarAusencia(event: any) {
    const data = event.date || new Date(event.start);

    if (data.getDay() != 0) {
      let dia = data.getDate();
      let mes = data.getMonth() + 1;
      let ano = data.getFullYear();
      let diaFormatado = dia < 10 ? "0" + dia : dia;
      let mesFormatado = mes < 10 ? "0" + mes : mes;
      let dataFormatada = `${diaFormatado}/${mesFormatado}/${ano}`;

      state.dataAusencia = dataFormatada;
      state.diaSelecionado = dia;
      state.modalJustificarFalta.open();
    } else {
      return;
    }
  },

  modal() {
    state.modalJustificarFalta = new xModal.create({
      height: 530,
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
  },

  init(route: RouteLocationNormalizedLoaded) {
    nextTick(async () => {
      state.loading = true;

      state.codFuncionario = Number(route.query.cod_funcionario);
      state.mes = Number(route.query.mes);
      state.ano = Number(route.query.ano);
      state.initialDate = new Date(state.ano, state.mes - 1, 1);
      actions.modal();

      await actions.getDadosFuncionario(state.codFuncionario);
      await actions.getPontos(state.codFuncionario, state.cpf, state.mes, state.ano);
      await actions.getResumoPontosFuncionario(state.codFuncionario, state.mes, state.ano);
      await actions.getTipoFaltas(state.codFuncionario, state.mes, state.ano);

      state.loading = false;
    });
  },
};

export const pontosCalendario = computed(() => {
  let eventos = [];
  for (let key of Object.keys(state.pontos)) {
    let ponto: iPonto = state.pontos[key];
    let dataInicio = new Date(ponto.DATA);
    let dataFim = new Date(ponto.DATA);

    if (ponto.HORA_CHEGADA || ponto.HORA_ALMOCO_INICIAL || ponto.HORA_ALMOCO_FINAL || ponto.HORA_SAIDA) {
      let horaFormatada = actions.formatarHora(ponto.HORA_CHEGADA);
      let eventoFormatado = actions.formatarEvento(horaFormatada, dataInicio, dataFim);

      eventos.push(eventoFormatado);

      horaFormatada = actions.formatarHora(ponto.HORA_ALMOCO_INICIAL);
      eventoFormatado = actions.formatarEvento(horaFormatada, dataInicio, dataFim, "#6495ED");

      eventos.push(eventoFormatado);

      horaFormatada = actions.formatarHora(ponto.HORA_ALMOCO_FINAL);
      eventoFormatado = actions.formatarEvento(horaFormatada, dataInicio, dataFim, "#6495ED");

      eventos.push(eventoFormatado);

      horaFormatada = actions.formatarHora(ponto.HORA_SAIDA);
      eventoFormatado = actions.formatarEvento(horaFormatada, dataInicio, dataFim);

      eventos.push(eventoFormatado);
    }

    if (ponto.STATUS) {
      let eventoFormatado = actions.formatarEvento(ponto.STATUS, dataInicio, dataFim, "#3CB371");

      eventos.push(eventoFormatado);
    }
  }

  return eventos;
});

export const selecionandoData = watch([() => state.mes, () => state.ano], async ([novoMes, novoAno]) => {
  console.log("aaaa");

  state.loadingCalendar = true;
  await actions.getPontos(state.codFuncionario, state.cpf, novoMes, novoAno);
  console.log("uiii");

  await actions.getResumoPontosFuncionario(state.codFuncionario, novoMes, novoAno);
  await actions.getTipoFaltas(state.codFuncionario, novoMes, novoAno);

  await nextTick();

  state.initialDate = new Date(novoAno, novoMes - 1, 1);
  state.loadingCalendar = false;
});

export const pontosDiaSelecionado = computed(() => {
  if (state.diaSelecionado == undefined) {
    return {} as iPonto;
  }

  let pontos = state.pontos["Dia:" + state.diaSelecionado];

  if (pontos == undefined) {
    return {} as iPonto;
  }

  let nome = ref(state.nome);
  let cpf = ref(state.cpf);
  let cargo = ref(state.cargo);

  const formatarData = (data) => {
    if (data) {
      return moment(data).format("HH:mm");
    }

    return null;
  };

  pontos = {
    ...pontos,
    nome: nome.value,
    cpf: cpf.value,
    cargo: cargo.value,
    HORA_CHEGADA: formatarData(pontos.HORA_CHEGADA),
    HORA_ALMOCO_INICIAL: formatarData(pontos.HORA_ALMOCO_INICIAL),
    HORA_ALMOCO_FINAL: formatarData(pontos.HORA_ALMOCO_FINAL),
    HORA_SAIDA: formatarData(pontos.HORA_SAIDA),
  };

  return pontos;
});

export default { state, actions };
