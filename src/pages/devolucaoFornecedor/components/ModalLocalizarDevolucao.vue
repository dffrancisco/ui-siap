<script setup lang="ts">
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import { nextTick, reactive, watch, onUnmounted } from "vue";
import Swal from "sweetalert2";

import { iDevolucao, iParamGetDevolucoes } from "../interfaces";
import serviceDevolucaoFornecedor from "../services/devolucaoFornecedor.service";
import utils from "@/ts/utils";
import { useEventListener } from "@vueuse/core";

const emit = defineEmits(["devolucaoSelecionado", "closeModalLocalizarDevolucoes"]);

const props = defineProps<{
  modalLocalizarDevolucoesOpened: boolean;
}>();

watch(
  () => props.modalLocalizarDevolucoesOpened,
  () => {
    if (props.modalLocalizarDevolucoesOpened) {
      state.gridDevolucoes.queryOpen({
        search: "",
      });

      state.search = null;
      state.edtDevolucaoSearch.focus();
    }
  }
);

const state = reactive({
  gridDevolucoes: <ixGridCreate>{},
  dbDevolucao: <iDevolucao>{},

  search: null,
  edtDevolucaoSearch: <HTMLInputElement>{},

  loading: false,
});

const actions = {
  criarGrids() {
    state.gridDevolucoes = new xGridV2.create({
      el: "#gridDevolucoes",
      height: 272,
      count: true,
      columns: {
        Fornecedor: { dataField: "RAZAO_SOCIAL", width: "52%" },
        Status: { dataField: "STATUS", center: true, compare: "colorir" },
        "N° da nota": { dataField: "NUM_NOTA_DEVOLUCAO", center: true },
        Valor: { dataField: "VALOR", center: true, render: utils.formatValor },
      },
      compare: {
        colorir: (r) => {
          if (r.STATUS == 0) {
            return '<span style="color: red">' + "Em andamento" + "<span>";
          } else {
            return '<span style="color: green">' + "Finalizada" + "<span>";
          }
        },
      },
      query: {
        async execute(rs) {
          let data = await actions.getDevolucoes({
            offset: rs.offset,
            param: rs.param,
          });
          state.gridDevolucoes.querySourceAdd(data);
        },
      },
      enter: actions.selecionarDevolucao,
      dblClick: actions.selecionarDevolucao,
    });
  },

  searchDevolucao() {
    state.gridDevolucoes.queryOpen({
      search: state.edtDevolucaoSearch.value.toUpperCase(),
    });
  },

  selecionarDevolucao() {
    const devolucao = state.gridDevolucoes.dataSource();

    if (!devolucao) {
      Swal.fire({
        icon: "warning",
        title: "Selecione uma devolução",
      });
      return;
    }

    emit("devolucaoSelecionado", devolucao);
  },

  closeModalLocalizarDevolucoes() {
    emit("closeModalLocalizarDevolucoes");
  },

  async getDevolucoes({ offset, param }: iParamGetDevolucoes) {
    try {
      state.loading = true;
      const data = await serviceDevolucaoFornecedor.getDevolucoes({ offset, param });
      state.loading = false;

      return data;
    } catch (error) {
      state.loading = false;
      Swal.fire({
        icon: "error",
        title: "Erro ao buscar as devoluções",
      });
    }
  },
};

const eventListener = useEventListener(document, "keydown", async (event) => {
  if (props.modalLocalizarDevolucoesOpened) {
    if (event.key === "F1") {
      state.edtDevolucaoSearch.select();
      event.preventDefault();
      event.stopPropagation();
    }
  }
});

nextTick(async () => {
  actions.criarGrids();

  state.edtDevolucaoSearch = <any>document.getElementById("edtDevolucaoSearch");
});

onUnmounted(() => {
  removeEventListener("keydown", eventListener);
});
</script>

<template>
  <v-container>
    <div class="pb-4">
      <v-row>
        <v-col>
          <input
            type="text"
            placeholder="Pesquisar pelo n° nota devolução , chave ou fornecedor (F1)"
            class="searchDevolucao pa-2"
            v-model="state.search"
            id="edtDevolucaoSearch"
            @keydown.enter="actions.searchDevolucao"
            @keydown.arrow-down="state.gridDevolucoes.focus(0)"
            autocomplete="off"
          />
        </v-col>
        <v-col>
          <v-btn
            size="small"
            class="btnSearch"
            color="#3680AB"
            @click="actions.searchDevolucao"
          >
            <v-icon size="24px">mdi-magnify</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <div id="gridDevolucoes"></div>

    <div class="btns">
      <v-btn
        style="color: #3680ab; border: 1px solid #3680ab"
        @click="actions.closeModalLocalizarDevolucoes"
        >Cancelar</v-btn
      >
      <v-btn
        color="#3680AB"
        @click="actions.selecionarDevolucao"
        >Selecionar</v-btn
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
.searchDevolucao {
  width: 558px;
  border-radius: 8px;
  border: 2px solid #d9d9d9;
  height: 48px;
  text-transform: uppercase;
}

.btnSearch {
  border-radius: 50px;
  height: 50px;
}

.btns {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  gap: 8px;
}
</style>
