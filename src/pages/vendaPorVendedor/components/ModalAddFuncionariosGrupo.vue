<script lang="ts" setup>
import Swal from "sweetalert2";
import { reactive } from "vue";
import serviceVendasPorVendedor from "../services/vendaPorVendedor.service";

const state = reactive({
  funcionarios: {},

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
      const data = await serviceVendasPorVendedor.getFuncionarios();
      state.funcionarios = data;
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
        clearable
      />
    </div>
    <div class="card-container pt-5">
      <v-card class="card-funcionario">
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
    <div class="btns pt-2">
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

.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  overflow: auto;
  height: 400px;
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
</style>
