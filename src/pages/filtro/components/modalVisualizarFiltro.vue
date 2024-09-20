<script setup lang="ts">
import { reactive } from "vue";
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

const actionsModalView = {
  cancelar() {
    emit("closeModalVisualizarFiltro");
  },

  getClassCorLinha(dados: any) {
    let classe = dados.index % 2 == 0 ? "cor-zebrada-1" : "cor-zebrada-2";
    return { class: classe };
  },

  addItensFiltro() {
    emit(
      "addItensFiltro",
      stateModalVisualizarFiltro.dadosFiltro[0].ID_FILTRO,
      stateModalVisualizarFiltro.dadosFiltro[0].COD_FUNCIONARIO,
      stateModalVisualizarFiltro.dadosFiltro[0].NOME_FILTRO
    );
    emit("closeModalVisualizarFiltro");
  },

  async deleteItemFiltro(item) {
    if (stateModalVisualizarFiltro.dadosFiltro.length == 1) {
      Swal.fire({
        icon: "error",
        text: "Não é possível excluir o único item, volte e exclua todo o filtro se assim desejar!",
      });
      return;
    }

    if (await msgConfirmSemCodigo("Confirmação", "Deseja excluir esse item do filtro?")) {
      try {
        let param = item.ID_ITENS_FILTRO;
        stateModalVisualizarFiltro.loading = true;
        await serviceFiltro.deleteItemFiltro(param);

        // Remover o item do estado local
        stateModalVisualizarFiltro.dadosFiltro = stateModalVisualizarFiltro.dadosFiltro.filter(
          (filtroItem) => filtroItem.ID_ITENS_FILTRO !== item.ID_ITENS_FILTRO
        );

        emit("removerItemState", { idItem: param, idFiltro: item.ID_FILTRO });

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

  editarDadosFiltro(filtro) {
    emit("editarDadosFiltro", filtro);
  },
};

const props = defineProps({
  dadosFiltroSelecionado: {
    type: Array as () => iDadosFiltro[],
    required: true,
  },
});

// Inicializando o estado local com os dados da props
stateModalVisualizarFiltro.dadosFiltro = props.dadosFiltroSelecionado;

const emit = defineEmits([
  "closeModalVisualizarFiltro",
  "addItensFiltro",
  "nomeFiltro",
  "editarDadosFiltro",
  "removerItemState",
]);
</script>

<template>
  <v-container>
    <v-card
      class="pa-2"
      style="width: 900px; height: 505px; margin: 0 auto"
    >
      <v-card-text>
        <div style="display: flex">
          <v-chip
            style=""
            color="primary"
            >Nome do Filtro: {{ stateModalVisualizarFiltro.dadosFiltro[0]?.NOME_FILTRO || "-------" }}
          </v-chip>
          <v-chip
            style="margin-left: 10px"
            color="primary"
            >Conferente: {{ stateModalVisualizarFiltro.dadosFiltro[0]?.CONFERENTE }}
          </v-chip>
          <v-icon
            class="iconEditar"
            color="primary"
            size="30px"
            @click="actionsModalView.editarDadosFiltro(stateModalVisualizarFiltro.dadosFiltro)"
            >mdi-account-edit</v-icon
          >
        </div>
        <v-data-table
          :headers="stateModalVisualizarFiltro.headers"
          items-per-page-text="Itens por página"
          items-per-page="50"
          height="380"
          fixed-header
          :row-props="actionsModalView.getClassCorLinha"
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
                @click="actionsModalView.deleteItemFiltro(item)"
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
        <div style="margin-left: 72%; margin-top: -45px">
          <v-btn
            variant="outlined"
            color="primary"
            @click="actionsModalView.cancelar"
            >Cancelar</v-btn
          >
        </div>
        <div style="margin-left: 85%; margin-top: -37px">
          <v-btn
            class="ml-2"
            color="primary"
            @click="actionsModalView.addItensFiltro()"
          >
            + ADD itens</v-btn
          >
        </div>
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
<style>
.cor-zebrada-1 {
  background-color: #f0f0f0;
}

.v-overlay__scrim {
  background-color: black;
}

.v-data-table-footer__pagination {
  padding-right: 250px;
}
</style>
