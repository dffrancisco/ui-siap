<script setup lang="ts">
import { onMounted, reactive, nextTick } from "vue";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import Swal from "sweetalert2";
import { msgConfirm } from "@/ts/message";
import utils from "@/ts/utils";
import serviceNfe from "../services/configuracaoNfe.service";
import { iFieldDuplicity, iRegimeTributario } from "../interfaces";
import { regimeTributarioOptions } from "../configuracaoNfe";

const stateRegime = reactive({
  grid: {} as ixGridCreate,
  regimeTributario: {} as iRegimeTributario,
  loading: false,
  isEditing: false,
  regimeTributarioLista: [] as iRegimeTributario[],
});

defineProps({
  regimeTributario: Object,
  regimeTributarioLista: Array,
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
      height: 300,
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

  async btnInsert() {
    stateRegime.isEditing = true;
    stateRegime.regimeTributario = {} as iRegimeTributario;
    await nextTick();

    stateRegime.grid.focusField();
    stateRegime.grid.disable();
  },

  btnEdit() {
    if (!stateRegime.grid.dataSource()) {
      Swal.fire({
        icon: "info",
        text: "Operação cancelada, nenhum registro selecionado.",
      });
      return false;
    }
    stateRegime.grid.disable();
    stateRegime.grid.focusField();
  },

  async btnDelete() {
    if (!stateRegime.grid.dataSource()) {
      Swal.fire({
        icon: "info",
        text: "Operação cancelada selecione um registro",
      });
      return false;
    }

    if (await msgConfirm("Confirmação", "Confirma a exclusão?")) {
      await actionsRegime.toDelete();
      stateRegime.grid.focus();
    }
  },

  async btnSave() {
    if (utils.validaOBR()) {
      return false;
    }

    if (await stateRegime.grid.getDuplicityAll()) {
      return false;
    }

    if (stateRegime.grid.dataSource() == false) {
      actionsRegime.toInsert();
    } else {
      actionsRegime.toUpdate();
    }

    stateRegime.isEditing = false;
    await nextTick();

    stateRegime.grid.enable();
    stateRegime.grid.focus();
  },

  async btnCancel() {
    stateRegime.isEditing = false;
    let linhaGrid = <any>stateRegime.grid.getIndex();
    await nextTick();

    stateRegime.grid.enable();
    stateRegime.grid.focus(linhaGrid);
  },
  async toDelete() {
    try {
      const idCofins = stateRegime.regimeTributario.ID_REGIME_TRIBUTARIO;

      stateRegime.loading = true;

      await serviceNfe.toDeleteCofins(idCofins);

      stateRegime.grid.deleteLine();
      await Swal.fire({
        icon: "success",
        text: "Regime Tributario deletado com sucesso.",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erro ao excluir o Regime Tributario, verificar",
        text: error.message,
      });
    } finally {
      stateRegime.loading = false;
    }
  },

  async toInsert() {
    try {
      stateRegime.loading = true;

      let newFields = {
        DESCRICAO: stateRegime.regimeTributario.DESCRICAO,
        ID_REGIME_TRIBUTARIO: stateRegime.regimeTributario.ID_REGIME_TRIBUTARIO,
      };

      await serviceNfe.toInsertRegimeTributario(newFields);
      stateRegime.grid.insertLine({ ...newFields });

      await Swal.fire({
        icon: "success",
        text: "Regime Tributario adicionado com sucesso.",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        text: "Erro ao adicionar Regime Tributario.",
      });
    } finally {
      stateRegime.loading = false;
    }
  },

  async toUpdate() {
    try {
      let param = {
        P_VALOR: stateRegime.regimeTributario.DESCRICAO,
        ID_REGIME_TRIBUTARIO: stateRegime.regimeTributario.ID_REGIME_TRIBUTARIO,
      };

      stateRegime.loading = true;

      await serviceNfe.toUpdateRegimeTributario(param);

      stateRegime.grid.dataSource(param);

      await Swal.fire({
        icon: "success",
        text: "Regime Tributario atualizado com sucesso.",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erro ao atualizar Regime Tributario!",
        text: error.message,
      });
    } finally {
      stateRegime.loading = false;
    }
  },
};

onMounted(() => {
  actionsRegime.init();
});
</script>

<template width="600" class="pa-2 ma-auto">
  <v-form
    @submit.prevent="actionsRegime.btnSave"
    id="pnRegimeCampos"
  >
    <v-row dense>
      <v-col cols="4">
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
