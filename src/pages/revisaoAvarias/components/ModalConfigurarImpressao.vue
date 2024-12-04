<script lang="ts" setup>
import printJS from "print-js";
import Swal from "sweetalert2";
import { reactive } from "vue";

const emits = defineEmits(["closeModal"]);

const state = reactive({
  posicaoSelecionado: 0,
});

const actions = {
  closeModal() {
    emits("closeModal");
  },

  selecionarPosicao(posicao: number) {
    state.posicaoSelecionado = posicao;
  },

  imprimirEtiqueta() {
    if (!state.posicaoSelecionado) {
      Swal.fire({
        title: "Selecionar posição",
        text: "Por favor, escolha a posição da etiqueta para impressão do comprovante.",
        icon: "warning",
      });
      return;
    }

    const etiquetaHTML = actions.gerarEtiquetaHTML(state.posicaoSelecionado);

    const container = document.createElement("div");
    container.innerHTML = etiquetaHTML;
    document.body.appendChild(container);

    printJS({
      printable: container,
      type: "html",
      scanStyles: false, // Garante que o estilo inline seja usado
    });

    document.body.removeChild(container);

    actions.closeModal();
  },

  gerarEtiquetaHTML(posicao: number): string {
    const etiquetaWidth = 99;
    const etiquetaHeight = 55.8;
    const margemTop = 0;
    const margemLeft = 0;
    const gapVertical = 5;
    const gapHorizontal = 5;

    const etiquetasPorLinha = 2;
    const row = Math.floor((posicao - 1) / etiquetasPorLinha);
    const col = (posicao - 1) % etiquetasPorLinha;

    // Calcular top e left para posicionamento
    const top = margemTop + row * (etiquetaHeight + gapVertical);
    const left = margemLeft + col * (etiquetaWidth + gapHorizontal);

    return `
    <div
      style="
        position: relative;
        width: 210mm;
        height: 297mm;
        box-sizing: border-box;
      "
    >
      <div
        style="
          position: absolute;
          top: ${top}mm;
          left: ${left}mm;
          width: ${etiquetaWidth}mm;
          height: ${etiquetaHeight}mm;
          border: 2px solid blue; /* Destaca a etiqueta */
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        "
      >
        Etiqueta na posição ${posicao}
      </div>
    </div>
  `;
  },
};
</script>

<template>
  <v-card>
    <div class="d-flex justify-space-between pa-2 align-center">
      <v-card-title class="pa-0">Impressão da Etiqueta</v-card-title>
      <v-icon
        size="x-large"
        @click="actions.closeModal"
        >mdi-close</v-icon
      >
    </div>

    <v-divider></v-divider>

    <div class="d-flex pa-4 flex-column">
      <span class="text-h6">Escolha a posição da etiqueta para a impressão do comprovante. </span>

      <div class="mt-4 d-flex flex-wrap ga-4 justify-center">
        <div
          v-for="i in 10"
          class="posicaoCard"
          :key="i"
          :class="{ posicaoSelecionado: i == state.posicaoSelecionado }"
          @click="actions.selecionarPosicao(i)"
          @dblclick="actions.imprimirEtiqueta"
        >
        </div>
      </div>

      <div class="d-flex justify-end ga-4 mt-4">
        <v-btn
          color="primary"
          variant="outlined"
          @click="actions.closeModal"
          >cancelar</v-btn
        >
        <v-btn
          color="primary"
          @click="actions.imprimirEtiqueta"
          >imprimir</v-btn
        >
      </div>
    </div>
  </v-card>
</template>

<style scoped>
.posicaoCard {
  border: 1px solid #616161;
  border-radius: 8px;
  width: 320px;
  height: 60px;
  display: flex;
  padding: 20px;
  cursor: pointer;
}

.posicaoSelecionado {
  border: 2px solid #1e88e5 !important;
  box-shadow: 10px black;
}
</style>
