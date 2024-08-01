<script setup lang="ts">
import { reactive } from "vue";
import { iSugestaoCompraAlteracao } from "../interfaces";

const props = defineProps({
  itemReprovar: {
    type: Object as () => iSugestaoCompraAlteracao,
    required: false,
    default: () => [],
  },
});

const emit = defineEmits(["closeModal", "reprovarItem"]);

const state = reactive({
  loading: false,
});

function cancelar() {
  emit("closeModal");
}

function reprovar() {
  state.loading = true;
  let sugestaoReprovar = props.itemReprovar;
  emit("reprovarItem", {
    sugestaoReprovar,
  });
  state.loading = false;
}
</script>
<template>
  <v-card class="modal-container">
    <div class="d-flex justify-center ga-2">
      <v-card-title class="py-3">
        <span>Reprovar</span>
        <v-icon
          color="#0077E4"
          size="40"
          class="ml-2"
          >mdi-close-circle-outline</v-icon
        ></v-card-title
      >
    </div>
    <v-card-text class="text-center"
      >Deseja reprovar a compra/alteração da sugestão: "{{ props.itemReprovar.SUGESTAO }}" ?</v-card-text
    >
    <div class="d-flex justify-center pb-4">
      <v-btn
        variant="outlined"
        color="primary"
        @click="cancelar"
        >Cancelar</v-btn
      >
      <v-btn
        class="ml-2"
        color="primary"
        @click="reprovar"
        >Reprovar</v-btn
      >
    </div>
  </v-card>
  <v-overlay
    :model-value="state.loading"
    class="align-center justify-center"
    persistent
  >
    <v-progress-circular
      color="primary"
      indeterminate
      size="64"
    ></v-progress-circular>
  </v-overlay>
</template>
<style scoped>
.modal-container {
  margin-left: 33%;
  margin-bottom: 15%;
  width: 40%;
  justify-content: center;
  align-items: center;
  font-size: 15px;
}
</style>
