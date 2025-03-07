<script lang="ts" setup>
import { onMounted, reactive, computed } from "vue";
import moment from "moment";
import serviceConsultaValePecas from "../services/consultaValePecas.service";
import { iParamsItemOrcamento, iResponseOrcamento, iParamsValePeca } from "../interfaces";
import Swal from "sweetalert2";
import utils, { iColumnPrint, dataBrasil, formatValor } from "@/ts/utils";

const props = defineProps<{ selectedItem: iParamsValePeca }>();
const emits = defineEmits(["closeModalVale", "selecionarVale"]);

const state = reactive({
  loading: false,
  dbDetalheOrçamento: <iResponseOrcamento>{},
  dbDetalheOrcaçamentoGet: [] as iResponseOrcamento[],
  dadosRelatorio: [] as iParamsItemOrcamento[],
  itensOrcamento: [] as iParamsItemOrcamento[],
  dataInicioImpressao: null,
  dataFimImpressao: null,
  headers: <any>[
    { key: "NUM_FABRICANTE", title: "Nº Fabricante", sortable: true, align: "left" },
    { key: "DESC_PRODUTO", title: "Descrição", sortable: true, align: "left" },
    { key: "UNIDADE", title: "UN", sortable: true, align: "left" },
    { key: "DESCRICAO", title: "Carro", sortable: true, align: "left" },
    { key: "QTO", title: "QT", sortable: true, align: "left" },
    {
      key: "VALOR",
      title: "Valor",
      sortable: true,
      align: "left",
      value: (item: iParamsValePeca) => formatValor(item.VALOR),
    },
    {
      key: "VALOR_REAL",
      title: "Total",
      sortable: true,
      align: "left",
      value: (item: iParamsValePeca) => formatValor(item.VALOR),
    },
  ],
});

const computedParamsOrcamento = computed(() => {
  if (props.selectedItem && props.selectedItem.NUM_ORCAMENTO && props.selectedItem.DATA_ORCAMENTO) {
    return {
      num_Orcamento: props.selectedItem.NUM_ORCAMENTO,
      data: moment(props.selectedItem.DATA_ORCAMENTO).toDate(),
    };
  }
  return null;
});

const actions = {
  async init() {},

  closeModalConsultaVale() {
    emits("closeModalVale");
  },

  async getOrcamento() {
    try {
      state.loading = true;
      const param = computedParamsOrcamento.value;

      const data = await serviceConsultaValePecas.getOrcamento(param);
      state.dbDetalheOrcaçamentoGet = data;
      if (data.length > 0) {
        state.dbDetalheOrçamento = data[0];
      }
      return data;
    } catch (error) {
      Swal.fire({
        text: "Erro ao buscar os Orçamentos",
        icon: "error",
      });
    } finally {
      state.loading = false;
    }
  },

  async getItensOrcamento() {
    try {
      state.loading = true;
      const param = computedParamsOrcamento.value;

      const data = await serviceConsultaValePecas.getItensOrcamento(param);
      state.itensOrcamento = data;
      if (data.length > 0) {
        state.dadosRelatorio = data;
      }
      return data;
    } catch (error) {
      Swal.fire({
        text: "Erro ao buscar os itens do Orçamento",
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
        { key: "UNIDADE", label: "UN.", align: "left" },
        { key: "DESCRICAO", label: "Carro", align: "right" },
        { key: "QTO", label: "QT", align: "center" },
        { key: "VALOR", label: "Valor", align: "center" },
        { key: "VALOR_REAL", label: "Total", align: "center" },
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
      DATA_ORCAMENTO: item.DATA_ORCAMENTO ? utils.dataBrasil(item.DATA_ORCAMENTO) : "-----",
      VALOR: item.VALOR ? utils.formatValor(item.VALOR) : "-----",
    }));
  },
};

onMounted(async () => {
  await actions.init();
  await actions.getOrcamento();
  await actions.getItensOrcamento();
});
</script>
<template>
  <v-container>
    <v-card
      class="pa-5 ma-auto"
      :max-width="900"
      :max-height="600"
    >
      <v-row>
        <v-col cols="3">
          <v-text-field
            label="Nº Orçamento: "
            id="NUM_ORCAMENTO"
            type="text"
            v-model="state.dbDetalheOrçamento.NUM_ORCAMENTO"
            :clearable="false"
            readonly
          ></v-text-field>
        </v-col>

        <v-col cols="3">
          <v-text-field
            label="Nome Cliente"
            id="NOME_CLIENTE"
            type="text"
            readonly
            v-model="state.dbDetalheOrçamento.NOME_CLIENTE"
            :clearable="false"
          ></v-text-field>
        </v-col>

        <v-col cols="3">
          <v-text-field
            label="Vendedor"
            id="VENDEDOR"
            type="text"
            readonly
            v-model="state.dbDetalheOrçamento.VENDEDOR"
            :clearable="false"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
            label="Caixa"
            id="CAIXA"
            readonly
            type="text"
            v-model="state.dbDetalheOrçamento.CAIXA"
            :clearable="false"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row class="d-flex align-center">
        <v-col cols="3">
          <v-text-field
            label="DATA"
            id="DATA"
            readonly
            type="datetime"
            v-model="state.dbDetalheOrçamento.DATA"
            :clearable="false"
            :value="dataBrasil(state.dbDetalheOrçamento.DATA)"
          ></v-text-field>
        </v-col>

        <v-col cols="3">
          <v-text-field
            label="Hora"
            id="HORA"
            readonly
            type="text"
            v-model="state.dbDetalheOrçamento.HORA"
            :clearable="false"
            :value="utils.formatHoraSemOsSegundos(state.dbDetalheOrçamento.HORA)"
          ></v-text-field>
        </v-col>

        <v-col cols="2">
          <v-text-field
            label="Desconto"
            id="DESCONTO"
            readonly
            type="number"
            v-model="state.dbDetalheOrçamento.DESCONTO"
            :clearable="false"
          ></v-text-field>
        </v-col>

        <v-col cols="2">
          <v-text-field
            label="Desc. Vendedor"
            id="VALOR_DESCONTO"
            readonly
            type="number"
            v-model="state.dbDetalheOrçamento.VALOR_DESCONTO"
            :clearable="false"
          ></v-text-field>
        </v-col>

        <v-col cols="2">
          <v-text-field
            label="Valor"
            readonly
            id="VALOR"
            type="number"
            v-model="state.dbDetalheOrçamento.VALOR"
            :clearable="false"
          ></v-text-field>
        </v-col>
      </v-row>

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
            @click="actions.closeModalConsultaVale"
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
