<script setup lang="ts">
const emit = defineEmits(["closeModalIncluirObs", "adicionarObs"]);
import { reactive } from "vue";

const stateModalIncluirObs = reactive({
  observacao: "",
});
</script>
<template
  ><div class="modal-container">
    <div class="modal-div-input mt-2">
      <v-textarea
        v-model="stateModalIncluirObs.observacao"
        label="Observação*"
        maxlength="200"
        rows="4"
        @keydown.enter.prevent="emit('adicionarObs', stateModalIncluirObs.observacao)"
      ></v-textarea>
    </div>

    <div>
      <v-row class="btns-modal">
        <v-btn
          title="Cancelar"
          class="btnCancelar"
          size="large"
          color="outline"
          @click="emit('closeModalIncluirObs')"
          >Cancelar</v-btn
        >
        <v-btn
          title="Adicionar Filtro"
          class="btnSalvar"
          color="primary"
          size="large"
          @click="emit('adicionarObs', stateModalIncluirObs.observacao)"
          >Salvar</v-btn
        >
      </v-row>
    </div>
  </div>
</template>
<style scoped>
.btns-modal {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 10px;
  margin-right: 30px;
}

.modal-container {
  background-color: #f2f2f2;
  border-radius: 6px;
  margin-bottom: 150px;
  margin-left: 25%;
  max-width: 520px;
  height: 220px;
  border: 2px solid rgba(0, 0, 0, 0.261);
}

.modal-div-input {
  padding: 20px;
}

.btnCancelar {
  background-color: transparent !important;
  border: 1px solid #2196f3;
  color: #2196f3 !important;
  transition: none !important;
}
</style>
