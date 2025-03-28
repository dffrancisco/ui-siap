<script setup lang="ts">
import { onMounted, reactive } from "vue";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import Swal from "sweetalert2";
import { msgConfirm } from "@/ts/message";
import utils from "@/ts/utils";
import serviceNfe from "../services/configuracaoNfe.service";
import { iFieldDuplicity, iRegimeTributario } from "../interfaces";

const stateRegime = reactive({
  grid: {} as ixGridCreate,
  regimeTributario: {} as iRegimeTributario,
  loading: false,
  isEditing: false,
  regimeTributarioLista: [] as iRegimeTributario[],
});

const actionsRegime = {
  async init() {
    const dadosRegime = await actionsRegime.getDadosParaInputs();
    actionsRegime.gridRegimeTributario();
    stateRegime.grid.querySourceAdd(dadosRegime);
  },

  gridRegimeTributario() {
    stateRegime.grid = new xGridV2.create({
      el: "#gridRegimeTributario",
      height: 320,
      count: true,
      columns: {
        "Codigo Regime Tributário": {
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
        duplicity: {
          dataField: ["ID_REGIME_TRIBUTARIO"],
          async execute(rs) {
            return false;
          },
        },
        frame: {
          el: "#pnRegimeBotoes",
          buttons: {
            novo: {
              html: "Novo",
              state: "insert",
              click: actionsRegime.btnInsert,
            },
            update: {
              html: "Alterar",
              state: "update",
              click: actionsRegime.btnEdit,
              id: "btnRegimeUpdate",
            },
            excluir: {
              html: "Excluir",
              state: "delete",
              click: actionsRegime.btnDelete,
            },
            salvar: {
              html: "Salvar",
              state: "save",
              click: actionsRegime.btnSave,
              preLoad: "Salvando",
            },
            cancela: {
              html: "Cancelar",
              state: "cancel",
              click: actionsRegime.btnCancel,
            },
          },
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
      stateRegime.regimeTributario = { ...data.regimeTributario[0] };
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

  async getDuplicidade({ value, field }: iFieldDuplicity) {
    try {
      const data = await serviceNfe.getDuplicidade({ value, field });
      return data;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erro ao verificar duplicidade.",
        text: error.message,
      });
    }
  },

  btnInsert() {
    stateRegime.isEditing = true;
    stateRegime.regimeTributario = {} as iRegimeTributario;
    stateRegime.grid.disable();
    stateRegime.grid.focusField();
  },

  btnEdit() {
    if (!stateRegime.grid.dataSource()) {
      Swal.fire({
        icon: "info",
        text: "Nenhum registro selecionado para alteração.",
      });
      return;
    }
    stateRegime.isEditing = true;
    stateRegime.grid.disable();
    stateRegime.grid.focusField();
  },

  async btnDelete() {
    const selected = stateRegime.grid.dataSource();
    if (!selected) {
      Swal.fire({
        icon: "info",
        text: "Selecione um registro para excluir.",
      });
      return;
    }
    if (await msgConfirm("Confirmação", "Confirma a exclusão deste registro?")) {
      try {
        stateRegime.loading = true;
        await serviceNfe.toDeleteRegimeTributario(selected.ID_REGIME_TRIBUTARIO);
        stateRegime.grid.deleteLine();
        Swal.fire({
          icon: "success",
          text: "Registro excluído com sucesso!",
        });
      } catch (error: any) {
        Swal.fire({
          icon: "error",
          text: "Erro ao excluir registro.",
        });
      } finally {
        stateRegime.loading = false;
      }
    }
  },

  async btnSave() {
    if (utils.validaOBR()) return;
    if (await stateRegime.grid.getDuplicityAll()) return;
    try {
      stateRegime.loading = true;
      if (stateRegime.regimeTributario.ID_REGIME_TRIBUTARIO) {
        await serviceNfe.toUpdateRegimeTributario(stateRegime.regimeTributario);
        stateRegime.grid.dataSource({ ...stateRegime.regimeTributario });
        Swal.fire({
          icon: "success",
          text: "Registro atualizado com sucesso!",
        });
      } else {
        const response = await serviceNfe.toInsertRegimeTributario(stateRegime.regimeTributario);
        stateRegime.regimeTributario.ID_REGIME_TRIBUTARIO = response.ID_REGIME_TRIBUTARIO;
        stateRegime.grid.insertLine({ ...stateRegime.regimeTributario });
        Swal.fire({
          icon: "success",
          text: "Registro inserido com sucesso!",
        });
      }
      stateRegime.grid.enable();
      stateRegime.grid.focus();
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        text: "Erro ao salvar registro.",
      });
    } finally {
      stateRegime.loading = false;
    }
  },

  btnCancel() {
    stateRegime.grid.enable();
    stateRegime.grid.focus();
    stateRegime.regimeTributario = {} as iRegimeTributario;
  },
};

onMounted(() => {
  actionsRegime.init();
});
</script>

<template width="600" class="pa-1 ma-auto">
  <v-overlay
    :value="stateRegime.loading"
    absolute
  >
    <v-progress-circular
      indeterminate
      color="primary"
      size="50"
    />
  </v-overlay>

  <v-form
    @submit.prevent="actionsRegime.btnSave"
    id="pnRegimeCampos"
  >
    <v-row dense>
      <v-col cols="3">
        <v-text-field
          v-model="stateRegime.regimeTributario.ID_REGIME_TRIBUTARIO"
          label="Código Tributário"
          type="number"
        />
      </v-col>
      <v-col cols="3">
        <v-text-field
          v-model="stateRegime.regimeTributario.DESCRICAO"
          label="Descrição"
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
