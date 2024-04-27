<script setup lang="ts">
import { nextTick } from "vue";
import { state, actions, funcionariosGrupoOrdenados } from "./gruposFuncionarios";
import ModalAddFuncionariosGrupo from "./components/ModalAddFuncionariosGrupo.vue";

nextTick(async () => {
  actions.init();
});
</script>

<template>
  <v-container>
    {{ state.dbGrupo }}
    <v-card
      width="700"
      class="pa-5"
      style="margin: 0 auto"
    >
      <div id="pnCampos">
        <div>
          <span>Nome</span>
          <input
            type="text"
            v-model="state.dbGrupo.NOME"
            class="obr ss"
            id="NOME"
            name="NOME"
            maxlength="30"
            autocomplete="off"
          />
        </div>
      </div>

      <div class="card-box mt-2">
        <div class="card-container">
          <v-card
            v-for="funcionario in funcionariosGrupoOrdenados"
            class="card-funcionario"
          >
            <v-row class="dados-funcionario">
              <v-col cols="3">
                <v-avatar
                  class="avatar ml-2 mt-1"
                  color="primary"
                >
                  <v-img
                    :src="actions.getUrlFotoFuncionario(funcionario.CPF)"
                    cover
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
            </v-row>
          </v-card>
        </div>
      </div>

      <div class="d-flex justify-end my-2">
        <input
          type="text"
          style="margin: 5px 0 5px"
          autofocus
          placeholder="F1 - Localizar"
          id="edtSearch"
          class="ss"
          :disabled="state.searchDisabled"
        />
        <v-btn
          size="small"
          class="ml-2 mt-1 elevation-0"
          color="primary"
          :disabled="state.searchDisabled"
        >
          Localizar
        </v-btn>
      </div>

      <div
        class="mt-5"
        id="gridGruposFuncionarios"
      ></div>

      <div
        id="pnBotoes"
        class="mt-3"
        style="text-align: center"
      ></div>

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

      <div
        id="modalAddFuncionariosGrupo"
        style="display: none"
      >
        <ModalAddFuncionariosGrupo
          :idGrupoImpressao="state.dbGrupo.ID_GRUPO_IMPRESSAO"
          :modalOpened="state.modalAddFuncionariosGrupoOpened"
          :funcionarioGrupo="state.dbGrupo.FUNCIONARIOS"
          @closeModal="actions.closeModalAddFuncionariosGrupo"
          :listaFuncionarios="state.listaFuncionarios"
        />
      </div>
    </v-card>
    <div id="pnCodigoTela">GRUPOS_FUNCIONARIOS</div>
  </v-container>
</template>

<style scoped>
.card-box {
  height: 120px;
}

.card-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px;
  overflow: auto;
  max-height: 120px;
}

.card-funcionario {
  border: 2px solid #9ab5e5;
  border-radius: 15px;
  width: 318px;
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
