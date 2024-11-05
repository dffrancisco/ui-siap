<script lang="ts" setup>
import utils from "@/ts/utils";
import { reactive, computed, onMounted } from "vue";
import {
  iClienteFaturado,
  iOrcamentosClienteFaturado,
  iGerarBoletosParam,
  iRegraFaturamento,
  iRegraFaturamentoParcela,
} from "../interfaces";
import serviceFaturarCliente from "../services/faturarCliente.service";
import Swal from "sweetalert2";
import moment, { Moment } from "moment";
import { useEventListener } from "@vueuse/core";
import { msgConfirm } from "@/ts/message";

const props = defineProps({
  orcamentos: {
    type: Array as () => iOrcamentosClienteFaturado[],
    required: true,
    default: [],
  },
  cliente: {
    type: Object as () => iClienteFaturado,
    required: true,
    default: null,
  },
  totalValorOrcamentos: {
    type: Number,
    required: true,
    default: 0,
  },
  dataLimite: {
    type: String,
    required: true,
    default: moment().format("YYYY-MM-DD"),
  },
});

const emits = defineEmits(["closeModal"]);

const state = reactive({
  headers: [
    { title: "ORÇ.", key: "NUM_ORCAMENTO" },
    { title: "NF", key: "NUM_NFE" },
    { title: "", key: "MONTAGEM" },
    { title: "VALOR", key: "VALOR" },
  ],

  headersDevolucao: [
    { title: "ORÇ.", key: "NUM_ORCAMENTO" },
    { title: "VALOR", key: "DEVOLUCAO" },
  ],

  loading: false,
  regrasFaturamento: <iRegraFaturamento>null,
  regrasFaturamentoParcelas: <iRegraFaturamentoParcela>null,
  boletos: [],
});

