<script setup lang="ts">
import { useRoute } from "vue-router";
import {
  actions,
  state,
  pontosCalendario,
  pontosDiaSelecionado,
  tipoFaltaModal,
  anos,
  isSixWeeks,
} from "./gerenciarFolhaPontoDetalhes";
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
  <v-container class="container">
    <title>Detalhes dos pontos</title>

    <div style="max-width: 1100px; margin: 0 auto">
      <v-row>
        <v-col
          cols="12"
          md="4"
        >
          <v-card
            class="cardFolhaPontoDetalhes pt-5 px-3"
            elevation="2"
          >
            <div class="mesAnoEBotoes pb-3">
              <v-row>
                <div
                  class="py-2 px-3 d-flex justify-space-between align-center"
                  style="width: 100%"
                >
                  <v-btn
                    color="primary"
                    variant="text"
                    density="compact"
                    icon="mdi-arrow-left mdi-36px"
                    @click="actions.onClickVoltar"
                  />
                  <v-btn
                    icon
                    color="primary"
                    size="small"
                    @click.prevent="actions.imprimirFolhaPonto()"
                  >
                    <v-icon>mdi-printer</v-icon>
                  </v-btn>
                </div>
              </v-row>
              <v-row>
                <v-col>
                  <v-select
                    label="Mês"
                    id="mes"
                    class="pl-2"
                    v-model="state.mes"
                    item-title="title"
                    item-value="value"
                    :items="state.meses"
                    hide-details
                    :clearable="false"
                    @update:model-value="actions.carregarDados"
                  ></v-select>
                </v-col>
                <v-col>
                  <v-select
                    label="Ano"
                    id="ano"
                    class="pr-2"
                    v-model="state.ano"
                    :items="anos"
                    hide-details
                    :clearable="false"
                    @update:model-value="actions.carregarDados"
                  ></v-select>
                </v-col>
              </v-row>
            </div>

            <div class="funcionario pt-5">
              <div class="avatar-container">
                <div>
                  <v-btn
                    icon="mdi-arrow-left"
                    color="primary"
                    size="28"
                    :disabled="state.backFuncionarioBtnDisabled"
                    @click="actions.backFuncionario"
                  />
                </div>
                <div>
                  <v-avatar
                    size="80px"
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
                </div>
                <div>
                  <v-btn
                    icon="mdi-arrow-right"
                    size="28"
                    color="primary"
                    :disabled="state.nextFuncionarioBtnDisabled"
                    @click="actions.nextFuncionario"
                  />
                </div>
              </div>

              <div class="funcionario__card__usuario">
                <div class="funcionario__card">
                  <strong class="funcionario__card__nome"
                    ><b>{{ state.nome }}</b></strong
                  >
                </div>
                <span class="funcionario__card__cargo">{{ state.cargo }}</span>
                <div></div>
              </div>
            </div>

            <v-row class="mt-0">
              <v-col>
                <div class="div__funcionario__card__infos">
                  <v-chip
                    variant="outlined"
                    color="#b17500"
                    title="PONTOS NÃO BATIDOS"
                    >{{ state.QTD_PONTOS_NAO_BATIDOS }}</v-chip
                  >
                  <v-chip
                    variant="outlined"
                    color="#B142F5"
                    title="PONTOS INCOMPLETOS"
                    >{{ state.QTD_PONTOS_INCOMPLETOS }}</v-chip
                  >
                  <v-chip
                    variant="outlined"
                    color="#D50000"
                    class="chip_ponto_a_justificar"
                    title="PONTOS À JUSTIFICAR"
                    >{{ state.QTD_A_JUSTIFICAR }}</v-chip
                  >
                  <v-chip
                    variant="outlined"
                    color="#4880FF"
                    title="PONTOS JUSTIFICADOS"
                    >{{ state.QTD_FALTAS_JUSTIFICADAS }}</v-chip
                  >
                </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <div class="funcionario__card__faltas pa-3">
                  <div
                    class="funcionario__card__faltas__info"
                    v-for="tipoFalta in state.totalizadorFaltas"
                    :key="tipoFalta.TIPO"
                  >
                    <div class="funcionario__card__faltas__info__count">
                      <b class="mr-2"> {{ tipoFalta.COUNT }}</b>
                      <span class="spDescInf">{{ tipoFalta.DESCRICAO }}</span>
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col
          cols="12"
          md="8"
        >
          <v-sheet
            class="card-calendario"
            elevation="2"
            border="8"
          >
            <v-btn
              icon="mdi-arrow-left"
              size="x-small"
              color="primary"
              class="btn-calendario-voltar"
              @click="actions.btnMesAnterior"
            />
            <v-btn
              icon="mdi-arrow-right"
              size="x-small"
              color="primary"
              class="btn-calendario-avancar"
              @click="actions.btnMesSeguinte"
            />
            <div class="container-calendario">
              <div
                class="calendario-dados"
                :class="{ 'card-calendario--six-weeks': isSixWeeks }"
              >
                <FullCalendar
                  v-if="!state.loadingCalendar && !state.loading"
                  ref="calendario"
                  :options="{
                    plugins: [dayGridPlugin, interactionPlugin],
                    initialView: 'dayGridMonth',
                    events: pontosCalendario,
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
              </div>
            </div>
          </v-sheet>
        </v-col>
      </v-row>
    </div>

    <div
      id="modalJustificarFalta"
      title="Justificar Ausência"
      style="display: none"
    >
      <ModalJustificarFalta
        :cnpj="state.empresa.CGC_EMPRESA"
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
      <modalImprimirFolhaPonto
        :dadosParaImpressao="{
          dadosFuncionarios: state.dadosParaModalImpressao,
          mes: state.mes,
          ano: state.ano,
        }"
        :empresa="state.empresa"
      />
    </div>

    <div id="pnCodigoTela">FOLHA_PONTO_DETALHES</div>
    <v-overlay
      :model-value="state.loading"
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
.fc {
  height: 100%;
}

