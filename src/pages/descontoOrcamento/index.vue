<script setup lang="ts">
import { nextTick } from "vue";
import { actions, state } from "./descontoOrcamento";
import cAvatar100 from "@/components/cAvatar100.vue";
import CInfoOrcamento from "./components/cInfoOrcamento.vue";
import CInfoDesconto from "./components/cInfoDesconto.vue";
import XAuthManager from "../../plugins/xAuthManager/index.vue";
import CModalDescontoPeca from "./components/cModalDescontoPeca.vue";
import CModalUpdateProduto from "./components/cModalUpdateProduto.vue";

nextTick(() => {
  setTimeout(() => {
    actions.begin();
    actions.grid();
    actions.modal();
  });
});
</script>

<template>
  <x-auth-manager />

  <v-main>
    <v-container>
      <v-card
        max-width="1000"
        class="mx-auto pa-3"
      >
        <v-row style="height: 80px">
          <v-col
            cols="12"
            sm="8"
            md="8"
            class="pt-4"
          >
            <v-row>
              <v-col cols="1">
                <c-avatar100 :urlIMG="state.fotoVendedor" />
              </v-col>

              <v-col cols="5">
                <div class="text-truncate">
                  <v-alert
                    density="compact"
                    color="primary"
                    variant="outlined"
                  >
                    <i class="text-grey pr-1">Vendedor:</i>
                    <b>{{ state.dataOrcamento.NOME_VENDEDOR }} </b>
                    /
                    <v-chip
                      size="x-small"
                      color="primary"
                    >
                      Orç.: {{ state.dataOrcamento.NUM_ORCAMENTO }}
                    </v-chip>
                  </v-alert>
                </div>
              </v-col>

              <v-col cols="1">
                <c-avatar100
                  v-show="state.dataOrcamento.VALOR_MONTAGEN == 0 ? false : true"
                  :urlIMG="state.fotoMontador"
                />
              </v-col>

              <v-col cols="5">
                <div
                  v-show="state.dataOrcamento.VALOR_MONTAGEN == 0 ? false : true"
                  class="text-truncate"
                >
                  <v-alert
                    density="compact"
                    color="primary"
                    variant="outlined"
                  >
                    <i class="text-grey pr-1"> Montador: </i>
                    <b
                      >{{ state.dataOrcamento.NOME_MONTADOR }} /
                      {{ state.dataOrcamento.PLACA }}
                    </b>
                  </v-alert>
                </div>
              </v-col>
            </v-row>
          </v-col>

          <v-col
            cols="12"
            sm="3"
            md="3"
            class="text-right"
          >
            <v-text-field
              v-model="state.edtNumOrcamento"
              id="edtNumOrcamento"
              density="compact"
              label="Nº Orçamento (F2)"
              variant="outlined"
              autocomplete="off"
              clearable
              clear-icon="mdi-close"
              @focus.native="$event.target.select()"
              @keypress.enter="actions.consulta()"
              @keyup.arrow-down="state.gdItensOrcamento.focus()"
            ></v-text-field>
          </v-col>

          <v-col
            cols="12"
            sm="1"
            md="1"
          >
            <v-btn
              @click="actions.consulta()"
              color="primary"
              icon="mdi-magnify"
              size="small"
            ></v-btn>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="6">
            <c-info-orcamento
              :dados="state.dataOrcamento"
              :marcas-desconto="state.dataDescontoMarca"
            />
          </v-col>

          <v-col cols="6">
            <c-info-desconto />
          </v-col>

          <v-col
            cols="12"
            sm="12"
            md="12"
            class="mt-n2"
          >
            <v-progress-linear
              color="primary"
              v-model="state.timeAuth"
              max="1200"
            ></v-progress-linear>

            <div id="gdItensOrcamento"></div>
          </v-col>

          <v-col
            cols="12"
            sm="12"
            md="12"
          >
            <div class="mt-n3 text-center">
              <v-chip
                class="ma-2"
                size="x-small"
              >
                (Desc.V) Desconto Vendedor
              </v-chip>
              <v-chip
                class="ma-2"
                size="x-small"
              >
                (Desc.M) Desconto Marca
              </v-chip>
              <v-chip
                class="ma-2"
                size="x-small"
              >
                (Desc.G) Desconto Gerente
              </v-chip>
              <v-chip
                class="ma-2"
                size="x-small"
              >
                (Desc.T) Desconto Total
              </v-chip>
              <!-- <v-btn
                @click="actions.sendToCaixa()"
                v-if="state.dataOrcamento.EFETIVADO == '1' ? true : false"
                color="primary"
                size="small"
                >Enviar Para o Caixa</v-btn
              > -->
            </div>
          </v-col>
        </v-row>
      </v-card>
      <div id="pnCodigoTela">{{ state.codTela }}</div>
      <!-- <v-btn
        @click="globalActions.toggleTheme()"
        icon="mdi-theme-light-dark"
      ></v-btn> -->
    </v-container>
  </v-main>

  <div
    id="pnDesconto"
    title="Desconto Item do Orçamento"
    style="display: none"
  >
    <c-modal-desconto-peca />
  </div>

  <div
    id="pnUpdateProduto"
    title="Atualizar Quantidade no Estoque"
    style="display: none"
  >
    <c-modal-update-produto />
  </div>
</template>

<style lang="scss">
#gdItensOrcamento .desc-img {
  border-radius: 6px;
  border: 1px solid lightgrey;
}

.inputRed input {
  color: red;
  // text-align: right;
}

.fontsAdapt {
  font-size: 16px;
}
</style>
