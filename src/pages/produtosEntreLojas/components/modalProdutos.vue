<script lang="ts" setup>
import { onMounted, reactive, computed } from "vue";
import serviceProdutosEntreLojas from "../services/produtosEntreLojas.service";
import { iProdutoDetalhes } from "../interfaces";
import Swal from "sweetalert2";
import utils, { iColumnPrint, dataBrasil, formatValor } from "@/ts/utils";

const emits = defineEmits(["closeModal", "selecionar"]);

const state = reactive({
  loading: false,
  dbDetalheProdutos: <iProdutoDetalhes>{},
  dbDetalheProdutosGet: [] as iProdutoDetalhes[],
  dadosRelatorio: [] as iProdutoDetalhes[],
  itensProdutos: [] as iProdutoDetalhes[],
  dataInicioImpressao: null,
  dataFimImpressao: null,
  headers: <any>[
    { key: "NUM_FABRICANTE", title: "Nº Fabricante", sortable: true, align: "left" },
    { key: "DESC_PRODUTO", title: "Descrição", sortable: true, align: "left" },
    { key: "QTD", title: "QUANTIDADE", sortable: true, align: "left" },
    { key: "VALOR", title: "Valor", sortable: true, align: "left" },
  ],
});

const actions = {
  async init() {},

  closeModal() {
    emits("closeModal");
  },

  async carregarDadosCompletos() {
    try {
      state.loading = true;
      const param = computedParamsOrcamento.value;

      if (!param) return;

      const { cabecalho, itens } = await serviceProdutosEntreLojas.getOrcamentoCompleto(param);

      state.dbDetalheOrçamento = cabecalho;
      state.dadosRelatorio = itens;
      state.itensOrcamento = itens;
    } catch (error) {
      Swal.fire({
        text: "Erro ao carregar dados do orçamento",
        icon: "error",
      });
    } finally {
      state.loading = false;
    }
  },

  async onClickImprimirModal() {
    try {
      let relatorio = state.dadosRelatorio;
      const relatorioFormatado = actions.formatarDadosImpressao([...relatorio]);

      const columns: iColumnPrint[] = [
        { key: "NUM_FABRICANTE", label: "Fabricante", align: "left", width: "80px" },
        { key: "DESC_PRODUTO", label: "Descrição", align: "left" },
        { key: "QTD", label: "UN.", align: "left" },
        { key: "VALOR", label: "Valor", align: "left" },
      ];

      const titulo = `
                    <div style="display: flex; justify-content: space-between; width: 100%; margin-top: 10px">
                        <span>Dados detalhados do Orçamento:
                `;

      await utils.printComCabecalho(columns, relatorioFormatado, titulo);
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Erro ao imprimir o relatório.",
      });
    } finally {
      state.loading = false;
    }
  },

  formatarDadosImpressao(data) {
    return data.map((item) => ({
      ...item,
      VALOR: item.VALOR ? utils.formatValor(item.VALOR) : "-----",
    }));
  },
};

onMounted(async () => {
  await actions.init();
  await actions.carregarDadosCompletos();
});
</script>
<template>
  <v-container>
    <v-card
      class="pa-5 ma-auto"
      :max-width="900"
      :max-height="600"
    >
      <v-data-table-virtual
        id="tabelaValePeças"
        class="pt-5"
        :items="state.dadosRelatorio"
        :headers="state.headers"
        height="310px"
        fixed-header
      ></v-data-table-virtual>

      <v-row class="mt-4 justify-end">
        <v-col cols="auto">
          <v-btn
            color="primary"
            @click="actions.onClickImprimirModal"
            :disabled="state.dadosRelatorio.length === 0"
            icon
            size="36px"
            style="min-width: 36px"
          >
            <v-icon>mdi-printer</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn
            color="primary"
            @click="actions.closeModal"
          >
            Fechar
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <div id="pnCodigoTela">consultaValePeças</div>

    <v-overlay
      :model-value="state.loading"
      class="d-flex align-center justify-center"
    >
      <v-progress-circular
        color="primary"
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<style>
#tabelaValePeças .v-data-table-footer {
  max-height: 2px;
  padding-top: 20px;
}
#tabelaValePeças .v-data-table-footer__pagination {
  padding-right: 50px;
}

.cor-zebrada-1 {
  background-color: #f0f0f0;
}
.v-col {
  padding: 8px;
}
</style>
