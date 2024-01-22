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
    <v-card class="pa-5 cardChamado">
      <h1 class="tituloChamados">Abertura de Chamados - CPD</h1>
      <span class="subtitle">
        Preencha o formulário com as informações solicitadas para abertura de um
        chamado:
      </span>

      <div id="pnCampos" class="pnCampos">
        <v-form>
          <v-row>
            <v-col cols="12" sm="6" md="4">
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
                class="obr ss"
                rows="3"
                label="DESCREVA COM O MÁXIMO DE DETALHES O MOTIVO DO CHAMADO"
                required
                @input="state.descricao = state.descricao.toUpperCase()"
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
            class="elevation-1"
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
                  actions.verDetalhesChamado(
                    item.KEY_JIRA,
                    item.DESCRICAO,
                    item.SOLICITANTE,
                    item.dataFormatada
                  )
                "
              ></v-btn>
            </template>
            <template #no-data>
              <v-alert :value="true" icon="mdi-information">
                Não há chamados disponíveis.
              </v-alert>
            </template>
          </v-data-table-server>

          <v-row>
            <v-col cols="12" class="d-flex justify-end mt-5">
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
                :loading="state.loadingSalvar"
                >Salvar</v-btn
              >
            </v-col>
          </v-row>
        </v-form>
      </div>
    </v-card>
  </v-container>

  <div id="pnModalDetalhes" title="Detalhes do Chamado">
    <c-modal-detalhes />
  </div>

  <v-overlay
    :model-value="state.loadingBuscarDetalhes"
    class="align-center justify-center"
  >
    <v-progress-circular
      color="primary"
      indeterminate
      size="64"
      persistent
    ></v-progress-circular>
  </v-overlay>
</template>

<style scoped>
.btnEnviar {
  margin-right: 10px;
  margin-left: 10px;
}

.cardChamado {
  width: 700px;
  margin: 0 auto;
  margin-top: 30px;
}
.pnCampos {
  margin-top: 25px;
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
