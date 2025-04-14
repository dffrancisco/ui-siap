<script setup lang="ts">
import utils from "@/ts/utils";
import { actions, state } from "../conferenciaDeCaixa";

const emit = defineEmits(["closeModalConferirCaixa"]);
</script>
<template>
  <div class="cabecalho">
    <div>
      <v-avatar
        size="50px"
        color="primary"
      >
        <v-img
          :src="actions.getFotoFuncionarioURL(state.caixaSelected.CPF)"
          cover
        ></v-img>
      </v-avatar>
    </div>

    <div>
      <div
        ><span>{{ state.caixaSelected.NOME_COMP }}</span
        ><br />
        <span>Data: {{ utils.dataBrasil(state.caixaSelected.DATA_ABERTURA) }}</span>
        <span class="ml-2"
          >Aberto:
          {{
            state.caixaSelected.HORA_ABERTURA ? utils.formatHora(state.caixaSelected.HORA_ABERTURA) : "---"
          }}</span
        >
        <span class="ml-2"
          >Fechado:
          {{
            state.caixaSelected.HORA_FECHAMENTO ? utils.formatHora(state.caixaSelected.HORA_FECHAMENTO) : "---"
          }}</span
        >
      </div>
    </div>

    <v-divider vertical></v-divider>

    <div class="d-flex flex-grow-1 flex-column">
      <div><span>Resumo Dinheiro</span></div>
      <div class="d-flex mt-2 flex-wrap justify-space-between">
        <div class="d-flex flex-column ga-1">
          <span>Recebido: {{ utils.formatValor(state.caixaSelected.DINHEIRO) }}</span>
          <span>Sangria: {{ utils.formatValor(state.caixaSelected.SANGRIA) }}</span>
        </div>
        <div class="d-flex flex-column ga-1">
          <span>Devolvido: {{ utils.formatValor(state.caixaSelected.DEVOLUCAO) }}</span>
          <span :class="{ 'text-red': state.caixaSelected.DINHEIRO_LIQUIDO > 500 }">
            No caixa: {{ utils.formatValor(state.caixaSelected.DINHEIRO_LIQUIDO) }}
          </span>
        </div>
        <div class="d-flex flex-column ga-1">
          <span>Vlr. Liquído: {{ utils.formatValor(state.caixaSelected.DINHEIRO_LIQUIDO) }}</span>
          <span>Troco: {{ utils.formatValor(state.caixaSelected.TROCO) }} </span>
        </div>
      </div>
    </div>

    <v-divider vertical></v-divider>

    <div
      style="position: relative"
      class="d-flex flex-grow-1 justify-center"
    >
      <div>
        <div
          class="pl-3"
          v-if="state.caixaSelected.STATUS == 1 && !state.caixaSelected.CONFERIDO"
        >
          <v-btn
            title="Fechar Caixa"
            size="small"
            class="mt-3 ml-2"
            color="primary"
            @click="actions.fecharCaixa(state.caixaSelected)"
          >
            Fechar Caixa
          </v-btn>
        </div>

        <div
          class="pl-2"
          v-if="state.caixaSelected.STATUS == 2 && !state.caixaSelected.CONFERIDO"
        >
          <v-btn
            title="Conferir Caixa"
            size="small"
            class="mt-3 ml-2"
            color="#A5D6A7"
            @click="actions.conferirCaixa()"
          >
            Conferir Caixa
          </v-btn>
        </div>

        <div v-if="state.caixaSelected.CONFERIDO">
          <div class="mt-2">
            <label>Conferido por: </label><br />
            <label>{{ state.caixaSelected.CONFERIDO }}</label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.cabecalho {
  display: flex;
  height: 60px;
  gap: 16px;
  align-items: center;
}
</style>
