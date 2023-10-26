<script setup lang="ts">
import { reactive, computed, nextTick } from "vue";
import { iValeAPagar } from "../interface";
import { formatValor } from "@/ts/utils";
import { msgConfirm } from "@/ts/message";
import xModal, { iModalCreate } from "@/plugins/xModal/xModal";
import xAuthManager from "@/plugins/xAuthManager";
import modalXAuthManager from "@/plugins/xAuthManager/index.vue";

const props = defineProps({
  loading: {
    type: Boolean,
    default: true,
  },
  valesAPagar: {
    type: Array as () => iValeAPagar[],
    default: () => [],
  },
  valorDisponivel: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["negarVale", "alterarVale", "pagarVale"]);

const state = reactive({
  itensSelecionados: <iValeAPagar[]>[],
  pnAlterarVale: <iModalCreate>(<unknown>null),
  itemAlteracao: <iValeAPagar>{},
  valorValeAlteracao: "0,00",
});

const codFuncionariosSelecionados = computed(() => {
  return state.itensSelecionados.map((item) => item.COD_FUNCIONARIO);
});

const criarModais = () => {
  state.pnAlterarVale = new xModal.create({
    height: 220,
    width: 600,
    el: "#pnAlterarVale",
    onOpen: () => {
      (<HTMLInputElement>document.getElementById("edtValorVale")).focus();
    },
    buttons: {
      Cancelar: {
        html: "Cancelar",
        click() {
          state.pnAlterarVale.close();
        },
      },
      Alterar: {
        html: "Salvar",
        click() {
          emitirAlteracaoVale();
        },
      },
    },
  });
};

const onClickFormaPagamento = (item: iValeAPagar) => {
  const formaPagamentoAtual = item.FORMA_PAGAMENTO;
  item.FORMA_PAGAMENTO = formaPagamentoAtual === "D" ? "P" : "D";
};

const valorTotalDinheiro = computed(() => {
  let valor = 0;

  props.valesAPagar.forEach((item) => {
    if (
      item.FORMA_PAGAMENTO === "D" &&
      codFuncionariosSelecionados.value.includes(item.COD_FUNCIONARIO)
    ) {
      valor += item.VALOR;
    }
  });

  return valor;
});

const valorTotalPix = computed(() => {
  let valor = 0;
  props.valesAPagar.forEach((item) => {
    if (
      item.FORMA_PAGAMENTO === "P" &&
      codFuncionariosSelecionados.value.includes(item.COD_FUNCIONARIO)
    ) {
      valor += item.VALOR;
    }
  });

  return valor;
});

const pagamentoIndisponivel = computed(() => {
  if (props.valorDisponivel == 0) {
    return true;
  }

  return valorTotalDinheiro.value > props.valorDisponivel ? true : false;
});

const disableBotaoPagar = computed(() => {
  if (state.itensSelecionados.length === 0) {
    return true;
  }

  if (props.loading || pagamentoIndisponivel.value) {
    return true;
  }

  return false;
});

const onClickNegar = async (item: iValeAPagar) => {
  const confirmado = await msgConfirm(
    "Confirmação",
    `Gostaria de negar o vale do(a) ${item.NOME}`
  );

  if (confirmado) {
    emit("negarVale", item);
  }
};

const onClickAlterar = async (item: iValeAPagar) => {
  state.itemAlteracao = item;
  state.valorValeAlteracao = formatValor(item.VALOR);
  state.pnAlterarVale.open();
};

const onClickPagar = async () => {
  xAuthManager("Autorizar Pagamento", (dados) => {
    const funcionarios = state.itensSelecionados.map((funcionario) => {
      return {
        COD_FUNCIONARIO: funcionario.COD_FUNCIONARIO,
        DATA: funcionario.DATA,
        FORMA_PAGAMENTO: funcionario.FORMA_PAGAMENTO,
      };
    });
    emit("pagarVale", funcionarios, dados.cod_funcionario);
  });
};

const emitirAlteracaoVale = () => {
  state.pnAlterarVale.close();
  emit("alterarVale", {
    ...state.itemAlteracao,
    novoValor: state.valorValeAlteracao,
  });
};

nextTick(() => {
  criarModais();
});
</script>

<template>
  <div>
    <div class="vales-a-pagar__table">
      <v-data-table
        v-model="state.itensSelecionados"
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
        :items="props.valesAPagar"
        :items-per-page="-1"
        :hide-default-footer="true"
        :loading="loading"
        :show-select="true"
        :return-object="true"
        no-data-text="Nenhum vale disponível"
        loading-text="aguarde..."
        item-value="COD_FUNCIONARIO"
        class="elevation-1"
        color="primary"
      >
        <template v-slot:item.VALOR="{ value }">
          {{ formatValor(value) }}
        </template>
        <template v-slot:item.FORMA_PAGAMENTO="{ item, value }">
          <div class="d-flex align-center justify-center">
            <img
              v-if="value === 'D'"
              @click="onClickFormaPagamento(item)"
              class="icone-forma-pagamento"
              src="../assets/money.svg"
            />
            <img
              v-if="value === 'P'"
              @click="onClickFormaPagamento(item)"
              class="icone-forma-pagamento"
              src="../assets/pix.svg"
            />
          </div>
        </template>
        <template v-slot:item.ACOES="{ item }">
          <v-icon
            @click="onClickAlterar(item)"
            icon="mdi-pen"
            title="Alterar valor"
            class="mr-2"
          />
          <v-icon
            @click="onClickNegar(item)"
            icon="mdi-block-helper"
            color="error"
            title="Negar vale"
          />
        </template>
        <template v-slot:bottom></template>
      </v-data-table>
    </div>
    <div class="d-flex align-center justify-space-between mt-4">
      <div class="d-flex flex-column flex-grow-1">
        <span> Valor disponível para vales: </span>
        <v-skeleton-loader :loading="loading" type="text" max-width="120px">
          <span class="text-h6"> R$ {{ formatValor(valorDisponivel) }} </span>
        </v-skeleton-loader>
      </div>
      <div
        class="d-flex flex-column flex-grow-1"
        :class="{
          'text-red': !loading && pagamentoIndisponivel,
        }"
      >
        <span> Total Dinheiro </span>
        <span class="text-h6"> R$ {{ formatValor(valorTotalDinheiro) }} </span>
      </div>
      <div class="d-flex flex-column flex-grow-1">
        <span> Total PIX </span>
        <span class="text-h6"> R$ {{ formatValor(valorTotalPix) }} </span>
      </div>
      <div class="d-flex align-center justify-center flex-grow-1">
        <v-btn
          @click="onClickPagar"
          color="primary"
          :disabled="disableBotaoPagar"
          >PAGAR</v-btn
        >
      </div>
    </div>

    <div id="pnAlterarVale" title="Alterar Vale">
      <div class="pa-4">
        <v-row>
          <v-col cols="8">
            <span>Funcionário:</span><br />
            <span
              ><strong>{{ state.itemAlteracao.NOME }}</strong></span
            >
          </v-col>
          <v-col>
            <v-text-field
              style="height: 50px"
              id="edtValorVale"
              v-model="state.valorValeAlteracao"
              label="Valor"
              class="inputRight"
              :clearable="false"
              v-mask-decimal.br="2"
              @keypress.enter="emitirAlteracaoVale()"
              @focus.native="$event.target.select()"
            ></v-text-field>
          </v-col>
        </v-row>
      </div>
    </div>

    <modalXAuthManager />
  </div>
</template>

<style lang="scss" scoped>
.vales-a-pagar__table {
  height: 400px;
  overflow-y: auto;
}
.icone-forma-pagamento {
  width: 36px;
  height: 36px;
  cursor: pointer;
}
</style>
