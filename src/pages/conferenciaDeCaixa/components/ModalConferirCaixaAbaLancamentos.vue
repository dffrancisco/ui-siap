<script setup lang="ts">
import { state, actions, computeds } from "../conferenciaDeCaixa";
import utils from "@/ts/utils";
import IconPagamento from "./IconPagamento.vue";
import { iTiposPagamento } from "../interfaces";
import { computed, nextTick, onMounted, reactive } from "vue";
import ModalDetalhesPagamento from "./ModalDetalhesPagamento.vue";
import { useEventListener } from "@vueuse/core";
import toast from "@/plugins/toast/toast";

const exibirDetalhesPagamento = (pagamento: iTiposPagamento) => {
  stateLancamentos.pagamentoSelecionado = pagamento;
  stateLancamentos.modalDetalhesPagamentoOpened = true;
};

const stateLancamentos = reactive({
  modalDetalhesPagamentoOpened: false,
  pagamentoSelecionado: <null | iTiposPagamento>null,
  inputLocalizarOrcamento: <HTMLInputElement>null,
  inputLocalizarAutCartao: <HTMLInputElement>null,
  inputValorSomatorio: <HTMLInputElement>null,
  somatorioLista: [] as { orcamento: string; valor: number }[],
  localizarOrcamento: "",
  localizarAutCartao: "",
  exibirApenasNaoConferidos: false,
  valorConferido: "",
});

const actionsLancamentos = {
  // Atualize a função adicionarAoSomatorio
  adicionarAoSomatorio: () => {
    if (!stateLancamentos.valorConferido.trim()) return;

    toast.error("Nenhum pagamento encontrado com esse valor.");

    const input = stateLancamentos.valorConferido.trim();
    const comprasFiltradas = computeds.comprasFiltradasPorCaixa.value;

    // Função para verificar se o orçamento já existe
    const orcamentoJaExiste = (numOrcamento: number) => {
      return state.somatorioLista.some((item) => item.orcamento === numOrcamento.toString());
    };

    // Caso 1: Apenas número do orçamento (ex: "25")
    if (/^\d+$/.test(input)) {
      const numOrcamento = parseInt(input);

      if (!orcamentoJaExiste(numOrcamento)) {
        const pagamento = comprasFiltradas
          .flatMap((c) => c.TIPOS_PAGAMENTO)
          .find((p) => p.NUM_ORCAMENTO === numOrcamento);

        if (pagamento) {
          state.somatorioLista.push({
            orcamento: numOrcamento.toString(),
            valor: pagamento.VALOR,
          });
        }
      }
    }
    // Caso 2: Apenas valor (ex: "100,00") - Adiciona o PRIMEIRO encontrado
    else if (/^[\d,.]+$/.test(input)) {
      const valor = parseFloat(input.replace(/\./g, "").replace(",", "."));

      if (!isNaN(valor)) {
        // Encontra o PRIMEIRO pagamento com esse valor que ainda não está no somatório
        const pagamento = comprasFiltradas
          .flatMap((c) => c.TIPOS_PAGAMENTO)
          .find((p) => Math.abs(p.VALOR - valor) < 0.01 && !orcamentoJaExiste(p.NUM_ORCAMENTO));

        if (pagamento) {
          state.somatorioLista.push({
            orcamento: pagamento.NUM_ORCAMENTO.toString(),
            valor: pagamento.VALOR,
          });
        }
      }
    }
    // Caso 3: Formato completo (ex: "25 100,00")
    else {
      const partes = input.split(/[\s,]+/).filter(Boolean);
      if (partes.length >= 2) {
        const numOrcamento = parseInt(partes[0]);
        const valor = parseFloat(partes[1].replace(/\./g, "").replace(",", "."));

        if (!isNaN(numOrcamento) && !orcamentoJaExiste(numOrcamento)) {
          state.somatorioLista.push({
            orcamento: numOrcamento.toString(),
            valor,
          });
        }
      }
    }

    stateLancamentos.valorConferido = "";
    nextTick(() => {
      const inputEl = document.getElementById("inputValorSomatorio") as HTMLInputElement;
      if (inputEl) inputEl.focus();
    });
  },

  removerDoSomatorio: (index: number) => {
    state.somatorioLista.splice(index, 1);
  },

  limparSomatorio: () => {
    state.somatorioLista = [];
  },

  atualizarFiltroOrcamento() {
    actions.filtrarPorOrcamento(stateLancamentos.localizarOrcamento);
  },

  atualizarFiltroAutorizacao() {
    actions.filtrarPorAutorizacao(stateLancamentos.localizarAutCartao);
  },

  toggleFiltroNaoConferidos() {
    actions.toggleApenasNaoConferidos();
  },

  conferirValor() {
    actions.conferirValor(stateLancamentos.valorConferido);
    stateLancamentos.valorConferido = ""; // Limpa o input após conferir
  },
};

