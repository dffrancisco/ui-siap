<script setup lang="ts">
import { reactive, watch } from "vue";
import { iGrupo } from "../interfaces";
import { msgConfirm } from "@/ts/message";

watch(
  () => props.modalOpened,
  () => {
    if (props.modalOpened) {
      state.dbGrupo = [];
      for (let i = 0; i < localStorage.length; i++) {
        let chave = localStorage.key(i);
        state.dbGrupo.push({ nome: chave });
      }
    }
  }
);

const props = defineProps<{
  modalOpened: boolean;
}>();

const emits = defineEmits(["closeModal", "openModalDadosGrupo", "editarGrupo"]);

const state = reactive({
  dbGrupo: <iGrupo[]>[],
});

const actions = {
  closeModal() {
    emits("closeModal");
  },

  openModalDadosGrupo() {
    emits("openModalDadosGrupo");
  },

  editarGrupo(nome: string) {
    emits("editarGrupo", nome);
  },

  async deleteGrupo(nome: string) {
    if (await msgConfirm("Confirmação", "Confirma exclusão deste grupo?")) {
      const index = state.dbGrupo.findIndex((grupo) => grupo.nome == nome);
      state.dbGrupo.splice(index, 1);
      localStorage.removeItem(nome);
    }
  },
};
</script>

<template>
  <div :class="state.dbGrupo.length <= 0 ? 'text-center' : ''">
    <span
      v-if="state.dbGrupo.length <= 0"
      class="text-span"
      >Sem registros de grupos...</span
    >
    <v-list
      lines="one"
      height="250"
    >
      <v-list-item
        v-for="(grupo, index) in state.dbGrupo"
        :key="grupo.nome"
        :title="grupo.nome"
        :class="index % 2 == 0 ? 'gray-bg' : 'white-bg'"
      >
        <template v-slot:append>
          <v-btn
            icon="mdi-pencil"
            variant="text"
            title="EDITAR"
            @click="actions.editarGrupo(grupo.nome)"
          />
          <v-btn
            icon="mdi-delete"
            variant="text"
            title="DELETAR"
            @click="actions.deleteGrupo(grupo.nome)"
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
