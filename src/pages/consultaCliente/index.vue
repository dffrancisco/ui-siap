<script setup lang="ts">
import { state, actions } from "./consultaCliente";
</script>

<template>
  <v-container>
    <v-card
      :width="800"
      class="ma-auto pa-4"
    >
      <div class="divInputs"
        ><div style="display: flex; gap: 16px">
          <v-text-field
            v-model="state.dataInicio"
            width="180px"
            label="Data Início"
            type="date"
            :clearable="false"
            @keydown.enter="state.inputDataFinal.focus()"
          >
          </v-text-field>

          <v-text-field
            v-model="state.dataFim"
            label="Data Fim"
            id="DATA_FIM"
            width="180px"
            type="date"
            :clearable="false"
          >
          </v-text-field>

          <div>
            <v-btn
              title="Consultar"
              height="40px"
              color="#3680AB"
            >
              Localizar Cliente
              <v-icon class="ml-2">mdi-magnify</v-icon>
            </v-btn>
          </div>
        </div>
      </div>
      <div class="mt-3">
        <v-row>
          <v-col cols="4">
            <v-text-field
              label="Cliente"
              :clearable="false"
            >
            </v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              label="Telefone"
              :clearable="false"
            >
            </v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              label="CNPJ"
              :clearable="false"
            >
            </v-text-field>
          </v-col>
        </v-row>
        <v-row class="obs">
          <v-col cols="12">
            <v-text-field
              label="Observação"
              :clearable="false"
            >
            </v-text-field
          ></v-col>
        </v-row>
      </div>

      <v-divider
        horizontal
        class="divider mt-3 mb-3"
        :thickness="4"
      ></v-divider>

      <v-tabs
        v-model="state.tab"
        bg-color="primary"
      >
        <v-row>
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
        <v-row>
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

  <!-- <v-dialog
    v-model="state.modalLocalizarClienteOpened"
    transition="dialog-transition"
    variant="flat"
    :persistent="false"
    @click:outside="actions.closeModalLocalizarCliente"
  >
    <ModalLocalizarCliente @closeModalLocalizarCliente="actions.closeModalLocalizarCliente" />
  </v-dialog> -->
</template>

<style scoped>
.divInputs {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.obs {
  margin-top: -8px;
}

.cardDashboard {
  height: 80px;
  color: #fff6f6;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
}
</style>
