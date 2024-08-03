<script lang="ts" setup>
import { iItemComErro } from "../interfaces";

const props = defineProps({
  itensComErro: {
    type: Array as () => iItemComErro[],
    required: true,
  },
});

const emits = defineEmits(["fecharModal", "tentarInserirItemNovamente"]);

const actions = {
  closeModal() {
    emits("fecharModal");
  },

  tentarInserirItemNovamente(codProduto: number) {
    emits("tentarInserirItemNovamente", codProduto);
  },
};
</script>

<template>
  <v-card class="card-container">
    <div class="card-header px-6 pt-4">
      <span class="title-modal"> Itens Erro </span>
      <v-icon
        @click="actions.closeModal"
        size="28"
        >mdi-close</v-icon
      >
    </div>
    <div class="pa-5 d-flex flex-column ga-4">
      <div
        class="d-flex align-center ga-4"
        v-for="item in itensComErro"
      >
        <v-card
          color="#991b1b"
          class="d-flex flex-grow-1 flex-column"
        >
          <v-card-title> {{ item.NUM_FABRICANTE }} - {{ item.DESC_PRODUTO }}</v-card-title>
          <v-card-text
            ><strong>Erro ao {{ item.ACAO == "ADD" ? "adicionar" : "remover" }} o item:</strong>
            {{ item.ERRO_MSG }}
          </v-card-text>
        </v-card>
        <div>
          <v-btn
            size="26"
            color="#0077e4"
            icon="mdi-refresh"
            title="Tentar novamente"
            @click="actions.tentarInserirItemNovamente(item.COD_PRODUTO)"
          />
        </div>
      </div>
    </div>
  </v-card>
</template>

<style scoped>
.card-container {
  background-color: var(--grey-900);
  color: var(--grey-100);
  height: 450px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-modal {
  font-size: 16px;
  color: var(--grey-100);
  font-weight: bold;
}
</style>