// Computed para calcular totalizadores
const totalizadores = computed(() => {
  return {
    quantidade: state.somatorioLista.length,
    total: state.somatorioLista.reduce((acc, item) => acc + item.valor, 0),
  };
});

useEventListener(document, "keydown", async (event) => {
  if (event.key === "F2") {
    event.preventDefault();
    stateLancamentos.inputLocalizarOrcamento?.focus();
  }
  if (event.key === "F4") {
    event.preventDefault();
    stateLancamentos.inputLocalizarAutCartao?.focus();
  }
  if (event.key === "F3") {
    event.preventDefault();
    stateLancamentos.inputValorSomatorio?.focus();
  }
  if (event.key === "Enter" && document.activeElement === stateLancamentos.inputValorSomatorio) {
    event.preventDefault();
    actionsLancamentos.adicionarAoSomatorio();
  }
});

onMounted(() => {
  stateLancamentos.inputLocalizarOrcamento = document.getElementById(
    "inputLocalizarOrcamento"
  ) as HTMLInputElement;
  stateLancamentos.inputLocalizarAutCartao = document.getElementById(
    "inputLocalizarAutCartao"
  ) as HTMLInputElement;
  stateLancamentos.inputValorSomatorio = document.getElementById("inputValorSomatorio") as HTMLInputElement;

  nextTick(() => {
    if (stateLancamentos.inputValorSomatorio) {
      stateLancamentos.inputValorSomatorio.focus();
    }
  });
});

const isOrcamentoNoSomatorio = (numOrcamento: number) => {
  return stateLancamentos.somatorioLista.some((item) => item.orcamento === numOrcamento.toString());
};

const isPagamentoNoSomatorio = (numOrcamento: number, valor: number) => {
  return state.somatorioLista.some(
    (item) =>
      item.orcamento === numOrcamento.toString() && Math.abs(parseFloat(item.valor.toString()) - valor) < 0.01
  );
};
</script>

