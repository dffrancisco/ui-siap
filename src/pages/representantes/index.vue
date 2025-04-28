<script setup lang="ts">
import { actions, state } from "./representantes";
import { useEventListener } from "@vueuse/core";
import { onMounted } from "vue";
import ModalMarcaRepresentantes from "./components/modalMarcaRepresentantes.vue";

const eventListener = useEventListener(document, "keydown", async (event) => {
  if (event.key === "F1") {
    document.getElementById("edtSearch")?.focus();
    event.preventDefault();
    event.stopPropagation();
  }
});

onMounted(async () => {
  await actions.init();
  window.addEventListener("keydown", eventListener);
});
</script>

<template>
  <v-container>
    <title>Gerenciar Representantes</title>
    <v-card
      max-width="900"
      class="pa-4 ma-auto"
    >
      <div id="pnCampos">
        <v-row class="mt-n1">
          <v-col cols="3">
            <span>Nome</span>
            <input
              v-model="state.dbRepresentantes.NOME"
              type="text"
              id="NOME"
              name="NOME"
              class="obr ss"
              maxlength="30"
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
              maxlength="60"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="3">
            <span>Marca</span>
            <div class="d-flex ga-2 align-center">
              <input
                v-model="state.dbRepresentantes.MARCAS"
                type="text"
                id="MARCAS"
                name="MARCAS"
                class="ss"
                maxlength="60"
              />
              <v-btn
                color="primary"
                icon="mdi-plus"
                @click="state.modalFornecedorOpened = true"
                size="30"
              />
            </div>
          </v-col>
        </v-row>

        <v-row class="mt-n1">
          <v-col cols="3">
            <span>Celular</span>
            <input
              v-model="state.dbRepresentantes.CELULAR"
              type="text"
              id="CELULAR"
              name="CELULAR"
              class="obr ss"
              maxlength="15"
              v-mask="'(##) #####-####'"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="3">
            <span>Telefone</span>
            <input
              v-model="state.dbRepresentantes.TELEFONE"
              type="text"
              id="TELEFONE"
              name="TELEFONE"
              class="ss"
              maxlength="14"
              v-mask="'(##) ####-####'"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="3">
            <span>Telefone 2</span>
            <div class="d-flex ga-2 align-center"
              ><input
                v-model="state.dbRepresentantes.TELEFONE2"
                type="text"
                id="TELEFONE2"
                name="TELEFONE2"
                class="ss"
                maxlength="14"
                v-mask="'(##) ####-####'"
                autocomplete="off"
            /></div>
          </v-col>

          <v-col cols="3">
            <span>Telefone 3</span>
            <input
              v-model="state.dbRepresentantes.FAX"
              type="text"
              id="FAX"
              name="FAX"
              class="ss"
              maxlength="14"
              v-mask="'(##) ####-####'"
              autocomplete="off"
            />
          </v-col>
        </v-row>

        <v-row class="mt-n1">
          <v-col cols="3">
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
              v-on:focusout="actions.buscaCEP"
            />
          </v-col>
          <v-col cols="5">
            <span>Cidade</span>
            <select
              v-model="state.dbRepresentantes.COD_CIDADE"
              id="COD_CIDADE"
              name="COD_CIDADE"
              class="obr ss"
              maxlength="50"
            >
              <option
                v-for="cidade in state.listaCidades"
                :key="cidade.COD_CIDADE"
                :value="cidade.COD_CIDADE"
              >
                {{ cidade.DESCRICAO }}
              </option>
            </select>
          </v-col>
          <v-col cols="4">
            <span>Observações</span>
          </v-col>
        </v-row>

        <v-row class="mt-n1">
          <v-col cols="4">
            <span>Endereço</span>
            <input
              v-model="state.dbRepresentantes.ENDERECO"
              type="text"
              id="ENDERECO"
              name="ENDERECO"
              class="obr ss"
              maxlength="40"
              autocomplete="off"
            />
          </v-col>

          <v-col cols="4">
            <span>Bairro</span>
            <input
              v-model="state.dbRepresentantes.BAIRRO"
              type="text"
              id="BAIRRO"
              name="BAIRRO"
              class="obr ss"
              maxlength="30"
              autocomplete="off"
            />
          </v-col>

          <v-col
            cols="4"
            class="d-flex flex-column"
            style="height: 80px"
          >
            <span style="margin-bottom: -33px"></span>
            <textarea
              v-model="state.dbRepresentantes.OBS"
              type="text"
              id="OBS"
              name="OBS"
              class="ss"
              rows="4"
              maxlength="200"
              autocomplete="off"
            >
            </textarea>
          </v-col>
        </v-row>

        <div class="mt-2 d-flex ga-2">
          <input
            v-model="state.edtSearch"
            type="text"
            placeholder="F1 - Buscar"
            :disabled="state.pnSearch"
            @keydown.enter.prevent="actions.search()"
            @keydown.arrow-down="state.gridPrincipal.focus(0)"
            id="edtSearch"
            maxlength="29"
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

    <div id="pnCodigoTela">representantes</div>
    <v-dialog
      v-model="state.modalFornecedorOpened"
      max-width="600"
    >
      <ModalMarcaRepresentantes
        @selecionarRepresentante="actions.selecionarRepresentante"
        @cancelar="actions.closeModal"
      />
    </v-dialog>
  </v-container>
</template>
<style scoped>
.v-col {
  padding: 8px;
}
</style>
