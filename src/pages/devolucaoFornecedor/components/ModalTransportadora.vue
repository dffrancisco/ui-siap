<script setup lang="ts">
import { watch, reactive } from "vue";
import {
  iTranspordadoraDevolucao,
  iListaTransportadoras,
  iParamInsertTransportadoraDevolucao,
  iParamUpdateTransportadoraDevolucao,
} from "../interfaces";
import serviceDevolucaoFornecedor from "../services/devolucaoFornecedor.service";
import Swal from "sweetalert2";
import utils from "@/ts/utils";
import { configVMoney } from "../../../constants/constants";

const props = defineProps<{
  modalOpened: boolean;
  id_devolucaoFornecedorTransp: number | undefined;
  id_devolucaoFornecedor: number | undefined;
}>();

const emits = defineEmits(["closeModalTransportadoras", "selecionarTransportadoraDevolucao"]);

watch(
  () => props.modalOpened,
  () => {
    if (props.modalOpened) {
      state.dbTransportadoraDevolucao = {} as iTranspordadoraDevolucao;
      actions.getTransportadoras();

      if (props.id_devolucaoFornecedorTransp) {
        actions.getTransportadoraDevolucao();
      }
    }
  }
);

const state = reactive({
  dbTransportadoraDevolucao: <iTranspordadoraDevolucao>{},
  listaTransportadoras: <iListaTransportadoras[]>[],

  loading: false,
  valor: 0,
});

const actions = {
  closeModalTransportadoras() {
    emits("closeModalTransportadoras");
  },

  async selecionarTransportadora() {
    let dadosTransportadoraDevolucao = {
      ...state.dbTransportadoraDevolucao,
      ID_DEVOLUCAO_FORNECEDOR: props.id_devolucaoFornecedor,
      ID_DEVOLUCAO_FORNECEDOR_TRANSP: props.id_devolucaoFornecedorTransp,
      VALOR_FRETE: utils.formatValorUSA(state.dbTransportadoraDevolucao.VALOR_FRETE.toString()),
      PESO_LIQUIDO: utils.formatValorUSA(state.dbTransportadoraDevolucao.PESO_LIQUIDO.toString()),
      PESO_BRUTO: utils.formatValorUSA(state.dbTransportadoraDevolucao.PESO_BRUTO.toString()),
      ESPECIE: state.dbTransportadoraDevolucao.ESPECIE?.toUpperCase(),
      AUTORIZACAO_CORREIOS: state.dbTransportadoraDevolucao.AUTORIZACAO_CORREIOS?.toUpperCase(),
    };

    if (dadosTransportadoraDevolucao.ID_TRANSPORTADORA == undefined) {
      await Swal.fire({
        icon: "error",
        title: "Por favor, selecione uma transportadora",
      });
      return false;
    }

    if (dadosTransportadoraDevolucao.TIPO_FRETE == undefined) {
      await Swal.fire({
        icon: "error",
        title: "Por favor, selecione uma modalidade de frete",
      });
      return false;
    }

    if (dadosTransportadoraDevolucao.ESPECIE == undefined) {
      await Swal.fire({
        icon: "error",
        title: "Por favor, informe a espécie",
      });
      return false;
    }

    if (dadosTransportadoraDevolucao.QTD <= 0) {
      await Swal.fire({
        icon: "error",
        title: "Por favor, informe a quantidade de volumes",
      });
      return false;
    }

    if (dadosTransportadoraDevolucao.QTD > 10000) {
      await Swal.fire({
        icon: "error",
        title: "A quantidade de volumes deve ser menor ou igual a 10.000",
      });
      return false;
    }

    if (props.id_devolucaoFornecedorTransp) {
      return await actions.updateTransportadoraDevolucao(dadosTransportadoraDevolucao);
    }

    await actions.insertTransportadoraDevolucao(dadosTransportadoraDevolucao);
  },

  async getTransportadoras() {
    try {
      let data = await serviceDevolucaoFornecedor.getTransportadoras();
      state.listaTransportadoras = data;
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Erro ao carregar as transportadoras!",
      });
    }
  },

  async getTransportadoraDevolucao() {
    try {
      state.loading = true;
      let data = await serviceDevolucaoFornecedor.getTransportadoraDevolucao(props.id_devolucaoFornecedorTransp);

      state.dbTransportadoraDevolucao = {
        ...data,
        VALOR_FRETE: utils.formatValor(data.VALOR_FRETE.toString()),
        PESO_BRUTO: utils.formatValor(data.PESO_BRUTO.toString()),
        PESO_LIQUIDO: utils.formatValor(data.PESO_LIQUIDO.toString()),
      };

      state.loading = false;
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Erro ao carregar a transportadora da devolução!",
      });
    }
  },

  async insertTransportadoraDevolucao(param: iParamInsertTransportadoraDevolucao) {
    try {
      state.loading = true;

      await serviceDevolucaoFornecedor.insertTransportadoraDevolucao(param);

      emits("selecionarTransportadoraDevolucao", param);

      actions.closeModalTransportadoras();

      state.loading = false;
    } catch (error) {
      state.loading = false;
      Swal.fire({
        icon: "error",
        text: "Erro ao inserir a transportadora da devolução!",
      });
    }
  },

  async updateTransportadoraDevolucao(param: iParamUpdateTransportadoraDevolucao) {
    try {
      state.loading = true;

      await serviceDevolucaoFornecedor.updateTransportadoraDevolucao(param);

      emits("selecionarTransportadoraDevolucao", param);

      actions.closeModalTransportadoras();

      state.loading = false;
    } catch (error) {
      state.loading = false;
      Swal.fire({
        icon: "error",
        text: "Erro ao atualizar a transportadora da devolução!",
      });
    }
  },
};
</script>

