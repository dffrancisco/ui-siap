<script setup lang="ts">
import { actions, state } from "./transportadoras";
import { nextTick, onUnmounted } from "vue";
import transportadoraSearch from "./components/transportadoraSearch.vue";
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
  actions.getCidades();
  state.gridPrincipal.queryOpen({ RAZAO_SOCIAL: "" }, () => {
    state.gridPrincipal.focus();
  });
});

onUnmounted(() => {
  removeEventListener("keydown", eventListener);
});
</script>

<template>
  <v-container>
    <title>Cadastro de Transportadoras</title>
    <v-card
      class="pa-5"
      style="width: 800px; margin: 0 auto"
    >
      <div id="pnCampos">
        <v-row>
          <v-col cols="3">
            <span>CNPJ</span>
            <input
              type="text"
              v-model="state.dbTransportadora.CGC_TRANSPORTADORA"
              id="CGC_TRANSPORTADORA"
              name="CGC_TRANSPORTADORA"
              required
              class="obr ss"
              maxlength="18"
              autocomplete="off"
              v-mask="'##.###.###/####-##'"
              :disabled="state.cnpjDisabled"
            />
          </v-col>
          <v-col cols="6">
            <span>Razão Social</span>
            <input
              type="text"
              v-model="state.dbTransportadora.RAZAO_SOCIAL"
              id="RAZAO_SOCIAL"
              name="RAZAO_SOCIAL"
              required
              class="obr ss"
              maxlength="50"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="3">
            <span>IE</span>
            <input
              type="text"
              v-model="state.dbTransportadora.INSC_ESTADUAL"
              id="INSC_ESTADUAL"
              name="INSC_ESTADUAL"
              class="ss"
              maxlength="20"
              autocomplete="off"
            />
          </v-col>

          <v-col cols="6">
            <span>E-mail</span>
            <input
              type="text"
              v-model="state.dbTransportadora.EMAIL"
              id="EMAIL"
              name="EMAIL"
              class="ss"
              maxlength="100"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="3">
            <span>Telefone</span>
            <input
              type="text"
              v-model="state.dbTransportadora.TELEFONE1"
              id="TELEFONE1"
              name="TELEFONE1"
              class="obr ss"
              maxlength="15"
              autocomplete="off"
              v-mask="'(##) ####-####'"
            />
          </v-col>
          <v-col cols="3">
            <span>Telefone 2</span>
            <input
              type="text"
              v-model="state.dbTransportadora.TELEFONE2"
              id="TELEFONE2"
              name="TELEFONE2"
              class="ss"
              maxlength="15"
              autocomplete="off"
              v-mask="'(##) ####-####'"
            />
          </v-col>

          <v-col cols="6">
            <v-row>
              <v-col cols="3">
                <span>CEP</span>
                <input
                  type="text"
                  v-model="state.dbTransportadora.CEP"
                  id="CEP"
                  name="CEP"
                  class="ss"
                  maxlength="9"
                  autocomplete="off"
                  v-mask="'#####-###'"
                  @keydown.enter="actions.buscaCEP"
                  v-on:focusout="actions.buscaCEP"
                />
              </v-col>
              <v-col cols="9">
                <span>Endereço</span>
                <input
                  type="text"
                  v-model="state.dbTransportadora.ENDERECO"
                  id="ENDERECO"
                  name="ENDERECO"
                  class="ss"
                  maxlength="40"
                  autocomplete="off"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="7">
                <span>Bairro</span>
                <input
                  type="text"
                  v-model="state.dbTransportadora.BAIRRO"
                  id="BAIRRO"
                  name="BAIRRO"
                  class="ss"
                  maxlength="20"
                  autocomplete="off"
                />
              </v-col>
              <v-col cols="5">
                <span>Cidade</span>
                <select
                  v-model="state.dbTransportadora.COD_CIDADE"
                  name="COD_CIDADE"
                  id="COD_CIDADE"
                  class="ss"
                >
                  <option
                    v-for="cidade in state.listaCidades"
                    :value="cidade.COD_CIDADE"
                  >
                    {{ cidade.DESCRICAO }}
                  </option>
                </select>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="6">
            <v-row>
              <v-col>
                <span>Obs.</span>
                <textarea
                  v-model="state.dbTransportadora.OBS"
                  name="OBS"
                  id="OBS"
                  rows="5"
                  class="ss"
                  maxlength="600"
                >
                </textarea>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </div>
      <div>
        <v-row>
          <v-col>
            <v-row>
              <v-col class="pt-5">
                <v-checkbox
                  v-model="state.isChecked"
                  label="Exibir Inativos"
                  color="blue"
                  :disabled="state.toggleDisabled"
                  @change="state.isChecked != state.isChecked"
                  @update:model-value="actions.search"
                >
                </v-checkbox>
              </v-col>
              <v-col cols="9">
                <transportadoraSearch />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
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

      <div id="gridPrincipal"></div>
      <div
        id="pnBotoes"
        class="mt-3"
        style="text-align: center"
      ></div>
    </v-card>
    <div id="pnCodigoTela">CADASTRO_TRANSPORTADORA</div>
  </v-container>
</template>

<style scoped></style>
