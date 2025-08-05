<script setup lang="ts">
const items = ["Foo", "Bar", "Fizz", "Buzz"];
</script>
<template>
  <div class="d-flex">
    <v-text-field
      class="pesquisa"
      append-inner-icon="mdi-magnify"
      label="Buscar pot códigos, descrição ou solicitante..."
      hide-details
      single-line
    ></v-text-field>
    <v-select
      class="selecionar"
      :items="items"
      density="compact"
      label="todos os Status"
    ></v-select>
  </div>
</template>
<style scoped></style>
