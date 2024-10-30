<script setup lang="ts">
import { state, actions, graficoVendaPorVendedor, graficoVendasPorAno } from "./consultaCliente";
import ModalLocalizarCliente from "./components/ModalLocalizarCliente.vue";
import ModalBoletosAbertos from "./components/ModalBoletosAbertos.vue";
import ModalBoletosAtrasados from "./components/ModalBoletosAtrasados.vue";
import ModalBoletosEmDia from "./components/ModalBoletosEmDia.vue";
import ModalTodosBoletos from "./components/ModalTodosBoletos.vue";
import ModalDetalhesOrcamento from "./components/ModalDetalhesOrcamento.vue";
import ModalDetalhesItensOrcamento from "./components/ModalDetalhesItensOrcamento.vue";
import ModalDetalhesItensMarca from "./components/ModalDetalhesItensMarca.vue";
import ModalDetalhesCredito from "./components/ModalDetalhesCredito.vue";
import ModalDetalhesDevolucao from "./components/ModalDetalhesDevolucao.vue";
import ModalDetalhesBoletos from "./components/ModalDetalhesBoletos.vue";
import utils from "@/ts/utils";
import VueApexCharts from "vue3-apexcharts";
</script>

<template>
  <v-container>
    <v-card
      :width="990"
      class="ma-auto pa-4"
    >
      <v-row>
        <v-col cols="6">
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

        <v-col cols="2">
          <v-btn
            title="Consultar"
            height="38px"
            width="250px"
            color="#3680AB"
            @click="state.modalLocalizarClienteOpened = true"
          >
            Loc. Cliente
            <v-icon class="ml-2">mdi-magnify</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="6"
          ><v-text-field
            v-model="state.telefone"
            label="Telefone"
            :clearable="false"
            :disabled="true"
          >
          </v-text-field
        ></v-col>
        <v-col cols="3"
          ><v-text-field
            v-model="state.dataInicio"
            label="Data Início"
            type="date"
            :clearable="false"
            :disabled="true"
          >
          </v-text-field
        ></v-col>
        <v-col cols="3"
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
        class="divider mt-4"
        :thickness="4"
      ></v-divider>

      <v-row>
        <!-- menu lateral -->
        <v-col
          cols="3"
          class="menu-scrollable"
        >
          <div
            v-for="item in state.menuItems"
            :key="item.value"
            class="menu-btn-wrapper"
          >
            <v-btn
              block
              :color="state.tab === item.value ? 'primary' : 'grey'"
              @click="state.tab = item.value"
            >
              {{ item.title }}
            </v-btn>
          </div>
        </v-col>

        <!-- conteudo das abas -->
        <v-col cols="9">
          <v-container>
            <v-window v-model="state.tab">
              <v-window-item value="dashboard"
                ><v-row
                  ><v-col cols="4"
                    ><v-card
                      class="cardDashboard"
                      style="background: #78350f"
                      ><span
                        >Limite Disponível<br />
                        {{ utils.formatValor(state.limiteDisponivelDashboard) }}</span
                      ><br /></v-card
                  ></v-col>
                  <v-col cols="4"
                    ><v-card
                      class="cardDashboard"
                      style="background: #3f51b5"
                    >
                      <span
                        >Crédito Usado<br />
                        {{ utils.formatValor(state.creditoUsadoDashboard) }}</span
                      ></v-card
                    ></v-col
                  >
                  <v-col cols="4"
                    ><v-card
                      class="cardDashboard"
                      style="background: #1e1b4b"
                    >
                      <span
                        >Limite de Crédito<br />
                        {{ utils.formatValor(state.limiteCreditoDashboard) }}</span
                      >
                    </v-card></v-col
                  >
                </v-row>
                <v-row
                  ><v-col cols="4"
                    ><v-card
                      class="cardDashboard"
                      style="background: #022c22"
                      @click="actions.openModalBoletosAbertos"
                      :disabled="
                        state.boletosEmAbertoDashboard == undefined || state.boletosEmAbertoDashboard == 0
                      "
                      ><v-icon
                        size="18"
                        class="mr-2"
                        >mdi-link-variant</v-icon
                      >
                      <span
                        >Boletos em Aberto<br />
                        {{ state.boletosEmAbertoDashboard || 0 }}</span
                      >
                    </v-card></v-col
                  >
                  <v-col cols="4"
                    ><v-card
                      class="cardDashboard"
                      style="background: #27272a"
                      @click="actions.openModalBoletosAtrasados"
                      :disabled="
                        state.boletosAtrasadosDashboard == undefined || state.boletosAtrasadosDashboard == 0
                      "
                      ><v-icon
                        size="18"
                        class="mr-2"
                        >mdi-link-variant</v-icon
                      >
                      <span
                        >Boletos Atrasados<br />
                        {{ state.boletosAtrasadosDashboard || 0 }}</span
                      >
                    </v-card></v-col
                  >
                  <v-col cols="4"
                    ><v-card
                      class="cardDashboard"
                      style="background: #30a28d"
                      @click="actions.openModalBoletosEmDia"
                      :disabled="state.boletosEmDiaDashboard == undefined || state.boletosEmDiaDashboard == 0"
                      ><v-icon
                        size="18"
                        class="mr-2"
                        >mdi-link-variant</v-icon
                      >
                      <span
                        >Boletos em Dia<br />
                        {{ state.boletosEmDiaDashboard || 0 }}</span
                      >
                    </v-card></v-col
                  >
                </v-row>
                <v-row>
                  <v-col cols="4"
                    ><v-card
                      class="cardDashboard"
                      style="background: #3c8dbc"
                      @click="actions.openModalTodosBoletos"
                      :disabled="state.todosBoletosDashboard == undefined || state.todosBoletosDashboard == 0"
                      ><v-icon
                        size="18"
                        class="mr-2"
                        >mdi-link-variant</v-icon
                      >
                      <span
                        >Todos Boletos<br />
                        {{ state.todosBoletosDashboard || 0 }}</span
                      >
                    </v-card></v-col
                  >

                  <v-col cols="4"
                    ><v-card
                      class="cardDashboard"
                      style="background: #2563eb"
                    >
                      <span
                        >Devoluções<br />
                        {{ state.devolucoesDashboard }}</span
                      >
                    </v-card></v-col
                  >
                  <v-col cols="4"
                    ><v-card
                      class="cardDashboard"
                      style="background: #d97706"
                    >
                      <span
                        >Vendedor<br />
                        {{ state.vendedorDashboard }}</span
                      >
                    </v-card></v-col
                  >
                </v-row>
                <v-row>
                  <v-col cols="4"
                    ><v-card
                      class="cardDashboard"
                      style="background: #831843"
                    >
                      <span
                        >Ticket Médio<br />
                        {{ utils.formatValor(state.ticketMedioDashboard) }}</span
                      >
                    </v-card></v-col
                  >
                  <v-col cols="4"
                    ><v-card
                      class="cardDashboard"
                      style="background: #5a5a5a"
                    >
                      <span
                        >Qtd Orçamentos<br />
                        {{ state.qtdOrcamentosDashboard }}</span
                      >
                    </v-card></v-col
                  >
                  <v-col cols="4"
                    ><v-card
                      class="cardDashboard"
                      style="background: #933ec5"
                    >
                      <span
                        >Marca<br />
                        {{ state.marcaDashboard }}</span
                      >
                    </v-card></v-col
                  >
                </v-row>
              </v-window-item>
              <v-window-item value="orcamentos">
                <v-data-table
                  class="tableOrcamentos"
                  style="border-radius: 5px; --v-table-row-height: 45px"
                  height="295"
                  fixed-header
                  id="tablesConsultaCliente"
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
                </v-data-table>
              </v-window-item>
              <v-window-item value="orcamentosNaoFinalizados">
                <v-data-table
                  class="tableOrcamentosNaoFinalizados"
                  style="border-radius: 5px; --v-table-row-height: 45px"
                  height="295"
                  fixed-header
                  id="tablesConsultaCliente"
                  :headers="state.headersOrcamentosNaoFinalizados"
                  :loading="state.loading"
                  :items="state.tableOrcamentosNaoFinalizados"
                  :row-props="actions.getClassCorLinha"
                >
                </v-data-table>
              </v-window-item>
              <v-window-item value="todosItens">
                <v-data-table
                  class="tableTodosItens"
                  style="border-radius: 5px; --v-table-row-height: 45px"
                  height="295"
                  fixed-header
                  id="tablesConsultaCliente"
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
                </v-data-table>
              </v-window-item>
              <v-window-item value="comprasFaturadas">
                <v-data-table
                  class="tableComprasFaturadas"
                  style="border-radius: 5px; --v-table-row-height: 45px; width: 700px"
                  height="295"
                  fixed-header
                  id="tablesConsultaCliente"
                  :headers="state.headersComprasFaturadas"
                  :loading="state.loading"
                  :items="state.tableComprasFaturadas"
                  :row-props="actions.getClassCorLinha"
                >
                </v-data-table>
              </v-window-item>
              <v-window-item value="marca">
                <v-data-table
                  class="tableMarcas"
                  style="border-radius: 5px; --v-table-row-height: 45px"
                  height="295"
                  fixed-header
                  id="tablesConsultaCliente"
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
                </v-data-table>
              </v-window-item>
              <v-window-item value="creditoDevolucao">
                <v-data-table
                  class="tableCreditoDevolucao"
                  style="border-radius: 5px; --v-table-row-height: 45px"
                  height="295"
                  id="tablesConsultaCliente"
                  fixed-header
                  :headers="state.headersCreditoDevolucao"
                  :loading="state.loading"
                  :items="state.tableCreditoDevolucao"
                  :row-props="actions.getClassCorLinha"
                >
                  <template v-slot:item.inf="{ item }">
                    <v-icon
                      size="large"
                      color="primary"
                      title="Ver detalhes"
                      @click="actions.openModalDetalhesCreditoDevolucao(item)"
                    >
                      mdi-information
                    </v-icon>
                  </template>
                </v-data-table>
              </v-window-item>
              <v-window-item value="devolucao">
                <v-data-table
                  class="tableDevolucao"
                  style="border-radius: 5px; --v-table-row-height: 45px"
                  height="295"
                  id="tablesConsultaCliente"
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
                </v-data-table>
              </v-window-item>
              <v-window-item value="vendaPorVendedor">
                <VueApexCharts
                  width="100%"
                  height="315"
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
                  height="315"
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
              <v-window-item value="boletos">
                <v-data-table
                  class="tableBoletos"
                  style="border-radius: 5px; --v-table-row-height: 45px; width: 700px"
                  height="295"
                  fixed-header
                  id="tablesConsultaCliente"
                  :headers="state.headersBoletos"
                  :loading="state.loading"
                  :items="state.tableBoletos"
                  :row-props="actions.getClassCorLinha"
                >
                  <template v-slot:item.inf="{ item }">
                    <v-icon
                      size="large"
                      color="primary"
                      title="Ver detalhes"
                      @click="actions.openModalDetalhesBoletos(item)"
                    >
                      mdi-information
                    </v-icon>
                  </template>
                </v-data-table>
              </v-window-item>
            </v-window>
          </v-container>
        </v-col>
      </v-row>
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
  >
    <ModalLocalizarCliente
      @selecionarCliente="actions.selecionarCliente"
      @closeModalLocalizarCliente="state.modalLocalizarClienteOpened = false"
    />
  </v-dialog>

  <!-- modalBoletosEmAberto -->
  <v-dialog
    v-model="state.modalBoletosEmAbertoOpened"
    max-width="750"
  >
    <ModalBoletosAbertos
      :boletos-em-aberto="state.boletosEmAberto"
      @closeModalBoletosEmAberto="state.modalBoletosEmAbertoOpened = false"
    />
  </v-dialog>

  <!-- modalBoletosAtrasados -->
  <v-dialog
    v-model="state.modalBoletosAtrasadosOpened"
    max-width="750"
  >
    <ModalBoletosAtrasados
      :boletos-atrasados="state.boletosAtrasados"
      @closeModalBoletosAtrasados="state.modalBoletosAtrasadosOpened = false"
    />
  </v-dialog>

  <!-- modalBoletosEmDia -->
  <v-dialog
    v-model="state.modalBoletosEmDiaOpened"
    max-width="750"
  >
    <ModalBoletosEmDia
      :boletos-em-dia="state.boletosEmDia"
      @closeModalBoletosEmDia="state.modalBoletosEmDiaOpened = false"
    />
  </v-dialog>

  <!-- modalTodosBoletos -->
  <v-dialog
    v-model="state.modalTodosBoletosOpened"
    max-width="750"
  >
    <ModalTodosBoletos
      :todos-boletos="state.todosBoletos"
      @closeModalTodosBoletos="state.modalTodosBoletosOpened = false"
    />
  </v-dialog>

  <!-- modalDetalhesOrcamento -->
  <v-dialog
    v-model="state.modalDetalhesOrcamentoOpened"
    max-width="750"
  >
    <ModalDetalhesOrcamento
      :detalhesItensOrcamento="state.itensOrcamento"
      :detalhesMontagem="state.montagemOrcamento"
      @closeModalDetalhesOrcamento="state.modalDetalhesOrcamentoOpened = false"
    />
  </v-dialog>

  <!-- modalDetalhesItensOrcamento -->
  <v-dialog
    v-model="state.modalDetalhesItensOrcamentoOpened"
    max-width="750"
  >
    <ModalDetalhesItensOrcamento
      :detalhesItens="state.detalhesItensOrcamento"
      @closeModalDetalhesItensOrcamento="state.modalDetalhesItensOrcamentoOpened = false"
    />
  </v-dialog>

  <!-- modalDetalhesBoletos -->
  <v-dialog
    v-model="state.modalDetalhesBoletosOpened"
    max-width="750"
  >
    <ModalDetalhesBoletos
      :detalhesBoleto="state.boletoSelecionado"
      @closeModalDetalhesBoletos="state.modalDetalhesBoletosOpened = false"
    />
  </v-dialog>

  <!-- modalDetalhesItensMarca -->
  <v-dialog
    v-model="state.modalDetalhesItensMarcaOpened"
    max-width="750"
  >
    <ModalDetalhesItensMarca
      :detalhesItensMarca="state.detalhesItensMarca"
      @closeModalDetalhesItensMarca="state.modalDetalhesItensMarcaOpened = false"
    />
  </v-dialog>

  <!-- modalDetalhesCredito -->
  <v-dialog
    v-model="state.modalDetalhesCreditoOpened"
    max-width="750"
  >
    <ModalDetalhesCredito
      :detalhesUsoCredito="state.detalhesUsoCredito"
      :detalhesItensCredito="state.detalhesItensCredito"
      @closeModalDetalhesCredito="state.modalDetalhesCreditoOpened = false"
    />
  </v-dialog>

  <!-- modalDetalhesDevolucao -->
  <v-dialog
    v-model="state.modalDetalhesDevolucaoOpened"
    max-width="750"
  >
    <ModalDetalhesDevolucao
      :detalhesDevolucao="state.detalhesDevolucao"
      @closeModalDetalhesDevolucao="state.modalDetalhesDevolucaoOpened = false"
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

#tablesConsultaCliente .v-data-table-footer {
  max-height: 50px;
}
</style>

<style scoped>
.cardDashboard {
  height: 84px;
  color: #fff6f6;
  font-size: 17px;
  font-weight: bold;
  text-align: center;
  padding: 10px;
}

.v-col {
  padding: 5px;
}

.menu-scrollable {
  max-height: 360px;
  overflow-y: auto;
  margin-top: 15px;
  padding-left: 10px;
  margin-bottom: 15px;
}

.menu-btn-wrapper {
  width: 210px;
  margin-bottom: 10px;
}
</style>
