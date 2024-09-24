<script setup lang="ts">
import { onMounted, onUnmounted, reactive, computed, watch } from "vue";
import serviceFiltro from "../services/filtro.service";
import { iCarros, iMarcas, iParamFiltrar, iResultPesquisa } from "../interfaces";
import Swal from "sweetalert2";

const props = defineProps({
  nomeFiltro: {
    type: String,
    required: false,
  },
  idFiltro: {
    type: [Number, null],
    required: true,
  },
  conferente: {
    type: [Number, null],
    required: true,
  },
  marcas: {
    type: Array,
    required: true,
  },
  carros: {
    type: Array,
    required: true,
  },
});

const stateModalAddItensFiltro = reactive({
  loading: false,
  search: "",
  nomeFiltro: "",
  idFiltro: null,
  funcionarioSelecionado: null,
  carros: <iCarros[]>[],
  carroSelecionado: <iCarros[]>[],
  marcaSelecionada: <iMarcas[]>[],
  marcas: <iMarcas[]>[],
  dadosRetornadosDaPesquisa: <iResultPesquisa[]>[],
  produtosSelecionados: <number[]>[],
  produtosSelecionadosDetalhes: <iResultPesquisa[]>[],
  mostrarSomenteSelecionados: false,
  chipSelecionado: false,
  paramsPesquisa: {},
  endEstoque: "",
  numFabricante: "",
  descricaoProduto: "",
  headers: <any>[
    {
      title: "Produto",
      key: "DESC_PRODUTO",
      align: "left",
    },
    {
      title: "Nº Fabricante",
      key: "NUM_FABRICANTE",
      sortable: true,
    },
    {
      title: "Nº Fabricante2",
      key: "NUM_FABRICANTE2",
      sortable: true,
    },

    {
      title: "Carro",
      key: "CARRO",
    },
    {
      title: "Marca",
      key: "MARCA",
    },
    {
      title: "Qtd Itens",
      key: "QUANTIDADE",
      align: "center",
    },
  ],
});

const actions = {
  async init() {
    stateModalAddItensFiltro.loading = true;

    stateModalAddItensFiltro.carros = props.carros as iCarros[];
    stateModalAddItensFiltro.marcas = props.marcas as iMarcas[];

    const inputDescricao = document.querySelector("#descricaoProduto") as HTMLElement;
    if (inputDescricao) {
      inputDescricao.focus();
    }

    stateModalAddItensFiltro.loading = false;
  },

  iniciarStates() {
    stateModalAddItensFiltro.nomeFiltro = props.nomeFiltro;
    stateModalAddItensFiltro.idFiltro = props.idFiltro;
    stateModalAddItensFiltro.funcionarioSelecionado = props.conferente;
  },

  resetStates() {
    stateModalAddItensFiltro.search = "";
    stateModalAddItensFiltro.nomeFiltro = "";
    stateModalAddItensFiltro.funcionarioSelecionado = "";
    stateModalAddItensFiltro.carroSelecionado = [];
    stateModalAddItensFiltro.marcaSelecionada = [];
    stateModalAddItensFiltro.dadosRetornadosDaPesquisa = [];
    stateModalAddItensFiltro.produtosSelecionados = [];
  },

  async buscarDadosParaFiltro() {
    try {
      stateModalAddItensFiltro.loading = true;
      const param = {
        search: stateModalAddItensFiltro.search,
        marca: stateModalAddItensFiltro.marcaSelecionada,
        carro: stateModalAddItensFiltro.carroSelecionado,
        endEstoque: stateModalAddItensFiltro.endEstoque,
        numFabricante: stateModalAddItensFiltro.numFabricante,
        descricaoProduto: stateModalAddItensFiltro.descricaoProduto,
      };

      stateModalAddItensFiltro.paramsPesquisa = [param];
      const dados = await serviceFiltro.getDadosParaFiltragem(param as iParamFiltrar);

      stateModalAddItensFiltro.dadosRetornadosDaPesquisa = dados;
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Erro ao buscar os dados!",
      });
    } finally {
      stateModalAddItensFiltro.loading = false;
    }
  },

  cancelar() {
    emit("cancelarModalAddItensFiltro");
    actions.resetStates();
  },

  salvar() {
    emit("closeModalAddItensFiltro");
    actions.resetStates();
  },

  confirmarSelecionados() {
    if (stateModalAddItensFiltro.produtosSelecionados.length == 0) {
      Swal.fire({
        icon: "warning",
        text: "Escolha ao menos um item para o filtro!",
      });
      return;
    }

    let parametrosInsercao = {
      idFiltro: stateModalAddItensFiltro.idFiltro,
      nomeFiltro: stateModalAddItensFiltro.nomeFiltro,
      funcionario: stateModalAddItensFiltro.funcionarioSelecionado,
      objPesquisa: stateModalAddItensFiltro.paramsPesquisa,
      produtosSelecionados: stateModalAddItensFiltro.produtosSelecionados,
    };

    if (stateModalAddItensFiltro.idFiltro == null) {
      actions.inserirFiltro(parametrosInsercao);
      return;
    }
    actions.atualizarFiltro(parametrosInsercao);
  },

  async atualizarFiltro(parametrosInsercao) {
    try {
      stateModalAddItensFiltro.loading = true;
      await serviceFiltro.atualizarFiltro(parametrosInsercao);
      Swal.fire({ icon: "success", text: "Dados salvos com sucesso!", timer: 1500 });
      actions.salvar();
    } catch (error) {
      const errorMessage = error.response?.data?.msg || "Erro ao atualizar os dados.";
      Swal.fire({
        icon: "error",
        text: errorMessage,
      });
      return;
    } finally {
      stateModalAddItensFiltro.loading = false;
    }
  },

  async inserirFiltro(parametrosInsercao) {
    try {
      stateModalAddItensFiltro.loading = true;
      await serviceFiltro.inserirFiltro(parametrosInsercao);
      Swal.fire({
        icon: "success",
        text: "Dados salvos com sucesso!",
        timer: 1500,
      });
      actions.salvar();
    } catch (error) {
      const errorMessage = error.response?.data?.msg || "Erro ao inserir os dados.";
      Swal.fire({
        icon: "error",
        text: errorMessage,
      });
      return;
    } finally {
      stateModalAddItensFiltro.loading = false;
    }
  },

  getClassCorLinha(dados: any) {
    let classe = dados.index % 2 == 0 ? "cor-zebrada-1" : "cor-zebrada-2";
    return { class: classe };
  },
};

