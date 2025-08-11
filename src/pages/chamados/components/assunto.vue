<script setup>
import { reactive, watch } from "vue";
let model = defineModel({
  default: () => ({
    gerente: "",
    motivo: "",
    complementoMotivo: "",
    vaga: "",
    qtd: 0,
    complementoVaga: "",
  }),
});

const state = reactive({
  gerente: "",
  motivo: "",
  complementoMotivo: "",
  vaga: "",
  qtd: 0,
  complementoVaga: "",
});
</script>

<template>
  <div class="w-100 d-flex ga-4 ma-2">
    <v-row class="d-flex">
      <v-col class="d-flex ga-4">
        <v-text-field
          v-model="model.gerente"
          class="input-gerente"
          label="GERENTE RÉSPONSAVEL"
          persistent-placeholder
        >
        </v-text-field>

        <v-select
          v-model="model.motivo"
          class="input-motivo"
          :items="[
            { text: 'Substituição/Desligamento', value: 'SUBSTITUICAO-DESLIGAMENTO' },
            { text: 'Nova vaga', value: 'NOVA-VAGA' },
            { text: 'Substituição/ Ida CRR', value: 'SUBSTITUICAO-IDA-CRR' },
            { text: 'Outro, especifique', value: 'OUTRO-ESPECIFIQUE' },
          ]"
          persistent-placeholder
          item-title="text"
          item-value="value"
          label="MOTIVO"
        >
        </v-select>
        <v-text-field
          v-model="model.complementoMotivo"
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
          v-model="model.vaga"
          class="input-vaga"
          label="VAGA"
          persistent-placeholder
        >
        </v-text-field>

        <v-text-field
          v-model="model.qtd"
          class="input-qtd"
          label="QTD"
          type="number"
          min="0"
          persistent-placeholder
        >
        </v-text-field>

        <v-text-field
          v-model="model.complementoVaga"
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
  width: 16%;
}

.input-complemento-motivo {
  width: 17%;
}

.input-qtd {
  width: 1%;
}

.input-motivo {
  width: 15%;
}

.input-complemento-vaga {
  width: 40%;
}

.input-vaga {
  width: 21%;
}
</style>
