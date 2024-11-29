<script setup lang="ts">
import { actions, state, eventListener } from "./fornecedores";
import { onMounted, onUnmounted } from "vue";

onMounted(async () => {
  await actions.init();
  window.addEventListener("keydown", eventListener);
});

onUnmounted(() => {
  window.removeEventListener("keydown", eventListener);
});
</script>

<template>
  <v-container>
    <title>Gerenciar Fornecedores</title>
    <v-card
      width="900"
      class="pa-5 ma-auto"
    >
      <div id="pnCampos">
        <v-row class="mt-n1">
          <v-col cols="4">
            <span>CNPJ</span>
            <input
              v-model="state.dbFornecedor.CNPJ"
              type="text"
              id="CNPJ"
              name="CNPJ"
              class="obr ss"
              maxlength="18"
              v-mask="'##.###.###/####-##'"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="4">
            <span>Inscrição Estadual</span>
            <input
              v-model="state.dbFornecedor.IE"
              type="text"
              id="IE"
              name="IE"
              class="ss"
              maxlength="15"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="4">
            <span>Razão Social</span>
            <input
              v-model="state.dbFornecedor.RAZAO_SOCIAL"
              type="text"
              id="RAZAO_SOCIAL"
              name="RAZAO_SOCIAL"
              class="obr ss"
              maxlength="60"
              autocomplete="off"
            />
          </v-col>
        </v-row>

        <v-row class="mt-n1">
          <v-col cols="4">
            <span>Nome Fantasia</span>
            <input
              v-model="state.dbFornecedor.NOME_FANTASIA"
              type="text"
              id="NOME_FANTASIA"
              name="NOME_FANTASIA"
              class="ss"
              maxlength="60"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="4">
            <span>Telefone</span>
            <input
              v-model="state.dbFornecedor.TELEFONE"
              type="text"
              id="TELEFONE"
              name="TELEFONE"
              class="ss"
              maxlength="15"
              v-mask="'(##) #####-####'"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="4">
            <span>E-mail</span>
            <input
              v-model="state.dbFornecedor.EMAIL"
              type="email"
              id="EMAIL"
              name="EMAIL"
              class="ss"
              maxlength="60"
              autocomplete="off"
            />
          </v-col>
        </v-row>

        <v-row class="mt-n1">
          <v-col cols="4">
            <span>CEP</span>
            <input
              v-model="state.dbFornecedor.CEP"
              type="text"
              id="CEP"
              name="CEP"
              class="ss"
              maxlength="9"
              v-mask="'#####-###'"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="8">
            <span>Endereço</span>
            <input
              v-model="state.dbFornecedor.ENDERECO"
              type="text"
              id="ENDERECO"
              name="ENDERECO"
              class="ss"
              maxlength="100"
              autocomplete="off"
            />
          </v-col>
        </v-row>

        <v-row class="mt-n1">
          <v-col cols="4">
            <span>Bairro</span>
            <input
              v-model="state.dbFornecedor.BAIRRO"
              type="text"
              id="BAIRRO"
              name="BAIRRO"
              class="ss"
              maxlength="50"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="4">
            <span>Cidade</span>
            <input
              v-model="state.dbFornecedor.CIDADE"
              type="text"
              id="CIDADE"
              name="CIDADE"
              class="ss"
              maxlength="50"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="4">
            <span>UF</span>
            <select
              v-model="state.dbFornecedor.UF"
              id="UF"
              name="UF"
              class="obr ss"
            >
              <option
                v-for="uf in state.ufs"
                :key="uf"
                :value="uf"
              >
                {{ uf }}
              </option>
            </select>
          </v-col>
        </v-row>

        <v-row class="mt-n1">
          <v-col cols="10">
            <span>Nome do Representante</span>
            <input
              v-model="state.dbFornecedor.REPRESENTANTE"
              type="text"
              id="REPRESENTANTE"
              name="REPRESENTANTE"
              class="ss"
              maxlength="60"
              autocomplete="off"
              placeholder="Digite o nome do representante"
            />
          </v-col>
          <v-col
            cols="2"
            class="d-flex align-center"
          >
            <v-btn
              color="primary"
              @click="actions.searchRepresentative()"
              icon="mdi-magnify"
              class="ss"
              size="30"
            />
          </v-col>
        </v-row>

        <div class="mt-4 d-flex ga-2">
          <input
            v-model="state.edtSearch"
            type="text"
            placeholder="F1 - Buscar"
            :disabled="state.pnSearch"
            @keydown.enter.prevent="state.gridPrincipal.queryOpen({ param: state.edtSearch })"
            id="edtSearch"
            class="ss"
          />
          <v-btn
            :disabled="state.pnSearch"
            size="30"
            color="primary"
            @click="state.gridPrincipal.queryOpen({ param: state.edtSearch })"
            icon="mdi-magnify"
          />
        </div>
      </div>

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
        id="gridPrincipal"
        class="mt-4"
      ></div>

      <div
        id="pnBotoes"
        class="mt-4"
        style="text-align: center"
      ></div>
    </v-card>

    <div id="pnCodigoTela">Fornecedores</div>
  </v-container>
</template>

<style scoped>
.ss {
  margin-right: 5px;
  margin-top: 1px;
}

.mt-4 {
  margin-top: 16px;
}
</style>
