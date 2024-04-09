<script setup lang="ts">
import { reactive, nextTick, watch, onUnmounted } from "vue";
import { useEventListener } from "@vueuse/core";

import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import xModal, { iModalCreate } from "@/plugins/xModal/xModal";
import Swal from "sweetalert2";
import utils from "@/ts/utils";

import { iItem, iParamGetItens, iParamGetItensDevolucaoQTDFunction } from "../interfaces";
import serviceDevolucaoFornecedor from "../services/devolucaoFornecedor.service";
import ModalInformarQtdItem from "./ModalInformarQtdItem.vue";

import produtoSemFotoImg from "../assets/sem_foto.jpg";

const props = defineProps<{
  modalOpened: boolean;
  id_fornecedor: number | undefined;
  id_devolucaoFornecedor: number | undefined;
}>();

const emit = defineEmits(["closeModal", "getDevolucao"]);

watch(
  () => props.modalOpened,
  () => {
    if (props.modalOpened) {
      state.gridEscolherItem.queryOpen({
        search: "",
        ID_FORNECEDOR: props.id_fornecedor,
      });

      state.search = null;
      state.edtItemSearch.focus();
    }
  }
);

const state = reactive({
  gridEscolherItem: <ixGridCreate>{},
  modalInformarQtdItem: <iModalCreate>{},
  dbItem: <iItem>{},
  modalInformaQtdOpened: false,

  search: null,
  edtItemSearch: <HTMLInputElement>{},

  loading: false,
});

const actions = {
  criarGrids() {
    state.gridEscolherItem = new xGridV2.create({
      el: "#gridEscolherItem",
      height: 342,
      title: false,
      columns: {
        ITEM: { dataField: "ITEM", compare: "dados" },
      },
      compare: {
        dados: (r) => {
          let url_foto = "";
          if (r.FOTO == "F") {
            url_foto = `http://www.reallatas.com.br/balcao/foto/${r.COD_PRODUTO}.jpg`;
          } else {
            url_foto = produtoSemFotoImg;
          }

          return `<div style="display: flex; height: 62px; margin-bottom: 10px; width: 100%">
                    <div>
                    <img
                        style="width: 96px; height: 100%; border-radius: 8px;"
                        src="${url_foto}"
                    />
                    </div>
                    <div
                    style="
                        display: flex;
                        flex-direction: column;
                        justify-content: space-around;
                        width: 100%;
                        padding-left: 8px;
                        padding-right: 8px;
                    "
                    >
                    <div style="display: flex; justify-content: space-between">
                        <p style="font-size: 12px; font-weight: 700">${r.DESCRICAO}</p>

                        <p style="font-size: 12px; font-weight: 700">${r.COD_FABRICANTE}</p>
                    </div>
                    <div style="display: flex; flex-direction: row; justify-content: space-between">
                        <p>Nº nota: ${r.NUM_NOTA}</p>

                        <p>Qtd de Itens: ${r.QUANTIDADE}</p>

                        <p>${utils.formatValor(r.CUSTO)}</p>
                    </div>
                    </div>
                  </div>`;
        },
      },
      query: {
        async execute(rs) {
          let data = await actions.getItens({
            offset: rs.offset,
            param: rs.param,
          });
          state.gridEscolherItem.querySourceAdd(data);
        },
      },
      enter: actions.openModalInformarQtdItem,
      dblClick: actions.openModalInformarQtdItem,
    });
  },

  criarModal() {
    state.modalInformarQtdItem = new xModal.create({
      el: "#modalInformarQtdItem",
      height: 410,
      width: 715,
      theme: "xModal-blue",
      onOpen: () => {
        state.modalInformaQtdOpened = true;
      },
      onClose: () => {
        state.modalInformaQtdOpened = false;
        state.gridEscolherItem.focus();
      },
    });
  },

  searchItem() {
    state.gridEscolherItem.queryOpen({
      search: state.edtItemSearch.value.toUpperCase(),
      ID_FORNECEDOR: props.id_fornecedor,
    });
  },

  closeModalEscolherItem() {
    emit("closeModal");
  },

  async openModalInformarQtdItem() {
    const item = state.gridEscolherItem.dataSource();

    state.dbItem = { ...item };

    if (!item) {
      Swal.fire({
        icon: "warning",
        title: "Selecione um item",
      });
      return;
    }

    await actions.getItensDevolucaoQTD();

    if (state.dbItem.QUANTIDADE <= 0) {
      Swal.fire({
        icon: "error",
        title: "Não há mais itens disponíveis para devolver!",
      });
      return;
    }

    state.modalInformarQtdItem.open();
  },

  closeModalInformarQtdItem() {
    state.modalInformarQtdItem.close();
  },

  getDevolucao() {
    actions.closeModalEscolherItem();
    state.modalInformarQtdItem.close();
    emit("getDevolucao");
  },

  async getItens({ offset, param }: iParamGetItens) {
    try {
      state.loading = true;
      const data = await serviceDevolucaoFornecedor.getItens({ offset, param });
      state.loading = false;

      return data;
    } catch (error) {
      state.loading = false;
      Swal.fire({
        icon: "error",
        title: "Erro ao buscar os itens!",
      });
    }
  },

  async getItensDevolucaoQTD() {
    try {
      state.loading = true;

      let param: iParamGetItensDevolucaoQTDFunction = {
        ID_NF_ENTRADA_ITEM: state.dbItem.ID_ITEM,
        ID_NF_ENTRADA_MANIFESTO: state.dbItem.ID_ENTRADA,
      };

      let data = await serviceDevolucaoFornecedor.getItensDevolucaoQTD(param);

      state.dbItem.QUANTIDADE = state.dbItem.QUANTIDADE - data.QTD;

      state.loading = false;
    } catch (error) {
      state.loading = false;
      Swal.fire({
        icon: "error",
        text: "Erro ao buscar a qtd de item já devolvida!",
      });
    }
  },
};

