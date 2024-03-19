<template>
  <v-container>
    <v-card
      class="pa-5"
      style="width: 850px; margin: 0 auto"
    >
      <div class="pb-3 d-flex flex-row justify-end">
        <div class="inputData mr-3">
          <span>Data Inicial</span>
          <input
            type="date"
            class="ss"
            style="width: 128px"
          />
        </div>
        <div class="inputData mr-1">
          <span>Data Final</span>
          <input
            type="date"
            class="ss"
            style="width: 128px"
          />
        </div>

        <v-btn
          color="primary"
          icon="mdi-magnify"
          size="36px"
          class="mt-3 ml-1"
        />
      </div>
      <div
        class="ss"
        style="height: 450px"
      >
      </div>

      <div class="d-flex justify-end pt-2">
        <v-btn color="primary">
          <v-icon
            size="20px"
            class="mr-2"
            >mdi-printer</v-icon
          >
          Imprimir
        </v-btn>
      </div>
    </v-card>
    <div id="pnCodigoTela">CONSULTA_MONTAGEM</div>
  </v-container>
</template>

<style scoped>
.inputData {
  display: flex;
  flex-direction: column;
}
</style>
