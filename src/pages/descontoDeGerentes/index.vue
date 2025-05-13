<script setup lang="ts">
import { actions, state } from "../descontoDeGerentes/descontoDeGerentes";
import { onMounted } from "vue";
import modalAlterarSenha from "./components/modalAlterarSenha.vue";
import modalPermitirUsuario from "./components/modalPermitirUsuario.vue";

onMounted(() => {
  actions.init();
});
</script>

<template>
  <v-container>
    <title>Desconto Gerentes</title>
    <v-card
      class="pa-5 mx-auto"
      max-width="800px"
    >
      <div class="d-flex">
        <div class="flex-grow-1">
          <h4 class="mb-3">Usuários sem permissão</h4>
          <div
            id="pnUsuariosSemPermissao"
            style="height: 400px"
          ></div>
        </div>

        <div
          class="d-flex flex-column align-items-center"
          style="margin-left: 10px; margin-right: 10px"
        >
          <v-btn
            style="margin-top: 200px"
            icon="mdi-chevron-right mdi-24px"
            color="primary"
            title="Conceder permissão"
            size="x-small"
            @click="actions.onDarPermissao"
          >
          </v-btn>
          <v-btn
            style="margin-top: 10px"
            icon="mdi-chevron-left mdi-24px"
            title="Remover permissão"
            color="primary"
            size="x-small"
            @click="actions.onRemoverPermissao"
          >
          </v-btn>
        </div>

        <div class="flex-grow-1">
          <h4 class="mb-3">Usuários com permissão</h4>
          <div
            id="pnUsuariosComPermissao"
            style="height: 400px"
          ></div>
          <div class="d-flex justify-end">
            <v-btn
              size="small"
              class="mt-3"
              @click="actions.onAlterarSenha"
              variant="text"
            >
              Alterar Senha
            </v-btn>
          </div>
        </div>
      </div>

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
    </v-card>
    <div id="pnCodigoTela">descontoDeGerentes</div>

    <v-dialog
      v-model="state.modalAlterarSenha"
      max-width="300"
    >
      <modalAlterarSenha
        :usuario-selecionado="state.dbUsuarioSelecionado"
        @fecharModalAlterar="state.modalAlterarSenha = false"
        @senhaalterada="state.modalAlterarSenha = false"
      />
    </v-dialog>

    <v-dialog
      v-model="state.modalPermitirUsuario"
      max-width="300"
    >
      <modalPermitirUsuario
        :usuario-selecionado="state.dbUsuarioSelecionado"
        @fecharModalPermitir="state.modalPermitirUsuario = false"
        @senhaalterada="actions.onPermissaoConcedida"
      />
    </v-dialog>
  </v-container>
</template>

<style scoped>
h4 {
  text-align: center;
}
</style>