<template>
  <v-container>
    <div id="pnCampos">
      <v-row>
        <v-col cols="12">
          <h2 class="font-weight-regular">Transportadora</h2>
          <select
            v-model="state.dbTransportadoraDevolucao.ID_TRANSPORTADORA"
            class="ss obr"
            name="ID_TRANSPORTADORA"
            id="ID_TRANSPORTADORA"
          >
            <option
              v-for="transportadora in state.listaTransportadoras"
              :value="transportadora.ID_TRANSPORTADORA"
            >
              {{ transportadora.NOME_TRANSPORTADORA }}</option
            >
          </select>
        </v-col>
        <v-col cols="8">
          <h2 class="font-weight-regular">Modalidade Frete</h2>
          <select
            class="obr ss"
            name="TIPO_FRETE"
            id="TIPO_FRETE"
            v-model="state.dbTransportadoraDevolucao.TIPO_FRETE"
          >
            <option value="0">Por conta do emitente</option>
            <option value="1">Por conta do destinatário/remetente</option>
            <option value="2">Por conta de terceiros</option>
            <option value="3">Transporte próprio por conta do remetente</option>
            <option value="4">Transporte próprio por conta do destinatário</option>
            <option value="9">Sem transporte</option>
          </select>
        </v-col>
        <v-col cols="2">
          <h2 class="font-weight-regular">Espécie</h2>
          <input
            v-model="state.dbTransportadoraDevolucao.ESPECIE"
            class="ss obr"
            type="text"
            name="ESPECIE"
            id="ESPECIE"
            maxlength="6"
          />
        </v-col>
        <v-col cols="2">
          <h2 class="font-weight-regular">Qtd. Volumes</h2>
          <input
            v-model="state.dbTransportadoraDevolucao.QTD"
            class="ss obr"
            type="number"
            name="QTD"
            id="QTD"
            max="10000"
          />
        </v-col>
        <v-col cols="6">
          <h2 class="font-weight-regular">Autorização (Correios)</h2>
          <input
            v-model="state.dbTransportadoraDevolucao.AUTORIZACAO_CORREIOS"
            class="ss"
            type="text"
            name="AUTORIZACAO_CORREIOS"
            id="AUTORIZACAO_CORREIOS"
            maxlength="20"
          />
        </v-col>
        <v-col cols="2">
          <h2 class="font-weight-regular">Peso Bruto</h2>
          <input
            class="ss"
            type="text"
            name="PESO_BRUTO"
            id="PESO_BRUTO"
            :model-modifiers="{ number: true }"
            v-model.lazy="state.dbTransportadoraDevolucao.PESO_BRUTO"
            v-money3="configVMoney"
          />
        </v-col>
        <v-col cols="2">
          <h2 class="font-weight-regular">Peso Líquido</h2>
          <input
            v-model.lazy="state.dbTransportadoraDevolucao.PESO_LIQUIDO"
            class="ss"
            type="text"
            name="PESO_LIQUIDO"
            id="PESO_LIQUIDO"
            :model-modifiers="{ number: true }"
            v-money3="configVMoney"
          />
        </v-col>

        <v-col>
          <h2 class="font-weight-regular">Valor</h2>
          <input
            class="ss"
            type="text"
            name="VALOR_FRETE"
            id="VALOR_FRETE"
            style="text-align: end"
            :model-modifiers="{ number: true }"
            v-model.lazy="state.dbTransportadoraDevolucao.VALOR_FRETE"
            v-money3="configVMoney"
            @keydown.enter="actions.selecionarTransportadora"
          />
        </v-col>
      </v-row>
    </div>

    <div class="btns pt-4">
      <v-btn
        style="color: #3680ab; border: 1px solid #3680ab"
        @click="actions.closeModalTransportadoras"
        >Cancelar</v-btn
      >
      <v-btn
        color="#3680AB"
        @click="actions.selecionarTransportadora"
        >Salvar</v-btn
      >
    </div>
  </v-container>
</template>

<style scoped>
h2 {
  font-size: 16px;
  padding-bottom: 8px;
}

.btns {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  gap: 8px;
}
</style>
