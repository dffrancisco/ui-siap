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
      :max-width="900"
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
            :clearable="false"
            @keypress.enter="actions.getDadosEstoqueOrganico"
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
            :clearable="false"
            @keypress.enter="actions.getDadosEstoqueOrganico"
          ></v-text-field>
        </v-col>

        <v-col
          cols="6"
          class="pr-0 pl-2 pt-1"
        >
          <v-text-field
            v-model="state.descricao"
            label="Descrição produto"
            :clearable="false"
            @keypress.enter="actions.getDadosEstoqueOrganico"
          ></v-text-field>
        </v-col>

        <v-col
          cols="2"
          class="btnPesquisar pr-0 pt-0"
        >
          <v-btn
            color="primary"
            icon="mdi-magnify"
            size="36px"
            title="Pesquisar"
            @click="actions.getDadosEstoqueOrganico"
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

      <v-data-table-server
        items-per-page-text="Itens por página"
        :items="state.dadosEstoqueOrganico"
        v-model:itemsPerPage="state.itemsPerPage"
        :items-length="state.totalItems"
        :headers="state.headers"
        height="375"
        id="tabelaEstoqueOrganico"
        style="border-radius: 5px"
        fixed-header
        :loading="state.loading"
        :row-props="actions.getClassCorLinha"
        @update:page="actions.updatePage"
        :items-per-page-options="[5, 10, 25, 50, 100, 200, 500]"
      ></v-data-table-server>
    </v-card>

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
    <div id="pnCodigoTela"> estoqueOrganico </div>
  </v-container>
</template>

<style>
.cor-zebrada-1 {
  background-color: #f0f0f0;
}

#tabelaEstoqueOrganico .v-data-table-footer {
  max-height: 40px;
}
</style>
