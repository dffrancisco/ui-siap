<script setup lang="ts">
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import moment from "moment";
import { onMounted, reactive, watch } from "vue";
import serviceFornecedores from "../services/fornecedores.service";
import Swal from "sweetalert2";
import { iRepresentantes, iParamGetRepresentante } from "../interfaces";

const props = defineProps({
  dataLimite: {
    type: String,
    default: moment().format("YYYY-MM-DD"),
  },
});

const emits = defineEmits(["cancelar", "selecionarRepresentante"]);

const state = reactive({
  gridRepresentante: <ixGridCreate>{},
  loading: false,
  edtSearch: "",
  selectedName: "",
  dbRepresentante: <iRepresentantes>{},
});

const actions = {
  async init() {
    actions.criarGrid();
  },

  criarGrid() {
    state.gridRepresentante = new xGridV2.create({
      el: "#gridRepresentante",
      count: true,
      height: 300,
      columns: {
        Nome: { dataField: "NOME" },
        Email: { dataField: "EMAIL" },
        Telefone: { dataField: "TELEFONE", center: true },
      },
      query: {
        async execute(rs) {
          const data = await actions.getRepresentantes(rs.param as iParamGetRepresentante, rs.offset);
          state.gridRepresentante.querySourceAdd(data);
        },
      },
      sideBySide: {
        el: "#representanteCampos",
        vModel(r) {
          state.selectedName = r.NOME;
        },
      },
      enter: () => actions.selecionarRepresentante(),
      dblClick: () => actions.selecionarRepresentante(),
    });
  },

  closeModal() {
    emits("cancelar");
  },

  async getRepresentantes(param: iParamGetRepresentante, offset: number) {
    try {
      state.loading = true;

      const data = await serviceFornecedores.getRepresentantes(param, offset);

      return data?.map((item: any) => ({
        NOME: item.NOME,
        EMAIL: item.EMAIL,
        TELEFONE: item.TELEFONE,
      }));
    } catch (error) {
      Swal.fire({
        text: "Erro ao buscar os representantes",
        icon: "error",
      });
      return [];
    } finally {
      state.loading = false;
    }
  },

  async btnSearch() {
    const searchValue = state.edtSearch.trim();

    if (!searchValue) {
      Swal.fire({
        text: "Por favor, digite um termo para buscar",
        icon: "warning",
      });
      return;
    }

    state.gridRepresentante.queryOpen({
      NOME: searchValue.toUpperCase(),
    });
  },

  async search() {
    const searchValue = state.edtSearch?.toUpperCase();
    state.gridRepresentante.queryOpen({
      RAZAO_SOCIAL: searchValue,
    });
  },

  selecionarRepresentante() {
    const representanteSelecionado: iRepresentantes = state.gridRepresentante.dataSource();

    if (!representanteSelecionado) {
      Swal.fire({
        text: "Nenhum representante foi selecionado",
        icon: "warning",
      });
      return false;
    }

    emits("selecionarRepresentante", representanteSelecionado);
  },
};

onMounted(async () => {
  await actions.init();

  state.gridRepresentante.queryOpen({});
});
</script>

<template>
  <v-card class="pa-4 d-flex flex-grow-1">
    <div id="representanteCampos">
      <div class="d-flex ga-4">
        <v-text-field
          v-model="state.selectedName"
          type="text"
          placeholder="Digite o nome do representante"
          density="compact"
          @keydown.enter.prevent="actions.btnSearch"
          @keydown.arrow.down.prevent="state.gridRepresentante.focus()"
        />
        <div class="d-flex align-center">
          <v-btn
            icon="mdi-magnify"
            size="34"
            color="primary"
            @click="actions.btnSearch"
          />
        </div>
      </div>

      <div
        class="mt-4"
        id="gridRepresentante"
      ></div>

      <div class="d-flex justify-end ga-4 mt-4">
        <v-btn
          color="primary"
          variant="outlined"
          @click="actions.closeModal"
          >Cancelar</v-btn
        >
        <v-btn
          @click="actions.selecionarRepresentante"
          color="primary"
          >Selecionar</v-btn
        >
      </div>
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
