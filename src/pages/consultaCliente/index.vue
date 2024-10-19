<script setup lang="ts">
import { state, actions, graficoVendaPorVendedor, graficoVendasPorAno } from "./consultaCliente";
import ModalLocalizarCliente from "./components/modalLocalizarCliente.vue";
import ModalBoletosAbertos from "./components/modalBoletosAbertos.vue";
import ModalBoletosAtrasados from "./components/modalBoletosAtrasados.vue";
import ModalBoletosEmDia from "./components/modalBoletosEmDia.vue";
import ModalTodosBoletos from "./components/modalTodosBoletos.vue";
import utils from "@/ts/utils";
import VueApexCharts from "vue3-apexcharts";
</script>

<template>
  <v-container>
    <v-card
      :width="960"
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
            height="38px"
            width="230px"
            color="#3680AB"
            @click="state.modalLocalizarClienteOpened = true"
          >
            Localizar Cliente
            <v-icon class="ml-4">mdi-magnify</v-icon>
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

      <div class="mt-3">
        <v-window v-model="state.tab">
          <v-window-item value="dashboard"
            ><v-row
              ><v-col cols="3"
                ><v-card
                  class="cardDashboard"
                  style="background: #78350f; padding: 10px"
                  ><span
                    >Limite Disponível<br />
                    {{ utils.formatValor(state.limiteDisponivelDashboard) }}</span
                  ><br /></v-card
              ></v-col>
              <v-col cols="3"
                ><v-card
                  class="cardDashboard"
                  style="background: #3f51b5; padding: 10px"
                >
                  <span
                    >Crédito Usado<br />
                    {{ utils.formatValor(state.creditoUsadoDashboard) }}</span
                  ></v-card
                ></v-col
              >
              <v-col cols="3"
                ><v-card
                  class="cardDashboard"
                  style="background: #1e1b4b; padding: 10px"
                >
                  <span
                    >Limite de Crédito<br />
                    {{ utils.formatValor(state.limiteCreditoDashboard) }}</span
                  >
                </v-card></v-col
              >
              <v-col cols="3"
                ><v-card
                  class="cardDashboard"
                  style="background: #831843; padding: 10px"
                >
                  <span
                    >Ticket Médio<br />
                    {{ utils.formatValor(state.ticketMedioDashboard) }}</span
                  >
                </v-card></v-col
              ></v-row
            >
            <v-row
              ><v-col cols="3"
                ><v-card
                  class="cardDashboard"
                  style="background: #022c22; padding: 10px"
                  @click="actions.openModalBoletosAbertos"
                  :disabled="Object.keys(state.clienteSelecionado).length === 0"
                  ><v-icon
                    size="18"
                    class="mr-2"
                    >mdi-link-variant</v-icon
                  >
                  <span
                    >Boletos em Aberto<br />
                    {{ state.boletosEmAbertoDashboard }}</span
                  >
                </v-card></v-col
              >
              <v-col cols="3"
                ><v-card
                  class="cardDashboard"
                  style="background: #27272a; padding: 10px"
                  @click="actions.openModalBoletosAtrasados"
                  :disabled="Object.keys(state.clienteSelecionado).length === 0"
                  ><v-icon
                    size="18"
                    class="mr-2"
                    >mdi-link-variant</v-icon
                  >
                  <span
                    >Boletos Atrasados<br />
                    {{ state.boletosAtrasadosDashboard }}</span
                  >
                </v-card></v-col
              >
              <v-col cols="3"
                ><v-card
                  class="cardDashboard"
                  style="background: #30a28d; padding: 10px"
                  @click="actions.openModalBoletosEmDia"
                  :disabled="Object.keys(state.clienteSelecionado).length === 0"
                  ><v-icon
                    size="18"
                    class="mr-2"
                    >mdi-link-variant</v-icon
                  >
                  <span
                    >Boletos em Dia<br />
                    {{ state.boletosEmDiaDashboard }}</span
                  >
                </v-card></v-col
              >
              <v-col cols="3"
                ><v-card
                  class="cardDashboard"
                  style="background: #3c8dbc; padding: 10px"
                  @click="actions.openModalTodosBoletos"
                  :disabled="Object.keys(state.clienteSelecionado).length === 0"
                  ><v-icon
                    size="18"
                    class="mr-2"
                    >mdi-link-variant</v-icon
                  >
                  <span
                    >Todos Boletos<br />
                    {{ state.todosBoletosDashboard }}</span
                  >
                </v-card></v-col
              ></v-row
            >
            <v-row
              ><v-col cols="3"
                ><v-card
                  class="cardDashboard"
                  style="background: #5a5a5a; padding: 10px"
                >
                  <span
                    >Qtd Orçamentos<br />
                    {{ state.qtdOrcamentosDashboard }}</span
                  >
                </v-card></v-col
              >
              <v-col cols="3"
                ><v-card
                  class="cardDashboard"
                  style="background: #2563eb; padding: 10px"
                >
                  <span
                    >Devoluções<br />
                    {{ state.devolucoesDashboard }}</span
                  >
                </v-card></v-col
              >
              <v-col cols="3"
                ><v-card
                  class="cardDashboard"
                  style="background: #d97706; padding: 10px"
                >
                  <span
                    >Vendedor<br />
                    {{ state.vendedorDashboard }}</span
                  >
                </v-card></v-col
              >
              <v-col cols="3"
                ><v-card
                  class="cardDashboard"
                  style="background: #933ec5; padding: 10px"
                >
                  <span
                    >Marca<br />
                    {{ state.marcaDashboard }}</span
                  >
                </v-card></v-col
              ></v-row
            >
          </v-window-item>
          <v-window-item value="orcamentos">
            <v-data-table-virtual
              class="tableOrcamentos"
              style="border-radius: 5px; --v-table-row-height: 45px"
              height="280"
              fixed-header
              :headers="state.headersOrcamentos"
              :loading="state.loading"
              :items="state.tableOrcamentos"
              :row-props="actions.getClassCorLinha"
              ><template v-slot:item.inf="{ item }">
                <v-icon
                  size="large"
                  color="primary"
                  title="Ver detalhes"
                  @click="actions.openModalDetalhesOrcamento(item)"
                >
                  mdi-information
                </v-icon>
              </template>
            </v-data-table-virtual>
          </v-window-item>
          <v-window-item value="orcamentosNaoFinalizados">
            <v-data-table-virtual
              class="tableOrcamentosNaoFinalizados"
              style="border-radius: 5px; --v-table-row-height: 45px"
              height="280"
              fixed-header
              :headers="state.headersOrcamentosNaoFinalizados"
              :loading="state.loading"
              :items="state.tableOrcamentosNaoFinalizados"
              :row-props="actions.getClassCorLinha"
            >
            </v-data-table-virtual>
          </v-window-item>
          <v-window-item value="todosItens">
            <v-data-table-virtual
              class="tableTodosItens"
              style="border-radius: 5px; --v-table-row-height: 45px"
              height="280"
              fixed-header
              :headers="state.headersTodosItensOrcamentos"
              :loading="state.loading"
              :items="state.tableTodosItensOrcamentos"
              :row-props="actions.getClassCorLinha"
              ><template v-slot:item.inf="{ item }">
                <v-icon
                  size="large"
                  color="primary"
                  title="Ver detalhes"
                  @click="actions.openModalDetalhesItemOrcamento(item)"
                >
                  mdi-information
                </v-icon>
              </template>
            </v-data-table-virtual>
          </v-window-item>
          <v-window-item value="comprasFaturadas">
            <v-data-table-virtual
              class="tableComprasFaturadas"
              style="border-radius: 5px; --v-table-row-height: 45px"
              height="280"
              fixed-header
              :headers="state.headersComprasFaturadas"
              :loading="state.loading"
              :items="state.tableComprasFaturadas"
              :row-props="actions.getClassCorLinha"
              ><template v-slot:item.inf="{ item }">
                <v-icon
                  size="large"
                  color="primary"
                  title="Ver detalhes"
                  @click="actions.openModalDetalhesComprasFaturadas(item)"
                >
                  mdi-information
                </v-icon>
              </template>
            </v-data-table-virtual>
          </v-window-item>
          <v-window-item value="marca">
            <v-data-table-virtual
              class="tableMarcas"
              style="border-radius: 5px; --v-table-row-height: 45px"
              height="280"
              fixed-header
              :headers="state.headersMarcas"
              :loading="state.loading"
              :items="state.tableMarcas"
              :row-props="actions.getClassCorLinha"
              ><template v-slot:item.inf="{ item }">
                <v-icon
                  size="large"
                  color="primary"
                  title="Ver detalhes"
                  @click="actions.openModalDetalhesMarca(item)"
                >
                  mdi-information
                </v-icon>
              </template>
            </v-data-table-virtual>
          </v-window-item>
          <v-window-item value="creditoDevolucao">
            <v-data-table-virtual
              class="tableCreditoDevolucao"
              style="border-radius: 5px; --v-table-row-height: 45px"
              height="280"
              fixed-header
              :headers="state.headersCreditoDevolucao"
              :loading="state.loading"
              :items="state.tableCreditoDevolucao"
              :row-props="actions.getClassCorLinha"
              ><template v-slot:item.inf="{ item }">
                <v-icon
                  size="large"
                  color="primary"
                  title="Ver detalhes"
                  @click="actions.openModalDetalhesCreditoDevolucao(item)"
                >
                  mdi-information
                </v-icon>
              </template>
            </v-data-table-virtual>
          </v-window-item>
          <v-window-item value="devolucao">
            <v-data-table-virtual
              class="tableDevolucao"
              style="border-radius: 5px; --v-table-row-height: 45px"
              height="280"
              fixed-header
              :headers="state.headersDevolucao"
              :loading="state.loading"
              :items="state.tableDevolucao"
              :row-props="actions.getClassCorLinha"
              ><template v-slot:item.inf="{ item }">
                <v-icon
                  size="large"
                  color="primary"
                  title="Ver detalhes"
                  @click="actions.openModalDetalhesDevolucao(item)"
                >
                  mdi-information
                </v-icon>
              </template>
            </v-data-table-virtual>
          </v-window-item>
          <v-window-item value="vendaPorVendedor">
            <VueApexCharts
              width="100%"
              height="240"
              type="bar"
              :options="{
                            chart: {
                                id: 'venda-por-vendedor',
                            },
                            xaxis: {
                                categories: graficoVendaPorVendedor.labels,
                            },
                            yaxis: {
                                labels: {
                                    formatter: (value: number) => utils.formatValor(value),
                                },
                            },
                            dataLabels: {
                                enabled: false,
                            },
                            plotOptions: {
                                bar: {
                                    distributed: true,
                                },
                            },
                            fill: {
                                colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#FF00F5'],
                            },
                        }"
              :series="[
                {
                  name: 'Venda por Vendedor',
                  data: graficoVendaPorVendedor.series,
                },
              ]"
            />
          </v-window-item>
          <v-window-item value="vendasPorAno">
            <VueApexCharts
              width="100%"
              height="240"
              type="line"
              :options="{
                            chart: {
                                id: 'venda-por-ano',
                            },
                            xaxis: {
                                categories: graficoVendasPorAno.labels,
                            },
                            yaxis: {
                                labels: {
                                    formatter: (value: number) => utils.formatValor(value),
                                },
                            },
                            dataLabels: {
                                enabled: true,
                                style: {
                                    colors: ['#000'],
                                    fontSize: '12px',
                                },
                                background: {
                                    enabled: true,
                                    borderRadius: 2,
                                },
                                offsetY: -10
                            },
                            markers: {
                                size: 5,
                                colors: ['#FF4560'],
                                strokeColors: '#fff',
                                strokeWidth: 2,
                                hover: {
                                    size: 7,
                                },
                            },
                        }"
              :series="[
                {
                  name: 'Venda por Mês',
                  data: graficoVendasPorAno.series,
                },
              ]"
            />
          </v-window-item>
        </v-window>
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
    <div id="pnCodigoTela">consultaCliente</div>
  </v-container>

  <!-- modalLocalizarCliente -->
  <v-dialog
    v-model="state.modalLocalizarClienteOpened"
    max-width="900"
    @click:outside="state.modalLocalizarClienteOpened = false"
  >
    <ModalLocalizarCliente
      @selecionarCliente="actions.selecionarCliente"
      @closeModalLocalizarCliente="state.modalLocalizarClienteOpened = false"
    />
  </v-dialog>

  <!-- modalBoletosEmAberto -->
  <v-dialog
    v-model="state.modalBoletosEmAbertoOpened"
    max-width="700"
    @click:outside="state.modalBoletosEmAbertoOpened = false"
  >
    <ModalBoletosAbertos
      :boletos-em-aberto="state.boletosEmAberto"
      @closeModalBoletosEmAberto="state.modalBoletosEmAbertoOpened = false"
    />
  </v-dialog>

  <!-- modalBoletosAtrasados -->
  <v-dialog
    v-model="state.modalBoletosAtrasadosOpened"
    max-width="700"
    @click:outside="state.modalBoletosAtrasadosOpened = false"
  >
    <ModalBoletosAtrasados
      :boletos-atrasados="state.boletosAtrasados"
      @closeModalBoletosAtrasados="state.modalBoletosEmAbertoOpened = false"
    />
  </v-dialog>

  <!-- modalBoletosEmDia -->
  <v-dialog
    v-model="state.modalBoletosEmDiaOpened"
    max-width="700"
    @click:outside="state.modalBoletosEmDiaOpened = false"
  >
    <ModalBoletosEmDia
      :boletos-em-dia="state.boletosEmDia"
      @closeModalBoletosEmDia="state.modalBoletosEmDiaOpened = false"
    />
  </v-dialog>

  <!-- modalTodosBoletos -->
  <v-dialog
    v-model="state.modalTodosBoletosOpened"
    max-width="700"
    @click:outside="state.modalTodosBoletosOpened = false"
  >
    <ModalTodosBoletos
      :todos-boletos="state.todosBoletos"
      @closeModalTodosBoletos="state.modalTodosBoletosOpened = false"
    />
  </v-dialog>
</template>

<style>
.v-overlay__scrim {
  background-color: black;
}

.cor-zebrada-1 {
  background-color: #f0f0f0;
}
</style>

<style scoped>
.cardDashboard {
  height: 80px;
  color: #fff6f6;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}

.v-col {
  padding: 6px;
}
</style>
