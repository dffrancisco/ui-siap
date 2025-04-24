<script setup lang="ts">
import { onMounted, reactive, watch } from "vue";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import Swal from "sweetalert2";
import utils from "@/ts/utils";
import { regimeTributarioOptions } from "../configuracaoNfe";
import serviceNfe from "../services/configuracaoNfe.service";
import { iPis } from "../interfaces";

const statePis = reactive({
  grid: {} as ixGridCreate,
  pis: {} as iPis,
  loading: false,
  isEditing: false,
  gridPis: <ixGridCreate>{},
});

const props = defineProps({
  pis: Object,
  abaOpened: Boolean,
  pisLista: Array,
  isEditable: Boolean,
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
      height: 335,
      count: true,
      columns: {
        Valor: { dataField: "P_VALOR", width: "47%", render: utils.formatValor },
        "Código Regime Tributário": { dataField: "ID_REGIME_TRIBUTARIO", width: "49%" },
      },

      query: {
        async execute() {
          const dados = await actionsPis.getDadosParaInputs();
          statePis.grid.querySourceAdd(dados);
        },
      },
      sideBySide: {
        el: "#pnPisCampos",
        vModel(r) {
          statePis.pis = r;
        },
      },

      enter: function () {
        document.getElementById("btnPisUpdate")?.click();
      },
    });
  },

  async getDadosParaInputs() {
    try {
      statePis.loading = true;

      const data = await serviceNfe.getDadosParaInputs();

      statePis.pis = { ...data.pis[0] };

      return data.pis;
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Erro ao buscar os dados iniciais!",
      });
      return [];
    } finally {
      statePis.loading = false;
    }
  },
};

onMounted(async () => {
  await actionsPis.init();
});
</script>

<template width="600" class="pa-1 ma-auto">
  <v-form id="pnPisCampos">
    <v-row dense>
      <v-col cols="4">
        <v-select
          v-model="statePis.pis.ID_REGIME_TRIBUTARIO"
          label="Regime Tributário"
          :items="regimeTributarioOptions"
          item-title="text"
          item-value="value"
          :disabled="!statePis.isEditing"
          outlined
          :clearable="false"
        />
      </v-col>
      <v-col cols="3">
        <v-text-field
          v-model="statePis.pis.P_VALOR"
          label="Valor do PIS"
          :disabled="!statePis.isEditing"
          type="text"
          :clearable="false"
        />
      </v-col>
    </v-row>
  </v-form>

  <div
    id="gridPis"
    class="mb-4"
  ></div>
</template>

<style scoped>
.v-card {
  box-shadow: 0 3px 15px rgba(128, 93, 93, 0.1);
}
.v-select,
.v-text-field {
  margin-bottom: 12px;
}
</style>
