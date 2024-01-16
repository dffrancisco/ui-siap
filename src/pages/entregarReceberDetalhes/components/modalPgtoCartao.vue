<script setup lang="ts">
import utils, { formatValorUSA, sleep } from "@/ts/utils";
import Swal from "sweetalert2";
import { reactive, toRefs, computed, watch, nextTick } from "vue";
import { iCartaoDisponivel } from "../interface";

const props = defineProps({
  totalPagamentos: {
    type: Number,
    required: true,
  },
  valorOrcamento: {
    type: Number,
    default: 0,
  },
  tipoPagamento: {
    type: String,
    required: true,
  },
  cartoesDisponiveis: {
    type: Array as () => iCartaoDisponivel[],
    required: true,
  },
  opened: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["salvar"]);

interface Refs {
  slTipo: HTMLSelectElement;
  slCartao: HTMLSelectElement;
  slDivide: HTMLSelectElement;
  edtValorCartao: HTMLInputElement;
  edtAutorizacao: HTMLInputElement;
}

const _refs = reactive<Refs>({
  slTipo: null,
  slCartao: null,
  slDivide: null,
  edtValorCartao: null,
  edtAutorizacao: null,
});

const { slTipo, slCartao, slDivide, edtValorCartao, edtAutorizacao } =
  toRefs(_refs);

const state = reactive({
  tipo: ["C"],
  cartao: ["1"],
  divide: ["1"],
  valorCartao: "0",
  numCartaoAut: "",
  editarPagamento: null,
  aberto: false,
  slTipo: HTMLSelectElement,
});

const valorDisponivel = computed(() => {
  let valorDisponivel = props.valorOrcamento - props.totalPagamentos;
  return parseFloat(valorDisponivel.toFixed(2));
});

watch(
  () => props.opened,
  (newValue) => {
    nextTick(async () => {
      if (newValue) {
        state.cartao = [
          props.cartoesDisponiveis[0].COD_BANDEIRA_CARTAO.toString(),
        ];
        state.tipo = ["C"];
        state.divide = ["1"];
        state.numCartaoAut = "";
        state.valorCartao = utils.formatValor(valorDisponivel.value);

        await sleep(200);
        //@ts-ignore
        document.querySelector("#slCartao").focus();
      }
    });
  }
);

const parcelamentos = computed(() => {
  return (
    props.cartoesDisponiveis.find(
      (cartao) => cartao.COD_BANDEIRA_CARTAO == parseInt(state.cartao[0])
    )?.DIVISAO || 1
  );
});

const onKeypressEnterEdtValor = () => {
  //@ts-ignore
  document.querySelector("#edtAutorizacao").focus();
};

const insertCartao = () => {
  if (state.tipo[0] == "D" && state.divide[0] !== "1") {
    Swal.fire({ icon: "error", text: "Pagamento no débito somente em 1x" });
    return;
  }

  if (state.tipo.length != 1) {
    Swal.fire({ icon: "error", text: "Selecione somente um tipo de cartão" });
    return;
  }

  if (state.cartao.length != 1) {
    Swal.fire({
      icon: "error",
      text: "Selecione somente uma Bandeira do cartão",
    });
    return;
  }

  if (state.divide.length != 1) {
    Swal.fire({ icon: "error", text: "Selecione somente um parcelamento" });
    return;
  }

  const valor = formatValorUSA(state.valorCartao);

  if (isNaN(valor) || valor <= 0) {
    Swal.fire({
      icon: "error",
      text: "Valor do Cartão tem que ser maior que 0 (zero)",
    });
    return;
  }

  if (valor > valorDisponivel.value) {
    Swal.fire({
      icon: "error",
      text: "Valor passado ultrapassa o valor total do orçamento",
    });
    return;
  }

  if (!state.numCartaoAut) {
    Swal.fire({
      icon: "error",
      text: "Informe o código de autorização",
    });
    return;
  }

  emit("salvar", {
    tipoPagamento: props.tipoPagamento,
    valor,
    autorizacao: state.numCartaoAut,
    codigoBandeiraCartao: parseInt(state.cartao[0]),
    tipoCartao: state.tipo[0],
    divisaoCartao: state.divide,
  });
};
</script>

<template>
  <div id="mCartaoInsert">
    <div class="cardMain">
      <select
        id="slCartao"
        v-model="state.cartao"
        multiple
        name="slCartao"
        ref="slCartao"
        @keypress.prevent.enter="slTipo.focus()"
        @keydown.arrow-right="slTipo.focus()"
      >
        <option
          v-for="item in cartoesDisponiveis"
          :value="item.COD_BANDEIRA_CARTAO"
        >
          {{ item.DESCRICAO.toUpperCase() }}
        </option>
      </select>

      <select
        v-model="state.tipo"
        multiple
        name="slTipo"
        ref="slTipo"
        id="slTipo"
        @keypress.prevent.enter="slDivide.focus()"
        @keydown.arrow-left="slCartao.focus()"
        @keydown.arrow-right="slDivide.focus()"
      >
        <option value="C">Crédito</option>
        <option value="D">Débito</option>
      </select>

      <select
        v-model="state.divide"
        multiple
        name="slDivide"
        ref="slDivide"
        @keypress.prevent.enter="edtValorCartao.focus()"
        @keydown.prevent.arrow-left="slTipo.focus()"
        @keydown.prevent.arrow-right="edtValorCartao.focus()"
      >
        <option
          v-for="parcelamento in parcelamentos"
          :key="parcelamento"
          :value="parcelamento"
          :disabled="state.tipo[0] == 'D' ? true : false"
        >
          {{ parcelamento + "X" }}
        </option>
      </select>
    </div>

    <div class="d-flex justify-end mt-4 mr-4">
      <div class="mr-2" style="min-width: 120px">
        <label class="vLabel">Valor do Cartão</label>
        <v-text-field
          v-model="state.valorCartao"
          ref="edtValorCartao"
          autofocus
          autocomplete="off"
          v-mask-decimal.br="2"
          input-align="right"
          @focus="$event.target.select()"
          @keydown.prevent.arrow-up="slCartao.focus()"
          @keypress.enter="onKeypressEnterEdtValor"
        />
      </div>
      <div style="min-width: 200px">
        <label class="vLabel">Cód. Autorização</label>
        <v-text-field
          id="edtAutorizacao"
          v-model="state.numCartaoAut"
          ref="edtAutorizacao"
          autocomplete="off"
          input-align="right"
          maxlength="20"
          @focus="$event.target.select()"
          @keypress.enter="insertCartao"
        />
      </div>
    </div>
    <div class="d-flex justify-end mt-3 mr-4">
      <button class="btn" @click="insertCartao">Adicionar</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
select {
  padding: 10px;
  font-size: 20px;
  font-weight: bold;
  outline: none;
  margin: 5px;
  border-radius: 10px;
  transition: all 0.3s;
  border: 3px solid rgb(241, 241, 241);
  height: 240px;
  overflow: hidden;
}

.cardMain {
  display: flex;
  justify-content: center;
}

.btn {
  text-align: center;
  border-radius: 4px;
  border: 1px solid #4b6cb7;
  background: #4b6cb7 !important;
  color: #ffffff;
  font-weight: bold;
  margin-left: 10px;
  padding: 12px;
  cursor: pointer;
}

select:focus {
  border: 3px solid rgb(3, 162, 112);
}

select[multiple] option {
  padding: 10px;
  border-radius: 5px;
}
select[multiple] option:checked {
  background: rgb(3, 162, 112);
  color: white;
}

select[multiple]:focus option:checked {
  background: #1989fa linear-gradient(0deg, #1989fa 0%, #1989fa 100%);
  border-radius: 5px;
}
</style>
