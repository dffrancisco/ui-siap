<script setup lang="ts">
import { onMounted } from "vue";
import { state, actions } from "./relatorioProdutosVendidos";

onMounted(async () => {
  actions.init();
});
</script>
<template>
  <v-container>
    <v-card
      :width="800"
      class="ma-auto pa-4"
    >
      <div class="divInputs">
        <div style="display: flex; gap: 16px">
          <v-text-field
            v-model="state.dataInicio"
            width="180px"
            label="Data Início"
            type="date"
            :clearable="false"
            @keydown.enter="state.inputDataFinal.focus()"
          >
          </v-text-field>

          <v-text-field
            v-model="state.dataFim"
            label="Data Fim"
            id="DATA_FIM"
            width="180px"
            type="date"
            :clearable="false"
            @keypress.enter="actions.validarInputs"
          >
          </v-text-field>
        </div>
        <div class="btnPesquisar">
          <v-btn
            color="primary"
            class="mt-3"
            icon="mdi-magnify"
            size="36px"
            @click="actions.validarInputs"
          >
          </v-btn>
        </div>
      </div>

      <v-data-table-server
        class="tableHistoricoConsultaLojas pt-5"
        items-per-page-text="Itens por página"
        v-model:itemsPerPage="state.itemsPerPage"
        :items-length="state.totalItems"
        style="border-radius: 5px"
        height="460"
        fixed-header
        :items="state.dadosRelatorio"
        :headers="state.headers"
        :loading="state.loading"
        :row-props="actions.getClassCorLinha"
        @update:page="actions.updatePage"
      >
      </v-data-table-server>

      <div class="pt-2 btnPrint">
        <v-btn
          color="primary"
          :disabled="state.dadosRelatorio.length == 0"
          @click="actions.onClickImprimir"
          icon="mdi-printer"
          size="36px"
          title="Imprimir"
        />
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

    <div id="pnCodigoTela">relatorioProdutosVendidos</div>
  </v-container>
</template>

<style>
.v-overlay__scrim {
  background-color: black;
}

.cor-zebrada-1 {
  background-color: #f0f0f0;
}

.v-data-table-footer {
  max-height: 2px;
  padding-top: 20px;
}

.v-data-table-footer__pagination {
  padding-right: 50px;
}
</style>

<style scoped>
.divInputs {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.btnPesquisar {
  margin-top: -12px;
  margin-left: 10px;
}

.btnPrint {
  display: flex;
  justify-content: flex-end;
  margin-top: -10px;
}
</style>
