<script setup lang="ts">
import { onMounted } from "vue";
import { actions, state } from "./estoqueOrganico";
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
        <v-col
          cols="4"
          class="pr-0 pl-1"
        >
          <v-autocomplete
            density="compact"
            label="Carros"
            variant="outlined"
            multiple
            autocomplete="off"
            :items="state.carros"
            item-title="DESCRICAO"
            item-value="ID_CARRO"
            v-model="state.carrosSelecionados"
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
                (+{{ state.carrosSelecionados.length - 1 }})
              </span>
            </template>
          </v-autocomplete>
        </v-col>

        <v-col
          cols="4"
          class="pr-0 pl-2"
        >
          <v-autocomplete
            density="compact"
            label="Marcas"
            variant="outlined"
            multiple
            autocomplete="off"
            :items="state.marcas"
            item-title="DESCRICAO"
            item-value="ID_MARCA"
            v-model="state.marcasSelecionados"
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
                (+{{ state.marcasSelecionados.length - 1 }})
              </span>
            </template>
          </v-autocomplete>
        </v-col>

        <v-col cols="4">
          <v-text-field
            v-model="state.numFabricante"
            label="Nº Fabricante"
            @keypress.enter="actions.validarInputs"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="4"
          class="pr-0 pl-1 pt-1"
        >
          <v-text-field
            v-model="state.endEstoque"
            label="Endereço Estoque"
            @keypress.enter="actions.validarInputs"
          ></v-text-field>
        </v-col>

        <v-col
          cols="6"
          class="pr-0 pl-2 pt-1"
        >
          <v-text-field
            v-model="state.descricao"
            label="Descrição produto"
            @keypress.enter="actions.validarInputs"
          ></v-text-field>
        </v-col>

        <v-col
          cols="2"
          class="btnPesquisar pr-0 pt-1"
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
            :disabled="state.dadosEstoqueOrganico.length === 0"
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
        :items="state.dadosEstoqueOrganico"
        :headers="state.headers"
        height="450px"
        style="border-radius: 5px"
        fixed-header
        :loading="state.loading"
        :row-props="actions.getClassCorLinha"
      ></v-data-table-virtual>
    </v-card>
    <div id="pnCodigoTela"> estoqueOrganico </div>

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
