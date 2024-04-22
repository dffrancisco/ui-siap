<script setup lang="ts">
import { reactive, watch } from "vue";
import { iVenda } from "../interfaces";
import utils from "@/ts/utils";
import printJS from "print-js";
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
      for (const key in state.checkbox) {
        state.checkbox[key] = true;
      }
    }
  }
);

const state = reactive({
  headers: <any>[
    { title: "Vendedor", key: "LOGIN", removable: true },
    {
      title: "Limite Crédito",
      key: "LIMITE",
      value: (venda: iVenda) => utils.formatValor(venda.LIMITE),
      removable: true,
      align: "center",
    },
    {
      title: "Venda",
      key: "VALOR_VENDA",
      value: (venda: iVenda) => utils.formatValor(venda.VALOR_VENDA),
      removable: true,
      align: "center",
    },
    {
      title: "Devolução",
      key: "VALOR_DEVOLUCAO",
      value: (venda: iVenda) => utils.formatValor(venda.VALOR_DEVOLUCAO),
      removable: true,
      align: "center",
    },
    {
      title: "Ved.Líquida",
      key: "VENDA_LIQUIDA",
      value: (venda: iVenda) => utils.formatValor(venda.VENDA_LIQUIDA),
      removable: true,
      align: "center",
    },
    {
      title: "Ticket Médio",
      key: "TICKET_MEDIO",
      value: (venda: iVenda) => utils.formatValor(venda.TICKET_MEDIO),
      removable: true,
      align: "center",
    },
    {
      title: "Qtd. Média Itens",
      key: "QTD_MEDIA_ITENS",
      value: (venda: iVenda) => actions.calcularQtdMediaItens(venda.QTD_ITENS, venda.QTD_VENDAS),
      removable: true,
      align: "center",
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

  loading: false,
});

const actions = {
  calcularQtdMediaItens(qtdItens: number, qtdVendas: number) {
    let resultado = qtdItens / qtdVendas;

    return utils.formatValor(resultado);
  },

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
      field: coluna,
      displayName: state.headers.find((header) => header.key === coluna).title,
    }));

    await actions.imprimirVendas(camposParamImprimir);
  },

  async imprimirVendas(campos) {
    try {
      state.loading = true;

      let dadosToPrint = props.vendas.map((venda) => {
        return {
          LOGIN: venda.LOGIN,
          LIMITE: utils.formatValor(venda.LIMITE),
          VALOR_VENDA: utils.formatValor(venda.VALOR_VENDA),
          VALOR_DEVOLUCAO: utils.formatValor(venda.VALOR_DEVOLUCAO),
          VENDA_LIQUIDA: utils.formatValor(venda.VENDA_LIQUIDA),
          TICKET_MEDIO: utils.formatValor(venda.TICKET_MEDIO),
          QTD_MEDIA_ITENS: utils.formatValor(venda.QTD_ITENS / venda.QTD_VENDAS),
        };
      });

      printJS({
        printable: dadosToPrint,
        properties: campos,
        documentTitle: `Vendas por Vendedor - Data: ${moment(props.dataInicial).format("DD/MM/YYYY")} até
        ${moment(props.dataFinal).format("DD/MM/YYYY")}`,
        type: "json",
        gridHeaderStyle: "border: 1px solid #000000",
        gridStyle: "text-align: center; border: 1px solid #000000",
      });

      state.loading = false;
    } catch (error) {
      state.loading = false;
      Swal.fire({
        text: "Erro ao imprimir as vendas!",
        icon: "error",
      });
    }
  },
};
</script>

<template>
  <v-container>
    <div>
      <h3>Colunas selecionadas para impressão:</h3>

      <div class="pt-2 chips">
        <v-chip-group>
          <v-chip
            v-for="i in 54"
            color="primary"
            variant="tonal"
            >BALCAO</v-chip
          >
        </v-chip-group>
      </div>

      <v-data-table-virtual
        class="mt-3 custom-table"
        :headers="state.headers"
        :items="props.vendas"
        height="436"
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
.custom-table {
  background-color: #f0f0f0;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
</style>
