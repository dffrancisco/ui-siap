<script setup lang="ts">
import { reactive, defineProps } from "vue";
import Swal from "sweetalert2";
import utils from "@/ts/utils";
import descontoDeGerentesService from "../services/descontoDeGerentes.service";
import { iParamDarPermissao, iUsuario } from "../interfaces";

const props = defineProps<{ usuarioSelecionado: iUsuario }>();
const emit = defineEmits(["fecharModalPermitir", "senhaalterada"]);

const state = reactive({
  senha: "",
  confirmarSenha: "",
});

const mudarFoco = (proximoCampo: string) => {
  const campo = document.querySelector(`input[name="${proximoCampo}"]`);
  if (campo) {
    (campo as HTMLInputElement).focus();
  }
};

const actions = {
  async permitirUsuario() {
    if (state.senha.length < 6) {
      Swal.fire({
        icon: "warning",
        text: "Senha deve ter no mínimo 6 caracteres!",
      });
      return;
    }
    if (state.senha !== state.confirmarSenha) {
      Swal.fire({
        icon: "warning",
        text: "As senhas não coincidem!",
      });
      return;
    }
    try {
      const params: iParamDarPermissao = {
        COD_FUNCIONARIO: props.usuarioSelecionado.COD_FUNCIONARIO,
        SENHA: utils.base64_encode(state.senha),
      };
      await descontoDeGerentesService.darPermissao(params);

      emit("senhaalterada");
      actions.fecharModalPermitir();
    } catch (error) {
      console.error("Erro ao conceder permissão:", error);
      Swal.fire({
        icon: "error",
        text: error?.response?.data?.msg || "Erro ao processar a solicitação.",
      });
    }
  },

  fecharModalPermitir() {
    emit("fecharModalPermitir");
  },
};
</script>

<template>
  <v-card class="pa-4">
    <v-card-title class="text-h5">Permitir Usuário</v-card-title>
    <v-card-text>
      <v-text-field
        v-model="props.usuarioSelecionado.NOME_COMP"
        class="mb-2"
        readonly
      />
      <v-text-field
        v-model="state.senha"
        name="senha"
        label="Senha:"
        type="password"
        maxlength="10"
        class="mb-2"
        @keydown.enter="mudarFoco('confirmarSenha')"
      />
      <v-text-field
        v-model="state.confirmarSenha"
        name="confirmarSenha"
        label="Confirmar senha:"
        type="password"
        maxlength="10"
        @keydown.enter="actions.permitirUsuario"
      />
    </v-card-text>
    <v-card-actions class="d-flex justify-end">
      <v-btn
        color="red"
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
