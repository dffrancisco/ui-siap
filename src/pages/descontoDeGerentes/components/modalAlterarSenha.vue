<script setup lang="ts">
import { reactive } from "vue";
import Swal from "sweetalert2";
import serviceDescontoDeGerentes from "../services/descontoDeGerentes.service";
import { iUsuario, iParamAlterarSenha } from "../interfaces";

const emit = defineEmits(["cancelar", "senhaalterada"]);

const props = defineProps({
  usuarioSelecionado: {
    type: Object as () => iUsuario,
    required: true,
  },
});

const state = reactive({
  senhaAtual: "",
  novaSenha: "",
  confirmarSenha: "",
  loading: false,
});

async function validarCampos() {
  if (!state.senhaAtual || !state.novaSenha || !state.confirmarSenha) {
    Swal.fire("Atenção", "Preencha todos os campos!", "warning");
    return false;
  }

  if (state.novaSenha !== state.confirmarSenha) {
    Swal.fire("Atenção", "As senhas não coincidem!", "warning");
    return false;
  }

  return true;
}

async function confirmarAlteracao() {
  if (!(await validarCampos())) return;

  try {
    state.loading = true;

    const params: iParamAlterarSenha = {
      COD_FUNCIONARIO: props.usuarioSelecionado.COD_FUNCIONARIO,
      SENHA_ATUAL: state.senhaAtual,
      SENHA: state.novaSenha,
    };

    await serviceDescontoDeGerentes.alterarSenha(params);

    Swal.fire("Sucesso", "Senha alterada com sucesso!", "success");
    emit("senhaalterada");
    fecharModal();
  } catch (error: any) {
    const mensagem = error.response?.data?.message || "Falha na alteração da senha";
    Swal.fire("Erro", mensagem, "error");
  } finally {
    state.loading = false;
  }
}

function fecharModal() {
  state.senhaAtual = "";
  state.novaSenha = "";
  state.confirmarSenha = "";
  emit("cancelar");
}
</script>

<template>
  <v-card class="pa-4">
    <v-card-title class="text-h5 mb-4"> Alterar Senha - {{ usuarioSelecionado.NOME_COMP }} </v-card-title>

    <v-text-field
      v-model="state.senhaAtual"
      label="Senha Atual *"
      type="password"
      outlined
      dense
      class="mb-4"
      :disabled="state.loading"
    />

    <v-text-field
      v-model="state.novaSenha"
      label="Nova Senha *"
      type="password"
      outlined
      dense
      class="mb-4"
      :disabled="state.loading"
    />

    <v-text-field
      v-model="state.confirmarSenha"
      label="Confirmar Nova Senha *"
      type="password"
      outlined
      dense
      class="mb-4"
      :disabled="state.loading"
    />

    <v-divider class="my-4" />

    <v-card-actions class="d-flex justify-end">
      <v-btn
        variant="outlined"
        color="error"
        @click="fecharModal"
        :disabled="state.loading"
      >
        Cancelar
      </v-btn>

      <v-btn
        color="primary"
        @click="confirmarAlteracao"
        :loading="state.loading"
      >
        Confirmar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
