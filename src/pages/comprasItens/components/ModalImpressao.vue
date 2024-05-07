<template>
  <v-card class="card-container">
    <div class="card-header px-6 pt-4">
      <span class="title-modal"> Imprimir </span>
      <v-icon size="28">mdi-close</v-icon>
    </div>
    <div class="card-body px-6 pb-6 d-flex ga-5 flex-column">
      <v-radio-group
        inline
        class="d-flex justify-center"
      >
        <div class="radio mr-2">
          <v-radio
            value="one"
            color="primary"
          ></v-radio>
          <span>Produto</span>
        </div>
        <div class="radio ml-2">
          <v-radio
            value="two"
            color="primary"
          ></v-radio>
          <span>Cotação</span>
        </div>
      </v-radio-group>
      <div>
        <span class="title-transportadora">Transportadora</span>
        <v-autocomplete
          bg-color="#3B4758"
          variant="solo"
          density="comfortable"
          placeholder="Informe uma transportadora"
        >
        </v-autocomplete>
      </div>
      <div class="pt-4 d-flex justify-center ga-2">
        <v-btn
          height="40"
          color="primary"
          ><v-icon class="mr-1">mdi-magnify</v-icon>visualizar</v-btn
        >
        <v-btn
          height="40"
          color="success"
          ><v-icon class="mr-1">mdi-printer</v-icon>imprimir</v-btn
        >
      </div>
    </div>
  </v-card>
</template>

<style scoped>
.card-container {
  background-color: var(--grey-900);
  color: var(--grey-100);
  height: 274px;
}

.title-modal {
  font-size: 16px;
  color: var(--grey-100);
  font-weight: bold;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.radio {
  display: flex;
  align-items: center;
}

.title-transportadora {
  font-size: 12px;
  color: var(--grey-100);
  font-weight: 600;
}
</style>
