<script setup lang="ts">
import { computed } from "vue";
import iconPix from "./../assets/pix.svg";
import iconCartao from "./../assets/cartao.svg";
import iconDinheiro from "./../assets/dinheiro.svg";
import iconPedido from "./../assets/pedido.svg";
import iconEntregarReceber from "./../assets/entregarReceber.svg";
import iconValePeças from "./../assets/valePecas.svg";
import iconCredito from "./../assets/credito.svg";
import iconMasterCard from "./../assets/mastercard-svgrepo-com.svg";
import iconVisa from "./../assets/visa-svgrepo-com.svg";
import iconDinners from "./../assets/diners-svgrepo-com.svg";
import iconAmericanExpress from "./../assets/amex-svgrepo-com.svg";
import iconElo from "./../assets/elo-svgrepo-com.svg";
import iconHipercard from "./../assets/hipercard-svgrepo-com.svg";

const props = defineProps({
  tipoPagamento: {
    type: String,
    required: true,
  },
  bandeira: {
    type: Number,
    default: null,
  },
  descricaoBandeira: {
    type: String,
    default: null,
  },
});

const bandeiraIcons = {
  0: iconCartao,
  1: iconVisa,
  2: iconMasterCard,
  3: iconAmericanExpress,
  5: iconDinners,
  6: iconElo,
  7: iconHipercard,
};

const defaultIcons = {
  CARTÃO: iconCartao,
  PIX: iconPix,
  DINHEIRO: iconDinheiro,
  PEDIDO: iconPedido,
  "ENTREGAR RECEBE": iconEntregarReceber,
  "VALE PEÇAS": iconValePeças,
  CREDITO: iconCredito,
};

const iconPath = computed(() => {
  if (props.tipoPagamento === "CARTÃO" && props.bandeira && bandeiraIcons[props.bandeira]) {
    return bandeiraIcons[props.bandeira];
  }
  return defaultIcons[props.tipoPagamento] || null;
});

const iconTitle = computed(() => {
  if (props.tipoPagamento === "CARTÃO" && props.descricaoBandeira) {
    return props.descricaoBandeira;
  }
  return props.tipoPagamento;
});
</script>

<template>
  <img
    :src="iconPath"
    :alt="tipoPagamento"
    :title="iconTitle"
    class="icon-pagamento"
    v-if="iconPath"
  />
</template>

<style scoped>
.icon-pagamento {
  width: 25px;
  height: 25px;
  margin-right: 8px;
  cursor: pointer;
}
</style>
