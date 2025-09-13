<script lang="ts" setup>
import { reactive } from "vue";

const emit = defineEmits(["login"]);

const state = reactive({
  password: "",
  loading: false,
});
</script>
<template>
  <v-app>
    <v-main
      class="d-flex justify-center align-center"
      style="height: 100vh"
    >
      <v-card
        class="pa-6"
        width="400"
      >
        <v-card-title class="justify-center text-center">
          <span style="font-size: 36px; font-weight: bold">CPD</span>
        </v-card-title>

        <v-card-text>
          <v-text-field
            v-model="state.password"
            label="Senha"
            type="password"
            variant="outlined"
            autofocus
            dense
            :loading="state.loading"
            @keyup.enter="emit('login', state.password)"
          />
        </v-card-text>

        <v-card-actions class="justify-center">
          <v-btn
            color="blue"
            @click="emit('login', state.password)"
            variant="elevated"
            :loading="state.loading"
          >
            Entrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-main>
  </v-app>
</template>
