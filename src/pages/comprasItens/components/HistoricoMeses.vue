<script setup lang="ts">
import { iHistoricoMes } from "../interfaces";

const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  historicoMeses: {
    type: Array as () => iHistoricoMes[],
    default: [],
  },
  corPadrao: {
    type: String,
    default: "#7dc1ff",
  },
  corDestaque: {
    type: String,
    default: "#b1daff",
  },
  corFonte: {
    type: String,
    default: "#b1daff",
  },
  loading: {
    type: Boolean,
    default: true,
  },
  media: {
    type: Number,
    default: 0,
  },
});
</script>

<template>
  <div class="historico-meses">
    <div class="historico-cabecalho">
      <strong v-if="props.label">{{ props.label }}</strong>
      <div class="historico-cabecalho-media">
        <span class="mr-1">Média:</span>
        <strong>{{ media }}</strong>
      </div>
    </div>
    <div class="historico-meses-conteudo">
      <div
        v-for="(historico, index) in historicoMeses"
        class="historico-meses-conteudo-card"
        :class="{
          'historico-meses-conteudo-card--loading': loading == true,
        }"
        :style="{
          'background-color': index <= 2 ? corDestaque : corPadrao,
          color: corFonte,
        }"
      >
        <div
          v-if="!loading"
          class="d-flex flex-column align-center"
        >
          <span>{{ historico.mesExtenso }}</span>
          <strong class="historico-meses-conteudo-card-qtd">{{ historico.qtd }}</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.historico-meses {
  padding: 12px;
  background-color: var(--grey-900);
  display: flex;
  gap: 8px;
  flex-direction: column;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

.historico-cabecalho {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.historico-cabecalho-media {
  font-size: 10px;
  color: var(--grey-400);
}

.historico-meses-conteudo {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.historico-meses-conteudo-card {
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 66px;
  height: 45px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 400;
}

.historico-meses-conteudo-card--loading {
  position: relative;
  overflow: hidden;
  background-color: var(--grey-800) !important;
}

.historico-meses-conteudo-card--loading::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}
.historico-meses-conteudo-card-qtd {
  font-weight: 900;
}
</style>
