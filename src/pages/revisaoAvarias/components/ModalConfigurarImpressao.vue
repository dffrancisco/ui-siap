<script lang="ts" setup>
import printJS from "print-js";
import Swal from "sweetalert2";
import { reactive } from "vue";
import svgDescarte from "../assets/descarte.svg";
import svgDesconto from "../assets/desconto.svg";
import svgDevolucaoGarantia from "../assets/devolucaoGarantia.svg";
import svgLataVelha from "../assets/latavelha.svg";
import svgSaldao from "../assets/saldao.svg";

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
      scanStyles: false,
    });

    document.body.removeChild(container);

    actions.closeModal();
  },

  gerarEtiquetaHTML(posicao: number): string {
    // Ajustes nos tamanhos das etiquetas
    const etiquetaWidth = 90; // Reduzido de 110 para 100
    const etiquetaHeight = 53; // Reduzido de 60 para 50
    const gapVertical = 2; // Aumentado de -8 para 5mm
    const gapHorizontal = 10; // Aumentado de 4 para 8mm

    const etiquetasPorLinha = 2;

    let top: number;
    let left: number;

    // Lógica específica para as posições 9 e 10

    // Cálculo padrão para outras posições
    const row = Math.floor((posicao - 1) / etiquetasPorLinha);
    const col = (posicao - 1) % etiquetasPorLinha;

    top = row * (etiquetaHeight + gapVertical);
    left = col * (etiquetaWidth + gapHorizontal);

    const conteudo = actions.conteudoEtiqueta();

    return `
    <div style="display: flex; position: relative">
      <div
      style="
        position: absolute;
        top: ${top}mm;
        left: ${left}mm;
        width: ${etiquetaWidth}mm;
        height: ${etiquetaHeight}mm;
        padding: 0;
        box-sizing: border-box;
        
      "
    >
      ${conteudo}
    </div>
    </div>
  `;
  },
  conteudoEtiqueta() {
    return `
      <div style="display: flex; justify-content: space-between; margin-top: -14px">
        <div style="display: flex; flex-direction: column; justify-content: end;">
          <div style="display: flex; justify-content: center; width: 100%;">
            <h1>AVARIA</h1>
          </div>
          <div style="display: flex; flex-direction: column; align-items: start; justify-content: end; gap: 8px; margin-top: -8px">
            <div>
              <strong>Direcionamento: </strong>
              <span>Descarte</span>
            </div>
            <div>
              <strong>Cód de Fabricação: </strong>
              <span>AU808</span>
            </div>
          </div>
        </div>
        <div style="display: flex; justify-content: center; align-items: end; flex-grow: 1;">
          <img style="width: 100px;" src="${svgDescarte}">
        </div>
      </div>
      <div>
        <div style="max-width: 360px; margin-top: -10px">
          <p style="text-align: justify;">
            <strong>Desc. Avaria: </strong>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type a
          </p>
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
