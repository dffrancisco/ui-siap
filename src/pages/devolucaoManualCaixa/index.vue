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
    <v-card  
      v-for="caixa in state.dadosDoCaixa"
      :key="caixa.COD_FUNCIONARIO"
      @click="state.abreDetalhesCaixa = true"
      class="cards-filho"
      >
      <v-avatar> 
        <img src="/src/assets/sem_foto.jpg" />
      </v-avatar>
      <span class="text-h6"> {{  caixa.USUARIO  }}</span>
    </v-card>

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
    top:3rem;
    display: flex;
    justify-content: start;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
    height: 20rem;
    width: 75%;
    max-width: 100%;
    border-radius: 15px;
    background-color: rgb(255, 255, 255);
    box-shadow: 1px 1px 6px 1px;
  }

  .cards-filho {
    max-width: 100%;
    width: 15rem;
    height: 4rem;
    padding: 2px;
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }

  img {
    width: 5rem;
  }
</style>


