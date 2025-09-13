<script setup lang="ts">
import { reactive } from "vue";
import { iProdutoAdicionadoObj, iTransportadora } from "../interfaces";
import { MAP_COL_PRODUTO } from "../constants/constants";
import utils, { swalDarkError } from "../../../ts/utils";
import type { iColumnPrint } from "../../../ts/utils";
import moment from "moment";

const emits = defineEmits(["fecharModal"]);

const props = defineProps({
  transportadoras: {
    required: true,
    type: Array as () => iTransportadora[],
  },
  objProdutosAdicionados: {
    required: true,
    type: Object as () => iProdutoAdicionadoObj,
  },
  marca: {
    required: true,
    type: String,
  },
  observacao: {
    type: String,
    default: "",
  },
  numPedido: {
    type: Number,
    required: true,
  },
});

const state = reactive({
  tipoImpressao: <"cotacao" | "pedido">"pedido",
  transportadora: <iTransportadora | undefined>undefined,
});

const actions = {
  fecharModal() {
    emits("fecharModal");
  },
  getDadosImpresaoArquivo() {
    let dadosToPrint = Object.values(props.objProdutosAdicionados).map((ln) => {
      return {
        ...ln,
        VALOR: "____",
      };
    });

    let columns: iColumnPrint[] = [
      {
        key: MAP_COL_PRODUTO["NUM_FABRICANTE"],
        label: "Nº Fabricante",
        width: "15%",
      },
      {
        key: MAP_COL_PRODUTO["NUM_FABRICANTE2"],
        label: "Nº Fabricante 2",
        width: "15%",
      },
      {
        key: MAP_COL_PRODUTO["DESC_PRODUTO"],
        label: "Descrição",
      },
      {
        key: MAP_COL_PRODUTO["DESCRICAO_CARRO"],
        label: "Carro",
        width: "15%",
      },
      {
        key: MAP_COL_PRODUTO["DESCRICAO_MARCA"],
        label: "Marca",
        width: "15%",
        align: "center",
      },
      {
        key: "PEDIDO_QTD_ADICIONADA",
        label: "Qtd",
        width: "15%",
        align: "center",
      },
    ];

    if (state.tipoImpressao == "cotacao") {
      columns.push({
        key: "VALOR",
        label: "Valor",
        width: "10%",
        align: "center",
      });
    }

    return { columns, dadosToPrint };
  },
  async imprimir() {
    let { dadosToPrint, columns } = actions.getDadosImpresaoArquivo();

    let titulo = `
      <div style="display: flex; justify-content: space-between; width: 100%; margin-top: 10px">
        <span>&nbsp;</span>
        <strong style="font-size: 20px">${state.tipoImpressao == "cotacao" ? "COTAÇÃO" : "PEDIDO"} - ${
      props.marca
    }</strong>
        <span>Qtd de itens: ${dadosToPrint.length}</span>
      </div>
    `;

    let rodape = `
      <div style="margin-top: 10px">
        <span>Obs.: ${props.observacao || ""}</span>
      </div>
      <div style="margin-top: 10px">
        <span>Transportadora: ${state.transportadora?.RAZAO_SOCIAL || ""}</span>
      </div>
       <div style="margin-top:5px; margin-bottom: 5px">
        <span>CNPJ: ${state.transportadora?.CGC_TRANSPORTADORA || ""}</span>
      </div>
      <div>
        <span style="margin-right: 15px">Telefones: </span>
        <span style="margin-right: 50px">${state.transportadora?.TELEFONE1 || ""}</span>
        <span>${state.transportadora?.TELEFONE2 || ""}</span>
      </div>
    `;

    try {
      await utils.printComCabecalho(columns, dadosToPrint, titulo, rodape);
    } catch (error) {
      swalDarkError(error);
    }
  },
  async gerarArquivo() {
    let { dadosToPrint, columns } = actions.getDadosImpresaoArquivo();

    let hoje = moment().format("DD-MM-YYYY");

    let fileName = props.marca + " - " + hoje + " - " + props.numPedido;

    let titulo = state.tipoImpressao == "cotacao" ? "COTAÇÃO" : `PEDIDO N°${props.numPedido} - ${props.marca}`;

    let rodape = [
      [],
      [],
      [`Obs.: ${props.observacao ?? ""}`],
      [""],
      [`Transportadora: ${state.transportadora?.RAZAO_SOCIAL || ""} `],
      [`CNPJ: ${state.transportadora?.CGC_TRANSPORTADORA || ""}`],
      [`Telefones: ${state.transportadora?.TELEFONE1 || ""}   ${state.transportadora?.TELEFONE2 || ""}`],
    ];

    try {
      await utils.gerarPlanilhaComCabecalho(columns, dadosToPrint, fileName, titulo, rodape);
    } catch (error) {
      swalDarkError(error);
    }
  },
};
</script>

<template>
  <v-card class="card-container">
    <div class="card-header px-6 pt-4">
      <span class="title-modal"> Imprimir </span>
      <v-icon
        size="28"
        @click="actions.fecharModal"
        >mdi-close</v-icon
      >
    </div>
    <div class="card-body px-6 pb-6 d-flex ga-5 flex-column">
      <v-radio-group
        v-model="state.tipoImpressao"
        inline
        class="d-flex justify-center"
      >
        <div class="radio mr-2">
          <v-radio
            value="pedido"
            color="primary"
          ></v-radio>
          <span>Pedido</span>
        </div>
        <div class="radio ml-2">
          <v-radio
            value="cotacao"
            color="primary"
          ></v-radio>
          <span>Cotação</span>
        </div>
      </v-radio-group>
      <div>
        <span class="title-transportadora">Transportadora</span>
        <v-autocomplete
          bg-color="#3B4758"
          variant="solo"
          density="comfortable"
          placeholder="Informe uma transportadora"
          :items="transportadoras"
          item-value="ID_TRANSPORTADORA"
          item-title="RAZAO_SOCIAL"
          :return-object="true"
          v-model="state.transportadora"
        >
        </v-autocomplete>
      </div>
      <div class="pt-4 d-flex justify-center ga-2">
        <v-btn
          height="40"
          class="btn-imprimir"
          primary
          @click="actions.imprimir"
        >
          <v-icon class="mr-1">mdi-printer</v-icon>
          <span>imprimir</span>
        </v-btn>
        <v-btn
          height="40"
          class="btn-file"
          @click="actions.gerarArquivo"
        >
          <v-icon class="mr-1">mdi-file</v-icon>Arquivo
        </v-btn>
      </div>
    </div>
  </v-card>
</template>

<style scoped>
.card-container {
  background-color: var(--grey-900);
  color: var(--grey-100);
  height: 274px;
}

.title-modal {
  font-size: 16px;
  color: var(--grey-100);
  font-weight: bold;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.radio {
  display: flex;
  align-items: center;
}

.title-transportadora {
  font-size: 12px;
  color: var(--grey-100);
  font-weight: 600;
}

.btn-imprimir {
  background-color: var(--primary-700);
  color: #fff;
  min-width: 135px;
}

.btn-file {
  background-color: var(--success-700);
  color: #fff;
  min-width: 135px;
}
</style>
