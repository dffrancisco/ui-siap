<script setup lang="ts">
import { reactive } from "vue";
const emit = defineEmits(["botaoLiberarcredito", "botaoDevolucao", "botaoRecalcularDesconto", "itens"]);
const props = defineProps({
  lojas: {
    type: Object,
    required: true,
  },
});

const state = reactive({
  selecLoja: "",
});
</script>

<template>
  <v-card
    class="pa-8 d-flex flex-column justify-center"
    :max-width="800"
    style="min-height: 350px; width: 100%; border: 1px solid #ccc; border-radius: 12px"
  >
    <div class="d-flex text-left">
      <span style="font-size: 20px; font-weight: bold">Seleção de Loja</span>
    </div>
    <span class="pt-10">Loja:</span>
    <div
      class="d-flex flex-column justify-center mt-3"
      style="height: 100%"
    >
      <v-autocomplete
        v-model="state.selecLoja"
        :items="props.lojas"
        item-title="FANTASIA"
        item-value="ID_EMPRESA"
        label="Lojas"
        autofocus
        variant="outlined"
        density="comfortable"
        style="min-width: 400px; max-width: 100%; margin-bottom: 24px"
        hide-details="auto"
      />

      <span>Tela:</span>
      <div
        class="d-flex justify-center mt-3"
        style="gap: 16px; flex-wrap: wrap"
      >
        <v-btn
          color="blue"
          variant="elevated"
          style="min-width: 200px"
          :disabled="!state.selecLoja"
          @click="emit('botaoLiberarcredito', state.selecLoja)"
        >
          Liberar Crédito
        </v-btn>

        <v-btn
          color="blue"
          variant="elevated"
          style="min-width: 200px"
          :disabled="!state.selecLoja"
          @click="emit('botaoDevolucao', state.selecLoja)"
        >
          Devolução Manual Caixa
        </v-btn>
        <v-btn
          color="blue"
          variant="elevated"
          style="min-width: 200px"
          :disabled="!state.selecLoja"
          @click="emit('botaoRecalcularDesconto', state.selecLoja)"
        >
          Recalcular Desconto
        </v-btn>
      </div>
    </div>
  </v-card>
</template>
