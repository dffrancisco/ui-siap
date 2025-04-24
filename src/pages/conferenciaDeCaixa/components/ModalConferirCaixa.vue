<script setup lang="ts">
import { iOptions } from "../interfaces";
import { state, computeds } from "../conferenciaDeCaixa";
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
  ><v-card class="pa-2 modal-container">
    <ModalConferirCaixaCabecalho
      class="pb-2"
      @closeModalConferirCaixa="emit('closeModalConferirCaixa')"
    />

    <v-divider></v-divider>

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
          ::class="{ 
            'selected-chip': state.selectOptionModal === option.value,
            'existe-obs': option.value === 'observacao' && computeds.observacoesPorCaixa.value.length > 0}"
        >
          {{ option.label }}
          <span
            title="Existe observação nesse caixa"
            v-if="option.value === 'observacao' && computeds.observacoesPorCaixa.value.length > 0"
            class="observation-badge"
          ></span>
        </v-chip>
      </v-chip-group>
    </div>

    <v-divider></v-divider>

    <div class="container-conteudo-aba">
      <ModalConferirCaixaAbaLancamentos v-if="computeds.abaSelecionadaModal.value === 'lancamentos'" />
      <ModalConferirCaixaAbaSangrias v-if="computeds.abaSelecionadaModal.value === 'sangria'" />
      <ModalConferirCaixaAbaDevolucoes v-if="computeds.abaSelecionadaModal.value === 'devolucao'" />
      <ModalConferirCaixaAbaObservacoes v-if="computeds.abaSelecionadaModal.value === 'observacao'" />
    </div>
  </v-card>
</template>
<style scoped>
.modal-container {
  max-width: 1050px;
  overflow-y: scroll;
  display: flex;
  height: 540px;
  flex-direction: column;
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

.v-chip.existe-obs {
  position: relative;
}

.observation-badge {
  position: absolute;
  right: 10px;
  width: 8px;
  height: 8px;
  background-color: red;
  border-radius: 50%;
  border: 1px solid white;
}

.container-conteudo-aba {
  padding-top: 8px;
  height: 420px;
}
</style>
