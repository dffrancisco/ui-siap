<script setup lang="ts">
import { onMounted, reactive } from "vue";

const emit = defineEmits(["salvar", "fechar"]);
const props = defineProps<{
  acao: string;
  endEstoque: string;
  endExcessao: string;
  quantidade: number;
}>();

const state = reactive({
  endEstoque: props.endEstoque,
  endExcessao: props.endExcessao,
  quantidade: props.quantidade,
});

onMounted(() => {
  if (props.acao === "endEstoque") {
    props.endEstoque;
    props.endExcessao;
  } else {
    props.quantidade;
  }
});

function enviarDados() {
  emit("salvar", {
    endEstoque: props.endEstoque,
    endExcessao: props.endExcessao,
    quantidade: props.quantidade,
    acao: props.acao,
  });
}
</script>
<template>
  <v-card
    class="pa-6 ma-auto rounded-lg"
    width="500"
    height="180"
  >
    <v-title class="text-h5">Alterar quantidade</v-title>

    <v-row class="d-flex align-center">
      <div
        v-if="props.acao === 'endEstoque'"
        class="container_input d-flex"
      >
        <v-col cols="3">
          <label>End estoque</label>
          <input
            type="text"
            class="obr ss"
            name="endEstoque"
            maxlength="20"
            v-model="state.endEstoque"
          />
        </v-col>
        <v-col cols="3">
          <label>End Excessão</label>
          <input
            type="text"
            class="obr ss"
            name="endExcessao"
            maxlength="20"
            v-model="state.endExcessao"
          />
        </v-col>
      </div>
      <div
        class="container_input"
        v-else
      >
        <v-col cols="3">
          <label>Quantidade</label>
          <input
            type="number"
            class="obr ss"
            id="DESCRICAO"
            name="DESCRICAO"
            maxlength="20"
            v-model="state.quantidade"
          />
        </v-col>
      </div>
      <div class="container_botao">
        <v-btn
          type="submit"
          color="primary"
          @click="enviarDados"
          >Salvar</v-btn
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
.container_input {
  width: 100%;
}
</style>
