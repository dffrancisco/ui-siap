<template>
  <v-container>
    <v-card
      width="800"
      height="550"
      class="ma-auto pa-4 d-flex flex-column"
    >
      <div>
        <v-row class="align-start">
          <v-col cols="3">
            <v-text-field
              type="date"
              label="Data limite"
              :hide-spin-buttons="true"
              :clearable="false"
              density="compact"
            />
          </v-col>
          <v-col class="d-flex ga-4">
            <v-text-field
              type="text"
              class=""
              value="aaaaaa"
              label="Cliente"
              density="compact"
              disabled
            />
            <div class="d-flex align-center">
              <v-btn
                icon="mdi-magnify"
                size="34"
                color="primary"
              />
            </div>
          </v-col>
        </v-row>
      </div>

      <div
        class="mt-4 d-flex"
        style="height: 380px"
      >
        <v-row>
          <v-col
            cols="9"
            class="d-flex"
          >
            <div class="border rounded-lg d-flex flex-grow-1">
              <v-card-title>grid</v-card-title>
            </div>
          </v-col>
          <v-col class="d-flex">
            <div class="border rounded-lg d-flex flex-grow-1">
              <v-card-title>localizar orc</v-card-title>
            </div>
          </v-col>
        </v-row>
      </div>

      <div class="d-flex mt-4 flex-grow-1">
        <v-row>
          <v-col
            cols="9"
            class="d-flex flex-grow-1"
          >
            <div class="border rounded-lg d-flex flex-grow-1">
              <v-card-title>Dados orc</v-card-title>
            </div>
          </v-col>
          <v-col class="d-flex align-end">
            <div class="d-flex flex-grow-1">
              <v-text-field
                label="Localizar"
                density="compact"
              />
            </div>
          </v-col>
        </v-row>
      </div>
    </v-card>
    <div id="pnCodigoTela">faturarCliente</div>
  </v-container>
</template>
