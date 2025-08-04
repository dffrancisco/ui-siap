<script setup lang="ts">
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
    <!-- <div class="">
      <h1>DEVOLUÇÃO MANUAL CAIXA</h1>
    </div> -->
    <v-row>
      <v-col
        v-for="caixa in state.dadosCaixa"
        cols="4"
        :key="caixa.COD_FUNCIONARIO"
        @click.prevent="actions.abrirModal(caixa)"
      >
        <v-card class="cards-decolucao-manual">
          <v-avatar
            size="57"
            class="border-sm border-primary"
          >
            <img
              class="w-100"
              :src="`https://www.reallatas.com.br/foto_funcionarios/${caixa.CPF}.jpg`"
            />
          </v-avatar>
          <span class="font-weight-medium text-h6"> {{ caixa.USUARIO }}</span>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog
      max-width="500"
      v-model="state.detalheCaixa"
    >
      <detalhesCaixa
        :caixa="state.caixaSelecionado"
        :dadosDevolucao="state.dadosDevolucao"
        :idDevolucao="state.idDevolucao"
        @fechar="actions.fecharModal"
        @salvar="actions.onClickLancamento"
        @buscar="actions.getDadosDevolucao"
      >
      </detalhesCaixa>
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
  width: 770px;
  height: 420px;
  top: 3rem;
  gap: 1rem;
  padding: 20px;
  box-shadow: 0px 0px 1.1px;
  border-radius: 0.2rem;
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
