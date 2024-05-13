<script setup lang="ts">
import { nextTick } from "vue";
import { state, actions, computeds } from "./whatsapp";
import CardUsuario from "./components/CardUsuario.vue";

nextTick(async () => {
  actions.init();
});
</script>

<template>
  <v-container>
    <v-card
      width="1100"
      class="pa-5"
      style="margin: 0 auto"
    >
      <div class="mb-4 d-flex justify-space-between">
        <span>
          Tempo espera mais longo: <strong>{{ computeds.tempoEsperaMaisLongo }}</strong>
        </span>
        <span>
          Tempo médio espera fila: <strong>{{ computeds.tempoMedioEsperaFila }}</strong>
        </span>
        <span>
          Conversas em aberto: <strong>{{ state.conversasAbertas.length }}</strong>
        </span>
      </div>
      <div class="mb-4"> </div>
      <div class="container-usuarios">
        <CardUsuario
          :nome="'Não atribuído'"
          :conversas="computeds.conversasSemUsuario.value"
        />
        <CardUsuario
          v-for="usuario in state.usuarios"
          :nome="usuario.nome"
          :conversas="computeds.conversasAbertasPorUsuario.value[usuario.assigned_user] || []"
        />
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
    <div id="pnCodigoTela">whatsapp</div>
  </v-container>
</template>

<style scoped lang="scss">
.container-usuarios {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  max-height: 480px;
  overflow-y: auto;
}
</style>
