<script setup lang="ts"></script>

<template>
  <v-container>
    <v-card
      :width="800"
      :height="550"
      class="ma-auto pa-4"
    >
      <div
        ><v-row>
          <v-col cols="3">
            <v-text-field
              label="Data Início"
              type="date"
            >
            </v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field
              label="Data Fim"
              type="date"
            >
            </v-text-field>
          </v-col>
          <v-col class="d-flex flex-row align-center ga-2">
            <v-text-field
              label="Cliente (F1)"
              readonly
            ></v-text-field>
            <v-btn
              icon="mdi-magnify mdi-24px"
              color="primary"
              size="36"
            ></v-btn>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </v-container>
</template>
