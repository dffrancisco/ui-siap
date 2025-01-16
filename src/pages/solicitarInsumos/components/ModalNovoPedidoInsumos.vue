<script lang="ts" setup>
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import { onMounted, reactive, ref } from "vue";
import { iCategorias, iItens } from "../interfaces";
import serviceSolicitarInsumos from "../services/solicitarInsumos.service";
import Swal from "sweetalert2";
import { useEventListener } from "@vueuse/core";
const emits = defineEmits(["closeModalNovoPedidoInsumos"]);
const inputSearch = ref();

const state = reactive({
  loading: false,
  gridItens: <ixGridCreate>{},
  gridCarrinho: <ixGridCreate>{},
  dbItens: <iItens[]>[],
  dbCategorias: <iCategorias[]>[],
  categoriaSelecionada: 1 as number | null,
  categoriaAnterior: 0 as number | null,
  search: "",
});

const actions = {
  async init() {
    actions.getCategorias();
    actions.criarGrid();
    actions.getItens();
  },

  criarGrid() {
    state.gridItens = new xGridV2.create({
      el: "#gridItens",
      count: true,
      height: 300,
      columns: {
        Descrição: { dataField: "DESCRICAO", style: "text-align: center" },
      },
    });
    state.gridCarrinho = new xGridV2.create({
      el: "#gridCarrinho",
      count: true,
      height: 400,
      columns: {
        Descrição: { dataField: "Descricao" },
      },
    });
  },

  async getItens() {
    try {
      state.loading = true;
      state.gridItens.clear();
      state.dbItens = [];

      if (state.search == null) {
        state.search = "";
      }

      let param = {
        search: state.search,
        categoria: state.categoriaSelecionada,
      };

      const data = await serviceSolicitarInsumos.getItens(param);
      state.dbItens = data as iItens[];
      state.gridItens.source(state.dbItens);

      state.categoriaAnterior = state.categoriaSelecionada;

      return data;
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Erro ao exibir os itens",
      });
      return;
    } finally {
      state.loading = false;
    }
  },

  async getCategorias() {
    try {
      state.loading = true;
      const data = await serviceSolicitarInsumos.getCategorias();
      state.dbCategorias = data;
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Erro ao carregar as categorias",
      });
      return;
    } finally {
      state.loading = false;
    }
  },

  closeModalNovoPedidoInsumos() {
    emits("closeModalNovoPedidoInsumos");
  },

  async btnSearch() {
    await actions.getItens();
  },
};

const eventListener = useEventListener(document, "keydown", async (event) => {
  if (event.key === "F1") {
    inputSearch.value.focus();
    event.preventDefault();
    event.stopPropagation();
  }
});

onMounted(async () => {
  await actions.init();
});
</script>
<template>
  <v-card class="pa-4">
    <v-row class="pt-2">
      <v-col cols="7">
        <v-row>
          <v-col
            style="margin-top: -10px"
            v-for="categoria in state.dbCategorias"
            :key="categoria.ID_INSUMO_CATEGORIA"
            cols="6"
            md="6"
            lg="4"
          >
            <v-card
              class="categoria-card"
              :class="{ 'selected-card': state.categoriaSelecionada == categoria.ID_INSUMO_CATEGORIA }"
              @click="
                () => {
                  if (state.categoriaSelecionada !== categoria.ID_INSUMO_CATEGORIA) {
                    state.categoriaAnterior = state.categoriaSelecionada;
                    state.categoriaSelecionada = categoria.ID_INSUMO_CATEGORIA;
                    actions.getItens();
                  }
                }
              "
            >
              <v-card-title class="categoria-title">{{ categoria.CATEGORIA }}</v-card-title>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <div class="d-flex ga-2">
              <v-text-field
                label="Pesquisar Itens (F1)"
                v-model="state.search"
                :clearable="true"
                autofocus
                ref="inputSearch"
                @keydown.enter.prevent="actions.btnSearch"
                @keydown.arrow.down.prevent="state.gridItens.focus()"
              ></v-text-field>

              <div class="d-flex align-center">
                <v-btn
                  icon="mdi-magnify"
                  size="39"
                  color="primary"
                  @click="actions.btnSearch"
                />
              </div>
            </div>
          </v-col>
        </v-row>

        <div
          class="mt-4"
          id="gridItens"
        ></div>
      </v-col>
      <v-divider
        vertical
        class="divider"
        :thickness="4"
      ></v-divider>
      <v-col
        class="ml-7"
        cols="4"
      >
        <v-card>
          <span>CARRINHO</span>
          <v-chip>13</v-chip>
        </v-card>
        <div
          class="mt-4"
          id="gridCarrinho"
        ></div>
      </v-col>
    </v-row>
  </v-card>
</template>

<style scoped>
.selected-card {
  border: 2px solid #1976d2;
  background-color: #e3f2fd;
}

/* .categoria-card {
  display: flex;
} */

.categoria-title {
  font-size: 14px;
  text-align: center;
  line-height: 1.4;
}
</style>
