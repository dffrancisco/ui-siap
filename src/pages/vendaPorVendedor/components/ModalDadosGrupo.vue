<script setup lang="ts">
import Swal from "sweetalert2";
import { reactive, watch, computed } from "vue";
import serviceVendasPorVendedor from "../services/vendaPorVendedor.service";
import { iFuncionario, iListaFuncionario, iDadosGrupoEdit } from "../interfaces";

const props = defineProps<{
  modalOpened: boolean;
  nomeGrupoEdit: string;
  dadosGrupoEdit: iDadosGrupoEdit[] | null;
  dadosGrupoEditOpened: boolean;
}>();

const emits = defineEmits(["salvarGrupo", "closeModal"]);

watch(
  () => props.modalOpened,
  async () => {
    if (props.modalOpened) {
      await actions.getFuncionarios();
      state.dbFuncionario = [];
      state.nomeGrupo = "";
      state.funcionario = null;
    }

    if (props.dadosGrupoEditOpened) {
      state.nomeGrupo = props.nomeGrupoEdit;
      state.dbFuncionario = props.dadosGrupoEdit;
    }
  }
);

const funcionariosOrdenados = computed(() => {
  return state.dbFuncionario.sort((a, b) => {
    return a.LOGIN.localeCompare(b.LOGIN);
  });
});

const state = reactive({
  funcionarioLista: <iListaFuncionario[]>[],

  dbFuncionario: <iFuncionario[]>[],

  funcionario: null,
  nomeGrupo: "",

  loading: false,
});

const actions = {
  getUrlFotoFuncionario: (cpf: string) => {
    let cpfSanitizado = cpf.replaceAll(".", "").replaceAll("-", "");
    return `https://www.reallatas.com.br/_serverAPP/thumb.php?img=https://www.reallatas.com.br/foto_funcionarios/${cpfSanitizado}.jpg`;
  },

  addFuncionario() {
    const funcionarioSelecionado = state.funcionarioLista.find(
      (funcionario) => funcionario.COD_FUNCIONARIO == state.funcionario
    );

    const funcionarioExistente = state.dbFuncionario.find(
      (funcionario) => funcionario.COD_FUNCIONARIO == funcionarioSelecionado.COD_FUNCIONARIO
    );

    if (!funcionarioExistente) {
      state.dbFuncionario.push({
        CPF: funcionarioSelecionado.CPF,
        LOGIN: funcionarioSelecionado.LOGIN,
        COD_FUNCIONARIO: funcionarioSelecionado.COD_FUNCIONARIO,
      });
    }
  },

  deleteFuncionario(codFuncionario: number) {
    const index = state.dbFuncionario.findIndex((funcionario) => funcionario.COD_FUNCIONARIO == codFuncionario);
    state.dbFuncionario.splice(index, 1);
  },

  async btnSalvar() {
    if (state.nomeGrupo.trim() == "") {
      await Swal.fire({
        icon: "warning",
        title: "O nome do grupo é obrigatório!",
      });
      return;
    }

    if (state.dbFuncionario.length <= 0) {
      await Swal.fire({
        icon: "warning",
        title: "É necessário selecionar ao menos um funcionário!",
      });
      return;
    }

    if (props.dadosGrupoEditOpened) {
      actions.editarGrupo();
      return;
    }

    if (localStorage.getItem(state.nomeGrupo.toUpperCase())) {
      await Swal.fire({
        icon: "warning",
        title: "Este nome já está sendo utilizado em outro grupo!",
      });
      return;
    }

    actions.criarGrupo();
  },

  btnCancelar() {
    emits("closeModal");
  },

  async criarGrupo() {
    localStorage.setItem(state.nomeGrupo.toUpperCase(), JSON.stringify(state.dbFuncionario));

    emits("salvarGrupo", state.nomeGrupo.toUpperCase());
  },

  async editarGrupo() {
    localStorage.removeItem(props.nomeGrupoEdit);
    localStorage.setItem(state.nomeGrupo.toUpperCase(), JSON.stringify(state.dbFuncionario));

    emits("salvarGrupo", state.nomeGrupo.toUpperCase());
  },

  async atualizarGrupo() {},

  async getFuncionarios() {
    try {
      state.loading = true;

      let data = await serviceVendasPorVendedor.getFuncionarios();
      state.funcionarioLista = data;

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
      <span class="text-size">Nome do Grupo</span>
      <input
        v-model="state.nomeGrupo"
        type="text"
        class="ss obr"
      />
    </div>
    <div class="mt-5">
      <span class="text-size">Funcionários ({{ state.dbFuncionario.length }})</span>
      <div>
        <v-autocomplete
          v-model="state.funcionario"
          placeholder="Funcionários"
          :items="state.funcionarioLista"
          item-title="LOGIN"
          item-value="COD_FUNCIONARIO"
          @update:model-value="actions.addFuncionario"
        />
      </div>
    </div>
    <div style="height: 270px">
      <div class="mt-5 funcionario-container">
        <v-card
          v-for="funcionario in funcionariosOrdenados"
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
              <span :title="funcionario.LOGIN">{{ funcionario.LOGIN }}</span>
            </v-col>
            <v-col cols="3">
              <v-btn
                variant="text"
                icon="mdi-close"
                title="DELETAR"
                @click="actions.deleteFuncionario(funcionario.COD_FUNCIONARIO)"
              />
            </v-col>
          </v-row>
        </v-card>
      </div>
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

.card-funcionario {
  border: 2px solid #9ab5e5;
  background-color: #c1d8ff;
  border-radius: 15px;
  width: 222px;
}

.dados-funcionario {
  display: flex;
  align-items: center;
}

.funcionario-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  overflow: auto;
  max-height: 270px;
}

.avatar {
  border: 2px solid gray;
}

.btns {
  display: flex;
  justify-content: flex-end;
  gap: 4px;
}
</style>
