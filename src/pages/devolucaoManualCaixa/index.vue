<script setup lang="ts">
import utils from "@/ts/utils";
import { state, actions } from "./devolucaoManualCaixa";
import DetalhesCaixa from "./components/DetalhesCaixa.vue";
import { onMounted } from "vue";
import Loading from "@/components/Loading.vue";

onMounted(() => {
  actions.init();
});
</script>

<template>
  <v-container class="container-devolucao-manual">
    <v-row>
      <v-col
        v-for="caixa in state.dadosDoCaixa"
        cols="3"
        :key="caixa.COD_FUNCIONARIO"
        @click="actions.abreModal(caixa)"
      >
        <v-card class="cards-decolucao-manual">
          <v-avatar size="60">
            <img
              class="w-100"
              src="https://www.reallatas.com.br/foto_funcionarios/06664612100.jpg"
            />
          </v-avatar>
          <span class="text-h6"> {{ caixa.USUARIO }}</span>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog
      max-width="500"
      v-model="state.abreDetalhesCaixa"
    >
      <detalhesCaixa> </detalhesCaixa>
    </v-dialog>
  </v-container>
  <Loading :loading="state.loading" />
</template>

<style scoped>
.container-devolucao-manual {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  width: 900px;
  height: 65%;
  top: 3rem;
  gap: 1rem;
  padding: 2rem;
  background-color: rgb(255, 255, 255);
}

.cards-decolucao-manual {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  max-width: 100%;
  width: 20rem;
  height: 10rem;
  padding: 3px;
  cursor: pointer;
  border-radius: 5px;
}
</style>
