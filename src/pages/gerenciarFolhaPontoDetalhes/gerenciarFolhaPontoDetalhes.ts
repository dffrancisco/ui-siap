import { horaFormatada } from "./../entregarReceberDetalhes/entregarReceberDetalhes";
import { computed, nextTick, reactive } from "vue";
import { RouteLocationNormalizedLoaded } from "vue-router";
import { iParam, iPonto } from "./interface";
import Swal from "sweetalert2";
import gerenciarFolhaPontoDetalhesService from "./services/gerenciarFolhaPontoDetalhes.service";

export const state = reactive({
  pontos: {},
  loading: false,
  codFuncionario: 0,
  cpf: <string | null>null,
  mes: 1,
  ano: 2024,
  today: <any>new Date(),
});

export const actions = {
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

  formatarEvento(titulo: string, dataInicio: Date, dataFim: Date, cor = "blue") {
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

  init(route: RouteLocationNormalizedLoaded) {
    nextTick(async () => {
      state.loading = true;

      state.codFuncionario = Number(route.query.cod_funcionario);
      state.cpf = String(route.query.cpf);
      state.mes = Number(route.query.mes);
      state.ano = Number(route.query.ano);

      await actions.getPontos(state.codFuncionario, state.mes, state.ano);
      // state.today = new Date(`${state.ano}-${state.mes-1}-01`)
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
      eventoFormatado = actions.formatarEvento(horaFormatada, dataInicio, dataFim, "blue");

      eventos.push(eventoFormatado);

      horaFormatada = actions.formatarHora(ponto.HORA_ALMOCO_FINAL);
      eventoFormatado = actions.formatarEvento(horaFormatada, dataInicio, dataFim, "blue");

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

export const onDataClicada = (event) => {
  const ponto = event.ponto;
  if (ponto) {
    console.log("Informações do ponto:", ponto);
  }
};

export default { state, actions, onDataClicada };
