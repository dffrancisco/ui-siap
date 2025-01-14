<script lang="ts" setup>
import { reactive, computed, nextTick, watch } from "vue";
import cardPagamento from "./cardPagamento.vue";
import {
  iCartaoDisponivel,
  iOrcamentoBaixa,
  iPagamento,
  iTipoPagamento,
} from "../interface";
import utils, { formatValor, sleep } from "@/ts/utils";
import modalPgtoDinheiroPixDeposito from "./modalPgtoDinheiroPixDeposito.vue";
import modalPgtoCartao from "./modalPgtoCartao.vue";
import xModal, { iModalCreate } from "@/plugins/xModal/xModal";
import {
  TIPO_PAGAMENTO_DINHEIRO,
  TIPO_PAGAMENTO_CARTAO,
  TIPO_PAGAMENTO_DEPOSITO,
  TIPO_PAGAMENTO_PIX,
  TIPO_PAGAMENTO_DESCRICAO,
} from "../entregarReceberDetalhes.constants";
import { onKeyStroke } from "@vueuse/core";

const props = defineProps<{
  orcamento: iOrcamentoBaixa;
  opened: boolean;
  cartoesDisponiveis: iCartaoDisponivel[];
}>();

const emit = defineEmits(["cancelar", "finalizar"]);

const openModalPixDepositoDinheiro = (tipoPagamento: iTipoPagamento): void => {
  if (valorRestante.value == 0) return;

  state.tipoPagamentoSelecionado = tipoPagamento;
  state.modalPgtoDinheiroPixDepositoOpened = true;
  state.modalPgtoDinheiroPixDeposito.open();
};

const openModalCartao = (tipoPagamento: iTipoPagamento): void => {
  if (valorRestante.value == 0) return;

  state.tipoPagamentoSelecionado = tipoPagamento;
  state.modalPgtoCartaoOpened = true;
  state.modalPgtoCartao.open();
};

const state = reactive({
  modalPgtoDinheiroPixDepositoOpened: false,
  modalPgtoCartaoOpened: false,
  opcoesPagamento: [
    {
      codigo: TIPO_PAGAMENTO_DINHEIRO,
      icon: "mdi-account-cash",
      nome: "Dinheiro",
      click: () => openModalPixDepositoDinheiro(TIPO_PAGAMENTO_DINHEIRO),
    },
    {
      codigo: TIPO_PAGAMENTO_CARTAO,
      icon: "mdi-credit-card",
      nome: "Cartão",
      click: () => openModalCartao(TIPO_PAGAMENTO_CARTAO),
    },
    {
      codigo: TIPO_PAGAMENTO_DEPOSITO,
      icon: "mdi-currency-usd",
      nome: "Depósito",
      click: () => openModalPixDepositoDinheiro(TIPO_PAGAMENTO_DEPOSITO),
    },
    {
      codigo: TIPO_PAGAMENTO_PIX,
      icon: "mdi-cellphone",
      nome: "Pix",
      click: () => openModalPixDepositoDinheiro(TIPO_PAGAMENTO_PIX),
    },
  ],
  pagamentos: <iPagamento[]>[],
  modalPgtoDinheiroPixDeposito: <iModalCreate>(<unknown>null),
  modalPgtoCartao: <iModalCreate>(<unknown>null),
  tipoPagamentoSelecionado: "",
});

const valorRestante = computed(() => {
  return props.orcamento.VALOR - totalPagamentos.value;
});

const totalPagamentos = computed(() => {
  let soma = 0;

  state.pagamentos.forEach((pagamento) => {
    soma += pagamento.valor;
  });

  return parseFloat(soma.toFixed(2));
});

const totalPagamentoDinheiro = computed(() => {
  let soma = 0;

  state.pagamentos.forEach((pagamento) => {
    if (pagamento.tipoPagamento == TIPO_PAGAMENTO_DINHEIRO) {
      soma += pagamento.valor;
    }
  });

  return soma;
});

const existeModalAberta = computed(() => {
  return (
    state.modalPgtoCartaoOpened || state.modalPgtoDinheiroPixDepositoOpened
  );
});

const salvarPagamento = async (pagamento: iPagamento) => {
  pagamento.descricaoTipoPagamento =
    TIPO_PAGAMENTO_DESCRICAO[pagamento.tipoPagamento];
  pagamento.autorizacao = pagamento.autorizacao || "";

  let indexPagamentoDinheiro = state.pagamentos.findIndex(
    (pagamento) => pagamento.tipoPagamento == TIPO_PAGAMENTO_DINHEIRO
  );

  if (
    pagamento.tipoPagamento == TIPO_PAGAMENTO_DINHEIRO &&
    indexPagamentoDinheiro != -1
  ) {
    state.pagamentos[indexPagamentoDinheiro] = pagamento;
  } else {
    state.pagamentos.push(pagamento);
  }

  if (state.modalPgtoCartaoOpened) state.modalPgtoCartao.close();

  if (state.modalPgtoDinheiroPixDepositoOpened)
    state.modalPgtoDinheiroPixDeposito.close();

  if (valorRestante.value == 0) {
    await sleep(200);

    //@ts-ignore
    document.querySelector("#btnFinalizar").focus();
  }
};

