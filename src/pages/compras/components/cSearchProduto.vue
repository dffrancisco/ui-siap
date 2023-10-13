<script setup lang="ts"></script>

<template>
  <div class="mb-3">
    <v-row no-gutters>
      <v-col cols="2">
        <span>Nº Fabricante</span>
        <input type="text" class="ss sss" maxlength="20" autocomplete="off" />
      </v-col>
      <v-col cols="4">
        <span>Descrição Produto</span>
        <input type="text" class="ss sss" maxlength="20" autocomplete="off" />
      </v-col>
      <v-col cols="3">
        <span>Carro</span>
        <input type="text" class="ss sss" maxlength="20" autocomplete="off" />
      </v-col>
      <v-col cols="3">
        <span>Marca</span>
        <input type="text" class="ss" maxlength="20" autocomplete="off" />
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.sss {
  width: calc(100% - 5px);
}
</style>