<template>
  <v-card class="pa-1">
    <v-row>
      <v-col
        class="d-flex flex-column"
        cols="2"
      >
        <v-card
          class="flex-grow-1"
          max-height="355px"
          style="overflow-y: scroll"
          outlined
          mandatory
        >
          <v-list-item
            v-for="(item, index) in computeds.totalizadoresFiltradosPorCaixa.value"
            :key="index"
            @click="actions.selecionarPagamentoModal(item.TIPO_PAGAMENTO)"
            :class="{ tipo_pag_selected: state.pagamentosSelecionadosModal.includes(item.TIPO_PAGAMENTO) }"
          >
            <v-list-item-title>{{ item.DESCRICAO_PAGAMENTO }}</v-list-item-title>
            <v-list-item-subtitle>
              <b>{{ utils.formatValor(item.VALOR) }}</b>
            </v-list-item-subtitle>
          </v-list-item>
        </v-card>
      </v-col>

      <!-- Card Direito (Compras do Tipo Selecionado) -->
      <v-col
        cols="7"
        style="padding: 0"
      >
        <v-data-table-virtual
          :key="state.pagamentoSelecionado"
          :items="computeds.comprasFiltradasPorCaixa.value"
          :headers="state.headersLancamentos"
          height="345"
          item-value="id"
          :loading="state.loading"
          fixed-header
          class="elevation-1"
        >
          <template v-slot:item.INDEX="{ item }">
            <span class="text-center font-weight">{{ item.INDEX }}</span>
          </template>

          <template v-slot:item.NUM_ORCAMENTO="{ item }">
            <div class="orcamento-group">
              <div
                v-for="orc in item.ORCAMENTOS?.length ? item.ORCAMENTOS : []"
                :key="orc.NUM_ORCAMENTO"
                class="orcamento-box"
                :class="{
                  'orcamento-entregar-receber': item.ENTREGAR_RECEBER,
                  'orcamento-no-somatorio': isOrcamentoNoSomatorio(orc.NUM_ORCAMENTO),
                }"
              >
                <div
                  class="orcamento-numero"
                  :class="{ 'orcamento-numero-entregar-receber': item.ENTREGAR_RECEBER }"
                >
                  {{ orc.NUM_ORCAMENTO }}
                </div>
                <div
                  class="orcamento-valor"
                  :class="{ 'orcamento-valor-entregar-receber': item.ENTREGAR_RECEBER }"
                >
                  {{ utils.formatValor(orc.VALOR_ORCAMENTO) }}
                </div>
              </div>
            </div>
          </template>

          <template v-slot:item.PAGAMENTOS="{ item }">
            <div class="chips-pagamentos">
              <v-chip
                v-for="pagamento in item.TIPOS_PAGAMENTO"
                :key="pagamento.TIPOS_PAGAMENTO"
                class="mr-1 chip-pagamento"
                :color="pagamento.CONFERIDO ? 'success' : 'primary'"
                @click.stop="exibirDetalhesPagamento(pagamento)"
                title="ver detalhes"
                :class="{
                  'chip-no-somatorio': isPagamentoNoSomatorio(pagamento.NUM_ORCAMENTO, pagamento.VALOR),
                }"
              >
                <div class="chip-pagamento-icon">
                  <IconPagamento
                    :tipoPagamento="pagamento.DESCRICAO_PAGAMENTO"
                    :bandeira="pagamento.BANDEIRA"
                    :descricaoBandeira="pagamento.DESCRICAO_BANDEIRA"
                  />
                  <div class="d-flex flex-column">
                    <div class="d-flex align-center justify-space-between">
                      <div class="chip-pagamento-descricao">
                        {{ pagamento.DESCRICAO_PAGAMENTO }}
                        <span v-if="pagamento.DIVIDE !== null"> {{ pagamento.DIVIDE }}x </span>
                      </div>
                    </div>
                    <div class="d-flex align-center">
                      <strong>{{ utils.formatValor(pagamento.VALOR) }}</strong>
                    </div>
                  </div>
                </div>
              </v-chip>
            </div>
          </template>
        </v-data-table-virtual>
      </v-col>

      <v-col
        cols="3"
        style="padding: 5px"
      >
        <v-card>
          <v-data-table-virtual
            :items="state.somatorioLista"
            height="303"
            fixed-header
            :headers="[
              { title: 'Orç.', key: 'orcamento' },
              { title: 'Valor', key: 'valor' },
              { title: 'Ações', key: 'acoes', sortable: false },
            ]"
            dense
            hide-default-footer
          >
            <template v-slot:item.valor="{ item }">
              <b>{{ utils.formatValor(item.valor) }}</b>
            </template>

            <template v-slot:item.acoes="{ index }">
              <v-icon
                color="primary"
                @click="actionsLancamentos.removerDoSomatorio(index)"
                title="Remover"
                >mdi-delete</v-icon
              >
            </template>
          </v-data-table-virtual>

          <v-divider></v-divider>

          <v-footer class="d-flex justify-space-between px-4 py-2">
            <span><b>Qtd:</b> {{ totalizadores.quantidade }}</span>
            <span><b>Total:</b> {{ utils.formatValor(totalizadores.total) }}</span>
            <v-tooltip top>
              <template v-slot:activator="{ props }">
                <v-btn
                  @click="actionsLancamentos.limparSomatorio"
                  icon
                  size="20px"
                  v-bind="props"
                >
                  <v-icon color="primary">mdi-delete</v-icon>
                </v-btn>
              </template>
              <span>Limpar tudo</span>
            </v-tooltip>
          </v-footer>
        </v-card>
      </v-col>
    </v-row>
    <v-container
      fluid
      class="pa-4 mt-1"
    >
      <v-row>
        <v-col
          cols="3"
          class="pl-0"
        >
          <v-text-field
            id="inputLocalizarOrcamento"
            v-model="stateLancamentos.localizarOrcamento"
            label="Localizar Orçamento (F2)"
            :clearable="false"
            @input="actionsLancamentos.atualizarFiltroOrcamento"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
            id="inputLocalizarAutCartao"
            v-model="stateLancamentos.localizarAutCartao"
            label="Localizar Aut. Cartao (F4)"
            :clearable="false"
            @input="actionsLancamentos.atualizarFiltroAutorizacao"
          ></v-text-field>
        </v-col>
        <v-col
          cols="3"
          class="pt-1"
        >
          <v-checkbox
            v-model="stateLancamentos.exibirApenasNaoConferidos"
            label="Exibir apenas valores não conferidos"
            @change="actionsLancamentos.toggleFiltroNaoConferidos"
          ></v-checkbox>
        </v-col>
        <v-col
          cols="3"
          class="pr-0"
        >
          <v-text-field
            id="inputValorSomatorio"
            ref="inputValorSomatorio"
            v-model="stateLancamentos.valorConferido"
            label="Orç. ou Valor (F3 + Enter)"
            :clearable="false"
            placeholder="Ex: 12345 ou 100,00"
            @keydown.enter.prevent="actionsLancamentos.adicionarAoSomatorio"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
  <!-- Modal Detalhes Pagamento -->
  <v-dialog
    v-model="stateLancamentos.modalDetalhesPagamentoOpened"
    max-width="500"
  >
    <ModalDetalhesPagamento
      :modalOpened="stateLancamentos.modalDetalhesPagamentoOpened"
      :pagamentoSelecionado="stateLancamentos.pagamentoSelecionado"
      @closeModalDetalhesPagamento="stateLancamentos.modalDetalhesPagamentoOpened = false"
    />
  </v-dialog>
