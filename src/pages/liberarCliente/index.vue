<script setup lang="ts">
import { state, actions, faturado, naoFaturado } from "./liberarCliente";
import ModalLiberarCliente from "./components/modalLiberarCliente.vue";
import { onMounted } from "vue";

onMounted(async () => {
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
            :clearable="false"
            :disabled="state.idCliente == null || state.status == 'Bloqueado'"
            :style="{ color: state.status == 'Bloqueado' ? 'red' : '' }"
          ></v-text-field>
        </v-col>
        <v-col cols="5">
          <v-text-field
            id="cnpj"
            readonly
            :disabled="state.idCliente == null || state.status == 'Bloqueado'"
            label="CNPJ"
            class="cnpj"
            v-model="state.cnpjSelect"
            autocomplete="off"
            :clearable="false"
            :style="{ color: state.status == 'Bloqueado' ? 'red' : '' }"
          ></v-text-field>
        </v-col>
        <v-col cols="1">
          <v-btn
            color="primary"
            class="mb-3"
            icon="mdi-magnify"
            size="36px"
            :disabled="state.botaoCancelarHabilitado == true"
            @click="actions.openModalLiberarCliente"
          ></v-btn>
        </v-col>
      </v-row>

      <v-row style="margin-top: 3px">
        <v-col cols="3">
          <v-text-field
            id="creditoUsado"
            readonly
            :disabled="true"
            label="Crédito Usado"
            class="creditoUsado"
            v-model="state.creditoUsado"
            autocomplete="off"
            :clearable="false"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
            id="creditoLimite"
            label="Crédito Limite"
            :disabled="state.idCliente == null || state.botaoAlterarHabilitado || state.status == 'Bloqueado'"
            class="creditoLimite"
            v-model="state.creditoLimite"
            autocomplete="off"
            v-mask-decimal.br="2"
            maxlength="15"
            :clearable="false"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-select
            id="tipoCompra"
            label="Tipo Compra"
            :disabled="state.idCliente == null || state.botaoAlterarHabilitado || state.status == 'Bloqueado'"
            :items="['Faturado', 'Não Faturado']"
            class="tipoCompra"
            v-model="state.tipoCompra"
            autocomplete="off"
            item-title="title"
            item-value="value"
            :clearable="false"
          ></v-select>
        </v-col>

        <!-- Mostrar 'Tipo Faturamento' para Faturado -->
        <v-col
          cols="3"
          v-if="!naoFaturado"
        >
          <v-select
            id="tipoFaturamento"
            :disabled="state.idCliente == null || state.botaoAlterarHabilitado || state.status == 'Bloqueado'"
            label="Tipo Faturamento"
            :items="['Quinzenal', 'Mensal']"
            class="tipoFaturamento"
            v-model="state.tipoFaturamento"
            autocomplete="off"
            item-title="title"
            item-value="value"
            :clearable="false"
          ></v-select>
        </v-col>

        <!-- Mostrar 'v-chip' para Não Faturado -->
        <v-col
          cols="3"
          v-else
        >
          <v-chip
            :color="state.statusColor"
            style="min-width: 185px; justify-content: center; margin-left: 15px; margin-top: 5px"
          >
            {{ state.status }}
          </v-chip>
        </v-col>
      </v-row>

      <v-row
        v-if="faturado"
        style="margin-top: 10px"
      >
        <v-col cols="3">
          <v-select
            id="divisaoBoleto"
            :items="['Sim', 'Não']"
            v-model="state.dividirBoleto"
            :disabled="state.idCliente == null || state.botaoAlterarHabilitado || state.status == 'Bloqueado'"
            label="Divisão Boleto"
            class="divisaoBoleto"
            autocomplete="off"
            item-title="title"
            item-value="value"
            :clearable="false"
          ></v-select>
        </v-col>
        <v-col cols="3">
          <v-text-field
            id="diaVencimento"
            v-model="state.diaVencimento"
            label="Dia Vencimento Fixo"
            class="diaVencimento"
            :disabled="
              state.dividirBoleto == 'Sim' ||
              state.idCliente == null ||
              state.botaoAlterarHabilitado ||
              state.status == 'Bloqueado'
            "
            autocomplete="off"
            maxlength="2"
            v-mask="'##'"
            :clearable="false"
            :rules="[actions.validarDiaVencimento]"
          ></v-text-field>
        </v-col>
        <!-- Mostrar o v-chip para clientes Faturados -->
        <v-col
          cols="3"
          style="margin-left: 240px"
        >
          <v-chip
            :color="state.statusColor"
            style="min-width: 185px; justify-content: center; margin-left: 15px; margin-top: 5px"
          >
            {{ state.status }}
          </v-chip>
        </v-col>
      </v-row>

      <!-- Tabs para os grids -->
      <div style="padding-top: 20px">
        <v-tabs v-model="state.tab">
          <v-tab value="liberacoes">Liberações</v-tab>
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
          >
            <div id="gridLiberacoes"></div>
          </v-window-item>
          <v-window-item
            eager
            value="bloqueiosDesbloqueios"
          >
            <div id="gridBloqueiosDesbloqueios"></div>
          </v-window-item>
          <v-window-item
            eager
            value="compras"
          >
            <div id="gridCompras"></div>
          </v-window-item>
          <v-window-item
            eager
            value="boletos"
          >
            <div id="gridBoletos"></div>
          </v-window-item>
        </v-window>
      </v-card-text>

      <div class="d-flex align-center justify-center">
        <div class="divBtns">
          <v-btn
            color="primary"
            @click="actions.alterar"
            :disabled="!state.botaoAlterarHabilitado || state.idCliente == null || state.status == 'Bloqueado'"
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
        <div class="position-absolute right-0 pr-5">
          <v-btn
            color="primary"
            size="small"
            icon="mdi-account-cash mdi-24px"
            title="Liberar Limite Cliente"
            :disabled="!state.idCliente || !state.botaoAlterarHabilitado"
            @click="actions.btnLiberarLimiteCliente"
          >
          </v-btn>
        </div>
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
    <div id="pnCodigoTela">liberarCliente</div>
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
