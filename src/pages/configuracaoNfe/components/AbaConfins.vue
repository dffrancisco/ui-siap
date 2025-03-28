<script setup lang="ts">
import { onMounted, reactive } from "vue";
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
});

const actionsCofins = {
  async init() {
    const dadosCofins = await actionsCofins.getDadosParaInputs();

    actionsCofins.gridConfins();
    stateCofins.grid.querySourceAdd(dadosCofins);
  },

  gridConfins() {
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

  btnInsert() {
    stateCofins.isEditing = true;
    stateCofins.cofins = {} as iCofins;
    stateCofins.grid.disable();
    stateCofins.grid.focusField();
  },

  btnEdit() {
    if (!stateCofins.grid.dataSource()) {
      Swal.fire({
        icon: "info",
        text: "Nenhum registro selecionado para alteração.",
      });
      return;
    }
    stateCofins.isEditing = true;
    stateCofins.grid.disable();
    stateCofins.grid.focusField();
  },

  async btnDelete() {
    const selected = stateCofins.grid.dataSource();
    if (!selected) {
      Swal.fire({
        icon: "info",
        text: "Selecione um registro para excluir.",
      });
      return;
    }
    if (await msgConfirm("Confirmação", "Confirma a exclusão deste registro?")) {
      try {
        stateCofins.loading = true;
        await serviceNfe.toDeleteCofins(selected.ID_COFINS);
        stateCofins.grid.deleteLine();
        Swal.fire({
          icon: "success",
          text: "COFINS excluído com sucesso!",
        });
      } catch (error: any) {
        Swal.fire({
          icon: "error",
          text: error.response?.data?.msg || "Erro ao excluir registro.",
        });
      } finally {
        stateCofins.loading = false;
      }
    }
  },

  async btnSave() {
    if (utils.validaOBR()) return;
    if (await stateCofins.grid.getDuplicityAll()) return;
    try {
      stateCofins.loading = true;
      if (stateCofins.cofins.ID_COFINS) {
        await serviceNfe.toUpdateCofins(stateCofins.cofins);
        stateCofins.grid.dataSource({ ...stateCofins.cofins });
        Swal.fire({
          icon: "success",
          text: "COFINS atualizado com sucesso!",
        });
      } else {
        const response = await serviceNfe.toInsertCofins(stateCofins.cofins);
        stateCofins.cofins.ID_COFINS = response.ID_COFINS;
        stateCofins.grid.insertLine({ ...stateCofins.cofins });
        Swal.fire({
          icon: "success",
          text: "COFINS cadastrado com sucesso!",
        });
      }
      stateCofins.grid.enable();
      stateCofins.grid.focus();
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: error.response?.data?.msg || "Erro ao salvar registro.",
      });
    } finally {
      stateCofins.loading = false;
    }
  },

  btnCancel() {
    stateCofins.grid.enable();
    stateCofins.grid.focus();
    stateCofins.cofins = {} as iCofins;
  },
};

onMounted(() => {
  actionsCofins.init();
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
