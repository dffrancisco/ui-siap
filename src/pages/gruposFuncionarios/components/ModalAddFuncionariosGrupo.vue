<script lang="ts" setup>
import Swal from "sweetalert2";
import { reactive } from "vue";
import serviceGruposFuncionarios from "../services/gruposFuncionarios.service";
import { watch } from "vue";
import { iListaFuncionario, iFuncionarioGrupo } from "../interfaces";

const props = defineProps<{
  modalOpened: boolean;
  funcionarioGrupo: iFuncionarioGrupo[];
}>();

watch(
  () => props.modalOpened,
  () => {
    if (props.modalOpened) {
      actions.getFuncionarios();

      state.dbFuncionarioGrupo = [];

      state.dbFuncionarioGrupo = [...props.funcionarioGrupo];
    }
  }
);

const state = reactive({
  dbFuncionarioGrupo: <iFuncionarioGrupo[]>[],

  listaFuncionarios: <iListaFuncionario[]>[],

  loading: false,
});

const actions = {
  getUrlFotoFuncionario: (cpf: string) => {
    let cpfSanitizado = cpf.replaceAll(".", "").replaceAll("-", "");
    return `https://www.reallatas.com.br/_serverAPP/thumb.php?img=https://www.reallatas.com.br/foto_funcionarios/${cpfSanitizado}.jpg`;
  },

  async getFuncionarios() {
    try {
      state.loading = true;
      const data = await serviceGruposFuncionarios.getFuncionarios();
      state.listaFuncionarios = data;
      state.loading = false;
    } catch (error) {
      state.loading = false;
      Swal.fire({
        icon: "error",
        text: "Erro ao buscar os funcionários!",
      });
    }
  },
};
</script>

<template>
  <v-container>
    <div>
      <v-autocomplete
        label="Funcionários"
        :items="state.listaFuncionarios"
        item-title="LOGIN"
        item-value="COD_FUNCIONARIO"
        clearable
      />
    </div>
    <div class="card-box mt-5">
      <div class="card-container">
        <v-card
          v-for="funcionario in state.dbFuncionarioGrupo"
          class="card-funcionario"
        >
          <v-row class="dados-funcionario">
            <v-col cols="3">
              <v-avatar
                class="avatar ml-2"
                color="primary"
              >
                <v-img
                  cover
                  :src="actions.getUrlFotoFuncionario('090.479.381-86')"
                >
                  <template v-slot:error>
                    <v-icon
                      size="30px"
                      class="mt-1"
                      >mdi-account</v-icon
                    >
                  </template>
                </v-img>
              </v-avatar>
            </v-col>
            <v-col
              cols="6"
              class="d-flex justify-center"
            >
              <span>VINICIUS MEDEIR</span>
            </v-col>
            <v-col cols="3">
              <v-btn
                variant="text"
                icon="mdi-close"
                title="DELETAR"
              />
            </v-col>
          </v-row>
        </v-card>
      </div>
      <span
        class="span-sem-funcionarios"
        v-if="state.dbFuncionarioGrupo.length <= 0"
        :class="{ 'centered-span-sem-funcionarios': state.dbFuncionarioGrupo.length <= 0 }"
        >Sem funcionários...</span
      >
    </div>
    <div class="btns mt-5">
      <v-btn color="primary">cancelar</v-btn>
      <v-btn color="primary">salvar</v-btn>
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
.btns {
  display: flex;
  justify-content: flex-end;
  gap: 4px;
}

.card-box {
  height: 380px;
}

.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  overflow: auto;
  max-height: 380px;
}

.card-funcionario {
  border: 2px solid #9ab5e5;
  background-color: #c1d8ff;
  border-radius: 15px;
  width: 222px;
  height: 52px;
}
.avatar {
  border: 2px solid gray;
}
.dados-funcionario {
  display: flex;
  align-items: center;
}

.span-sem-funcionarios {
  font-size: 20px;
  color: gray;
}

.centered-span-sem-funcionarios {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
