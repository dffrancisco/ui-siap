<script lang="ts" setup>
import globalActions from "@/store/globalActions";
import utils, { formatValor, formatValorUSA } from "@/ts/utils";
import { nextTick, ref } from "vue";
import { actions, state } from "../descontoOrcamento";
import globalState from "@/store/globalState";

nextTick(() => {
  state.edtDescontoItemPercent = document.getElementById(
    "edtDescontoItemPercent"
  );
  state.edtDescontoItemValor = document.getElementById("edtDescontoItemValor");
});

const upValor = (e) => {
  if ((e.key >= 0 && e.key <= 9) || e.key == "Backspace" || e.key == "Delete") {
    actions.calcPercent();
  }
};

const upPercent = (e) => {
  if (state.descontoPercent == "") state.descontoPercent = "0,00";

  // console.log(e.key);
  //|| e.key == "Backspace" || e.key == "Delete"
  if ((e.key >= 0 && e.key <= 9) || e.key == "Backspace" || e.key == "Delete") {
    let valor =
      (state.produtoSelected.SUB_TOTAL *
        formatValorUSA(state.descontoPercent)) /
      100;
    state.descontoValor = formatValor(valor);
    state.valorItem =
      state.produtoSelected.SUB_TOTAL - formatValorUSA(state.descontoValor);

    state.animate__shakeX = "";
    state.descontoPermitido = false;

    if (
      formatValorUSA(state.descontoPercent) > globalState.empresa.DESCONTO_GERAL
    ) {
      state.animate__shakeX = "animate__shakeX";
      state.descontoPermitido = true;
    }

    // state.animate__shakeX =
    //   formatValorUSA(state.descontoPercent) > globalState.empresa.DESCONTO_GERAL
    //     ? "animate__shakeX"
    //     : "";
    // state.descontoPermitido =
    //   formatValorUSA(state.descontoPercent) > globalState.empresa.DESCONTO_GERAL
    //     ? true
    //     : false;
  }
};

let imgSrc = () => {
  return globalActions.getProdutoThumb(state.produtoSelected.COD_PRODUTO, 200);
};
</script>

<template>
  <v-row class="fontsAdapt mb-n3">
    <v-col cols="3">
      <div class="mt-n3">
        <img :src="imgSrc()" class="rounded-lg" style="height: 100px" />
      </div>
    </v-col>
    <v-col cols="9">
      <div>{{ state.produtoSelected.DESC_PRODUTO }}</div>
      <div>
        <v-chip>{{ state.produtoSelected.NUM_FABRICANTE }}</v-chip>
        <v-chip class="mx-5">{{ state.produtoSelected.CARRO }}</v-chip>
        <v-chip>{{ state.produtoSelected.MARCA }}</v-chip>
      </div>
      <div>
        <span>
          Quantidade: <b>{{ state.produtoSelected.QTO }}</b>
        </span>
        <span class="ml-5">
          Valor:
          <b>{{ utils.formatValor(state.produtoSelected.SUB_TOTAL) }}</b>
        </span>
      </div>
    </v-col>
  </v-row>

  <v-divider></v-divider>

  <div class="text-right">
    <v-chip color="cyan" label size="small" class="ma-2"
      >Desconto Marca:
      <b class="pl-2">
        {{ formatValor(state.produtoSelected.DESCONTO_MARCA) }}
      </b>
    </v-chip>
    <v-chip color="success" label size="small"
      >Desconto Vendedor:
      <b class="pl-2">
        {{ formatValor(state.produtoSelected.DESCONTO_VENDEDOR) }}
      </b></v-chip
    >
  </div>

  <v-divider></v-divider>

  <v-row>
    <v-col cols="8">
      <v-textarea label="Observação" variant="outlined"></v-textarea>
    </v-col>
    <v-col cols="4">
      <!-- @keyup="calcDesconto" -->
      <v-text-field
        style="height: 50px"
        id="edtDescontoItemValor"
        ref="edtDesVal"
        v-model="state.descontoValor"
        autocomplete="off"
        v-mask-decimal.br="2"
        label="Desconto Valor"
        class="inputRight inputRed mb-5 animate__animated red"
        @keydown.enter.prevent="actions.setDescontoOrcamento()"
        @keyup.arrow-down="state.edtDescontoItemPercent.focus()"
        @keyup="upValor"
        :clearable="false"
        @focus.native="$event.target.select()"
      ></v-text-field>

      <v-text-field
        style="height: 50px"
        id="edtDescontoItemPercent"
        v-model="state.descontoPercent"
        autocomplete="off"
        v-mask-decimal.br="2"
        label="Desconto Perc.%"
        class="inputRight inputRed colorRed animate__animated"
        :class="state.animate__shakeX"
        @keydown.enter.prevent="actions.setDescontoOrcamento()"
        @keyup.arrow-up="state.edtDescontoItemValor.focus()"
        @keyup="upPercent"
        :clearable="false"
        @focus.native="$event.target.select()"
      ></v-text-field>

      <!-- <div>Percentual de Desconto {{ utils.formatValor(percenter) }}%</div> -->
      <div class="text-right mr-2 text-h5">
        <!-- <b>{{ utils.formatValor(state.produtoSelected.VALOR) }}</b> -->
        <b>{{ utils.formatValor(state.valorItem) }}</b>
      </div>
      <div class="text-right mt-2">
        <v-btn
          @click="actions.setDescontoOrcamento()"
          :disabled="state.descontoPermitido"
          color="primary"
          >Salvar</v-btn
        >
      </div>
    </v-col>
  </v-row>
</template>
