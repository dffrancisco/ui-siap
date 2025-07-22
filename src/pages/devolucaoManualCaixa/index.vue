<script setup lang="ts">
import utils from "@/ts/utils";
import { state, actions } from "./devolucaoManualCaixa";
import Loading from "@/components/Loading.vue";
import cards from "./components/cards.vue";
</script>

<template>
  <v-container class="bg-red v-cointainer-pai">
    <cards></cards>

    <v-dialog>
        <v-card>
            
        </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.v-cointainer-pai {
  height: 20rem;
  display: flex;
  gap: 2rem;
}

.cards-filho {
  max-width: 100%;
  width: 15rem;
  height: 4rem;
  padding: 2px;
  border-radius: 15px;
}

</style>