const actions = {
  async init() {
    await actions.getRegrasFaturamento();
    await actions.criarBoletos();
  },

  async closeModal(boletoGerado: boolean = false) {
    emits("closeModal", boletoGerado);
  },

  async btnGerarBoleto() {
    if (await msgConfirm("Confirma?", "Deseja gerar os boletos? Essa ação não poderá ser desfeita!")) {
      await actions.gerarBoletos();
    }
  },

  async getRegrasFaturamento() {
    try {
      state.loading = true;
      const idCliente = props.cliente.ID_CLIENTE;
      const totalValorOrcamentos = props.totalValorOrcamentos;
      const dividirBoleto = props.cliente.DIVIDIR_BOLETO;

      const data = await serviceFaturarCliente.getRegrasFaturamento(
        idCliente,
        totalValorOrcamentos,
        dividirBoleto
      );

      state.regrasFaturamento = data.regrasFaturamento[0];
      state.regrasFaturamentoParcelas = data.regrasFaturamentoParcelas[0];
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Ocorreu um erro ao carregar as regras de faturamento.",
        text: error.message,
      });
    } finally {
      state.loading = false;
    }
  },

  async criarBoletos() {
    if (!state.regrasFaturamento?.ID_REGRA_FATURAMENTO) {
      Swal.fire({
        icon: "warning",
        title: "Erro ao Gerar Boletos",
        text: "Não foram encontradas regras de faturamento cadastradas. Por favor, cadastre as regras de faturamento antes de continuar.",
      });
      return;
    }

    let boletos = [];
    let dataHoje = moment();
    let mesAtual = dataHoje.month();
    let anoAtual = dataHoje.year();
    let dataLimite = moment(props.dataLimite, "YYYY-MM-DD");
    let diaDataLimite = dataLimite.date();

    // Definir o intervalo de dias para contagem do vencimento
    let dataComecoContagemVencimento =
      diaDataLimite < 15 ? moment({ year: anoAtual, month: mesAtual, day: 15 }) : moment().startOf("month");

    const {
      FATURAMENTO_ACIMA_DE_PRAZO_1,
      FATURAMENTO_ACIMA_DE_PRAZO_2,
      FATURAMENTO_ACIMA_DE_PRAZO_3,
      FATURAMENTO_ATE_PRAZO_1,
      FATURAMENTO_ATE_PRAZO_2,
      FATURAMENTO_ATE_PRAZO_3,
      FATURAMENTO_ATE_VALOR,
    } = state.regrasFaturamento;

    const valorTotal = props.totalValorOrcamentos;

    // Definir prazos de acordo com o valor total
    const prazos =
      valorTotal <= FATURAMENTO_ATE_VALOR
        ? [FATURAMENTO_ATE_PRAZO_1, FATURAMENTO_ATE_PRAZO_2, FATURAMENTO_ATE_PRAZO_3]
        : [FATURAMENTO_ACIMA_DE_PRAZO_1, FATURAMENTO_ACIMA_DE_PRAZO_2, FATURAMENTO_ACIMA_DE_PRAZO_3];

    // Se o cliente não dividir boletos
    if (props.cliente.DIVIDIR_BOLETO === "N") {
      actions.criarBoletoIndividual(anoAtual, mesAtual, valorTotal, prazos[0], dataComecoContagemVencimento);
      return;
    }

    // Definir quantidade de parcelas
    const parcelas = state.regrasFaturamentoParcelas?.ID_REGRA_FATURAMENTO_PARCELA
      ? state.regrasFaturamentoParcelas.DIVISAO
      : 3;

    const valorBoletoParcelado = valorTotal / parcelas;

    // Calcular datas de vencimento com base nos prazos e parcelas
    const datasVencimento = [];

    prazos.forEach((prazo) => {
      datasVencimento.push(dataComecoContagemVencimento.clone().add(prazo, "days").format("YYYY-MM-DD"));
    });

    // Criar boletos
    for (let i = 0; i < parcelas; i++) {
      boletos.push({
        DATA_VENCIMENTO: datasVencimento[i],
        VALOR: valorBoletoParcelado,
      });
    }

    state.boletos = boletos;
  },

  async criarBoletoIndividual(
    ano: number,
    mes: number,
    valor: number,
    prazo: number,
    dataComecoContagemVencimento: Moment
  ) {
    if (props.cliente.DIA_VENCIMENTO_BOLETO) {
      const dataVencimento = moment({
        year: ano,
        month: mes,
        day: props.cliente.DIA_VENCIMENTO_BOLETO,
      }).format("YYYY-MM-DD");

      let boleto = [{ DATA_VENCIMENTO: dataVencimento, VALOR: valor }];
      state.boletos = boleto;
    } else {
      const dataVencimento = dataComecoContagemVencimento.clone().add(prazo, "days").format("YYYY-MM-DD");
      let boleto = [{ DATA_VENCIMENTO: dataVencimento, VALOR: valor }];
      state.boletos = boleto;
    }
  },

  async gerarBoletos() {
    try {
      state.loading = true;

      let param: iGerarBoletosParam = {
        BOLETOS: state.boletos,
        ID_CLIENTE: props.cliente.ID_CLIENTE,
        ORCAMENTOS: props.orcamentos,
      };

      const data = await serviceFaturarCliente.gerarBoletos(param);

      if (data.success) {
        Swal.fire({
          icon: "success",
          title: data.msg,
        });

        actions.closeModal(true);
      } else {
        Swal.fire({
          icon: "error",
          title: data.msg,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Ocorreu um erro ao gerar os boletos.",
        text: error.message,
      });
    } finally {
      state.loading = false;
    }
  },
};

const computeds = {
  filteredDevolucao: computed(() => {
    return props.orcamentos.filter((item) => item.DEVOLUCAO > 0);
  }),

  totalizador: computed(() => {
    let total_orcamentos = 0;
    let total_devolucao = 0;
    let total_desc_montagem = 0;
    let total_geral = 0;

    props.orcamentos.forEach((item) => {
      total_orcamentos += item.VALOR;
      total_devolucao += item.DEVOLUCAO;

      if (item.MONTAGEM > 0) {
        total_desc_montagem += item.MONTAGEM * 0.05; // DESCONTO DE 5% ;
      }
    });

    total_geral = total_orcamentos - total_devolucao - total_desc_montagem;

    return {
      total_orcamentos,
      total_devolucao,
      total_desc_montagem,
      total_geral,
    };
  }),
};

useEventListener(document, "keydown", async (event) => {
  if (event.key === "F1") {
    actions.btnGerarBoleto();
    event.preventDefault();
    event.stopPropagation();
  }
});

onMounted(() => {
  actions.init();
});
</script>