const cancelarPagamento = () => {
  state.modalPgtoDinheiroPixDeposito.close();
};

const deletarPagamento = (index: number) => {
  state.pagamentos.splice(index, 1);
};

const onClickCancelar = () => {
  emit("cancelar");
};

const onClickFinalizar = () => {
  if (valorRestante.value > 0) return;

  emit("finalizar", state.pagamentos);
};

const criarModais = () => {
  state.modalPgtoDinheiroPixDeposito = new xModal.create({
    el: "#modalPgtoDinheiroPixDeposito",
    height: 300,
    width: 282,
    title: "Informe o valor",
    onClose: () => {
      state.tipoPagamentoSelecionado = TIPO_PAGAMENTO_DINHEIRO;
      state.modalPgtoDinheiroPixDepositoOpened = false;
    },
  });

  state.modalPgtoCartao = new xModal.create({
    el: "#modalPgtoCartao",
    height: 700,
    width: 480,
    title: "Informe o valor",
    onClose: () => {
      state.tipoPagamentoSelecionado = TIPO_PAGAMENTO_CARTAO;
      state.modalPgtoCartaoOpened = false;
    },
  });
};

onKeyStroke("ArrowRight", (e) => {
  if (existeModalAberta.value) return;

  const indexAtual = state.opcoesPagamento.findIndex(
    (opcaoPagamento) => opcaoPagamento.codigo == state.tipoPagamentoSelecionado
  );
  const ultimoIndice = state.opcoesPagamento.length - 1;

  const proximaOpcaoPgto = state.opcoesPagamento[indexAtual + 1];

  state.tipoPagamentoSelecionado = proximaOpcaoPgto
    ? proximaOpcaoPgto.codigo
    : state.opcoesPagamento[ultimoIndice].codigo;

  e.preventDefault();
});

onKeyStroke("ArrowLeft", (e) => {
  if (existeModalAberta.value) return;

  const indexAtual = state.opcoesPagamento.findIndex(
    (opcaoPagamento) => opcaoPagamento.codigo == state.tipoPagamentoSelecionado
  );

  const opcaoPgtoAnterior = state.opcoesPagamento[indexAtual - 1];

  state.tipoPagamentoSelecionado = opcaoPgtoAnterior
    ? opcaoPgtoAnterior.codigo
    : state.opcoesPagamento[0].codigo;

  e.preventDefault();
});

onKeyStroke("Enter", (e) => {
  if (!props.opened) return;

  if (existeModalAberta.value) return;

  if (valorRestante.value == 0) return;

  if (
    [
      TIPO_PAGAMENTO_DINHEIRO,
      TIPO_PAGAMENTO_DEPOSITO,
      TIPO_PAGAMENTO_PIX,
    ].includes(state.tipoPagamentoSelecionado)
  ) {
    openModalPixDepositoDinheiro(
      state.tipoPagamentoSelecionado as iTipoPagamento
    );

    e.preventDefault();
    return;
  }

  if (state.tipoPagamentoSelecionado == TIPO_PAGAMENTO_CARTAO) {
    openModalCartao(state.tipoPagamentoSelecionado);

    e.preventDefault();
    return;
  }

  e.preventDefault();
});

watch(
  () => props.opened,
  (newValue) => {
    nextTick(async () => {
      if (newValue) {
        state.pagamentos = [];
        state.tipoPagamentoSelecionado = TIPO_PAGAMENTO_DINHEIRO;
      }
    });
  }
);

nextTick(() => {
  criarModais();
});
</script>

