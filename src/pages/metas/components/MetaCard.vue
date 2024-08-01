<script setup lang="ts">
import utils from "@/ts/utils";
import { iDadosMetaCard } from "../interfaces";

const props = defineProps({
  dadosToMetaCard: {
    type: Object as () => iDadosMetaCard,
    required: true,
  },
});
</script>

<template>
  <v-card
    class="d-flex flex-column pa-2 ga-2 justify-space-between"
    width="170"
    :color="props.dadosToMetaCard.backgroudColor"
  >
    <span
      class="text-body-1"
      style="color: #374151"
      >{{ props.dadosToMetaCard.nomeCard }}:</span
    >
    <div class="d-flex justify-center">
      <strong class="text-h6">{{ utils.formatValor(props.dadosToMetaCard.valorGeral) }}</strong>
    </div>
    <span
      class="text-body-1"
      style="color: #374151"
      >Acumulado:</span
    >
    <div class="d-flex justify-center">
      <strong class="text-h6">{{ utils.formatValor(props.dadosToMetaCard.valorAcumulado) }}</strong>
    </div>
    <span
      class="text-body-1"
      style="color: #374151"
      >Diária:</span
    >
    <div class="d-flex justify-center">
      <strong class="text-h6">{{ utils.formatValor(props.dadosToMetaCard.valorDiaria) }}</strong>
    </div>
    <v-progress-linear
      :model-value="props.dadosToMetaCard.porcentagem"
      height="20"
      rounded
      :color="props.dadosToMetaCard.progressColor"
    >
      <strong>{{ props.dadosToMetaCard.porcentagem }}%</strong>
    </v-progress-linear>
  </v-card>
</template>
