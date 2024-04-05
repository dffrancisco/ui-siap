<script setup lang="ts">
import { state, meses, anos } from "./metas";
</script>

<template>
  <v-container>
    <title>Metas Vendedores e Montadores</title>
    <div
      class="pa-5"
      style="max-width: 1100px; margin: 0 auto"
    >
      <v-row>
        <v-col cols="12">
          <v-card class="pa-5 cardFolhaPonto">
            <v-row>
              <v-col cols="3">
                <v-select
                  id="mes"
                  label="Mês"
                  v-model="state.mes"
                  item-title="title"
                  item-value="value"
                  :items="meses"
                  :clearable="false"
                ></v-select>
              </v-col>
              <v-col cols="2">
                <v-text-field
                  id="ano"
                  label="Ano"
                  v-model="state.ano"
                  :items="anos"
                  :clearable="false"
                ></v-text-field>
              </v-col>
              <v-col cols="5">
                <v-select
                  :clearable="true"
                  label="Tipo de meta"
                  item-title="NOME_COMP"
                  item-value="COD_FUNCIONARIO"
                ></v-select>
              </v-col>
              <v-col cols="2">
                <v-btn
                  title="Distribuir metas"
                  class="mr-4 mb-4"
                  color="primary"
                  >Distribuir metas
                </v-btn>
              </v-col>
            </v-row>
            <!-- <v-divider class="mt-4 mb-3"></v-divider> -->
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col
          cols="12"
          class="pt-0"
        >
          <div class="metas">
            <v-row>
              <v-col cols="3">
                <v-card class="metas_tiposDeMeta">
                  <div class="metas_tiposDeMeta_content">
                    <p class="metas_tiposDeMeta_texto">Meta</p>
                    <v-avatar class="metas_tiposDeMeta_icon">
                      <v-img
                        size="60px"
                        aspect-ratio="1"
                        color="primary"
                        cover
                        src="src/pages/metas/assets/meta1.png"
                      ></v-img>
                    </v-avatar>
                  </div>
                  <div class="metas_tiposDeMeta_valor">
                    <p>10.400.000,00</p>
                  </div>
                </v-card>
              </v-col>

              <v-col cols="3">
                <v-card class="metas_tiposDeMeta">
                  <div class="metas_tiposDeMeta_content">
                    <p class="metas_tiposDeMeta_texto">Meta Acumulada</p>
                    <v-avatar class="metas_tiposDeMeta_icon">
                      <v-img
                        size="60px"
                        aspect-ratio="1"
                        color="primary"
                        cover
                        src="src/pages/metas/assets/meta2.png"
                      ></v-img>
                    </v-avatar>
                  </div>
                  <div class="metas_tiposDeMeta_valor">
                    <p>1.800.000,00</p>
                  </div>
                  <div class="metas_tiposDeMeta_porcentagem">
                    <p>15% da meta atingida</p>
                  </div>
                </v-card>
              </v-col>

              <v-col cols="3">
                <v-card class="metas_tiposDeMeta">
                  <div class="metas_tiposDeMeta_content">
                    <p class="metas_tiposDeMeta_texto">Meta do dia</p>
                    <v-avatar class="metas_tiposDeMeta_icon">
                      <v-img
                        size="60px"
                        aspect-ratio="1"
                        color="primary"
                        cover
                        src="src/pages/metas/assets/meta3.png"
                      ></v-img>
                    </v-avatar>
                  </div>
                  <div class="metas_tiposDeMeta_valor">
                    <p>58.000,00</p>
                  </div>
                  <div class="metas_tiposDeMeta_porcentagem">
                    <p>75% da meta atingida</p>
                  </div>
                </v-card>
              </v-col>

              <v-col cols="3">
                <v-card class="metas_tiposDeMeta">
                  <div class="metas_tiposDeMeta_content">
                    <p class="metas_tiposDeMeta_texto">Meta previsão</p>
                    <v-avatar class="metas_tiposDeMeta_icon">
                      <v-img
                        size="60px"
                        aspect-ratio="1"
                        color="primary"
                        cover
                        src="src/pages/metas/assets/meta4.png"
                      ></v-img>
                    </v-avatar>
                  </div>
                  <div class="metas_tiposDeMeta_valor">
                    <p>7.400.000,00</p>
                  </div>
                  <div class="metas_tiposDeMeta_porcentagem">
                    <p>15% da meta atingida</p>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
    </div>

    <div id="pnCodigoTela">METAS</div>
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
  </v-container>
</template>

<style scoped>
.metas_tiposDeMeta {
  width: auto;
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.metas_tiposDeMeta_content {
  display: flex;
}

.metas_tiposDeMeta_texto {
  font-size: 14px;
  font-weight: 480;
  padding-left: 25px;
}

.metas_tiposDeMeta_icon {
  width: 25px;
  height: 25px;
  margin-left: 80px;
}

.metas_tiposDeMeta_valor {
  font-size: 20px;
  font-weight: 480;
  color: #202224;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-top: 20px;
  text-align: center;
}

.metas_tiposDeMeta_porcentagem {
  font-size: 12px;
  font-weight: 300;
  text-align: center;
}
</style>
