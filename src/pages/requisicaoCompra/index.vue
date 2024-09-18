<script setup lang="ts">
import utils from "@/ts/utils";
import { state } from "./requisicaoCompra";
</script>

<template>
  <v-container>
    <v-card
      class="ma-auto pa-4 d-flex flex-column"
      width="900"
      height="550"
    >
      <div class="d-flex justify-space-between">
        <v-btn color="primary">Localizar Requisição (F1)</v-btn>
        <v-btn color="primary">Novo Requisição (F2)</v-btn>
      </div>

      <div class="mt-4">
        <v-row>
          <v-col cols="9">
            <div class="pa-3 rounded-lg containerDadosRequisicao">
              <v-row>
                <v-col cols="2">
                  <div class="d-flex flex-column">
                    <strong>Data:</strong>
                    <span>{{ utils.dataBrasil(state.dbDadosRequisicao.DATA_HORA_CRIACAO) || "-" }}</span>
                  </div>
                </v-col>
                <v-col cols="3">
                  <div class="d-flex flex-column">
                    <strong>CNPJ:</strong>
                    <span>{{ state.dbDadosRequisicao.CNPJ_FAVORECIDO || "-" }}</span>
                  </div>
                </v-col>
                <v-col>
                  <div class="d-flex flex-column">
                    <strong>Razão Social:</strong>
                    <span>{{ state.dbDadosRequisicao.NOME_FAVORECIDO || "-" }}</span>
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-col>

          <v-col>
            <div class="pa-3 rounded-lg containerDadosRequisicao">
              <v-row>
                <v-col>
                  <div class="d-flex flex-column">
                    <strong>Qtd. Itens:</strong>
                    <span>0</span>
                  </div>
                </v-col>
                <v-col>
                  <div class="d-flex flex-column">
                    <strong>Valor:</strong>
                    <span>2.000,00</span>
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-col>
        </v-row>
      </div>

      <div class="d-flex flex-grow-1 mt-4 flex-column">
        <div class="d-flex align-center justify-space-between">
          <h2>Itens:</h2>
          <!-- <div
            class="d-flex ga-8 pa-2 rounded-lg+"
            style="border: 1px solid gray"
          >
            <span><strong>Qtd. Itens: </strong>01</span>
            <span><strong>Valor: </strong>2.000,00</span>
          </div> -->
        </div>

        <div
          class="mt-2 d-flex flex-wrap ga-4"
          style="overflow: auto; max-height: 300px"
        >
          <v-card
            v-for="i in 50"
            color="#91d2f7"
            width="270"
            height="80"
            class="d-flex justify-center align-center"
            style="cursor: pointer"
          >
            <div
              class="d-flex flex-column align-center"
              style="color: #52525b; font-size: 12px"
            >
              <v-icon size="36">mdi-plus-circle-outline</v-icon>
              <span>NOVO ITEM (F3)</span>
            </div>
          </v-card>
        </div>
      </div>

      <div class="d-flex justify-space-between">
        <div>
          <v-btn
            v-if="state.dbDadosRequisicao.FINALIZADO == 'N'"
            icon="mdi-delete mdi-24px"
            color="#ef4444"
            size="36"
            title="Deletar Requisição"
          />

          <v-btn
            v-else
            icon="mdi-printer mdi-24px"
            color="primary"
            size="36"
            title="Imprimir Requisição"
          />
        </div>

        <div>
          <v-btn color="success">Finalizar Requisição (F6)</v-btn>
        </div>
      </div>
    </v-card>

    <div id="pnCodigoTela">requisicaoCompra</div>
  </v-container>
</template>

<style scoped>
.containerDadosRequisicao {
  border: 1px solid gray;
}

.containerDadosRequisicao strong,
.containerDadosRequisicao span {
  font-size: 12px;
}
</style>
