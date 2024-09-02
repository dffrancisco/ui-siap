<script setup lang="ts">
import { onMounted, onUnmounted, reactive } from "vue";
import serviceFiltro from "../services/filtro.service";
import { iCarros, iFuncionario, iMarcas, iParamFiltrar, iResultPesquisa } from "../interfaces";
import Swal from "sweetalert2";

const stateModalAddItensFiltro = reactive({
  loading: false,
  search: "",
  nomeFiltro: "",
  idFiltro: 0,
  funcionarios: <iFuncionario[]>[],
  funcionarioSelecionado: "",
  carros: <iCarros[]>[],
  carroSelecionado: <iCarros[]>[],
  marcaSelecionada: <iMarcas[]>[],
  marcas: <iMarcas[]>[],
  dadosRetornadosDaPesquisa: <iResultPesquisa[]>[],
  produtosSelecionados: <number[]>[],
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
    try {
      stateModalAddItensFiltro.loading = true;

      const carros = await serviceFiltro.getCarros();
      const marcas = await serviceFiltro.getMarcas();
      const funcionarios = await serviceFiltro.getFuncionarios();

      stateModalAddItensFiltro.funcionarios = funcionarios;
      stateModalAddItensFiltro.carros = carros;
      stateModalAddItensFiltro.marcas = marcas;
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Erro ao trazer os dados!",
      });
    } finally {
      stateModalAddItensFiltro.loading = false;
    }
  },

  iniciarStates() {
    stateModalAddItensFiltro.nomeFiltro = props.nomeFiltro;
    stateModalAddItensFiltro.idFiltro = props.idFiltro;
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
    emit("closeModalAddItensFiltro");
    actions.resetStates();
  },

  confirmarSelecionados() {
    if (stateModalAddItensFiltro.produtosSelecionados.length == 0) {
      Swal.fire({
        icon: "warning",
        text: "Escolha ao menos um item pro filtro!",
      });
      return;
    }

    //verificar se tem funcionario conferente
    if (stateModalAddItensFiltro.funcionarioSelecionado) {
      let parametrosInsercao = {
        idFiltro: stateModalAddItensFiltro.idFiltro,
        nomeFiltro: stateModalAddItensFiltro.nomeFiltro,
        funcionario: stateModalAddItensFiltro.funcionarioSelecionado,
        objPesquisa: stateModalAddItensFiltro.paramsPesquisa,
        produtosSelecionados: stateModalAddItensFiltro.produtosSelecionados,
      };

      if (stateModalAddItensFiltro.idFiltro == 0) {
        actions.inserirFiltro(parametrosInsercao);
      } else {
        actions.atualizarFiltro(parametrosInsercao);
      }
      // se nao tiver conferente focar no input
    } else {
      const inputFuncionario = document.querySelector("#funcionarios") as HTMLElement;
      if (inputFuncionario) {
        inputFuncionario.focus();
      }
    }
  },

  async atualizarFiltro(parametrosInsercao) {
    try {
      stateModalAddItensFiltro.loading = true;
      await serviceFiltro.atualizarFiltro(parametrosInsercao);
      Swal.fire({ icon: "success", text: "Dados salvos com sucesso!", timer: 1500 });
      actions.cancelar();
    } catch {
      Swal.fire({ icon: "error", text: "Erro ao salvar os dados!" });
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
      actions.cancelar();
    } catch {
      Swal.fire({
        icon: "error",
        text: "Erro ao salvar os dados!",
      });
    } finally {
      stateModalAddItensFiltro.loading = false;
    }
  },
};

const props = defineProps({
  nomeFiltro: {
    type: String,
    required: true,
  },
  idFiltro: {
    type: Number,
    required: true,
  },
  conferente: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["closeModalAddItensFiltro"]);

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
      style="width: 900px; margin: 0 auto"
    >
      <div style="display: flex; gap: 16px; padding-bottom: 10px">
        <v-autocomplete
          id="carros"
          label="Carros"
          class="carros"
          :items="stateModalAddItensFiltro.carros"
          item-title="DESCRICAO"
          item-value="ID_CARRO"
          autocomplete="off"
          :clearable="true"
          multiple
          v-model="stateModalAddItensFiltro.carroSelecionado"
        ></v-autocomplete>
        <v-autocomplete
          id="marcas"
          label="Marcas"
          class="marcas"
          autocomplete="off"
          :items="stateModalAddItensFiltro.marcas"
          item-title="DESCRICAO"
          item-value="ID_MARCA"
          :clearable="true"
          multiple
          v-model="stateModalAddItensFiltro.marcaSelecionada"
        ></v-autocomplete>
        <v-text-field
          id="endEstoque"
          label="End. Estoque"
          class="endEstoque"
          autocomplete="off"
          item-title="title"
          item-value="value"
          :clearable="true"
          v-model="stateModalAddItensFiltro.endEstoque"
        ></v-text-field>

        <v-text-field
          id="numFabricante"
          class="numFabricante"
          autocomplete="off"
          label="Num. Fabricante"
          :clearable="true"
          v-model="stateModalAddItensFiltro.numFabricante"
        ></v-text-field>

        <v-text-field
          id="descricaoProduto"
          class="descricaoProduto"
          autocomplete="off"
          label="Descrição"
          :clearable="true"
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
            height="370"
            fixed-header
            :items="stateModalAddItensFiltro.dadosRetornadosDaPesquisa"
            item-key="COD_PRODUTO"
            item-value="COD_PRODUTO"
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
        <div style="display: flex">
          <v-chip
            style="max-width: 230px; margin-left: 10px; margin-top: -50px"
            color="primary"
            >Nome do Filtro: {{ stateModalAddItensFiltro.nomeFiltro }}</v-chip
          >
        </div>
        <div>
          <v-autocomplete
            id="funcionarios"
            label="Funcionario Conferente"
            class="funcionarios"
            :items="stateModalAddItensFiltro.funcionarios"
            item-title="LOGIN"
            item-value="COD_FUNCIONARIO"
            style="max-width: 280px; margin-left: 10px"
            autocomplete="off"
            :clearable="true"
            v-model="stateModalAddItensFiltro.funcionarioSelecionado"
          ></v-autocomplete>
        </div>

        <div
          class="d-flex justify-end pa-2"
          style="margin-top: -40px"
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

<style scoped></style>
