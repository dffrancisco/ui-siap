<script setup lang="ts">
import { iOptions } from "../interfaces";
import { state, abaSelecionadaModal } from "../conferenciaDeCaixa";
import ModalConferirCaixaAbaLancamentos from "./ModalConferirCaixaAbaLancamentos.vue";
import ModalConferirCaixaAbaSangrias from "./ModalConferirCaixaAbaSangrias.vue";
import ModalConferirCaixaAbaDevolucoes from "./ModalConferirCaixaAbaDevolucoes.vue";
import ModalConferirCaixaAbaObservacoes from "./ModalConferirCaixaAbaObservacoes.vue";
import ModalConferirCaixaCabecalho from "./ModalConferirCaixaCabecalho.vue";

const emit = defineEmits(["closeModalConferirCaixa"]);

const options: iOptions[] = [
  { value: "lancamentos", label: "Lançamentos" },
  { value: "sangria", label: "Sangrias" },
  { value: "devolucao", label: "Devoluções" },
  { value: "observacao", label: "Observações" },
];
</script>
<template
  ><v-card class="pa-5 ma-auto modal-container">
    <ModalConferirCaixaCabecalho @closeModalConferirCaixa="emit('closeModalConferirCaixa')" />
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
    <ModalConferirCaixaAbaSangrias v-if="abaSelecionadaModal === 'sangria'" />
    <ModalConferirCaixaAbaDevolucoes v-if="abaSelecionadaModal === 'devolucao'" />
    <ModalConferirCaixaAbaObservacoes v-if="abaSelecionadaModal === 'observacao'" />
  </v-card>
</template>
<style scoped>
.modal-container {
  max-height: 560px;
  width: 1070px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.divider {
  width: 1px;
  height: 60px;
  margin-top: -10px;
}

.v-col {
  padding: 0;
  margin: 0;
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
