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
});
</script>

<template>
  <div class="historico-meses">
    <strong v-if="props.label">{{ props.label }}</strong>
    <div class="historico-meses-conteudo">
      <div
        v-for="(historico, index) in historicoMeses"
        class="historico-meses-conteudo-card"
        :style="{
          'background-color': index <= 2 ? corDestaque : corPadrao,
          color: corFonte,
        }"
      >
        <span>{{ historico.mes }}</span>
        <strong class="historico-meses-conteudo-card-qtd">{{ historico.qtd }}</strong>
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

.historico-meses-conteudo {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
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

.historico-meses-conteudo-card-qtd {
  font-weight: 900;
}
</style>
