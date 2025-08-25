<script setup lang="ts">
import { block, show } from "@/ts/utils";
import { ref, onMounted } from "vue";
import { actions, state } from "./login";
import swal from "sweetalert2";

const edtFuncionario = ref();
const edtSenha = ref();

const cod_funcionario = ref("");
const senha = ref("");

async function enter() {
  if (state.btnLoad) return;

  if (cod_funcionario.value == "") {
    await swal.fire({
      title: "Login",
      text: "Informa o código do funcionário para continuar",
      icon: "error",
    });
    setTimeout(edtFuncionario.value.focus, 500);
    return;
  }

  if (senha.value == "") {
    await swal.fire({
      title: "Login",
      text: "Informa a senha para continuar",
      icon: "error",
    });

    setTimeout(edtSenha.value.focus, 500);

    return;
  }

  let _senha = "";
  if (senha.value != "") _senha = block(senha.value);

  const rs = await actions.getLogin(cod_funcionario.value, _senha);

  if (rs.error) {
    await swal.fire({
      title: "Login",
      text: rs.error,
      icon: "error",
    });
    setTimeout(edtFuncionario.value.focus, 500);
    // show({
    //   msg: rs.error,
    //   onClose: () => {
    //     edtFuncionario.value.focus()
    //   }
    // });
  }
}

onMounted(() => {
  edtFuncionario.value.focus();
});
</script>

<template>
  <div class="ct">
    <v-card class="login pa-5 ma-3">
      <v-row dense>
        <v-col cols="12 text-center">
          <div
            class="mb-5"
            style="text-align: center"
          >
            <img src="../../../public/icons/icon.png" />
          </div>
          <h2>Taap</h2>
        </v-col>

        <v-col cols="12">
          <v-text-field
            density="compact"
            label="Código, CPF, Celular - Funcionário"
            variant="outlined"
            ref="edtFuncionario"
            v-model="cod_funcionario"
            clear-icon="mdi-close-circle"
            clearable
            @focus="$event.target.select()"
            @keydown.enter.stop.prevent="edtSenha.focus()"
          ></v-text-field
        ></v-col>

        <v-col cols="12">
          <v-text-field
            density="compact"
            label="Senha"
            variant="outlined"
            ref="edtSenha"
            id="edtSenha"
            v-model="senha"
            type="password"
            @keydown.enter.stop.prevent="enter()"
          ></v-text-field>
        </v-col>

        <v-col class="text-center">
          <v-btn
            color="primary"
            ref="btnEnter"
            rounded="lg"
            :disabled="true"
            @click="enter()"
          >
            <v-icon class="pr-2">mdi-lock-open-check</v-icon>
            Entrar
            <v-progress-circular
              v-show="true"
              indeterminate
              color="secondary"
            ></v-progress-circular>
          </v-btn>
        </v-col>
        <v-col
          cols="12"
          class="text-center"
        >
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<style lang="scss" scoped>
.ct {
  height: 100vh;
  background: radial-gradient(#653d84, #332042);
  display: flex;
  justify-content: center;
  align-items: center;
}

.login {
  display: flex;
  width: 380px;
  min-width: 300px;
}
</style>
