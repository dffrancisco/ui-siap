<script lang="ts" setup>
import printJS from "print-js";
import Swal from "sweetalert2";
import { onMounted, reactive } from "vue";
import { iDadosToEtiqueta } from "../interfaces";
import svgLataVelha from "../assets/lataVelha.svg";
import svgDescarte from "../assets/descarte.svg";
import svgDevolucaoGarantia from "../assets/devolucaoGarantia.svg";
import svgSaldao from "../assets/saldao.svg";
import svgDesconto from "../assets/desconto.svg";

const props = defineProps({
  dadosToEtiqueta: {
    type: Object as () => iDadosToEtiqueta,
    required: true,
  },
});

const emits = defineEmits(["closeModal"]);

const state = reactive({
  posicaoSelecionado: [],
});

const actions = {
  init() {
    let qtd = props.dadosToEtiqueta.QTD;

    for (let i = 1; i <= qtd; i++) {
      state.posicaoSelecionado.push(i);
    }
  },

  closeModal() {
    emits("closeModal");
  },

  selecionarPosicao(posicao: number) {
    if (
      state.posicaoSelecionado.length == props.dadosToEtiqueta.QTD &&
      !state.posicaoSelecionado.includes(posicao)
    ) {
      Swal.fire({
        title: "Limite de posições selecionadas atingido.",
        icon: "warning",
      });
      return;
    }

    if (state.posicaoSelecionado.includes(posicao)) {
      state.posicaoSelecionado = state.posicaoSelecionado.filter((p) => p != posicao);
    } else {
      state.posicaoSelecionado.push(posicao);
    }
  },

  imprimirEtiquetas() {
    if (!state.posicaoSelecionado || state.posicaoSelecionado.length === 0) {
      Swal.fire({
        title: "Selecionar posições",
        text: "Por favor, escolha as posições das etiquetas para impressão do comprovante.",
        icon: "warning",
      });
      return;
    }

    // Gerar o HTML consolidado com todas as etiquetas
    const etiquetasHTML = state.posicaoSelecionado.map((posicao) => actions.gerarEtiquetaHTML(posicao)).join(""); // Junta todas as etiquetas em um único HTML

    const container = document.createElement("div");
    container.innerHTML = etiquetasHTML;
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
    const etiquetaWidth = 90;
    const etiquetaHeight = 53;
    const gapVertical = 3;
    const gapHorizontal = 13;

    const etiquetasPorLinha = 2;

    const row = Math.floor((posicao - 1) / etiquetasPorLinha);
    const col = (posicao - 1) % etiquetasPorLinha;

    const top = row * (etiquetaHeight + gapVertical);
    const left = col * (etiquetaWidth + gapHorizontal);

    let imgSvg;

    switch (props.dadosToEtiqueta.ID_AVARIA_DESTINO) {
      case 1:
        imgSvg = svgDesconto;
        break;
      case 2:
        imgSvg = svgLataVelha;
        break;
      case 3:
        imgSvg = svgDescarte;
        break;
      case 4:
        imgSvg = svgDevolucaoGarantia;
        break;
      case 5:
        imgSvg = svgSaldao;
        break;
    }

    const conteudo = actions.conteudoEtiqueta(imgSvg);

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

  conteudoEtiqueta(imgSvg: any) {
    return `
    <div style="display: flex; justify-content: space-between; margin-top: -14px">
      <div style="display: flex; flex-direction: column; justify-content: end;">
        <div style="display: flex; justify-content: center; width: 100%;">
          <h3>${props.dadosToEtiqueta.DESTINO}</h3>
        </div>
        <div style="display: flex; flex-direction: column; align-items: start; justify-content: end; gap: 8px; margin-top: -8px">
          <div>
            <strong>Cód Fab: </strong>
            <span>${props.dadosToEtiqueta.NUM_FABRICANTE}</span>
          </div>
        </div>
      </div>
      <div style="display: flex; justify-content: center; align-items: end; flex-grow: 1; margin-top: 16px">
        <img style="width: 100px;" src="${imgSvg}">
      </div>
    </div>
    <div>
      <div style="max-width: 360px; margin-top: -10px">
        <p style="text-align: justify;">
          <strong>Desc. Avaria: </strong>${props.dadosToEtiqueta.DESCRICAO_AVARIA}
        </p>
      </div>
    </div>
  `;
  },
};

onMounted(() => {
  actions.init();
});
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
          :class="state.posicaoSelecionado.includes(i) ? 'posicaoSelecionado' : ''"
          @click="actions.selecionarPosicao(i)"
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
          @click="actions.imprimirEtiquetas"
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
