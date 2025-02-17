<script lang="ts" setup>
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import { onMounted, reactive, ref } from "vue";
import {} from "../interfaces";
import serviceCliente from "../services/baixaManualBoleto.service";
import Swal from "sweetalert2";
import { iBoleto } from "@/pages/faturarCliente/interfaces";
const emits = defineEmits(["closeModalBoleto", "selecionarBoleto"]);
const inputSearch = ref();

const state = reactive({
  loading: false,
  gridBoleto: <ixGridCreate>{},
  dbBoleto: <iBoleto>{},
});

const actions = {
  async init() {
    actions.criarGrid();
  },

  criarGrid() {
    state.gridBoleto = new xGridV2.create({
      el: "#gridBoleto",
      count: true,
      height: 300,
      columns: {
        CNPJ: { dataField: "CGC_CLIENTE", width: "18%" },
        Nome: { dataField: "NOME", width: "45%" },
        Endereço: { dataField: "ENDERECO" },
      },
      query: {
        async execute(rs) {
          let data = await actions.getBoleto(rs.param as iGetBoleto, rs.offset);
          state.gridBoleto.querySourceAdd(data);
        },
      },
      enter: () => actions.validarInputs(),
      dblClick: () => actions.validarInputs(),
    });
  },

  closeModalBoleto() {
    emits("closeModalBoleto");
  },

  async getBoleto(param: iGetBoleto, offset: number) {
    try {
      state.loading = true;

      const data = await serviceCliente.getBoleto(param, offset);
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

  async btnSearch() {
    state.gridBoleto.queryOpen({
      search: inputSearch.value.value,
    });
  },

  validarInputs() {
    if (!state.gridBoleto.dataSource()) {
      Swal.fire({
        text: "Nenhum cliente foi selecionado",
        icon: "warning",
      });
      return false;
    }

    actions.selecionarBoleto();
  },

  selecionarBoleto() {
    const boletoSelecionado = state.gridBoleto.dataSource();
    emits("selecionarBoleto", boletoSelecionado);
    actions.closeModalBoleto();
  },
};

onMounted(async () => {
  await actions.init();

  state.gridBoleto.queryOpen(
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
            @keydown.enter.prevent="actions.btnSearch"
            @keydown.arrow.down.prevent="state.gridBoleto.focus()"
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
      id="gridBoleto"
    ></div>
    <div class="d-flex justify-end ga-4 mt-4">
      <v-btn
        color="primary"
        variant="outlined"
        @click="actions.closeModalBoleto"
        >cancelar</v-btn
      >
      <v-btn
        @click="actions.validarInputs"
        color="primary"
        >selecionar</v-btn
      >
    </div>
  </v-card>
</template>
