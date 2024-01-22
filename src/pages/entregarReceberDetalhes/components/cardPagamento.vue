<script setup lang="ts">
import { formatValor } from "@/ts/utils";
import iconeAura from "../assets/cartoes/aura.svg";
import iconeAmex from "../assets/cartoes/american_express.svg";
import iconeCabal from "../assets/cartoes/cabal.svg";
import iconeDinersClub from "../assets/cartoes/diners_club.svg";
import iconeElo from "../assets/cartoes/elo.svg";
import iconeHipercard from "../assets/cartoes/hipercard.svg";
import iconeMasterCard from "../assets/cartoes/master_card.svg";
import iconeSorocred from "../assets/cartoes/sorocred.svg";
import iconeVisa from "../assets/cartoes/visa.svg";

const props = defineProps({
  index: {
    type: Number,
    required: true,
  },
  valor: {
    type: Number,
    required: true,
  },
  descricaoTipoPagamento: {
    type: String,
    required: true,
  },
  codigoBandeiraCartao: {
    type: Number,
    default: undefined,
  },
});

const imgBandeiraCartoes = {
  1: iconeVisa,
  2: iconeMasterCard,
  3: iconeAmex,
  4: iconeSorocred,
  5: iconeDinersClub,
  6: iconeElo,
  7: iconeHipercard,
  8: iconeAura,
  9: iconeCabal,
  99: "",
};

const emit = defineEmits(["deletar"]);

const deletar = () => {
  emit("deletar", props.index);
};
</script>

<template>
  <div class="cc">
    <div class="cc__front cc__part">
      <div>
        <span> {{ props.descricaoTipoPagamento }}</span>
        <p>{{ formatValor(props.valor) }}</p>
      </div>
    </div>
    <div v-if="imgBandeiraCartoes[codigoBandeiraCartao]" class="icone-cartao">
      <img :src="imgBandeiraCartoes[codigoBandeiraCartao]" />
    </div>
    <div class="icone-lixeira">
      <v-icon @click="deletar" title="deletar pagamento" color="#fff"
        >mdi-delete</v-icon
      >
    </div>
  </div>
</template>

<style scoped lang="scss">
.cc {
  width: 130px;
  height: 75px;
  -webkit-perspective: 600px;
  -moz-perspective: 600px;
  perspective: 600px;
  flex: 1 1 auto;
  margin-bottom: 12px;
}

.cc__part {
  color: #fff;
  font-weight: 700;
  box-shadow: 1px 1px #aaa3a3;
  top: 0;
  left: 0;
  display: inline-block;
  height: 75px;
  width: 100%;
  padding: 12px;
  max-width: 130px;
  background-image: url(),
    linear-gradient(
      to right bottom,
      #2f3193,
      rgba(34, 35, 120, 0.9294117647),
      rgba(29, 29, 106, 0.768627451),
      rgba(29, 29, 106, 0.8392156863),
      rgba(29, 29, 106, 0.9490196078)
    );
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  border-radius: 8px;
  -webkit-transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  -moz-transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  -ms-transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  -o-transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.icone-lixeira {
  position: absolute;
  top: 50px;
  left: 110px;
}

.icone-cartao {
  position: absolute;
  top: 4px;
  left: 90px;

  img {
    width: 28px;
    height: 28px;
  }
}
</style>
