<script lang="ts" setup>
import { reactive, computed, nextTick } from "vue";
import cardPagamento from "./cardPagamento.vue";
import { iOrcamentoBaixa, iPagamento, iTipoPagamento } from "../interface";
import utils, { formatValor } from "@/ts/utils";
import modalPgtoDinheiroPixDeposito from "./modalPgtoDinheiroPixDeposito.vue";
import xModal, { iModalCreate } from "@/plugins/xModal/xModal";
import {
  TIPO_PAGAMENTO_DINHEIRO,
  TIPO_PAGAMENTO_CARTAO,
  TIPO_PAGAMENTO_DEPOSITO,
  TIPO_PAGAMENTO_PIX,
  TIPO_PAGAMENTO_DESCRICAO,
} from "../entregarReceberDetalhes.constants";

const props = defineProps<{ orcamento: iOrcamentoBaixa }>();

const openModalPixDepositoDinheiro = (tipoPagamento: iTipoPagamento): void => {
  if (valorRestante.value == 0) return;

  state.tipoPagamentoSelecionado = tipoPagamento;
  state.modalPgtoDinheiroPixDepositoOpened = true;
  state.modalPgtoDinheiroPixDeposito.open();
};

const state = reactive({
  modalPgtoDinheiroPixDepositoOpened: false,
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
      click: () => {},
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

  return soma;
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

const salvarPagamento = (
  tipoPagamento: iTipoPagamento,
  valor: number,
  autorizacao?: string,
  bandeiraCartao?: string
) => {
  const pagamento: iPagamento = {
    tipoPagamento,
    valor,
    descricaoTipoPagamento: TIPO_PAGAMENTO_DESCRICAO[tipoPagamento],
    autorizacao: autorizacao || "",
    bandeiraCartao: bandeiraCartao || "",
  };

  let indexPagamentoDinheiro = state.pagamentos.findIndex(
    (pagamento) => pagamento.tipoPagamento == TIPO_PAGAMENTO_DINHEIRO
  );

  if (
    tipoPagamento == TIPO_PAGAMENTO_DINHEIRO &&
    indexPagamentoDinheiro != -1
  ) {
    state.pagamentos[indexPagamentoDinheiro] = pagamento;
  } else {
    state.pagamentos.push(pagamento);
  }

  state.modalPgtoDinheiroPixDeposito.close();
};

const cancelarPagamento = () => {
  state.modalPgtoDinheiroPixDeposito.close();
};

const deletarPagamento = (index: number) => {
  state.pagamentos.splice(index, 1);
};

const criarModais = () => {
  state.modalPgtoDinheiroPixDeposito = new xModal.create({
    el: "#modalPgtoDinheiroPixDeposito",
    height: 300,
    width: 282,
    title: "Informe o valor",
    onClose: () => {
      state.tipoPagamentoSelecionado = "";
      state.modalPgtoDinheiroPixDepositoOpened = false;
    },
  });
};

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
            :bandeira-cartao="pagamento.bandeiraCartao"
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
      <v-btn color="primary" variant="outlined" class="mr-2">Cancelar</v-btn>
      <v-btn color="primary">Finalizar</v-btn>
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

.btnMenus:focus {
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
</style>
