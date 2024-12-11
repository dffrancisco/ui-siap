<script setup lang="ts">
import { onMounted } from "vue";
import { actions, state } from "./abrirCaixa";
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
      :max-width="1000"
      class="ma-auto pa-4"
    >
      <div
        class="abrirMdc"
        v-if="!state.mdc"
      >
        <!-- Botão para abrir MDC quando não há dados -->
        <v-btn
          color="primary"
          @click="actions.abrirMDC"
        >
          Abrir MDC
        </v-btn>
      </div>

      <div v-else>
        <!-- Informações de OPEN_CLOSE quando existem dados -->
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
          class="funcionarios_caixa_card"
        >
          <div class="funcionarios_caixa_card_usuario">
            <!-- Avatar com a foto do funcionário -->
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
              </v-avatar>
            </div>

            <!-- Dados do funcionário -->
            <div class="funcionarios_caixa_dados">
              <p class="funcionarios_caixa_card_nome"> {{ funcionario.LOGIN }} </p>
              <p class="funcionarios_caixa_card_hora">
                Aberto: {{ utils.formatHoraSemOsSegundos(funcionario.HORA_ABERTURA) }}
              </p>
            </div>

            <div>
              <button>
                <v-icon
                  size="25px"
                  class="ml-5"
                  color="white"
                  title="Fechar Caixa"
                  @click="actions.fecharCaixa(funcionario)"
                >
                  mdi-lock
                </v-icon>
              </button>
            </div>
          </div>
        </v-card>
      </div>

      <!-- Caso não existam caixas abertos -->
      <div
        v-else
        class="funcionarios_caixa_vazia"
      >
        <p>Nenhum caixa aberto no momento.</p>
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

  <v-dialog
    v-model="state.modalAbrirCaixaOpened"
    max-width="800"
    style="margin-right: 150px"
  >
    <ModalAbrirCaixa
      :funcionarios="state.funcionarios"
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
  gap: 16px;
  width: 840px;
  padding: 10px;
}

.funcionarios_caixa_card {
  width: 260px;
  /* background-color: #d0eaffa7; */
  border: 1px solid #2196f3;
  background: linear-gradient(90deg, rgb(128, 208, 199), rgb(19, 84, 122));
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

.funcionarios_caixa_dados {
  display: flex;
  flex-direction: column;
}

.funcionarios_caixa_card_nome {
  font-weight: bold;
  font-size: 14px;
  color: #fffafa;
  margin: 0;
}

.funcionarios_caixa_card_hora {
  font-size: 14px;
  color: #fffafa;
  margin: 0;
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
</style>
