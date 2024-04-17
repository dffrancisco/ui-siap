<script setup lang="ts">
import { onMounted } from "vue";
import { state, meses, vendedorOuMontador, actions, totalizadorMetas } from "./metas";
import ModalDistribuirMetas from "./components/modalDistribuirMetas.vue";
import utils from "@/ts/utils";

onMounted(async () => {
  actions.init();
});
</script>

<template>
  <v-container>
    <title>Metas Vendedores e Montadores</title>
    <div
      class="pt-5"
      style="max-width: 1100px; margin: 0 auto"
    >
      <div>
        <v-col cols="12">
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
                @update:model-value="actions.onClickMetas"
              ></v-select>
            </v-col>
            <v-col cols="2">
              <v-text-field
                id="ano"
                type="number"
                label="Ano"
                v-model="state.ano"
                :clearable="false"
                @update:model-value="actions.onClickMetas"
              ></v-text-field>
            </v-col>
            <v-col cols="5">
              <v-select
                v-model="state.opcaoMeta"
                :items="vendedorOuMontador"
                item-value="value"
                item-title="title"
                :clearable="false"
                label="Tipo de meta"
                @update:model-value="actions.onClickMetas"
              >
              </v-select>
            </v-col>
            <v-col cols="2">
              <v-btn
                title="Distribuir metas"
                class="mr-4 mb-4 metas_btn"
                color="primary"
                @click.prevent="actions.distribuirMetas"
                >Distribuir metas
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </div>

      <div>
        <v-row>
          <v-col
            cols="12"
            class="pt-0"
          >
            <div class="metas">
              <v-row>
                <v-col cols="3">
                  <v-card class="metas_tiposDeMeta">
                    <p class="metas_tiposDeMeta_texto">Meta</p>

                    <div class="metas_tiposDeMeta_valor">
                      <p>{{ utils.formatValor(totalizadorMetas.meta) }}</p>
                    </div>
                  </v-card>
                </v-col>

                <v-col cols="3">
                  <v-card class="metas_tiposDeMeta">
                    <p class="metas_tiposDeMeta_texto">Meta Acumulada</p>

                    <div class="metas_tiposDeMeta_valor">
                      <p>{{ utils.formatValor(totalizadorMetas.metaAcumulada) }}</p>
                    </div>
                    <div class="metas_tiposDeMeta_porcentagem">
                      <p> {{ totalizadorMetas.percentualMetaAcumulada }} % da meta atingida</p>
                    </div>
                  </v-card>
                </v-col>

                <v-col cols="3">
                  <v-card class="metas_tiposDeMeta">
                    <p class="metas_tiposDeMeta_texto">Meta do dia</p>
                    <div class="metas_tiposDeMeta_valor">
                      <p>{{ utils.formatValor(totalizadorMetas.metaDoDia) }}</p>
                    </div>
                    <div class="metas_tiposDeMeta_porcentagem">
                      <p v-if="totalizadorMetas.percentualMetaPrevisao === 0">
                        {{ state.metaNaoSeAplica }}
                      </p>
                      <p v-else> {{ totalizadorMetas.percentualMetaDoDia }} % da meta atingida </p>
                    </div>
                  </v-card>
                </v-col>

                <v-col cols="3">
                  <v-card class="metas_tiposDeMeta">
                    <p class="metas_tiposDeMeta_texto">Meta previsão</p>
                    <div class="metas_tiposDeMeta_valor">
                      <p>{{ utils.formatValor(totalizadorMetas.metaPrevisao) }}</p>
                    </div>
                    <div class="metas_tiposDeMeta_porcentagem">
                      <p v-if="totalizadorMetas.percentualMetaPrevisao === 0">
                        {{ state.metaNaoSeAplica }}
                      </p>
                      <p v-else> {{ totalizadorMetas.percentualMetaPrevisao }} % da meta atingida </p>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </div>
          </v-col>
        </v-row>
      </div>

      <div
        class="pa-1 pt-5 barraDeProgresso"
        style="max-width: 1100px; margin: 0 auto"
      >
        <v-progress-linear
          v-model="totalizadorMetas.percentualMetaAcumulada"
          color="primary"
          height="20"
          style="border-radius: 10px"
        >
          <template v-slot:default="{ value }">
            <strong>{{ Math.ceil(value) }}%</strong>
          </template>
        </v-progress-linear>
      </div>
    </div>

    <div style="max-width: 1120px; margin: 0 auto">
      <v-container>
        <v-data-table
          class="tableMetas"
          v-model:itemsPerPage="state.itemsPerPage"
          items-per-page-text="Itens por página"
          :headers="state.headers"
          :items-length="state.totalItems"
          :items="state.opcaoMeta === 0 ? state.vendedoresArray : state.montadoresArray"
          :loading="state.loading"
          :search="state.search"
        >
          <template #item.PREVISAO="{ item }">
            {{ actions.formatPrevisao(item.PREVISAO) }}
          </template>

          <template #item.PROGRESSO="{ item }">
            <v-progress-linear
              v-model="item.PROGRESSO"
              color="primary"
              height="20"
              style="border-radius: 10px"
            >
              <template v-slot:default="{ value }">
                <strong>{{ Math.ceil(value) }}%</strong>
              </template>
            </v-progress-linear>
          </template>
          <template #no-data>
            <v-alert
              :value="true"
              icon="mdi-information"
            >
              Não há dados disponíveis.
            </v-alert>
          </template>
        </v-data-table>
      </v-container>
    </div>

    <div
      id="modalDistribuirMetas"
      title="Distribuir Metas"
      style="display: none; background-color: #f0f6fa"
    >
      <ModalDistribuirMetas
        :mes="state.mes"
        :ano="state.ano"
        :funcionarios="state.funcionarios"
        :metaMontadores="state.montadoresArray"
        :metaVendedores="state.vendedoresArray"
        :optionSelect="state.opcaoMeta"
        :opened="state.modalDistribuirMetasOpened"
        @inserirMeta="actions.inserirMeta"
        @opcaoCargoEscolhido="actions.atualizarOpcaoMeta"
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

<style>
.v-table > .v-table__wrapper > table > tbody > tr > td {
  width: 80px !important;
}
</style>

<style scoped>
.metas {
  padding-top: 5px;
}

.metas_tiposDeMeta {
  width: auto;
  height: 120px;
  padding-top: 20px;
  flex-direction: column;
  justify-content: center;
  border-radius: 14px;
}

.metas_tiposDeMeta_texto {
  font-size: 16px;
  font-weight: 600;
  padding-left: 25px;
  line-height: 21.82px;
  color: #606060;
  font-family: "Nunito Sans", sans-serif;
}

.metas_tiposDeMeta_valor {
  font-size: 28px;
  font-weight: 700;
  size: 28px;
  color: #202224;
  letter-spacing: 1px;
  line-height: 38.19px;
  font-family: "Nunito Sans", sans-serif;
  padding-top: 10px;
  text-align: center;
}

.metas_btn {
  font-weight: 600;
  text-align: center;
  border-radius: 8px;
}

.metas_tiposDeMeta_porcentagem {
  font-family: "Nunito Sans", sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 19.1px;
  text-align: center;
  color: #606060;
}

.barraDeProgresso {
  width: 1100px;
  justify-content: center;
  text-align: center;
}

.tableMetas {
  width: 1110px;
  border-radius: 10px;
}
</style>
