<script setup lang="ts">
import utils from "@/ts/utils";
import { iItem, iItemDevolucao } from "../interfaces";
import { reactive, watch, nextTick } from "vue";
import globalState from "@/store/globalState";
import Swal from "sweetalert2";
import serviceDevolucaoFornecedor from "../services/devolucaoFornecedor.service";

const props = defineProps<{
  dbItem: iItem;
  id_devolucaoFornecedor: number | undefined;
  modalInformaQtdOpened: boolean;
}>();

const emit = defineEmits(["salvarItem", "closeModalInformarQtdItem"]);

watch(
  () => props.modalInformaQtdOpened,
  () => {
    console.log(props.dbItem);

    if (props.modalInformaQtdOpened) {
      if (props.dbItem.VALOR_ICMS_ST != 0 && props.dbItem.UF == globalState.empresa.UF) {
        state.dbItemDevolucao.CFOP = "5411";
      }

      if (props.dbItem.VALOR_ICMS_ST != 0 && props.dbItem.UF != globalState.empresa.UF) {
        state.dbItemDevolucao.CFOP = "6411";
      }

      if (props.dbItem.VALOR_ICMS_ST == 0 && props.dbItem.UF == globalState.empresa.UF) {
        state.dbItemDevolucao.CFOP = "5202";
      }

      if (props.dbItem.VALOR_ICMS_ST == 0 && props.dbItem.UF != globalState.empresa.UF) {
        state.dbItemDevolucao.CFOP = "6202";
      }

      state.dbItemDevolucao = {
        ID_DEVOLUCAO_FORNECEDOR: props.id_devolucaoFornecedor,
        ID_ENTRADA: props.dbItem.ID_ENTRADA,
        ID_ITEM: props.dbItem.ID_ITEM,
        CFOP: state.dbItemDevolucao.CFOP,
        QTD: 0,
        CST: props.dbItem.CST,
        VALOR_UNITARIO: props.dbItem.CUSTO,
        VALOR_ICMS_ST: props.dbItem.VALOR_ICMS_ST,
        BASE_ICMS_ST: props.dbItem.BASE_ICMS_ST,
        PERCENTUAL_ICMS: props.dbItem.PERCENTUAL_ICMS,
        PERCENTUAL_IPI: props.dbItem.PERCENTUAL_IPI,
      };

      state.edtItemQtd.focus();
    }
  }
);

const state = reactive({
  dbItemDevolucao: <iItemDevolucao>{},
  edtItemQtd: <HTMLInputElement>{},

  loading: false,
});

const actions = {
  async salvarItemDevolucao() {
    if (state.dbItemDevolucao.QTD <= 0) {
      Swal.fire({
        icon: "error",
        title: "A quantidade deve ser maior que zero",
      });
      return;
    }

    if (state.dbItemDevolucao.QTD > props.dbItem.QUANTIDADE) {
      Swal.fire({
        icon: "error",
        title: "A quantidade deve ser menor ou igual a quantidade do item",
      });
      return;
    }

    if (!state.dbItemDevolucao.CFOP) {
      Swal.fire({
        icon: "error",
        title: "O CFOP deve ser informado",
      });
      return;
    }

    if (state.dbItemDevolucao.CFOP.length < 4) {
      Swal.fire({
        icon: "error",
        title: "O CFOP deve conter 4 dígitos",
      });
      return;
    }

    await actions.updateInsertItemDevolucao();
  },

  closeModalInformarQtdItem() {
    emit("closeModalInformarQtdItem");
  },

  async updateInsertItemDevolucao() {
    try {
      state.loading = true;

      let param = state.dbItemDevolucao;

      await serviceDevolucaoFornecedor.updateInsertItemDevolucao({ param });

      state.loading = false;

      emit("salvarItem");
    } catch (error) {
      state.loading = false;
      Swal.fire({
        icon: "error",
        text: "Erro ao inserir o item da devolução!",
      });
    }
  },
};

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
            v-model="state.dbItemDevolucao.CFOP"
            type="text"
            class="ss obr"
            id="CFOP"
            name="CFOP"
            maxlength="4"
            autocomplete="off"
            v-mask="'####'"
            @keydown.enter="state.edtItemQtd.focus()"
          />
        </v-col>
        <v-col>
          <span>Qtd Devolução</span>
          <input
            v-model="state.dbItemDevolucao.QTD"
            type="number"
            :max="props.dbItem.QUANTIDADE"
            min="0"
            style="text-align: end"
            class="ss obr"
            id="QTD_DEVOLUCAO"
            name="QTD_DEVOLUCAO"
            @keydown.enter="actions.salvarItemDevolucao"
          />
        </v-col>
      </v-row>
    </div>

    <div class="btns">
      <v-btn
        style="color: #3680ab; border: 1px solid #3680ab"
        @click="actions.closeModalInformarQtdItem"
        >Cancelar</v-btn
      >
      <v-btn
        color="#3680AB"
        @click="actions.salvarItemDevolucao"
        >Salvar</v-btn
      >
    </div>

    <v-overlay
      :model-value="state.loading"
      class="align-center justify-center"
      persistent
    >
      <v-progress-circular
        color="primary"
        indeterminate
        size="64"
      >
      </v-progress-circular>
    </v-overlay>
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
