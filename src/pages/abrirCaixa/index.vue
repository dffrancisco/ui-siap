<script setup lang="ts">
import { onMounted } from "vue";
import { actions, state, funcionariosDisponiveis } from "./abrirCaixa";
import ModalAbrirCaixa from "./components/modalAbrirCaixa.vue";
import utils from "@/ts/utils";
import modalXAuthManager from "@/plugins/xAuthManager/index.vue";

onMounted(async () => {
  await actions.init();
});
</script>

<template>
  <v-container>
    <v-card
      :max-width="850"
      class="ma-auto pa-4"
    >
      <div
        class="abrirMdc"
        v-if="!state.mdc"
      >
        <v-btn
          color="primary"
          @click="actions.abrirMDC"
        >
          Abrir MDC
        </v-btn>
      </div>

      <div v-else>
        <v-row>
          <v-col>
            <p class="mdcAberto"
              ><strong>{{ state.mdc.OPEN_CLOSE }}</strong>
              <button>
                <v-icon
                  size="30px"
                  class="ml-5"
                  color="primary"
                  title="Abrir Caixa"
                  @click="actions.abrirModal"
                >
                  mdi-plus-circle
                </v-icon>
              </button>
            </p>
          </v-col>
        </v-row>
      </div>

      <div
        v-if="state.caixasAbertos.length"
        class="funcionarios_caixa"
      >
        <v-card
          v-for="funcionario in state.caixasAbertos"
          :key="funcionario.ID_ABERTURA_CAIXA"
          :class="{ funcionario_caixa_fechado: funcionario.STATUS === 2 }"
          class="funcionarios_caixa_card"
        >
          <v-row>
            <v-col cols="2">
              <div class="funcionario_card_avatar">
                <v-avatar
                  size="60px"
                  color="primary"
                  :title="funcionario.LOGIN"
                  class="funcionarios_caixa_avatar"
                >
                  <v-img
                    :src="actions.getFotoFuncionarioURL(funcionario.CPF)"
                    aspect-ratio="1"
                    cover
                  ></v-img>
                </v-avatar> </div
            ></v-col>
            <v-col cols="7"
              ><div class="funcionarios_caixa_dados">
                <p class="funcionarios_caixa_card_nome"> {{ funcionario.LOGIN }} </p>
                <p class="funcionarios_caixa_card_hora">
                  Caixa Aberto: {{ utils.formatHoraSemOsSegundos(funcionario.HORA_ABERTURA) }}
                </p>
                <p
                  v-if="funcionario.STATUS == 2"
                  class="funcionarios_caixa_card_status"
                >
                  Caixa Fechado: {{ utils.formatHoraSemOsSegundos(funcionario.HORA_FECHAMENTO) }}
                </p>
              </div></v-col
            >
            <v-col cols="3"
              ><div v-if="funcionario.STATUS == 1">
                <button
                  class="circle-icon-button"
                  @click="actions.redirecionarParaConferencia()"
                >
                  <v-icon
                    size="25px"
                    color="white"
                    title="Redirecionar para Conferência de Caixa"
                  >
                    mdi-lock
                  </v-icon>
                </button>
              </div></v-col
            >
          </v-row>
        </v-card>
      </div>

      <!-- Caso não existam caixas abertos -->
      <div
        v-else
        class="funcionarios_caixa_vazia"
      >
        <p v-if="state.mdc != null">Nenhum caixa aberto no momento.</p>
      </div>
    </v-card>
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
    <div id="pnCodigoTela">abrirCaixa</div>
  </v-container>

  <v-dialog v-model="state.modalAbrirCaixaOpened">
    <ModalAbrirCaixa
      :funcionarios="funcionariosDisponiveis"
      :modalOpened="state.modalAbrirCaixaOpened"
      @closeModalAbrirCaixa="state.modalAbrirCaixaOpened = false"
      @dadosAbrirCaixa.sync="actions.abrirCaixa"
    />
  </v-dialog>

  <modalXAuthManager />
</template>

<style scoped>
.abrirMdc {
  display: flex;
  justify-content: center;
  align-items: center;
}

.mdcAberto {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
}

.funcionarios_caixa {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 16px;
  max-width: 840px;
  padding: 10px;
  overflow: auto;
  max-height: 450px;
}

.funcionario_caixa_fechado {
  border: 1px solid #434343 !important;
  background: linear-gradient(-11deg, rgb(134, 143, 150), rgb(89, 97, 100)) !important;
}

.funcionarios_caixa_card {
  width: 382px;
  border: 1px solid #2196f3;
  background: linear-gradient(90deg, rgb(19, 84, 122), rgb(128, 208, 199));
  padding: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.funcionarios_caixa_card_usuario {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.funcionarios_caixa_card_status {
  font-size: 14px;
  color: #fffafa;
  margin-top: 4px;
}

.funcionarios_caixa_dados {
  display: flex;
  flex-direction: column;
  margin-left: 20px;
}

.funcionarios_caixa_card_nome {
  font-weight: bold;
  font-size: 14px;
  color: #fffafa;
  padding-bottom: 5px;
}

.funcionarios_caixa_card_hora {
  font-size: 14px;
  color: #fffafa;
}

.funcionarios_caixa_vazia {
  padding: 16px;
  text-align: center;
  font-size: 16px;
  color: #888;
}

.funcionarios_caixa_avatar {
  border: 1px solid #003d6f;
}

.circle-icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #3c8dbc;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.circle-icon-button:hover {
  background-color: #1a5c82;
}

.circle-icon-button v-icon {
  color: white;
}
</style>
