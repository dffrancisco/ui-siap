<script setup lang="ts">
import { onMounted, reactive, watch } from "vue";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import utils from "@/ts/utils";
import { regimeTributarioOptions } from "../configuracaoNfe";
import { iCofins } from "../interfaces";

const stateCofins = reactive({
  grid: {} as ixGridCreate,
  cofins: {} as iCofins,
  loading: false,
  gridCofins: <ixGridCreate>{},
});

const props = defineProps({
  cofins: Object,
  abaOpened: Boolean,
});

watch(
  () => props.abaOpened,
  async () => {
    if (props.abaOpened) {
      stateCofins.grid.source(props.cofins);
    }
  }
);

const actionsCofins = {
  async init() {
    await actionsCofins.gridCofins();
  },

  gridCofins() {
    stateCofins.grid = new xGridV2.create({
      el: "#gridCofins",
      height: 365,
      count: true,
      columns: {
        "Regime Tributário": { dataField: "DESCRICAO" },
        Valor: { dataField: "P_VALOR", width: "20%", render: utils.formatValor },
      },
      sideBySide: {
        el: "#pnCofinsCampos",
        vModel(r) {
          stateCofins.cofins = r;
        },
      },
    });
  },
};

onMounted(async () => {
  await actionsCofins.init();
});
</script>

<template width="500" class="pa-4 ma-auto">
  <v-form id="pnCofinsCampos">
    <v-row dense>
      <v-col
        cols="4"
        class="pb-5"
      >
        <v-select
          v-model="stateCofins.cofins.ID_REGIME_TRIBUTARIO"
          label="Regime Tributário"
          :items="regimeTributarioOptions"
          item-title="text"
          :disabled="true"
          item-value="value"
        />
      </v-col>
      <v-col cols="3">
        <v-text-field
          v-model="stateCofins.cofins.P_VALOR"
          label="Valor do COFINS"
          :disabled="true"
          type="number"
        />
      </v-col>
    </v-row>
  </v-form>

  <div
    id="gridCofins"
    class="mb-4"
  ></div>
</template>
