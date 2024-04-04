<script setup lang="ts">
import utils from "@/ts/utils";
import { iItem, iItemDevolucao, iParamGetTributosPisCofinsItem } from "../interfaces";
import { reactive, watch, nextTick } from "vue";
import globalState from "@/store/globalState";
import Swal from "sweetalert2";
import serviceDevolucaoFornecedor from "../services/devolucaoFornecedor.service";
import { configVMoney } from "../../../constants/constants";
import moment from "moment";

const props = defineProps<{
  dbItem: iItem;
  id_devolucaoFornecedor: number | undefined;
  modalInformaQtdOpened: boolean;
}>();

const emit = defineEmits(["salvarItem", "closeModalInformarQtdItem"]);

watch(
  () => props.modalInformaQtdOpened,
  async () => {
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
        CST_PIS: null,
        PERCENTUAL_PIS: 0,
        CST_COFINS: null,
        PERCENTUAL_COFINS: 0,
        COD_FABRICANTE: props.dbItem.COD_FABRICANTE,
        CHAVE: props.dbItem.CHAVE,
        DATA_EMISSAO: props.dbItem.DATA_EMISSAO,
      };

      await actions.getTributosPisCofinsItem();

      state.edtItemQtd.focus();
    }
  }
);

const state = reactive({
  dbItemDevolucao: <iItemDevolucao>{},
  edtItemQtd: <HTMLInputElement>{},

  mes: [
    "",
    "Janeiro",
    "Fevereiro",
    "Marco",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ],

  loading: false,
});

