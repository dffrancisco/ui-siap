<script setup lang="ts">
import utils from "@/ts/utils";
import { iItem } from "../interfaces";
import { reactive, watch, nextTick } from "vue";

const props = defineProps<{
  dbItem: iItem;
  modalInformaQtdOpened: boolean;
}>();

watch(
  () => props.modalInformaQtdOpened,
  () => {
    if (props.modalInformaQtdOpened) {
      state.cfop = props.dbItem.CFOP;
      state.qtdDevolucao = 0;
      state.edtItemQtd.focus();
    }
  }
);

const state = reactive({
  cfop: null,
  qtdDevolucao: 0,
  edtItemQtd: <HTMLInputElement>{},
});

const actions = {};

nextTick(async () => {
  state.edtItemQtd = <any>document.getElementById("QTD_DEVOLUCAO");
});
</script>

<template>
  <v-container>
    <div class="pb-2">
      <v-row>
        <v-col cols="3">
          <span>Cód Fabricante</span>
          <input
            :value="props.dbItem.COD_FABRICANTE"
            type="text"
            class="ss disabled"
            id="COD_FABRICANTE"
            name="COD_FABRICANTE"
            disabled
          />
        </v-col>
        <v-col>
          <span>Descrição do Item</span>
          <input
            :value="props.dbItem.DESCRICAO"
            type="text"
            class="ss disabled"
            id="DESCRICAO"
            name="DESCRICAO"
            disabled
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <span>Valor Unitário</span>
          <input
            :value="utils.formatValor(props.dbItem.CUSTO)"
            type="text"
            class="ss disabled"
            id="CUSTO"
            name="CUSTO"
            disabled
          />
        </v-col>
        <v-col>
          <span>Qtd Disponível</span>
          <input
            :value="props.dbItem.QUANTIDADE"
            type="text"
            class="ss disabled"
            id="QUANTIDADE"
            name="QUANTIDADE"
            disabled
          />
        </v-col>
        <v-col cols="4">
          <span>CFOP</span>
          <input
            v-model="state.cfop"
            type="text"
            class="ss obr"
            id="CFOP"
            name="CFOP"
            maxlength="4"
            autocomplete="off"
            v-mask="'####'"
          />
        </v-col>
        <v-col>
          <span>Qtd Devolução</span>
          <input
            v-model="state.qtdDevolucao"
            type="number"
            :max="props.dbItem.QUANTIDADE"
            min="0"
            class="ss obr"
            id="QTD_DEVOLUCAO"
            name="QTD_DEVOLUCAO"
          />
        </v-col>
      </v-row>
    </div>

    <div class="btns">
      <v-btn
        style="color: #3680ab; border: 1px solid #3680ab"
        @click=""
        >Cancelar</v-btn
      >
      <v-btn
        color="#3680AB"
        @click=""
        >Salvar</v-btn
      >
    </div>
  </v-container>
</template>

<style scoped>
span {
  font-size: 15px;
}

.btns {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  gap: 8px;
}

.disabled {
  background-color: #d9d9d9;
}
</style>
