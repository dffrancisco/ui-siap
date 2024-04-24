<script setup lang="ts">
import { reactive } from "vue";
import { iGrupo, iParamDeleteGrupoImpressao } from "../interfaces";
import Swal from "sweetalert2";
import serviceVendasPorVendedor from "../services/vendaPorVendedor.service";
import { msgConfirm } from "@/ts/message";

const props = defineProps<{
  grupo: iGrupo[];
}>();

const emits = defineEmits([
  "closeModal",
  "openModalDadosGrupo",
  "openModalDadosGrupoEdit",
  "openModalAddFuncionarioGrupo",
]);

const state = reactive({
  loading: false,
});

const actions = {
  closeModal() {
    emits("closeModal");
  },

  openModalDadosGrupo() {
    emits("openModalDadosGrupo");
  },

  openModalDadosGrupoEdit(id_grupoImpressao: number, nome: string) {
    emits("openModalDadosGrupoEdit", id_grupoImpressao, nome);
  },

  openModalAddFuncionarioGrupo(id_grupoImpressao: number) {
    emits("openModalAddFuncionarioGrupo", id_grupoImpressao);
  },

  async deleteGrupoImpressao(id_grupoImpressao: number) {
    try {
      let param: iParamDeleteGrupoImpressao = {
        ID_GRUPO_IMPRESSAO: id_grupoImpressao,
      };

      if (await msgConfirm("Confirmação", "Confirma exclusão deste grupo?")) {
        state.loading = true;

        await serviceVendasPorVendedor.deleteGrupoImpressao(param);

        const index = props.grupo.findIndex((grupo) => grupo.ID_GRUPO_IMPRESSAO == id_grupoImpressao);
        props.grupo.splice(index, 1);

        state.loading = false;
      }
    } catch (error) {
      state.loading = false;
      Swal.fire({
        icon: "error",
        text: "Erro ao excluir o grupo!",
      });
    }
  },
};
</script>

<template>
  <div :class="props.grupo.length <= 0 ? 'text-center' : ''">
    <span
      v-if="props.grupo.length <= 0"
      class="text-span"
      >Sem registros de grupos...</span
    >
    <v-list
      lines="one"
      height="250"
    >
      <v-list-item
        v-for="(grupo, index) in props.grupo"
        :key="grupo.NOME"
        :title="grupo.NOME"
        :class="index % 2 == 0 ? 'gray-bg' : 'white-bg'"
      >
        <template v-slot:append>
          <v-btn
            icon="mdi-account-multiple"
            variant="text"
            title="Adicionar Funcionários"
            @click="actions.openModalAddFuncionarioGrupo(grupo.ID_GRUPO_IMPRESSAO)"
          />
          <v-btn
            icon="mdi-pencil"
            variant="text"
            title="Editar"
            @click="actions.openModalDadosGrupoEdit(grupo.ID_GRUPO_IMPRESSAO, grupo.NOME)"
          />
          <v-btn
            icon="mdi-delete"
            variant="text"
            title="Deletar"
            @click="actions.deleteGrupoImpressao(grupo.ID_GRUPO_IMPRESSAO)"
          />
        </template>
      </v-list-item>
    </v-list>
  </div>
  <div class="btns mt-3">
    <v-btn
      color="primary"
      @click="actions.closeModal"
    >
      Cancelar
    </v-btn>
    <v-btn
      color="primary"
      @click="actions.openModalDadosGrupo"
    >
      Novo Grupo
    </v-btn>
  </div>

  <v-overlay
    :model-value="state.loading"
    class="align-center justify-center"
    persistent
  >
    <v-progress-circular
      color="primary"
      indeterminate
      size="64"
    ></v-progress-circular>
  </v-overlay>
</template>

<style scoped>
.gray-bg {
  background-color: #c7c7c7;
}

.white-bg {
  background-color: #eaeaea;
}

.btns {
  display: flex;
  justify-content: flex-end;
  gap: 4px;
}

.text-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.text-span {
  font-size: 16px;
  font-weight: bolder;
  color: #928e8e;
}
</style>
