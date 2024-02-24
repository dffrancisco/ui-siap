<script setup lang="ts">
import { useRoute } from "vue-router";
import {
  actions,
  state,
  pontosCalendario,
  pontosDiaSelecionado,
  tipoFaltaModal,
} from "./gerenciarFolhaPontoDetalhes";
import { meses, anos } from "../gerenciarFolhaPonto/gerenciarFolhaPonto";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
//@ts-ignore
import interactionPlugin from "@fullcalendar/interaction";
import ModalJustificarFalta from "./components/modalJustificarFalta.vue";
import modalImprimirFolhaPonto from "@/components/modalImprimirFolhaPonto.vue";
const route = useRoute();

actions.init(route);
</script>

<template>
  <v-container>
    <title>Detalhes dos pontos</title>

    <div
      class="pa-5"
      style="max-width: 1100px; margin: 0 auto"
    >
      <v-row>
        <v-col cols="12">
          <div>
            <v-card class="pa-5 cardFolhaPontoDetalhes">
              <div class="mesAnoEBotoes ml-2">
                <v-row>
                  <v-btn
                    color="primary"
                    variant="text"
                    density="compact"
                    class="mb-4 pa-0"
                    icon="mdi-arrow-left"
                    @click="actions.onClickVoltar"
                  />
                  <v-col cols="4">
                    <v-select
                      label="Mês"
                      class="ml-4"
                      id="mes"
                      dense
                      v-model="state.mes"
                      item-title="text"
                      item-value="value"
                      :items="meses"
                      hide-details
                      @update:model-value="actions.getDadosPontos"
                    ></v-select>
                  </v-col>
                  <v-col cols="4">
                    <v-select
                      label="Ano"
                      class="ml-4"
                      id="ano"
                      dense
                      v-model="state.ano"
                      :items="anos"
                      hide-details
                      @update:model-value="actions.getDadosPontos"
                    ></v-select>
                  </v-col>
                  <v-col cols="3"
                    ><v-btn
                      color="primary"
                      class="btnPrint"
                      @click.prevent="actions.imprimirFolhaPonto()"
                    >
                      <v-icon>mdi-printer</v-icon> Imprimir Folha de Ponto
                    </v-btn>
                  </v-col>
                </v-row>
              </div>

              <v-row>
                <v-col cols="12">
                  <v-row>
                    <v-col cols="5">
                      <div class="funcionario__card__usuario ml-2">
                        <v-avatar
                          size="60px"
                          color="primary"
                          class="funcionario__avatar"
                        >
                          <v-img
                            :src="actions.getFotoFuncionarioURL(state.cpf)"
                            aspect-ratio="1"
                            cover
                          >
                          </v-img>
                        </v-avatar>

                        <div class="funcionario__card">
                          <strong class="funcionario__card__nome"
                            ><b>{{ state.nome }}</b></strong
                          >
                          <span class="funcionario__card__cargo">{{ state.cargo }}</span>
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="7">
                      <div class="div__funcionario__card__infos">
                        <div class="funcionario__card__infos">
                          Pontos não batidos:
                          <b>{{ state.QTD_PONTOS_NAO_BATIDOS || 0 }}</b>
                        </div>
                        <div class="funcionario__card__infos">
                          Pontos incompletos:
                          <b>{{ state.QTD_PONTOS_INCOMPLETOS || 0 }}</b>
                        </div>

                        <div class="funcionario__card__infos">
                          Qtd de justificativas:
                          <b>{{ state.QTD_FALTAS_JUSTIFICADAS || 0 }}</b>
                        </div>
                        <div class="funcionario__card__infos">
                          Pontos à justificar:
                          <b>{{ state.QTD_A_JUSTIFICAR || 0 }}</b>
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>

              <v-row class="mt-2">
                <v-col
                  cols="12"
                  class="pt-0"
                >
                  <div class="funcionario__card__faltas ml-2">
                    <div
                      class="funcionario__card__faltas__info"
                      v-for="tipoFalta in state.tipoFaltas"
                      :key="tipoFalta.ID_TIPO_FALTA"
                    >
                      <div class="funcionario__card__faltas__info__count">
                        {{ tipoFalta.DESCRICAO }}:
                        <b> {{ tipoFalta.COUNT_TIPO }}</b>
                      </div>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </div>
        </v-col>
      </v-row>

      <div class="calendario">
        <v-row class="fill-height">
          <v-col>
            <v-sheet
              height="796"
              width="1050"
            >
              <FullCalendar
                v-if="!state.loadingCalendar && !state.loading"
                ref="calendario"
                :options="{
                  plugins: [dayGridPlugin, interactionPlugin],
                  initialView: 'dayGridMonth',
                  events: pontosCalendario,
                  // hiddenDays: [0],
                  dateClick: actions.clickModalJustificarAusencia,
                  locale: 'pt-br',
                  eventOrder: 'defId',
                  initialDate: state.initialDate,
                  fixedWeekCount: false,
                }"
              >
                <template v-slot:eventContent="arg">
                  <div
                    class="calendario__horario"
                    @click.prevent="actions.clickModalJustificarAusencia(arg.event)"
                  >
                    <span>{{ arg.event.title }}</span>
                  </div>
                </template>
              </FullCalendar>
            </v-sheet>
          </v-col>
        </v-row>
      </div>
    </div>

    <div
      id="modalJustificarFalta"
      title="Justificar Ausência"
      style="display: none"
    >
      <modal-justificar-falta
        :dadosAusencia="state.dataAusencia"
        :tiposDeFalta="tipoFaltaModal"
        :pontos="pontosDiaSelecionado"
        :horaChegada="pontosDiaSelecionado.HORA_CHEGADA"
        :horaAlmocoInicial="pontosDiaSelecionado.HORA_ALMOCO_INICIAL"
        :horaAlmocoFinal="pontosDiaSelecionado.HORA_ALMOCO_FINAL"
        :horaSaida="pontosDiaSelecionado.HORA_SAIDA"
        :dadosDocumento="state.documentoFalta"
        :funcionario="{
          cod_funcionario: state.codFuncionario,
          nome: state.nome,
          cpf: state.cpf,
          cargo: state.cargo,
          loginFuncionario: state.loginFuncionario,
        }"
        :opened="state.modalJustificarFaltaOpened"
        @atualizarDados="actions.atualizarTela()"
        @fecharModal="actions.fecharModal()"
      />
    </div>

    <div
      id="modalImprimirPontos"
      title="Folha de Ponto"
      style="display: none"
    >
      <modal-imprimir-folha-ponto
        :dadosParaImpressao="{
          dadosFuncionarios: state.dadosParaModalImpressao,
          mes: state.mes,
          ano: state.ano,
        }"
      />
    </div>

    <div id="pnCodigoTela">folhaPontoDetalhes</div>
    <v-overlay
      :model-value="state.loading || state.loadingCalendar"
      class="align-center justify-center"
      persistent
    >
      <v-progress-circular
        color="primary"
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<style>
.fc-daygrid-day-frame.fc-scrollgrid-sync-inner {
  height: 145px;
}

