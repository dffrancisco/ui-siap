<script setup lang="ts">
import utils from "@/ts/utils";
import { confirmaCodigo } from "@/ts/utils";
import Swal from "sweetalert2";
import {state,actions} from "../desbloqueioCredito"


</script>

<template>
  <v-container class="container-modal d-flex flex-column align-center bg-white ga-0">
    <h1>Deseja liberar o crédito:</h1>
    <div class="section-detalhes d-flex align-center flex-column justify-md-space-evenly"
     v-for="confirmaItens in state.listaDadosCredito">

        <p class="text-h6 font-weight-bold"> CPF: {{ confirmaItens.CPF_CNPJ}}</p>
        <p class="text-h6 font-weight-bold"> Bloqueado: {{ confirmaItens.BLOQUEADO }}</p>
        <p class="text-h6 font-weight-bold"> Valor: {{ confirmaItens.VALOR  }}</p>


      <div class="d-flex ga-2">
        <v-btn @click="actions.getAlteraTabela" class=" botao bg-green"> confirmar </v-btn>
        <v-btn @click="actions.AbreModalConfirmar" class=" botao bg-red"> cancelar </v-btn>
      </div>
    </div>
  </v-container>
</template>

<style scoped>
.container-modal {
  width: 34%;
  height: 20rem;
}

.section-detalhes {
  height: 100%;
  width: 100%;
}

.botao{
    width: 11rem;
    max-width: 100%;
}
</style>
