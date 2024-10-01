<script lang="ts" setup>
import utils from "@/ts/utils";
import { iRegraFaturamentoParcelas } from "../interfaces";

const props = defineProps({
  regraFaturamentoParcelas: {
    type: Array as () => iRegraFaturamentoParcelas[],
    required: true,
    default: [],
  },
});
</script>

<template>
  <div
    v-if="props.regraFaturamentoParcelas.length == 0"
    class="d-flex justify-center"
  >
    <span class="text-subtitle-1 text-grey-darken-3">Não há regra de parcelamento cadastrada.</span>
  </div>

  <v-table
    v-else
    density="compact"
    style="border: 1px solid gray; max-height: 200px"
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
      <tr v-for="parcela in props.regraFaturamentoParcelas">
        <td>{{ utils.formatValor(parcela.FATURAMENTO_ACIMA_DE_VALOR) }}</td>
        <td>{{ utils.formatValor(parcela.FATURAMENTO_ATE_VALOR) }}</td>
        <td>{{ parcela.DIVISAO }}x</td>
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
