<script setup lang="ts">
import { reactive } from "vue";
import { iDadosFiltro } from "../interfaces";
import utils from "@/ts/utils";

const props = defineProps({
  dadosFiltroSelecionado: {
    type: Array as () => iDadosFiltro[],
    required: true,
  },
});

const emit = defineEmits(["closeModalRevisaoFiltro"]);

const stateModalRevisaoFiltro = reactive({
  loading: false,
  dadosFiltro: [] as iDadosFiltro[],
  headers: <any>[
    {
      title: "Nº Fabricante",
      key: "NUM_FABRICANTE",
      sortable: true,
    },
    {
      title: "Descrição",
      key: "DESC_PRODUTO",
      sortable: true,
    },
    {
      title: "End. Estoque",
      key: "END_ESTOQUE",
      sortable: true,
    },
    {
      title: "End. Excesso",
      key: "END_EXCESSO",
      sortable: true,
    },
    {
      title: "Qtd",
      key: "QTD_ESTOQUE",
      sortable: true,
      align: "center",
    },
    {
      title: "Conferido",
      key: "CONFERIDO",
      sortable: true,
      align: "center",
    },
    {
      title: "Ações",
      key: "acoes",
      sortable: false,
      align: "center",
    },
  ],
});

stateModalRevisaoFiltro.dadosFiltro = props.dadosFiltroSelecionado;

const actions = {
  cancelar() {
    emit("closeModalRevisaoFiltro");
  },

  getClassCorLinha(dados: any) {
    let classe = dados.index % 2 == 0 ? "cor-zebrada-1" : "cor-zebrada-2";
    return { class: classe };
  },
};
</script>
<template>
  <v-container>
    <v-card
      :width="900"
      class="ma-auto pa-4"
    >
      <v-card class="ma-auto pa-4 cardDadosRevisaoFiltro">
        <v-chip
          style="font-weight: bold"
          color="primary"
          >Nome do Filtro: {{ stateModalRevisaoFiltro.dadosFiltro[0]?.NOME_FILTRO || "-------" }}
        </v-chip>

        <v-chip
          style="font-weight: bold"
          color="primary"
          >Conferente: {{ stateModalRevisaoFiltro.dadosFiltro[0]?.CONFERENTE || "-------" }}
        </v-chip>

        <v-chip
          style="font-weight: bold"
          color="primary"
          >Início: {{ utils.dataBrasil(stateModalRevisaoFiltro.dadosFiltro[0]?.DT_FILTRO) }} -
          {{ utils.formatHora(stateModalRevisaoFiltro.dadosFiltro[0]?.HR_INICIO) }}
        </v-chip>

        <v-chip
          style="font-weight: bold"
          color="primary"
          >Qtd. Itens: {{ stateModalRevisaoFiltro.dadosFiltro.length }}
        </v-chip>
      </v-card>

      <v-row class="ml-2 mt-4 mb-2">
        <v-card
          :width="120"
          class="pa-2"
          style="border: 1px solid #ddd"
          >ITENS ALTERADOS</v-card
        >
        <v-card
          :width="120"
          class="ml-4 pa-2"
          style="border: 1px solid #ddd"
          >TODOS OS ITENS</v-card
        >
      </v-row>

      <v-data-table
        :headers="stateModalRevisaoFiltro.headers"
        items-per-page-text="Itens por página"
        items-per-page="50"
        height="380"
        fixed-header
        :row-props="actions.getClassCorLinha"
        :items="stateModalRevisaoFiltro.dadosFiltro"
        item-key="COD_PRODUTO"
        item-value="COD_PRODUTO"
      >
        <template v-slot:item.acoes="{ item }">
          <div style="display: flex">
            <v-icon
              size="large"
              color="primary"
              class="ml-1"
              title="Deletar"
              :disabled="item.CONFERIDO == 'SIM'"
            >
              mdi-delete-outline
            </v-icon>
          </div>
        </template>
      </v-data-table>

      <div style="margin-left: 75%; margin-top: -5px">
        <v-btn
          variant="outlined"
          color="primary"
          @click="actions.cancelar"
          >Fechar</v-btn
        >
      </div>
      <div style="margin-left: 87%; margin-top: -37px">
        <v-btn color="primary"> Finalizar</v-btn>
      </div>
    </v-card>
    <v-overlay
      :model-value="stateModalRevisaoFiltro.loading"
      class="align-center justify-center"
      persistent
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

.v-overlay__scrim {
  background-color: black;
}

/* .v-data-table-footer__pagination {
  padding-right: 230px;
} */
</style>

<style scoped>
.cardDadosRevisaoFiltro {
  border-radius: 10px;
  border: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
}
</style>
