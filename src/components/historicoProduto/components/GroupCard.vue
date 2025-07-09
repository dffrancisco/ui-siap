<script lang="ts" setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps<{
  title: string;
  icon: string;
  bgCorTitulo: string;
  possuiDados: any;
  exibirVerMais: boolean;
  skeleton: boolean;
  produtoNaoEncontrado: string;
}>();

const emit = defineEmits(["verMais"]);
</script>

<template>
  <v-card
    :class="
      props.possuiDados > 0
        ? 'container_card_list bg-grey-lighten-4'
        : 'container_nao_encontrado bg-grey-lighten-4'
    "
  >
    <v-text
      class="titulo text-h6"
      :class="props.bgCorTitulo"
    >
      <i
        :class="props.icon"
        class="me-2"
      ></i>
      {{ props.title }}</v-text
    >
    <div v-if="props.skeleton">
      <v-skeleton-loader
        v-for="n in 3"
        :key="n"
        class="mx-2 my-4"
        width="200"
        height="110"
      />
    </div>
    <div
      v-else
      class="d-flex flex-column"
    >
      <div
        v-if="props.possuiDados > 0"
        class="d-flex flex-column ga-2 h-100"
      >
        <div
          class="scroll d-flex flex-column ga-3 pb-2"
          style="max-height: 400px; overflow-y: auto"
        >
          <slot></slot>
        </div>
      </div>
      <div
        class="container_botao px-4"
        v-if="props.exibirVerMais && props.possuiDados > 0"
      >
        <v-btn
          color="primary"
          primary
          @click="emit('verMais')"
          size="small"
          >ver mais
        </v-btn>
      </div>
      <div
        v-if="props.possuiDados == 0"
        class="d-flex justify-center align-center flex-column pt-5"
      >
        <v-text class="text-h6 text-center text-grey-darken-2">{{ props.produtoNaoEncontrado }} </v-text>
      </div>
    </div>
  </v-card>
</template>

<style scoped>
.container_card_list {
  width: 25%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.container_nao_encontrado {
  display: flex;
  flex-direction: column;
  width: 25%;
  height: 100%;
}
.titulo {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  height: 25px;
  width: 100%;
}
.container_botao {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.scroll {
  height: 100%;
  overflow: auto;
}
.scroll::-webkit-scrollbar {
  width: 7px;
  height: 20px;
  margin-top: 20px;
}
.scroll::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 10px;
  border: 2px solid #f1f1f1;
}
.scroll::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
