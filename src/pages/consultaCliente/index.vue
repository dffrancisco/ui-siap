<script setup lang="ts">
import { state, actions } from "./consultaCliente";
import ModalLocalizarCliente from "./components/modalLocalizarCliente.vue";
</script>

<template>
  <v-container>
    <v-card
      :width="900"
      class="ma-auto pa-4"
    >
      <v-row>
        <v-col cols="5">
          <v-text-field
            v-model="state.cliente"
            label="Cliente"
            :clearable="false"
            :disabled="true"
          >
          </v-text-field>
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="state.cnpj"
            label="CNPJ"
            :clearable="false"
            :disabled="true"
          >
          </v-text-field>
        </v-col>

        <v-col cols="3">
          <v-btn
            title="Consultar"
            height="40px"
            color="#3680AB"
            @click="state.modalLocalizarClienteOpened = true"
          >
            Localizar Cliente
            <v-icon class="ml-2">mdi-magnify</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="5"
          ><v-text-field
            v-model="state.telefone"
            label="Telefone"
            :clearable="false"
            :disabled="true"
          >
          </v-text-field
        ></v-col>
        <v-col cols="3.5"
          ><v-text-field
            v-model="state.dataInicio"
            label="Data Início"
            type="date"
            :clearable="false"
            :disabled="true"
          >
          </v-text-field
        ></v-col>
        <v-col cols="3.5"
          ><v-text-field
            v-model="state.dataFim"
            label="Data Fim"
            id="DATA_FIM"
            type="date"
            :clearable="false"
            :disabled="true"
          >
          </v-text-field
        ></v-col>
      </v-row>

      <v-row class="obs">
        <v-col cols="12">
          <v-text-field
            v-model="state.observacao"
            label="Observação"
            :clearable="false"
            :disabled="true"
          >
          </v-text-field
        ></v-col>
      </v-row>

      <v-divider
        horizontal
        class="divider mt-4 mb-4"
        :thickness="4"
      ></v-divider>

      <v-tabs
        v-model="state.tab"
        bg-color="primary"
      >
        <v-row
          style="justify-content: space-between"
          class="mr-1"
        >
          <v-tab value="dashboard">Dashboard</v-tab>
          <v-tab value="orcamentos">Orçamentos</v-tab>
          <v-tab value="orcamentosNaoFinalizados">Orç. Não Finalizados</v-tab>
          <v-tab value="todosItens">Todos Itens</v-tab>
          <v-tab value="comprasFaturadas">Compras Faturadas</v-tab>
        </v-row>
      </v-tabs>

      <v-tabs
        v-model="state.tab"
        bg-color="primary"
        class="mt-2"
      >
        <v-row
          style="justify-content: space-between"
          class="mr-1"
        >
          <v-tab value="marca">Marca</v-tab>
          <v-tab value="creditoDevolucao">Crédito de Devolução</v-tab>
          <v-tab value="devolucao">Devolução</v-tab>
          <v-tab value="vendaPorVendedor">Venda por Vendedor</v-tab>
          <v-tab value="vendasPorAno">Vendas por Ano</v-tab>
        </v-row>
      </v-tabs>

      <v-card-text>
        <v-window v-model="state.tab">
          <v-window-item value="dashboard"
            ><v-row
              ><v-col cols="3"
                ><v-card
                  class="cardDashboard"
                  style="background: #78350f; padding: 10px"
                  ><span>Limite Disponível</span><br /><span>0</span></v-card
                ></v-col
              >
              <v-col cols="3"
                ><v-card
                  class="cardDashboard"
                  style="background: #3f51b5; padding: 10px"
                >
                  <span>Crédito Usado</span><br /><span>0</span>
                </v-card></v-col
              >
              <v-col cols="3"
                ><v-card
                  class="cardDashboard"
                  style="background: #1e1b4b; padding: 10px"
                >
                  <span>Limite de Crédito</span><br /><span>0</span>
                </v-card></v-col
              >
              <v-col cols="3"
                ><v-card
                  class="cardDashboard"
                  style="background: #831843; padding: 10px"
                >
                  <span>Ticket Médio</span><br /><span>0</span>
                </v-card></v-col
              ></v-row
            >
            <v-row
              ><v-col cols="3"
                ><v-card
                  class="cardDashboard"
                  style="background: #022c22; padding: 10px"
                >
                  <span>Boletos em Aberto</span><br /><span>0</span>
                </v-card></v-col
              >
              <v-col cols="3"
                ><v-card
                  class="cardDashboard"
                  style="background: #27272a; padding: 10px"
                >
                  <span>Boletos Atrasados</span><br /><span>0</span>
                </v-card></v-col
              >
              <v-col cols="3"
                ><v-card
                  class="cardDashboard"
                  style="background: #30a28d; padding: 10px"
                >
                  <span>Boletos em Dia</span><br /><span>0</span>
                </v-card></v-col
              >
              <v-col cols="3"
                ><v-card
                  class="cardDashboard"
                  style="background: #3c8dbc; padding: 10px"
                >
                  <span>Todos Boletos</span><br /><span>0</span>
                </v-card></v-col
              ></v-row
            >
            <v-row
              ><v-col cols="3"
                ><v-card
                  class="cardDashboard"
                  style="background: #5a5a5a; padding: 10px"
                >
                  <span>Qtd Orçamentos</span><br /><span>0</span>
                </v-card></v-col
              >
              <v-col cols="3"
                ><v-card
                  class="cardDashboard"
                  style="background: #2563eb; padding: 10px"
                >
                  <span>Devoluções</span><br /><span>0</span>
                </v-card></v-col
              >
              <v-col cols="3"
                ><v-card
                  class="cardDashboard"
                  style="background: #d97706; padding: 10px"
                >
                  <span>Vendedor</span><br /><span>0</span>
                </v-card></v-col
              >
              <v-col cols="3"
                ><v-card
                  class="cardDashboard"
                  style="background: #933ec5; padding: 10px"
                >
                  <span>Marca</span><br /><span>0</span>
                </v-card></v-col
              ></v-row
            >
          </v-window-item>
          <v-window-item value="orcamentos"> </v-window-item>
          <v-window-item value="orcamentosNaoFinalizados"> </v-window-item>
          <v-window-item value="todosItens"> </v-window-item>
          <v-window-item value="comprasFaturadas"> </v-window-item>
          <v-window-item value="marca"> </v-window-item>
          <v-window-item value="creditoDevolucao"> </v-window-item>
          <v-window-item value="devolucao"> </v-window-item>
          <v-window-item value="vendaPorVendedor"> </v-window-item>
          <v-window-item value="vendasPorAno"> </v-window-item>
        </v-window>
      </v-card-text>
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
    <div id="pnCodigoTela">consultaCliente</div>
  </v-container>

  <v-dialog
    v-model="state.modalLocalizarClienteOpened"
    max-width="900"
    @click:outside="state.modalLocalizarClienteOpened = false"
  >
    <ModalLocalizarCliente
      @selecionarCliente="actions.selecionarCliente"
      @closeModalLocalizarCliente="actions.closeModalLocalizarCliente"
    />
  </v-dialog>
</template>

<style scoped>
.cardDashboard {
  height: 80px;
  color: #fff6f6;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
}
</style>
