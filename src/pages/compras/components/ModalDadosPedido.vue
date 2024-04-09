<script setup lang="ts">
import { computed, nextTick, reactive } from "vue";
import { iCompra, iMarca } from "../interfaces";
import Swal from "sweetalert2";
import { configVMoney } from "@/constants/constants";
import utils, { swalDarkWarning } from "@/ts/utils";

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

const emit = defineEmits(["closeModal", "insertCompra", "updateCompra"]);

const FORMA_PGTO_FATURADO = "1";
const FORMA_PGTO_AVISTA = "2";
const FORMA_PGTO_AVISTA_ANTECIPADO = "3";

const state = reactive({
  edtMarca: undefined,
  edtFormaPagamento: undefined,
  edtPercentualDesconto: "0",
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

  setDadosByTipoPagamento: () => {
    if (state.edtFormaPagamento == "1") {
      state.edtPercentualDesconto = "0";
      state.edtQtdDiasPagar = undefined;
      state.edtDataPagamento = undefined;
      state.edtAcrescentarDescontoNF = false;
      return;
    }

    if (state.edtFormaPagamento == "2") {
      state.edtQtdParcelas = undefined;
      state.edtDataPagamento = undefined;
      return;
    }

    if (state.edtFormaPagamento == "3") {
      state.edtQtdParcelas = undefined;
      state.edtQtdDiasPagar = undefined;
      state.edtQtdDiasFaturar = undefined;
    }
  },

  onClickSalvarPedido: async () => {
    if (!state.edtMarca) {
      return await Swal.fire({
        text: "A marca deve ser informada",
        icon: "warning",
        customClass: {
          popup: "swal-dark",
        },
        didClose() {
          setFocusMarca();
        },
      });
    }

    actions.setDadosByTipoPagamento();

    let percentualDesconto = utils.formatValorUSA(state.edtPercentualDesconto);

    if (percentualDesconto < 0 || percentualDesconto > 100) {
      return await swalDarkWarning("Informe um percentual de desconto entre 0 e 100");
    }

    let dados = {
      ID_MARCA: state.edtMarca,
      TIPO_PAGAMENTO: state.edtFormaPagamento || null,
      QTD_PARCELAS: state.edtQtdParcelas || null,
      PERCENTUAL_DESCONTO: state.edtPercentualDesconto ? utils.formatValorUSA(state.edtPercentualDesconto) : null,
      DIAS_PARA_PAGAR: state.edtQtdDiasPagar || null,
      DIAS_PARA_FATURAR: state.edtQtdDiasFaturar || null,
      ADD_DESCONTO_NO_CUSTO: state.edtAcrescentarDescontoNF ? "S" : "N",
      DATA_PAGAMENTO: state.edtDataPagamento || null,
      OBS: state.edtObservacao || null,
    };

    let ID_COMPRAS = props.compraAlterar.ID_COMPRAS;

    if (ID_COMPRAS) {
      emit("updateCompra", {
        ...dados,
        ID_COMPRAS,
      });
    } else {
      emit("insertCompra", dados);
    }
  },
};

const itemsProps = () => {
  return {
    variant: "tonal",
  };
};

const disableMarca = computed(() => {
  return props.compraAlterar.ID_COMPRAS ? true : false;
});

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

const setFocusMarca = async () => {
  //@ts-ignore
  document.querySelector("#edtMarca").focus();
};

nextTick(() => {
  if (props.compraAlterar.ID_COMPRAS) {
    state.edtMarca = props.compraAlterar.ID_MARCA;
    state.edtFormaPagamento = props.compraAlterar.TIPO_PAGAMENTO;
    state.edtObservacao = props.compraAlterar.OBS;
    state.edtDataPagamento = props.compraAlterar.DATA;
    state.edtQtdDiasFaturar = props.compraAlterar.DIAS_PARA_FATURAR;
    state.edtQtdDiasPagar = props.compraAlterar.DIAS_PARA_PAGAR;
    state.edtQtdParcelas = props.compraAlterar.QTD_PARCELAS;
    state.edtAcrescentarDescontoNF = props.compraAlterar.ADD_DESCONTO_NO_CUSTO == "S" ? true : false;
    state.edtDataPagamento = props.compraAlterar.DATA_PAGAMENTO.substring(0, 10);

    setTimeout(() => {
      state.edtPercentualDesconto = utils.formatValor(props.compraAlterar.PERCENTUAL_DESCONTO || 0);
    }, 100);
  }

  setFocusMarca();
});
</script>

<template>
  <v-card class="novo-pedido">
    <v-card-title> Novo Pedido </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <label for="edtMarca">Marca*</label>
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
            :disabled="disableMarca"
          ></v-autocomplete>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
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
        </v-col>
      </v-row>

      <v-row v-if="state.edtFormaPagamento">
        <v-col cols="12">
          <div class="novo-pedido__campos-faturado">
            <div
              v-if="exibirPercentualDesconto"
              class="novo-pedido__percentual-desconto"
            >
              <label>% Desconto</label>
              <input
                class="input-dark"
                :model-modifiers="{ number: true }"
                v-money3="configVMoney"
                v-model.lazy="state.edtPercentualDesconto"
              />
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
                style="height: 40px"
              ></v-text-field>
            </div>
          </div>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <label for="edtObservacao">Observação</label>
          <VTextarea
            id="edtObservacao"
            v-model="state.edtObservacao"
            rows="2"
            hide-details
            density="compact"
            bg-color="#3b4758"
            variant="outlined"
          />
        </v-col>
      </v-row>

      <VCheckbox
        v-if="exibirPercentualDesconto"
        v-model="state.edtAcrescentarDescontoNF"
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

<style lang="scss" scoped>
.input-dark {
  background-color: rgb(59, 71, 88);
  color: rgb(255, 255, 255);
  caret-color: rgb(255, 255, 255);
  height: 40px;
  letter-spacing: 0.009375em;
  padding: 8px 6px 8px 16px;
  border: 1px solid #868d97;
  border-radius: 4px;
  font-size: 16px;
  width: inherit;
}

.input-dark:hover {
  border-color: #e3e5e7;
}

.input-dark:focus {
  border-color: var(--info-300);
}

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
  width: 100px;
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
