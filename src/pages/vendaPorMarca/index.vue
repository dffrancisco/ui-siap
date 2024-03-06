<script setup lang="ts">
import { state } from "./vendaPorMarca";
</script>

<template>
  <v-container>
    <v-card>
      <v-data-table
        :headers="state.headers"
        :items="state.itens"
      ></v-data-table>
    </v-card>
  </v-container>
</template>
