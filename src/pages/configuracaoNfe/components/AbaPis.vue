<script setup lang="ts">
import { onMounted, reactive, nextTick, watch } from "vue";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import Swal from "sweetalert2";
import { msgConfirm } from "@/ts/message";
import utils from "@/ts/utils";
import { regimeTributarioOptions } from "../configuracaoNfe";
import serviceNfe from "../services/configuracaoNfe.service";
import { iPis, iFieldDuplicity } from "../interfaces";

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
      height: 300,
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
        duplicity: {
          dataField: ["ID_REGIME_TRIBUTARIO"],
          async execute(rs) {
            const dup = await actionsPis.getDuplicidade({
              value: rs.value.toUpperCase(),
              field: rs.field,
            });
            if (dup && Object.keys(dup).length > 0) {
              statePis.grid.showMessageDuplicity(rs.text + " já cadastrado.");
              return true;
            }
            return false;
          },
        },
        frame: {
          el: "#pnPisBotoes",
          buttons: {
            novo: {
              html: "Novo",
              state: "insert",
              click: actionsPis.btnInsert,
            },
            update: {
              html: "Alterar",
              state: "update",
              click: actionsPis.btnEdit,
            },
            excluir: {
              html: "Excluir",
              state: "delete",
              click: actionsPis.btnDelete,
            },
            salvar: {
              html: "Salvar",
              state: "save",
              click: actionsPis.btnSave,
            },
            cancela: {
              html: "Cancelar",
              state: "cancel",
              click: actionsPis.btnCancel,
            },
          },
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
    statePis.isEditing = true;
    statePis.pis = {} as iPis;
    await nextTick();

    statePis.grid.focusField();
    statePis.grid.disable();
  },

  btnEdit() {
    statePis.isEditing = true;

    if (!statePis.grid.dataSource()) {
      Swal.fire({
        icon: "info",
        text: "Operação cancelada, nenhum registro selecionado.",
      });
      return false;
    }
    statePis.grid.disable();
    statePis.grid.focusField();
  },

  async btnDelete() {
    if (!statePis.grid.dataSource()) {
      Swal.fire({
        icon: "info",
        text: "Operação cancelada selecione um registro",
      });
      return false;
    }

    if (await msgConfirm("Confirmação", "Confirma a exclusão?")) {
      await actionsPis.toDelete();
      statePis.grid.focus();
    }
  },

  async btnSave() {
    if (utils.validaOBR()) {
      return false;
    }

    if (await statePis.grid.getDuplicityAll()) {
      return false;
    }

    if (statePis.grid.dataSource() == false) {
      actionsPis.toInsert();
    } else {
      actionsPis.toUpdate();
    }

    statePis.isEditing = false;
    await nextTick();

    statePis.grid.enable();
    statePis.grid.focus();
  },

  async btnCancel() {
    statePis.isEditing = false;
    let linhaGrid = <any>statePis.grid.getIndex();
    await nextTick();

    statePis.grid.enable();
    statePis.grid.focus(linhaGrid);
  },
  async toDelete() {
    try {
      const idPis = statePis.pis.ID_PIS;

      statePis.loading = true;

      await serviceNfe.toDeletePis(idPis);

      statePis.grid.deleteLine();

      await Swal.fire({
        icon: "success",
        text: "Pis deletado com sucesso.",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erro ao excluir o Pis, verificar",
        text: error.message,
      });
    } finally {
      statePis.loading = false;
    }
  },

  async toInsert() {
    try {
      statePis.loading = true;

      let newFields = {
        P_VALOR: statePis.pis.P_VALOR,
        ID_REGIME_TRIBUTARIO: statePis.pis.ID_REGIME_TRIBUTARIO,
      };

      await serviceNfe.toInsertPis(newFields);
      statePis.grid.insertLine({ ...newFields });

      await Swal.fire({
        icon: "success",
        text: "Pis adicionado com sucesso.",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        text: "Erro ao adicionar Pis.",
      });
    } finally {
      statePis.loading = false;
    }
  },

  async toUpdate() {
    try {
      let param = {
        P_VALOR: statePis.pis.P_VALOR,
        ID_PiS: statePis.pis.ID_PIS,
      };

      statePis.loading = true;

      await serviceNfe.toUpdatePis(param);

      statePis.grid.dataSource(param);

      await Swal.fire({
        icon: "success",
        text: "Pis atualizado com sucesso.",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erro ao atualizar Pis!",
        text: error.message,
      });
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
  <v-form
    @submit.prevent="actionsPis.btnSave"
    id="pnPisCampos"
  >
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
        />
      </v-col>
      <v-col cols="3">
        <v-text-field
          v-model="statePis.pis.P_VALOR"
          label="Valor do PIS"
          :disabled="!statePis.isEditing"
          type="text"
        />
      </v-col>
    </v-row>
  </v-form>

  <div
    id="gridPis"
    class="mb-4"
  ></div>

  <div
    id="pnPisBotoes"
    style="text-align: center"
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
