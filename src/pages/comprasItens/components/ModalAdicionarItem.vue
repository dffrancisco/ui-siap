<script setup lang="ts">
import { configVMoney } from "@/constants/constants";
import utils from "@/ts/utils";
import { nextTick, reactive } from "vue";

const props = defineProps({
  qtdAtual: {
    type: Number,
    required: true,
  },
  valorVenda: {
    type: Number,
    required: true,
  },
  valorCusto: {
    type: Number,
    required: true,
  },
  media: {
    type: Number,
    required: true,
  },
  corMediaVenda: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["closeModal", "adicionarItem"]);

const state = reactive({
  edtQtdPedido: undefined,
  edtCusto: undefined,
});

const actions = {
  setFocusQtdPedido: () => {
    //@ts-ignore
    document.querySelector("#edtQtdPedido").focus();
  },

  adicionarItem: async () => {
    if (!state.edtQtdPedido || state.edtQtdPedido == 0) {
      return actions.setFocusQtdPedido();
    }

    emit("adicionarItem", {
      custo: utils.formatValorUSA(state.edtCusto),
      qtd: parseInt(state.edtQtdPedido),
    });
  },
};

nextTick(() => {
  state.edtCusto = utils.formatValor(props.valorCusto || 0);
});
</script>

<template>
  <v-card class="adicionar-item">
    <v-card-title> Adicionar Item </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="6">
          <label>Vlr. Venda</label>
          <v-text-field
            variant="outlined"
            density="compact"
            bg-color="#3b4758"
            :value="utils.formatValor(valorVenda)"
            disabled
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <label>Qtd. Atual</label>
          <v-text-field
            type="number"
            variant="outlined"
            density="compact"
            bg-color="#3b4758"
            :value="qtdAtual"
            disabled
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <label>Vlr. Custo</label>
          <input
            class="input-dark"
            :model-modifiers="{ number: true }"
            v-money3="configVMoney"
            v-model.lazy="state.edtCusto"
            @keypress.enter.prevent="actions.setFocusQtdPedido"
          />
        </v-col>
        <v-col cols="6">
          <label>Qtd. Pedido*</label>
          <v-text-field
            id="edtQtdPedido"
            type="number"
            variant="outlined"
            density="compact"
            bg-color="#3b4758"
            v-model="state.edtQtdPedido"
            :clearable="false"
            autofocus
            @keypress.enter.prevent="actions.adicionarItem"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
    <div class="d-flex justify-center px-2 mb-4">
      <div class="media">
        <span class="mr-1">Média: </span>
        <strong :style="{ color: props.corMediaVenda }">{{ media }}</strong>
      </div>
      <v-btn
        variant="elevated"
        class="btn-primary px-6"
        @click="actions.adicionarItem"
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

.adicionar-item {
  background-color: var(--grey-900);
  color: var(--grey-100);
  height: 270px;
}

.btn-primary {
  border: 1px solid var(--primary-700);
  background-color: var(--primary-700);
  color: var(--grey-100);
}

.media {
  font-size: 12px;
  color: var(--grey-100);
  font-weight: 500;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 16px;
  margin-top: 12px;
  line-height: 16px;
}

.media strong {
  font-size: 16px;
}
</style>
