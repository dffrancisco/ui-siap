<script setup lang="ts">
import { actions, state, eventListener } from "./representantes";
import { onMounted } from "vue";

onMounted(async () => {
  await actions.init();
  window.addEventListener("keydown", eventListener);
});
</script>

<template>
  <v-container>
    <title>Gerenciar Fornecedores</title>
    <v-card
      width="900"
      height="650"
      class="pa-5 ma-auto"
    >
      <div id="pnCampos">
        <v-row class="mt-n1">
          <v-col>
            <span>Nome</span>
            <input
              v-model="state.dbRepresentantes.NOME"
              type="text"
              id="NOME"
              name="NOME"
              class="obr ss"
              maxlength="18"
              autocomplete="off"
            />
          </v-col>
          <v-col>
            <span>Email</span>
            <input
              v-model="state.dbRepresentantes.EMAIL"
              type="text"
              id="EMAIL"
              name="EMAIL"
              class="ss"
              maxlength="15"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="4">
            <span>Celular</span>
            <input
              v-model="state.dbRepresentantes.CELULAR"
              type="text"
              id="CELULAR"
              name="CELULAR"
              class="obr ss"
              maxlength="60"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="3">
            <span>Telefone/span>
            <input
              v-model="state.dbRepresentantes.TELEFONE"
              type="text"
              id="TELEFONE"
              name="TELEFONE"
              class="ss"
              maxlength="60"
              autocomplete="off"
            />
          </v-col>
        </v-row>
        <v-row class="mt-n1">
          <v-col cols="5">
            <span>Telefone 2</span>
            <div class="d-flex ga-2 align-center"
              ><input
                v-model="state.dbRepresentantes.TELEFONE2"
                type="text"
                id="TELEFONE2"
                name="TELEFONE2"
                class="ss"
                maxlength="60"
                autocomplete="off"
                :disabled="true" /></div>
          </v-col>

          <v-col cols="4">
            <span>Telefone 3</span>
            <input
              v-model="state.dbRepresentantes.FAX"
              type="text"
              id="FAX"
              name="FAX"
              class="ss"
              maxlength="100"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="3">
            <span>Cep</span>
            <input
              v-model="state.dbRepresentantes.CEP"
              type="text"
              id="CEP"
              name="CEP"
              class="ss"
              maxlength="60"
              autocomplete="off"
            />
          </v-col>
        </v-row>

        <v-row class="mt-n1">
          <v-col cols="3">
            <span>Nome Responsável</span>
            <input
              v-model="state.dbRepresentantes.ENDERECO"
              type="text"
              id="CONTADO"
              name="CONTADO"
              class="ss"
              maxlength="60"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="3">
            <span>Telefone 1</span>
            <input
              v-model="state.dbRepresentantes.TELEFONE"
              type="text"
              id="TELEFONE1"
              name="TELEFONE1"
              class="ss"
              maxlength="15"
              v-mask="'(##) #####-####'"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="3">
            <span>Telefone 2</span>
            <input
              v-model="state.dbRepresentantes.TELEFONE2"
              type="text"
              id="TELEFONE2"
              name="TELEFONE2"
              class="ss"
              maxlength="15"
              v-mask="'(##) #####-####'"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="3">
            <span>Telefone 3</span>
            <input
              v-model="state.dbRepresentantes.FAX"
              type="text"
              id="FAX"
              name="FAX"
              class="ss"
              maxlength="15"
              v-mask="'(##) #####-####'"
              autocomplete="off"
            />
          </v-col>
        </v-row>

        <v-row class="mt-n1">
          <v-col cols="2">
            <span>CEP</span>
            <input
              v-model="state.dbRepresentantes.CEP"
              type="text"
              id="CEP"
              name="CEP"
              class="obr ss"
              maxlength="9"
              v-mask="'#####-###'"
              autocomplete="off"
             
            />
          </v-col>
          <v-col cols="4">
            <span>Endereço</span>
            <input
              v-model="state.dbRepresentantes.ENDERECO"
              type="text"
              id="ENDERECO"
              name="ENDERECO"
              class="obr ss"
              maxlength="100"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="2">
            <span>Obs</span>
            <input
              v-model="state.dbRepresentantes.OBS"
              type="text"
              id="OBS"
              name="OBS"
              class="ss"
              maxlength="50"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="2">
            <span>Bairro</span>
            <input
              v-model="state.dbRepresentantes.BAIRRO"
              type="text"
              id="BAIRRO"
              name="BAIRRO"
              class="obr ss"
              maxlength="50"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="2">
            <span>Cidade</span>
            <input
              v-model="state.dbRepresentantes.COD_CIDADE"
              type="text"
              id="COD_CIDADE"
              name="COD_CIDADE"
              class="obr ss"
              maxlength="50"
              autocomplete="off"
            />
            </select>
          </v-col>
        </v-row>

        <v-row class="mt-n1">
          <v-col cols="3">



          </v-col>

         
        </v-row>

        <div class="d-flex ga-2 align-items-center">
          <input
            v-model="state.edtSearch"
            type="text"
            placeholder="F1 - Buscar"
            :disabled="state.pnSearch"
            @keydown.enter.prevent="actions.search()"
            @keydown.arrow-down="state.gridPrincipal.focus(0)"
            id="edtSearch"
            class="ss"
          />
          <v-btn
            :disabled="state.pnSearch"
            size="30"
            color="primary"
            @click="actions.search()"
            icon="mdi-magnify"
          />
        </div>

        <div
          id="gridPrincipal"
          class="mt-4"
        ></div>

        <v-overlay
          :model-value="state.loading"
          class="align-center justify-center"
          persistent
        >
          <v-progress-circular
            color="primary"
            indeterminate
            size="50"
          ></v-progress-circular>
        </v-overlay>

        <div
          id="pnBotoes"
          class="mt-4"
          style="text-align: center"
        ></div>
      </div>
    </v-card>

    <div id="pnCodigoTela">fornecedores</div>
   
  </v-container>
</template>
<style scoped>
.v-col {
  padding: 8px;
}
</style>
