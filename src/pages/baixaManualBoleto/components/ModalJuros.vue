<script lang="ts" setup>
import utils from "@/ts/utils";
import { on } from "events";
import { onMounted, reactive } from "vue";

const props = defineProps({
  numBoleto: {
    type: Number,
  },
  dataOrcamento: {
    type: String,
  },
  numOrcamento: {
    type: Number,
  },
  valorJurosToEdit: {
    type: Number,
  },
});

const emits = defineEmits(["close", "addJuros"]);

const state = reactive({
  juros: "0",
});

const actions = {
  onClickBtnSalvar() {
    emits("addJuros", {
      numBoleto: props.numBoleto,
      numOrcamento: props.numOrcamento,
      dataOrcamento: props.dataOrcamento,
      valorJuros: utils.formatValorUSA(state.juros),
    });
  },
};

onMounted(() => {
  if (props.valorJurosToEdit) {
    state.juros = utils.formatValor(props.valorJurosToEdit);
  }
});
</script>

<template>
  <v-card>
    <div class="d-flex justify-space-between align-center px-4 py-2">
      <v-card-title class="pa-0">{{ valorJurosToEdit ? "Editar" : "Adicionar" }} Juros</v-card-title>
      <v-icon
        size="x-large"
        @click="emits('close')"
        >mdi-close</v-icon
      >
    </div>
    <v-divider></v-divider>
    <v-container>
      <div>
        <v-text-field
          v-model="state.juros"
          label="Juros"
          maxlength="5"
          autofocus
          :clearable="false"
          @keypress.enter="actions.onClickBtnSalvar"
          v-mask-decimal.br="2"
        />
      </div>
      <div class="mt-4 d-flex justify-end ga-2">
        <v-btn
          color="primary"
          variant="outlined"
          @click="emits('close')"
          >cancelar</v-btn
        >
        <v-btn
          color="primary"
          @click="actions.onClickBtnSalvar"
          >salvar</v-btn
        >
      </div>
    </v-container>
  </v-card>
</template>
