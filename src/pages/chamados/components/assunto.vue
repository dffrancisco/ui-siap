<script setup></script>

<template>
  <div class="w-100 d-flex ga-4">
    <v-row class="d-flex">
      <v-col class="d-flex ga-4">
        <v-text-field
          class="teste-0"
          label="GERENTE RÉSPONSAVEL"
          persistent-placeholder
        >
        </v-text-field>

        <v-select
          class=""
          label="MOTIVO"
          persistent-placeholder
        >
        </v-select>

        <v-text-field
          class="teste-1"
          label="COMPLEMENTO MOTIVO"
          persistent-placeholder
        >
        </v-text-field>
      </v-col>
    </v-row>
  </div>

  <div class="w-100 d-flex d-flex ga-4">
    <v-row>
      <v-col class="d-flex justify-center align-center ga-4">
        <v-text-field
          class="teste-0"
          label="VAGA"
          persistent-placeholder
        >
        </v-text-field>

        <v-text-field
          class="teste-2"
          label="QTD"
          persistent-placeholder
        >
        </v-text-field>

        <v-text-field
          class="teste-3"
          label="COMPLEMENTO VAGA"
          persistent-placeholder
        >
        </v-text-field>
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
