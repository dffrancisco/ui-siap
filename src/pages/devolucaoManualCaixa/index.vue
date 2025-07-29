<script setup lang="ts">
import utils from "@/ts/utils";
import { state, actions, } from "./devolucaoManualCaixa";
import DetalhesCaixa from "./components/DetalhesCaixa.vue";
import { onMounted } from "vue";
import Loading from "@/components/Loading.vue";

onMounted(() => {
  actions.init();
});

</script>

<template>
  <v-container class="v-cointainer-pai">
    <v-row>
      <v-col v-for="caixa in state.dadosDoCaixa" :key="caixa.COD_FUNCIONARIO" @click="actions.abreModal(caixa)" cols="3">
        <v-card 
        class="cards-filho">
        <v-avatar>
          <img src="/src/assets/sem_foto.jpg" />
        </v-avatar>
        <span class="text-h6"> {{ caixa.USUARIO }}</span>
      </v-card>
    </v-col>
  </v-row>
    
    <v-dialog v-model="state.abreDetalhesCaixa" max-width="500">
      <detalhesCaixa>
      </detalhesCaixa>
    </v-dialog>
  </v-container>
  <Loading :loading="state.loading" />

</template>

<style scoped>
.v-cointainer-pai {
  position: relative;
  top: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  height: 30rem;
  width: 90%;
  max-width: 100%;
  border-radius: 15px;
  background-color: rgb(255, 255, 255);
}

.cards-filho {
  max-width: 100%;
  width: 17rem;
  height: 4rem;
  padding: 2px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  cursor: pointer;
}

img {
  width: 5rem;
}

</style>
