<script setup lang="ts">
import utils from "@/ts/utils";
import { computed, reactive, ref, watch } from "vue";
import { iOrcamento, iValeFuncionario } from "../interfaces";
import Loading from "@/components/Loading.vue";
import Swal from "sweetalert2";
import valePecaAutorizacaoService from "../valePecaAutorizacao.service";
import xAuthManager from "@/plugins/xAuthManager";
import modalXAuthManager from "@/plugins/xAuthManager/index.vue";

const props = defineProps({
  codFuncionario: {
    type: Number,
    default: null,
  },
  valesFuncionario: {
    type: Array as () => iValeFuncionario[],
    default: [],
  },
  orcamento: {
    type: Object as () => iOrcamento,
    default: null,
  },
});

const emits = defineEmits(["pesquisarOrc", "liberarFuncionario", "liberarVale"]);

watch(
  () => props.codFuncionario,
  () => {
    state.inputOrc = null;
  }
);

const selectParcelamento = [
  {
    label: "1 X DESCONTO 16%",
    value: 1,
  },
  {
    label: "2 X DESCONTO 16%",
    value: 2,
  },
  {
    label: "3 X DESCONTO 16%",
    value: 3,
  },
  {
    label: "4 X DESCONTO 14%",
    value: 4,
  },
  {
    label: "5 X DESCONTO 14%",
    value: 5,
  },
  {
    label: "6 X DESCONTO 12%",
    value: 6,
  },
  {
    label: "7 X DESCONTO 12%",
    value: 7,
  },
  {
    label: "8 X DESCONTO 8%",
    value: 8,
  },
  {
    label: "9 X DESCONTO 5%",
    value: 9,
  },
  {
    label: "10 X DESCONTO 5%",
    value: 10,
  },
];

const state = reactive({
  btnLiberarGerenteDisabled: true,
  parcelaSelect: 1,
  inputOrc: null,
  senhaFuncionarioOpened: false,
  inputSenhaFuncionario: null,
  loading: false,
});

const actions = {
  limparConfig() {
    state.parcelaSelect = 1;
    state.btnLiberarGerenteDisabled = true;
  },

  pesquisarOrc() {
    if (!state.inputOrc || state.inputOrc <= 0 || state.inputOrc == props.orcamento?.NUM_ORCAMENTO) {
      return;
    }

    actions.limparConfig();

    emits("pesquisarOrc", state.inputOrc);
  },

  openSenhaFuncionario() {
    state.inputSenhaFuncionario = null;
    state.senhaFuncionarioOpened = true;
  },

  async liberarFuncionario() {
    try {
      if (!state.inputSenhaFuncionario || state.inputSenhaFuncionario == "") {
        return;
      }

      state.loading = true;

      const data = await valePecaAutorizacaoService.getAutorizacaoFuncionario({
        senha: utils.base64_encode(state.inputSenhaFuncionario),
        codFuncionario: props.codFuncionario,
      });

      if (data?.error) {
        Swal.fire({
          icon: "warning",
          title: data.msg,
        });
        return;
      }

      state.btnLiberarGerenteDisabled = false;
      state.senhaFuncionarioOpened = false;
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Erro ao liberar funcionario",
      });
    } finally {
      state.loading = false;
    }
  },

  async liberarGerente() {
    xAuthManager("Senha Gerente", async (data) => {
      try {
        state.loading = true;

        let response = await valePecaAutorizacaoService.liberarVale({
          authGerente: data.data,
          codFuncionario: props.codFuncionario,
          divisao: state.parcelaSelect,
          orc: props.orcamento.NUM_ORCAMENTO,
          valorParcela: computeds.descontoOrcamento.value.valorParcela,
        });

        if (response.success) {
          Swal.fire({
            icon: "success",
            title: response.msg,
          });

          actions.limparConfig();
          emits("liberarVale");
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Erro ao liberar vale.",
        });
      } finally {
        state.loading = false;
      }
    });
  },
};

