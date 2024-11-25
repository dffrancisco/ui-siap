<script lang="ts" setup>
import { onMounted } from "vue";
import { state, revisadaConteudo, headersDataTable, actions } from "./revisaoAvarias";

onMounted(async () => {
  await actions.init();
});
</script>

<template>
  <v-container>
    <v-card
      maxWidth="1000"
      maxHeight="550"
      class="ma-auto pa-4"
    >
      <div class="d-flex ga-4">
        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="state.filtros.NUM_FABRICANTE"
              label="Nº Fabricante / Produto"
            >
            </v-text-field>
          </v-col>
          <v-col cols="2">
            <v-select
              v-model="state.filtros.REVISADA"
              label="Revisada"
              :items="revisadaConteudo"
              item-title="label"
              item-value="value"
              :clearable="false"
            >
            </v-select>
          </v-col>
          <v-col>
            <v-select
              v-model="state.filtros.DESTINO"
              label="Destino"
              :items="state.avariasDestinosLista"
              item-title="DESCRICAO"
              item-value="ID_TIPO_DESTINO"
              :clearable="false"
            >
            </v-select>
          </v-col>
        </v-row>
        <div>
          <v-btn
            color="primary"
            size="small"
            icon="mdi-magnify mdi-24px"
            title="Pesquisar"
          ></v-btn>
        </div>
      </div>

      <div class="mt-2">
        <v-data-table
          :headers="headersDataTable"
          height="350"
        >
        </v-data-table>
      </div>

      <div>
        <v-btn
          color="primary"
          size="small"
          icon="mdi-printer mdi-24px"
          title="Imprimir"
        >
        </v-btn>
      </div>
    </v-card>
    <div id="pnCodigoTela">revisaoAvarias</div>
  </v-container>
</template>
