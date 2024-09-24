<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref } from "vue";
import { iInsertProdutoParam, iProduto, iProdutoToEdit } from "../interfaces";
import utils from "@/ts/utils";
import Swal from "sweetalert2";

const props = defineProps({
  produto: {
    type: Object as () => iProduto,
    required: true,
  },
  produtoToEdit: {
    type: Object as () => iProdutoToEdit | null,
    default: null,
  },
});

const emits = defineEmits(["closeModal", "insertProduto"]);

const state = reactive({
  inputQtdPedida: null,
  inputValorUnitario: "0",
  dbProduto: <iProduto>{},
  inputValorUnitarioElement: <HTMLInputElement>null,
});

const actions = {
  async init() {
    state.inputValorUnitarioElement = document.getElementById("inputValorUnitario") as HTMLInputElement;

    console.log(state.inputValorUnitarioElement.focus());

    state.dbProduto = props.produto;

    if (props.produtoToEdit) {
      state.inputQtdPedida = props.produtoToEdit.QTD;
      state.inputValorUnitario = utils.formatValor(props.produtoToEdit.VALOR_UNITARIO);
      state.dbProduto = {
        DESC_PRODUTO: props.produtoToEdit.DESCRICAO,
        COD_PRODUTO: props.produtoToEdit.COD_PRODUTO,
      };
    }
  },

  async closeModal() {
    emits("closeModal");
  },

  async btnSave() {
    if (state.inputQtdPedida <= 0) {
      Swal.fire({
        icon: "warning",
        text: "A quantidade pedida deve ser maior que 0.",
      });
      return;
    }

    const valorUnitario = utils.formatValorUSA(state.inputValorUnitario);
    const total = utils.formatValorUSA(computeds.totalizador.value);

    if (valorUnitario <= 0) {
      Swal.fire({
        icon: "warning",
        text: "O valor unitário deve ser maior que 0.",
      });
      return;
    }

    let param: iInsertProdutoParam = {
      DESCRICAO: state.dbProduto.DESC_PRODUTO,
      QTD: state.inputQtdPedida,
      VALOR_UNITARIO: valorUnitario,
      TOTAL: total,
      COD_PRODUTO: state.dbProduto.COD_PRODUTO,
      ID_REQUISICAO_COMPRA: null,
    };

    emits("insertProduto", param);

    actions.closeModal();
  },
};

const computeds = {
  totalizador: computed(() => {
    let qtdPerdida = state.inputQtdPedida;
    let valorUnitario = utils.formatValorUSA(state.inputValorUnitario);

    return utils.formatValor(qtdPerdida * valorUnitario);
  }),
};

onMounted(async () => {
  actions.init();
});
</script>

<template>
  <v-card class="d-flex flex-grow-1 pa-4">
    <v-card-title v-if="props.produtoToEdit">Editar Quantidade</v-card-title>
    <v-card-title v-else>Informar Quantidade</v-card-title>

    <div class="mt-2">
      <v-row>
        <v-col>
          <v-text-field
            type="text"
            class="inputDisabled"
            label="Produto"
            v-model="state.dbProduto.DESC_PRODUTO"
            readonly
            :clearable="false"
          />
        </v-col>
      </v-row>
    </div>

    <div class="mt-4">
      <v-row>
        <v-col v-if="!props.produtoToEdit">
          <v-text-field
            type="text"
            class="inputDisabled"
            label="Qtd. Atual"
            readonly
            :clearable="false"
            v-model="state.dbProduto.QUANTIDADE"
        /></v-col>
        <v-col>
          <v-text-field
            type="text"
            label="Qtd. Pedida"
            autofocus
            :clearable="false"
            v-mask="'#'"
            maxlength="7"
            v-model="state.inputQtdPedida"
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
            v-model="state.inputValorUnitario"
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
