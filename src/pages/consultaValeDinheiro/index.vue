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
    >
      <v-row>
        <v-col cols="6">
          <v-select
            density="compact"
            variant="outlined"
            multiple
            name="Selecionar_usuario"
            id="Selecionar_usuario"
            :items="state.funcionarios"
            item-title="NOME_COMP"
            item-value="COD_FUNCIONARIO"
            v-model="state.codFuncionario"
          >
            <template v-slot:selection="{ item, index }">
              <v-chip
                v-if="index === 0"
                style="font-size: 14px; padding: 10px"
              >
                <span>{{ item?.raw?.NOME_COMP || item.NOME_COMP }}</span>
              </v-chip>

              <span
                v-if="index === 1 && state.codFuncionario.length > 1"
                class="text-grey text-caption align-self-center"
              >
                (+{{ state.codFuncionario.length - 1 }})
              </span>
            </template>
          </v-select>
        </v-col>

        <v-col cols="3">
          <v-text-field
            label="Ano"
            type="number"
            v-model="state.ano"
            min="2000"
            max="2099"
            step="1"
            @keydown.enter.prevent="actions.onClickBuscar"
          ></v-text-field>
        </v-col>
        <v-col
          cols="1"
          class="btnPesquisar"
        >
          <v-btn
            color="primary"
            icon="mdi-magnify"
            size="36px"
            @click="actions.onClickBuscar"
          >
            <v-icon left>mdi-magnify</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <v-data-table
        id="tabelaUsoConsumo"
        class="mt-4"
        :items="state.dadosRelatorio"
        :headers="state.headers"
        height="360px"
        fixed-header
        :row-props="actions.getClassCorLinha"
      ></v-data-table>

      <div class="d-flex justify-end">
        <v-btn
          color="primary"
          @click="actions.onClickImprimir"
          :disabled="state.dadosRelatorio.length === 0"
          icon="mdi-printer"
          size="36px"
        >
          <v-icon left>mdi-printer</v-icon>
        </v-btn>
      </div>
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
  max-height: 10px;
  padding-top: 20px;
}

.cor-zebrada-1 {
  background-color: #f0f0f0;
}

.btnPesquisar {
  display: flex;
  align-items: center;
}

.autocomplete-limit .v-select__selection {
  max-height: 10px;
}
</style>