.fc .fc-daygrid-body-unbalanced .fc-daygrid-day-events {
  margin-top: -5px;
  padding-left: 10px;
}

.fc-daygrid-event-harness {
  width: 115px;
  margin-left: 5px;
}

.fc-toolbar-chunk {
  display: none;
}
</style>

<style scoped>
.btnPrint {
  margin-top: 15px;
  width: auto;
  margin-left: 20px;
}
.btnSearch {
  margin-left: 50px;
  margin-top: 5px;
}

.funcionario__card__usuario {
  padding: 5px;
  display: flex;
  gap: 12px;
}

.funcionario__avatar {
  cursor: pointer;
  opacity: 1;
  border: 1px solid #0000002f;
}

.funcionario__card__faltas {
  margin: 0;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.funcionario__card__faltas__info {
  width: 18%;
  font-size: 15px;
  white-space: nowrap;
  color: #8c8c8c;
  line-height: 2;
  padding-left: 10px;
  margin-right: 12px;
}

.div__funcionario__card__infos {
  /* border: 1px solid rgb(111, 111, 111); */
  padding: 5px;
  display: flex;
  flex-wrap: wrap;
  padding-left: 15px;
}

.funcionario__card__infos {
  white-space: nowrap;
  margin-right: 12px;
  width: 45%;
  font-size: 15px;
  color: #a1a1a1;
  line-height: 2;
}

.funcionario__card {
  margin-top: 10px;
  padding-left: 20px;
}
.funcionario__card__nome {
  font-size: 15px;
  color: #2a2a2a;
  display: flex;
  align-items: left;
  justify-content: left;
}

.funcionario__card__cargo {
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #5a6069;
}

.calendario__horario {
  padding: 2px;
  font-size: 14px;
  text-align: center;
}
</style>
