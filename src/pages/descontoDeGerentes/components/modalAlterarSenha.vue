<script setup lang="ts">
import { reactive, defineProps } from "vue";
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

const actions = {
  async validarCampos() {
    if (!state.senhaAtual || !state.novaSenha || !state.confirmarSenha) {
      Swal.fire("Atenção", "Preencha todos os campos!", "warning");
      return false;
    }
    if (state.novaSenha !== state.confirmarSenha) {
      Swal.fire("Atenção", "As senhas não coincidem!", "warning");
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
      Swal.fire("Sucesso", "Senha alterada com sucesso!", "success");
      emit("senhaalterada");
      actions.fecharModalAlterar();
    } catch (error: any) {
      const mensagem = error.response?.data?.message || "Falha na alteração da senha";
      Swal.fire("Erro", mensagem, "error");
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
        label="Senha atual:"
        type="password"
        class="mb-2"
        :disabled="state.loading"
      />
      <v-text-field
        v-model="state.novaSenha"
        label="Nova senha:"
        type="password"
        class="mb-2"
        :disabled="state.loading"
      />
      <v-text-field
        v-model="state.confirmarSenha"
        label="Confirmar nova senha:"
        type="password"
        :disabled="state.loading"
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
