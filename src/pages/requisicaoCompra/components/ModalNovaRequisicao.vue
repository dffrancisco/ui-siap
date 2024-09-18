<script lang="ts" setup>
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import { onMounted, onUnmounted, reactive } from "vue";
import { iGetFavorecidosParam, iFavorecido } from "../interfaces";
import serviceRequisicaoCompra from "../services/requisicaoCompra.service";
import Swal from "sweetalert2";
import { useEventListener } from "@vueuse/core";

const emit = defineEmits(["closeModal", "selecionarFavorecido"]);

const state = reactive({
  gridFavorecidos: <ixGridCreate>{},
  loading: false,
  inputSearch: <HTMLInputElement>null,
});

const actions = {
  async init() {
    actions.criarGrid();
    state.inputSearch = <HTMLInputElement>document.getElementById("inputSearch");

    state.gridFavorecidos.queryOpen(
      {
        search: "",
      },
      () => state.inputSearch.focus()
    );
  },

  criarGrid() {
    state.gridFavorecidos = new xGridV2.create({
      el: "#gridFavorecidos",
      count: true,
      height: "310px",
      columns: {
        CNPJ: { dataField: "CNPJ_FAVORECIDO", center: true, width: "20%" },
        "Razão Social": { dataField: "NOME_FAVORECIDO", style: "text-transform: uppercase; text-align: left" },
      },
      query: {
        async execute(rs) {
          let data = await actions.getFavorecidos(rs.param as iGetFavorecidosParam, rs.offset);
          state.gridFavorecidos.querySourceAdd(data);
        },
      },
      dblClick: actions.selecionarFavorecido,
      enter: actions.selecionarFavorecido,
    });
  },

  async search() {
    state.gridFavorecidos.queryOpen({
      search: state.inputSearch.value,
    });
  },

  async getFavorecidos(param: iGetFavorecidosParam, offset: number) {
    try {
      state.loading = true;

      const data = await serviceRequisicaoCompra.getFavorecidos(param, offset);

      return data;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Ocorreu um erro ao buscar os favorecidos",
        text: error.message,
      });
    } finally {
      state.loading = false;
    }
  },

  selecionarFavorecido() {
    const favorecido = state.gridFavorecidos.dataSource() as iFavorecido;

    if (!favorecido) {
      Swal.fire({
        icon: "warning",
        title: "Nenhum item foi selecionado",
      });
      return;
    }

    emit("selecionarFavorecido", favorecido.ID_FAVORECIDO);
  },

  closeModal() {
    emit("closeModal");
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
    <div class="d-flex ga-2 align-center">
      <v-text-field
        id="inputSearch"
        label="F1 - Pesquisar (NOME / CNPJ)"
        @keydown.enter="actions.search"
        @keydown.arrow.down.prevent="state.gridFavorecidos.focus()"
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
      id="gridFavorecidos"
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
        @click="actions.selecionarFavorecido"
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
