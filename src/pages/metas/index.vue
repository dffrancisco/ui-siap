<script setup lang="ts">
import { onMounted } from "vue";
import { state, meses, anos, vendedorOuMontador, headers, actions } from "./metas";
import ModalDistribuirMetas from "./components/modalDistribuirMetas.vue";
import { iResponseFuncionarios, iResponseMetasMontadores, iResponseMetasVendedores } from "./interfaces";

onMounted(async () => {
  actions.init(state.mes, state.ano);
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
                :items="anos"
                :clearable="false"
                @update:model-value="actions.onClickMetas"
              ></v-text-field>
            </v-col>
            <v-col cols="5">
              <v-select
                :items="vendedorOuMontador.options"
                :clearable="false"
                label="Tipo de meta"
                v-model="state.opcaoMeta"
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
                      <p>10.400.000,00</p>
                    </div>
                  </v-card>
                </v-col>

                <v-col cols="3">
                  <v-card class="metas_tiposDeMeta">
                    <p class="metas_tiposDeMeta_texto">Meta Acumulada</p>

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
                    <p class="metas_tiposDeMeta_texto">Meta do dia</p>
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
                    <p class="metas_tiposDeMeta_texto">Meta previsão</p>
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
        class="pa-2 pt-5 barraDeProgresso"
        style="max-width: 1100px; margin: 0 auto"
      >
        <v-progress-linear
          color="primary"
          model-value="33"
          :height="15"
          style="border-radius: 5px"
        ></v-progress-linear>
      </div>
    </div>

    <div style="max-width: 1120px; margin: 0 auto">
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
        :funcionarios="state.funcionarios as iResponseFuncionarios"
        :mesEAno="{
          mes: state.mes,
          ano: state.ano,
        }"
        :dadosParaDistribuirMetas="{
          vendedores: state.vendedores as iResponseMetasVendedores[],
          montadores: state.montadores as iResponseMetasMontadores[],
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
  /* font-family: "Nunito Sans", sans-serif; */
  font-size: 15px;
  font-weight: 600;
  line-height: 24.55px;
  letter-spacing: -0.06428570300340652px;
  text-align: center;
  border-radius: 12px;
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
  width: 1090px;
  justify-content: center;
  text-align: center;
}

.tableMetas {
  width: 1110px;
  border-radius: 10px;
}
</style>