const eventListener = useEventListener(document, "keydown", async (event) => {
  if (props.modalOpened) {
    if (event.key === "F1") {
      state.edtItemSearch.select();
      event.preventDefault();
      event.stopPropagation();
    }
  }
});

nextTick(async () => {
  actions.criarGrids();
  actions.criarModal();

  state.edtItemSearch = <any>document.getElementById("edtItemSearch");
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
            placeholder="Pesquisar pelo nº fabricante ou descrição (F1)"
            class="searchDevolucao pa-2"
            v-model="state.search"
            id="edtItemSearch"
            autocomplete="off"
            @keydown.enter="actions.searchItem"
            @keydown.arrow-down="state.gridEscolherItem.focus(0)"
          />
        </v-col>
        <v-col>
          <v-btn
            size="small"
            class="btnSearch"
            color="#3680AB"
            @click="actions.searchItem"
          >
            <v-icon size="24px">mdi-magnify</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <div id="gridEscolherItem"></div>

    <div class="btns d-flex justify-end">
      <v-btn
        style="color: #3680ab; border: 1px solid #3680ab"
        @click="actions.closeModalEscolherItem"
        >Cancelar</v-btn
      >
      <v-btn
        color="#3680AB"
        @click="actions.openModalInformarQtdItem"
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

    <div
      id="modalInformarQtdItem"
      style="display: none"
      title="Informar Qtd"
    >
      <ModalInformarQtdItem
        :modalInformaQtdOpened="state.modalInformaQtdOpened"
        :dbItem="state.dbItem"
        :id_devolucaoFornecedor="props.id_devolucaoFornecedor"
        @closeModalInformarQtdItem="actions.closeModalInformarQtdItem"
        @salvarItem="actions.getDevolucao"
      ></ModalInformarQtdItem>
    </div>
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
  margin-top: 10px;
  gap: 8px;
}
</style>