const computeds = {
  devendo: computed(() => {
    return props.valesFuncionario.reduce((total, vale) => {
      return vale.QUITADO === "NAO" ? total + vale.VALOR : total;
    }, 0);
  }),

  ultimaParcela: computed(() => {
    return props.valesFuncionario[props.valesFuncionario.length - 1]?.VALOR;
  }),

  parcelasNaoQuitadas: computed(() => {
    let parcelas = 0;

    props.valesFuncionario.forEach((vale) => {
      if (vale.QUITADO == "NAO") {
        parcelas++;
      }
    });

    return parcelas;
  }),

  descontoOrcamento: computed(() => {
    let descontoValor = 0;
    let valorParcela = 0;
    let decontoPercento = 0;
    let parcelas = state.parcelaSelect;

    switch (true) {
      case [1, 2, 3].includes(state.parcelaSelect):
        decontoPercento = 16;
        break;
      case [4, 5].includes(state.parcelaSelect):
        decontoPercento = 14;
        break;
      case [6, 7].includes(state.parcelaSelect):
        decontoPercento = 12;
        break;
      case state.parcelaSelect === 8:
        decontoPercento = 8;
        break;
      case [9, 10].includes(state.parcelaSelect):
        decontoPercento = 5;
        break;
      default:
        decontoPercento = 0;
    }

    if (!props.orcamento?.VALOR) {
      return {
        descontoValor: 0,
        valorParcela: 0,
      };
    }

    descontoValor = props.orcamento.VALOR - props.orcamento.VALOR * (decontoPercento / 100);
    valorParcela = descontoValor / parcelas;

    return {
      descontoValor,
      valorParcela,
    };
  }),
};
</script>

<template>
  <v-card
    class="d-flex flex-column flex-grow-1"
    variant="outlined"
    color="grey-darken-1"
  >
    <div class="text-black pa-2 d-flex flex-column flex-grow-1">
      <span>Informações</span>
      <div class="d-flex flex-column mt-2 text-body-1 ga-2">
        <div class="d-flex justify-space-between">
          <strong>Devendo: </strong>
          <span>R$ {{ utils.formatValor(computeds.devendo.value) }}</span>
        </div>
        <div class="d-flex justify-space-between">
          <strong>Última Parcela: </strong>
          <span>R$ {{ utils.formatValor(computeds.ultimaParcela.value) }}</span>
        </div>
        <div class="d-flex justify-space-between">
          <strong>Parcelas Não Quitadas: </strong>
          <span>{{ computeds.parcelasNaoQuitadas.value }}</span>
        </div>
      </div>

      <v-divider class="my-2"></v-divider>

      <div>
        <span>N° Orçamento</span>
        <div class="d-flex align-center ga-2">
          <v-text-field
            v-model="state.inputOrc"
            density="compact"
            :disabled="!props.codFuncionario"
            @keypress.enter="actions.pesquisarOrc"
          ></v-text-field>
          <v-btn
            color="primary"
            size="small"
            icon="mdi-magnify mdi-24px"
            :disabled="!props.codFuncionario"
            @click="actions.pesquisarOrc"
          ></v-btn>
        </div>
      </div>

      <v-divider class="my-2"></v-divider>

      <div>
        <span>Parcelamento</span>
        <v-select
          :disabled="!props.orcamento?.NUM_ORCAMENTO"
          :clearable="false"
          v-model="state.parcelaSelect"
          :items="selectParcelamento"
          item-title="label"
          item-value="value"
        ></v-select>
      </div>

      <v-divider class="my-2"></v-divider>

      <div class="d-flex flex-column text-body-1 ga-2">
        <div class="d-flex justify-space-between">
          <strong>Valor: </strong>
          <span>R$ {{ utils.formatValor(props.orcamento?.VALOR) }}</span>
        </div>
        <div class="d-flex justify-space-between">
          <strong>Valor Parcela: </strong>
          <span>R$ {{ utils.formatValor(computeds.descontoOrcamento.value.valorParcela) }}</span>
        </div>
      </div>

      <v-divider class="my-2"></v-divider>

      <div class="d-flex pa-2 flex-column ga-4 flex-grow-1 justify-center">
        <v-btn
          :disabled="!props.codFuncionario || !props.orcamento?.NUM_ORCAMENTO || !state.btnLiberarGerenteDisabled"
          size="small"
          color="primary"
          @click="actions.openSenhaFuncionario"
          >liberar funcionário</v-btn
        >

        <v-btn
          :disabled="state.btnLiberarGerenteDisabled"
          size="small"
          color="primary"
          @click="actions.liberarGerente"
          >liberar gerente</v-btn
        >
      </div>
    </div>
  </v-card>

  <v-dialog
    v-model="state.senhaFuncionarioOpened"
    max-width="250"
    :retain-focus="false"
  >
    <v-card>
      <v-card-item>
        <span>Senha Funcionário</span>
        <v-text-field
          v-model="state.inputSenhaFuncionario"
          autofocus
          maxlength="10"
          type="password"
          :clearable="false"
          @keypress.enter="actions.liberarFuncionario"
        ></v-text-field>
      </v-card-item>
      <v-card-actions>
        <v-btn
          size="small"
          @click="state.senhaFuncionarioOpened = false"
          >cancelar</v-btn
        >
        <v-btn
          size="small"
          :disabled="!state.inputSenhaFuncionario || state.inputSenhaFuncionario.trim() == ''"
          color="primary"
          >verificar</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>

  <modalXAuthManager />

  <Loading :loading="state.loading" />
</template>
