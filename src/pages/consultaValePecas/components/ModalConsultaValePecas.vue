<script lang="ts" setup>
import { onMounted, reactive, ref, computed } from "vue";
import moment from "moment";
import serviceConsultaValePecas from "../services/consultaValePecas.service";
import { iParamsItemOrcamento, iResponseOrcamento, iParamsValePeca } from "../interfaces";
import Swal from "sweetalert2";
const emits = defineEmits(["closeModalVale", "selecionarVale"]);
const numeroOrcamento = ref("");
const dataOrcamento = ref("");

const dataFormatada = computed(() => {
  return dataOrcamento.value ? moment(dataOrcamento.value).format("YYYY-MM-DD") : "";
});

const state = reactive({
  loading: false,
  dbDetalheOrçamento: [] as iResponseOrcamento[],
  dadosRelatorio: [] as iParamsItemOrcamento[],
  dbSelectItem: null,
  funcionario: [],
  selectedFuncionario: <number[]>[],
  meses: [],

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

const actions = {
  async init() {},

  closeModalConsultaVale() {
    emits("closeModalVale");
  },


  const getBuscarOrcamento = async () => {
    try {
      state.loading = true;


      const orcamento = await serviceConsultaValePecas.getOrcamento(
        numeroOrcamento.value,
        dataFormatada.value
      );


      const itens = await serviceConsultaValePecas.getItensOrcamento(
        numeroOrcamento.value,
        dataFormatada.value
      );


      state.dbDetalheOrçamento = orcamento;
      state.dadosRelatorio = itens;

    } catch (error) {
      Swal.fire('Erro', 'Não foi possível carregar o orçamento', 'error');
    } finally {
      state.loading = false;
    }
  },



  async getConsultarVales() {
    try {
      state.loading = true;

      let param: iParamsValePeca = {
        ano: state.ano,
        cod_funcionarios: state.selectedFuncionario,
      };

      const data = await serviceConsultaValePecas.consultarVales(param);
      state.dadosRelatorio = data;
      return data;
    } catch (error) {
      Swal.fire({
        text: "Erro ao buscar os Vales",
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
  await actions.getBuscarOrcamento();

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
            v-model="state.dbDetalheOrçamento"
            :clearable="false"
          ></v-text-field>
        </v-col>

        <v-col cols="3">
          <v-text-field
            label="Nome Cliente"
            id="NOME_CLIENTE"
            type="text"
            v-model="state.dbDetalheOrçamento"
            :clearable="false"
          ></v-text-field>
        </v-col>

        <v-col cols="2">
          <v-text-field
            label="Vendedor"
            id="VENDEDOR"
            type="text"
            v-model="state.dbDetalheOrçamento"
            :clearable="false"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            label="Mês"
            id="MES"
            type="text"
            v-model="state.dbDetalheOrçamento"
            :clearable="false"
          ></v-text-field>
        </v-col>

        <v-col cols="2">
          <v-text-field
            label="DATA"
            id="DATA"
            type="datetime"
            v-model="state.dbDetalheOrçamento"
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
            v-model="state.dbDetalheOrçamento"
            :clearable="false"
          ></v-text-field>
        </v-col>

        <v-col cols="3">
          <v-text-field
            label="Desconto"
            id="DESCONTO"
            type="number"
            v-model="state.dbDetalheOrçamento"
            :clearable="false"
          ></v-text-field>
        </v-col>

        <v-col cols="3">
          <v-text-field
            label="Desc. Vendedor"
            id="VALOR_DESCONTO"
            type="number"
            v-model="state.dbDetalheOrçamento"
            :clearable="false"
          ></v-text-field>
        </v-col>

        <v-col cols="3">
          <v-text-field
            label="Valor"
            id="VALOR"
            type="number"
            v-model="state.dbDetalheOrçamento"
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
