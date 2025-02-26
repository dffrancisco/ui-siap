<script setup lang="ts">
import { state, actions } from "./baixaManualBoleto";
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

      <span class="spanExtratoBancario"><u>E</u>xtrato Bancário</span>
      <div class="card-container">
        <v-card class="left-card pa-5">
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
          <v-row class="pa-3">
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
          <v-data-table-virtual></v-data-table-virtual>

          <v-row class="pa-3">
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
          <v-data-table-virtual></v-data-table-virtual>
        </v-card>
      </div>
    </v-card>
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
  margin-top: 10px;
}

.iconUpload {
  cursor: pointer;
  margin-top: 170px;
  margin-left: 100px;
}
</style>
