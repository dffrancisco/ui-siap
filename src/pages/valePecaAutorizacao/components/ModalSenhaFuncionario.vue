<script setup lang="ts">
import Swal from "sweetalert2";
import valePecaAutorizacaoService from "../valePecaAutorizacao.service";
import utils from "@/ts/utils";
import { reactive } from "vue";

const props = defineProps({
  codFuncionario: {
    type: Number,
  },
});

const emits = defineEmits(["liberarFuncionario", "closeModal"]);

const state = reactive({
  inputSenhaFuncionario: "",
  loading: false,
});

const actions = {
  async liberarFuncionario() {
    try {
      if (!state.inputSenhaFuncionario || state.inputSenhaFuncionario == "") {
        return;
      }

      state.loading = true;

      const data = await valePecaAutorizacaoService.getAutorizacaoFuncionario({
        senha: utils.base64_encode(state.inputSenhaFuncionario),
        codFuncionario: props.codFuncionario,
      });

      if (data?.error) {
        Swal.fire({
          icon: "warning",
          title: data.msg,
        });
        return;
      }

      emits("liberarFuncionario");
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Erro ao liberar funcionario",
      });
    } finally {
      state.loading = false;
    }
  },
};
</script>

<template>
  <v-card>
    <v-card-item>
      <span>Senha Funcionário</span>
      <v-text-field
        v-model="state.inputSenhaFuncionario"
        autofocus
        maxlength="10"
        type="password"
        :clearable="false"
        @keypress.enter="actions.liberarFuncionario"
      ></v-text-field>
    </v-card-item>
    <v-card-actions>
      <v-btn
        size="small"
        @click="emits('closeModal')"
        >cancelar</v-btn
      >
      <v-btn
        size="small"
        :disabled="!state.inputSenhaFuncionario || state.inputSenhaFuncionario.trim() == ''"
        color="primary"
        @click="actions.liberarFuncionario"
        >verificar</v-btn
      >
    </v-card-actions>
  </v-card>
</template>
