<script setup lang="ts">
import utils from "@/ts/utils";
</script>

<template>
  <v-card class="detalhes-caixa">
    <h2>Cód.Devolução</h2>
    <div class="d-flex ga-5">
      <v-text-field class="input-field" variant="solo"></v-text-field>
      <v-btn @click="" icon="mdi-magnify" density="comfortable" class="bg-blue small" size="38">
      </v-btn>
    </div>
    <h3>Dados da Devolução</h3>

    <section class="d-flex justify-space-between ">

      <div class="d-flex flex-column ga-1 ">
        <p> Devolução: <span class="font-weight-bold"> {{ "525" }}</span></p>
        <p> Valor: <span class="font-weight-bold"> {{ "20000" }}</span></p>
        <p>Tipo de Pagamento: <span class="font-weight-bold">{{ "Cartão" }}</span></p>
        <p>Nº Orçamento: <span class="font-weight-bold"> {{ "1234" }} </span> </p>
      </div>

      <div class="d-flex flex-column ga-1 ">
        <p> Data da Devolução: <span class="font-weight-bold"> {{ "25/08/2025" }}</span> </p>
        <p> Data Orçamento: <span class="font-weight-bold"> {{ "25/08/2025" }}</span> </p>
        <p> Op.de Caixa: <span class="font-weight-bold"> {{ "Fulana" }}</span> </p>
      </div>

    </section>

    <div class="d-flex justify-end ga-5">
      <v-btn class="bg-red "> cancelar </v-btn>
      <v-btn class="bg-blue"> salvar</v-btn>
    </div>
  </v-card>
</template>

<style scoped>
.detalhes-caixa {
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  gap: 20px;
  padding: 13px;
  background-color: white;
}

.input-field {
  max-width: 40%;

}
</style>
