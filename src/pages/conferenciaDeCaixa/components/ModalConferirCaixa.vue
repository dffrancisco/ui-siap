<script setup lang="ts">
import { iCaixas, iOptions } from "../interfaces";
import utils from "@/ts/utils";
import { state, abaSelecionadaModal } from "../conferenciaDeCaixa";
import ModalConferirCaixaAbaLancamentos from "./ModalConferirCaixaAbaLancamentos.vue";

const props = defineProps<{
  caixaSelecionado: iCaixas;
  modalOpened: boolean;
}>();

const emit = defineEmits(["closeModalConferirCaixa"]);

const getFotoFuncionarioURL = (cpf: string) => {
  if (!cpf) {
    return "";
  }
  const cpfSanitizado = cpf.replaceAll(".", "").replaceAll("-", "");
  return `https://www.reallatas.com.br/_serverAPP/thumb.php?img=http://www.reallatas.com.br/foto_funcionarios/${cpfSanitizado}.jpg`;
};

const options: iOptions[] = [
  { value: "lancamentos", label: "Lançamentos" },
  { value: "sangria", label: "Sangrias" },
  { value: "devolucao", label: "Devoluções" },
  { value: "observacao", label: "Observações" },
];
</script>
<template
  ><v-card
    class="pa-5"
    style="width: 1000px; height: 525px; margin: 0 auto"
  >
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
            :src="getFotoFuncionarioURL(props.caixaSelecionado.CPF)"
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
                props.caixaSelecionado.HORA_ABERTURA
                  ? utils.formatHora(props.caixaSelecionado.HORA_ABERTURA)
                  : "---"
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
    </v-row>
    <v-divider :thickness="3"></v-divider>

    <!--Lista de Opções -->
    <div>
      <v-chip-group
        v-model="state.selectOptionModal"
        color="primary"
        mandatory
      >
        <v-chip
          v-for="option in options"
          :key="option.value"
          class="vchip-options-modal"
          :value="option.value"
          :class="{ 'selected-chip': state.selectOptionModal === option.value }"
        >
          {{ option.label }}
        </v-chip>
      </v-chip-group>
    </div>
    <v-divider :thickness="3"></v-divider>

    <!-- Renderiza a aba de Lançamentos -->
    <ModalConferirCaixaAbaLancamentos v-if="abaSelecionadaModal === 'lancamentos'" />
  </v-card>
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
  max-height: 80px;
}

.vchip-options-modal {
  display: flex !important;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 8px !important;
  font-size: 14px;
  width: 150px;
}
</style>