<template>
  <v-card class="d-flex flex-grow-1 pa-4">
    <div class="d-flex justify-space-between align-center">
      <v-card-title class="pa-0">Gerar Boleto Bancário</v-card-title>
      <v-icon
        size="30"
        title="Fechar"
        @click="actions.closeModal(false)"
        >mdi-close
      </v-icon>
    </div>

    <div class="d-flex flex-column mt-4">
      <span class="text-subtitle-1 text-grey-darken-3">Cliente</span>
      <span class="text-body-1 font-weight-bold text-uppercase">{{ props.cliente.NOME }}</span>
    </div>

    <div class="mt-2">
      <v-row>
        <v-col class="d-flex flex-column ga-2">
          <div class="d-flex flex-column ga-2">
            <span class="text-subtitle-1 text-grey-darken-3">Orçamentos</span>
            <div>
              <v-data-table
                :headers="state.headers"
                :items="props.orcamentos"
                class="border rounded-lg"
                height="180"
                items-per-page="-1"
                fixed-header
                hide-default-footer
              >
                <template v-slot:item.MONTAGEM="{ item }">
                  <v-icon
                    title="Montagem"
                    color="grey-darken-3"
                    >{{ item.MONTAGEM > 0 ? "mdi-wrench" : "" }}</v-icon
                  >
                </template>
                <template v-slot:item.VALOR="{ item }">
                  {{ utils.formatValor(item.VALOR) }}
                </template>
              </v-data-table>
            </div>
          </div>

          <div class="d-flex flex-column ga-2">
            <span class="text-subtitle-1 text-grey-darken-3">Devolução</span>
            <div>
              <v-data-table
                :headers="state.headersDevolucao"
                :items="computeds.filteredDevolucao.value"
                class="border rounded-lg"
                height="150"
                fixed-header
                items-per-page="-1"
                hide-default-footer
              >
                <template v-slot:item.DEVOLUCAO="{ item }">
                  {{ utils.formatValor(item.DEVOLUCAO) }}
                </template>
              </v-data-table>
            </div>
          </div>
        </v-col>
        <v-col class="d-flex flex-column ga-2">
          <div class="d-flex flex-column ga-2">
            <span class="text-subtitle-1 text-grey-darken-3">Resumo do Faturamento</span>
            <div
              class="border rounded-lg pa-2 d-flex flex-column justify-space-between"
              style="height: 160px"
            >
              <div>
                <div class="d-flex justify-space-between">
                  <span class="text-body-1">Vlr. Orçamentos</span>
                  <span class="text-body-1 text-primary">{{
                    utils.formatValor(computeds.totalizador.value.total_orcamentos)
                  }}</span>
                </div>

                <div class="d-flex justify-space-between">
                  <span class="text-body-1">Devoluções</span>
                  <span class="text-body-1 text-error"
                    >(-) {{ utils.formatValor(computeds.totalizador.value.total_devolucao) }}</span
                  >
                </div>

                <div class="d-flex justify-space-between">
                  <span class="text-body-1">Desc. Montagem</span>
                  <span class="text-body-1 text-error"
                    >(-) {{ utils.formatValor(computeds.totalizador.value.total_desc_montagem) }}</span
                  >
                </div>
              </div>

              <div class="d-flex flex-column ga-2">
                <v-divider></v-divider>
                <div class="d-flex justify-space-between">
                  <span class="text-h6 font-weight-bold">Total</span>
                  <span class="text-h6 text-primary">{{
                    utils.formatValor(computeds.totalizador.value.total_geral)
                  }}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <span class="text-subtitle-1 text-grey-darken-3">Observação</span>
            <p class="text-justify text-error text-uppercase">{{ props.cliente.OBS_CLIENTE }}</p>
          </div>
        </v-col>
        <v-col class="d-flex flex-column justify-space-between">
          <div>
            <span class="text-subtitle-1 text-grey-darken-3">Boletos</span>
            <div class="containerBoletos">
              <div class="d-flex flex-column ga-2">
                <v-card
                  v-for="(boleto, index) in state.boletos"
                  class="rounded-lg pa-4 d-flex justify-space-between"
                  color="primary"
                >
                  <span class="text-body-1 font-weight-bold">#{{ index + 1 }}</span>
                  <span class="text-body-1 font-weight-bold">{{ utils.dataBrasil(boleto.DATA_VENCIMENTO) }}</span>
                  <span class="text-body-1 font-weight-bold">{{ utils.formatValor(boleto.VALOR) }}</span>
                </v-card>
              </div>
            </div>
          </div>

          <div class="d-flex justify-end">
            <v-btn
              @click="actions.btnGerarBoleto"
              color="success"
              >gerar boleto (f1)</v-btn
            >
          </div>
        </v-col>
      </v-row>
    </div>

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
  </v-card>
</template>

<style scoped>
.containerBoletos {
  overflow: auto;
  max-height: 300px;
}
</style>
