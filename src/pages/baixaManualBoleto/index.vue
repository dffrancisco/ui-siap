<script setup lang="ts">
import { state, actions, computeds } from "./baixaManualBoleto";
import utils from "@/ts/utils";
import ModalClienteFaturado from "./components/ModalClienteFaturado.vue";
import ModalUploadComprovante from "./components/ModalUploadComprovante.vue";
import { onMounted } from "vue";

onMounted(async () => {
  await actions.init();
});
</script>
<template>
  <v-container>
    <v-card
      :max-width="950"
      class="mx-auto pa-4"
    >
      <v-row>
        <v-col cols="11">
          <v-text-field
            v-model="state.nomeClienteFaturadoSelecionado"
            label="Cliente Faturado"
            ref="inputClienteFaturado"
            @click="state.modalClienteFaturadoOpened = true"
          ></v-text-field
        ></v-col>
        <v-col cols="1">
          <div class="d-flex align-center">
            <v-btn
              icon="mdi-magnify"
              size="39"
              color="primary"
              @click="state.modalClienteFaturadoOpened = true"
            />
          </div>
        </v-col>
      </v-row>

      <div class="card-container">
        <v-card class="left-card pa-2 d-flex flex-column">
          <div class="btnUpload"
            ><span class="spanExtratoBancario"><u>E</u>xtrato Bancário</span></div
          >
          <template v-if="state.extratoBancario.length === 0">
            <input
              type="file"
              accept=".ofx"
              style="display: none; margin-top: 100px !important"
              id="fileInput"
              @change="actions.processarArquivoBancario"
            />
            <v-btn
              class="iconUpload"
              icon="mdi-upload"
              size="large"
              color="primary"
              title="Enviar Arquivo OFX do Banco"
              @click="actions.abrirSeletorDeArquivo"
            />
          </template>

          <template v-else>
            <div class="d-flex flex-column justify-space-between flex-grow-1">
              <div>
                <v-data-table-virtual
                  fixed-header
                  no-data-text="Nenhuma transação encontrada"
                  :items="state.extratoBancario"
                  :headers="state.headersExtrato"
                  :row-props="actions.getClassCorLinha"
                  height="390"
                  max-width="200"
                >
                  <template v-slot:item.checked="{ item }">
                    <v-checkbox
                      v-model="item.checked"
                      hide-details
                      density="compact"
                    />
                  </template>
                </v-data-table-virtual>
              </div>

              <div>
                <strong style="font-size: 15px"
                  >Total: {{ utils.formatValor(state.totalSelecionadoExtrato) }}</strong
                >
              </div>
            </div>
          </template>
        </v-card>

        <v-divider
          vertical
          class="divider"
        ></v-divider>

        <v-card
          class="right-card"
          height="470"
        >
          <v-row class="pa-1">
            <v-col cols="6">
              <v-text-field
                density="compact"
                label="Orçamento"
                :disabled="state.dadosOrcamento.length === 0"
                class="custom-text-field"
                v-model="state.filtroOrcamento"
                @keypress.enter="actions.filtrarOrcamentos"
              ></v-text-field> </v-col
            ><v-col cols="3">
              <div class="d-flex align-center pt-1">
                <v-btn
                  icon="mdi-magnify"
                  :disabled="state.dadosOrcamento.length === 0"
                  size="30"
                  color="primary"
                  @click="actions.filtrarOrcamentos"
                />
              </div>
            </v-col>
          </v-row>
          <v-data-table-virtual
            fixed-header
            no-data-text="Não há dados disponíveis"
            :items="state.dadosOrcamentoFiltrados"
            :headers="state.headersOrcamento"
            :loading="state.loading"
            :row-props="actions.getClassCorLinha"
            height="155"
          >
            <template v-slot:item.checked="{ item }">
              <div style="margin-left: 20px">
                <v-checkbox
                  v-model="item.checked"
                  hide-details
                  density="compact"
                />
              </div>
            </template>
          </v-data-table-virtual>

          <v-row class="pa-1 pt-5">
            <v-col cols="6">
              <v-text-field
                density="compact"
                label="Boleto"
                v-model="state.filtroBoleto"
                @keypress.enter="actions.filtrarBoletos"
                :disabled="state.dadosBoletos.length === 0"
              ></v-text-field> </v-col
            ><v-col cols="3">
              <div class="d-flex align-center pt-1">
                <v-btn
                  icon="mdi-magnify"
                  size="30"
                  color="primary"
                  @click="actions.filtrarBoletos"
                  :disabled="state.dadosBoletos.length === 0"
                />
              </div>
            </v-col>
          </v-row>
          <v-data-table-virtual
            fixed-header
            no-data-text="Não há dados disponíveis"
            :items="state.dadosBoletosFiltrados"
            :headers="state.headersBoletos"
            :loading="state.loading"
            :row-props="actions.getClassCorLinha"
            height="155"
          >
            <template v-slot:item.checked="{ item }">
              <div style="margin-left: 20px">
                <v-checkbox
                  v-model="item.checked"
                  hide-details
                  density="compact"
                />
              </div>
            </template>
          </v-data-table-virtual>
          <v-row>
            <v-col
              cols="7"
              class="pt-6 ml-3 d-flex align-end"
              style="font-size: 15px"
            >
              <span
                ><strong>Total: {{ utils.formatValor(state.totalOrcamentosEBoletos) }}</strong></span
              >
            </v-col>

            <v-col
              cols="4"
              class="pt-5 ml-6"
            >
              <v-btn
                title="Consultar"
                height="30px"
                max-width="220px"
                color="#3680AB"
                @click="state.modalUploadComprovanteOpened = true"
                :disabled="!state.podeBaixarManual"
              >
                Baixar Manual
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </div>
    </v-card>
    <div id="pnCodigoTela">baixaManualBoleto</div>

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

  <!-- modalClienteFaturado -->
  <v-dialog
    v-model="state.modalClienteFaturadoOpened"
    max-width="700"
  >
    <ModalClienteFaturado
      @selecionarClienteFaturado="actions.salvarClienteFaturadoSelecionado"
      @closeModalClienteFaturado="state.modalClienteFaturadoOpened = false"
    />
  </v-dialog>

  <!-- ModalUploadComprovante -->
  <v-dialog
    v-model="state.modalUploadComprovanteOpened"
    max-width="400"
  >
    <ModalUploadComprovante
      :clienteSelecionado="state.clienteFaturadoSelecionado"
      :boletosSelecionados="computeds.boletosSelecionados.value"
      :orcamentosSelecionados="computeds.orcamentosSelecionados.value"
      :cnpjEmpresa="state.cnpjEmpresa"
      @baixaManualBoleto="actions.baixarBoletosEOrcamentos"
      @closeModalUploadComprovante="state.modalUploadComprovanteOpened = false"
    />
  </v-dialog>
</template>

<style>
.cor-zebrada-1 {
  background-color: #f0f0f0;
}

.v-overlay__scrim {
  background-color: black;
}
</style>

<style scoped>
.card-container {
  display: flex;
  margin-top: 10px;
}

.left-card {
  flex: 0 0 38%;
}

.divider {
  width: 2px;
  background-color: #e0e0e0;
  margin-left: 10px;
}

.right-card {
  margin-left: 10px;
  flex: 0 0 60%;
}

.spanExtratoBancario {
  font-size: 15px;
  margin-left: 5px;
}

.iconUpload {
  cursor: pointer;
  margin-top: 170px;
  margin-left: 115px;
}
</style>
