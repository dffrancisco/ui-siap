<script lang="ts" setup>
import { onMounted } from "vue";
import { state, revisadaConteudo, headersDataTable, actions, computeds } from "./revisaoAvarias";
import ModalRevisao from "./components/ModalRevisao.vue";
import ModalConfigurarImpressao from "./components/ModalConfigurarImpressao.vue";

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
            <v-col cols="5">
              <v-text-field
                v-model="state.filtros.NUM_FABRICANTE_PRODUTO"
                label="Nº Fabricante / Produto"
                @keydown.enter.prevent="actions.getAvarias"
              >
              </v-text-field>
            </v-col>
            <v-col cols="3">
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
        <v-data-table-server
          v-model:itemsPerPage="state.itemsPerPage"
          :headers="headersDataTable"
          :items-length="state.totalItems"
          height="330"
          fixed-header
          :items="state.dbAvarias"
          @update:page="actions.updatePage"
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
                v-if="item.FINALIZADO == 'N'"
                size="large"
                color="primary"
                icon="mdi-delete-outline"
                title="Deletar"
                @click="actions.btnDeletarAvaria(item.ID_AVARIA)"
              >
              </v-icon>

              <v-icon
                v-if="item.FINALIZADO == 'S'"
                size="large"
                color="primary"
                icon="mdi-eye"
                title="Vizualizar"
                @click="actions.openModalRevisao(item)"
              >
              </v-icon>
            </div>
          </template>
        </v-data-table-server>
      </div>

      <div>
        <v-btn
          color="primary"
          size="small"
          icon="mdi-printer mdi-24px"
          title="Imprimir"
          :disabled="state.dbAvarias.length == 0"
          @click="actions.imprimirAvarias"
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
      max-width="950px"
      :retain-focus="false"
      style="z-index: 1000"
    >
      <ModalRevisao
        @closeModal="state.modalRevisaoAvariasOpen = false"
        :avaria="state.avariaSelecionada"
        :destinos="state.avariasDestinosLista"
        :funcionarios="state.funcionariosLista"
        @finalizarAvaria="actions.finalizarAvaria"
      />
    </v-dialog>

    <v-dialog
      v-model="state.modalConfigurarImpressao"
      max-width="700px"
      persistent
      :retain-focus="false"
    >
      <ModalConfigurarImpressao
        :dadosToEtiqueta="state.dadosToEtiqueta"
        @closeModal="state.modalConfigurarImpressao = false"
      />
    </v-dialog>

    <div id="pnCodigoTela">revisaoAvarias</div>
  </v-container>
</template>
