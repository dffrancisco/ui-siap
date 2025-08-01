<script setup lang="ts">
import utils from "@/ts/utils";
import { iDadosDevolucao, iCaixa } from "../interfaces";
import { onMounted, reactive } from "vue";
import Swal from "sweetalert2";

// teste
const props = defineProps<{
  caixa: iCaixa;
  dadosDevolucao: iDadosDevolucao;
  idDevolucao: number;
}>();
const state = reactive({
  idDevolucao: 0,
});

const emit = defineEmits(["salvar", "buscar", "fechar"]);

const actions = {
  buscar: () => {
    if (!state.idDevolucao && state.idDevolucao !== 5) {
      Swal.fire({
        icon: "warning",
        title: "código de devolução inválida",
        text: "certifique-se de que o campo não está em branco.",
      });
      return;
    }
    emit("buscar", state.idDevolucao);
  },
};

onMounted(() => {
  state.idDevolucao = props.idDevolucao;
  console.log("ID recebido via prop:", state.idDevolucao);
});

// teste
</script>

<template>
  <v-card class="d-flex justify-space-around flex-column pa-6 bg-white ga-3">
    <h2>Cód.Devolução</h2>
    <div class="d-flex ga-2">
      <v-text-field
        class="input-field"
        variant="solo"
        @keyup.enter="actions.buscar()"
        v-model="state.idDevolucao"
      />

      <v-btn
        color="primary"
        density="comfortable"
        size="38"
        icon="mdi-magnify"
        @click="actions.buscar()"
      />
    </div>
    <h3>Dados da Devolução</h3>

    <section class="d-flex">
      <div class="d-flex flex-column justify-center align-start w-100 h-100 ga-1">
        <p
          >Devolução:
          <span
            class="font-weight-bold"
            v-if="props.idDevolucao"
          >
            {{ props.idDevolucao }}</span
          ></p
        >
        <p
          >Valor:
          <span
            class="font-weight-bold"
            v-if="props.dadosDevolucao.VALOR"
          >
            {{ utils.formatValor(props.dadosDevolucao.VALOR) }}</span
          ></p
        >
        <p
          >Tipo de Pagamento:
          <span class="font-weight-bold">{{ props.dadosDevolucao.DESCRICAO_PAGAMENTO }}</span></p
        >
        <p
          >Nº Orçamento: <span class="font-weight-bold"> {{ props.dadosDevolucao.NUM_ORCAMENTO }} </span>
        </p>
      </div>

      <div class="d-flex flex-column justify-center align-start w-100 h-100 ga-3">
        <p>
          Data da Devolução:
          <span
            class="font-weight-bold"
            v-if="props.dadosDevolucao.DATA"
          >
            {{ new Date(props.dadosDevolucao.DATA).toLocaleDateString("pt-BR") }}</span
          >
        </p>
        <p>
          Data Orçamento:
          <span
            class="font-weight-bold"
            v-if="props.dadosDevolucao.DATA_VENDA"
          >
            {{ new Date(props.dadosDevolucao.DATA_VENDA).toLocaleDateString("pt-BR") }}</span
          >
        </p>
        <p>
          Op.de Caixa: <span class="font-weight-bold"> {{ props.caixa.USUARIO }}</span>
        </p>
      </div>
    </section>

    <div class="d-flex justify-end ga-2">
      <v-btn
        color="primary"
        variant="outlined"
        @click="emit('fechar')"
      >
        cancelar
      </v-btn>
      <v-btn
        color="primary"
        :disabled="!props.dadosDevolucao.NUM_ORCAMENTO"
        @click="emit('salvar')"
      >
        salvar
      </v-btn>
    </div>
  </v-card>
</template>

<style scoped>
.input-field {
  max-width: 40%;
}
</style>
