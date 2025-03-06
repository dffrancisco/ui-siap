<script setup lang="ts">
import { reactive } from "vue";
import Swal from "sweetalert2";
import descontoDeGerentesService from "../services/descontoDeGerentes.service";
import { iParamDarPermissao, iUsuario } from "../interfaces";

const props = defineProps<{
  usuario: iUsuario;
}>();

const emit = defineEmits<{
  (e: "cancelar"): void;
  (e: "permissaoConcedida"): void;
}>();

const state = reactive({
  senha: "",
  confirmarSenha: "",
});

function onClickCancelar() {
  emit("cancelar");
}

async function permitirUsuario() {
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
      COD_FUNCIONARIO: props.usuario.COD_FUNCIONARIO,
      SENHA: btoa(state.senha),
    };

    await descontoDeGerentesService.darPermissao(params);
    Swal.fire("Sucesso", "Permissão concedida com sucesso!", "success");
    emit("permissaoConcedida");
  } catch (error: any) {
    Swal.fire("Erro", error.response?.data?.message || "Falha ao conceder permissão", "error");
  }
}
</script>

<template>
  <v-container class="pa-1">
    <title>Permitir Usuário</title>
    <div>
      <v-row>
        <v-col cols="12">
          <span>Usuário</span>
          <input
            type="text"
            :value="props.usuario.NOME_COMP"
            class="ss"
            disabled
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <span>Senha</span>
          <input
            type="password"
            v-model="state.senha"
            class="ss"
            placeholder="Digite a senha"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <span>Confirmar Senha</span>
          <input
            type="password"
            btoa
            v-model="state.confirmarSenha"
            class="ss"
            placeholder="Confirme a senha"
          />
        </v-col>
      </v-row>
      <div class="btnContainer">
        <v-btn
          class="mt-2"
          style="text-transform: none; font-size: small"
          color="#3680AB"
          size="small"
          @click="onClickCancelar"
        >
          Cancelar
        </v-btn>
        <v-btn
          class="mt-2"
          style="font-size: small"
          color="#3680AB"
          size="small"
          @click="permitirUsuario"
        >
          Salvar
        </v-btn>
      </div>
    </div>
  </v-container>
</template>

<style scoped>
.btnContainer {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid gray;
  padding-top: 10px;
}
</style>
