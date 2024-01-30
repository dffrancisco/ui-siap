<script setup lang="ts">
import { useRoute } from "vue-router";
import { actions, state, pontosCalendario } from "./gerenciarFolhaPontoDetalhes";
import { meses, anos } from "../gerenciarFolhaPonto/gerenciarFolhaPonto";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
//@ts-ignore
import interactionPlugin from "@fullcalendar/interaction";
import ModalJustificarFalta from "./components/modalJustificarFalta.vue";

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
            <strong>Detalhes dos pontos</strong>
            <v-card class="pa-5 cardFolhaPontoDetalhes">
              <v-row>
                <v-col cols="5">
                  <v-autocomplete
                    label="Mês"
                    id="mes"
                    dense
                    v-model="state.mes"
                    item-title="text"
                    item-value="value"
                    :items="meses"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="5">
                  <v-autocomplete
                    label="Ano"
                    id="ano"
                    dense
                    v-model="state.ano"
                    :items="anos"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="2"
                  ><v-btn
                    icon
                    color="primary"
                    size="small"
                    class="btnSearch"
                    @click="actions.getPontos(state.codFuncionario, state.cpf, state.mes, state.ano)"
                  >
                    <v-icon> mdi-magnify</v-icon> </v-btn
                  ><v-btn
                    icon
                    color="primary"
                    size="small"
                    class="btnPrint"
                  >
                    <v-icon>mdi-printer</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="12"
          class="pt-0"
        >
          <div class="funcionarios">
            <div class="funcionarios__lista">
              <v-card class="funcionario__card">
                <div class="funcionario__card__usuario">
                  <v-avatar
                    size="50px"
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

                  <div class="nomeCargo">
                    <strong class="funcionario__card__nome"
                      ><b>{{ state.nome }}</b></strong
                    >
                    <span class="funcionario__card__cargo">{{ state.cargo }}</span>
                  </div>
                </div>

                <v-col>
                  <span class="funcionario__card__infos">
                    Pontos não batidos:
                    <b>{{ state.QTD_PONTOS_NAO_BATIDOS || 0 }}</b>
                  </span>
                  <span class="funcionario__card__infos">
                    Pontos incompletos:
                    <b>{{ state.QTD_PONTOS_INCOMPLETOS || 0 }}</b>
                  </span>
                </v-col>

                <v-col class="infoPontosFunc">
                  <span class="funcionario__card__infos">
                    Qtd de justificativas:
                    <b>{{ state.QTD_FALTAS_JUSTIFICADAS || 0 }}</b>
                  </span>
                  <span class="funcionario__card__infos">
                    Pontos à justificar:
                    <b>{{ state.QTD_A_JUSTIFICAR || 0 }}</b>
                  </span>
                </v-col>
              </v-card>

              <v-card class="funcionario__card__faltas">
                <v-col
                  v-for="tipoFalta in state.tipoFaltas"
                  :key="tipoFalta.ID_TIPO_FALTA"
                >
                  <span class="funcionario__card__faltas__info"
                    >{{ tipoFalta.DESCRICAO }}:
                    <b> {{ tipoFalta.COUNT_TIPO }}</b>
                  </span>
                </v-col>
              </v-card>
            </div>
          </div>
        </v-col>
      </v-row>

      <div class="calendario">
        <v-row class="fill-height">
          <v-col>
            <v-sheet
              height="900"
              width="1050"
            >
              <FullCalendar
                v-if="state.loadingCalendar == false"
                ref="calendario"
                :options="{
                  buttonText: {
                    today: 'Hoje',
                  },
                  plugins: [dayGridPlugin, interactionPlugin],
                  initialView: 'dayGridMonth',
                  // hiddenDays: [0],
                  events: pontosCalendario,
                  dateClick: actions.clickModalJustificarAusencia,
                  locale: 'pt-br',
                  datesSet: actions.alternandoMesEAno,
                  eventOrder: 'defId',
                  initialDate: state.initialDate,
                }"
              >
                <template v-slot:eventContent="arg">
                  <div class="calendario__horario">
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
      ><modal-justificar-falta />
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
  height: 150px;
}

.fc-daygrid-event-harness {
  width: 100px;
  margin-left: 15px;
}

.fc-toolbar-title {
  margin-left: 25px !important;
  margin-top: 10px !important;
}

.fc-prev-button.fc-button.fc-button-primary {
  border: none;
  margin-right: 5px;
  background-color: #6495ed;
}

.fc-next-button.fc-button.fc-button-primary {
  border: none;
  margin-right: 5px;
  background-color: #6495ed;
}

.fc-today-button.fc-button.fc-button-primary {
  border: none;
  background-color: #6495ed;
}
</style>

<style scoped>
.btnPrint {
  margin-top: 10px;
  margin-left: 20px;
}
.btnSearch {
  margin-left: 10px;
  margin-top: 10px;
}

.funcionarios__lista {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  max-height: 650px;
}

.funcionario__card {
  width: 522px;
  height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 12px;
  cursor: pointer;
  position: relative;
}

.funcionario__card__faltas {
  width: 520px;
  height: 150px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.funcionario__card__usuario {
  padding-left: 12px;
  display: flex;
  gap: 12px;
}

.funcionario__avatar {
  margin-top: 30px;
  margin-left: 20px;
  cursor: pointer;
  opacity: 1;
  border: 1px solid #0000002f;
}

.funcionario__card__faltas__info {
  font-size: 15px;
  white-space: nowrap;
  color: #5a6069;
}
.funcionario__card__infos {
  margin-left: 20px;
  font-size: 15px;
  color: #5a6069;
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

.nomeCargo {
  margin-top: 30px;
  margin-left: 20px;
}

.infoPontosFunc {
  margin-top: -15px;
}

.calendario__horario {
  padding: 2px;
  font-size: 14px;
  text-align: center;
}
</style>
