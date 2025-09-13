<script setup lang="ts">
import { onMounted } from "vue";
import ModalAbrirCartoes from "./components/modalAbrirCartoes.vue";
import { state, actions } from "./cartoes";

onMounted(() => {
  actions.init();
});
</script>

<template>
  <v-container>
    <v-card
      class="pa-5"
      style="width: 700px; margin: 0 auto"
    >
      <div>
        <v-card-actions class="container_botao">
          <v-btn
            variant="elevated"
            color="primary"
            @click="actions.onClickAdicionar"
            >NOVO (F1)</v-btn
          >
        </v-card-actions>
        <v-dialog
          v-model="state.modalCartaoOpened"
          max-width="480px"
          transition="dialog-transition"
        >
          <ModalAbrirCartoes
            :item="state.item"
            :acao="state.acao"
            @salvar="actions.handleSalvarCartao"
            @fechar="actions.closeModal"
          />
        </v-dialog>
        <v-data-table
          height="350px"
          :headers="state.headers"
          :items="state.cartoes"
        >
          <template v-slot:item.inf="{ item }">
            <v-icon
              @click="actions.onClickAlterar(item)"
              size="large"
            >
              mdi-pencil
            </v-icon>
          </template>
        </v-data-table>
      </div>
    </v-card>
  </v-container>
</template>

<style scope>
.container_botao {
  display: flex;
  flex-direction: row-reverse;
  margin-right: 15px;
  margin-bottom: 10px;
}
</style>
