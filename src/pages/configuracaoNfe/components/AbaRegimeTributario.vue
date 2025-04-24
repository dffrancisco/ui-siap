<script setup lang="ts">
import { onMounted, reactive, nextTick, watch } from "vue";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import Swal from "sweetalert2";
import utils from "@/ts/utils";
import serviceNfe from "../services/configuracaoNfe.service";
import { iRegimeTributario } from "../interfaces";

const stateRegime = reactive({
  grid: {} as ixGridCreate,
  regimeTributario: {} as iRegimeTributario,
  loading: false,
  isEditing: false,
  regimeTributarioLista: [] as iRegimeTributario[],
  gridRegimeTributario: <ixGridCreate>{},
});

const props = defineProps({
  regimeTributario: Object,
  abaOpened: Boolean,
  isEditable: Boolean,
  regimeTributarioLista: Array,
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
      query: {
        async execute() {
          const dados = await actionsRegime.getDadosParaInputs();
          stateRegime.grid.querySourceAdd(dados);
        },
      },
      sideBySide: {
        el: "#pnRegimeCampos",
        vModel(r) {
          stateRegime.regimeTributario = r;
        },
      },
      enter: function () {
        document.getElementById("btnRegimeUpdate")?.click();
      },
    });
  },

  async getDadosParaInputs() {
    try {
      stateRegime.loading = true;
      const data = await serviceNfe.getDadosParaInputs();
      stateRegime.regimeTributarioLista = data.regimeTributario;

      return data.regimeTributario;
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Erro ao buscar os dados iniciais!",
      });
      return [];
    } finally {
      stateRegime.loading = false;
    }
  },
};

onMounted(async () => {
  await actionsRegime.init();
});
</script>

<template width="600" class="pa-2 ma-auto">
  <v-form id="pnRegimeCampos">
    <v-row dense>
      <v-col cols="4">
        <v-text-field
          v-model="stateRegime.regimeTributario.DESCRICAO"
          :disabled="!stateRegime.isEditing"
          label="Descrição"
          type="text"
        />
      </v-col>
    </v-row>
  </v-form>

  <div id="gridRegimeTributario"></div>

  <div
    id="pnRegimeBotoes"
    class="mt-4"
    style="text-align: center"
  ></div>
</template>

<style scoped>
.v-card {
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.1);
}
.v-text-field {
  margin-bottom: 12px;
}
</style>
