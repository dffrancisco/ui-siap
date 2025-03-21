<script setup lang="ts">
import { reactive, defineProps, onMounted } from "vue";
import Swal from "sweetalert2";
import utils from "@/ts/utils";
import serviceDescontoDeGerentes from "../services/descontoDeGerentes.service";
import { iParamAlterarSenha, iUsuario } from "../interfaces";

const props = defineProps<{ usuarioSelecionado: iUsuario }>();

const emit = defineEmits(["fecharModalAlterar", "senhaalterada"]);

const state = reactive({
  senhaAtual: "",
  novaSenha: "",
  confirmarSenha: "",
  loading: false,
});

const mudarFoco = (proximoCampo: string) => {
  const campo = document.querySelector(`input[name="${proximoCampo}"]`);
  if (campo) {
    (campo as HTMLInputElement).focus();
  }
};

const actions = {
  async validarCampos() {
    if (!state.senhaAtual || !state.novaSenha || !state.confirmarSenha) {
      Swal.fire({
        icon: "warning",
        text: "Preencha todos os campos!",
      });
      return false;
    }
    if (state.novaSenha !== state.confirmarSenha) {
      Swal.fire({
        icon: "warning",
        text: "As senhas não coincidem!",
      });
      return false;
    }
    return true;
  },

  fecharModalAlterar() {
    emit("fecharModalAlterar");
  },

  async confirmarAlteracao() {
    if (!(await actions.validarCampos())) return;
    try {
      state.loading = true;

      const params: iParamAlterarSenha = {
        COD_FUNCIONARIO: props.usuarioSelecionado.COD_FUNCIONARIO,
        SENHA_ATUAL: utils.base64_encode(state.senhaAtual),
        SENHA: utils.base64_encode(state.novaSenha),
      };
      await serviceDescontoDeGerentes.alterarSenha(params);
      Swal.fire({
        icon: "success",
        text: "Senha alterada com sucesso!",
      });
      emit("senhaalterada");
      actions.fecharModalAlterar();
    } catch (error: any) {
      const mensagem = error.response?.data?.message || " Informe a senha atual correta";
      Swal.fire({
        icon: "error",
        text: mensagem,
      });
    } finally {
      state.loading = false;
    }
  },
};
</script>

<template>
  <v-card
    class="pa-2"
    max-width="400px"
  >
    <v-card-title class="text-h5">Alterar Senha</v-card-title>
    <v-card-text>
      <v-text-field
        v-model="state.senhaAtual"
        name="senhaAtual"
        label="Senha atual:"
        type="password"
        class="mb-2"
        maxlength="20"
        :disabled="state.loading"
        @keydown.enter="mudarFoco('novaSenha')"
      />
      <v-text-field
        v-model="state.novaSenha"
        name="novaSenha"
        label="Nova senha:"
        type="password"
        maxlength="20"
        class="mb-2"
        :disabled="state.loading"
        @keydown.enter="mudarFoco('confirmarSenha')"
      />
      <v-text-field
        v-model="state.confirmarSenha"
        name="confirmarSenha"
        label="Confirmar nova senha:"
        type="password"
        maxlength="20"
        :disabled="state.loading"
        @keydown.enter="actions.confirmarAlteracao"
      />
    </v-card-text>
    <v-card-actions class="d-flex justify-end">
      <v-btn
        color="red"
        @click="actions.fecharModalAlterar"
        :disabled="state.loading"
        small
      >
        Cancelar
      </v-btn>
      <v-btn
        color="primary"
        @click="actions.confirmarAlteracao"
        :loading="state.loading"
        small
      >
        Confirmar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped></style>
