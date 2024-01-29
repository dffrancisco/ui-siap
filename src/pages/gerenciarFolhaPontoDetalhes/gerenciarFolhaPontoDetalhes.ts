import { computed, nextTick, reactive } from "vue";
import { RouteLocationNormalizedLoaded } from "vue-router";
import { iAusencias, iParam, iPonto, iTipoFaltasCount } from "./interface";
import Swal from "sweetalert2";
import gerenciarFolhaPontoDetalhesService from "./services/gerenciarFolhaPontoDetalhes.service";
import xModal, { iModalCreate } from "@/plugins/xModal/xModal";

export const state = reactive({
  pontos: {},
  resumoPontosFuncionario: {},
  tipoFaltas: <iTipoFaltasCount[]>[],
  contadorDeFaltas: {},
  loading: false,
  nome: <string | null>null,
  cargo: <string | null>null,
  codFuncionario: 0,
  QTD_A_JUSTIFICAR: 0,
  QTD_FALTAS_JUSTIFICADAS: 0,
  QTD_PONTOS_INCOMPLETOS: 0,
  QTD_PONTOS_NAO_BATIDOS: 0,
  cpf: <string | null>null,
  mes: 1,
  ano: 2024,
  today: <any>new Date(),
  modalJustificarFalta: <iModalCreate>(<unknown>null),
  ausencias: <iAusencias[]>[],
  dataAusencia: <any>new Date(),
});

export const infoParaAusencia = computed((): iAusencias => {
  return {
    COD_FUNCIONARIO: state.codFuncionario,
    CPF: state.cpf,
    NOME_FUNCIONARIO: state.nome,
    DATA_AUSENCIA: state.dataAusencia,
  };
});

export const actions = {
  begin() {
    nextTick(() => {
      actions.modal();
    });
  },

  getFotoFuncionarioURL(cpf: string) {
    if (!cpf) {
      return "";
    }

    const cpfSanitizado = cpf.replaceAll(".", "").replaceAll("-", "");
    return `http://www.reallatas.com.br/foto_funcionarios/${cpfSanitizado}.jpg`;
  },

  async getPontos(cod_funcionario: number, mes: number, ano: number) {
    const param: iParam = {
      cod_funcionario: cod_funcionario,
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

  formatarEvento(titulo: string, dataInicio: Date, dataFim: Date, cor = "3c8dbc00") {
    if (titulo == null) {
      titulo = "---------";
      cor = "red";
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

  alternandoMesEAno(info: any) {
    const mes = info.view.currentStart.getMonth() + 1;
    const ano = info.view.currentStart.getFullYear();

    state.mes = mes;
    state.ano = ano;
  },

  clickModalJustificarAusencia(event: any) {
    const data = event.date;
    if (data.getDay() != 0) {
      let dia = data.getDate();
      let mes = data.getMonth() + 1;
      let ano = data.getFullYear();
      let diaFormatado = dia < 10 ? "0" + dia : dia;
      let mesFormatado = mes < 10 ? "0" + mes : mes;
      let dataFormatada = `${diaFormatado}.${mesFormatado}.${ano}`;

      state.dataAusencia = dataFormatada;

      actions.justificarAusencia(state.dataAusencia);
    } else {
      return;
    }
  },

  modal() {
    state.modalJustificarFalta = new xModal.create({
      height: 500,
      width: 600,
      el: "#modalJustificarFalta",
    });
  },

  justificarAusencia(dataAusencia) {
    // state.loading = true;
    // console.log(infoParaAusencia, dataAusencia);

    state.modalJustificarFalta.open();

    // state.loading = false;
  },

  init(route: RouteLocationNormalizedLoaded) {
    nextTick(async () => {
      state.loading = true;

      state.nome = String(route.query.nome);
      state.cargo = String(route.query.cargo);
      state.codFuncionario = Number(route.query.cod_funcionario);
      state.cpf = String(route.query.cpf);
      state.mes = Number(route.query.mes);
      state.ano = Number(route.query.ano);

      await actions.getPontos(state.codFuncionario, state.mes, state.ano);
      await actions.getResumoPontosFuncionario(state.codFuncionario, state.mes, state.ano);
      await actions.getTipoFaltas(state.codFuncionario, state.mes, state.ano);

      //state.today = new Date(`${state.ano}-${state.mes - 1}-01`);
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
      eventoFormatado = actions.formatarEvento(horaFormatada, dataInicio, dataFim, "3c8dbc00");

      eventos.push(eventoFormatado);

      horaFormatada = actions.formatarHora(ponto.HORA_ALMOCO_FINAL);
      eventoFormatado = actions.formatarEvento(horaFormatada, dataInicio, dataFim, "3c8dbc00");

      eventos.push(eventoFormatado);

      horaFormatada = actions.formatarHora(ponto.HORA_SAIDA);
      eventoFormatado = actions.formatarEvento(horaFormatada, dataInicio, dataFim);

      eventos.push(eventoFormatado);
    }

    if (ponto.STATUS) {
      let eventoFormatado = actions.formatarEvento(ponto.STATUS, dataInicio, dataFim, "green");

      eventos.push(eventoFormatado);
    }
  }

  return eventos;
});

export default { state, actions };
