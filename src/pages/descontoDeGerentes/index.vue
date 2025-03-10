<script setup lang="ts">
import { actions, state } from "../descontoDeGerentes/descontoDeGerentes";
import { onMounted } from "vue";
import modalAlterarSenha from "./components/modalAlterarSenha.vue";
import modalPermitirUsuario from "./components/modalPermitirUsuario.vue";
import Swal from "sweetalert2";

onMounted(() => {
  actions.init();
});

function onDarPermissao() {
  if (!state.dbUsuarioSelecionado || !state.dbUsuarioSelecionado.COD_FUNCIONARIO) {
    Swal.fire("", "Selecione um usuário sem permissão!", "warning");
    return;
  }
  actions.abrirModalDarPermissao(state.dbUsuarioSelecionado);
}

function onRemoverPermissao() {
  if (!state.dbUsuarioSelecionado || !state.dbUsuarioSelecionado.COD_FUNCIONARIO) {
    Swal.fire("", "Selecione um usuário com permissão!", "warning");
    return;
  }
  actions.confirmRemoverPermissao(state.dbUsuarioSelecionado);
}

function onAlterarSenha() {
  if (!state.dbUsuarioSelecionado || !state.dbUsuarioSelecionado.COD_FUNCIONARIO) {
    Swal.fire("", "Selecione um usuário com permissão!", "warning");
    return;
  }
  actions.abrirModalAlterarSenha(state.dbUsuarioSelecionado);
}
</script>

<template>
  <v-container>
    <title>Desconto Gerentes</title>
    <v-card
      class="pa-5 mx-auto"
      max-width="1000px"
    >
      <v-row>
        <v-col cols="5">
          <h4 class="mb-3">Usuários sem permissão</h4>
          <div
            id="pnUsuariosSemPermissao"
            style="height: 400px"
          ></div>
        </v-col>

        <v-col
          cols="1"
          class="d-flex flex-column align-center justify-center"
        >
          <v-btn
            icon
            color="primary"
            size="39"
            @click="onDarPermissao"
          >
            <v-icon>mdi-arrow-right-bold</v-icon>
          </v-btn>
          <v-btn
            icon
            color="primary"
            size="39"
            class="mt-3"
            @click="onRemoverPermissao"
          >
            <v-icon>mdi-arrow-left-bold</v-icon>
          </v-btn>
        </v-col>

        <v-col cols="6">
          <h4 class="mb-3">Usuários com permissão</h4>
          <div
            id="pnUsuariosComPermissao"
            style="height: 400px"
          ></div>

          <v-btn
            color="primary"
            class="mt-3"
            @click="onAlterarSenha"
          >
            Alterar Senha
          </v-btn>
        </v-col>
      </v-row>

      <v-overlay
        :model-value="state.loading"
        class="align-center justify-center"
        persistent
      >
        <v-progress-circular
          color="primary"
          indeterminate
          size="64"
        ></v-progress-circular>
      </v-overlay>

      <div
        id="pnCodigoTela"
        class="mt-3 text-center"
        >descontoDeGerentes</div
      >
    </v-card>

    <v-dialog
      v-model="state.modalAlterarSenha"
      max-width="300"
    >
      <modalAlterarSenha
        @fecharModalAlterar="state.modalAlterarSenha = false"
        @senhaalterada="state.modalAlterarSenha = false"
      />
    </v-dialog>

    <v-dialog
      v-model="state.modalPermitirUsuario"
      max-width="300"
    >
      <modalPermitirUsuario @fecharModalPermitir="state.modalPermitirUsuario = false" />
    </v-dialog>
  </v-container>
</template>

<style scoped>
h4 {
  text-align: center;
}
</style>
