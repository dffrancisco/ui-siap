<script setup lang="ts">
import { formatValor } from "@/ts/utils";

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
  bandeiraCartao: {
    type: String,
    default: undefined,
  },
});

const emit = defineEmits(["deletar"]);

const deletar = () => {
  emit("deletar", props.index);
};
</script>

<template>
  <div class="cc">
    <div class="cc__front cc__part">
      <div class="">
        <span class=""> {{ props.descricaoTipoPagamento }}</span>
        <p class="">{{ formatValor(props.valor) }}</p>
      </div>
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
</style>
