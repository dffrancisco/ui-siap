<script setup lang="ts">
import { state } from "./liberarCliente";
</script>
<template>
  <v-container>
    <v-card
      class="pa-5"
      style="width: 900px; margin: 0 auto"
    >
      <v-row>
        <v-col cols="4">
          <v-text-field
            id="cnpj"
            label="CNPJ"
            class="cnpj"
            autocomplete="off"
            item-title="title"
            item-value="value"
            :clearable="true"
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-text-field
            id="cliente"
            label="Cliente"
            class="cliente"
            autocomplete="off"
            item-title="title"
            item-value="value"
            :clearable="true"
          ></v-text-field>
        </v-col>
        <v-col cols="4"
          ><v-btn
            color="primary"
            class="mb-3"
            icon="mdi-magnify"
            size="36px"
            @click=""
          >
          </v-btn>
          <v-chip class="ml-5">BLOQUEADO</v-chip>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="3">
          <v-text-field
            id="creditoUsado"
            label="Crédito Usado"
            class="creditoUsado"
            autocomplete="off"
            item-title="title"
            item-value="value"
            :clearable="true"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
            id="creditoLimite"
            label="Crédito Limite"
            class="creditoLimite"
            autocomplete="off"
            item-title="title"
            item-value="value"
            :clearable="true"
          ></v-text-field
        ></v-col>
        <v-col cols="3">
          <v-text-field
            id="tipoCompra"
            label="Tipo Compra"
            class="tipoCompra"
            autocomplete="off"
            item-title="title"
            item-value="value"
            :clearable="true"
          ></v-text-field
        ></v-col>
        <v-col cols="3">
          <v-text-field
            id="tipoFaturamento"
            label="Tipo Faturamento"
            class="tipoFaturamento"
            autocomplete="off"
            item-title="title"
            item-value="value"
            :clearable="true"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6"
          ><v-text-field
            id="divisaoBoleto"
            label="Divisão Boleto"
            class="divisaoBoleto"
            autocomplete="off"
            item-title="title"
            item-value="value"
            :clearable="true"
          ></v-text-field
        ></v-col>
        <v-col cols="6">
          <v-text-field
            id="diaVencimento"
            label="Dia Vencimento Fixo"
            class="diaVencimento"
            autocomplete="off"
            item-title="title"
            item-value="value"
            :clearable="true"
          ></v-text-field>
        </v-col>
      </v-row>
      <div id="gridPrincipal"></div>
      <div
        id="pnBotoes"
        class="mt-3"
        style="text-align: center"
      ></div>
    </v-card>
    <div id="pnCodigoTela">liberarCliente</div>
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
<style scoped></style>
