<script setup lang="ts">
import Swal from "sweetalert2";
import { reactive, defineProps, defineEmits, onMounted, PropType } from "vue";
import { iItem } from "../interfaces";

const emit = defineEmits(["salvar", "fechar"]);

const props = defineProps({
  acao: {
    type: String,
  },
  item: {
    type: Object as PropType<iItem>,
  },
});

const state = reactive({
  bandeira: props.item.bandeira,
  parcelas: 1,
});

onMounted(() => {
  if (props.acao === "alterar") {
    state.bandeira = props.item.DESCRICAO;
    state.parcelas = props.item.QTD;
  }
});

function cancelar() {
  emit("fechar");
}

function enviarDados() {
  if (!state.bandeira?.trim()) {
    Swal.fire({ icon: "warning", text: "A bandeira deve ser preenchida!" });
    return;
  }

  if (state.parcelas <= 0 || state.parcelas > 24) {
    Swal.fire({ icon: "warning", text: "A quantidade deve ser entre 1 e 24!" });
    return;
  }

  emit("salvar", {
    bandeira: state.bandeira,
    parcelas: state.parcelas,
    acao: props.acao,
    idItem: props.item.COD_BANDEIRA_CARTAO,
  });
}
</script>

<template>
  <v-card
    class="pa-6 ma-auto rounded-lg"
    width="500"
    height="250"
  >
    <v-title class="text-h4">{{ props.acao === "incluir" ? "Novo Cartão" : "Alterar Cartão" }}</v-title>

    <v-row class="d-flex align-center">
      <div class="input_valor">
        <label class="texto">Bandeira</label>
        <input
          id="inputBandeira"
          ref="bandeira"
          v-model="state.bandeira"
          :clearable="false"
          autofocus
        />
      </div>

      <div class="input_valor">
        <label class="texto">Parcelas</label>
        <input
          id="inputParcelas"
          type="number"
          ref="parcelas"
          v-model="state.parcelas"
          :clearable="false"
          autofocus
        />
      </div>

      <div class="container_botao">
        <v-btn
          type="submit"
          color="primary"
          @click="enviarDados"
          >Salvar</v-btn
        >
        <v-btn
          color="primary"
          class="mr-2"
          variant="outlined"
          @click="cancelar"
          >Cancelar</v-btn
        >
      </div>
    </v-row>
  </v-card>
</template>

<style scoped>
.container_botao {
  display: flex;
  flex-direction: row-reverse;
  width: 100%;
}
.input_valor input {
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(0, 0, 0, 0.42);
  border-radius: 4px;
  padding: 6px;
  font-size: 16px;
  transition: border-color 0.3s;
  margin-left: 10px;
}
.texto {
  margin-left: 10px;
}
</style>
