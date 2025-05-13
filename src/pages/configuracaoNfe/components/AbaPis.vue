<script setup lang="ts">
import { onMounted, reactive, watch } from "vue";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import utils from "@/ts/utils";
import { regimeTributarioOptions } from "../configuracaoNfe";
import { iPis } from "../interfaces";

const statePis = reactive({
  grid: {} as ixGridCreate,
  pis: {} as iPis,
  loading: false,
  gridPis: <ixGridCreate>{},
});

const props = defineProps({
  pis: Object,
  abaOpened: Boolean,
});

watch(
  () => props.abaOpened,
  async () => {
    if (props.abaOpened) {
      statePis.grid.source(props.pis);
    }
  }
);

const actionsPis = {
  async init() {
    await actionsPis.gridPis();
  },
  gridPis() {
    statePis.grid = new xGridV2.create({
      el: "#gridPis",
      height: 365,
      count: true,
      columns: {
        "Regime Tributário": { dataField: "DESCRICAO" },
        Valor: { dataField: "P_VALOR", width: "20%", render: utils.formatValor },
      },
      sideBySide: {
        el: "#pnPisCampos",
        vModel(r) {
          statePis.pis = r;
        },
      },
    });
  },
};

onMounted(async () => {
  await actionsPis.init();
});
</script>

<template width="600" class="pa-1 ma-auto">
  <v-form id="pnPisCampos">
    <v-row dense>
      <v-col
        cols="4"
        class="pb-5"
      >
        <v-select
          v-model="statePis.pis.ID_REGIME_TRIBUTARIO"
          label="Regime Tributário"
          :items="regimeTributarioOptions"
          item-title="text"
          item-value="value"
          :disabled="true"
        />
      </v-col>
      <v-col cols="3">
        <v-text-field
          v-model="statePis.pis.P_VALOR"
          label="Valor do PIS"
          :disabled="true"
          type="number"
        />
      </v-col>
    </v-row>
  </v-form>

  <div
    id="gridPis"
    class="mb-4"
  ></div>
</template>
