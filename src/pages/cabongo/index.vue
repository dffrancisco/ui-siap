<script setup lang="ts">
import { onMounted } from "vue";
import { actions, state } from "./cabongo";
import ModalEscolherData from "./service/modalEscolherData.vue";
import dateFormat from "dateformat";
import { dataBrasil } from "@/ts/utils";

onMounted(async () => {
  actions.init();
});
</script>

<template>
  <v-container>
    <title>Cargos</title>
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
              v-model="state.dataEnviada"
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
          class="mt-3"
          color="primary"
          density="comfortable"
        >
          rastrear</v-btn
        >
      </div>
      <div>
        <label></label>
      </div>
      <div class="d-flex flex-column ga-2">
        <label class="text-h6 mt-3">Orçamentos pendentes ({{ state.totalPendentes }})</label>
        <div class="container_orcamentos d-flex flex-wrap">
          <div
            v-for="pendente in state.orcamentos"
            class="d-flex ga-3"
          >
            <v-card
              class="card_orcamento pa-2 d-flex mr-2 mt-2"
              v-if="pendente.qtdOrcamentosPendentes > 0"
            >
              <label class="mr-2 text-subtitle-2">{{ pendente.FANTASIA }}</label>
              <div class="bg_quantidade_orcamento bg-red-darken-2">
                <div>{{ pendente.qtdOrcamentosPendentes }}</div>
              </div>
            </v-card>
          </div>
        </div>

        <label class="text-h6 mt-3">Orçamentos concluídos ({{ state.totalConferidos }})</label>
        <div class="container_orcamentos d-flex flex-wrap">
          <div
            v-for="conferido in state.orcamentos"
            class="d-flex ga-3"
          >
            <v-card
              class="card_orcamento pa-2 d-flex mr-2 mt-2"
              v-if="conferido.qtdOrcamentosConferidos > 0"
            >
              <label class="mr-2 text-subtitle-1">{{ conferido.FANTASIA }}</label>
              <div class="bg_quantidade_orcamento bg-blue-darken-2">
                <div>{{ conferido.qtdOrcamentosConferidos }}</div>
              </div>
            </v-card>
          </div>
        </div>
      </div>
    </v-card>
  </v-container>
  <v-dialog v-model="state.modalEscolherDataOpened">
    <ModalEscolherData />
  </v-dialog>
</template>
<style scoped>
.container_orcamentos {
  overflow: auto;
  height: 210px;
  padding: 5px;
}
.card_orcamento {
  width: 200px;
  height: 60px;
  justify-content: space-between;
  align-items: center;
}
.bg_quantidade_orcamento {
  display: flex;
  border-radius: 50px;
  padding: 0px 5px;
  height: 25px;
  width: 25px;
  align-items: center;
  justify-content: center;
}
</style>
