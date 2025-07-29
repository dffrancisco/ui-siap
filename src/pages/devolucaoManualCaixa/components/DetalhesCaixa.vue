<script setup lang="ts">
import utils from "@/ts/utils";
import { actions, state } from "../devolucaoManualCaixa";
import { stat } from "fs";
</script>

<template>
  <v-card class="detalhes-caixa">
    <h2>Cód.Devolução</h2>
    <div class="d-flex ga-5">
      <v-text-field class="input-field" v-model="state.idDevolucao" variant="solo"></v-text-field>
      <v-btn @click="actions.getDadosDaDevolucao(state.idDevolucao)" icon="mdi-magnify" density="comfortable" class="bg-blue small" size="38">
      </v-btn>
    </div>
    <h3>Dados da Devolução</h3>

    <section class="d-flex">

      <div class=" detalhes-da-devolucao">
        <p>Devolução: <span class="font-weight-bold" > {{ state.devolucao}}</span></p>
        <p>Valor: <span class="font-weight-bold" v-if="state.dadosDaDevolucao.VALOR" > {{ utils.formatValor(state.dadosDaDevolucao.VALOR) }}</span></p>
        <p>Tipo de Pagamento: <span class="font-weight-bold" >{{state.dadosDaDevolucao.DESCRICAO_PAGAMENTO}}</span></p>
        <p>Nº Orçamento: <span class="font-weight-bold"> {{ state.dadosDaDevolucao.NUM_ORCAMENTO }} </span> </p>
      </div>

      <div class="detalhes-da-devolucao ">
        <p> Data da Devolução: <span class="font-weight-bold" v-if="state.dadosDaDevolucao.DATA" > {{new Date(state.dadosDaDevolucao.DATA).toLocaleDateString("pt-BR") }}</span> </p>
        <p> Data Orçamento: <span class="font-weight-bold" v-if="state.dadosDaDevolucao.DATA_VENDA" > {{ new Date(state.dadosDaDevolucao.DATA_VENDA).toLocaleDateString("pt-BR")}}</span> </p>
        <p> Op.de Caixa: <span class="font-weight-bold"> {{ state.caixaSelecionado.USUARIO }}</span> </p>
      </div>

    </section>

    <div class="d-flex justify-end ga-5">
      <v-btn @click="actions.fechaModal()" class="bg-red "> cancelar </v-btn>
      <v-btn 
      class="bg-blue" 
      @click="actions.onClickLancamento"
      :disabled="!state.dadosDaDevolucao.NUM_ORCAMENTO" 
      > salvar</v-btn>
    </div>
  </v-card>
</template>

<style scoped>
.detalhes-caixa {
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  gap: 20px;
  padding: 13px;
  background-color: white;
}

.input-field {
  max-width: 40%;

}

.detalhes-da-devolucao{
  display: flex;
  justify-content: center;
  align-items: start;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  height: 100%;
}
</style>
