<script setup lang="ts">
import utils from "@/ts/utils";
import { actions, state } from "../devolucaoManualCaixa";
</script>

<template>
  <v-card class="d-flex justify-space-around flex-column pa-6 bg-white ga-3">
    <h2>Cód.Devolução</h2>
    <div class="d-flex ga-2">
      <v-text-field
        class="input-field"
        variant="solo"
        v-model="state.idDevolucao"
      />
      <v-btn
        color="primary"
        density="comfortable"
        size="38"
        icon="mdi-magnify"
        @click="actions.getDadosDevolucao(state.idDevolucao)"
      />
    </div>
    <h3>Dados da Devolução</h3>

    <section class="d-flex">
      <div class="d-flex flex-column justify-center align-start w-100 h-100 ga-1">
        <p
          >Devolução: <span class="font-weight-bold"> {{ state.devolucao }}</span></p
        >
        <p
          >Valor:
          <span
            class="font-weight-bold"
            v-if="state.dadosDevolucao.VALOR"
          >
            {{ utils.formatValor(state.dadosDevolucao.VALOR) }}</span
          ></p
        >
        <p
          >Tipo de Pagamento:
          <span class="font-weight-bold">{{ state.dadosDevolucao.DESCRICAO_PAGAMENTO }}</span></p
        >
        <p
          >Nº Orçamento: <span class="font-weight-bold"> {{ state.dadosDevolucao.NUM_ORCAMENTO }} </span>
        </p>
      </div>

      <div class="d-flex flex-column justify-center align-start w-100 h-100 ga-3">
        <p>
          Data da Devolução:
          <span
            class="font-weight-bold"
            v-if="state.dadosDevolucao.DATA"
          >
            {{ new Date(state.dadosDevolucao.DATA).toLocaleDateString("pt-BR") }}</span
          >
        </p>
        <p>
          Data Orçamento:
          <span
            class="font-weight-bold"
            v-if="state.dadosDevolucao.DATA_VENDA"
          >
            {{ new Date(state.dadosDevolucao.DATA_VENDA).toLocaleDateString("pt-BR") }}</span
          >
        </p>
        <p>
          Op.de Caixa: <span class="font-weight-bold"> {{ state.caixaSelecionado.USUARIO }}</span>
        </p>
      </div>
    </section>

    <div class="d-flex justify-end ga-2">
      <v-btn
        color="primary"
        variant="outlined"
        @click="actions.fecharModal()"
      >
        cancelar
      </v-btn>
      <v-btn
        color="primary"
        :disabled="!state.dadosDevolucao.NUM_ORCAMENTO"
        @click="actions.onClickLancamento(state.idDevolucao)"
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
