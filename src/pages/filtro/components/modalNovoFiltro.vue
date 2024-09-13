<script setup lang="ts">
import Swal from "sweetalert2";
import { nextTick, onMounted, reactive, watch } from "vue";
import serviceFiltro from "../services/filtro.service";
import { iFuncionario } from "../interfaces";

const stateModalNovoFiltro = reactive({
  loading: false,
  nomeFiltro: "",
  funcionarios: <iFuncionario[]>[],
  funcionarioSelecionado: null,
  idFiltro: null,
});

const emit = defineEmits(["closeModalNovoFiltro", "nomeFiltroEConferente"]);

const props = defineProps({
  filtroEditar: {
    type: Object,
    required: false,
  },
});

const actions = {
  salvar() {
    if (!stateModalNovoFiltro.nomeFiltro.trim()) {
      Swal.fire({
        icon: "warning",
        text: "Escolha um nome pro filtro!",
      });
      return;
    }
    emit(
      "nomeFiltroEConferente",
      stateModalNovoFiltro.idFiltro,
      stateModalNovoFiltro.funcionarioSelecionado,
      stateModalNovoFiltro.nomeFiltro
    );
    actions.cancelar();
  },

  cancelar() {
    stateModalNovoFiltro.nomeFiltro = "";
    emit("closeModalNovoFiltro");
  },

  async init() {
    try {
      stateModalNovoFiltro.loading = true;

      const funcionarios = await serviceFiltro.getFuncionarios();
      stateModalNovoFiltro.funcionarios = funcionarios;
    } finally {
      stateModalNovoFiltro.loading = false;
    }
  },
};

onMounted(() => {
  actions.init();
  const inputNomeFiltro = document.querySelector("#nomeFiltro") as HTMLElement;
  if (inputNomeFiltro) {
    inputNomeFiltro.focus();
  }
});

nextTick(() => {
  if (props.filtroEditar.length > 0) {
    const filtro = props.filtroEditar[0];
    stateModalNovoFiltro.nomeFiltro = filtro.NOME_FILTRO;
    stateModalNovoFiltro.funcionarioSelecionado = filtro.COD_FUNCIONARIO;
    stateModalNovoFiltro.idFiltro = filtro.ID_FILTRO;
  }
});
</script>
<template>
  <div class="modal-container">
    <div class="modal-div-input mt-2">
      <v-text-field
        id="nomeFiltro"
        label="Nome do Filtro"
        class="custom-placeholder"
        :clearable="false"
        v-model="stateModalNovoFiltro.nomeFiltro"
        @keypress.enter="actions.salvar"
        variant="outlined"
        bg-color="#ffffff"
      >
      </v-text-field>

      <v-autocomplete
        id="funcionarios"
        label="Funcionario Conferente"
        class="funcionarios pt-5"
        :items="stateModalNovoFiltro.funcionarios"
        item-title="LOGIN"
        item-value="COD_FUNCIONARIO"
        autocomplete="off"
        variant="outlined"
        :clearable="true"
        bg-color="#ffffff"
        v-model="stateModalNovoFiltro.funcionarioSelecionado"
      ></v-autocomplete>
    </div>

    <div>
      <v-row class="btns-modal">
        <v-btn
          title="Cancelar"
          class="btnCancelar"
          size="large"
          color="outline"
          @click="actions.cancelar"
          style="
            background-color: transparent !important;
            border: 1px solid #2196f3;
            color: #2196f3 !important;
            transition: none !important;
          "
          >Cancelar</v-btn
        >
        <v-btn
          title="Adicionar Filtro"
          class="btnSalvar"
          color="primary"
          size="large"
          @click="actions.salvar"
          >Salvar</v-btn
        >
      </v-row>
    </div>

    <v-overlay
      :model-value="stateModalNovoFiltro.loading"
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
</template>
<style scoped>
.btns-modal {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 10px;
  margin-right: 30px;
}

.load {
  justify-content: center;
  align-items: center;
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
</style>
