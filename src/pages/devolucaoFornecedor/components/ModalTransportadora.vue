<script setup lang="ts">
import { watch, reactive } from "vue";
import { iTranspordadoraDevolucao, iListaTransportadoras } from "../interfaces";
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
    if (state.dbTransportadoraDevolucao.ID_TRANSPORTADORA == undefined) {
      Swal.fire({
        icon: "error",
        title: "Por favor, selecione uma transportadora",
      });
      return false;
    }

    if (state.dbTransportadoraDevolucao.TIPO_FRETE == undefined) {
      Swal.fire({
        icon: "error",
        title: "Por favor, selecione uma modalidade de frete",
      });
      return false;
    }

    if (utils.formatValorUSA(state.dbTransportadoraDevolucao.VALOR_FRETE.toString()) <= 0) {
      Swal.fire({
        icon: "error",
        title: "O campo valor deve ser maior que 0",
      });
      return false;
    }

    if (props.id_devolucaoFornecedorTransp) {
      return await actions.updateTransportadoraDevolucao();
    }

    await actions.insertTransportadoraDevolucao();
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
      };

      state.loading = false;
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Erro ao carregar a transportadora da devolução!",
      });
    }
  },

  async insertTransportadoraDevolucao() {
    try {
      state.loading = true;

      let transportadoraDevolucao = state.dbTransportadoraDevolucao;

      transportadoraDevolucao.ID_DEVOLUCAO_FORNECEDOR = props.id_devolucaoFornecedor;

      let valorFrete = utils.formatValorUSA(transportadoraDevolucao.VALOR_FRETE.toString());

      let param = {
        ...transportadoraDevolucao,
        VALOR_FRETE: valorFrete,
      };

      let data = await serviceDevolucaoFornecedor.insertTransportadoraDevolucao({ param });

      state.dbTransportadoraDevolucao.ID_DEVOLUCAO_FORNECEDOR_TRANSP = data.ID_DEVOLUCAO_FORNECEDOR_TRANSP;

      emits("selecionarTransportadoraDevolucao", transportadoraDevolucao);

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

  async updateTransportadoraDevolucao() {
    try {
      state.loading = true;

      let transportadoraDevolucao = state.dbTransportadoraDevolucao;

      transportadoraDevolucao.ID_DEVOLUCAO_FORNECEDOR_TRANSP = props.id_devolucaoFornecedorTransp;
      transportadoraDevolucao.ID_DEVOLUCAO_FORNECEDOR = props.id_devolucaoFornecedor;

      let valorFrete = utils.formatValorUSA(transportadoraDevolucao.VALOR_FRETE.toString());

      let param = {
        ...transportadoraDevolucao,
        VALOR_FRETE: valorFrete,
      };

      await serviceDevolucaoFornecedor.updateTransportadoraDevolucao({ param });

      emits("selecionarTransportadoraDevolucao", transportadoraDevolucao);

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
        <v-col cols="9">
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
        <v-col>
          <h2 class="font-weight-regular">Valor</h2>
          <input
            class="ss obr"
            type="text"
            name="VALOR_FRETE"
            id="VALOR_FRETE"
            :model-modifiers="{ number: true }"
            v-model.lazy="state.dbTransportadoraDevolucao.VALOR_FRETE"
            v-money3="configVMoney"
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
        >Selecionar</v-btn
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
