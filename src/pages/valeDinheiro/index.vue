<script setup lang="ts">
import { onMounted } from "vue";
import cValesAPagar from "./components/cValesAPagar.vue";
import { state, init, negarVale, alterarVale, pagarVale } from "./valeDinheiro";
import CValesPagos from "./components/cValesPagos.vue";

onMounted(async () => {
  await init();
});
</script>

<template>
  <v-main>
    <v-container>
      <v-card max-width="1000" class="mx-auto pa-3">
        <v-tabs v-model="state.tab" color="primary">
          <v-tab value="valesAPagar">Vales a Pagar</v-tab>
          <v-tab value="valesPagoDoMes">Pagos do mês</v-tab>
        </v-tabs>

        <v-card-text>
          <v-window v-model="state.tab">
            <v-window-item value="valesAPagar">
              <cValesAPagar
                :vales-a-pagar="state.valesAPagar"
                :loading="state.loading"
                :valor-disponivel="state.valorDisponivel"
                @negar-vale="negarVale"
                @alterar-vale="alterarVale"
                @pagar-vale="pagarVale"
              />
            </v-window-item>

            <v-window-item value="valesPagoDoMes">
              <CValesPagos
                v-if="state.tab === 'valesPagoDoMes'"
                :vales-a-pagar="state.valesAPagar"
                :loading="state.loading"
              />
            </v-window-item>
          </v-window>
        </v-card-text>
      </v-card>
    </v-container>
  </v-main>
</template>
