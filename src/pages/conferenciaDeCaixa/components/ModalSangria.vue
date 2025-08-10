<script setup lang="ts">
import { configVMoney } from "../../../constants/constants";
import { onMounted, reactive, ref } from "vue";
import { iCaixas } from "../interfaces";
import Swal from "sweetalert2";
import utils from "@/ts/utils";

const valorSangria = ref();

const emit = defineEmits(["closeModalSangria", "efetuarSangria"]);

const props = defineProps<{
  caixaSelecionado: iCaixas;
  modalOpened: boolean;
}>();

const actions = {
  cancelar() {
    emit("closeModalSangria");
    state.valorSangria = "";
  },

  async salvarSangria() {
    if (utils.formatValorUSA(state.valorSangria) == 0) {
      Swal.fire({
        icon: "warning",
        text: "O valor da sangria não pode ser 0,00",
      });
      return;
    }

    emit("efetuarSangria", state.valorSangria, props.caixaSelecionado);
  },
};

const state = reactive({
  valorSangria: "",
});

onMounted(() => {
  setTimeout(() => {
    valorSangria.value?.focus();
  }, 300);
});
</script>

<template>
  <v-card class="modal-container">
    <v-card-title class="modal-title"> Sangria de Caixa </v-card-title>

    <v-card-text>
      <div class="input-group">
        <label class="input-label">Recebido de: {{ props.caixaSelecionado.LOGIN }}</label>
      </div>

      <div class="input-group">
        <label class="input-label">Valor da Sangria:</label>
        <input
          id="valorSangria"
          ref="valorSangria"
          class="input-field"
          v-model.lazy="state.valorSangria"
          :model-modifiers="{ number: true }"
          v-money3="{ ...configVMoney, max: 1000000 }"
          autofocus
          @keydown.enter.prevent="actions.salvarSangria()"
        />
      </div>
    </v-card-text>
    <v-row class="btns-modal">
      <v-btn
        title="Cancelar"
        class="btnCancelar"
        size="large"
        density="compact"
        color="outline"
        @click="actions.cancelar"
        >Cancelar</v-btn
      >
      <v-btn
        title="Adicionar Filtro"
        class="btnSalvar"
        color="primary"
        density="compact"
        size="large"
        @click="actions.salvarSangria()"
        >Salvar</v-btn
      >
    </v-row>
  </v-card>
</template>

<style scoped>
.modal-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 420px;
  background: white;
  margin-left: 20%;
  margin-bottom: 150px;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  padding: 20px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  text-align: center;
}

.modal-title {
  font-size: 18px;
  font-weight: bold;
  color: #444;
  text-align: center;
  margin-bottom: 15px;
}

.input-group {
  margin-bottom: 15px;
  text-align: left;
}

.input-label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 5px;
}

.input-field {
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.input-field:focus {
  border-color: #1976d2;
  outline: none;
}

.btns-modal {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-right: 10px;
  padding-bottom: 10px;
}

.btnCancelar {
  background-color: transparent !important;
  border: 1px solid #2196f3;
  color: #2196f3 !important;
  transition: none !important;
}
</style>
