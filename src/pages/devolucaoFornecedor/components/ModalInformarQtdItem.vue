<script setup lang="ts">
import utils from "@/ts/utils";
import { iItem, iItemDevolucao, iParamGetTributosPisCofinsItem } from "../interfaces";
import { reactive, watch, nextTick, computed } from "vue";
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

const emit = defineEmits(["salvarItem", "closeModalInformarQtdItem", "closeModalEscolherItem"]);

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
        QTD: props.dbItem.QTD || 0,
        CST: props.dbItem.CST,
        VALOR_UNITARIO: props.dbItem.CUSTO,
        VALOR_ICMS_ST: props.dbItem.VALOR_ICMS_ST,
        BASE_ICMS_ST: props.dbItem.BASE_ICMS_ST,
        PERCENTUAL_ICMS: props.dbItem.PERCENTUAL_ICMS,
        PERCENTUAL_IPI: utils.formatValor(props.dbItem.PERCENTUAL_IPI) || 0,
        CST_PIS: props.dbItem.CST_PIS || "",
        PERCENTUAL_PIS: utils.formatValor(props.dbItem.PERCENTUAL_PIS) || 0,
        CST_COFINS: props.dbItem.CST_COFINS,
        PERCENTUAL_COFINS: utils.formatValor(props.dbItem.PERCENTUAL_COFINS) || 0,
        COD_FABRICANTE: props.dbItem.COD_FABRICANTE,
        CHAVE: props.dbItem.CHAVE,
        DATA_EMISSAO: props.dbItem.DATA_EMISSAO,
        CST_IPI: props.dbItem.CST_IPI || "",
      };

      await actions.getTributosPisCofinsItem();

      actions.validarCstIpi();

      state.edtItemQtd.focus();
    }
  }
);

const pisCofinsCstComPercentual = ["01", "02", "03", "05"];

const disabledPercentualPIS = computed(() => {
  if (state.dbItemDevolucao.CST_PIS == "99") {
    return false;
  }

  return pisCofinsCstComPercentual.includes(state.dbItemDevolucao.CST_PIS) ? false : true;
});

const disabledPercentualCofins = computed(() => {
  if (state.dbItemDevolucao.CST_COFINS == "99") {
    return false;
  }

  return pisCofinsCstComPercentual.includes(state.dbItemDevolucao.CST_COFINS) ? false : true;
});

const ipiCstComPercentual = ["50"];
const ipiCstValido = ["50", "51", "52", "53", "54", "55", "99"];

const disabledPercentualIPI = computed(() => {
  if (state.dbItemDevolucao.CST_IPI == "99") {
    return false;
  }

  return ipiCstComPercentual.includes(state.dbItemDevolucao.CST_IPI) ? false : true;
});

const state = reactive({
  dbItemDevolucao: <iItemDevolucao>{},
  edtItemQtd: <HTMLInputElement>{},

  loading: false,
});

const NOME_MESES = [
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
];

