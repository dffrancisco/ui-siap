<script setup lang="ts">
import { actions, state } from "./chamados";
import CModalDetalhes from "./components/cModalDetalhes.vue";

const headers = [
  {
    title: "Assunto",
    key: "ASSUNTO",
    sortable: true,
  },
  {
    title: "Solicitante",
    key: "SOLICITANTE",
    sortable: true,
  },
  {
    title: "Data",
    key: "dataFormatada",
    sortable: true,
  },
  {
    title: "Ação",
    key: "ACAO",
    sortable: false,
  },
];

actions.begin();
</script>

<template>
  <v-container class="containerChamados">
    <title>Cadastro de Chamados</title>
    <v-card
      style="width: 800px; margin: 0 auto"
      class="pa-4"
    >
      <h1 class="tituloChamados">Abertura de Chamados - CPD</h1>
      <span class="subtitle">
        Preencha o formulário com as informações solicitadas para abertura de um chamado:
      </span>

      <div
        id="pnCampos"
        class="pnCampos"
      >
        <v-form>
          <v-row>
            <v-col
              cols="12"
              sm="6"
              md="4"
            >
              <span>Assunto</span>
              <select
                v-model="state.assunto"
                id="assunto"
                class="obr ss"
                required
              >
                <option value="">Selecionar Assunto</option>
                <option value="SISTEMA">Sistema</option>
                <option value="EQUIPAMENTO">Equipamento</option>
                <option value="REDE">Rede</option>
                <option value="TELEFONIA">Telefonia</option>
                <option value="ALARME">Alarme</option>
                <option value="CAMERA">Câmera</option>
                <option value="ELETRICA">Elétrica</option>
                <option value="DESIGN MARKETING">Design / Marketing</option>
              </select>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="state.descricao"
                id="descricao"
                class="obr text-uppercase rounded"
                rows="3"
                label="DESCREVA COM O MÁXIMO DE DETALHES O MOTIVO DO CHAMADO"
                required
                maxlength="500"
              ></v-textarea>
            </v-col>
            <v-col cols="12">
              <v-file-input
                v-if="false"
                v-model="state.anexos"
                label="Anexos"
                multiple
              ></v-file-input>
            </v-col>
          </v-row>

          <v-data-table-server
            v-model:itemsPerPage="state.itemsPerPage"
            :headers="headers"
            :items-length="state.totalItems"
            :items="state.chamados"
            :loading="state.loading"
            :search="state.search"
            fixed-header
            :height="200"
            id="tableChamados"
            item-value="ID_CHAMADO"
            @update:options="actions.getChamados"
          >
            <template #item.ACAO="{ item }">
              <v-btn
                title="Ver detalhes"
                color="primary"
                variant="text"
                density="compact"
                icon="mdi-eye"
                @click="
                  actions.verDetalhesChamado(item.KEY_JIRA, item.DESCRICAO, item.SOLICITANTE, item.dataFormatada)
                "
              ></v-btn>
            </template>
            <template #no-data>
              <v-alert
                :value="true"
                icon="mdi-information"
              >
                Não há chamados disponíveis.
              </v-alert>
            </template>
          </v-data-table-server>

          <v-row>
            <v-col
              cols="12"
              class="d-flex justify-end"
            >
              <v-btn
                @click="actions.resetForm"
                color="primary"
                variant="outlined"
                >Cancelar</v-btn
              >
              <v-btn
                @click="actions.submitForm"
                class="btnEnviar"
                color="primary"
                :loading="state.loading"
                >Salvar</v-btn
              >
            </v-col>
          </v-row>
        </v-form>
      </div>
    </v-card>

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
    <div id="pnCodigoTela">chamados</div>
  </v-container>

  <div
    id="pnModalDetalhes"
    title="Detalhes do Chamado"
  >
    <c-modal-detalhes />
  </div>
</template>

<style>
#tableChamados .v-data-table-footer {
  max-height: 2px;
  padding-top: 20px;
  margin-right: 220px;
}
</style>

<style scoped>
.btnEnviar {
  margin-right: 10px;
  margin-left: 10px;
}

.pnCampos {
  margin-top: 5px;
}

.tituloChamados {
  margin-top: 10px;
  text-align: center;
  align-items: center;
  display: flex;
}

.subtitle {
  font-size: 16px;
  text-align: center;
  align-items: center;
  display: flex;
}

@media (max-width: 768px) {
  .cardChamado {
    width: 360px;
    margin: 0 auto;
    margin-top: 20px;
  }
}
</style>
