<script setup lang="ts">
import { block, show } from "@/ts/utils";
import { ref, onMounted } from "vue";
import { actions, state } from "./login";
import swal from "sweetalert2";
import globalActions from "@/store/globalActions";
import globalState from "@/store/globalState";
import version from "../../../package.json";

const edtFuncionario = ref();
const edtSenha = ref();

const cod_funcionario = ref("1");
const senha = ref("152056");
const id_sociedade = ref("vyzo");

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

  const rs = await actions.getLogin(cod_funcionario.value, _senha, id_sociedade.value);

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
  <v-btn
    @click="globalActions.toggleTheme()"
    variant="text"
    class="btnDark"
    color="white"
    icon="mdi-theme-light-dark"
  ></v-btn>

  <div class="header">
    <!--Content before waves-->
    <div class="inner-header flex">
      <!--Just the logo.. Don't mind this-->

      <div class="ct">
        <v-card
          max-width="350"
          class="mx-auto pa-5"
        >
          <v-row dense>
            <v-col cols="12 text-center">
              <div
                class="mb-5"
                style="text-align: center"
              >
                <img src="../../../public/icons/icon.png" />
              </div>
              <h2>Siap</h2>
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
            <v-col cols="12">
              <v-text-field
                density="compact"
                label="id_sociedade"
                variant="outlined"
                v-model="id_sociedade"
              ></v-text-field>
            </v-col>

            <v-col class="text-center">
              <v-btn
                color="primary"
                ref="btnEnter"
                rounded="lg"
                :disabled="state.btnLoad"
                @click="enter()"
              >
                <v-icon class="pr-2">mdi-lock-open-check</v-icon>
                Entrar
                <!-- <v-progress-circular
                  v-show="true"
                  indeterminate
                  color="secondary"
                ></v-progress-circular> -->
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
    </div>

    <div>
      <svg
        class="waves"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
        shape-rendering="auto"
      >
        <defs>
          <path
            id="gentle-wave"
            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
          />
        </defs>
        <g class="parallax">
          <use
            xlink:href="#gentle-wave"
            x="48"
            y="0"
          />
          <use
            xlink:href="#gentle-wave"
            x="48"
            y="3"
          />
          <use
            xlink:href="#gentle-wave"
            x="48"
            y="5"
          />
          <use
            xlink:href="#gentle-wave"
            x="48"
            y="7"
          />
        </g>
      </svg>
    </div>
    <!--Waves end-->
  </div>
  <!--Header ends-->

  <!--Content starts-->
  <div class="content flex">
    <p>©Real Acessórios 2022</p>
    <p class="ml-4">Versão: {{ version.version }}</p>
  </div>
  <!--Content ends-->
</template>

<style lang="scss" scoped>
.btnDark {
  position: fixed;
  top: 5px;
  left: 5px;
  z-index: 1;
}

.folha {
  // color: "red";
  fill: green;
  // fill: rgba(63, 76, 119, 0.8);
}

.ct {
  height: 100vh;
  // background: radial-gradient(#653d84, #332042);
  display: flex;
  justify-content: center;
  align-items: center;
}

.login {
  display: flex;
  // width: 380px;
  // min-width: 300px;
}

p {
  letter-spacing: 1px;
  font-size: 14px;
  // color: #333333;
}

.header {
  position: relative;
  text-align: center;
  background: linear-gradient(60deg, rgba(84, 58, 183, 1) 0%, rgba(0, 172, 193, 1) 100%);
  color: white;
}

.dark .header {
  background: linear-gradient(112.1deg, rgb(32, 38, 57) 11.4%, rgb(63, 76, 119) 70.2%);
}

.logo {
  width: 50px;
  fill: white;
  padding-right: 15px;
  display: inline-block;
  vertical-align: middle;
}

.inner-header {
  height: 75vh;
  width: 100%;
  margin: 0;
  padding: 0;
}

.flex {
  /*Flexbox for containers*/
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.waves {
  position: relative;
  width: 100%;
  height: 15vh;
  margin-bottom: -7px;
  /*Fix for safari gap*/
  min-height: 100px;
  max-height: 150px;
}

.content {
  position: relative;
  height: 10vh;
  text-align: center;
  background-color: white;
}

.dark .content {
  background-color: #38446b;
}

/* Animation */

.parallax > use {
  animation: move-forever 25s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
}

.parallax > use:nth-child(1) {
  animation-delay: -2s;
  animation-duration: 7s;
  fill: rgba(255, 255, 255, 0.7);
}

.dark .parallax > use:nth-child(1) {
  fill: rgba(32, 38, 57, 0.7);
}

.parallax > use:nth-child(2) {
  animation-delay: -3s;
  animation-duration: 10s;
  fill: rgba(255, 255, 255, 0.5);
}

.dark .parallax > use:nth-child(2) {
  fill: rgba(32, 38, 57, 0.5);
}

.parallax > use:nth-child(3) {
  animation-delay: -4s;
  animation-duration: 13s;
  fill: rgba(255, 255, 255, 0.3);
}

.dark .parallax > use:nth-child(3) {
  fill: rgba(32, 38, 57, 0.3);
}

.parallax > use:nth-child(4) {
  animation-delay: -5s;
  animation-duration: 20s;
  fill: rgba(255, 255, 255, 1);
}

.dark .parallax > use:nth-child(4) {
  fill: rgba(63, 76, 119, 0.8);
}

@keyframes move-forever {
  0% {
    transform: translate3d(-90px, 0, 0);
  }

  100% {
    transform: translate3d(85px, 0, 0);
  }
}

/*Shrinking for mobile*/
// @media (max-width: 768px) {
//   .waves {
//     height: 40px;
//     min-height: 40px;
//   }
//   .content {
//     height: 30vh;
//   }
//   h1 {
//     font-size: 24px;
//   }
// }
</style>
