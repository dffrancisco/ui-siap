<script lang="ts" setup>
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import { onMounted, reactive, ref } from "vue";
import { iSociedade, iParamGetSociedade } from "../interfaces";
import serviceSociedade from "../services/sociedade.service";
import Swal from "sweetalert2";

const emits = defineEmits(["cancelar", "selecionaSociedade"]);
const inputSearch = ref();

const state = reactive({
  loading: false,
  gridSociedade: <ixGridCreate>{},
  dbSociedade: <iSociedade>{},
});

const actions = {
  async init() {
    actions.criarGrid();
  },

  criarGrid() {
    state.gridSociedade = new xGridV2.create({
      el: "#gridSociedade",
      count: true,
      height: 300,
      columns: {
        Cliente: { dataField: "CLIENTE" },
        CNPJ: { dataField: "CNPJ" },
      },
      query: {
        async execute(rs) {
          let data = await actions.getSociedade();
          //state.gridSociedade.querySourceAdd(data);
        },
      },
      enter: () => actions.validarInputs(),
      dblClick: () => actions.validarInputs(),
    });
  },

  async getSociedade() {
    try {
      state.loading = true;
      //const data = await serviceSociedade.getSociedade();
      state.loading = false;
      //return data;
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Erro ao exibir registro de sociedade",
      });
    }
  },

  async btnSearch() {
    state.gridSociedade.queryOpen({
      search: inputSearch.value.value,
    });
  },

  validarInputs() {
    const sociedadeSelecionada = state.gridSociedade.dataSource();
    if (!sociedadeSelecionada) {
      Swal.fire({
        text: "Nenhum representante foi selecionado.",
        icon: "warning",
      });
      return false;
    }

    actions.selecionaSociedade();
  },

  selecionaSociedade() {
    const sociedadeSelecionada = state.gridSociedade.dataSource();
    emits("selecionaSociedade", sociedadeSelecionada);
    actions.closeModal();
  },

  closeModal() {
    emits("cancelar");
  },
};

onMounted(async () => {
  await actions.init();

  state.gridSociedade.queryOpen(
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
    <v-row>
      <v-col>
        <div class="d-flex ga-2">
          <v-text-field
            label="Nome"
            :clearable="true"
            width="300px"
            density="compact"
            autofocus
            ref="inputSearch"
            @keydown.enter.prevent="actions.btnSearch"
            @keydown.arrow.down.prevent="state.gridSociedade.focus()"
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
      id="gridSociedade"
    ></div>
    <div class="d-flex justify-end ga-4 mt-4">
      <v-btn
        color="primary"
        variant="outlined"
        @click="actions.closeModal"
        >Cancelar</v-btn
      >
      <v-btn
        @click="actions.validarInputs"
        color="primary"
        >Selecionar</v-btn
      >
    </div>
  </v-card>
</template>
