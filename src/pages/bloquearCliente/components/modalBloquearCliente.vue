<script setup lang="ts">
import { reactive } from "vue";
import Swal from "sweetalert2";

import { iBloqueioClienteForm } from "../interfaces";

const state = reactive({
  dbBloquearCliente: <iBloqueioClienteForm>{},
});

const emit = defineEmits(["cancelar", "bloquearCliente"]);

function bloquearCliente() {
  if (!state.dbBloquearCliente.OBS) {
    Swal.fire({
      icon: "error",
      text: "Observação deve ser preenchido",
    });
    return
  }

  const bloqueioCliente = state.dbBloquearCliente;

  emit("bloquearCliente", bloqueioCliente);

  state.dbBloquearCliente.OBS = null;
}

function modalBloquearClienteClose() {
  emit("cancelar");
}
</script>

<template>
  <v-container class="pa-1">
    <title>Bloquear Cliente</title>
    <div>
      <v-row>
        <v-col>
          <textarea
            v-model="state.dbBloquearCliente.OBS"
            id="OBS"
            name="OBS"
            class="ss obr"
            rows="3"
            maxlength="200"
            style="text-transform: none"
          >
          </textarea>
        </v-col>
      </v-row>
      <div class="btnBloquearCliente">
        <v-btn
          class="mt-2"
          style="font-size: small"
          color="#3680AB"
          size="small"
          @click="modalBloquearClienteClose"
        >
          Cancelar
        </v-btn>
        <v-btn
          class="mt-2"
          style="font-size: small"
          color="#3680AB"
          size="small"
          @click="bloquearCliente"
        >
          Bloquear
        </v-btn>
      </div>
    </div>
  </v-container>
</template>

<style scoped>
.btnBloquearCliente {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid gray;
  margin-top: 7px;
}
</style>
