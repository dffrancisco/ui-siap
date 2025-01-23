<script lang="ts" setup>
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import { onMounted, reactive, ref } from "vue";
import { iCarrinhoInsumos, iCategorias, iItemAdcPedido, iItens, iPedidosInsumos } from "../interfaces";
import serviceSolicitarInsumos from "../services/solicitarInsumos.service";
import Swal from "sweetalert2";
import { useEventListener } from "@vueuse/core";
import ModalQtdInsumoPedido from "./ModalQtdInsumoPedido.vue";
const emits = defineEmits(["closeModalPedidoInsumos", "atualizarPedidoFinalizado"]);
const inputSearch = ref();

const props = defineProps<{
  modalOpened: boolean;
  pedidoSelecionado: iPedidosInsumos | null;
  novoPedido: boolean;
  categorias: iCategorias[];
}>();

const state = reactive({
  loading: false,
  gridItens: <ixGridCreate>{},
  gridCarrinho: <ixGridCreate>{},
  dbItens: <iItens[]>[],
  dbCategorias: <iCategorias[]>[],
  dbCarrinho: <iCarrinhoInsumos[]>[],
  categoriaSelecionada: 1 as number | null,
  categoriaAnterior: 0 as number | null,
  search: "",
  itemSelecionado: null as iItens | null,
  id_insumo_pedido: null as number | null,
  modalQtdItemPedidoOpened: false,
  idItemDeletar: null as number | null,
  desativarBtns: false,
});

