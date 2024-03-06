<script setup lang="ts">
import { computed, nextTick, reactive } from "vue";
import { iCompra, iMarca } from "../interfaces";

const props = defineProps({
  marcas: {
    type: Array as () => iMarca[],
    required: true,
  },
  compraAlterar: {
    type: Object as () => iCompra,
    default: () => {},
  },
});

const emit = defineEmits(["closeModal", "insertPedido", "updatePedido"]);

const FORMA_PGTO_FATURADO = 1;
const FORMA_PGTO_AVISTA = 2;
const FORMA_PGTO_AVISTA_ANTECIPADO = 3;

const state = reactive({
  edtMarca: undefined,
  edtFormaPagamento: undefined,
  edtPercentualDesconto: undefined,
  edtQtdParcelas: undefined,
  edtQtdDiasPagar: undefined,
  edtQtdDiasFaturar: undefined,
  edtDataPagamento: undefined,
  edtObservacao: "",
  edtAcrescentarDescontoNF: false,
  formasDePagamento: [
    { title: "Faturado", value: FORMA_PGTO_FATURADO },
    { title: "Á vista", value: FORMA_PGTO_AVISTA },
    { title: "Á vista (antecipado)", value: FORMA_PGTO_AVISTA_ANTECIPADO },
  ],
});

const actions = {
  onClickCancelar: () => {
    emit("closeModal");
  },

  onClickSalvarPedido: () => {
    let dados = {};

    if (props.compraAlterar.ID_COMPRAS) {
      emit("updatePedido");
    } else {
      emit("insertPedido");
    }
  },
};

const itemsProps = () => {
  return {
    variant: "tonal",
  };
};

const exibirPercentualDesconto = computed(() => {
  return [FORMA_PGTO_AVISTA, FORMA_PGTO_AVISTA_ANTECIPADO].includes(state.edtFormaPagamento) ? true : false;
});

const exibirQtdParcelas = computed(() => {
  return state.edtFormaPagamento == FORMA_PGTO_FATURADO ? true : false;
});

const exibirDiasParaPagar = computed(() => {
  return state.edtFormaPagamento == FORMA_PGTO_AVISTA ? true : false;
});

const exibirDiasParaFaturar = computed(() => {
  return [FORMA_PGTO_FATURADO, FORMA_PGTO_AVISTA].includes(state.edtFormaPagamento) ? true : false;
});

const exibirDataPagamento = computed(() => {
  return state.edtFormaPagamento == FORMA_PGTO_AVISTA_ANTECIPADO ? true : false;
});

nextTick(() => {
  //@ts-ignore
  document.querySelector("#edtMarca").focus();
});
</script>

<template>
  <v-card class="novo-pedido">
    <v-card-title> Novo Pedido </v-card-title>
    <v-card-text>
      <label for="edtMarca">Marca</label>
      <v-autocomplete
        id="edtMarca"
        variant="outlined"
        :density="'compact'"
        :items="props.marcas"
        item-title="DESCRICAO"
        item-value="ID_MARCA"
        :item-props="itemsProps"
        bg-color="#3b4758"
        v-model="state.edtMarca"
      ></v-autocomplete>

      <label for="edtFormaPagamento">Forma de Pagamento</label>
      <v-select
        id="edtFormaPagamento"
        variant="outlined"
        density="compact"
        :items="state.formasDePagamento"
        item-color="primary"
        :item-props="itemsProps"
        bg-color="#3b4758"
        v-model="state.edtFormaPagamento"
      ></v-select>

      <div
        v-if="state.edtFormaPagamento"
        class="novo-pedido__campos-faturado"
      >
        <div
          v-if="exibirPercentualDesconto"
          class="novo-pedido__percentual-desconto"
        >
          <label>% Desconto</label>
          <v-text-field
            variant="outlined"
            density="compact"
            bg-color="#3b4758"
            v-model="state.edtPercentualDesconto"
          ></v-text-field>
        </div>

        <div v-if="exibirQtdParcelas">
          <label>Qtd. Parcelas</label>
          <v-text-field
            type="number"
            variant="outlined"
            density="compact"
            bg-color="#3b4758"
            v-model="state.edtQtdParcelas"
          ></v-text-field>
        </div>

        <div v-if="exibirDiasParaPagar">
          <label>Dias p/ pagar</label>
          <v-text-field
            type="number"
            variant="outlined"
            density="compact"
            bg-color="#3b4758"
            v-model="state.edtQtdDiasPagar"
          ></v-text-field>
        </div>

        <div v-if="exibirDiasParaFaturar">
          <label>Dias p/ faturar</label>
          <v-text-field
            type="number"
            variant="outlined"
            density="compact"
            bg-color="#3b4758"
            v-model="state.edtQtdDiasFaturar"
          ></v-text-field>
        </div>

        <div v-if="exibirDataPagamento">
          <label>Data do Pagamento</label>
          <v-text-field
            type="date"
            variant="outlined"
            density="compact"
            bg-color="#3b4758"
            v-model="state.edtDataPagamento"
          ></v-text-field>
        </div>
      </div>

      <label for="edtObservacao">Observação</label>
      <VTextarea
        id="edtObservacao"
        rows="2"
        hide-details
        density="compact"
        bg-color="#3b4758"
        variant="outlined"
      />

      <VCheckbox
        v-if="exibirPercentualDesconto"
        label="Acrescentar desconto no custo na entrada de NF"
        density="compact"
        class="mt-2"
        hide-details
      />
    </v-card-text>
    <div class="d-flex justify-end px-2 my-2">
      <v-btn
        variant="outlined"
        class="mr-2 btn-primary--outlined"
        @click="actions.onClickCancelar"
        >CANCELAR</v-btn
      >
      <v-btn
        variant="elevated"
        class="btn-primary px-6"
        @click="actions.onClickSalvarPedido"
        >SALVAR</v-btn
      >
    </div>
  </v-card>
</template>

<style lang="scss">
.novo-pedido {
  background-color: var(--grey-900);
  color: var(--grey-100);
  height: 512px;
}

.novo-pedido__campos-faturado {
  display: flex;
  gap: 8px;
}

.novo-pedido__percentual-desconto {
  width: 120px;
}

.btn-primary {
  border: 1px solid var(--primary-700);
  background-color: var(--primary-700);
  color: var(--grey-100);
}

.btn-primary--outlined {
  border: 1px solid var(--primary-700);
  color: var(--primary-700);
}
</style>
