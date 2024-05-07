<script setup lang="ts">
import { iListaFotoProduto } from "../interfaces";

const props = defineProps({
  listaFotoProduto: {
    type: Array as () => iListaFotoProduto[],
    default: () => [],
  },
});

const emits = defineEmits(["fecharModal"]);

const actions = {
  urlFotoProduto(fotoProduto: string) {
    return `http://www.reallatas.com.br/balcao/foto/${fotoProduto}`;
  },

  fecharModal() {
    emits("fecharModal");
  },
};
</script>

<template>
  <v-card class="card-foto-produto">
    <div class="card-header px-6 py-6">
      <span class="title-modal"> Foto do Produto </span>
      <v-icon
        @click="actions.fecharModal"
        size="28"
        >mdi-close</v-icon
      >
    </div>
    <div class="card-img px-6 pb-6">
      <v-carousel
        :show-arrows="props.listaFotoProduto.length > 1 ? 'hover' : false"
        :hide-delimiters="props.listaFotoProduto.length > 1 ? false : true"
        height="380"
      >
        <v-carousel-item
          v-for="produto in props.listaFotoProduto"
          :src="actions.urlFotoProduto(produto.foto)"
        >
          <template v-slot:placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular
                color="grey-lighten-4"
                indeterminate
              ></v-progress-circular>
            </div>
          </template>
        </v-carousel-item>
      </v-carousel>
    </div>
  </v-card>
</template>

<style>
.v-window--show-arrows-on-hover .v-window__left {
  background-color: #2196f3 !important;
  color: #fff;
  width: 36px;
  height: 36px;
}

.v-window--show-arrows-on-hover .v-window__right {
  background-color: #2196f3 !important;
  color: #fff;
  width: 36px;
  height: 36px;
}

.v-carousel__controls {
  background: rgba(var(--v-theme-surface-variant), 0.6) !important;
}
</style>

<style scoped>
.card-foto-produto {
  background-color: var(--grey-900);
  color: var(--grey-100);
  height: 480px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-modal {
  font-size: 16px;
  font-weight: bold;
  color: var(--grey-100);
}
</style>
