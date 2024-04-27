<script lang="ts" setup>
import Swal from "sweetalert2";
import { reactive, watch, computed } from "vue";
import serviceGruposFuncionarios from "../services/gruposFuncionarios.service";
import {
  iFuncionarioGrupo,
  iFuncionarioGrupoOrdenado,
  iParamInsertGrupoImpressaoFuncionario,
  iParamDeleteGrupoImpressaoFuncionario,
  iListaFuncionario,
} from "../interfaces";

const props = defineProps<{
  modalOpened: boolean;
  funcionarioGrupo: iFuncionarioGrupo[] | undefined;
  idGrupoImpressao: number | undefined;
  listaFuncionarios: iListaFuncionario[];
}>();

const emits = defineEmits(["closeModal"]);

watch(
  () => props.modalOpened,
  () => {
    if (props.modalOpened) {
      state.selectFuncionario = null;
      state.dbFuncionarioGrupo = [];

      if (Array.isArray(props.funcionarioGrupo)) {
        state.dbFuncionarioGrupo = [...props.funcionarioGrupo];
      }
    }
  }
);

const funcionariosGrupoOrdenados = computed(() => {
  let funcionariosGrupo: iFuncionarioGrupoOrdenado[] = [];

  state.dbFuncionarioGrupo.forEach((grupo) => {
    const funcionario = props.listaFuncionarios.find(
      (funcionario) => funcionario.COD_FUNCIONARIO == grupo.COD_FUNCIONARIO
    );

    if (funcionario) {
      funcionariosGrupo.push(funcionario);
    }
  });

  funcionariosGrupo.sort((a, b) => {
    return a.LOGIN.localeCompare(b.LOGIN);
  });

  return funcionariosGrupo;
});

const state = reactive({
  dbFuncionarioGrupo: <iFuncionarioGrupo[]>[],

  selectFuncionario: null,

  loading: false,
});

const actions = {
  getUrlFotoFuncionario(cpf: string) {
    let cpfSanitizado = cpf.replaceAll(".", "").replaceAll("-", "");
    return `https://www.reallatas.com.br/_serverAPP/thumb.php?img=https://www.reallatas.com.br/foto_funcionarios/${cpfSanitizado}.jpg`;
  },

  closeModal() {
    emits("closeModal", state.dbFuncionarioGrupo);
  },

  async insertGrupoImpressaoFuncionario() {
    try {
      if (state.selectFuncionario == null) {
        return;
      }

      const funcionarioExistente = state.dbFuncionarioGrupo.some(
        (funcionario) => funcionario.COD_FUNCIONARIO == state.selectFuncionario
      );

      if (funcionarioExistente) {
        return;
      }

      state.loading = true;

      let param: iParamInsertGrupoImpressaoFuncionario = {
        ID_GRUPO_IMPRESSAO: props.idGrupoImpressao,
        COD_FUNCIONARIO: state.selectFuncionario,
      };

      state.dbFuncionarioGrupo.push(param);

      await serviceGruposFuncionarios.insertGrupoImpressaoFuncionario(param);

      state.loading = false;
    } catch (error) {
      state.loading = false;
      Swal.fire({
        icon: "error",
        text: "Erro ao inserir o funcionário!",
      });
    }
  },

  async deleteGrupoImpressaoFuncionario(codFuncionario: number) {
    try {
      state.loading = true;

      state.dbFuncionarioGrupo = state.dbFuncionarioGrupo.filter(
        (funcionario) => funcionario.COD_FUNCIONARIO != codFuncionario
      );

      let param: iParamDeleteGrupoImpressaoFuncionario = {
        ID_GRUPO_IMPRESSAO: props.idGrupoImpressao,
        COD_FUNCIONARIO: codFuncionario,
      };

      await serviceGruposFuncionarios.deleteGrupoImpressaoFuncionario(param);

      state.loading = false;
    } catch (error) {
      state.loading = false;
      Swal.fire({
        icon: "error",
        text: "Erro ao deletar o funcionário!",
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
        v-model="state.selectFuncionario"
        :items="props.listaFuncionarios"
        item-title="LOGIN"
        item-value="COD_FUNCIONARIO"
        @update:model-value="actions.insertGrupoImpressaoFuncionario"
        clearable
      />
    </div>
    <div class="card-box mt-5">
      <div class="card-container">
        <v-card
          v-for="funcionario in funcionariosGrupoOrdenados"
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
                  :src="actions.getUrlFotoFuncionario(funcionario.CPF)"
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
              <span>{{ funcionario.LOGIN }}</span>
            </v-col>
            <v-col cols="3">
              <v-btn
                variant="text"
                icon="mdi-close"
                title="DELETAR"
                @click="actions.deleteGrupoImpressaoFuncionario(funcionario.COD_FUNCIONARIO)"
              />
            </v-col>
          </v-row>
        </v-card>
      </div>
      <span
        class="span-sem-funcionarios"
        v-if="state.dbFuncionarioGrupo.length <= 0"
        :class="{ 'centered-span-sem-funcionarios': state.dbFuncionarioGrupo.length <= 0 }"
      >
        Sem funcionários...
      </span>
    </div>
    <div class="btn mt-5">
      <v-btn
        @click="actions.closeModal"
        color="primary"
        >fechar</v-btn
      >
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
.btn {
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
  width: 244px;
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
