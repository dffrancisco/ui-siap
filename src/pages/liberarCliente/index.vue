<script setup lang="ts">
import { state, actions } from "./liberarCliente";
import ModalLiberarCliente from "./components/modalLiberarCliente.vue";
import { nextTick } from "vue";

nextTick(async () => {
  actions.init();
});
</script>
<template>
  <v-container>
    <v-card
      class="pa-5"
      style="width: 980px; margin: 0 auto"
    >
      <v-row>
        <v-col cols="6">
          <v-text-field
            id="cliente"
            label="Cliente"
            readonly
            class="cliente"
            v-model="state.nomeClienteSelect"
            autocomplete="off"
            item-title="title"
            item-value="value"
            :clearable="false"
          ></v-text-field>
        </v-col>
        <v-col cols="5">
          <v-text-field
            id="cnpj"
            readonly
            label="CNPJ"
            class="cnpj"
            v-model="state.cnpjSelect"
            autocomplete="off"
            item-title="title"
            item-value="value"
            :clearable="false"
          ></v-text-field>
        </v-col>
        <v-col cols="1"
          ><v-btn
            color="primary"
            class="mb-3"
            icon="mdi-magnify"
            size="36px"
            @click="actions.openModalLiberarCliente"
          >
          </v-btn>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="3">
          <v-text-field
            id="creditoUsado"
            readonly
            label="Crédito Usado"
            class="creditoUsado"
            v-model="state.creditoUsado"
            autocomplete="off"
            item-title="title"
            item-value="value"
            :clearable="false"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
            id="creditoLimite"
            label="Crédito Limite"
            class="creditoLimite"
            v-model="state.creditoLimite"
            autocomplete="off"
            item-title="title"
            item-value="value"
            :clearable="true"
          ></v-text-field
        ></v-col>
        <v-col cols="3">
          <v-select
            id="tipoCompra"
            label="Tipo Compra"
            :items="['Faturado', 'Não Faturado']"
            class="tipoCompra"
            v-model="state.tipoCompra"
            autocomplete="off"
            item-title="title"
            item-value="value"
            :clearable="true"
          ></v-select
        ></v-col>
        <v-col cols="3">
          <v-select
            id="tipoFaturamento"
            label="Tipo Faturamento"
            :items="['Quinzenal', 'Mensal']"
            class="tipoFaturamento"
            v-model="state.tipoFaturamento"
            autocomplete="off"
            item-title="title"
            item-value="value"
            :clearable="true"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="5"
          ><v-select
            id="divisaoBoleto"
            :items="['Sim', 'Não']"
            v-model="state.dividirBoleto"
            label="Divisão Boleto"
            class="divisaoBoleto"
            autocomplete="off"
            item-title="title"
            item-value="value"
            :clearable="true"
          ></v-select
        ></v-col>
        <v-col cols="4">
          <v-text-field
            id="diaVencimento"
            v-model="state.diaVencimento"
            label="Dia Vencimento Fixo"
            class="diaVencimento"
            :disabled="state.dividirBoleto == 'Sim'"
            autocomplete="off"
            type="number"
            item-title="title"
            item-value="value"
            :clearable="true"
          ></v-text-field>
        </v-col>

        <v-col cols="3">
          <v-chip
            :color="state.statusColor"
            style="min-width: 185px; justify-content: center; margin-left: 15px; margin-top: 5px"
          >
            {{ state.status }}
          </v-chip>
        </v-col>
      </v-row>

      <div style="padding-top: 20px">
        <v-tabs v-model="state.tab"
          ><v-tab value="liberacoes">Liberações</v-tab>
          <v-tab value="bloqueiosDesbloqueios">Bloqueios/Desbloqueios</v-tab>
          <v-tab value="compras">Compras</v-tab>
          <v-tab value="boletos">Boletos</v-tab>
        </v-tabs>
      </div>

      <v-card-text>
        <v-window v-model="state.tab">
          <v-window-item
            eager
            value="liberacoes"
            ><div id="gridLiberacoes"></div
          ></v-window-item>
          <v-window-item
            eager
            value="bloqueiosDesbloqueios"
            ><div id="gridBloqueiosDesbloqueios"></div
          ></v-window-item>
          <v-window-item
            eager
            value="compras"
            ><div id="gridCompras"></div
          ></v-window-item>
          <v-window-item
            eager
            value="boletos"
            ><div id="gridBoletos"></div
          ></v-window-item>
        </v-window>
      </v-card-text>
      <div class="divBtns">
        <v-btn
          color="primary"
          @click="actions.alterar"
          :disabled="!state.botaoAlterarHabilitado"
          >Alterar</v-btn
        >
        <v-btn
          color="primary"
          @click="actions.salvar"
          :disabled="!state.botaoSalvarHabilitado"
          >Salvar</v-btn
        >
        <v-btn
          color="primary"
          @click="actions.cancelar"
          :disabled="!state.botaoCancelarHabilitado"
          >Cancelar</v-btn
        >
      </div>
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

  <div
    id="modalLiberarCliente"
    style="display: none"
    title="Liberar Cliente"
  >
    <ModalLiberarCliente
      @cancelar="actions.modalLiberarClienteClose"
      @clienteSelecionado="actions.selecionarCliente"
      :modalLiberarClienteOpened="state.modalLiberarClienteOpened"
    />
  </div>
</template>
<style scoped>
.divBtns {
  display: flex;
  justify-content: center;
  gap: 10px;
}
</style>
