<script setup lang="ts">
import { onMounted } from "vue";
import { actions, options, state } from "./chamados";
import CModalDetalhes from "./components/cModalDetalhes.vue";
import assunto from "./components/assunto.vue";

onMounted(async () => {
  actions.init();
});
</script>

<template>
  <v-container class="containerChamados">
    <title>Cadastro de Chamados</title>
    <v-card
      :max-width="1000"
      class="ma-auto pa-4"
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
            <v-col cols="6">
              <v-select
                v-model="state.assunto"
                class="obr text-uppercase rounded"
                :items="options.assuntos"
                item-title="text"
                item-value="value"
                @update:model-value="actions.resetDadosRH"
                label="Assunto"
                density="compact"
                :clearable="false"
              ></v-select>
            </v-col>
            <v-col cols="6">
              <div class="custom-file-input">
                <label
                  @click="actions.selecionarAnexos"
                  class="file-label"
                  >Anexar imagem</label
                >
                <v-btn
                  icon
                  size="30px"
                  color="primary"
                  @click="actions.selecionarAnexos"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>

                <v-file-input
                  id="fileInput"
                  class="hidden-file-input"
                  accept=".pdf, .jpg, .jpeg"
                  density="compact"
                  multiple
                  @change="actions.adicionarAnexo"
                ></v-file-input>

                <div class="image-preview-container">
                  <PhotoProvider
                    v-for="(file, index) in state.previews"
                    :key="index"
                    :default-backdrop-opacity="0.8"
                  >
                    <template v-if="state.anexos[index]?.type === 'application/pdf'">
                      <div class="preview-wrapper">
                        <img
                          src="./assets/pdf-svgrepo-com.svg"
                          class="view-box img-miniatura"
                          alt="PDF"
                        />
                        <v-btn
                          icon
                          size="20px"
                          color="outline"
                          class="remove-icon-btn"
                          @click.stop="actions.removerAnexo(index)"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </div>
                    </template>
                    <template v-else>
                      <PhotoConsumer :src="file">
                        <div class="preview-wrapper">
                          <img
                            :src="file"
                            class="view-box img-miniatura"
                            alt="Preview"
                          />
                          <v-btn
                            icon
                            size="20px"
                            color="outline"
                            class="remove-icon-btn"
                            @click.stop="actions.removerAnexo(index)"
                          >
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </div>
                      </PhotoConsumer>
                    </template>
                  </PhotoProvider>
                </div>
              </div>
            </v-col>

            <v-col
              cols="12"
              v-if="state.assunto === 'RH ADMISSAO'"
            >
              <div class="d-flex align-center flex-column ga-4">
                <assunto v-model="state.dadosRhAdmissao"></assunto>
              </div>
            </v-col>
          </v-row>

          <v-row v-if="state.assunto !== 'RH ADMISSAO'">
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
          </v-row>

          <v-data-table-server
            v-model:itemsPerPage="state.itemsPerPage"
            :headers="state.headers"
            :items-length="state.totalItems"
            :items="state.chamados"
            :loading="state.loading"
            :search="state.search"
            fixed-header
            class="mt-4"
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
                  actions.verDetalhesChamado(
                    item.KEY_JIRA,
                    item.DESCRICAO,
                    item.SOLICITANTE,
                    item.dataFormatada,
                    item.GRUPO_EMAIL
                  )
                "
              ></v-btn>
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
  margin-bottom: 20px;
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

.custom-file-input {
  display: flex;
  align-items: center;
  gap: 8px;
}

.image-preview-container {
  display: flex;
  gap: 10px;
  margin-top: -15px;
  padding-left: 5px;
  flex-wrap: wrap;
  overflow-x: auto;
  max-height: 100px;
  justify-content: flex-start;
}

.preview-wrapper {
  position: relative;
  display: inline-block;
}

.preview-wrapper img {
  width: 70px;
  height: 60px;
  cursor: pointer;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.remove-icon-btn {
  position: absolute;
  top: 0;
  right: 0;
  background-color: white;
  border-radius: 50%;
  padding: 4px;
  z-index: 10;
}

.v-btn.remove-icon-btn {
  padding: 0;
  min-width: 20px;
  height: 20px;
}

.preview-wrapper img {
  border: 2px solid #ccc;
  transition: border-color 0.3s;
}

.preview-wrapper img:hover {
  border-color: #ff4081;
}

.hidden-file-input {
  display: none;
}

.file-label {
  font-size: 14px;
}
</style>
