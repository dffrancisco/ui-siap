<script setup lang="ts">
import { onMounted } from "vue";
import { state, actions } from "./consultaValeDinheiro";

onMounted(() => {
  actions.init();
});
</script>

<template>
  <v-container>
    <v-card
      class="pa-5 ma-auto"
      :max-width="900"
      :max-height="600"
      ><v-col cols="4">
        <v-autocomplete
          :clearable="true"
          label="Funcionário"
          multiple
          v-model="state.selectedFuncionario"
          :items="state.funcionarios"
          item-title="NOME_COMP"
          item-value="COD_FUNCIONARIO"
        ></v-autocomplete
      ></v-col>
    </v-card>

    <div id="pnCodigoTela"> consultaValeDinheiro </div>

    <v-overlay
      :model-value="state.loading"
      class="d-flex align-center justify-center"
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
#tabelaUsoConsumo .v-data-table-footer {
  max-height: 2px;
  padding-top: 20px;
}

#tabelaUsoConsumo .v-data-table-footer__pagination {
  padding-right: 50px;
}

.cor-zebrada-1 {
  background-color: #f0f0f0;
}

.btnPesquisar {
  display: flex;
  align-items: left;
  margin-left: 16px;
}
</style>
