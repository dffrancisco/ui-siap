<script setup lang="ts">
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import { nextTick, reactive, watch, onUnmounted } from "vue";
import { useEventListener } from "@vueuse/core";

import Swal from "sweetalert2";

import { iFornecedor, iParamGetFornecedores } from "../interfaces";
import serviceDevolucaoFornecedor from "../services/devolucaoFornecedor.service";

const emit = defineEmits(["selecionarFornecedor", "closeModalSelecionarFornecedor"]);

const props = defineProps<{
  modalOpened: boolean;
}>();

watch(
  () => props.modalOpened,
  () => {
    if (props.modalOpened) {
      state.gridFornecedores.queryOpen({
        search: "",
      });

      state.search = null;
      state.edtFornecedorSearch.focus();
    }
  }
);

const state = reactive({
  gridFornecedores: <ixGridCreate>{},
  dbFornecedor: <iFornecedor>{},

  search: null,
  edtFornecedorSearch: <HTMLInputElement>{},

  loading: false,
});

const actions = {
  criarGrids() {
    state.gridFornecedores = new xGridV2.create({
      el: "#gridFornecedores",
      height: 272,
      count: true,
      columns: {
        CNPJ: { dataField: "CGC_FORNECEDOR", width: "22%", center: true },
        Fornecedor: { dataField: "RAZAO_SOCIAL" },
      },
      query: {
        async execute(rs) {
          let data = await actions.getFornecedores({
            offset: rs.offset,
            param: rs.param,
          });
          state.gridFornecedores.querySourceAdd(data);
        },
      },
      enter: actions.selecionarFornecedor,
      dblClick: actions.selecionarFornecedor,
    });
  },

  searchFornecedor() {
    state.gridFornecedores.queryOpen({
      search: state.edtFornecedorSearch.value.toUpperCase(),
    });
  },

  selecionarFornecedor() {
    const fornecedor = state.gridFornecedores.dataSource();

    if (!fornecedor) {
      Swal.fire({
        icon: "warning",
        title: "Selecione um fornecedor",
      });
      return;
    }

    emit("selecionarFornecedor", fornecedor);
  },

  closeModalSelecionarFornecedor() {
    emit("closeModalSelecionarFornecedor");
  },

  async getFornecedores({ offset, param }: iParamGetFornecedores) {
    try {
      state.loading = true;
      const data = await serviceDevolucaoFornecedor.getFornecedores({ offset, param });
      state.loading = false;

      return data;
    } catch (error) {
      state.loading = false;
      Swal.fire({
        icon: "error",
        title: "Erro ao buscar os fornecedores",
      });
    }
  },
};

const eventListener = useEventListener(document, "keydown", async (event) => {
  if (props.modalOpened) {
    if (event.key === "F1") {
      state.edtFornecedorSearch.select();
      event.preventDefault();
      event.stopPropagation();
    }
  }
});

nextTick(async () => {
  actions.criarGrids();

  state.edtFornecedorSearch = <any>document.getElementById("edtFornecedorSearch");
});

onUnmounted(() => {
  removeEventListener("keydown", eventListener);
});
</script>

<template>
  <v-container>
    <div class="pb-2">
      <v-row>
        <v-col>
          <input
            type="text"
            placeholder="Pesquisar pelo CNPJ , razão social ou nome fantasia (F1)"
            class="searchFornecedor pa-2"
            v-model="state.search"
            id="edtFornecedorSearch"
            @keydown.enter="actions.searchFornecedor"
            @keydown.arrow-down="state.gridFornecedores.focus(0)"
            autocomplete="off"
          />
        </v-col>
        <v-col>
          <v-btn
            size="small"
            class="btnSearch"
            color="#3680AB"
            @click="actions.searchFornecedor"
          >
            <v-icon size="24px">mdi-magnify</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <div id="gridFornecedores"></div>

    <div class="btns">
      <v-btn
        style="color: #3680ab; border: 1px solid #3680ab"
        @click="actions.closeModalSelecionarFornecedor"
        >Cancelar</v-btn
      >
      <v-btn
        color="#3680AB"
        @click="actions.selecionarFornecedor"
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
.searchFornecedor {
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
