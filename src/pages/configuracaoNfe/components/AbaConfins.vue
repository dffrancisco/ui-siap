<script setup lang="ts">
import { onMounted, reactive, nextTick, watch } from "vue";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import Swal from "sweetalert2";
import { msgConfirm } from "@/ts/message";
import utils from "@/ts/utils";
import { regimeTributarioOptions } from "../configuracaoNfe";
import serviceNfe from "../services/configuracaoNfe.service";
import { iCofins, iFieldDuplicity } from "../interfaces";

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
      height: 300,
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
        duplicity: {
          dataField: ["ID_REGIME_TRIBUTARIO"],
          async execute(rs) {
            const dup = await actionsCofins.getDuplicidade({
              value: rs.value.toUpperCase(),
              field: rs.field,
            });
            if (dup && Object.keys(dup).length > 0) {
              stateCofins.grid.showMessageDuplicity(rs.text + " já cadastrado.");
              return true;
            }
            return false;
          },
        },
        frame: {
          el: "#pncofinsBotoes",
          buttons: {
            novo: {
              html: "Novo",
              state: "insert",
              click: actionsCofins.btnInsert,
            },
            update: {
              html: "Alterar",
              state: "update",
              click: actionsCofins.btnEdit,
              id: "btnConfinsUpdate",
            },
            excluir: {
              html: "Excluir",
              state: "delete",
              click: actionsCofins.btnDelete,
            },
            salvar: {
              html: "Salvar",
              state: "save",
              click: actionsCofins.btnSave,
              preLoad: "Salvando",
            },
            cancela: {
              html: "Cancelar",
              state: "cancel",
              click: actionsCofins.btnCancel,
            },
          },
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
    stateCofins.isEditing = true;
    stateCofins.cofins = {} as iCofins;
    await nextTick();

    stateCofins.grid.focusField();
    stateCofins.grid.disable();
  },

  btnEdit() {
    if (!stateCofins.grid.dataSource()) {
      Swal.fire({
        icon: "info",
        text: "Operação cancelada, nenhum registro selecionado.",
      });
      return false;
    }
    stateCofins.grid.disable();
    stateCofins.grid.focusField();
  },

  async btnDelete() {
    if (!stateCofins.grid.dataSource()) {
      Swal.fire({
        icon: "info",
        text: "Operação cancelada selecione um registro",
      });
      return false;
    }

    if (await msgConfirm("Confirmação", "Confirma a exclusão?")) {
      await actionsCofins.toDelete();
      stateCofins.grid.focus();
    }
  },

  async btnSave() {
    if (utils.validaOBR()) {
      return false;
    }

    if (await stateCofins.grid.getDuplicityAll()) {
      return false;
    }

    if (stateCofins.grid.dataSource() == false) {
      actionsCofins.toInsert();
    } else {
      actionsCofins.toUpdate();
    }

    stateCofins.isEditing = false;
    await nextTick();

    stateCofins.grid.enable();
    stateCofins.grid.focus();
  },

  async btnCancel() {
    stateCofins.isEditing = false;
    let linhaGrid = <any>stateCofins.grid.getIndex();
    await nextTick();

    stateCofins.grid.enable();
    stateCofins.grid.focus(linhaGrid);
  },
  async toDelete() {
    try {
      const idCofins = stateCofins.cofins.ID_COFINS;

      stateCofins.loading = true;

      await serviceNfe.toDeleteCofins(idCofins);

      stateCofins.grid.deleteLine();
      await Swal.fire({
        icon: "success",
        text: "COFINS deletado com sucesso.",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erro ao excluir o COFINS, verificar",
        text: error.message,
      });
    } finally {
      stateCofins.loading = false;
    }
  },

  async toInsert() {
    try {
      stateCofins.loading = true;

      let newFields = {
        P_VALOR: Number(stateCofins.cofins.P_VALOR),
        ID_REGIME_TRIBUTARIO: Number(stateCofins.cofins.ID_REGIME_TRIBUTARIO),
      };

      const resultado = await serviceNfe.toInsertCofins(newFields);

      stateCofins.grid.insertLine({
        ...newFields,
        ID_COFINS: resultado.ID_COFINS,
      });

      await Swal.fire({
        icon: "success",
        text: "COFINS adicionado com sucesso.",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        text: "Erro ao adicionar COFINS.",
      });
    } finally {
      stateCofins.loading = false;
    }
  },

  async toUpdate() {
    try {
      let param = {
        P_VALOR: stateCofins.cofins.P_VALOR,
        ID_COFINS: stateCofins.cofins.ID_COFINS,
      };

      stateCofins.loading = true;

      await serviceNfe.toUpdateCofins(param);

      stateCofins.grid.dataSource(param);

      await Swal.fire({
        icon: "success",
        text: "COFINS atualizado com sucesso.",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erro ao atualizar COFINS!",
        text: error.message,
      });
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
  <v-form
    @submit.prevent="actionsCofins.btnSave"
    id="pncofinsCampos"
  >
    <v-row dense>
      <v-col cols="4">
        <v-select
          v-model="stateCofins.cofins.ID_REGIME_TRIBUTARIO"
          label="Regime Tributário"
          :items="regimeTributarioOptions"
          item-title="text"
          item-value="value"
        />
      </v-col>
      <v-col cols="3">
        <v-text-field
          v-model="stateCofins.cofins.P_VALOR"
          label="Valor do COFINS"
          type="number"
        />
      </v-col>
    </v-row>
  </v-form>

  <div
    id="gridCofins"
    class="mb-4"
  ></div>

  <div
    id="pncofinsBotoes"
    style="text-align: center"
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
