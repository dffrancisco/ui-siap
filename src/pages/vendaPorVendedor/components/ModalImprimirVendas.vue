<script setup lang="ts">
import { reactive, watch, computed } from "vue";
import { iVenda } from "../interfaces";
import utils from "@/ts/utils";
import Swal from "sweetalert2";
import moment from "moment";

const props = defineProps<{
  vendas: iVenda[];
  dataInicial?: string;
  dataFinal?: string;
  modalOpened: boolean;
}>();

watch(
  () => props.modalOpened,
  () => {
    if (props.modalOpened) {
      state.dbVenda = [...props.vendas];

      for (const key in state.checkbox) {
        state.checkbox[key] = true;
      }

      state.selectColunas = "VALOR_VENDA";
    }
  }
);

const dadosToTable = computed(() => {
  state.dbVenda.sort((a, b) => {
    if (state.selectColunas == "LOGIN") {
      return a[state.selectColunas].localeCompare(b[state.selectColunas]);
    }

    return b[state.selectColunas] - a[state.selectColunas];
  });

  let vendas = [...state.dbVenda];

  return vendas;
});

const state = reactive({
  headers: <any>[
    { title: "Vendedor", key: "LOGIN", removable: true },
    {
      title: "Limite Crédito",
      key: "LIMITE",
      removable: true,
      align: "end",
    },
    {
      title: "Venda",
      key: "VALOR_VENDA",
      removable: true,
      align: "end",
    },
    {
      title: "Devolução",
      key: "VALOR_DEVOLUCAO",
      removable: true,
      align: "end",
    },
    {
      title: "Ved.Líquida",
      key: "VENDA_LIQUIDA",
      removable: true,
      align: "end",
    },
    {
      title: "Ticket Médio",
      key: "TICKET_MEDIO",
      removable: true,
      align: "end",
    },
    {
      title: "Qtd. Média Itens",
      key: "QTD_MEDIA_ITENS",
      removable: true,
      align: "end",
    },
  ],

  checkbox: {
    LOGIN: true,
    LIMITE: true,
    VALOR_VENDA: true,
    VALOR_DEVOLUCAO: true,
    VENDA_LIQUIDA: true,
    TICKET_MEDIO: true,
    QTD_MEDIA_ITENS: true,
  },

  dbVenda: <iVenda[]>[],

  selectColunas: "",

  loading: false,
});

const actions = {
  async btnPrint() {
    const colunasSelecionadas = Object.keys(state.checkbox).filter((key) => state.checkbox[key]);

    if (colunasSelecionadas.length <= 0) {
      await Swal.fire({
        icon: "warning",
        title: "Por favor, selecione pelo menos uma coluna para imprimir",
      });
      return;
    }

    const camposParamImprimir = colunasSelecionadas.map((coluna) => ({
      key: coluna,
      label: state.headers.find((header) => header.key === coluna).title,
    }));

    await actions.imprimirVendas(camposParamImprimir);
  },

  getDadosImpresaoArquivo() {
    let dadosToPrint = dadosToTable.value.map((item) => {
      return {
        LOGIN: item.LOGIN,
        LIMITE: utils.formatValor(item.LIMITE),
        VALOR_VENDA: utils.formatValor(item.VALOR_VENDA),
        VALOR_DEVOLUCAO: utils.formatValor(item.VALOR_DEVOLUCAO),
        VENDA_LIQUIDA: utils.formatValor(item.VENDA_LIQUIDA),
        TICKET_MEDIO: utils.formatValor(item.TICKET_MEDIO),
        QTD_MEDIA_ITENS: utils.formatValor(item.QTD_MEDIA_ITENS),
      };
    });

    return { dadosToPrint };
  },

  async imprimirVendas(campos) {
    let { dadosToPrint } = actions.getDadosImpresaoArquivo();

    let titulo = `
      <div style="display: flex; justify-content: space-between; width: 100%; margin-top: 10px">
      <span>Período: ${moment(props.dataInicial).format("DD/MM/YYYY")} até ${moment(props.dataFinal).format(
      "DD/MM/YYYY"
    )}</span>
      <strong style="font-size: 20px">Vendas por Vendedor</strong>
      </div>
      `;

    try {
      state.loading = true;

      await utils.printComCabecalho(campos, dadosToPrint, titulo);
    } catch (error) {
      console.error(error);
    } finally {
      state.loading = false;
    }
  },
};
</script>

<template>
  <v-container>
    <div>
      <div id="pnCampos">
        <h3>Ordenar por:</h3>
        <select
          class="ss select_colunas"
          v-model="state.selectColunas"
        >
          <option
            v-for="coluna in state.headers"
            :value="coluna.key"
            >{{ coluna.title }}</option
          >
        </select>
      </div>

      <v-data-table-virtual
        class="mt-3"
        :headers="state.headers"
        :items="dadosToTable"
        height="468"
        fixed-header
      >
        <template v-slot:headers="{ columns }">
          <tr style="background-color: #fff">
            <template
              v-for="column in columns"
              :key="column.key"
            >
              <td style="font-size: 14px">
                <span class="mr-2">{{ column.title }}</span>
                <input
                  type="checkbox"
                  v-model="state.checkbox[column.key]"
                />
              </td>
            </template>
          </tr>
        </template>
        <template v-slot:item="{ item, index }">
          <tr :style="{ backgroundColor: index % 2 === 0 ? '#fff' : '#f0f0f0', textAlign: 'end' }">
            <td style="text-align: start">{{ item.LOGIN }}</td>
            <td>{{ utils.formatValor(item.LIMITE) }}</td>
            <td>{{ utils.formatValor(item.VALOR_VENDA) }}</td>
            <td
              ><span style="color: #bf3f3f"> -{{ utils.formatValor(item.VALOR_DEVOLUCAO) }} </span></td
            >
            <td>{{ utils.formatValor(item.VENDA_LIQUIDA) }}</td>
            <td>{{ utils.formatValor(item.TICKET_MEDIO) }}</td>
            <td>{{ utils.formatValor(item.QTD_MEDIA_ITENS) }}</td>
          </tr>
        </template>
      </v-data-table-virtual>
    </div>
    <div class="mt-3 d-flex justify-end">
      <v-btn
        color="primary"
        @click="actions.btnPrint"
      >
        <v-icon
          size="20px"
          class="mr-2"
        >
          mdi-printer
        </v-icon>
        Imprimir
      </v-btn>
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
      ></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<style scoped>
.select_colunas {
  width: 200px;
}
</style>
