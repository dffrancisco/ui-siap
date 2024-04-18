<script setup lang="ts">
import { reactive } from "vue";

const state = reactive({
  itens: [
    // {
    //   name: "teste",
    // },
  ],
});
</script>

<template>
  <v-card :class="state.itens.length <= 0 ? 'text-center' : ''">
    <span
      v-if="state.itens.length <= 0"
      class="text-span"
      >Sem registros de grupos...</span
    >
    <v-list
      lines="one"
      height="250"
    >
      <v-list-item
        v-for="(item, index) in state.itens"
        :key="item.name"
        :title="item.name"
        :class="index % 2 === 0 ? 'gray-bg' : 'white-bg'"
      >
        <template v-slot:append>
          <v-btn
            icon="mdi-pencil"
            variant="text"
            title="EDITAR"
          />
          <v-btn
            icon="mdi-delete"
            variant="text"
            title="DELETAR"
          />
        </template>
      </v-list-item>
    </v-list>
  </v-card>
  <div class="btns mt-3">
    <v-btn color="primary"> Cancelar </v-btn>
    <v-btn color="primary"> Novo Grupo </v-btn>
  </div>
</template>

<style scoped>
.gray-bg {
  background-color: #e0e0e0; /* Cinza claro mais escuro */
}

.white-bg {
  background-color: #f5f5f5; /* Branco mais escuro */
}

.btns {
  display: flex;
  justify-content: flex-end;
  gap: 4px;
}

.text-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.text-span {
  font-size: 16px;
  font-weight: bolder;
  color: #928e8e;
}
</style>
