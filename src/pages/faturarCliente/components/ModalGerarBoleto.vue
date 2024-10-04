<script lang="ts" setup>
import utils from "@/ts/utils";
import { reactive, computed } from "vue";
import { iClienteFaturado, iOrcamentosClienteFaturado } from "../interfaces";

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
});

const emits = defineEmits(["closeModal"]);

const state = reactive({
  desserts: [
    { ORCAMENTO: 4552, NF: 212, VALOR: 100, MONTAGEM: true },
    { ORCAMENTO: 4521, NF: 2415, VALOR: 12112, MONTAGEM: false },
    { ORCAMENTO: 5664, NF: 24132, VALOR: 545, MONTAGEM: true },
    { ORCAMENTO: 5655, NF: 2124, VALOR: 1523, MONTAGEM: true },
    { ORCAMENTO: 78941, NF: 5456, VALOR: 32153, MONTAGEM: true },
  ],
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
});

const actions = {
  async closeModal() {
    emits("closeModal");
  },
};

const computeds = {
  filteredDevolucao: computed(() => {
    return props.orcamentos.filter((item) => item.DEVOLUCAO > 0);
  }),

  totalizador: computed(() => {
    let total_orcamentos = 0;
    let total_devolucao = 0;
    let total_montagem = 0;
    let total_geral = 0;

    props.orcamentos.forEach((item) => {
      total_orcamentos += item.VALOR;
      total_devolucao += item.DEVOLUCAO;
      total_montagem += item.MONTAGEM;
      total_geral += item.VALOR - item.DEVOLUCAO;
    });

    return {
      total_orcamentos,
      total_devolucao,
      total_montagem,
      total_geral,
    };
  }),
};
</script>

<template>
  <v-card class="d-flex flex-grow-1 pa-4">
    <div class="d-flex justify-space-between align-center">
      <v-card-title class="pa-0">Gerar Boleto Bancário</v-card-title>
      <v-icon
        size="30"
        title="Fechar"
        @click="actions.closeModal"
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
                  <v-icon color="grey-darken-3">{{ item.MONTAGEM > 0 ? "mdi-wrench" : "" }}</v-icon>
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
                <template v-slot:item.VALOR="{ item }">
                  {{ utils.formatValor(item.VALOR) }}
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
                    >(-) {{ utils.formatValor(computeds.totalizador.value.total_montagem) }}</span
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
                  v-for="(i, index) in 3"
                  class="rounded-lg pa-4 d-flex justify-space-between"
                  color="primary"
                >
                  <span class="text-body-1 font-weight-bold">#{{ index + 1 }}</span>
                  <span class="text-body-1 font-weight-bold">14/{{ 10 + index }}/2024</span>
                  <span class="text-body-1 font-weight-bold">{{ utils.formatValor(1000) }}</span>
                </v-card>
              </div>
            </div>
          </div>

          <div class="d-flex justify-end">
            <v-btn color="success">geral boleto (f1)</v-btn>
          </div>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<style scoped>
.containerBoletos {
  overflow: auto;
  max-height: 300px;
}
</style>
