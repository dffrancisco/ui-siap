<script setup lang="ts">
import { actions, state } from "./cidades";
import { nextTick, onUnmounted } from "vue";
import cidadeSearch from "./components/cidadeSearch.vue";
import { useEventListener } from "@vueuse/core";
import $ from "jquery";

const eventListener = useEventListener(document, "keydown", async (event) => {
  if (event.key === "F1") {
    state.edtSearch.select();
    event.preventDefault();
    event.stopPropagation();
  }
});

nextTick(async () => {
  $(".ss").attr("autocomplete", "off");

  state.edtSearch = <any>document.getElementById("edtSearch");

  actions.grids();
  actions.getUF();
  state.gridPrincipal.queryOpen({ DESCRICAO: "" }, () => {
    state.gridPrincipal.focus();
  });
});

onUnmounted(() => {
  removeEventListener("keydown", eventListener);
});
</script>

<template>
  <v-container>
    <title>Cadastro de Cidades</title>
    <v-card
      class="pa-5"
      style="width: 700px; margin: 0 auto"
    >
      <div id="pnCampos">
        <v-row>
          <v-col cols="12">
            <span>Descrição</span>
            <input
              v-model.lazy="state.dbCidade.DESCRICAO"
              type="text"
              id="DESCRICAO"
              name="DESCRICAO"
              required
              class="obr ss"
              maxlength="20"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="6">
            <span>UF</span>
            <select
              v-model="state.dbCidade.UF"
              name="UF"
              id="UF"
              class="obr ss"
            >
              <option
                v-for="uf in state.listaUF"
                :value="uf.SIGLA"
              >
                {{ uf.SIGLA }}
              </option>
            </select>
          </v-col>
          <v-col cols="6">
            <span>Código IBGE</span>
            <input
              v-model.lazy="state.dbCidade.COD_IBGE"
              type="text"
              id="COD_IBGE"
              name="COD_IBGE"
              required
              class="obr ss"
              maxlength="7"
              autocomplete="off"
              :oninput="actions.digitarApenasNumeros"
            />
          </v-col>
        </v-row>
      </div>

      <cidadeSearch />

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

      <div id="gridPrincipal"></div>

      <div
        id="pnBotoes"
        class="mt-3"
        style="text-align: center"
      ></div>

    </v-card>
    <div id="pnCodigoTela">CAD_CIDADES</div>
  </v-container>
</template>

<style scoped>
.v-col {
  padding-bottom: 4px;
}
</style>