.fc .fc-daygrid-day-frame {
  height: 48px;
  min-height: auto;
  position: relative;
}

.fc .fc-daygrid-day-top {
  height: 20px;
  font-size: 10px;
  line-height: 10px;
  z-index: 10;
}

.fc .fc-toolbar.fc-header-toolbar {
  margin: 0;
}

.fc .fc-daygrid-body-unbalanced .fc-daygrid-day-events {
  margin-top: -5px;
}

.fc-daygrid-event-harness {
  width: 94px !important;
  margin-left: 5px;
}

.fc-scroller {
  overflow: hidden !important;
}

.fc-col-header-cell {
  height: 20px;

  overflow-y: hidden !important;
}

.fc-toolbar-chunk {
  display: none;
}

.calendario_data_sem_ponto {
  background-color: #ffcdd2 !important;
}

@media screen and (max-width: 1280px) {
  .fc-daygrid-event-harness {
    width: 80px !important;
  }
}
</style>

<style scoped>
.spDescInf {
  font-size: 12px;
  color: #4b4b4b;
}

.funcionario {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.funcionario__card__usuario {
  padding: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.funcionario__avatar {
  cursor: pointer;
  opacity: 1;
  border: 1px solid #0000002f;
}

.funcionario__card__faltas {
  column-count: 2;
  column-gap: 20px;
}

.funcionario__card__faltas__info {
  font-size: 14px;
  line-height: 2;
}

.div__funcionario__card__infos {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.funcionario__card__infos {
  white-space: nowrap;
  margin-right: 12px;
  width: 45%;
  font-size: 18px;
  color: #4f4f4f;
  line-height: 2;
}

.funcionario__card__infos__justificar {
  white-space: nowrap;
  margin-right: 12px;
  width: 45%;
  font-size: 18px;
  color: #b80303;
  line-height: 2;
}

.funcionario__card {
  margin-top: 10px;
  padding-left: 20px;
}
.funcionario__card__nome {
  font-size: 15px;
  color: #2a2a2a;
  display: inline-block;
  white-space: nowrap;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.funcionario__card__cargo {
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #5a6069;
}

.card-calendario {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  max-height: 800px;
  border-radius: 8px;
  height: calc(100vh - 48px);
}

.container-calendario {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow-y: auto;
  overflow-x: hidden;
}

.calendario-dados {
  height: calc(100vh - 90px);
}

.card-calendario--six-weeks {
  height: calc(100vh - 90px);
}

@media screen and (max-height: 800px) {
  .calendario-dados {
    height: calc(100vh - 48px);
  }

  .card-calendario--six-weeks {
    height: calc(125vh - 48px);
  }
}

.calendario__horario {
  padding: 0 2px;
  font-size: 11px;
  text-align: center;
}

.chip_ponto_a_justificar {
  background-color: #ffcdd2;
}

.btn-calendario-voltar {
  position: absolute;
  top: calc(50% - 32px);
  left: -20px;
  z-index: 5;
}

.btn-calendario-avancar {
  position: absolute;
  top: calc(50% - 32px);
  left: calc(100% - 10px);
  z-index: 5;
}

@media screen and (max-width: 1280px) {
  .container {
    min-width: 100%;
  }

  .container-calendario {
    width: 600px;
  }

  .cardFolhaPontoDetalhes {
    width: 100%;
  }
}

.avatar-container {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
