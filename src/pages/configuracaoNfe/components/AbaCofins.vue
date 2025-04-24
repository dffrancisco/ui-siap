<script setup lang="ts">
import { onMounted, reactive, nextTick, watch } from "vue";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import Swal from "sweetalert2";
import { msgConfirm } from "@/ts/message";
import utils from "@/ts/utils";
import { regimeTributarioOptions } from "../configuracaoNfe";
import serviceNfe from "../services/configuracaoNfe.service";
import { iCofins } from "../interfaces";

const stateCofins = reactive({
  grid: {} as ixGridCreate,
  cofins: {} as iCofins,
  loading: false,
  isEditing: false,
  cofinsLista: [] as iCofins[],
  gridCofins: <ixGridCreate>{},
});

const props = defineProps({
  cofins: Object,
  abaOpened: Boolean,
  isEditable: Boolean,
  cofinsLista: Array,
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
      height: 335,
      count: true,
      columns: {
        Valor: { dataField: "P_VALOR", width: "47%", render: utils.formatValor },
        "Código Regime Tributário": { dataField: "ID_REGIME_TRIBUTARIO", width: "49%" },
      },

      query: {
        async execute() {
          const dados = await actionsCofins.getDadosParaInputs();
          stateCofins.grid.querySourceAdd(dados);
        },
      },
      sideBySide: {
        el: "#pncofinsCampos",
        vModel(r) {
          stateCofins.cofins = r;
        },
      },
      enter: function () {
        document.getElementById("btnConfinsUpdate")?.click();
      },
    });
  },

  async getDadosParaInputs() {
    try {
      stateCofins.loading = true;

      const data = await serviceNfe.getDadosParaInputs();

      stateCofins.cofins = { ...data.cofins[0] };

      stateCofins.cofinsLista = data.cofins;
      return data.cofins;
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Erro ao buscar os dados iniciais!",
      });
      return [];
    } finally {
      stateCofins.loading = false;
    }
  },
};

onMounted(async () => {
  await actionsCofins.init();
});
</script>

<template width="500" class="pa-4 ma-auto">
  <v-form id="pncofinsCampos">
    <v-row dense>
      <v-col cols="4">
        <v-select
          v-model="stateCofins.cofins.ID_REGIME_TRIBUTARIO"
          label="Regime Tributário"
          :items="regimeTributarioOptions"
          item-title="text"
          :disabled="!stateCofins.isEditing"
          item-value="value"
          :clearable="false"
        />
      </v-col>
      <v-col cols="3">
        <v-text-field
          v-model="stateCofins.cofins.P_VALOR"
          label="Valor do COFINS"
          :disabled="!stateCofins.isEditing"
          type="number"
          :clearable="false"
        />
      </v-col>
    </v-row>
  </v-form>

  <div
    id="gridCofins"
    class="mb-4"
  ></div>
</template>

<style scoped>
.v-card {
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.1);
}
.v-select,
.v-text-field {
  margin-bottom: 12px;
}
</style>
