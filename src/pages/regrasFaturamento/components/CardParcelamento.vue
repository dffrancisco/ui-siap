<script lang="ts" setup>
import utils from "@/ts/utils";
import { iRegraFaturamentoParcelas } from "../interfaces";
import { msgConfirm } from "@/ts/message";

const props = defineProps({
  regraFaturamentoParcelas: {
    type: Array as () => iRegraFaturamentoParcelas[],
    required: true,
    default: [],
  },
});

const emits = defineEmits(["deleteParcela", "editParcela"]);

const actions = {
  async deleteParcela(idRegraFaturamentoParcela: number) {
    if (await msgConfirm("Confirmação", "Confirma a exclusão desta parcela?")) {
      emits("deleteParcela", idRegraFaturamentoParcela);
    }
  },

  async editParcela(dbParcela: iRegraFaturamentoParcelas) {
    emits("editParcela", dbParcela);
  },
};
</script>

<template>
  <div
    v-if="props.regraFaturamentoParcelas.length == 0"
    class="d-flex justify-center"
  >
    <span class="text-subtitle-1 text-grey-darken-2">Não há regra de parcelamento cadastrada.</span>
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
            @click="actions.editParcela(parcela)"
            title="Editar"
            >mdi-pencil</v-icon
          >
          <v-icon
            @click="actions.deleteParcela(parcela.ID_REGRA_FATURAMENTO_PARCELA)"
            title="Deletar"
            >mdi-delete</v-icon
          >
        </td>
      </tr>
    </tbody>
  </v-table>
</template>
