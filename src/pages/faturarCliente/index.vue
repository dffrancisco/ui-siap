<script setup lang="ts">
import { onMounted } from "vue";
import { actions, computeds, state } from "./faturarCliente";
import ModalSelecionarCliente from "./components/ModalSelecionarCliente.vue";
import utils from "@/ts/utils";
import ModalGerarBoleto from "./components/ModalGerarBoleto.vue";

onMounted(async () => {
  await actions.init();
});
</script>

<template>
  <v-container>
    <v-card
      width="800"
      height="550"
      class="ma-auto pa-4 d-flex flex-column"
    >
      <div>
        <v-row class="align-start">
          <v-col cols="3">
            <v-text-field
              type="date"
              v-model="state.dataLimite"
              label="Data limite"
              :clearable="false"
              density="compact"
            />
          </v-col>
          <v-col class="d-flex ga-4">
            <v-text-field
              type="text"
              label="Cliente (Pesquisar F2)"
              density="compact"
              readonly
              :clearable="false"
              v-model="state.dbClienteFaturado.NOME"
              @click="state.modalSelecionarClienteOpened = true"
            />
            <div class="d-flex align-center">
              <v-btn
                icon="mdi-magnify"
                size="34"
                title="Pesquisar (F2)"
                color="primary"
                @click="state.modalSelecionarClienteOpened = true"
              />
            </div>
          </v-col>
        </v-row>
      </div>

      <div
        class="mt-4 d-flex"
        style="height: 380px"
      >
        <v-row>
          <v-col
            cols="9"
            class="d-flex"
          >
            <div id="gridOrcamentosClienteFaturado"></div>
          </v-col>
          <v-col class="d-flex">
            <div class="border rounded-lg d-flex flex-grow-1 flex-column justify-space-between px-2 py-3">
              <div class="custom-scroll">
                <div v-for="orcamento in state.orcamentosLocalizados">
                  <div class="d-flex ga-2">
                    <div
                      v-if="!orcamento.ISDEVOLUCAO"
                      class="d-flex justify-space-between flex-grow-1"
                    >
                      <span class="text-body-1">+{{ orcamento.NUM_ORCAMENTO }}</span>
                      <span
                        class="text-body-1 font-weight-bold"
                        style="color: #60a5fa"
                        >{{ utils.formatValor(orcamento.VALOR) }}</span
                      >
                    </div>
                    <div
                      v-else
                      class="d-flex justify-space-between flex-grow-1"
                    >
                      <span class="text-body-1">D{{ orcamento.NUM_DEVOLUCAO }}</span>
                      <span
                        class="text-body-1 font-weight-bold"
                        style="color: #f87171"
                      >
                        -{{ utils.formatValor(orcamento.DEVOLUCAO) }}
                      </span>
                    </div>
                    <v-icon
                      @click="actions.excluirOrcLocalizado(orcamento)"
                      title="Excluir orçamento"
                      >mdi-delete</v-icon
                    >
                  </div>
                </div>
              </div>
              <div class="d-flex flex-column">
                <div class="d-flex justify-space-between">
                  <span class="text-body-2"
                    ><strong>Qtd. Orç: </strong
                    >{{ computeds.calcularOrcamentosLocalizados.value.qtdOrcamentos }}</span
                  >
                  <v-icon
                    @click="actions.excluirOrcLocalizado"
                    v-if="state.orcamentosLocalizados.length > 0"
                    title="Excluir todos os orçamentos"
                    >mdi-delete</v-icon
                  >
                </div>
                <span class="text-body-2"
                  ><strong>Somatório: </strong
                  >{{ utils.formatValor(computeds.calcularOrcamentosLocalizados.value.total) }}</span
                >
              </div>
            </div>
          </v-col>
        </v-row>
      </div>

      <div class="d-flex mt-4 flex-grow-1">
        <v-row class="align-center">
          <v-col
            cols="9"
            class="d-flex flex-grow-1"
          >
            <div class="border rounded-lg d-flex flex-grow-1 justify-space-between pa-4">
              <div class="d-flex ga-10">
                <div class="d-flex flex-column align-end">
                  <span class="text-body-2"><strong>Qtd. Orç:</strong></span>
                  <span class="text-body-2">{{ state.dbOrcamentosClienteFaturado.length }}</span>
                </div>
                <div class="d-flex flex-column align-end">
                  <span class="text-body-2"><strong>Total Orç:</strong></span>
                  <span class="text-body-2">{{ utils.formatValor(computeds.totalValorOrcamentos.value) }}</span>
                </div>
              </div>
              <div>
                <v-btn
                  @click="actions.openModalGeralBoleto"
                  :disabled="state.dbOrcamentosClienteFaturado.length == 0"
                  :color="
                    computeds.calcularOrcamentosLocalizados.value.total == computeds.totalValorOrcamentos.value &&
                    computeds.totalValorOrcamentos.value != 0
                      ? 'success'
                      : 'error'
                  "
                  >faturar (f1)</v-btn
                >
              </div>
            </div>
          </v-col>
          <v-col class="d-flex align-end">
            <div class="d-flex flex-grow-1">
              <v-text-field
                label="Localizar (F3)"
                density="compact"
                id="inputLocOrc"
                v-model="state.locValor"
                @keydown.enter.prevent="actions.locValorOrcamento"
              />
            </div>
          </v-col>
        </v-row>
      </div>
    </v-card>

    <div id="pnCodigoTela">faturarCliente</div>

    <v-dialog
      v-model="state.modalSelecionarClienteOpened"
      width="600"
    >
      <ModalSelecionarCliente
        :dataLimite="state.dataLimite"
        @selecionarCliente="actions.selecionarCliente"
        @closeModal="actions.closeModalSelecionarCliente"
      />
    </v-dialog>

    <v-dialog
      v-model="state.modalGerarBoletoOpened"
      width="1000"
      :retain-focus="false"
    >
      <ModalGerarBoleto
        @closeModal="actions.closeModalGerarBoleto"
        :orcamentos="state.dbOrcamentosClienteFaturado"
        :cliente="state.dbClienteFaturado"
        :dataLimite="state.dataLimite"
        :regrasFaturamentoGeral="state.regrasFaturamentoGeral"
      />
    </v-dialog>

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
.custom-scroll {
  padding-right: 4px;
  overflow: auto;
  height: 300px;
  scrollbar-width: thin;
}
</style>
