<script setup lang="ts">
import { onMounted, reactive } from "vue";

const stateModalNovoFiltro = reactive({
  loading: false,
  nomeFiltro: "",
});

const emit = defineEmits(["closeModalNovoFiltro", "nomeFiltro"]);

const actions = {
  salvar() {
    emit("nomeFiltro", stateModalNovoFiltro.nomeFiltro);
    actions.cancelar();
  },

  cancelar() {
    stateModalNovoFiltro.nomeFiltro = "";
    emit("closeModalNovoFiltro");
  },
};

onMounted(() => {
  const inputNomeFiltro = document.querySelector("#nomeFiltro") as HTMLElement;
  if (inputNomeFiltro) {
    inputNomeFiltro.focus();
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
  height: 170px;
  border: 2px solid rgba(0, 0, 0, 0.261);
}

.modal-div-input {
  padding: 20px;
}
</style>
