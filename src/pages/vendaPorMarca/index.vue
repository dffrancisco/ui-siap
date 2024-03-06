<script setup lang="ts">
import { state } from "./vendaPorMarca";
</script>

<template>
  <v-container>
    <v-card>
      <v-row class="pa-5">
        <v-col>
          <v-autocomplete
            label="Mês"
            autocomplete="off"
          ></v-autocomplete>
        </v-col>
        <v-col>
          <v-text-field
            v-model="state.teste"
            label="Ano"
            density="default"
            variant="filled"
            maxlength="4"
            v-mask="'####'"
          ></v-text-field>
        </v-col>
        <v-col class="d-flex justify-center align-center"
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
