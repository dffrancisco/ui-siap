<script setup lang="ts">
import { state } from "../gerenciarFolhaPontoDetalhes";
const emit = defineEmits(["justificarAusencia"]);
</script>

<template>
  <div class="modal-justificar-falta">
    <v-row>
      <span>Hello Modal</span>
      <b>dataAusencia</b>
    </v-row>
  </div>
</template>
