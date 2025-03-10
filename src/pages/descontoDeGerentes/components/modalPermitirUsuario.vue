<script setup lang="ts">
import { reactive } from "vue";
import Swal from "sweetalert2";
import descontoDeGerentesService from "../services/descontoDeGerentes.service";
import { iParamDarPermissao, iUsuarioDesconto } from "../interfaces";

const emit = defineEmits(["fecharModalPermitir", "senhaalterada"]);

const state = reactive({
  senha: "",
  confirmarSenha: "",
  NOME_COMP: "Nome do Usuário",
});

const actions = {
  async permitirUsuario() {
    if (state.senha.length < 6) {
      Swal.fire("Aviso", "Senha deve ter no mínimo 6 caracteres!", "warning");
      return;
    }
    if (state.senha !== state.confirmarSenha) {
      Swal.fire("Aviso", "As senhas não coincidem!", "warning");
      return;
    }
    try {
      const params: iParamDarPermissao = {
        COD_FUNCIONARIO: 0,
        SENHA: btoa(state.senha),
      };
      await descontoDeGerentesService.darPermissao(params);
      Swal.fire("Sucesso", "Permissão concedida com sucesso!", "success");
      emit("senhaalterada");
      actions.fecharModalPermitir();
    } catch (error: any) {
      Swal.fire("Erro", error.response?.data?.message || "Falha ao conceder permissão", "error");
    }
  },

  fecharModalPermitir() {
    emit("fecharModalPermitir");
  },
};
</script>

<template>
  <v-card class="pa-4">
    <v-card-title class="text-h5 mb-4">Permitir Usuário</v-card-title>
    <v-card-text>
      <v-text-field
        label="Usuário"
        :value="state.NOME_COMP"
        disabled
        outlined
        dense
        class="mb-4"
      />
      <v-text-field
        v-model="state.senha"
        label="Senha *"
        type="password"
        outlined
        dense
        class="mb-4"
      />
      <v-text-field
        v-model="state.confirmarSenha"
        label="Confirmar Senha *"
        type="password"
        outlined
        dense
        class="mb-4"
      />
    </v-card-text>
    <v-card-actions class="d-flex justify-end">
      <v-btn
        color="primary"
        @click="actions.fecharModalPermitir"
      >
        Cancelar
      </v-btn>
      <v-btn
        color="primary"
        @click="actions.permitirUsuario"
      >
        Salvar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped></style>