</template>

<style scoped>
.tipo_pag_selected {
  background-color: #017bc2c7 !important;
  color: white !important;
  border-radius: 8px;
}

.v-chip {
  display: flex;
  align-items: center;
  height: 50px;
}

.chips-pagamentos {
  display: flex;
  gap: 4px;
  padding: 2px;
  flex-wrap: wrap;
  margin-left: -10px;
  width: 130%;
}

.v-icon {
  cursor: pointer;
}

.chip-pagamento {
  width: 100px;
  height: 45px;
  border-radius: 8px !important;
  transition: all 0.3s ease;
}

.chip-no-somatorio {
  border: 2px solid #4caf50 !important;
  box-shadow: 0 0 0 1px #4caf50 !important;
}

.chip-pagamento-icon {
  width: 105px;
  display: flex;
}

.chip-pagamento-descricao {
  font-size: 9px;
  font-weight: 500;
  line-height: 1;
  margin-bottom: 2px;
}

.orcamento-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 4px;
  gap: 2px;
}

.orcamento-box {
  display: flex;
  align-items: center;
  border: 1px solid #017bc2c7;
  border-radius: 6px;
  overflow: hidden;
  font-weight: bold;
  color: #0496ea;
  background: rgba(33, 150, 243, 0.15);
  width: fit-content;
}

.orcamento-numero {
  padding: 4px 8px;
  background: #0496ea;
  color: white;
  border-radius: 0px 8px 8px 0px;
  min-width: 54px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.orcamento-valor {
  padding: 4px 8px;
  color: #0496ea;
  border-radius: 0 6px 6px 0;
  min-width: 56px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.orcamento-numero-entregar-receber {
  padding: 4px 8px;
  background: #c2016575;
  color: white;
  border-radius: 0px 8px 8px 0px;
}

.orcamento-valor-entregar-receber {
  padding: 4px 8px;
  color: #c20165c1;
  border-radius: 0 6px 6px 0;
}

.orcamento-entregar-receber {
  display: flex;
  align-items: center;
  border: 1px solid #c20165c7;
  border-radius: 6px;
  overflow: hidden;
  font-weight: bold;
  color: #fb2be7;
  background: rgba(243, 33, 229, 0.15);
  width: fit-content;
  margin-top: 3px;
  margin-bottom: 3px;
  margin-right: 5px;
}

#inputValorSomatorio {
  font-weight: bold;
}

.orcamento-no-somatorio {
  border: 2px solid #4caf50 !important;
  background: rgba(76, 175, 80, 0.1) !important;
}
</style>
