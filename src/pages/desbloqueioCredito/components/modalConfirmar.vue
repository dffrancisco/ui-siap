<script setup lang="ts">
import utils from "@/ts/utils";
import { confirmaCodigo } from "@/ts/utils";
import Swal from "sweetalert2";
import { state, actions } from "../desbloqueioCredito";
</script>

<template>
  <v-container class="container-modal d-flex flex-column align-center bg-white ga-0">
    <div
      class="section-detalhes d-flex align-center flex-column justify-md-space-evenly"
      v-for="confirmaItens in state.listaDadosCredito"
    >
      <h1>Deseja liberar o crédito: {{ confirmaItens.CHAVE }}</h1>
      <p class="text-h6 font-weight-black"> CPF: {{ confirmaItens.CPF_CNPJ }}</p>
      <p class="text-h6 font-weight-black"> Bloqueado: {{ confirmaItens.BLOQUEADO }}</p>
      <p class="text-h6 font-weight-black"> Valor: {{ confirmaItens.VALOR }} </p>

      <div class="d-flex ga-2">
        <v-btn
          v-for="chave in state.listaDadosCredito"
          @click="actions.updateCredito(chave.CHAVE)"
          class="botao bg-green"
        >
          confirmar
        </v-btn>
        <v-btn
          @click="actions.AbreModalConfirmar"
          class="botao bg-red"
        >
          cancelar
        </v-btn>
      </div>
    </div>
  </v-container>
</template>

<style scoped>
.container-modal {
  width: 37%;
  height: 25rem;
}

.section-detalhes {
  height: 100%;
  width: 100%;
}

.botao {
  width: 11rem;
  max-width: 100%;
}
</style>
