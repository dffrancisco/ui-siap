<script lang="ts" setup>
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import { onMounted, reactive, ref } from "vue";
import { iCategorias, iGetItens, iItens } from "../interfaces";
import serviceSolicitarInsumos from "../services/solicitarInsumos.service";
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
  },

  criarGrid() {
    state.gridItens = new xGridV2.create({
      el: "#gridItens",
      count: true,
      height: 300,
      columns: {
        Descrição: { dataField: "DESCRICAO", style: "text-align: center" },
      },
      query: {
        async execute(rs) {
          let data = await actions.getItens(rs.param as iGetItens);
          state.dbItens = data as iItens[];
          state.gridItens.querySourceAdd(state.dbItens);
        },
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

  async getItens(param: iGetItens) {
    try {
      state.loading = true;

      console.log(state.categoriaAnterior);
      console.log(state.categoriaSelecionada);
      console.log(inputSearch.value);

      if (state.categoriaSelecionada == state.categoriaAnterior && state.search == "") {
        return false;
      }

      state.gridItens.clear();
      state.dbItens = [];

      const data = await serviceSolicitarInsumos.getItens(param, state.categoriaSelecionada);
      state.dbItens = data as iItens[];
      state.gridItens.querySourceAdd(state.dbItens);

      state.categoriaAnterior = state.categoriaSelecionada;

      return data;
    } catch (error) {
      console.error("Erro ao carregar itens", error);
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
      console.error("Erro ao carregar categorias", error);
    } finally {
      state.loading = false;
    }
  },

  closeModalNovoPedidoInsumos() {
    emits("closeModalNovoPedidoInsumos");
  },

  async btnSearch() {
    state.gridItens.queryOpen({
      search: inputSearch.value.value,
    });
  },
};

onMounted(async () => {
  await actions.init();
  //   state.categoriaSelecionada = 1;

  state.gridItens.queryOpen(
    {
      search: "",
    },
    () => {
      inputSearch.value.focus();
    }
  );
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
              class="category-card"
              :class="{ 'selected-card': state.categoriaSelecionada == categoria.ID_INSUMO_CATEGORIA }"
              @click="
                () => {
                  if (state.categoriaSelecionada !== categoria.ID_INSUMO_CATEGORIA) {
                    state.categoriaAnterior = state.categoriaSelecionada;
                    state.categoriaSelecionada = categoria.ID_INSUMO_CATEGORIA;
                    actions.getItens({ search: '' });
                  }
                }
              "
            >
              <v-card-title class="category-title">{{ categoria.CATEGORIA }}</v-card-title>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <div class="d-flex ga-2">
              <v-text-field
                label="Pesquisar Itens"
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

.category-card {
  display: flex;
}

.category-title {
  font-size: 14px;
  text-align: center;
  line-height: 1.4;
}
</style>
