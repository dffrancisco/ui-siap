<script lang="ts" setup>
import { onMounted, onUnmounted, reactive } from "vue";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import serviceRequisicaoCompra from "../services/requisicaoCompra.service";
import Swal from "sweetalert2";
import { iCarros, iGetProdutosParam, iMarcas, iProduto } from "../interfaces";
import { useEventListener } from "@vueuse/core";
import produtoSemFotoImg from "../../../assets/sem_foto.jpg";
import ModalInformarQtdProduto from "./ModalInformarQtdProduto.vue";

const props = defineProps({
  carros: {
    type: Array as () => iCarros[],
    required: true,
  },
  marcas: {
    type: Array as () => iMarcas[],
    required: true,
  },
});

const emits = defineEmits(["closeModal"]);

const state = reactive({
  gridProdutos: <ixGridCreate>{},
  loading: false,
  selectMarca: null,
  selectCarro: null,
  inputSearch: <HTMLInputElement>null,
  modalInformarQtdProdutoOpened: false,
  dbProdutoSelecionado: <iProduto>{},
});

const actions = {
  criarGrid() {
    state.gridProdutos = new xGridV2.create({
      el: "#gridProdutos",
      columns: {
        "": { compare: "produtos" },
      },
      compare: {
        produtos(rs) {
          let url_foto = "";
          if (rs.FOTO == "F") {
            url_foto = `http://www.reallatas.com.br/balcao/foto/${rs.COD_PRODUTO}.jpg`;
          } else {
            url_foto = produtoSemFotoImg;
          }

          return `<div style="display: flex; height: 62px; margin-bottom: 10px; width: 100%;">
                    <div>
                    <img
                        style="width: 96px; height: 100%; border-radius: 8px;"
                        src="${url_foto}"
                    />
                    </div>
                    <div
                    style="
                        display: flex;
                        flex-direction: column;
                        justify-content: space-around;
                        width: 100%;
                        padding-left: 8px;
                        padding-right: 8px;
                    "
                    >
                    <div style="display: flex; justify-content: space-between">
                        <p style="font-size: 12px; font-weight: 700">${rs.DESC_PRODUTO}</p>

                        <p style="font-size: 12px; font-weight: 700">${rs.NUM_FABRICANTE}</p>
                    </div>
                    <div style="display: flex; flex-direction: row; justify-content: space-between">
                        <p>Qtd de Itens: ${rs.QUANTIDADE}</p>
                        <p>${rs.CARRO}</p>
                    </div>
                    </div>
                  </div>`;
        },
      },
      height: "310px",
      query: {
        async execute(rs) {
          const data = await actions.getProdutos(rs.param as iGetProdutosParam, rs.offset);
          state.gridProdutos.querySourceAdd(data);
        },
      },
      enter: actions.openModalInformarQtdProduto,
      dblClick: actions.openModalInformarQtdProduto,
    });
  },

  async init() {
    state.inputSearch = document.getElementById("inputSearch") as HTMLInputElement;

    actions.criarGrid();

    state.gridProdutos.queryOpen({}, () => {
      state.inputSearch.focus();
    });
  },

  closeModal() {
    emits("closeModal");
  },

  async search() {
    state.gridProdutos.queryOpen({
      search: state.inputSearch.value,
      ID_MARCA: state.selectMarca,
      ID_CARRO: state.selectCarro,
    });
  },

  async openModalInformarQtdProduto() {
    const produto = state.gridProdutos.dataSource();

    if (!produto) {
      Swal.fire({
        icon: "warning",
        title: "Nenhum produto foi selecionado.",
      });
      return;
    }

    state.dbProdutoSelecionado = produto;

    state.modalInformarQtdProdutoOpened = true;
  },

  async getProdutos(param: iGetProdutosParam, offset: number) {
    try {
      state.loading = true;

      const data = await serviceRequisicaoCompra.getProdutos(param, offset);

      return data;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Ocorreu um erro ao carregar os produtos.",
        text: error.message,
      });
    } finally {
      state.loading = false;
    }
  },
};

onMounted(async () => {
  actions.init();
});

onUnmounted(() => {
  removeEventListener("keydown", eventListener);
});

const eventListener = useEventListener(document, "keydown", async (event) => {
  if (event.key === "F1") {
    state.inputSearch.select();
    event.preventDefault();
    event.stopPropagation();
  }
});
</script>

<template>
  <v-card class="d-flex flex-grow-1 pa-4">
    <v-card-title>Novo Item</v-card-title>

    <div class="mt-2">
      <v-row>
        <v-col cols="3">
          <v-autocomplete
            v-model="state.selectCarro"
            :items="props.carros"
            label="Carro"
            item-title="DESCRICAO"
            item-value="ID_CARRO"
          >
          </v-autocomplete>
        </v-col>
        <v-col cols="3">
          <v-autocomplete
            v-model="state.selectMarca"
            :items="props.marcas"
            item-title="DESCRICAO"
            item-value="ID_MARCA"
            label="Marca"
          >
          </v-autocomplete>
        </v-col>
        <v-col class="d-flex align-center ga-2">
          <v-text-field
            id="inputSearch"
            label="F1 - Pesquisar (N° Fab. ou Descrição)"
            @keydown.enter="actions.search"
            @keydown.arrow.down.prevent="state.gridProdutos.focus()"
          ></v-text-field>
          <v-btn
            icon="mdi-magnify mdi-24px"
            color="primary"
            size="36"
            @click="actions.search"
          />
        </v-col>
      </v-row>
    </div>

    <div
      id="gridProdutos"
      class="mt-4"
    ></div>

    <div class="d-flex justify-space-between">
      <div>
        <v-btn color="primary">+ ITEM SEM CADASTRO</v-btn>
      </div>

      <div class="d-flex ga-4">
        <v-btn
          variant="outlined"
          color="primary"
          @click="actions.closeModal"
          >Cancelar</v-btn
        >
        <v-btn
          color="primary"
          @click="actions.openModalInformarQtdProduto"
          >selecionar</v-btn
        >
      </div>
    </div>
  </v-card>

  <v-dialog
    v-model="state.modalInformarQtdProdutoOpened"
    :width="700"
  >
    <ModalInformarQtdProduto
      @closeModal="state.modalInformarQtdProdutoOpened = false"
      :produto="state.dbProdutoSelecionado"
    />
  </v-dialog>

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
</template>
