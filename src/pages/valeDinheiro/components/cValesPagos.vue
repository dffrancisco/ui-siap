<script setup lang="ts">
import { reactive } from "vue";
import { dataBrasil, formatValor, sleep } from "@/ts/utils";
import { iValePago } from "../interface";
import serviceValeDinheiro from "../services/valeDinheiro.service";
import Swal from "sweetalert2";
import globalState from "@/store/globalState";
import printJS from "print-js";

const emit = defineEmits(["negarVale", "alterarVale", "pagarVale"]);

const state = reactive({
  valesImpressao: <iValePago[]>[],
  valesPagos: <iValePago[]>[],
  loading: true,
});

const getValesPagos = async () => {
  try {
    state.loading = true;

    const vales = await serviceValeDinheiro.getValesPagos();

    state.valesPagos = vales;
  } catch (error) {
    state.valesPagos = [];
    Swal.fire({
      text: "Ocorreu um erro ao buscar vales",
      icon: "error",
    });
  } finally {
    state.loading = false;
  }
};

const onClickImprimir = async (item: iValePago) => {
  state.valesImpressao = [item];

  print();
};

const onClickImprimirTodos = async () => {
  state.valesImpressao = state.valesPagos;

  print();
};

const print = async () => {
  await sleep(200);

  printJS({
    printable: "vales-pagos__print",
    type: "html",
    header: "<h2>Recibo de Pagamento</h2>",
    headerStyle: "text-align: center; font-size: 20px;",
    scanStyles: false,
  });
};

getValesPagos();
</script>

<template>
  <div>
    <div class="vales-pagos__table">
      <v-data-table
        :headers="[
          {
            title: 'Nome',
            key: 'NOME',
          },
          {
            title: 'Cargo',
            key: 'CARGO',
          },
          {
            title: 'Data Pgto',
            key: 'DATA_PG',
            align: 'center',
          },
          {
            title: 'Valor',
            key: 'VALOR',
            align: 'center',
          },
          {
            title: 'Forma de Pagamento',
            key: 'FORMA_PAGAMENTO',
            align: 'center',
            sortable: false,
          },
          {
            title: 'Ações',
            key: 'ACOES',
            align: 'center',
            sortable: false,
          },
        ]"
        :items="state.valesPagos"
        :items-per-page="-1"
        :hide-default-footer="true"
        :loading="state.loading"
        no-data-text="Nenhum vale pago encontrado"
        loading-text="aguarde..."
        class="elevation-1"
        color="primary"
      >
        <template v-slot:item.VALOR="{ value }">
          {{ formatValor(value) }}
        </template>
        <template v-slot:item.DATA_PG="{ value }">
          {{ dataBrasil(value) }}
        </template>
        <template v-slot:item.FORMA_PAGAMENTO="{ item, value }">
          <div class="d-flex align-center justify-center">
            <img
              v-if="value === 'D'"
              class="icone-forma-pagamento"
              src="../assets/money.svg"
            />
            <img
              v-if="value === 'P'"
              class="icone-forma-pagamento"
              src="../assets/pix.svg"
            />
          </div>
        </template>
        <template v-slot:item.ACOES="{ item }">
          <v-icon
            @click="onClickImprimir(item)"
            icon="mdi-printer"
            title="Imprimir"
            class="click"
          />
        </template>
        <template v-slot:bottom></template>
      </v-data-table>
    </div>
    <div class="d-flex align-center justify-space-between mt-4">
      <div class="d-flex align-center justify-end flex-grow-1">
        <v-btn
          v-if="state.valesPagos.length > 0"
          @click="onClickImprimirTodos"
          color="primary"
          >IMPRIMIR TODOS</v-btn
        >
      </div>
    </div>
    <div id="vales-pagos__print" class="vales-pagos__print">
      <div
        v-for="vale in state.valesImpressao"
        style="
          padding: 20px 0 35px;
          border-bottom: 1px solid;
          font-weight: bold;
          font-size: 13px;
        "
      >
        <div>
          <div style="width: 100%; display: flex">
            <div style="width: 50%">
              <span>{{ globalState.empresa.RAZAO_SOCIAL }}</span>
              <br />
              <label style="font-size: 10px">
                Solicitação de
                {{ vale.FORMA_PAGAMENTO === "D" ? "Dinheiro" : "Pix" }}</label
              >
            </div>
            <div style="width: 50%; text-align: right">
              <span style="text-align: right; width: 100%"
                >{{ globalState.DATA }} {{ globalState.HORA }}</span
              >
              <br />
              <label style="font-size: 10px; text-align: right"
                >Pagador.: {{ vale.PAGADOR }}</label
              >
              <br />
              <h2>R$ {{ formatValor(vale.VALOR) }}</h2>
            </div>
          </div>
          <br />
          <div
            style="display: flex; flex-direction: column; align-items: center"
          >
            <label> ____________________________________________________</label>
            <span>{{ vale.NOME }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.vales-pagos {
  &__table {
    height: 400px;
    overflow-y: auto;
  }

  &__print {
    visibility: hidden;
    display: none;
  }
}
.icone-forma-pagamento {
  width: 24px;
  height: 24px;
}
</style>
