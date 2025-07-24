<script setup lang="ts">
import { onMounted } from "vue";
import { actions, computeds, state } from "./cabongo";
import ModalEscolherData from "./components/modalEscolherData.vue";
import ModalOrcamento from "./components/modalOrcamento.vue";
import CardOrcamento from "./components/cardOrcamento.vue";

onMounted(async () => {
  actions.init();
});
</script>

<template>
  <v-container>
    <title>Cabongo</title>
    <v-card
      class="pa-5"
      style="max-width: 900px; margin: 0 auto"
    >
      <div class="d-flex align-center ga-3">
        <v-row class="align-center">
          <v-col cols="3">
            <label class="mr-2">Data</label>
            <v-text-field
              type="data"
              v-model="state.data"
            >
            </v-text-field>
          </v-col>
          <v-btn
            class="mt-3"
            color="primary"
            density="comfortable"
            icon="mdi-magnify"
            @Click="actions.getOrcamento()"
          ></v-btn>
        </v-row>
        <v-btn
          color="primary"
          density="comfortable"
          class="mt-3"
          icon="mdi-filter-outline"
        >
        </v-btn>
      </div>

      <div class="d-flex flex-column ga-2">
        <label class="text-h6 mt-3">Orçamentos pendentes ({{ computeds.totalPendentes }})</label>
        <div
          class="container_empty"
          v-if="computeds.totalPendentes.value === 0 && state.loadingPendentes == false"
        >
          <label class="text-center text-h5">Nenhum orçamento pendente</label>
          <v-icon
            color="orange darken-2"
            size="40"
            class="ml-5"
            >mdi-alert-circle-outline</v-icon
          >
        </div>
        <div
          class="container_orcamentos d-flex flex-wrap"
          v-else
        >
          <CardOrcamento
            v-for="sociedade in state.sociedades"
            :loading="sociedade.loading"
            :nome-empresa="sociedade.FANTASIA"
            :qtd-orcamentos="sociedade.qtdOrcamentosPendentes"
            color-bg="bg-red-darken-2"
            @escolher-por-data="actions.onClickCardPendente(sociedade.ID_EMPRESA, state.meuCNPJ)"
          />
        </div>

        <label class="text-h6 mt-3">Orçamentos concluídos ({{ computeds.totalConferidos }})</label>
        <div
          v-if="state.loadingConferidos == false && computeds.totalConferidos.value == 0"
          class="container_empty"
        >
          <label class="text-center text-h5">Nenhum orçamento conferido</label>
          <v-icon
            color="orange darken-2"
            size="40"
            class="ml-5"
            >mdi-alert-circle-outline</v-icon
          >
        </div>
        <div
          v-else
          class="container_orcamentos d-flex flex-wrap"
        >
          <CardOrcamento
            v-for="sociedade in state.sociedades"
            :loading="sociedade.loading"
            :nome-empresa="sociedade.FANTASIA"
            :qtd-orcamentos="sociedade.qtdOrcamentosConferidos"
            color-bg="bg-blue-darken-2"
          />
        </div>
        <div
          v-if="state.lojasComErro.length > 0"
          class="d-flex"
        >
          <label class="text-subtitle-1 text-red-darken-4">Erro ao carregar: </label>
          <div>
            <span class="text-subtitle-1 ml-2 text-red-darken-4"> {{ state.lojasComErro.join(", ") }}</span>
          </div>
        </div>
      </div>
    </v-card>
  </v-container>
  <v-dialog
    v-model="state.modalEscolherDataOpened"
    max-width="500px"
    max-height="500px"
  >
    <ModalEscolherData :orcamentosData="state.qtdOrcamentosPorData" />
  </v-dialog>
  <v-dialog v-model="state.modalOrcamentoOpened">
    <ModalOrcamento />
  </v-dialog>
</template>

<style scoped>
.container_orcamentos {
  overflow: auto;
  max-height: 210px;
  min-height: 150px;
  padding: 5px;
}
.container_empty {
  width: 100%;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
