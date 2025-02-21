<script lang="ts" setup>
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import { onMounted, reactive, ref } from "vue";
import serviceConsultaValePeças from "./services/consultaValePeças.service";
import { iParamsValePeca } from "./interfaces";
import Swal from "sweetalert2";
const emits = defineEmits(["closeModalConsultaValePeças", "ConsultaValePeças"]);
const inputSearch = ref();

const state = reactive({
  loading: false,
  gridConsultaValePeças: <ixGridCreate>{},
  dbDetalheOrçamento: <iParamsValePeca>{},
});

const actions = {
  async init() {
    actions.criarGrid();
  },

  criarGrid() {
    state.gridConsultaValePeças = new xGridV2.create({
      el: "#gridConsultaValePeças",
      count: true,
      height: 300,
      columns: {
        NºFabricante: { dataField: "CGC_CLIENTE", width: "18%" },
        Descrição: { dataField: "NOME", width: "45%" },
        UN: { dataField: "UNIDADE" },
        Carro: { dataField: "CARRO" },
        QT: { dataField: "QUANTIDADE" },
        Valor: { dataField: "VALOR" },
        Total: { dataField: "SUB_TOTAL" },
      },
      query: {
        async execute(rs) {
          let data = await actions.getConsultaValePeça(rs.param as iParamsValePeca, rs.offset);
          state.gridConsultaValePeças.querySourceAdd(data);
        },
      },
      enter: () => actions.validarInputs(),
      dblClick: () => actions.validarInputs(),
    });
  },

  closeModalConsultaValePeças() {
    emits("closeModalConsultaValePeças");
  },

  async getConsultaValePeça(param: iParamsValePeca, offset: number) {
    try {
      state.loading = true;

      const data = await serviceConsultaValePeças.getConsultaValePeça(param, offset);
      return data;
    } catch (error) {
      Swal.fire({
        text: "Erro ao buscar os clientes",
        icon: "error",
      });
    } finally {
      state.loading = false;
    }
  },

  async Search() {
    state.gridConsultaValePeças.queryOpen({
      search: inputSearch.value.value,
    });
  },

  validarInputs() {
    if (!state.gridConsultaValePeças.dataSource()) {
      Swal.fire({
        text: "Nenhum cliente foi selecionado",
        icon: "warning",
      });
      return false;
    }

    actions.ConsultaValePeças();
  },

  ConsultaValePeças() {
    const clienteSelecionado = state.gridConsultaValePeças.dataSource();
    emits("ConsultaValePeças", clienteSelecionado);
    actions.closeModalConsultaValePeças();
  },
};

onMounted(async () => {
  await actions.init();

  state.gridConsultaValePeças.queryOpen(
    {
      search: "",
    },
    () => {
      inputSearch.value.focus();
    }
  );
});
</script>
<template
  ><v-card class="pa-4">
    <v-row>
      <v-col>
        <div class="d-flex ga-2">
          <v-text-field
            label="Razão social / CNPJ"
            :clearable="true"
            width="300px"
            density="compact"
            autofocus
            ref="inputSearch"
            @keydown.enter.prevent="actions.Search"
            @keydown.arrow.down.prevent="state.gridConsultaValePeças.focus()"
          ></v-text-field>

          <div class="d-flex align-center">
            <v-btn
              icon="mdi-magnify"
              size="39"
              color="primary"
              @click="actions.Search"
            />
          </div>
        </div>
      </v-col>
    </v-row>
    <div
      class="mt-4"
      id="gridConsultaValePeças"
    ></div>
    <div class="d-flex justify-end ga-4 mt-4">
      <v-btn
        color="primary"
        variant="outlined"
        @click="actions.closeModalConsultaValePeças;"
        >cancelar</v-btn
      >
      <v-btn
        @click="actions.validarInputs"
        color="primary"
        >ConsultaValePeças</v-btn
      >
    </div>
  </v-card>
</template>
