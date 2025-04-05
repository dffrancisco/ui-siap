<script setup lang="ts">
import { iTiposPagamento } from "../interfaces";
import { computed } from "vue";
import utils from "@/ts/utils";

const emit = defineEmits(["closeModalDetalhesPagamento"]);

const props = defineProps<{
  pagamentoSelecionado: iTiposPagamento;
  modalOpened: boolean;
}>();

const actions = {
  cancelar() {
    emit("closeModalDetalhesPagamento");
  },
};

const debitoOuCredito = computed(() => {
  if (props.pagamentoSelecionado.DEBITO_CREDITO === "D") return "Débito";
  if (props.pagamentoSelecionado.DEBITO_CREDITO === "C") return "Crédito";
  return "";
});
</script>

<template>
  <v-card class="modal-container">
    <v-card-title class="modal-title"> Detalhes do Pagamento </v-card-title>

    <v-card-text class="modal-content">
      <span v-if="props.pagamentoSelecionado.NUM_ORCAMENTO">
        <strong>Nº Orçamento:</strong> {{ props.pagamentoSelecionado.NUM_ORCAMENTO }}
      </span>

      <span v-if="props.pagamentoSelecionado.DESCRICAO_PAGAMENTO">
        <strong>Tipo de Pagamento:</strong> {{ props.pagamentoSelecionado.DESCRICAO_PAGAMENTO }}
      </span>

      <span v-if="props.pagamentoSelecionado.VALOR">
        <strong>Valor:</strong> R$ {{ utils.formatValor(props.pagamentoSelecionado.VALOR) }}
      </span>

      <span v-if="props.pagamentoSelecionado.DESCRICAO_BANDEIRA">
        <strong>Bandeira do Cartão:</strong> {{ props.pagamentoSelecionado.DESCRICAO_BANDEIRA }}
      </span>

      <span v-if="props.pagamentoSelecionado.AUTORIZACAO">
        <strong>Autorização Cartão:</strong> {{ props.pagamentoSelecionado.AUTORIZACAO }}
      </span>

      <span v-if="props.pagamentoSelecionado.DEBITO_CREDITO">
        <strong>Débito ou Crédito:</strong> {{ debitoOuCredito }}
      </span>

      <span v-if="props.pagamentoSelecionado.DIVIDE">
        <strong>Parcelado em:</strong> {{ props.pagamentoSelecionado.DIVIDE }}x
      </span>

      <span v-if="props.pagamentoSelecionado.PIX_CONTROLE">
        <strong>Controle PIX:</strong> {{ props.pagamentoSelecionado.PIX_CONTROLE }}
      </span>

      <span v-if="props.pagamentoSelecionado.OBS">
        <strong>Observação:</strong> {{ props.pagamentoSelecionado.OBS }}
      </span>

      <span v-if="props.pagamentoSelecionado.CONTA_DEPOSITO">
        <strong>Conta Depósito:</strong> {{ props.pagamentoSelecionado.CONTA_DEPOSITO }}
      </span>

      <span v-if="props.pagamentoSelecionado.CONTROLE_DEPOSITO">
        <strong>Controle Depósito:</strong> {{ props.pagamentoSelecionado.CONTROLE_DEPOSITO }}
      </span>
    </v-card-text>

    <v-row class="btns-modal">
      <v-btn
        title="Cancelar"
        class="btnCancelar"
        size="large"
        color="outline"
        density="compact"
        @click="actions.cancelar"
        >Cancelar</v-btn
      >
    </v-row>
  </v-card>
</template>

<style scoped>
.modal-container {
  display: flex;
  flex-direction: column;
  max-height: 500px;
  left: 25%;
  max-width: 420px;
  background: white;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  border: 2px solid rgba(0, 0, 0, 0.1);
  text-align: center;
}

.modal-title {
  font-size: 18px;
  font-weight: bold;
  padding-top: 10px;
  color: #444;
  text-align: center;
}

.modal-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: left;
}

.modal-content span {
  background: #f8f9fa;
  padding: 6px;
  border-radius: 4px;
  display: block;
  font-size: 14px;
}

.btns-modal {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 0;
  margin: 0;
  margin-right: 20px;
  padding-bottom: 20px;
}

.btnCancelar {
  background-color: transparent !important;
  border: 1px solid #2196f3;
  color: #2196f3 !important;
  transition: none !important;
}
</style>
