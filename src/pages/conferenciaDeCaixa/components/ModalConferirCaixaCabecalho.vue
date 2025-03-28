<script setup lang="ts">
import { iCaixas } from "../interfaces";
import utils from "@/ts/utils";
import { actions } from "../conferenciaDeCaixa";

const props = defineProps<{
  caixaSelecionado: iCaixas;
}>();

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
          :src="actions.getFotoFuncionarioURL(props.caixaSelecionado.CPF)"
          cover
        ></v-img>
      </v-avatar>
    </v-col>

    <v-col cols="4">
      <v-row class="mt-3">
        <div
          ><span>{{ props.caixaSelecionado.NOME_COMP }}</span
          ><br />
          <span>Data: {{ utils.dataBrasil(props.caixaSelecionado.DATA_ABERTURA) }}</span>
          <span class="ml-2"
            >Aberto:
            {{
              props.caixaSelecionado.HORA_ABERTURA ? utils.formatHora(props.caixaSelecionado.HORA_ABERTURA) : "---"
            }}</span
          >
          <span class="ml-2"
            >Fechado:
            {{
              props.caixaSelecionado.HORA_FECHAMENTO
                ? utils.formatHora(props.caixaSelecionado.HORA_FECHAMENTO)
                : "---"
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
          <v-col cols="4">Recebido: {{ utils.formatValor(props.caixaSelecionado.DINHEIRO) }}</v-col>
          <v-col cols="4">Devolvido: {{ utils.formatValor(props.caixaSelecionado.DEVOLUCAO) }}</v-col>
          <v-col cols="4">Vlr. Liquído: {{ utils.formatValor(props.caixaSelecionado.DINHEIRO_LIQUIDO) }}</v-col>
        </v-row>
        <v-row>
          <v-col cols="4">Sangria: {{ utils.formatValor(props.caixaSelecionado.SANGRIA) }}</v-col>
          <v-col cols="4">No caixa: {{ utils.formatValor(props.caixaSelecionado.DINHEIRO_LIQUIDO) }}</v-col>
          <v-col cols="4">Troco: {{ utils.formatValor(props.caixaSelecionado.TROCO) }} </v-col>
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
          <v-btn
            title="Fechar Caixa"
            size="small"
            class="mt-3 ml-2"
            color="primary"
            @click="emit('closeModalConferirCaixa')"
            >Fechar Caixa</v-btn
          >
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
