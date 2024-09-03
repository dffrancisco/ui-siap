<script setup lang="ts">
import { reactive, watch } from "vue";
import { iDadosFiltro } from "../interfaces";
import serviceFiltro from "../services/filtro.service";
import Swal from "sweetalert2";
import { msgConfirmSemCodigo } from "@/ts/utils";

const stateModalVisualizarFiltro = reactive({
  loading: false,
  dadosFiltro: [] as iDadosFiltro[],
  headers: <any>[
    {
      title: "Produto",
      key: "DESC_PRODUTO",
      sortable: true,
    },
    {
      title: "Nº Fabricante",
      key: "NUM_FABRICANTE",
      sortable: true,
    },
    {
      title: "Nº Fabricante 2",
      key: "NUM_FABRICANTE2",
      sortable: true,
    },

    {
      title: "Qtd",
      key: "QUANTIDADE",
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

const actions = {
  cancelar() {
    emit("closeModalVisualizarFiltro");
  },

  addItensFiltro() {
    emit(
      "addItensFiltro",
      props.dadosFiltroSelecionado[0].ID_FILTRO,
      props.dadosFiltroSelecionado[0].CONFERENTE,
      props.dadosFiltroSelecionado[0].NOME_FILTRO
    );
    emit("closeModalVisualizarFiltro");
  },

  async deleteItemFiltro(item) {
    if (await msgConfirmSemCodigo("Confirmação", "Deseja excluir esse item do filtro?")) {
      try {
        let param = item.ID_ITENS_FILTRO;
        stateModalVisualizarFiltro.loading = true;
        await serviceFiltro.deleteItemFiltro(param);

        // Remover o item do estado local
        stateModalVisualizarFiltro.dadosFiltro = stateModalVisualizarFiltro.dadosFiltro.filter(
          // @ts-ignore
          (filtroItem) => filtroItem.ID_ITENS_FILTRO !== item.ID_ITENS_FILTRO
        );

        Swal.fire({
          icon: "success",
          text: "Item removido com sucesso!",
          timer: 1000,
        });
      } catch {
        Swal.fire({
          icon: "error",
          text: "Erro ao excluir o item!",
        });
      } finally {
        stateModalVisualizarFiltro.loading = false;
      }
    }
  },
};

const props = defineProps({
  dadosFiltroSelecionado: {
    type: Array as () => iDadosFiltro[],
    required: true,
  },
});

// Inicializando o estado local com os dados da props
stateModalVisualizarFiltro.dadosFiltro = [...props.dadosFiltroSelecionado];

watch(
  () => props.dadosFiltroSelecionado,
  (newValue) => {
    stateModalVisualizarFiltro.dadosFiltro = [...newValue];
  },
  { immediate: true } //immediate: true faz com que o watch rode na primeira renderização
);

const emit = defineEmits(["closeModalVisualizarFiltro", "addItensFiltro", "nomeFiltro"]);
</script>
<template>
  <v-container>
    <v-card
      class="pa-2"
      style="width: 900px; margin: 0 auto"
    >
      <v-card-text>
        <div>
          <v-icon
            style="top: 20px"
            @click="actions.cancelar()"
            >mdi-close-circle-outline</v-icon
          >
        </div>
        <div style="margin-left: 85%; padding-bottom: 15px">
          <v-btn
            class="ml-2"
            color="primary"
            @click="actions.addItensFiltro()"
          >
            + ADD itens</v-btn
          >
        </div>
        <v-data-table
          :headers="stateModalVisualizarFiltro.headers"
          items-per-page-text="Itens por página"
          items-per-page="50"
          height="370"
          fixed-header
          :items="stateModalVisualizarFiltro.dadosFiltro"
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
                @click="actions.deleteItemFiltro(item)"
              >
                mdi-delete-outline
              </v-icon>
            </div>
          </template>
          <template #no-data>
            <v-alert
              :value="true"
              icon="mdi-information"
              style="background-color: #ffffff"
            >
              Não há dados disponíveis.
            </v-alert>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-overlay
      :model-value="stateModalVisualizarFiltro.loading"
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
<style scoped></style>