const actions = {
  onKeyDownEnterQtdDevolucao(event) {
    event.preventDefault();

    actions.salvarItemDevolucao();
  },

  validarCstIpi() {
    if (!ipiCstValido.includes(state.dbItemDevolucao.CST_IPI)) {
      state.dbItemDevolucao.CST_IPI = props.dbItem.CST_IPI || "";
    }
  },

  definirPercentualPISComBaseNoCST() {
    if (pisCofinsCstComPercentual.includes(state.dbItemDevolucao.CST_PIS)) {
      state.dbItemDevolucao.PERCENTUAL_PIS = utils.formatValor(props.dbItem.PERCENTUAL_PIS);
    } else {
      state.dbItemDevolucao.PERCENTUAL_PIS = 0;
    }
  },

  definirPercentualCOFINSComBaseNoCST() {
    if (pisCofinsCstComPercentual.includes(state.dbItemDevolucao.CST_COFINS)) {
      state.dbItemDevolucao.PERCENTUAL_COFINS = utils.formatValor(props.dbItem.PERCENTUAL_COFINS);
    } else {
      state.dbItemDevolucao.PERCENTUAL_COFINS = 0;
    }
  },

  definirPercentualIPIComBaseNoCST() {
    if (ipiCstComPercentual.includes(state.dbItemDevolucao.CST_IPI)) {
      state.dbItemDevolucao.PERCENTUAL_IPI = utils.formatValor(props.dbItem.PERCENTUAL_IPI);
    } else {
      state.dbItemDevolucao.PERCENTUAL_IPI = 0;
    }
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
      await Swal.fire({
        icon: "error",
        title: "A quantidade deve ser menor ou igual a quantidade do item",
      });
      return;
    }

    if (!state.dbItemDevolucao.CFOP) {
      await Swal.fire({
        icon: "error",
        title: "O CFOP deve ser informado",
      });
      return;
    }

    if (state.dbItemDevolucao.CFOP.length < 4) {
      await Swal.fire({
        icon: "error",
        title: "O CFOP deve conter 4 dígitos",
      });
      return;
    }

    if (
      ipiCstComPercentual.includes(state.dbItemDevolucao.CST_IPI) &&
      utils.formatValorUSA(state.dbItemDevolucao.PERCENTUAL_IPI.toString()) <= 0 &&
      state.dbItemDevolucao.CST_IPI != "99"
    ) {
      await Swal.fire({
        icon: "error",
        title: "O % IPI deve ser informado",
      });
      return;
    }

    if (utils.formatValorUSA(state.dbItemDevolucao.PERCENTUAL_IPI.toString()) > 100) {
      await Swal.fire({
        icon: "error",
        title: "O % IPI deve ser menor ou igual a 100",
      });
      return;
    }

    if (
      pisCofinsCstComPercentual.includes(state.dbItemDevolucao.CST_PIS) &&
      utils.formatValorUSA(state.dbItemDevolucao.PERCENTUAL_PIS.toString()) <= 0 &&
      state.dbItemDevolucao.CST_PIS != "99"
    ) {
      await Swal.fire({
        icon: "error",
        title: "O % PIS deve ser informado",
      });
      return;
    }

    if (utils.formatValorUSA(state.dbItemDevolucao.PERCENTUAL_PIS.toString()) > 100) {
      await Swal.fire({
        icon: "error",
        title: "O % PIS deve ser menor ou igual a 100",
      });
      return;
    }

    if (
      pisCofinsCstComPercentual.includes(state.dbItemDevolucao.CST_COFINS) &&
      utils.formatValorUSA(state.dbItemDevolucao.PERCENTUAL_COFINS.toString()) <= 0 &&
      state.dbItemDevolucao.CST_COFINS != "99"
    ) {
      await Swal.fire({
        icon: "error",
        title: "O % COFINS deve ser informado",
      });
      return;
    }

    if (utils.formatValorUSA(state.dbItemDevolucao.PERCENTUAL_COFINS.toString()) > 100) {
      await Swal.fire({
        icon: "error",
        title: "O % COFINS deve ser menor ou igual a 100",
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
      let ipiPercentual = utils.formatValorUSA(state.dbItemDevolucao.PERCENTUAL_IPI.toString());

      let param = {
        ...state.dbItemDevolucao,
        PERCENTUAL_PIS: pisPercentual,
        PERCENTUAL_COFINS: cofinsPercentual,
        PERCENTUAL_IPI: ipiPercentual,
      };

      await serviceDevolucaoFornecedor.updateInsertItemDevolucao({ param });

      emit("salvarItem");
      emit("closeModalInformarQtdItem");

      if (!props.dbItem.ID_DEVOLUCAO_FORNECEDOR_ITEM) {
        emit("closeModalEscolherItem");
      }

      state.loading = false;
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
        MES: NOME_MESES[moment(state.dbItemDevolucao.DATA_EMISSAO).month()],
        CHAVE: state.dbItemDevolucao.CHAVE,
        COD_FABRICANTE: state.dbItemDevolucao.COD_FABRICANTE,
      };

      let data = await serviceDevolucaoFornecedor.getTributosPisCofinsItem(param);

      state.dbItemDevolucao.CST_PIS = data.CST_PIS;
      state.dbItemDevolucao.CST_COFINS = data.CST_COFINS;
      state.dbItemDevolucao.PERCENTUAL_PIS = utils.formatValor(data.PERCENTUAL_PIS);
      state.dbItemDevolucao.PERCENTUAL_COFINS = utils.formatValor(data.PERCENTUAL_COFINS);
      state.dbItemDevolucao.CST_IPI = data.CST_IPI;
      state.dbItemDevolucao.PERCENTUAL_IPI = utils.formatValor(data.PERCENTUAL_IPI);

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
            @update:model-value="actions.definirPercentualPISComBaseNoCST"
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
            class="ss"
            id="PERCENTUAL_PIS"
            name="PERCENTUAL_PIS"
            :model-modifiers="{ number: true }"
            v-money3="configVMoney"
            :class="disabledPercentualPIS ? 'disabled' : state.dbItemDevolucao.CST_PIS != '99' ? 'obr' : ''"
            :disabled="disabledPercentualPIS"
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
            @update:model-value="actions.definirPercentualCOFINSComBaseNoCST"
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
            class="ss"
            id="PERCENTUAL_COFINS"
            name="PERCENTUAL_COFINS"
            :model-modifiers="{ number: true }"
            v-money3="configVMoney"
            :class="disabledPercentualCofins ? 'disabled' : state.dbItemDevolucao.CST_COFINS != '99' ? 'obr' : ''"
            :disabled="disabledPercentualCofins"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="10">
          <span>IPI CST</span>
          <select
            v-model="state.dbItemDevolucao.CST_IPI"
            class="ss obr"
            id="CST_IPI"
            name="CST_IPI"
            @update:model-value="actions.definirPercentualIPIComBaseNoCST"
          >
            <option
              value=""
              selected
              >SEM IPI</option
            >
            <option value="50">50 - Saída tributada</option>
            <option value="51">51 - Saída tributada com alíquota zero</option>
            <option value="52">52 - Saída isenta</option>
            <option value="53">53 - Saída não-tributada</option>
            <option value="54">54 - Saída imune</option>
            <option value="55">55 - Saída com suspensão</option>
            <option value="99">99 - Outras saídas</option>
          </select>
        </v-col>
        <v-col>
          <span>% IPI</span>
          <input
            type="text"
            v-model.lazy="state.dbItemDevolucao.PERCENTUAL_IPI"
            class="ss"
            :class="disabledPercentualIPI ? 'disabled' : state.dbItemDevolucao.CST_IPI != '99' ? 'obr' : ''"
            :disabled="disabledPercentualIPI"
            id="PERCENTUAL_IPI"
            name="PERCENTUAL_IPI"
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
