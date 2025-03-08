<script setup lang="ts">
import { state, options, actions, funcionariosDisponiveis } from "./conferenciaDeCaixa";
import { onMounted } from "vue";
import ModalAbrirCaixa from "./components/ModalAbrirCaixa.vue";
import utils from "./../../ts/utils";
import modalXAuthManager from "@/plugins/xAuthManager/index.vue";

onMounted(() => {
  actions.init();
});
</script>
<template>
  <v-container>
    <v-card
      max-width="950px"
      max-height="750px"
      style="overflow-y: scroll"
      class="ma-auto pa-4"
    >
      <v-row class="pt-4 ml-2">
        <v-col cols="3">
          <v-text-field
            v-model="state.data"
            label="Data"
            type="date"
            :clearable="false"
            @keypress.enter="actions.init"
          >
          </v-text-field
        ></v-col>
        <v-col cols="1">
          <div class="d-flex align-center">
            <v-btn
              icon="mdi-magnify"
              size="39"
              color="primary"
              @click="actions.init"
            />
          </div>
        </v-col>
      </v-row>

      <div
        v-if="!state.mdcAberto"
        class="text-center pa-4"
      >
        <v-alert
          type="warning"
          color="primary"
          prominent
          class="mb-4"
        >
          O Movimento Diário de Consumo (MDC) está fechado!
        </v-alert>
        <v-btn
          color="primary"
          size="large"
          @click="actions.abrirMDC"
        >
          Abrir MDC
        </v-btn>
      </div>

      <div
        v-else
        style="padding-top: 10px"
        ><div class="pa-2 ml-4"
          ><span style="font-size: 14px">{{ state.msgAberturaMDC }}</span></div
        >
        <v-chip-group
          v-model="state.selectedOption"
          color="primary"
        >
          <v-chip
            v-for="option in options"
            :key="option.value"
            class="vchip ml-4"
            style="margin-left: 5px; font-size: 16px; width: 150px"
            :value="option.value"
            :class="{ 'selected-chip': state.selectedOption === option.value }"
          >
            {{ option.label }}
          </v-chip>
        </v-chip-group>
      </div>

      <div
        v-if="state.selectedOption === 'caixas'"
        class="pa-4"
      >
        <v-row>
          <v-col
            v-for="caixa in state.caixas"
            :key="caixa.COD_FUNCIONARIO"
            cols="12"
            sm="4"
            md="4"
            lg="4"
          >
            <v-card
              class="d-flex flex-column justify-space-between pt-2"
              min-height="280px"
              :class="{
                'caixa-aberto': caixa.STATUS == 1,
                'caixa-fechado': caixa.STATUS == 2,
              }"
            >
              <!-- Cabeçalho do Card -->
              <v-row align="center">
                <v-col cols="3">
                  <v-avatar
                    size="50px"
                    color="primary"
                    class="ml-2 btn-bordered"
                  >
                    <v-img
                      :src="actions.getFotoFuncionarioURL(caixa.CPF)"
                      cover
                    ></v-img>
                  </v-avatar>
                </v-col>
                <v-col cols="9">
                  <div class="text-subtitle-1 font-weight-bold">
                    {{ caixa.LOGIN }}
                  </div>
                  <div class="text-caption status-badge">
                    {{ caixa.STATUS == 1 ? "Caixa Aberto" : "Caixa Fechado" }}
                  </div>
                </v-col>
              </v-row>
              <v-divider></v-divider>

              <v-container class="pa-2">
                <v-row class="pt-2">
                  <v-col cols="3"
                    >Troco: <b>{{ utils.formatValor(caixa.TROCO) }}</b></v-col
                  >
                  <v-col cols="4"
                    >Abertura: <b>{{ utils.formatHora(caixa.HORA_ABERTURA) }}</b></v-col
                  >
                  <v-col cols="5"
                    >Fechamento:
                    <b>{{ caixa.HORA_FECHAMENTO ? utils.formatHora(caixa.HORA_FECHAMENTO) : "----" }}</b></v-col
                  >
                  <v-col cols="6"
                    >Devolução: <b>{{ utils.formatValor(caixa.DEVOLUCAO) }}</b></v-col
                  >
                  <v-col cols="6"
                    >Sangria: <b>{{ utils.formatValor(caixa.SANGRIA) }}</b></v-col
                  >
                  <v-col cols="12"
                    >Dinheiro no caixa: <b>{{ utils.formatValor(caixa.DINHEIRO) }}</b></v-col
                  >
                  <v-col cols="12"
                    >Conferido por:
                    <b>{{ caixa.CONFERIDO && caixa.CONFERIDO.trim() !== "" ? caixa.CONFERIDO : "----" }}</b></v-col
                  >
                </v-row>
              </v-container>

              <v-divider></v-divider>
              <v-row
                justify="center"
                class="mt-2"
              >
                <v-btn
                  v-if="caixa.STATUS !== 2"
                  icon="mdi-lock"
                  size="40"
                  color="primary"
                  class="mx-1 btn-bordered"
                  title="Fechar Caixa"
                  @click="actions.fecharCaixa(caixa)"
                >
                  <v-icon :style="{ fontSize: '25px' }" />
                </v-btn>

                <v-btn
                  v-if="caixa.STATUS !== 2"
                  icon="mdi-cash-multiple"
                  size="40"
                  color="primary"
                  class="mx-1 btn-bordered"
                  title="Sangria"
                >
                  <v-icon :style="{ fontSize: '25px' }" />
                </v-btn>

                <v-btn
                  icon="mdi-checkbox-marked-outline"
                  size="40"
                  color="primary"
                  title="Conferir Caixa"
                  class="mx-1 btn-bordered"
                >
                  <v-icon :style="{ fontSize: '25px' }" />
                </v-btn>
              </v-row>
            </v-card>
          </v-col>

          <!-- Card para abrir um novo caixa -->
          <v-col
            cols="12"
            sm="4"
            md="4"
            lg="4"
            v-if="state.mdcAberto"
          >
            <v-card
              class="pa-4 d-flex align-center justify-center"
              min-height="280px"
            >
              <v-btn
                icon="mdi-plus"
                size="48"
                color="primary"
                @click="actions.abrirModalAbrirCaixa()"
              />
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-card>

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
    <div id="pnCodigoTela">conferenciaDeCaixa</div>
  </v-container>

  <v-dialog
    v-model="state.modalAbrirCaixaOpened"
    max-width="800"
    style="margin-right: 150px"
  >
    <ModalAbrirCaixa
      :funcionarios="funcionariosDisponiveis"
      :modalOpened="state.modalAbrirCaixaOpened"
      @closeModalAbrirCaixa="state.modalAbrirCaixaOpened = false"
      @dadosAbrirCaixa.sync="actions.abrirCaixa"
    />
  </v-dialog>

  <modalXAuthManager />
</template>

<style scoped>
.selected-chip {
  background-color: #017bc2 !important;
  color: white !important;
}

.vchip {
  display: flex !important;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 8px !important;
}

.v-col {
  padding-top: 0 !important;
}

.caixa-aberto {
  border: 2px solid #1976d2;
  background: linear-gradient(90deg, rgb(19, 84, 122), rgb(80, 146, 138));
  color: white;
}

.caixa-fechado {
  border: 2px solid #424242;
  background: linear-gradient(-11deg, rgb(134, 143, 150), rgb(89, 97, 100)) !important;
  color: white;
}

.status-badge {
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
  text-align: center;
  width: 120px;
}

.caixa-aberto .status-badge {
  background-color: #1976d2;
}

.caixa-fechado .status-badge {
  background-color: #424242;
  color: white;
}

.btn-bordered {
  border: 1px solid rgba(255, 255, 255, 0.554) !important;
}
</style>