const emit = defineEmits(["closeModalAddItensFiltro", "cancelarModalAddItensFiltro"]);

const filtrarSelecionados = () => {
  stateModalAddItensFiltro.mostrarSomenteSelecionados = !stateModalAddItensFiltro.mostrarSomenteSelecionados;
  stateModalAddItensFiltro.chipSelecionado = !stateModalAddItensFiltro.chipSelecionado;
};

const itensFiltrados = computed(() => {
  if (stateModalAddItensFiltro.mostrarSomenteSelecionados) {
    // Exibe apenas os itens selecionados
    return stateModalAddItensFiltro.produtosSelecionadosDetalhes;
  }
  return stateModalAddItensFiltro.dadosRetornadosDaPesquisa;
});

watch(
  () => stateModalAddItensFiltro.produtosSelecionados,
  (novosSelecionados) => {
    // Adiciona os novos itens selecionados aos produtos selecionados
    novosSelecionados.forEach((id) => {
      // Verifica se o produto com o ID já não está na lista de detalhes
      if (!stateModalAddItensFiltro.produtosSelecionadosDetalhes.some((item) => item.COD_PRODUTO === id)) {
        // Busca o produto completo com base no ID selecionado
        const item = stateModalAddItensFiltro.dadosRetornadosDaPesquisa.find((item) => item.COD_PRODUTO === id);
        if (item) {
          // Adiciona o produto à lista de detalhes
          stateModalAddItensFiltro.produtosSelecionadosDetalhes.push(item);
        }
      }
    });

    // Remove os itens desmarcados dos detalhes dos produtos selecionados
    stateModalAddItensFiltro.produtosSelecionadosDetalhes =
      stateModalAddItensFiltro.produtosSelecionadosDetalhes.filter((item) =>
        stateModalAddItensFiltro.produtosSelecionados.includes(item.COD_PRODUTO)
      );
  }
);

onMounted(async () => {
  actions.init();
  actions.iniciarStates();
});

