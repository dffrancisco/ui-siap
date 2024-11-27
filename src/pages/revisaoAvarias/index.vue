<script lang="ts" setup>
import { onMounted } from "vue";
import { state, revisadaConteudo, headersDataTable, actions, computeds } from "./revisaoAvarias";
import ModalRevisao from "./components/ModalRevisao.vue";

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
      <div class="d-flex flex-column ga-2">
        <div class="d-flex ga-4">
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="state.filtros.NUM_FABRICANTE_PRODUTO"
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
              >
              </v-select>
            </v-col>
            <v-col>
              <v-select
                v-model="state.filtros.DESTINO"
                label="Destino"
                :items="state.avariasDestinosLista"
                item-title="DESCRICAO"
                item-value="ID_AVARIA_DESTINO"
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
              @click="actions.getAvarias"
            ></v-btn>
          </div>
        </div>
        <div
          v-if="computeds.avariasSemRevisao.value.length > 0"
          style="color: #b71c1c; font-size: 12px"
          class="d-flex ga-2"
        >
          <v-icon>mdi-rhombus-outline</v-icon>
          <span>{{ computeds.avariasSemRevisao.value.length }} Avaria sem revisão</span>
        </div>
      </div>

      <div class="mt-2">
        <v-data-table
          :headers="headersDataTable"
          height="330"
          :items="state.dbAvarias"
        >
          <template v-slot:item.ACAO="{ item }">
            <div class="d-flex justify-center ga-4">
              <v-icon
                v-if="item.FINALIZADO == 'N'"
                size="large"
                color="primary"
                icon="mdi-file-sign"
                title="Revisar"
                @click="actions.openModalRevisao(item)"
              >
              </v-icon>

              <v-icon
                size="large"
                color="primary"
                icon="mdi-delete-outline"
                title="Deletar"
                @click=""
              >
              </v-icon>

              <v-icon
                v-if="item.FINALIZADO == 'S'"
                size="large"
                color="primary"
                icon="mdi-eye"
                title="Vizualizar"
                @click=""
              >
              </v-icon>
            </div>
          </template>
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

    <v-dialog
      v-model="state.modalRevisaoAvariasOpen"
      max-width="800px"
    >
      <ModalRevisao
        @closeModal="state.modalRevisaoAvariasOpen = false"
        :avaria="state.avariaSelecionada"
        :destinos="state.avariasDestinosLista"
        :funcionarios="state.funcionariosLista"
      />
    </v-dialog>

    <div id="pnCodigoTela">revisaoAvarias</div>
  </v-container>
</template>
