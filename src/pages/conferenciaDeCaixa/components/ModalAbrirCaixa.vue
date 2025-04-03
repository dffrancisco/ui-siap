<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { iFuncionarios } from "../interfaces";
import { configVMoney } from "../../../constants/constants";
import Swal from "sweetalert2";
import utils from "@/ts/utils";

const inputFuncionarios = ref();
const inputTroco = ref();

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

const actions = {
  abrirCaixa() {
    if (!state.funcionarioSelecionado) {
      Swal.fire({
        icon: "warning",
        text: "Selecione um funcionário antes de abrir o caixa!",
      });
      return;
    }

    if (utils.formatValorUSA(state.inputValor) == 0.0) {
      Swal.fire({
        icon: "warning",
        text: "Informe o valor do troco!",
      });
      return;
    }

    emit("dadosAbrirCaixa", state.funcionarioSelecionado, state.inputValor);
    actions.cancelar();
  },
  cancelar() {
    emit("closeModalAbrirCaixa");
    state.funcionarioSelecionado = null;
    state.inputValor = "";
  },
  focarNoInputTroco() {
    inputTroco.value.focus();
  },
};

onMounted(async () => {
  inputFuncionarios.value.focus();
});
</script>

<template>
  <v-card
    class="modal-container pa-4"
    :max-width="600"
  >
    <v-card-title>Selecione o funcionário que deseja abrir o caixa</v-card-title>
    <div>
      <v-row class="ml-1">
        <v-col cols="6">
          <v-autocomplete
            label="Funcionário"
            :items="props.funcionarios"
            item-title="LOGIN_COM_CODIGO"
            item-value="COD_FUNCIONARIO"
            ref="inputFuncionarios"
            class="mt-4 obr rounded-lg"
            v-model="state.funcionarioSelecionado"
            @keydown.enter="actions.focarNoInputTroco"
            :clearable="false"
          ></v-autocomplete>
        </v-col>

        <v-col cols="6">
          <div class="input_valor">
            <label>Valor do Troco</label>
            <input
              id="inputMeta"
              class="obr rounded-lg"
              ref="inputTroco"
              :clearable="false"
              v-model.lazy="state.inputValor"
              :model-modifiers="{ number: true }"
              v-money3="{ ...configVMoney, max: 1000000 }"
              autofocus
              @keydown.enter="actions.abrirCaixa()"
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
            @click="actions.cancelar"
            >Cancelar</v-btn
          >
          <v-btn
            title="Adicionar Filtro"
            class="btnSalvar"
            color="primary"
            size="large"
            @click="actions.abrirCaixa"
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
  transition: border-color 0.3s;
}

.btns-modal {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 20px;
  margin-right: 45px;
}

.btnCancelar {
  background-color: transparent !important;
  border: 1px solid #2196f3;
  color: #2196f3 !important;
  transition: none !important;
}

.modal-container {
  display: flex;
  border-radius: 8px !important;
  margin-bottom: 150px;
  margin-left: 15%;
  height: 220px;
  border: 2px solid rgba(0, 0, 0, 0.261);
}
</style>
