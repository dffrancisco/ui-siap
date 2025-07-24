<script setup lang="ts">
import { dataBrasil } from "@/ts/utils";
import { iOrcamentosData } from "../interface";

const headers = [
  { title: "Data", align: "center", key: "DATA" },
  { title: "Quantidade", align: "center", key: "QTO" },
  { title: "Ação", align: "center", value: "actions" },
];

const props = defineProps({
  orcamentosData: {
    type: Array as () => iOrcamentosData[],
  },
});
</script>
<template>
  <v-card class="pa-5">
    <h1 class="mb-4 text-h5 font-weight-bold">Selecione a data</h1>
    <v-data-table
      :headers="headers"
      :items="props.orcamentosData"
      :header-props="{ class: 'pa-5 border' }"
      class="elevation-2 primary"
      max-height="400"
      height="320"
      item-value="name"
      hide-default-footer
    >
      <template v-slot:item="{ item }">
        <tr class="bg-white text-center">
          <td class="text-center text-subtitle-1">{{ dataBrasil(item.DATA) }}</td>
          <td class="text-center text-subtitle-1">{{ item.QTO }}</td>
          <td>
            <v-btn
              icon
              color="primary"
              density="comfortable"
              size="30"
            >
              <v-icon>mdi-arrow-right</v-icon>
            </v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
</template>

<style scoped></style>