const actions = {
  async init() {
    state.dbCategorias = props.categorias;
    actions.criarGrid();
    await actions.verificarSeTemPedido();
    actions.getItens();
  },

  verificarSeTemPedido() {
    if (props.novoPedido == true) {
      actions.iniciarPedido();
      return;
    }

    if (!props.pedidoSelecionado || !props.pedidoSelecionado.itens) {
      console.warn("Nenhum pedido selecionado ou itens ausentes.");
      return;
    }

    if (props.pedidoSelecionado.FINALIZADO == "S") {
      state.desativarBtns = true;
    }

    const pedidoItens = props.pedidoSelecionado.itens || [];
    state.dbCarrinho = pedidoItens.map((item) => ({
      ...item,
      QTD: item.QTD || 1,
      ID_INSUMO_PEDIDO: props.pedidoSelecionado.ID_INSUMO_PEDIDO,
      ID_INSUMO_PEDIDO_ITEM: item.ID_INSUMO_ITEM,
    }));
    state.id_insumo_pedido = props.pedidoSelecionado.ID_INSUMO_PEDIDO;

    state.gridCarrinho.source(state.dbCarrinho);
  },

  criarGrid() {
    state.gridItens = new xGridV2.create({
      el: "#gridItens",
      count: true,
      height: 340,
      columns: {
        Descrição: { dataField: "DESCRICAO", style: "text-align: center" },
      },
      enter: () => actions.adicionarItemAoCarrinho(),
      dblClick: () => actions.adicionarItemAoCarrinho(),
    });
    state.gridCarrinho = new xGridV2.create({
      el: "#gridCarrinho",
      count: true,
      height: 405,
      width: 280,
      columns: {
        Descrição: { dataField: "DESCRICAO", style: "text-align: left; margin-left: 10px;" },
        Qtd: { dataField: "QTD", width: "20%", style: "text-align: center" },
        Ações: { dataField: "Acoes", compare: "acao", width: "20%", style: "text-align: center" },
      },
      compare: {
        acao: (r) => {
          let iconLixeira = "src/pages/solicitarInsumos/assets/icons8-lixo.svg";

          return `<img
                title="Excluir Item"
                class="delete-icon"
                data-id="${r.ID_INSUMO_ITEM}"
                src="${iconLixeira}"
                style="cursor: pointer;">`;
        },
      },
      onKeyDown: {
        46: () => {
          actions.deletarItem();
        },
      },
    });
  },

  async iniciarPedido() {
    try {
      state.loading = true;

      let data = await serviceSolicitarInsumos.iniciarPedido();
      state.id_insumo_pedido = data.ID_INSUMO_PEDIDO;
    } catch (e) {
      Swal.fire({
        icon: "error",
        text: "Erro ao iniciar o pedido",
      });
      return;
    } finally {
      state.loading = false;
    }
  },

  async getItens() {
    if (props.pedidoSelecionado && props.pedidoSelecionado?.FINALIZADO == "S") {
      return;
    }

    try {
      state.loading = true;
      state.gridItens.clear();
      state.dbItens = [];

      if (state.search == null) {
        state.search = "";
      }

      let param = {
        search: state.search,
        categoria: state.categoriaSelecionada,
      };

      const data = await serviceSolicitarInsumos.getItens(param);
      state.dbItens = data as iItens[];
      state.gridItens.source(state.dbItens);

      state.categoriaAnterior = state.categoriaSelecionada;

      return data;
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Erro ao exibir os itens",
      });
      return;
    } finally {
      state.loading = false;
    }
  },

  closeModalPedidoInsumos() {
    emits("closeModalPedidoInsumos", state.dbCarrinho);
  },

  async btnSearch() {
    await actions.getItens();
  },

  adicionarItemAoCarrinho() {
    if (state.desativarBtns == true) {
      Swal.fire({
        icon: "info",
        text: "Pedido já finalizado, não é possível adicionar item!",
        timer: 1500,
      });
      return;
    }

    let itemSelecionado = state.gridItens.dataSource() as iItens;

    const itemJaNoCarrinho = state.dbCarrinho.some(
      (item) => item.ID_INSUMO_ITEM === itemSelecionado.ID_INSUMO_ITEM
    );

    if (itemJaNoCarrinho) {
      Swal.fire({
        icon: "warning",
        text: "Item já está no carrinho",
      });
      return;
    }

    state.itemSelecionado = itemSelecionado;
    state.modalQtdItemPedidoOpened = true;
  },

  async salvarQuantidade(quantidade) {
    if (!state.itemSelecionado) return;

    const itemComQuantidade: iItemAdcPedido = {
      ...state.itemSelecionado,
      QTD: quantidade,
      ID_INSUMO_PEDIDO: state.id_insumo_pedido,
      ID_INSUMO_PEDIDO_ITEM: null,
    };

    let data = await serviceSolicitarInsumos.adicionarItemAoPedido(itemComQuantidade);

    const itemAdicionarAoCarrinho: iItemAdcPedido = {
      ...itemComQuantidade,
      ID_INSUMO_PEDIDO_ITEM: data.ID_INSUMO_PEDIDO_ITEM,
    };

    state.dbCarrinho.push(itemAdicionarAoCarrinho);
    state.gridCarrinho.source(state.dbCarrinho);

    state.modalQtdItemPedidoOpened = false;
  },

  async deletarItem() {
    if (state.desativarBtns == true) {
      Swal.fire({
        icon: "info",
        text: "Pedido já finalizado, não é possível deletar item!",
        timer: 1500,
      });
      return;
    }
    let idItem = state.gridCarrinho.dataSource().ID_INSUMO_PEDIDO_ITEM;
    if (idItem == undefined) {
      return;
    }

    Swal.fire({
      title: "Deseja excluir esse item do pedido?",
      showCancelButton: true,
      confirmButtonText: "Excluir",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await serviceSolicitarInsumos.removerItemDoPedido(idItem);

        state.dbCarrinho = state.dbCarrinho.filter((item) => item.ID_INSUMO_PEDIDO_ITEM !== parseInt(idItem));
        state.gridCarrinho.source(state.dbCarrinho);

        Swal.fire({
          icon: "success",
          text: "Item excluído do carrinho com sucesso!",
          timer: 500,
        });
      }
    });
  },

  async finalizarPedido() {
    try {
      Swal.fire({
        icon: "question",
        title: "Ao finalizar o pedido, será enviado para aprovação e não poderá ser reaberto, deseja continuar?",
        showCancelButton: true,
        confirmButtonText: "Sim",
        cancelButtonText: "Não",
      }).then(async (result) => {
        if (result.isConfirmed) {
          state.loading = true;
          await serviceSolicitarInsumos.finalizarPedido(state.id_insumo_pedido);

          Swal.fire({
            icon: "success",
            text: "Pedido finalizado com sucesso!",
            timer: 1200,
          });
          emits("atualizarPedidoFinalizado");
        }
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Erro ao finalizar o pedido",
      });
    } finally {
      state.loading = false;
    }
  },
};

useEventListener(document, "keydown", async (event) => {
  if (event.key === "F1") {
    inputSearch.value.focus();
    event.preventDefault();
    event.stopPropagation();
  }
});

