<script setup lang="ts">
import utils from "@/ts/utils";
import { computed, reactive } from "vue";
import { iValeFuncionario } from "../interfaces";

const props = defineProps({
  funcionarioNaoSelecionado: {
    type: Boolean,
    default: true,
  },
  valesFuncionario: {
    type: Array as () => iValeFuncionario[],
    default: [],
  },
});

const selectParcelamento = [
  {
    label: "1 X DESCONTO 16%",
    value: 1,
  },
  {
    label: "2 X DESCONTO 16%",
    value: 2,
  },
  {
    label: "3 X DESCONTO 16%",
    value: 3,
  },
  {
    label: "4 X DESCONTO 14%",
    value: 4,
  },
  {
    label: "5 X DESCONTO 14%",
    value: 5,
  },
  {
    label: "6 X DESCONTO 12%",
    value: 6,
  },
  {
    label: "7 X DESCONTO 12%",
    value: 7,
  },
  {
    label: "8 X DESCONTO 8%",
    value: 8,
  },
  {
    label: "9 X DESCONTO 5%",
    value: 9,
  },
  {
    label: "10 X DESCONTO 5%",
    value: 10,
  },
];

const state = reactive({
  btnLiberarGerenteDisabled: true,
});

const computeds = {
  devendo: computed(() => {
    return props.valesFuncionario.reduce((total, vale) => {
      return vale.QUITADO === "NAO" ? total + vale.VALOR : total;
    }, 0);
  }),

  ultimaParcela: computed(() => {
    return props.valesFuncionario[props.valesFuncionario.length - 1]?.VALOR;
  }),

  parcelasNaoQuitadas: computed(() => {
    let parcelas = 0;

    props.valesFuncionario.forEach((vale) => {
      if (vale.QUITADO == "NAO") {
        parcelas++;
      }
    });

    return parcelas;
  }),
};
</script>

<template>
  <v-card
    class="d-flex flex-column flex-grow-1"
    variant="outlined"
    color="grey-darken-1"
  >
    <div class="text-black pa-2 d-flex flex-column flex-grow-1">
      <span>Informações</span>
      <div class="d-flex flex-column mt-2 text-body-1 ga-2">
        <div class="d-flex justify-space-between">
          <strong>Devendo: </strong>
          <span>R$ {{ utils.formatValor(computeds.devendo.value) }}</span>
        </div>
        <div class="d-flex justify-space-between">
          <strong>Última Parcela: </strong>
          <span>R$ {{ utils.formatValor(computeds.ultimaParcela.value) }}</span>
        </div>
        <div class="d-flex justify-space-between">
          <strong>Parcelas Não Quitadas: </strong>
          <span>{{ computeds.parcelasNaoQuitadas.value }}</span>
        </div>
      </div>

      <v-divider class="my-2"></v-divider>

      <div>
        <span>N° Orçamento</span>
        <div class="d-flex align-center ga-2">
          <v-text-field
            density="compact"
            :disabled="props.funcionarioNaoSelecionado"
          ></v-text-field>
          <v-btn
            color="primary"
            size="small"
            icon="mdi-magnify mdi-24px"
            :disabled="props.funcionarioNaoSelecionado"
          ></v-btn>
        </div>
      </div>

      <v-divider class="my-2"></v-divider>

      <div>
        <span>Parcelamento</span>
        <v-select
          :items="selectParcelamento"
          item-title="label"
          item-value="value"
        ></v-select>
      </div>

      <v-divider class="my-2"></v-divider>

      <div class="d-flex flex-column text-body-1 ga-2">
        <div class="d-flex justify-space-between">
          <strong>Valor: </strong>
          <span>R$ {{ utils.formatValor(0) }}</span>
        </div>
        <div class="d-flex justify-space-between">
          <strong>Valor Parcela: </strong>
          <span>R$ {{ utils.formatValor(0) }}</span>
        </div>
      </div>

      <v-divider class="my-2"></v-divider>

      <div class="d-flex pa-2 flex-column ga-4 flex-grow-1 justify-center">
        <v-btn
          :disabled="props.funcionarioNaoSelecionado"
          size="small"
          color="primary"
          >liberar funcionário</v-btn
        >

        <v-btn
          :disabled="state.btnLiberarGerenteDisabled"
          size="small"
          color="primary"
          >liberar gerente</v-btn
        >
      </div>
    </div>
  </v-card>
</template>
