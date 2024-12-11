<script setup lang="ts">
import { onMounted } from "vue";
import { actions, state } from "./abrirCaixa";
import ModalAbrirCaixa from "./components/modalAbrirCaixa.vue";

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
                  @click="state.modalAbrirCaixaOpened = true"
                >
                  mdi-plus-circle
                </v-icon>
              </button>
            </p>
          </v-col>
        </v-row>
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
    />
  </v-dialog>
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
</style>
