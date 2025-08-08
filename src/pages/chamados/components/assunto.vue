<script setup></script>

<template>
  <div class="w-100 d-flex ga-4 ma-2">
    <v-row class="d-flex">
      <v-col class="d-flex ga-4">
        <v-text-field
          class="input-gerente"
          label="GERENTE RÉSPONSAVEL"
          persistent-placeholder
        >
        </v-text-field>

        <v-select
          label="MOTIVO"
          persistent-placeholder
        >
        </v-select>

        <v-text-field
          class="input-complemento-motivo"
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
          class="input-vaga"
          label="VAGA"
          persistent-placeholder
        >
        </v-text-field>

        <v-text-field
          class="input-qtd"
          label="QTD"
          type="number"
          min="0"
          persistent-placeholder
        >
        </v-text-field>

        <v-text-field
          class="input-complemento-vaga"
          label="COMPLEMENTO VAGA"
          persistent-placeholder
        >
        </v-text-field>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.input-gerente {
  width: 12%;
}

.input-complemento-motivo {
  width: 19%;
}

.input-qtd {
  width: 1%;
}

.input-complemento-vaga {
  width: 35%;
}

.input-vaga {
  width: 17%;
}
</style>
