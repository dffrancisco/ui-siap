<script setup></script>

<template>
  <div class="w-100 d-flex ga-4">
    <v-row class="d-flex">
      <v-col class="d-flex ga-4">
        <v-select class="teste-0"> </v-select>
        <v-select> </v-select>
        <v-text-field class="teste-1"> </v-text-field>
      </v-col>
    </v-row>
  </div>

  <div class="w-100 d-flex d-flex ga-4">
    <v-row>
      <v-col class="d-flex justify-center align-center ga-4">
        <v-select class="teste-0"> </v-select>

        <v-text-field class="teste-2"> </v-text-field>

        <v-text-field class="teste-3"> </v-text-field>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.teste-0 {
  width: 12%;
}

.teste-1 {
  width: 19%;
}

.teste-2 {
  width: 1%;
}

.teste-3 {
  width: 30%;
}
</style>
