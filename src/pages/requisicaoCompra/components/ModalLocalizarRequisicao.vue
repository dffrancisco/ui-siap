<script lang="ts" setup>
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import { onMounted, onUnmounted, reactive } from "vue";
import { iGetRequisicaoComprasParam, iRequisicaoCompra } from "../interfaces";
import serviceRequisicaoCompra from "../services/requisicaoCompra.service";
import Swal from "sweetalert2";
import { useEventListener } from "@vueuse/core";
import utils from "@/ts/utils";

const emit = defineEmits(["closeModal", "selecionarRequisicaoCompra"]);

const state = reactive({
  gridRequisicaoCompra: <ixGridCreate>{},
  loading: false,
  inputSearch: <HTMLInputElement>null,
});

const actions = {
  async init() {
    actions.criarGrid();
    state.inputSearch = <HTMLInputElement>document.getElementById("inputSearch");

    state.gridRequisicaoCompra.queryOpen(
      {
        search: "",
      },
      () => state.inputSearch.focus()
    );
  },

  criarGrid() {
    state.gridRequisicaoCompra = new xGridV2.create({
      el: "#gridRequisicaoCompra",
      count: true,
      height: "310px",
      columns: {
        Data: { dataField: "DATA_HORA_CRIACAO", center: true, render: utils.dataBrasil, width: "15%" },
        "Razão Social": { dataField: "NOME_FAVORECIDO" },
        Valor: { dataField: "VALOR", right: true, width: "12%", render: utils.formatValor },
        Status: { dataField: "FINALIZADO", center: true, width: "18%", compare: "colorir" },
      },
      compare: {
        colorir: (r) => {
          if (r.FINALIZADO == "N") {
            return '<span style="color: red">' + "Em andamento" + "<span>";
          } else {
            return '<span style="color: green">' + "Finalizada" + "<span>";
          }
        },
      },
      query: {
        async execute(rs) {
          let data = await actions.getRequisicaoCompras(rs.param as iGetRequisicaoComprasParam, rs.offset);
          state.gridRequisicaoCompra.querySourceAdd(data);
        },
      },
      dblClick: actions.selecionarRequisicaoCompra,
      enter: actions.selecionarRequisicaoCompra,
    });
  },

  async search() {
    state.gridRequisicaoCompra.queryOpen({
      search: state.inputSearch.value,
    });
  },

  async selecionarRequisicaoCompra() {
    const requisicaoCompra = state.gridRequisicaoCompra.dataSource() as iRequisicaoCompra;

    if (!requisicaoCompra) {
      Swal.fire({
        icon: "warning",
        title: "Nenhum item foi selecionado",
      });
      return;
    }

    emit("selecionarRequisicaoCompra", requisicaoCompra);
  },

  closeModal() {
    emit("closeModal");
  },

  async getRequisicaoCompras(param: iGetRequisicaoComprasParam, offset: number) {
    try {
      state.loading = true;

      const data = await serviceRequisicaoCompra.getRequisicaoCompras(param, offset);

      return data;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Ocorreu um erro ao buscar as requisições",
        text: error.message,
      });
    } finally {
      state.loading = false;
    }
  },
};

onMounted(async () => {
  await actions.init();
});

const eventListener = useEventListener(document, "keydown", async (event) => {
  if (event.key === "F1") {
    state.inputSearch.select();
    event.preventDefault();
    event.stopPropagation();
  }
});

onUnmounted(() => {
  removeEventListener("keydown", eventListener);
});
</script>

<template>
  <v-card class="pa-4 d-flex flex-grow-1">
    <v-card-title style="color: #334155">Localizar Requisição</v-card-title>
    <div class="d-flex ga-2 align-center mt-2">
      <v-text-field
        id="inputSearch"
        label="F1 - Pesquisar (NOME / CNPJ)"
        @keydown.enter="actions.search"
        @keydown.arrow.down.prevent="state.gridRequisicaoCompra.focus()"
      ></v-text-field>
      <v-btn
        icon="mdi-magnify mdi-24px"
        color="primary"
        size="36"
        @click="actions.search"
      />
    </div>

    <div
      class="mt-4"
      id="gridRequisicaoCompra"
    >
    </div>

    <div class="mt-4 d-flex ga-4 justify-end">
      <v-btn
        color="primary"
        variant="outlined"
        @click="actions.closeModal"
        >fechar</v-btn
      >
      <v-btn
        color="primary"
        @click="actions.selecionarRequisicaoCompra"
        >selecionar</v-btn
      >
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
</template>
