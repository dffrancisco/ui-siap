<script lang="ts" setup>
import Loading from "@/components/Loading.vue";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import Swal from "sweetalert2";
import { onMounted, reactive } from "vue";
import produtosEntreLojasService from "../services/produtosEntreLojas.service";
import { iFilterSearch, iLoja, iLojaFormatada } from "../interfaces";
import utils from "@/ts/utils";

const props = defineProps({
  lojaOrigem: {
    type: Object as () => iLoja,
  },
  filterSearch: {
    type: Object as () => iFilterSearch,
  },
  loja: {
    type: Object as () => iLojaFormatada,
  },
  codProduto: {
    type: Number,
  },
});

const emits = defineEmits(["closeModal"]);

const state = reactive({
  loading: false,
  gridOrcamentos: <ixGridCreate>{},
});

const actions = {
  async init() {
    await actions.criarGrid();
    await actions.getOrcamentosProdutoEntreLojas();
  },

  async criarGrid() {
    state.gridOrcamentos = new xGridV2.create({
      el: "#gridOrcamentos",
      count: true,
      height: 300,
      columns: {
        "N° Orçamento": { dataField: "NUM_ORCAMENTO", center: true },
        Data: { dataField: "DATA", center: true, render: utils.dataBrasil },
        Quantidade: { dataField: "QTO", center: true },
      },
    });
  },

  async getOrcamentosProdutoEntreLojas() {
    try {
      state.loading = true;

      let data = await produtosEntreLojasService.getOrcamentosProdutoEntreLojas(
        {
          ANO: props.filterSearch.ano,
          CNPJ: props.lojaOrigem.CGC_CLIENTE,
          COD_PRODUTO: props.codProduto,
          MES: props.filterSearch.mes,
        },
        props.loja.ID_SOCIEDADE
      );

      if (data[0]?.error) {
        Swal.fire({
          icon: "warning",
          title: data[0].msg,
        });

        emits("closeModal");

        return;
      }

      state.gridOrcamentos.source(data);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error ao buscar os orçamentos na loja.",
      });
      emits("closeModal");
    } finally {
      state.loading = false;
    }
  },
};

onMounted(async () => {
  await actions.init();
});
</script>

<template>
  <v-card>
    <div>
      <v-card-title class="d-flex justify-space-between">
        <span>{{ props.lojaOrigem.NOME }} - ORÇAMENTOS ({{ props.loja.LOJA }})</span>
        <v-icon @click="emits('closeModal')">mdi-close</v-icon>
      </v-card-title>
    </div>

    <v-divider></v-divider>

    <div class="pa-4">
      <div id="gridOrcamentos"></div>

      <div class="d-flex mt-4 ga-2 justify-end align-end flex-grow-1">
        <v-btn
          color="primary"
          variant="outlined"
          @click="emits('closeModal')"
          >fechar</v-btn
        >
        <v-btn color="primary"><v-icon class="mr-2">mdi-printer</v-icon>imprimir</v-btn>
      </div>
    </div>
  </v-card>

  <Loading :loading="state.loading" />
</template>
