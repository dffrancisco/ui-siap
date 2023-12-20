<script setup lang="ts">
import utils, { formatValorUSA, sleep } from "@/ts/utils";
import { reactive, watch, nextTick, computed } from "vue";
import {
  TIPO_PAGAMENTO_DEPOSITO,
  TIPO_PAGAMENTO_DINHEIRO,
  TIPO_PAGAMENTO_PIX,
} from "../entregarReceberDetalhes.constants";
import Swal from "sweetalert2";

const state = reactive({
  edtValor: "0",
  edtAutorizacao: "",
});

const props = defineProps({
  totalPagamentoDinheiro: {
    type: Number,
    default: 0,
  },
  autorizacaoInicial: {
    type: String,
    default: "",
  },
  opened: {
    type: Boolean,
    default: false,
  },
  tipoPagamento: {
    type: String,
    required: true,
  },
  totalPagamentos: {
    type: Number,
    required: true,
  },
  valorOrcamento: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["salvar", "cancelar"]);

const exibirEdtAutorizacao = computed(() => {
  if (
    [TIPO_PAGAMENTO_DEPOSITO, TIPO_PAGAMENTO_PIX].includes(props.tipoPagamento)
  ) {
    return true;
  }

  return false;
});

const valorDisponivel = computed(() => {
  let vlrDisponivel = props.valorOrcamento - props.totalPagamentos;
  if (props.tipoPagamento === TIPO_PAGAMENTO_DINHEIRO) {
    vlrDisponivel += props.totalPagamentoDinheiro;
  }

  return parseFloat(vlrDisponivel.toFixed(2));
});

watch(
  () => props.opened,
  (newValue) => {
    nextTick(async () => {
      if (newValue) {
        if (
          props.tipoPagamento == TIPO_PAGAMENTO_DINHEIRO &&
          props.totalPagamentoDinheiro != 0
        ) {
          state.edtValor = props.totalPagamentoDinheiro.toFixed(2);
        } else {
          state.edtValor = utils.formatValor(valorDisponivel.value);
        }

        state.edtAutorizacao = props.autorizacaoInicial;

        await sleep(200);
        //@ts-ignore
        document.querySelector("#edtValor").focus();
      }
    });
  }
);

const isDinheiro = computed(() => {
  return props.tipoPagamento == TIPO_PAGAMENTO_DINHEIRO ? true : false;
});

const onKeypressEnterEdtValor = () => {
  if (isDinheiro.value) {
    salvar();
  } else {
    //@ts-ignore
    document.querySelector("#edtAutorizacao").focus();
  }
};

const cancelar = () => {
  emit("cancelar");
};

const salvar = async () => {
  const valor = formatValorUSA(state.edtValor);

  if (valor == 0) {
    Swal.fire({
      text: "Informe um valor maior que 0.",
      icon: "warning",
    });

    return;
  }

  if (valor > valorDisponivel.value) {
    Swal.fire({
      text: "Valor informado maior que o valor restante para pagamento",
      icon: "warning",
    });

    return;
  }

  if (!isDinheiro.value && !state.edtAutorizacao) {
    await Swal.fire({
      text: "O campo autorização deve ser preenchido",
      icon: "warning",
    });

    //@ts-ignore
    document.querySelector("#edtAutorizacao").focus();
    return;
  }

  emit("salvar", {
    tipoPagamento: props.tipoPagamento,
    valor,
    autorizacao: state.edtAutorizacao,
  });
};
</script>

<template>
  <div class="modal-pgto-dinheiro">
    <v-row style="height: 100%">
      <v-col cols="12">
        <v-text-field
          id="edtValor"
          label="Valor"
          v-model="state.edtValor"
          hide-details
          autocomplete="off"
          v-mask-decimal.br="2"
          @keypress.enter="onKeypressEnterEdtValor"
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-if="exibirEdtAutorizacao"
          id="edtAutorizacao"
          label="Autorização"
          v-model="state.edtAutorizacao"
          hide-details
          @keypress.enter="salvar"
        />
      </v-col>
      <v-spacer />
      <v-col cols="12" class="d-flex align-center justify-center">
        <v-btn @click="cancelar" variant="outlined" color="primary" class="mr-2"
          >Cancelar</v-btn
        >
        <v-btn @click="salvar" color="primary">Salvar</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped lang="scss">
.modal-pgto-dinheiro {
  padding: 12px;
  height: 100%;
}
</style>
