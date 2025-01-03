<script setup lang="ts">
import { actions, state, eventListener } from "./fornecedores";
import { onMounted, onUnmounted } from "vue";
import ModalSelecionarFornecedor from "./components/modalRepresentantesFornecedores.vue";

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
      height="650"
      class="pa-5 ma-auto"
    >
      <div id="pnCampos">
        <v-row class="mt-n1">
          <v-col>
            <span>CNPJ</span>
            <input
              v-model="state.dbFornecedor.CGC_FORNECEDOR"
              type="text"
              id="CGC_FORNECEDOR"
              name="CGC_FORNECEDOR"
              class="obr ss"
              maxlength="18"
              v-mask="'##.###.###.####-##'"
              autocomplete="off"
            />
          </v-col>
          <v-col>
            <span>Inscrição Estadual</span>
            <input
              v-model="state.dbFornecedor.INSC_ESTADUAL"
              type="text"
              id="INSC_ESTADUAL"
              name="INSC_ESTADUAL"
              class="ss"
              maxlength="15"
              autocomplete="off"
              v-mask="'###.###.###.###'"
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
          <v-col cols="3">
            <span>Nome Fantasia</span>
            <input
              v-model="state.dbFornecedor.NOME_FANTAZIA"
              type="text"
              id="NOME_FANTASIA"
              name="NOME_FANTAZIA"
              class="ss"
              maxlength="60"
              autocomplete="off"
            />
          </v-col>
        </v-row>
        <v-row class="mt-n1">
          <v-col cols="5">
            <span>Nome do Representante</span>
            <div class="d-flex ga-2 align-center"
              ><input
                v-model="state.dbFornecedor.NOME"
                type="text"
                id="ID_REPRESENTANTE"
                name="ID_REPRESENTANTE"
                class="ss"
                maxlength="60"
                autocomplete="off"
                placeholder="Digite o nome do representante" />
              <v-btn
                ga-2
                color="primary"
                icon="mdi-magnify"
                @click="state.modalFornecedorOpened = true"
                size="30"
            /></div>
          </v-col>

          <v-col cols="4">
            <span>Site</span>
            <input
              v-model="state.dbFornecedor.HOME_PAGE"
              type="text"
              id="HOME_PAGE"
              name="HOME_PAGE"
              class="ss"
              maxlength="100"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="3">
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
            <span>Nome Responsável</span>
            <input
              v-model="state.dbFornecedor.CONTADO"
              type="text"
              id="CONTADO"
              name="CONTADO"
              class="ss"
              maxlength="60"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="4">
            <span>Telefone 1</span>
            <input
              v-model="state.dbFornecedor.TELEFONE1"
              type="text"
              id="TELEFONE1"
              name="TELEFONE1"
              class="ss"
              maxlength="15"
              v-mask="'(##) #####-####'"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="4">
            <span>Telefone 2</span>
            <input
              v-model="state.dbFornecedor.TELEFONE2"
              type="text"
              id="TELEFONE2"
              name="TELEFONE2"
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
              v-model="state.dbFornecedor.CEP"
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
          <v-col cols="4">
            <span>Endereço</span>
            <input
              v-model="state.dbFornecedor.ENDERECO"
              type="text"
              id="ENDERECO"
              name="ENDERECO"
              class="obr ss"
              maxlength="100"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="2">
            <span>Municipio</span>
            <input
              v-model="state.dbFornecedor.MUNICIPIO"
              type="text"
              id="MUNICIPIO"
              name="MUNICIPIO"
              class="ss"
              maxlength="50"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="2">
            <span>Bairro</span>
            <input
              v-model="state.dbFornecedor.BAIRRO"
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
            <select
              v-model="state.dbFornecedor.COD_CIDADE"
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
        </v-row>

        <v-row class="mt-n1">
          <v-col cols="3">
            <div
              ><span>Data de Cadastro</span>
              <input
                :value="actions.formatCadastroDate()"
                id="CADASTRO"
                name="CADASTRO"
                class="ss"
                :disabled="true"
            /></div>

            <div>
              <v-checkbox
                v-model="state.isChecked"
                label="Exibir Inativos"
                color="blue"
                :disabled="state.toggleDisabled"
                @change="state.isChecked != state.isChecked"
                @update:model-value="actions.search"
              >
              </v-checkbox>
            </div>
          </v-col>

          <v-col>
            <span>Observações</span>
            <textarea
              v-model="state.dbFornecedor.OBS"
              id="OBS"
              name="OBS"
              class="ss"
              rows="3"
            ></textarea>
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

        <div
          id="pnBotoes"
          class="mt-4"
          style="text-align: center"
        ></div>
      </div>
    </v-card>

    <div id="pnCodigoTela">Fornecedores</div>
    <v-dialog
      v-model="state.modalFornecedorOpened"
      width="600"
    >
      <ModalSelecionarFornecedor
        @selecionarRepresentante="actions.selecionarRepresentante"
        @cancelar="actions.closeModal"
      />
    </v-dialog>
  </v-container>
</template>

<style scoped></style>
