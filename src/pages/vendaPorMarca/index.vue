<script setup lang="ts">
import { state } from "./vendaPorMarca";
</script>

<template>
  <v-container>
    <v-card>
      <v-row class="pa-5">
        <v-col cols="4">
          <v-autocomplete
            id="mes"
            label="Mês"
            item-title="title"
            item-value="value"
            autocomplete="off"
          ></v-autocomplete>
        </v-col>
        <v-col cols="4">
          <v-text-field
            label="Ano"
            class="input_ano"
            variant="filled"
          ></v-text-field>
        </v-col>
        <v-col class="ml-9 mt-4"
          ><v-btn color="primary mr-5"> <v-icon class="mr-2">mdi-magnify </v-icon>Consultar </v-btn>
          <v-btn color="primary"> <v-icon class="mr-2">mdi-printer </v-icon>Imprimir </v-btn>
        </v-col>
      </v-row>
      <v-data-table
        :headers="state.headers"
        :items="state.itens"
      ></v-data-table>
    </v-card>
  </v-container>
</template>

<style scoped>
.input_ano {
  height: 94px;
}
</style>