const actions = {
  onKeyDownEnterQtdDevolucao(event) {
    event.preventDefault();

    actions.salvarItemDevolucao();
  },

  async salvarItemDevolucao() {
    if (state.dbItemDevolucao.QTD <= 0) {
      await Swal.fire({
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

    if (!state.dbItemDevolucao.CST_PIS) {
      Swal.fire({
        icon: "error",
        title: "O PIS CST deve ser informado",
      });
      return;
    }

    if (utils.formatValorUSA(state.dbItemDevolucao.PERCENTUAL_PIS.toString()) <= 0) {
      Swal.fire({
        icon: "error",
        title: "O % PIS deve ser informado",
      });
      return;
    }

    if (!state.dbItemDevolucao.CST_COFINS) {
      Swal.fire({
        icon: "error",
        title: "O COFINS CST deve ser informado",
      });
      return;
    }

    if (utils.formatValorUSA(state.dbItemDevolucao.PERCENTUAL_COFINS.toString()) <= 0) {
      Swal.fire({
        icon: "error",
        title: "O COFINS Percentual deve ser informado",
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

    if (!state.dbItemDevolucao.CST_PIS) {
      Swal.fire({
        icon: "error",
        title: "O CST PIS deve ser informado",
      });
      return;
    }

    if (!state.dbItemDevolucao.CST_COFINS) {
      Swal.fire({
        icon: "error",
        title: "O CST COFINS deve ser informado",
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

      let pisPercentual = utils.formatValorUSA(state.dbItemDevolucao.PERCENTUAL_PIS.toString());
      let cofinsPercentual = utils.formatValorUSA(state.dbItemDevolucao.PERCENTUAL_COFINS.toString());

      let param = {
        ...state.dbItemDevolucao,
        PERCENTUAL_PIS: pisPercentual,
        PERCENTUAL_COFINS: cofinsPercentual,
      };

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

  async getTributosPisCofinsItem() {
    try {
      state.loading = true;

      let param: iParamGetTributosPisCofinsItem = {
        ANO: moment(state.dbItemDevolucao.DATA_EMISSAO).year(),
        MES: state.mes[moment(state.dbItemDevolucao.DATA_EMISSAO).month() + 1],
        CHAVE: state.dbItemDevolucao.CHAVE,
        COD_FABRICANTE: state.dbItemDevolucao.COD_FABRICANTE,
      };

      let data = await serviceDevolucaoFornecedor.getTributosPisCofinsItem(param);

      state.dbItemDevolucao.CST_PIS = data.CST_PIS;
      state.dbItemDevolucao.CST_COFINS = data.CST_COFINS;
      state.dbItemDevolucao.PERCENTUAL_PIS = utils.formatValor(data.PERCENTUAL_PIS);
      state.dbItemDevolucao.PERCENTUAL_COFINS = utils.formatValor(data.PERCENTUAL_COFINS);

      state.loading = false;
    } catch (error) {
      state.loading = false;
    }
  },
};

nextTick(async () => {
  state.edtItemQtd = <any>document.getElementById("QTD_DEVOLUCAO");
});
</script>

<template>
  <v-container>
    <div
      class="pb-2"
      id="pnCampos"
    >
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
        <v-col cols="4">
          <span>Qtd Disponível P/ Devolução</span>
          <input
            :value="props.dbItem.QUANTIDADE"
            type="text"
            class="ss disabled"
            id="QUANTIDADE"
            name="QUANTIDADE"
            disabled
          />
        </v-col>
        <v-col cols="3">
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
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="10">
          <span>PIS CST</span>
          <select
            v-model="state.dbItemDevolucao.CST_PIS"
            class="ss obr"
            id="CST_PIS"
            name="CST_PIS"
          >
            <option value="01">01 - Operação Tributável com Alíquota Básica</option>
            <option value="02">02 - Operação Tributável com Alíquota Diferenciada</option>
            <option value="03">03 - Operação Tributável com Alíquota por Unidade de Medida de Produto</option>
            <option value="04">04 - Operação Tributável Monofásica (Revenda a Alíquota Zero)</option>
            <option value="05">05 - Operação Tributável por Substituição Tributária</option>
            <option value="06">06 - Operação Tributável a Alíquota Zero</option>
            <option value="07">07 - Operação Isenta da Contribuição</option>
            <option value="08">08 - Operação Sem Incidência da Contribuição</option>
            <option value="09">09 - Operação com Suspensão da Contribuição</option>
            <option value="99">99 - Outras Operações</option>
          </select>
        </v-col>
        <v-col cols="2">
          <span>% PIS</span>
          <input
            v-model.lazy="state.dbItemDevolucao.PERCENTUAL_PIS"
            type="text"
            class="ss obr"
            id="PERCENTUAL_PIS"
            name="PERCENTUAL_PIS"
            :model-modifiers="{ number: true }"
            v-money3="configVMoney"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="10">
          <span>COFINS CST</span>
          <select
            v-model="state.dbItemDevolucao.CST_COFINS"
            class="ss obr"
            id="CST_COFINS"
            name="CST_COFINS"
          >
            <option value="01">01 - Operação Tributável com Alíquota Básica</option>
            <option value="02">02 - Operação Tributável com Alíquota Diferenciada</option>
            <option value="03">03 - Operação Tributável com Alíquota por Unidade de Medida de Produto</option>
            <option value="04">04 - Operação Tributável Monofásica (Revenda a Alíquota Zero)</option>
            <option value="05">05 - Operação Tributável por Substituição Tributária</option>
            <option value="06">06 - Operação Tributável a Alíquota Zero</option>
            <option value="07">07 - Operação Isenta da Contribuição</option>
            <option value="08">08 - Operação Sem Incidência da Contribuição</option>
            <option value="09">09 - Operação com Suspensão da Contribuição</option>
            <option value="99">99 - Outras Operações</option>
          </select>
        </v-col>
        <v-col>
          <span>% COFINS</span>
          <input
            type="text"
            v-model.lazy="state.dbItemDevolucao.PERCENTUAL_COFINS"
            class="ss obr"
            id="PERCENTUAL_COFINS"
            name="PERCENTUAL_COFINS"
            :model-modifiers="{ number: true }"
            v-money3="configVMoney"
            @keydown.enter="actions.onKeyDownEnterQtdDevolucao"
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
