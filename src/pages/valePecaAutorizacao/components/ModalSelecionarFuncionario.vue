<script lang="ts" setup>
import Swal from "sweetalert2";
import { iFuncionario } from "../interfaces";
import { reactive } from "vue";

const props = defineProps({
  funcionarios: {
    type: Array as () => iFuncionario[],
    required: true,
  },
});

const emits = defineEmits(["selecionarFuncionario", "close"]);

const state = reactive({
  funcionarioSelecionado: null,
});

const actions = {
  selecionarFuncionario() {
    if (!state.funcionarioSelecionado) {
      Swal.fire({
        icon: "warning",
        title: "Selecione um funcionário.",
      });

      return;
    }

    emits("selecionarFuncionario", state.funcionarioSelecionado);
  },
};
</script>

<template>
  <v-card>
    <v-card-title> Selecionar Funcionário </v-card-title>
    <v-card-item>
      <v-autocomplete
        v-model="state.funcionarioSelecionado"
        :items="props.funcionarios"
        item-title="NOME_COMP"
        item-value="COD_FUNCIONARIO"
      ></v-autocomplete>
    </v-card-item>
    <v-card-actions>
      <v-btn
        color="primary"
        variant="outlined"
        @click="emits('close')"
        >cancelar</v-btn
      >
      <v-btn
        variant="elevated"
        color="primary"
        @click="actions.selecionarFuncionario"
        >selecionar</v-btn
      >
    </v-card-actions>
  </v-card>
</template>
