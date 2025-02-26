<script setup lang="ts">
import { state, actions, computeds } from "./baixaManualBoleto";
import ModalClienteFaturado from "./components/ModalClienteFaturado.vue";
</script>
<template>
  <v-container>
    <v-card
      :max-width="900"
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
        <v-card class="left-card pa-2">
          <span class="spanExtratoBancario"><u>E</u>xtrato Bancário</span>
          <v-btn
            class="iconUpload"
            icon="mdi-upload"
            size="large"
            @click="state.modalClienteFaturadoOpened = true"
          />
        </v-card>

        <v-divider
          vertical
          class="divider"
        ></v-divider>

        <v-card
          class="right-card"
          height="520"
        >
          <v-row class="pt-2 ml-1">
            <v-col cols="6"> <v-text-field label="Orçamento"></v-text-field> </v-col
            ><v-col cols="3">
              <div class="d-flex align-center">
                <v-btn
                  icon="mdi-magnify"
                  size="39"
                  color="primary"
                />
              </div>
            </v-col>
          </v-row>
          <v-data-table-virtual
            fixed-header
            no-data-text="Não há dados disponíveis"
            :items="state.dadosOrcamento"
            :headers="state.headersOrcamento"
            :loading="state.loading"
            :row-props="actions.getClassCorLinha"
            height="200"
          >
            <template v-slot:item.checked="{ item }">
              <div style="margin-left: 20px">
                <v-checkbox
                  v-model="item.checked"
                  @change="actions.toggleOrcamento(item)"
                  hide-details
                  density="compact"
                />
              </div>
            </template>
          </v-data-table-virtual>

          <v-row class="pt-2 ml-1">
            <v-col cols="6"> <v-text-field label="Boleto"></v-text-field> </v-col
            ><v-col cols="3">
              <div class="d-flex align-center">
                <v-btn
                  icon="mdi-magnify"
                  size="39"
                  color="primary"
                />
              </div>
            </v-col>
          </v-row>
          <v-data-table-virtual
            fixed-header
            no-data-text="Não há dados disponíveis"
            :items="state.dadosBoletos"
            :headers="state.headersBoletos"
            :loading="state.loading"
            :row-props="actions.getClassCorLinha"
            height="190"
          >
            <template v-slot:item.checked="{ item }">
              <div style="margin-left: 20px">
                <v-checkbox
                  v-model="item.checked"
                  @change="actions.toggleBoleto(item)"
                  hide-details
                  density="compact"
                />
              </div>
            </template>
          </v-data-table-virtual>
          <v-row>
            <v-col
              cols="12"
              class="text-center pt-5"
            >
              <span><strong>Total: </strong>{{ computeds.totalMarcado }}</span>
            </v-col>
          </v-row>
        </v-card>
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
  align-items: stretch;
  margin-top: 20px;
}

.left-card {
  flex: 0 0 35%;
}

.divider {
  width: 2px;
  margin: 0 10px;
  background-color: #e0e0e0;
  margin-left: 20px;
}

.right-card {
  margin-left: 15px;
  flex: 0 0 60%;
}

.spanExtratoBancario {
  font-size: 15px;
  margin-left: 5px;
  display: inline-block;
}

.iconUpload {
  cursor: pointer;
  margin-top: 170px;
  margin-left: 110px;
}
</style>
