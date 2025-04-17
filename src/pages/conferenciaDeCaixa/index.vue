<script setup lang="ts">
import { state, options, actions, computeds } from "./conferenciaDeCaixa";
import { onMounted } from "vue";
import ModalAbrirCaixa from "./components/ModalAbrirCaixa.vue";
import ModalSangria from "./components/ModalSangria.vue";
import ModalConferirCaixa from "./components/ModalConferirCaixa.vue";
import modalXAuthManager from "@/plugins/xAuthManager/index.vue";
import AbaCaixas from "./components/AbaCaixas.vue";
import AbaLancamentos from "./components/AbaLancamentos.vue";
import AbaSangrias from "./components/AbaSangrias.vue";
import AbaDevolucoes from "./components/AbaDevolucoes.vue";
import moment from "moment";

onMounted(() => {
  actions.init();
});
</script>

<template>
  <v-container fluid>
    <v-card
      max-width="1100px"
      class="pa-4 mx-auto"
    >
      <!-- Input de Data -->
      <v-row class="pt-4 pl-2">
        <v-col
          cols="12"
          sm="3"
          md="3"
        >
          <v-text-field
            v-model="state.data"
            label="Data"
            type="date"
            :clearable="false"
            @keypress.enter="actions.init"
          />
        </v-col>

        <v-col
          cols="12"
          sm="6"
          md="1"
          class="d-flex"
        >
          <v-btn
            icon="mdi-magnify"
            size="39"
            color="primary"
            @click="actions.init"
          />
        </v-col>
      </v-row>

      <!-- MDC Fechado -->
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
          v-if="state.data == moment().format('YYYY-MM-DD')"
          >Abrir MDC</v-btn
        >
      </div>

      <!--Lista de Opções -->
      <div
        v-if="state.mdcAberto"
        class="pt-3 mb-5"
      >
        <v-chip-group
          v-model="state.selectedOption"
          color="primary"
          mandatory
        >
          <v-chip
            v-for="option in options"
            :key="option.value"
            class="vchip-options ml-2"
            style="font-size: 16px; width: 150px"
            :value="option.value"
            :class="{ 'selected-chip': state.selectedOption === option.value }"
          >
            {{ option.label }}
          </v-chip>
        </v-chip-group>
      </div>

      <!-- Renderiza a aba de caixas -->
      <template v-if="computeds.abaSelecionada.value === 'caixas'">
        <v-row style="overflow-y: scroll; max-height: 370px">
          <v-col
            v-for="caixa in state.caixas"
            :key="caixa.COD_FUNCIONARIO"
            style="padding: 5px 5px 5px 5px"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <AbaCaixas
              :caixa="caixa"
              @fechar-caixa="actions.fecharCaixa"
              @salvar-sangria="actions.modalSangria"
              @conferir-caixa="actions.abrirModalConferirCaixa"
            />
          </v-col>

          <!-- Card para abrir um novo caixa -->
          <v-col
            cols="12"
            sm="6"
            md="4"
            lg="3"
            v-if="state.mdcAberto && state.data == moment().format('YYYY-MM-DD')"
          >
            <v-card
              class="pa-4 d-flex flex-column align-center justify-center"
              min-height="260px"
            >
              <v-btn
                icon="mdi-plus"
                size="48"
                color="primary"
                title="Abrir novo caixa"
                @click="actions.openModalAbrirCaixa()"
              />
              <span class="mt-2">Abrir Novo Caixa</span>
            </v-card>
          </v-col>
        </v-row>
      </template>

      <!-- Renderiza a aba de Lançamentos -->
      <AbaLancamentos v-if="computeds.abaSelecionada.value === 'lancamentos' && state.mdcAberto" />

      <!-- Renderiza a aba de Sangrias -->
      <AbaSangrias v-if="computeds.abaSelecionada.value === 'sangria' && state.mdcAberto" />

      <!-- Renderiza a aba de Devolucoes -->
      <AbaDevolucoes v-if="computeds.abaSelecionada.value === 'devolucao' && state.mdcAberto" />

      <!-- Mensagem de quem abriu o MDC -->
      <div class="pa-2 mt-3">
        <span style="font-size: 14px">{{ state.msgAberturaMDC }}</span>
      </div>
    </v-card>

    <div id="pnCodigoTela">conferenciaDeCaixa</div>

    <!-- Modal Abrir Caixa -->
    <v-dialog
      v-model="state.modalAbrirCaixaOpened"
      max-width="800"
    >
      <ModalAbrirCaixa
        :funcionarios="computeds.funcionariosDisponiveis.value"
        :modalOpened="state.modalAbrirCaixaOpened"
        @closeModalAbrirCaixa="state.modalAbrirCaixaOpened = false"
        @dadosAbrirCaixa.sync="actions.abrirCaixa"
      />
    </v-dialog>

    <!-- Modal Sangria -->
    <v-dialog
      v-model="state.modalSangriaOpened"
      max-width="800"
    >
      <ModalSangria
        :modalOpened="state.modalSangriaOpened"
        :caixaSelecionado="state.caixaSelected"
        @efetuarSangria="actions.efetuarSangria"
        @closeModalSangria="state.modalSangriaOpened = false"
      />
    </v-dialog>

    <!-- Modal Conferir Caixa -->
    <v-dialog
      v-model="state.modalConferirCaixaOpened"
      max-width="1050"
      :retain-focus="false"
      z-index="500"
    >
      <ModalConferirCaixa
        :modalOpened="state.modalConferirCaixaOpened"
        :caixaSelecionado="state.caixaSelected"
        :lancamentos="state.todasAsCompras"
        :sangrias="state.sangrias"
        :devolucoes="state.devolucoes"
        @closeModalConferirCaixa="state.modalConferirCaixaOpened = false"
      />
    </v-dialog>

    <modalXAuthManager :retain-focus="false" />
  </v-container>

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
</template>

<style scoped>
.selected-chip {
  background-color: #017bc2 !important;
  color: white !important;
}

.vchip-options {
  display: flex !important;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 8px !important;
}
</style>
