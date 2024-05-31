<script setup lang="ts">
import { nextTick, onUnmounted } from "vue";
import { state, actions, computeds } from "./whatsapp";
import CardUsuario from "./components/CardUsuario.vue";
import ModalUltimasConversas from "./components/ModalUltimasConversas.vue";

nextTick(async () => {
  actions.init();
});

onUnmounted(() => {
  clearInterval(state.interval);
});
</script>

<template>
  <v-container style="width: 1100px">
    <div class="mb-2">
      <v-btn
        color="primary"
        class="mr-2"
      >
        <v-icon class="mr-1">mdi-clock</v-icon>
        Tempo real
      </v-btn>
      <v-btn
        color="primary"
        variant="outlined"
        @click="actions.redirectToWhatsappPerformance()"
      >
        <v-icon>mdi-chart-areaspline</v-icon>
        Performance
      </v-btn>
    </div>
    <v-card class="pa-2">
      <div class="mb-4 d-flex justify-space-between align-center">
        <span @click="actions.openModalUltimasConversas">
          Tempo espera mais longo:
          <strong :class="{ 'text-error': computeds.tempoEsperaMaisLongo.value > 60 }">{{
            actions.formatarTempoEmMinutos(computeds.tempoEsperaMaisLongo.value)
          }}</strong>
        </span>
        <span>
          Tempo médio espera fila:
          <strong :class="{ 'text-error': computeds.tempoMedioEsperaFila.value > 30 }">{{
            actions.formatarTempoEmMinutos(computeds.tempoMedioEsperaFila.value)
          }}</strong>
        </span>
        <span>
          Conversas em aberto: <strong>{{ state.conversasAbertas.length }}</strong>
        </span>
        <v-btn
          color="primary"
          size="small"
          @click="actions.atualizarDados"
          >Atualizar</v-btn
        >
      </div>
      <div class="mb-4"> </div>
      <div class="container-usuarios">
        <CardUsuario
          :nome="'Não iniciado'"
          :msgsCallbell="state.msgsCallbell"
          :conversas="computeds.conversasSemUsuario.value"
          @openModalUltimasConversas="actions.openModalUltimasConversas"
        />
        <CardUsuario
          v-for="usuario in state.usuarios"
          :nome="usuario.nome"
          :conversas="computeds.conversasAbertasPorUsuario.value[usuario.assigned_user] || []"
          @openModalUltimasConversas="actions.openModalUltimasConversas"
        />
      </div>
    </v-card>

    <v-dialog
      v-model="state.modalUltimasConversasOpened"
      style="margin: 0 auto"
      width="375"
    >
      <ModalUltimasConversas
        @closeModalUltimasConversas="actions.closeModalUltimasConversas"
        :msgsCallbell="state.msgsCallbell"
      />
    </v-dialog>

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

    <div class="d-flex justify-space-between mt-1 mx-10">
      <div id="pnCodigoTela">whatsapp</div>
      <span class="ultima-atualizacao">
        Última atualização: <strong>{{ state.lastUpdate }}</strong>
      </span>
    </div>
  </v-container>
</template>

<style scoped lang="scss">
.container-usuarios {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  max-height: calc(100vh - 160px);
  overflow-y: auto;
}

.ultima-atualizacao {
  font-size: 10px;
  font-weight: 500;
  color: #495057;
}
</style>