onUnmounted(() => {
  actions.resetStates();
});
</script>
<template>
  <v-container>
    <v-card
      class="pa-5"
      style="width: 940px; height: 515px; margin: 0 auto"
    >
      <div style="display: flex; gap: 10px; padding-bottom: 10px">
        <v-autocomplete
          id="carros"
          label="Carros"
          class="carros"
          :items="stateModalAddItensFiltro.carros"
          item-title="DESCRICAO"
          item-value="ID_CARRO"
          autocomplete="off"
          max-width="160px"
          :clearable="true"
          multiple
          chips
          v-model="stateModalAddItensFiltro.carroSelecionado"
          :menu-props="{ maxHeight: '300px', maxWidth: '160px', teleport: 'body', closeOnContentClick: false }"
        >
        </v-autocomplete>
        <v-autocomplete
          id="marcas"
          label="Marcas"
          class="marcas"
          max-width="160px"
          autocomplete="off"
          :items="stateModalAddItensFiltro.marcas"
          item-title="DESCRICAO"
          item-value="ID_MARCA"
          :clearable="true"
          multiple
          chips
          v-model="stateModalAddItensFiltro.marcaSelecionada"
          :menu-props="{
            maxHeight: '300px',
            maxWidth: '160px',
            teleport: 'body',
            closeOnContentClick: false,
          }"
        ></v-autocomplete>
        <v-text-field
          id="endEstoque"
          label="End. Estoque"
          class="endEstoque"
          autocomplete="off"
          item-title="title"
          item-value="value"
          :clearable="false"
          @keypress.enter="actions.buscarDadosParaFiltro"
          v-model="stateModalAddItensFiltro.endEstoque"
        ></v-text-field>

        <v-text-field
          id="numFabricante"
          class="numFabricante"
          autocomplete="off"
          label="Num. Fabricante"
          :clearable="false"
          @keypress.enter="actions.buscarDadosParaFiltro"
          v-model="stateModalAddItensFiltro.numFabricante"
        ></v-text-field>

        <v-text-field
          id="descricaoProduto"
          class="descricaoProduto"
          autocomplete="off"
          label="Descrição"
          :clearable="false"
          @keypress.enter="actions.buscarDadosParaFiltro"
          v-model="stateModalAddItensFiltro.descricaoProduto"
        ></v-text-field>
        <v-btn
          color="primary"
          icon="mdi-magnify"
          size="36px"
          @click="actions.buscarDadosParaFiltro"
        >
        </v-btn>
      </div>

      <v-card>
        <v-card-text>
          <v-data-table
            :headers="stateModalAddItensFiltro.headers"
            items-per-page-text="Itens por página"
            items-per-page="50"
            height="350"
            fixed-header
            :items="itensFiltrados"
            item-key="COD_PRODUTO"
            item-value="COD_PRODUTO"
            :row-props="actions.getClassCorLinha"
            v-model="stateModalAddItensFiltro.produtosSelecionados"
            show-select
            select-strategy="all"
          >
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

        <div
          class="d-flex justify-start pa-2 btns"
          style="margin-top: -65px"
          ><v-chip
            :class="{
              'chip-selecionado': stateModalAddItensFiltro.chipSelecionado,
            }"
            :color="stateModalAddItensFiltro.chipSelecionado ? 'green' : 'primary'"
            @click="filtrarSelecionados"
            >{{ stateModalAddItensFiltro.produtosSelecionados.length }} selecionados</v-chip
          ></div
        >

        <div
          class="d-flex justify-end pa-2 btns"
          style="margin-top: -45px"
        >
          <v-btn
            variant="outlined"
            color="primary"
            @click="actions.cancelar"
            >Cancelar</v-btn
          >
          <v-btn
            class="ml-2"
            color="primary"
            @click="actions.confirmarSelecionados"
            >Salvar</v-btn
          >
        </div>
      </v-card>
    </v-card>
  </v-container>
  <v-overlay
    :model-value="stateModalAddItensFiltro.loading"
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

<style>
.cor-zebrada-1 {
  background-color: #f0f0f0;
}

.v-overlay__scrim {
  background-color: black;
}

.v-data-table-footer__pagination {
  padding-right: 100px;
}
</style>

<style scoped>
.carros,
.marcas {
  max-height: 50px;
  overflow-y: auto;
  white-space: nowrap;
}

.chip-selecionado {
  border: 2px solid green;
}
</style>
