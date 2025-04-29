<script setup lang="ts">
import { onMounted, reactive, watch } from "vue";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import { iRegimeTributario } from "../interfaces";

const stateRegime = reactive({
  grid: {} as ixGridCreate,
  regimeTributario: {} as iRegimeTributario,
  loading: false,
  gridRegimeTributario: <ixGridCreate>{},
});

const props = defineProps({
  regimeTributario: Object,
  abaOpened: Boolean,
});

watch(
  () => props.abaOpened,
  async () => {
    if (props.abaOpened) {
      stateRegime.grid.source(props.regimeTributario);
    }
  }
);

const actionsRegime = {
  async init() {
    await actionsRegime.gridRegimeTributario();
  },

  gridRegimeTributario() {
    stateRegime.grid = new xGridV2.create({
      el: "#gridRegimeTributario",
      height: 365,
      count: true,
      columns: {
        "Código Regime Tributário": {
          dataField: "ID_REGIME_TRIBUTARIO",
          width: "47%",
        },
        Descrição: {
          dataField: "DESCRICAO",
          width: "49%",
        },
      },
      sideBySide: {
        el: "#pnRegimeCampos",
        vModel(r) {
          stateRegime.regimeTributario = r;
        },
      },
    });
  },
};

onMounted(async () => {
  await actionsRegime.init();
});
</script>

<template width="600" class="pa-2 ma-auto">
  <v-form id="pnRegimeCampos">
    <v-row dense>
      <v-col
        cols="4"
        class="pb-5"
      >
        <v-text-field
          v-model="stateRegime.regimeTributario.DESCRICAO"
          :disabled="true"
          label="Descrição"
          type="text"
        />
      </v-col>
    </v-row>
  </v-form>

  <div id="gridRegimeTributario"></div>
</template>
