<script lang="ts" setup>
import { onMounted, reactive, ref, computed } from "vue";
import moment from "moment";
import serviceConsultaValePecas from "../services/consultaValePecas.service";
import { iParamsItemOrcamento, iResponseOrcamento, iParamsValePeca } from "../interfaces";
import Swal from "sweetalert2";

const props = defineProps<{ selectedItem: iParamsValePeca }>();
const emits = defineEmits(["closeModalVale", "selecionarVale"]);
const ano = moment().year();

const state = reactive({
  loading: false,
  dbDetalheOrçamento: <iResponseOrcamento>{},
  dbDetalheOrcaçamentoGet: [] as iResponseOrcamento[],
  dadosRelatorio: [] as iParamsItemOrcamento[],
  dbSelectItem: null,
  dadosRelatorio: [] as iParamsValePeca[],
  itensOrcamento: [] as iParamsItemOrcamento[],
  funcionario: [],
  dbSelectItem: {} as iParamsValePeca,
  meses: [],
  ano: ano,
  mesSelecionado: null,
  headers: <any>[
    { key: "CGC_CLIENTE", title: "Nº Fabricante", sortable: true, align: "left" },
    { key: "NOME", title: "Descrição", sortable: true, align: "left" },
    { key: "UNIDADE", title: "UN", sortable: true, align: "left" },
    { key: "CARRO", title: "Carro", sortable: true, align: "left" },
    { key: "QUANTIDADE", title: "QT", sortable: true, align: "left" },
    { key: "VALOR", title: "Valor", sortable: true, align: "left" },
    { key: "SUB_TOTAL", title: "Total", sortable: true, align: "left" },
  ],
  totalmes: "",
  total: "",
  gridConsultaValePeças: null,
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
      if (!param) {
        throw new Error("Parâmetros inválidos para a consulta.");
      }
      const data = await serviceConsultaValePecas.getOrcamento(param);
      state.dbDetalheOrcaçamentoGet = data;
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
      if (!param) {
        throw new Error("Parâmetros inválidos para a consulta.");
      }
      const data = await serviceConsultaValePecas.getItensOrcamento(param);
      state.itensOrcamento = data;
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

  validarInputs() {
    if (!state.gridConsultaValePeças.dataSource()) {
      Swal.fire({
        text: "Nenhum cliente foi selecionado",
        icon: "warning",
      });
      return false;
    }

    actions.SelecionarVale();
  },

  SelecionarVale() {
    const selecionarValePeca = state.dbSelectItem;
    emits("selecionarVale", selecionarValePeca);
    actions.closeModalConsultaVale();
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
          ></v-text-field>
        </v-col>

        <v-col cols="3">
          <v-text-field
            label="Nome Cliente"
            id="NOME_CLIENTE"
            type="text"
            v-model="state.dbDetalheOrçamento.NOME_CLIENTE"
            :clearable="false"
          ></v-text-field>
        </v-col>

        <v-col cols="2">
          <v-text-field
            label="Vendedor"
            id="VENDEDOR"
            type="text"
            v-model="state.dbDetalheOrçamento.VENDEDOR"
            :clearable="false"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            label="Mês"
            id="MES"
            type="text"
            v-model="state.dbDetalheOrçamento.MES"
            :clearable="false"
          ></v-text-field>
        </v-col>

        <v-col cols="2">
          <v-text-field
            label="DATA"
            id="DATA"
            type="datetime"
            v-model="state.dbDetalheOrçamento.DATA"
            :clearable="false"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row class="d-flex align-center">
        <v-col cols="3">
          <v-text-field
            label="Hora"
            id="HORA"
            type="time"
            v-model="state.dbDetalheOrçamento.HORA"
            :clearable="false"
          ></v-text-field>
        </v-col>

        <v-col cols="3">
          <v-text-field
            label="Desconto"
            id="DESCONTO"
            type="number"
            v-model="state.dbDetalheOrçamento.DESCONTO"
            :clearable="false"
          ></v-text-field>
        </v-col>

        <v-col cols="3">
          <v-text-field
            label="Desc. Vendedor"
            id="VALOR_DESCONTO"
            type="number"
            v-model="state.dbDetalheOrçamento.VALOR_DESCONTO"
            :clearable="false"
          ></v-text-field>
        </v-col>

        <v-col cols="3">
          <v-text-field
            label="Valor"
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

      <v-row class="mt-4">
        <v-col cols="1">
          <v-btn
            color="primary"
            @click=""
            :disabled="state.dadosRelatorio.length === 0"
            icon
            size="36px"
            style="min-width: 36px"
          >
            <v-icon>mdi-printer</v-icon>
          </v-btn>
        </v-col>
        <v-col
          cols="1"
          class="d-flex justify-end"
        >
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
</style>
