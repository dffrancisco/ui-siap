<script setup lang="ts">
import { onMounted } from "vue";
import { state, meses, anos, vendedorOuMontador, headers, actions } from "./metas";
import ModalDistribuirMetas from "./components/modalDistribuirMetas.vue";
import { iResponseMetasVendedores } from "./interfaces";

onMounted(async () => {
  actions.init(state.mes, state.ano);
});
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
          <v-card class="pa-5">
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
                  @update:model-value="actions.getMetasVendedores(state.mes, state.ano)"
                ></v-select>
              </v-col>
              <v-col cols="2">
                <v-text-field
                  id="ano"
                  label="Ano"
                  v-model="state.ano"
                  :items="anos"
                  :clearable="false"
                  @update:model-value="actions.getMetasVendedores(state.mes, state.ano)"
                ></v-text-field>
              </v-col>
              <v-col cols="5">
                <v-select
                  :items="vendedorOuMontador.options"
                  :clearable="false"
                  label="Tipo de meta"
                  v-model="state.opcaoMeta"
                  @update:model-value=""
                >
                </v-select>
              </v-col>
              <v-col cols="2">
                <v-btn
                  title="Distribuir metas"
                  class="mr-4 mb-4"
                  color="primary"
                  @click.prevent="actions.distribuirMetas"
                  >Distribuir metas
                </v-btn>
              </v-col>
            </v-row>
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
    <div
      class="pa-2 barraDeProgresso"
      style="max-width: 1100px; margin: 0 auto"
    >
      <v-progress-linear
        color="primary"
        model-value="33"
        :height="15"
        style="border-radius: 5px"
      ></v-progress-linear>
    </div>

    <div style="max-width: 1100px; margin: 0 auto">
      <v-container>
        <v-data-table-server
          class="tableMetas"
          v-model:itemsPerPage="state.itemsPerPage"
          :headers="headers"
          :items-length="state.totalItems"
          :loading="state.loading"
          :search="state.search"
        >
          <template #no-data>
            <v-alert
              :value="true"
              icon="mdi-information"
            >
              Não há dados disponíveis.
            </v-alert>
          </template>
        </v-data-table-server>
      </v-container>
    </div>

    <div
      id="modalDistribuirMetas"
      title="Distribuir Metas"
      style="display: none; background-color: #f0f6fa"
    >
      <ModalDistribuirMetas
        :dadosParaDistribuirMetas="{
          mes: state.mes,
          ano: state.ano,
          vendedores: state.vendedores as iResponseMetasVendedores[],
        }"
        :opened="state.modalDistribuirMetasOpened"
      />
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

.barraDeProgresso {
  width: 1070px;
  justify-content: center;
  text-align: center;
}

.tableMetas {
  width: 1100px;
  border-radius: 10px;
}
</style>
