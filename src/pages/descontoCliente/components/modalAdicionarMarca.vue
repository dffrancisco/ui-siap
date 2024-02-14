<script setup lang="ts">
import { reactive } from "vue";
import { iMarca, iMarcaAdicionadaForm } from "../interfaces";
import Swal from "sweetalert2";
import moment from "moment";

const state = reactive({
  dbMarcaAdicionada: <iMarcaAdicionadaForm>{},

  configVMoney: {
    thousands: ".",
    decimal: ",",
    precision: 2,
    max: 100,
  },
});

const props = defineProps({
  marcas: {
    type: Object as () => iMarca,
    default: undefined,
  },
});

const emit = defineEmits(["cancelar", "adicionarMarca"]);

function onClickCancelar() {
  emit("cancelar");
}

async function adicionarMarca() {
  let dataHoje = moment();
  
  if (!state.dbMarcaAdicionada.DESCONTO) {
    Swal.fire({
      icon: "warning",
      text: "Informe um percentual entre 0 e 100.",
    });
    return;
  }

  if (state.dbMarcaAdicionada.DATA_FINAL) {
    if (!dataHoje.isBefore(state.dbMarcaAdicionada.DATA_FINAL)) {
      Swal.fire({
        icon: "warning",
        text: "A data final deve ser maior que a data de hoje!",
      });
      return;
    }
  }

  const marcaAdicionada = state.dbMarcaAdicionada;

  emit("adicionarMarca", marcaAdicionada);

  state.dbMarcaAdicionada.DESCONTO = null;
  state.dbMarcaAdicionada.DATA_INICIAL = null;
  state.dbMarcaAdicionada.DATA_FINAL = null;
}
</script>

<template>
  <v-container class="pa-1">
    <title>Adicionar Marca</title>
    <div>
      <v-row>
        <v-col cols="8">
          <span>Marca</span>
          <input
            type="text"
            v-model="props.marcas.DESCRICAO"
            name="DESCRICAO"
            id="DESCRICAO"
            class="obr ss"
            disabled="true"
          />
        </v-col>
        <v-col>
          <span>Desconto %</span>
          <input
            type="text"
            v-model="state.dbMarcaAdicionada.DESCONTO"
            name="DESCONTO"
            id="DESCONTO"
            class="obr ss"
            v-money3="state.configVMoney"
            style="text-align: end"
            maxlength="6"
          />
        </v-col>
      </v-row>
      <v-row class="mb-1 mt-1">
        <v-col>
          <span>Data Inicial (Opcional)</span>
          <input
            type="date"
            v-model="state.dbMarcaAdicionada.DATA_INICIAL"
            name="DATA_INICIAL"
            id="DATA_INICIAL"
            class="ss"
            placeholder="DD/MM/AAAA"
          />
        </v-col>
        <v-col>
          <span>Data Final (Opcional)</span>
          <input
            type="date"
            v-model="state.dbMarcaAdicionada.DATA_FINAL"
            name="DATA_FINAL"
            id="DATA_FINAL"
            class="ss"
            placeholder="DD/MM/AAAA"
          />
        </v-col>
      </v-row>
      <div class="btnMarcasAdicionadas">
        <v-btn
          class="mt-2"
          style="text-transform: none; font-size: small"
          color="#3680AB"
          size="small"
          @click="onClickCancelar"
        >
          Cancelar
        </v-btn>
        <v-btn
          class="mt-2"
          style="font-size: small"
          color="#3680AB"
          size="small"
          @click="adicionarMarca"
        >
          OK
        </v-btn>
      </div>
    </div>
  </v-container>
</template>

<style scoped>
.btnMarcasAdicionadas {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid gray;
}
</style>
