<script lang="ts" setup>
import { computed, onMounted, reactive } from "vue";
import { iBoletos } from "../interfaces";

const props = defineProps<{
  detalhesBoleto: iBoletos | null;
}>();

const emit = defineEmits(["closeModalDetalhesBoletos"]);

const state = reactive({
  loading: false,
  detalhesBoleto: <iBoletos>{},
});

const formattedHistorico = computed(() => {
  if (!state.detalhesBoleto.HISTORICO) return "";
  // Divide a string e adiciona quebras de linha
  return state.detalhesBoleto.HISTORICO.replace(/(\d{7}-\d{2}\/\d{2}\/\d{2})/g, "$1\n");
});

onMounted(async () => {
  state.detalhesBoleto = props.detalhesBoleto;
});

const cancelar = () => {
  emit("closeModalDetalhesBoletos");
};
</script>

<template>
  <v-card>
    <v-card-title class="py-3">Histórico do Boleto </v-card-title>
    <v-card-text
      ><v-textarea
        v-model="formattedHistorico"
        rows="10"
        outlined
        readonly
        :clearable="false"
        class="formatarHistorico"
      ></v-textarea>
    </v-card-text>

    <div class="d-flex justify-end pb-4 mr-4">
      <v-btn
        variant="outlined"
        color="primary"
        @click="cancelar"
        >Cancelar</v-btn
      >
    </div>
  </v-card>
</template>

<style scoped>
.formatarHistorico {
  white-space: pre-line;
  font-family: "Courier New", Courier, monospace;
}
</style>
