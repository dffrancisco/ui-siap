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
  <div class="d-flex flex-column ga-4 justify-space-between">
    <v-card
      width="170"
      class="pa-2"
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
    </v-card>
    <v-card
      class="pa-2"
      :color="props.dadosToMetaCard.backgroudColor"
    >
      <span
        class="text-body-1"
        style="color: #374151"
        >Acumulado:</span
      >
      <div class="d-flex justify-center">
        <strong class="text-h6">{{ utils.formatValor(props.dadosToMetaCard.valorAcumulado) }}</strong>
      </div>
    </v-card>
    <v-card
      class="pa-2"
      :color="props.dadosToMetaCard.backgroudColor"
    >
      <span
        class="text-body-1"
        style="color: #374151"
        >Diária:</span
      >
      <div class="d-flex justify-center">
        <strong class="text-h6">{{ utils.formatValor(props.dadosToMetaCard.valorDiaria) }}</strong>
      </div>
    </v-card>
    <div class="pa-2">
      <v-progress-linear
        :model-value="props.dadosToMetaCard.porcentagem"
        height="20"
        rounded
        :color="props.dadosToMetaCard.progressColor"
      >
        <strong>{{ props.dadosToMetaCard.porcentagem }}%</strong>
      </v-progress-linear>
    </div>
  </div>
</template>
