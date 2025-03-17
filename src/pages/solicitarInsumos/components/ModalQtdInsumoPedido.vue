<script setup lang="ts">
import { defineProps, defineEmits, reactive } from "vue";
import Swal from "sweetalert2";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const state = reactive({
  quantidade: null as number | null,
});

const emits = defineEmits(["confirmQtd", "closeModalQtdInsumoPedido"]);

const salvar = () => {
  if (!state.quantidade || state.quantidade <= 0) {
    Swal.fire({
      icon: "warning",
      text: "Por favor, informe uma quantidade válida.",
    });
    return;
  }

  emits("confirmQtd", state.quantidade);
};

const cancelar = () => {
  emits("closeModalQtdInsumoPedido");
};
</script>

<template>
  <v-card max-width="300px">
    <v-card-title class="ml-2">Adicionar Quantidade</v-card-title>
    <v-card-text>
      <div>
        <label class="descricaoTitle">Item: </label>
        <label class="descricao">{{ props.item.DESCRICAO }}</label>
      </div>
      <v-text-field
        class="mt-4"
        v-model="state.quantidade"
        label="Quantidade"
        type="number"
        min="1"
        required
        autofocus
        @keypress.enter="salvar"
      ></v-text-field>
    </v-card-text>
    <div class="d-flex justify-end mr-3 mt-2 pa-2">
      <v-btn
        variant="outlined"
        class="mr-2"
        color="primary"
        @click="cancelar"
        >Cancelar</v-btn
      >
      <v-btn
        color="primary"
        @click.stop="salvar"
      >
        Salvar
      </v-btn>
    </div>
  </v-card>
</template>

<style scoped>
.descricao {
  font-weight: bold;
  font-size: 14px;
}

.descricaoTitle {
  font-size: 14px;
}
</style>
