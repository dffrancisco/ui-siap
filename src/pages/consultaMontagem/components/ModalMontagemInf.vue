<script lang="ts" setup>
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import Swal from "sweetalert2";
import { nextTick, reactive, watch } from "vue";
import serviceConsultaMontagem from "../services/consutaMontagem.service";
import { iParamGetMontagemInf, iParamGetDevolucaoInf } from "../interfaces";
import utils from "@/ts/utils";

const props = defineProps<{
  modalOpened: boolean;
  dataInicio: string | null;
  dataFim: string | null;
  id_montador: number | null;
}>();

watch(
  () => props.modalOpened,
  () => {
    if (props.modalOpened) {
      state.gridMontagens.queryOpen(
        { dataInicio: props.dataInicio, dataFim: props.dataFim, ID_MONTADOR: props.id_montador },
        () => {}
      );
      state.gridDevolucoes.queryOpen(
        { dataInicio: props.dataInicio, dataFim: props.dataFim, ID_MONTADOR: props.id_montador },
        () => {}
      );
    }
  }
);

const state = reactive({
  gridMontagens: <ixGridCreate>{},
  gridDevolucoes: <ixGridCreate>{},

  loading: false,
});

const actions = {
  criarGrids() {
    state.gridMontagens = new xGridV2.create({
      el: "#gridMontagens",
      height: 250,
      width: 420,
      count: false,
      columns: {
        Valor: { dataField: "VALOR", render: utils.formatValor, center: true },
        Data: { dataField: "DATA", render: utils.dataBrasil, center: true },
        "N° Orçamento": { dataField: "NUM_ORCAMENTO", center: true },
        Placa: { dataField: "PLACA", center: true },
        Vendedor: { dataField: "VENDEDOR", width: "30%" },
      },
      query: {
        async execute(rs) {
          let data = await actions.getMontagemInf({
            offset: rs.offset,
            param: rs.param,
          });
          state.gridMontagens.querySourceAdd(data);
        },
      },
    });

    state.gridDevolucoes = new xGridV2.create({
      el: "#gridDevolucoes",
      height: 250,
      width: 420,
      count: false,
      columns: {
        "N° Orçamento": { dataField: "NUM_ORCAMENTO", center: true },
        Venda: { dataField: "DATA_VENDA", render: utils.dataBrasil, center: true },
        Valor: { dataField: "VALOR", render: utils.formatValor, center: true },
        Placa: { dataField: "PLACA", center: true },
        "Dt Dev": { dataField: "DATA", render: utils.dataBrasil, center: true },
      },
      query: {
        async execute(rs) {
          let data = await actions.getDevolucaoInf({
            offset: rs.offset,
            param: rs.param,
          });
          state.gridDevolucoes.querySourceAdd(data);
        },
      },
    });
  },

  async getMontagemInf({ param, offset }: iParamGetMontagemInf) {
    try {
      state.loading = true;
      const data = await serviceConsultaMontagem.getMontagemInf({ param, offset });
      state.loading = false;
      return data;
    } catch (error) {
      state.loading = false;
      Swal.fire({
        icon: "error",
        text: "Erro ao exibir as informações das montagens!",
      });
    }
  },

  async getDevolucaoInf({ param, offset }: iParamGetDevolucaoInf) {
    try {
      state.loading = true;
      const data = await serviceConsultaMontagem.getDevolucoesInf({ param, offset });
      state.loading = false;
      return data;
    } catch (error) {
      state.loading = false;
      Swal.fire({
        icon: "error",
        text: "Erro ao exibir as informações das devoluções!",
      });
    }
  },
};

nextTick(async () => {
  actions.criarGrids();
});
</script>

<template>
  <v-container>
    <v-row class="d-flex justify-center pb-5">
      <div class="mr-2">
        <span>Montagens</span>
        <div id="gridMontagens"> </div>
      </div>
      <div>
        <span>Devolução</span>
        <div id="gridDevolucoes"> </div>
      </div>
    </v-row>
    <div
      class="ss"
      style="height: 350px; width: 848px"
    ></div>

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
  </v-container>
</template>
