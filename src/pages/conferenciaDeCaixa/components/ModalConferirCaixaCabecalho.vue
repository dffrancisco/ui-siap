<script setup lang="ts">
import utils from "@/ts/utils";
import { actions, state } from "../conferenciaDeCaixa";

const emit = defineEmits(["closeModalConferirCaixa"]);
</script>
<template>
  <v-row class="cabecalho">
    <v-col
      cols="1"
      class="mt-2"
    >
      <v-avatar
        size="50px"
        color="primary"
        class="ml-2 btn-bordered"
      >
        <v-img
          :src="actions.getFotoFuncionarioURL(state.caixaSelected.CPF)"
          cover
        ></v-img>
      </v-avatar>
    </v-col>

    <v-col cols="4">
      <v-row class="mt-3">
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
          > </div
        ><v-divider
          vertical
          class="divider ml-2"
          :thickness="3"
        ></v-divider>
      </v-row>
    </v-col>

    <v-col cols="5">
      <div
        class="pt-3"
        style="margin-left: -20px"
      >
        <v-row class="pb-3"><span>Resumo Dinheiro</span></v-row>
        <v-row class="mt-1">
          <v-col cols="4">Recebido: {{ utils.formatValor(state.caixaSelected.DINHEIRO) }}</v-col>
          <v-col cols="4">Devolvido: {{ utils.formatValor(state.caixaSelected.DEVOLUCAO) }}</v-col>
          <v-col cols="4">Vlr. Liquído: {{ utils.formatValor(state.caixaSelected.DINHEIRO_LIQUIDO) }}</v-col>
        </v-row>
        <v-row>
          <v-col cols="4">Sangria: {{ utils.formatValor(state.caixaSelected.SANGRIA) }}</v-col>
          <v-col
            cols="4"
            :class="{ 'text-red': state.caixaSelected.DINHEIRO_LIQUIDO > 500 }"
          >
            No caixa: {{ utils.formatValor(state.caixaSelected.DINHEIRO_LIQUIDO) }}
          </v-col>

          <v-col cols="4">Troco: {{ utils.formatValor(state.caixaSelected.TROCO) }} </v-col>
        </v-row>
      </div>
    </v-col>
    <v-col cols="2">
      <v-row>
        <v-divider
          vertical
          class="divider mt-3"
          :thickness="3"
        ></v-divider>
        <div class="pa-4">
          <div
            class="pl-3"
            v-if="state.caixaSelected.STATUS == 1 && state.caixaSelected.CONFERIDO == ''"
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
            v-if="state.caixaSelected.STATUS == 2 && state.caixaSelected.CONFERIDO == ''"
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

          <div v-if="state.caixaSelected.STATUS == 2 && state.caixaSelected.CONFERIDO !== ''">
            <div style="display: flex; justify-content: flex-end">
              <v-btn
                size="x-small"
                title="Fechar Modal"
                @click="emit('closeModalConferirCaixa')"
                >x</v-btn
              >
            </div>
            <div style="margin-top: -10px">
              <label>Conferido por: </label><br />
              <label>{{ state.caixaSelected.CONFERIDO }}</label>
            </div>
          </div>
        </div>
      </v-row>
    </v-col>
    <v-divider
      class="mb-3 mt-2"
      :thickness="3"
    ></v-divider>
  </v-row>
</template>
<style scoped>
.divider {
  width: 1px;
  height: 60px;
  margin-top: -10px;
}

.v-col {
  padding: 0;
  margin: 0;
}

.cabecalho {
  height: 80px;
}
</style>
