<script setup lang="ts">
import { onMounted, reactive } from "vue";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import Swal from "sweetalert2";
import { msgConfirm } from "@/ts/message";
import utils from "@/ts/utils";
import serviceNfe from "../services/configuracaoNfe.service";
import { iPis, iFieldDuplicity } from "../interfaces";

const props = defineProps<{
  pis: iPis[];
}>();

const statePis = reactive({
  grid: {} as ixGridCreate,
  pis: {} as iPis,
  loading: false,
  isEditing: false,
});

const actionsPis = {
  async init() {
    const dadosPis = await actionsPis.getDadosParaInputs();
    actionsPis.gridPis();

    statePis.grid.querySourceAdd(dadosPis);
  },
  gridPis() {
    statePis.grid = new xGridV2.create({
      el: "#gridPis",
      height: 325,
      count: true,
      columns: {
        Valor: { dataField: "P_VALOR", width: "50%" },
        "Código Regime Tributário": { dataField: "ID_REGIME_TRIBUTARIO", width: "50%" },
      },
      // Esse método pode ser chamado posteriormente se houver necessidade de recarregar a grid
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
      // Se o usuário pressionar a tecla ENTER, podemos disparar uma ação de atualização
      enter: function () {
        document.getElementById("btnPisUpdate")?.click();
      },
    });
  },

  async getDadosParaInputs() {
    try {
      statePis.loading = true;
      // Chama o serviço que retorna os dados (array de PIS)
      const data = await serviceNfe.getDadosParaInputs();
      // Atualiza o objeto de edição com o primeiro item, se necessário
      statePis.pis = { ...data.pis[0] };
      // Retorna o array completo para a grid
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

  btnInsert() {
    statePis.isEditing = true;
    statePis.pis = {} as iPis;
    statePis.grid.disable();
    statePis.grid.focusField();
  },

  btnEdit() {
    if (!statePis.grid.dataSource()) {
      Swal.fire({
        icon: "info",
        text: "Nenhum registro selecionado para alteração.",
      });
      return;
    }
    statePis.isEditing = true;
    statePis.grid.disable();
    statePis.grid.focusField();
  },

  async btnDelete() {
    const selected = statePis.grid.dataSource();
    if (!selected) {
      Swal.fire({
        icon: "info",
        text: "Selecione um registro para excluir.",
      });
      return;
    }
    if (await msgConfirm("Confirmação", "Confirma a exclusão deste registro?")) {
      try {
        statePis.loading = true;
        await serviceNfe.toDeletePis(selected.ID_PIS);
        statePis.grid.deleteLine();
        Swal.fire({
          icon: "success",
          text: "PIS excluído com sucesso!",
        });
      } catch (error: any) {
        Swal.fire({
          icon: "error",
          text: error.response?.data?.msg || "Erro ao excluir registro.",
        });
      } finally {
        statePis.loading = false;
      }
    }
  },

  async btnSave() {
    if (utils.validaOBR()) return;
    if (await statePis.grid.getDuplicityAll()) return;
    try {
      statePis.loading = true;
      if (statePis.pis.ID_PIS) {
        await serviceNfe.toUpdatePis(statePis.pis);
        statePis.grid.dataSource({ ...statePis.pis });
        Swal.fire({
          icon: "success",
          text: "PIS atualizado com sucesso!",
        });
      } else {
        const response = await serviceNfe.toInsertPis(statePis.pis);
        statePis.pis.ID_PIS = response.ID_PIS;
        statePis.grid.insertLine({ ...statePis.pis });
        Swal.fire({
          icon: "success",
          text: "PIS cadastrado com sucesso!",
        });
      }
      statePis.grid.enable();
      statePis.grid.focus();
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: error.response?.data?.msg || "Erro ao salvar registro.",
      });
    } finally {
      statePis.loading = false;
    }
  },

  btnCancel() {
    statePis.grid.enable();
    statePis.grid.focus();
    statePis.pis = {} as iPis;
  },
};

onMounted(() => {
  actionsPis.init();
});
</script>

<template>
  <v-container>
    <v-card
      width="880"
      class="pa-5 ma-auto"
    >
      <!-- Overlay de loading -->
      <v-overlay
        :model-value="statePis.loading"
        absolute
      >
        <v-progress-circular
          indeterminate
          color="primary"
          size="50"
        />
      </v-overlay>

      <h2 class="text-center mb-4">Configuração de PIS</h2>

      <!-- Formulário para edição dos dados (ex.: select e campo de valor) -->
      <v-form
        @submit.prevent="actionsPis.btnSave"
        id="pnPisCampos"
      >
        <v-row dense>
          <v-col cols="4">
            <!-- Usando props.pis para popular o select, assumindo que props.pis é a lista de regimes -->
            <v-select
              v-model="statePis.pis.ID_REGIME_TRIBUTARIO"
              :items="props.pis"
              item-title="DESCRICAO"
              item-value="ID_REGIME_TRIBUTARIO"
              label="Regime Tributário"
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="statePis.pis.P_VALOR"
              label="Valor do PIS"
              type="number"
              suffix="%"
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
    </v-card>
  </v-container>
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
