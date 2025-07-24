<script setup lang="ts">
import { defineProps } from "vue";
const props = defineProps<{
  loading: boolean;
  qtdOrcamentos: number;
  nomeEmpresa: string;
  colorBg: string;
}>();

const emit = defineEmits(["escolherPorData"]);
</script>
<template>
  <div class="d-flex ga-3">
    <v-card
      class="card_orcamento pa-2 d-flex mr-2 mt-2"
      v-if="props.loading == false && props.qtdOrcamentos > 0"
      @Click="emit('escolherPorData')"
    >
      <label class="mr-2 text-subtitle-2">{{ props.nomeEmpresa }}</label>
      <div
        class="bg_quantidade_orcamento"
        :class="props.colorBg"
      >
        <div class="font-weight-bold">{{ props.qtdOrcamentos }}</div>
      </div>
    </v-card>

    <v-skeleton-loader
      v-if="props.loading == true"
      class="mt-4 mr-4"
      width="120"
      height="40"
    />
  </div>
</template>
<style scoped>
.card_orcamento {
  width: 200px;
  height: 60px;
  justify-content: space-between;
  align-items: center;
}
.bg_quantidade_orcamento {
  display: flex;
  border-radius: 50px;
  padding: 0px 5px;
  height: 25px;
  width: 25px;
  align-items: center;
  justify-content: center;
}
</style>
