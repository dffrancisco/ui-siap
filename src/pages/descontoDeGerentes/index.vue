<script setup lang="ts">
import { actions, state } from "../descontoDeGerentes/descontoDeGerentes";
import { onMounted, onUnmounted } from "vue";
import { useEventListener } from "@vueuse/core";
import Swal from "sweetalert2";

onMounted(() => {
  actions.init();
});

const eventListener = useEventListener(document, "keydown", async (event) => {
  if (event.key === "F1") {
    event.preventDefault();
    event.stopPropagation();
  }
});

onUnmounted(() => {
  removeEventListener("keydown", eventListener);
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
            >Alterar Senha</v-btn
          >
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

    <ModalPermitirUsuario
      :usuario="state.dbUsuarioSelecionado"
      @cancelar="state.modalUsuarios.close()"
    />
  </v-container>
</template>

<style scoped>
h4 {
  text-align: center;
}
</style>
