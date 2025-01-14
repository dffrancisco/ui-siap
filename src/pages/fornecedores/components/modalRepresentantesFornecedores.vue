<script lang="ts" setup>
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import { onMounted, reactive, ref } from "vue";
import { iRepresentantes } from "../interfaces";
import serviceFornecedores from "../services/fornecedores.service";
import Swal from "sweetalert2";

const emits = defineEmits(["cancelar", "selecionarRepresentante"]);
const inputSearch = ref();

const state = reactive({
  loading: false,
  gridRepresentante: <ixGridCreate>{},
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
          const data = await actions.getRepresentantes(rs.param as iRepresentantes, rs.offset);
          state.gridRepresentante.querySourceAdd(data);
        },
      },
      enter: () => actions.validarInputs(),
      dblClick: () => actions.validarInputs(),
    });
  },

  async getRepresentantes(param: iRepresentantes, offset: number) {
    try {
      state.loading = true;
      console.log("Iniciando busca de representantes com parâmetros:", param, "Offset:", offset);
      const data = await serviceFornecedores.getRepresentantes(param, offset);

      return (
        data?.map((item: any) => ({
          NOME: item.NOME,
          EMAIL: item.EMAIL,
          TELEFONE: item.TELEFONE,
        })) || []
      );
    } catch (error) {
      console.error("Erro ao buscar representantes:", error);
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
    const searchValue = inputSearch.value.value.toUpperCase();
    console.log("Valor de busca:", searchValue);

    if (!searchValue) {
      Swal.fire({
        text: "Digite um nome, email ou telefone para realizar a busca.",
        icon: "warning",
      });
      return;
    }

    try {
      state.loading = true;

      const data = await actions.getRepresentantes({ NOME: searchValue } as iRepresentantes, 0);
      console.log("Resultado da busca:", data);

      if (data.length === 0) {
        Swal.fire({
          text: "Nenhum representante encontrado.",
          icon: "info",
        });
      }

      state.gridRepresentante.querySourceAdd(data);
    } catch (error) {
      Swal.fire({
        text: "Erro ao realizar a busca.",
        icon: "error",
      });
    } finally {
      state.loading = false;
    }
  },

  validarInputs() {
    const representanteSelecionado = state.gridRepresentante.dataSource();
    if (!representanteSelecionado) {
      Swal.fire({
        text: "Nenhum representante foi selecionado.",
        icon: "warning",
      });
      return false;
    }

    actions.selecionarRepresentante();
  },

  selecionarRepresentante() {
    const representanteSelecionado = state.gridRepresentante.dataSource();
    emits("selecionarRepresentante", representanteSelecionado);
    actions.closeModal();
  },

  closeModal() {
    emits("cancelar");
  },
};

onMounted(async () => {
  await actions.init();

  state.gridRepresentante.queryOpen(
    {
      NOME: "",
    },
    () => {
      inputSearch.value?.focus();
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
            @keydown.arrow.down.prevent="state.gridRepresentante.focus()"
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
        @click="actions.validarInputs"
        color="primary"
        >Selecionar</v-btn
      >
    </div>
  </v-card>
</template>
