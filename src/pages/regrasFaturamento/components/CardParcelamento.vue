<script lang="ts" setup>
import utils from "@/ts/utils";

const desserts = [
  { acimaDe: utils.formatValor(40.0), faturamentoAte: utils.formatValor(300.0), divisao: 1 },
  { acimaDe: utils.formatValor(500.0), faturamentoAte: "---", divisao: 3 },
];
</script>

<template>
  <v-table
    density="compact"
    style="border: 1px solid gray"
    class="rounded-lg"
  >
    <thead>
      <tr>
        <th> De </th>
        <th> Até </th>
        <th> Divisão </th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in desserts"
        :key="item.acimaDe"
      >
        <td>{{ item.acimaDe }}</td>
        <td>{{ item.faturamentoAte }}</td>
        <td>{{ item.divisao }}x</td>
        <td class="d-flex align-center justify-end ga-2">
          <v-icon
            @click=""
            title="Editar"
            >mdi-pencil</v-icon
          >
          <v-icon
            @click=""
            title="Deletar"
            >mdi-delete</v-icon
          >
        </td>
      </tr>
    </tbody>
  </v-table>
</template>
