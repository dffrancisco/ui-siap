<script setup lang="ts">
import { reactive, nextTick, onMounted, watch } from "vue";
import { iOrcamentoBaixa } from "../interface";
import xGrid, { ixGridCreate } from "@/plugins/xGridV2";
import utils from "@/ts/utils";
import Swal from "sweetalert2";

const state = reactive({
  gridEscolherOrcamento: <ixGridCreate>{},
  orcamento: <iOrcamentoBaixa>{},
});

const props = defineProps({
  orcamentos: {
    type: Array as () => iOrcamentoBaixa[],
    default: () => [],
  },
});

watch(
  () => props.orcamentos,
  () => {
    state.gridEscolherOrcamento.source([...props.orcamentos]);
    state.gridEscolherOrcamento.focus(0);
  }
);

const emit = defineEmits(["cancelar", "orcamentoEscolhido"]);

function criarGrids() {
  state.gridEscolherOrcamento = new xGrid.create({
    el: "#gridEscolherOrcamento",
    height: "210",
    heightLine: 40,
    columns: {
      "Nº Orç.": { dataField: "NUM_ORCAMENTO", width: "10%", center: true },
      Data: {
        dataField: "DATA",
        width: "12%",
        center: true,
        compare: "dataBrasil",
      },
      Cliente: { dataField: "CLIENTE" },
      Valor: {
        dataField: "VALOR",
        width: "10%",
        right: true,
        compare: "valor",
      },
      "Tipo Pgto": {
        dataField: "DESCRICAO_PAGAMENTO",
        center: true,
      },
      Motorista: { dataField: "NOME_MOTORISTA" },
    },
    onSelectLine: (orcamento: iOrcamentoBaixa) => {
      state.orcamento = orcamento;
    },
    onKeyDown: {
      13: (ln: iOrcamentoBaixa, e) => {
        escolherOrcamento();
      },
    },
    compare: {
      dataBrasil: (r) => utils.dataBrasil(r.DATA),
      valor: (r) => utils.formatValor(r.VALOR),
    },
  });
}

function onClickCancelar() {
  emit("cancelar");
}

function escolherOrcamento() {
  const orcamento = state.gridEscolherOrcamento.dataSource();

  if (!orcamento) {
    Swal.fire({
      text: "Selecione um orçamento",
      icon: "warning",
    });
    return;
  }

  emit("orcamentoEscolhido", orcamento);
}

onMounted(() => {
  nextTick(() => {
    criarGrids();
  });
});
</script>

<template>
  <div class="modal-escolher-orcamento">
    <div class="mb-2">
      <span>
        Foram encontrados os seguintes orçamentos, selecione o correto:
      </span>
    </div>
    <div id="gridEscolherOrcamento"></div>
    <div class="mt-4 d-flex justify-end">
      <v-btn
        @click="onClickCancelar"
        color="primary"
        variant="outlined"
        class="mr-2"
        >Cancelar</v-btn
      >
      <v-btn @click="escolherOrcamento" color="primary">Selecionar</v-btn>
    </div>
  </div>
</template>

<style scoped lang="scss">
.modal-escolher-orcamento {
  padding: 12px;
}
</style>
