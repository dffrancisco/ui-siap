<script setup lang="ts">
import Swal from "sweetalert2";
import { reactive, watch } from "vue";
import serviceVendasPorVendedor from "../services/vendaPorVendedor.service";
import { iParamInsertGrupoImpressao, iParamUpdateGrupoImpressao } from "../interfaces";

const props = defineProps<{
  modalOpened: boolean;
  id_grupo: number | null;
  nomeGrupo: string;
}>();

const emits = defineEmits(["salvarGrupo", "closeModal"]);

watch(
  () => props.modalOpened,
  async () => {
    if (props.modalOpened) {
      state.nomeGrupo = "";

      if (props.id_grupo) {
        state.nomeGrupo = props.nomeGrupo;
      }
    }
  }
);

const state = reactive({
  nomeGrupo: "",

  loading: false,
});

const actions = {
  async btnSalvar() {
    if (state.nomeGrupo.trim() == "") {
      await Swal.fire({
        icon: "warning",
        title: "O nome do grupo é obrigatório!",
      });
      return;
    }

    if (props.id_grupo) {
      if (state.nomeGrupo.toUpperCase().trim() == props.nomeGrupo) {
        actions.btnCancelar();
        return;
      }

      actions.updateGrupoImpressao(props.id_grupo);
      return;
    }

    actions.insertGrupoImpressao();
  },

  btnCancelar() {
    emits("closeModal");
  },

  async insertGrupoImpressao() {
    try {
      state.loading = true;

      let param: iParamInsertGrupoImpressao = {
        NOME: state.nomeGrupo.toUpperCase().trim(),
      };

      await serviceVendasPorVendedor.insertGrupoImpressao(param);

      emits("salvarGrupo");

      state.loading = false;
    } catch (error) {
      state.loading = false;
      await Swal.fire({
        icon: "error",
        text: error?.response?.data?.msg || "Erro ao inserir o grupo!",
      });
    }
  },

  async updateGrupoImpressao(id_grupoImpressao: number) {
    try {
      state.loading = true;

      let param: iParamUpdateGrupoImpressao = {
        NOME: state.nomeGrupo.toUpperCase().trim(),
        ID_GRUPO_IMPRESSAO: id_grupoImpressao,
      };

      await serviceVendasPorVendedor.updateGrupoImpressao(param);

      emits("salvarGrupo");

      state.loading = false;
    } catch (error) {
      state.loading = false;
      await Swal.fire({
        icon: "error",
        text: error?.response?.data?.msg || "Erro ao atualizar o grupo!",
      });
    }
  },
};
</script>

<template>
  <v-container>
    <div>
      <span class="text-size">Nome do Grupo</span>
      <input
        type="text"
        v-model="state.nomeGrupo"
        class="ss obr"
        @keydown.enter="actions.btnSalvar"
      />
    </div>

    <div class="btns mt-3">
      <v-btn
        color="primary"
        @click="actions.btnCancelar"
      >
        Cancelar
      </v-btn>
      <v-btn
        color="primary"
        @click="actions.btnSalvar"
      >
        Salvar
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
  </v-container>
</template>

<style scoped>
.text-size {
  font-size: 14px;
}

.btns {
  display: flex;
  justify-content: flex-end;
  gap: 4px;
}
</style>
