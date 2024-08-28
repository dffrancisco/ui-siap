<script setup lang="ts">
import utils from "@/ts/utils";
import { iDadosMetaCard } from "../interfaces";

const props = defineProps({
  dadosToMetaCard: {
    type: Object as () => iDadosMetaCard,
    required: true,
  },
  mostrarValores: {
    type: Boolean,
    default: true,
  },
});
</script>

<template>
  <div class="d-flex flex-column ga-4">
    <v-card
      class="pa-2"
      :color="props.dadosToMetaCard.backgroudColor"
    >
      <span
        class="text-body-1"
        style="color: #374151"
        >{{ props.dadosToMetaCard.nomeCard }}:</span
      >

      <div
        v-if="mostrarValores"
        class="d-flex justify-center"
      >
        <strong class="text-h6">{{ utils.formatValor(props.dadosToMetaCard.valorGeral) }}</strong>
      </div>

      <v-progress-linear
        v-if="!mostrarValores"
        :model-value="props.dadosToMetaCard.porcentagem"
        height="20"
        class="mt-2"
        rounded
        :color="props.dadosToMetaCard.progressColor"
      >
        <strong>{{ props.dadosToMetaCard.porcentagem }}%</strong>
      </v-progress-linear>
    </v-card>

    <div
      class="d-flex flex-column ga-4"
      v-if="mostrarValores"
    >
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
    </div>

    <div class="pa-2">
      <v-progress-linear
        v-if="mostrarValores"
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
