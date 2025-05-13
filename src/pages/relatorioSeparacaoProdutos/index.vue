<script setup lang="ts">
import { onMounted } from "vue";
import { actions, state } from "./relatorioSeparacaoProdutos";
onMounted(async () => {
  actions.init();
});
</script>

<template>
  <v-container
    ><v-card
      class="pa-5 ma-auto"
      :max-width="930"
      :max-height="600"
    >
      <v-row>
        <v-col cols="4">
          <v-autocomplete
            density="compact"
            label="Estoquistas"
            variant="outlined"
            multiple
            autocomplete="off"
            :items="state.estoquistas"
            item-title="LOGIN_COM_CODIGO"
            item-value="COD_FUNCIONARIO"
            v-model="state.estoquistasSelecionados"
          >
            <template #selection="{ item, index }">
              <v-chip
                v-if="index < 1"
                size="small"
                class="mr-1"
              >
                {{ item.title }}
              </v-chip>
              <span
                v-if="index === 1"
                class="text-grey text-caption align-self-center"
              >
                (+{{ state.estoquistasSelecionados.length - 1 }})
              </span>
            </template>
          </v-autocomplete>
        </v-col>

        <v-col cols="3">
          <v-text-field
            label="Data de Início"
            id="dataInicio"
            class="dataInicio"
            type="date"
            v-model="state.dataInicio"
            :clearable="false"
            @keydown.enter="state.inputDataFinal.focus()"
          ></v-text-field>
        </v-col>

        <v-col cols="3">
          <v-text-field
            label="Data de Fim"
            id="dataFim"
            class="dataFim"
            type="date"
            v-model="state.dataFim"
            :clearable="false"
            @keydown.enter.prevent="actions.validarInputs"
          ></v-text-field>
        </v-col>

        <v-col
          cols="2"
          class="btnPesquisar"
        >
          <v-btn
            color="primary"
            icon="mdi-magnify"
            size="36px"
            title="Pesquisar"
            @click="actions.validarInputs"
          >
            <v-icon left>mdi-magnify</v-icon>
          </v-btn>
          <v-btn
            class="ml-3"
            color="primary"
            :disabled="state.dadosRelatorioSeparacaoProdutos.length === 0"
            @click="actions.onClickImprimir"
            icon="mdi-printer"
            size="36px"
            title="Imprimir"
          >
            <v-icon left>mdi-printer</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <v-data-table-virtual
        class="pt-4"
        :items="state.dadosRelatorioSeparacaoProdutos"
        :headers="state.headers"
        height="450px"
        style="border-radius: 5px"
        fixed-header
        :loading="state.loading"
        :row-props="actions.getClassCorLinha"
      ></v-data-table-virtual>
    </v-card>
    <div id="pnCodigoTela"> relatorioSeparacaoProdutos </div>

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
.cor-zebrada-1 {
  background-color: #f0f0f0;
}
</style>