<template>
  <div class="modalOpcoesPagamento d-flex flex-column justify-space-between">
    <div class="d-flex">
      <div class="dadosOrcamento">
        <v-row class="mt-1">
          <v-col cols="12" class="dados-orcamento__cliente">
            <span>Cliente:</span>
            <strong class="ml-2">
              {{ props.orcamento.CLIENTE }}
            </strong>
          </v-col>
          <v-col cols="4">
            <span>Nº Orç:</span>
            <strong class="ml-2">
              {{ props.orcamento.NUM_ORCAMENTO }}
            </strong>
          </v-col>
          <v-col cols="4">
            <span>Data:</span>
            <strong class="ml-2">
              {{ utils.dataBrasil(props.orcamento.DATA) }}
            </strong>
          </v-col>
          <v-col cols="4">
            <span>Valor:</span>
            <strong class="ml-2">
              {{ utils.formatValor(props.orcamento.VALOR) }}
            </strong>
          </v-col>
          <v-col cols="6">
            <span>Tipo Pgto:</span>
            <strong class="ml-2">
              {{ props.orcamento.DESCRICAO_PAGAMENTO }}
            </strong>
          </v-col>
          <v-col cols="6">
            <span>Motorista:</span>
            <strong class="ml-2 mr-2">
              {{ props.orcamento.NOME_MOTORISTA || "-" }}
            </strong>
          </v-col>
        </v-row>
      </div>
      <div class="formasPagamento">
        <div class="mOpcaoPagamento" id="mOpcaoPagamento" :tabindex="0">
          <template
            v-for="(opcaoPagamento, index) in state.opcoesPagamento"
            :key="opcaoPagamento.codigo"
          >
            <div
              class="btnMenus"
              :class="{
                'btnMenu-disabled': valorRestante == 0,
                'btnMenu-selecionado':
                  opcaoPagamento.codigo == state.tipoPagamentoSelecionado,
              }"
              :tabindex="index + 1"
              @click.prevent="opcaoPagamento.click"
              @keypress.enter.prevent="
                () => {
                  console.log('enter');
                }
              "
            >
              <v-icon size="30" :icon="opcaoPagamento.icon" color="primary" />
              <span>{{ opcaoPagamento.nome }}</span>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div class="d-flex">
      <div class="pagamentos">
        <div class="cardsPagamentos">
          <card-pagamento
            v-for="(pagamento, i) in state.pagamentos"
            :index="i"
            :valor="pagamento.valor"
            :descricao-tipo-pagamento="pagamento.descricaoTipoPagamento"
            :codigoBandeiraCartao="pagamento.codigoBandeiraCartao"
            @deletar="deletarPagamento"
          />
        </div>
        <div class="resumoPagamento">
          <v-card class="pa-2">
            <div class="d-flex flex-column">
              <span span>Vlr Orçamento</span>
              <strong class="text-h6">{{
                formatValor(props.orcamento.VALOR)
              }}</strong>
            </div>
            <div class="d-flex flex-column mt-2">
              <span>Pago</span>
              <strong class="text-h6">{{
                formatValor(totalPagamentos)
              }}</strong>
            </div>
            <div class="d-flex flex-column mt-2">
              <span>Restante</span>
              <strong class="text-h6">{{ formatValor(valorRestante) }}</strong>
            </div>
          </v-card>
        </div>
      </div>
    </div>
    <div class="d-flex justify-end">
      <v-btn
        @click="onClickCancelar"
        color="primary"
        variant="outlined"
        class="mr-2"
        >Cancelar</v-btn
      >
      <v-btn
        id="btnFinalizar"
        @click="onClickFinalizar"
        color="primary"
        :disabled="valorRestante > 0"
      >
        Finalizar
      </v-btn>
    </div>

    <div id="modalPgtoDinheiroPixDeposito" style="display: none">
      <modalPgtoDinheiroPixDeposito
        :total-pagamento-dinheiro="totalPagamentoDinheiro"
        :opened="state.modalPgtoDinheiroPixDepositoOpened"
        :tipoPagamento="state.tipoPagamentoSelecionado"
        :total-pagamentos="totalPagamentos"
        :valor-orcamento="props.orcamento.VALOR"
        @salvar="salvarPagamento"
        @cancelar="cancelarPagamento"
      />
    </div>

    <div id="modalPgtoCartao" style="display: none">
      <modalPgtoCartao
        :opened="state.modalPgtoCartaoOpened"
        :tipoPagamento="state.tipoPagamentoSelecionado"
        :total-pagamentos="totalPagamentos"
        :valor-orcamento="props.orcamento.VALOR"
        :cartoes-disponiveis="props.cartoesDisponiveis"
        @salvar="salvarPagamento"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modalOpcoesPagamento {
  height: 100%;
  padding: 6px;
}
.mOpcaoPagamento {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  flex-grow: 1;
}

.btnMenus {
  text-align: center;
  border: 1px solid #e6d8ff;
  border-radius: 6px;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  color: rgb(var(--v-theme-primary));
  cursor: pointer;
  align-items: center;
  justify-content: center;
  gap: 2px;
  width: calc(50% - 10px);
  margin: 5px;
  padding: 12px;
  height: 80px;
}

.btnMenus:hover {
  background-color: rgb(var(--v-theme-primary), 0.2);
}

.btnMenus label {
  font-size: 10px;
  padding-top: 3px;
}

.btnMenus:focus,
.btnMenu-selecionado {
  background-image: radial-gradient(
    circle farthest-corner at -40.6% 20.7%,
    #0da0bf 0,
    #0253b9 100.2%
  );
  color: white;
  outline: none;

  label {
    color: white;
  }
}

.formasPagamento {
  min-width: 300px;
}

.resumoPagamento {
  min-width: 150px;
  padding: 5px 10px;
}

.cardsPagamentos {
  background-color: #f2f2f2;
  display: flex;
  padding: 8px;
  border-radius: 4px;
  margin-top: 5px;
  margin-bottom: 4px;
  height: 180px;
  width: 100%;
  flex-wrap: wrap;
}

.pagamentos {
  display: flex;
  flex-grow: 1;
}

.btnMenu-disabled {
  opacity: 0.6;
}
</style>