onMounted(async () => {
  await actions.init();

  const gridCarrinho = document.getElementById("gridCarrinho");

  //evento clique para deletar item do carrinho
  gridCarrinho?.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;

    if (target && target.classList.contains("delete-icon")) {
      const itemId = target.getAttribute("data-id");

      if (itemId) {
        actions.deletarItem();
      }
    }
  });
});
</script>
<template>
  <v-card class="pa-4">
    <v-row class="pt-2">
      <v-col cols="7">
        <v-row>
          <v-col
            style="margin-top: -10px"
            v-for="categoria in state.dbCategorias"
            :key="categoria.ID_INSUMO_CATEGORIA"
            cols="6"
            md="6"
            lg="4"
          >
            <v-card
              class="categoria-card"
              :class="{ 'selected-card': state.categoriaSelecionada == categoria.ID_INSUMO_CATEGORIA }"
              :disabled="state.desativarBtns"
              @click="
                () => {
                  if (state.categoriaSelecionada !== categoria.ID_INSUMO_CATEGORIA) {
                    state.categoriaAnterior = state.categoriaSelecionada;
                    state.categoriaSelecionada = categoria.ID_INSUMO_CATEGORIA;
                    actions.getItens();
                  }
                }
              "
            >
              <v-card-title class="categoria-title">{{ categoria.CATEGORIA }}</v-card-title>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <div class="d-flex ga-2">
              <v-text-field
                label="Pesquisar Itens (F1)"
                v-model="state.search"
                :clearable="true"
                autofocus
                ref="inputSearch"
                @keydown.enter.prevent="actions.btnSearch"
                @keydown.arrow.down.prevent="state.gridItens.focus()"
                :disabled="state.desativarBtns"
              ></v-text-field>

              <div class="d-flex align-center">
                <v-btn
                  icon="mdi-magnify"
                  size="39"
                  color="primary"
                  @click="actions.btnSearch"
                  :disabled="state.desativarBtns"
                />
              </div>
            </div>
          </v-col>
        </v-row>

        <div
          class="mt-4"
          id="gridItens"
        ></div>
      </v-col>
      <v-divider
        vertical
        class="divider"
        :thickness="4"
      ></v-divider>
      <v-col
        class="ml-2"
        cols="4.5"
      >
        <v-card class="d-flex cardCarrinho"
          ><span class="ml-1">Carrinho de Insumos</span>
          <v-icon
            class="iconCarrinho"
            size="x-large"
            color="primary"
            >mdi-cart</v-icon
          >
          <v-chip class="vChipCarrinho">{{ state.dbCarrinho.length }}</v-chip>
        </v-card>

        <div
          class="mt-4"
          id="gridCarrinho"
        ></div>
        <div class="d-flex justify-center mt-2">
          <v-btn
            variant="outlined"
            color="primary"
            class="mr-1"
            @click="actions.closeModalPedidoInsumos()"
            >Cancelar</v-btn
          >
          <v-btn
            color="primary"
            class="ml-2"
            @click="actions.finalizarPedido"
            :disabled="state.desativarBtns"
          >
            Finalizar Pedido
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-card>
  <v-dialog
    style="left: 30%"
    v-model="state.modalQtdItemPedidoOpened"
    transition="dialog-transition"
    variant="flat"
    :persistent="false"
    @click:outside="state.modalQtdItemPedidoOpened = false"
    ><ModalQtdInsumoPedido
      :item="state.itemSelecionado"
      @confirmQtd="actions.salvarQuantidade"
      @closeModalQtdInsumoPedido="state.modalQtdItemPedidoOpened = false"
    ></ModalQtdInsumoPedido>
  </v-dialog>
</template>

<style scoped>
.selected-card {
  border: 2px solid #1976d2;
  background-color: #e3f2fd;
}

.categoria-title {
  font-size: 14px;
  text-align: center;
  line-height: 1.4;
}

.cardCarrinho {
  justify-content: space-between;
  padding: 10px;
}

.iconCarrinho {
  margin-left: 90px;
}

.vChipCarrinho {
  background-color: #e3f2fd;
  color: #1976d2;
  border-radius: 50px;
  border: 1px solid rgb(9, 74, 214);
  padding: 5px;
  height: 20px;
}
</style>
