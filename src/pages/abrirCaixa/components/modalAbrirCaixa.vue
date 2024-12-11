<script setup lang="ts">
import { reactive } from "vue";
import { iFuncionarios } from "../interfaces";
import { configVMoney } from "../../../constants/constants";
import Swal from "sweetalert2";

const props = defineProps<{
  funcionarios: iFuncionarios[];
  modalOpened: boolean;
}>();

const emit = defineEmits(["dadosAbrirCaixa", "closeModalAbrirCaixa"]);

const state = reactive({
  loading: false,
  funcionarioSelecionado: null as iFuncionarios | null,
  inputValor: "",
});

const abrirCaixa = () => {
  if (!state.funcionarioSelecionado) {
    Swal.fire({
      icon: "warning",
      text: "Selecione um funcionário antes de abrir o caixa!",
    });
    return;
  }
  console.log("Abrindo caixa para:", state.funcionarioSelecionado);
  // Lógica para abrir o caixa usando state.funcionarioSelecionado
};

const cancelar = () => {
  emit("closeModalAbrirCaixa");
  state.funcionarioSelecionado = null;
  state.inputValor = "";
};
</script>

<template>
  <v-card
    class="modal-container pa-4"
    :max-width="800"
  >
    <v-card-title>Selecione o funcionário que deseja abrir o caixa</v-card-title>
    <div>
      <v-row class="ml-1">
        <v-col cols="6">
          <v-autocomplete
            label="Funcionário"
            :items="props.funcionarios"
            item-title="LOGIN"
            item-value="COD_FUNCIONARIO"
            class="mt-4 obr rounded-lg"
            v-model="state.funcionarioSelecionado"
          ></v-autocomplete>
        </v-col>

        <v-col cols="6">
          <div class="input_valor">
            <label>Valor do Troco</label>
            <input
              id="inputMeta"
              class="obr rounded-lg"
              :clearable="false"
              v-model.lazy="state.inputValor"
              :model-modifiers="{ number: true }"
              v-money3="{ ...configVMoney, max: 1000000 }"
              autofocus
              @keydown.enter="abrirCaixa()"
            />
          </div>
        </v-col>
      </v-row>
      <div>
        <v-row class="btns-modal">
          <v-btn
            title="Cancelar"
            class="btnCancelar"
            size="large"
            color="outline"
            @click="cancelar"
            >Cancelar</v-btn
          >
          <v-btn
            title="Adicionar Filtro"
            class="btnSalvar"
            color="primary"
            size="large"
            @click="abrirCaixa"
            >Salvar</v-btn
          >
        </v-row>
      </div>

      <v-overlay
        :model-value="state.loading"
        class="load"
        persistent
      >
        <v-progress-circular
          color="primary"
          indeterminate
          size="64"
        ></v-progress-circular>
      </v-overlay>
    </div>
  </v-card>
</template>

<style scoped>
.input_valor input {
  border: 1px solid rgba(0, 0, 0, 0.42);
  border-radius: 4px;
  padding: 6px;
  font-size: 16px;
  /* width: 250px; */
  transition: border-color 0.3s;
}

.btns-modal {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 20px;
  margin-right: 50px;
}

.btnCancelar {
  background-color: transparent !important;
  border: 1px solid #2196f3;
  color: #2196f3 !important;
  transition: none !important;
}

.modal-container {
  background-color: #f2f2f2;
  border-radius: 8px !important;
  margin-bottom: 150px;
  margin-left: 25%;
  /* max-width: 520px; */
  height: 220px;
  border: 2px solid rgba(0, 0, 0, 0.261);
}
</style>
