<script setup lang="ts">
import { computed, onMounted, reactive } from "vue";
import { iInsertItemNovoParam, iItemNovo, iItemNovoToEdit, iUpdateItemNovoParam } from "../interfaces";
import utils from "@/ts/utils";
import Swal from "sweetalert2";

const props = defineProps({
  itemNovoToEdit: {
    type: Object as () => iItemNovoToEdit | null,
    default: null,
  },
});

const emits = defineEmits(["closeModal", "insertItemNovo", "updateItemNovo"]);

const state = reactive({
  dbItemNovo: <iItemNovo>{
    DESCRICAO: "",
    VALOR_UNITARIO: "0",
    QTD: 0,
  },

  inputValorUnitarioElement: <HTMLInputElement>null,
  inputQtdPedidaElement: <HTMLInputElement>null,
});

const actions = {
  async init() {
    state.inputValorUnitarioElement = document.getElementById("inputValorUnitario") as HTMLInputElement;
    state.inputQtdPedidaElement = document.getElementById("inputQtdPedida") as HTMLInputElement;

    if (props.itemNovoToEdit) {
      state.dbItemNovo = {
        DESCRICAO: props.itemNovoToEdit.DESCRICAO,
        VALOR_UNITARIO: utils.formatValor(props.itemNovoToEdit.VALOR_UNITARIO),
        QTD: props.itemNovoToEdit.QTD,
      };
    }
  },

  async closeModal() {
    emits("closeModal");
  },

  async btnSave() {
    if (utils.validaOBR()) {
      return false;
    }

    if (state.dbItemNovo.QTD <= 0) {
      Swal.fire({
        icon: "warning",
        text: "A quantidade pedida deve ser maior que 0.",
      });
      return;
    }

    const valorUnitario = utils.formatValorUSA(state.dbItemNovo.VALOR_UNITARIO);
    const total = utils.formatValorUSA(computeds.totalizador.value);

    if (valorUnitario <= 0) {
      Swal.fire({
        icon: "warning",
        text: "O valor unitário deve ser maior que 0.",
      });
      return;
    }

    if (props.itemNovoToEdit.ID_REQUISICAO_COMPRA_ITEM) {
      const param: iUpdateItemNovoParam = {
        ID_REQUISICAO_COMPRA_ITEM: props.itemNovoToEdit.ID_REQUISICAO_COMPRA_ITEM,
        DESCRICAO: state.dbItemNovo.DESCRICAO,
        VALOR_UNITARIO: valorUnitario,
        QTD: state.dbItemNovo.QTD,
        TOTAL: total,
      };

      emits("updateItemNovo", param);
    } else {
      const param: iInsertItemNovoParam = {
        DESCRICAO: state.dbItemNovo.DESCRICAO,
        VALOR_UNITARIO: valorUnitario,
        QTD: state.dbItemNovo.QTD,
        TOTAL: total,
      };

      emits("insertItemNovo", param);
    }

    actions.closeModal();
  },
};

const computeds = {
  totalizador: computed(() => {
    let qtdPerdida = state.dbItemNovo.QTD;
    let valorUnitario = utils.formatValorUSA(state.dbItemNovo.VALOR_UNITARIO);

    return utils.formatValor(qtdPerdida * valorUnitario);
  }),
};

onMounted(async () => {
  actions.init();
});
</script>

<template>
  <v-card class="d-flex flex-grow-1 pa-4">
    <v-card-title v-if="props.itemNovoToEdit?.ID_REQUISICAO_COMPRA_ITEM">Editar Item Novo</v-card-title>
    <v-card-title v-else>Inserir Item Novo</v-card-title>

    <div class="mt-2">
      <v-row>
        <v-col>
          <title>Descrição</title>
          <v-text-field
            type="text"
            class="obr rounded"
            label="Descrição"
            maxlength="80"
            autofocus
            v-model="state.dbItemNovo.DESCRICAO"
            @keydown.enter="state.inputQtdPedidaElement.select()"
          />
        </v-col>
      </v-row>
    </div>

    <div class="mt-4">
      <v-row>
        <v-col>
          <v-text-field
            type="text"
            label="Qtd. Pedida"
            :clearable="false"
            v-mask="'#'"
            maxlength="7"
            id="inputQtdPedida"
            v-model="state.dbItemNovo.QTD"
            @keydown.enter="state.inputValorUnitarioElement.select()"
        /></v-col>
        <v-col>
          <v-text-field
            type="text"
            id="inputValorUnitario"
            v-mask-decimal.br="2"
            label="Valor Unitário"
            :clearable="false"
            maxlength="10"
            v-model="state.dbItemNovo.VALOR_UNITARIO"
            @keydown.enter="actions.btnSave"
        /></v-col>
        <v-col>
          <v-text-field
            type="text"
            v-model="computeds.totalizador.value"
            class="inputDisabled"
            label="Total"
            readonly
            :clearable="false"
        /></v-col>
      </v-row>
    </div>

    <div class="d-flex justify-end ga-4 mt-6">
      <v-btn
        variant="outlined"
        color="primary"
        @click="actions.closeModal"
      >
        cancelar
      </v-btn>
      <v-btn
        color="primary"
        @click="actions.btnSave"
      >
        salvar
      </v-btn>
    </div>
  </v-card>
</template>

<style scoped>
.inputDisabled {
  background-color: #e2e8f0;
}
</style>
