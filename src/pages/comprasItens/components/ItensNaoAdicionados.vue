<script setup lang="ts">
import { reactive, nextTick } from "vue";
import { iListaFotoProduto, iParamEmitAdicionarItem, iProduto, iTipoVisualizacao } from "../interfaces";
import { MAP_COL_PRODUTO } from "../constants/constants";
import { formatValor } from "@/ts/utils";
import comprasItensService, {
  getColorCurva,
  getColorDescricao,
  getColorQtdEstoque,
} from "../services/comprasItens.service";
import ModalAdicionarItem from "./ModalAdicionarItem.vue";
import ModalFotoProduto from "./ModalFotoProduto.vue";

const props = defineProps({
  produto: {
    type: Object as () => iProduto,
    default: {},
  },
  qtdJaAdicionada: {
    type: Number,
    default: 0,
  },
  media: {
    type: Number,
    default: 0,
  },
  corMediaVenda: {
    type: String,
    required: true,
  },
  exibirIconeAvancar: {
    type: Boolean,
    required: true,
  },
  exibirIconeVoltar: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["adicionarItem", "avancarItem", "voltarItem"]);

const state = reactive({
  tipoVisualizacao: <iTipoVisualizacao>"unica",
  modalAdicionarItemOpened: false,
  modalFotoProdutoOpened: false,
  listaFotoProduto: <iListaFotoProduto[]>[],
});

const actions = {
  async focarContainerItem() {
    await nextTick();
    //@ts-ignore
    document.querySelector("#containerItem").focus();
  },
  async desfocarContainerItem() {
    await nextTick();
    //@ts-ignore
    document.querySelector("#containerItem").blur();
  },
  adicionarItem(param: iParamEmitAdicionarItem) {
    emit("adicionarItem", param);
    state.modalAdicionarItemOpened = false;
    actions.focarContainerItem();
  },
  onKeydownContainer(e: KeyboardEvent) {
    if (e.key === "Enter") {
      state.modalAdicionarItemOpened = true;
      e.preventDefault();
    }
  },
  async abrirModalFotoProduto() {
    await actions.getListaFotoJson();
    state.modalFotoProdutoOpened = true;
    actions.desfocarContainerItem();
  },
  fecharModalFotoProduto() {
    state.modalFotoProdutoOpened = false;
    actions.focarContainerItem();
  },
  async getListaFotoJson() {
    try {
      let codProduto = props.produto[MAP_COL_PRODUTO.COD_PRODUTO];
      const data = await comprasItensService.getListaFotoJson(codProduto);

      state.listaFotoProduto = data;
    } catch (error) {
      console.log(error);
    }
  },
};
</script>

<template>
  <div
    id="containerItem"
    class="item"
    tabindex="0"
    @keydown="actions.onKeydownContainer"
  >
    <div class="item-info">
      <v-row>
        <v-col
          cols="11"
          class="d-flex flex-column"
        >
          <span>Descrição</span>
          <strong
            class="item-info-value"
            :style="{ color: getColorDescricao(qtdJaAdicionada, produto[MAP_COL_PRODUTO.PRODUTO_NOVO]) }"
          >
            {{ produto[MAP_COL_PRODUTO.DESC_PRODUTO] || "-" }}
            <v-chip
              v-if="produto[MAP_COL_PRODUTO.PRODUTO_NOVO] == 'NEW'"
              color="success"
              variant="outlined"
              size="x-small"
              class="ml-2"
            >
              NOVO
            </v-chip>
            <v-chip
              v-if="qtdJaAdicionada > 0"
              color="primary"
              variant="outlined"
              size="x-small"
              class="ml-2"
              >{{ qtdJaAdicionada }}</v-chip
            >
          </strong>
        </v-col>
        <v-col
          v-if="produto[MAP_COL_PRODUTO.FOTO] == 'F'"
          cols="1"
          class="d-flex align-center"
          title="Ver foto"
        >
          <v-icon @click="actions.abrirModalFotoProduto">mdi mdi-camera</v-icon>
        </v-col>
      </v-row>
      <v-row class="mt-0">
        <v-col
          cols="3"
          class="d-flex flex-column"
        >
          <span>Carro</span>
          <strong class="item-info-value">{{ produto[MAP_COL_PRODUTO.DESCRICAO_CARRO] }}</strong>
        </v-col>
        <v-col
          cols="3"
          class="d-flex flex-column"
        >
          <span>Nº Fabricante</span>
          <strong class="item-info-value">{{ produto[MAP_COL_PRODUTO.NUM_FABRICANTE] }}</strong>
        </v-col>
        <v-col
          cols="2"
          class="d-flex flex-column"
        >
          <span>Nº Fabricante 2</span>
          <strong class="item-info-value">{{ produto[MAP_COL_PRODUTO.NUM_FABRICANTE2] || "-" }}</strong>
        </v-col>
        <v-col
          cols="4"
          class="d-flex flex-column"
        >
          <span>Marca</span>
          <strong class="item-info-value">{{ produto[MAP_COL_PRODUTO.DESCRICAO_MARCA] }}</strong>
        </v-col>
      </v-row>
      <v-row class="mt-0">
        <v-col
          cols="2"
          class="d-flex flex-column py-5"
        >
          <span>Qtd. Atual</span>
          <strong
            class="item-info-value"
            :style="{ color: getColorQtdEstoque(media, produto[MAP_COL_PRODUTO.QUANTIDADE]) }"
          >
            {{ produto[MAP_COL_PRODUTO.QUANTIDADE] }}
          </strong>
        </v-col>
        <v-col
          cols="2"
          class="py-4"
        >
          <div class="d-flex flex-column item-info-media px-2 py-1">
            <span>Média</span>
            <strong class="item-info-value">{{ media }}</strong>
          </div>
        </v-col>
        <v-col
          cols="2"
          class="d-flex flex-column py-5"
        >
          <span>Custo</span>
          <strong class="item-info-value">{{ formatValor(produto[MAP_COL_PRODUTO.CUSTO]) }}</strong>
        </v-col>
        <v-col
          cols="2"
          class="d-flex flex-column py-5"
        >
          <span>Venda</span>
          <strong class="item-info-value">{{ formatValor(produto[MAP_COL_PRODUTO.VENDA]) }}</strong>
        </v-col>
        <v-col
          cols="2"
          class="d-flex flex-column py-5"
        >
          <span>Curva M</span>
          <strong
            class="item-info-value"
            :style="{ color: getColorCurva(produto[MAP_COL_PRODUTO.CURVA_ABC_M]) }"
            >{{ produto[MAP_COL_PRODUTO.CURVA_ABC_M] }}</strong
          >
        </v-col>
        <v-col
          cols="2"
          class="d-flex flex-column py-5"
        >
          <span>Curva G</span>
          <strong
            class="item-info-value"
            :style="{ color: getColorCurva(produto[MAP_COL_PRODUTO.CURVA_ABC_G]) }"
            >{{ produto[MAP_COL_PRODUTO.CURVA_ABC_G] }}</strong
          >
        </v-col>
      </v-row>

      <v-row>
        <v-col
          cols="12"
          class="d-flex flex-column"
          ><span
            class="item-venda-perdida"
            v-if="produto[MAP_COL_PRODUTO.QTD_VENDA_PERDIDA] !== 0"
            ><v-icon>mdi-currency-usd-off</v-icon> No mês anterior o item teve
            <strong>{{ produto[MAP_COL_PRODUTO.QTD_VENDA_PERDIDA] }} </strong> vendas perdidas.</span
          >
          <span
            class="item-consulta-lojas pt-1"
            v-if="produto[MAP_COL_PRODUTO.QTD_CONSULTA_LOJAS] !== 0"
            ><v-icon>mdi-magnify</v-icon> O item foi consultado
            <strong>{{ produto[MAP_COL_PRODUTO.QTD_CONSULTA_LOJAS] }}x </strong>em outras lojas no último
            mês.</span
          >
        </v-col>
      </v-row>
    </div>
    <div class="item-paginacao">
      <div>
        <v-icon
          v-if="exibirIconeVoltar"
          @click="emit('voltarItem')"
          >mdi mdi-arrow-left</v-icon
        >
      </div>
      <div>
        <v-icon
          v-if="exibirIconeAvancar"
          @click="emit('avancarItem')"
          >mdi mdi-arrow-right</v-icon
        >
      </div>
    </div>

    <v-dialog
      v-model="state.modalAdicionarItemOpened"
      max-width="350px"
      transition="dialog-transition"
      scrim="#f2f2f2"
      opacity="0.1"
      @update:modelValue="actions.focarContainerItem"
    >
      <ModalAdicionarItem
        :qtdAtual="produto[MAP_COL_PRODUTO.QUANTIDADE]"
        :qtdAdicionada="qtdJaAdicionada"
        :valorVenda="produto[MAP_COL_PRODUTO.VENDA]"
        :valorCusto="produto[MAP_COL_PRODUTO.CUSTO]"
        :media="media"
        :corMediaVenda="corMediaVenda"
        @adicionarItem="actions.adicionarItem"
      />
    </v-dialog>

    <v-dialog
      v-model="state.modalFotoProdutoOpened"
      max-width="500px"
      transition="dialog-transition"
    >
      <ModalFotoProduto
        :listaFotoProduto="state.listaFotoProduto"
        @fecharModal="actions.fecharModalFotoProduto"
      />
    </v-dialog>
  </div>
</template>

<style>
::-webkit-scrollbar {
  width: 4px;
  height: 3px;
}
::-webkit-scrollbar-track-piece {
  background-color: #000;
}
::-webkit-scrollbar-thumb {
  height: 50px;
  background-color: #666;
  border-radius: 3px;
}
</style>

<style lang="scss" scoped>
.item {
  background-color: var(--grey-900);
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
}

.item:focus {
  border-left: 2px solid var(--info-700);
  border-bottom: 2px solid var(--info-700);
  border-right: 2px solid var(--info-700);
  box-sizing: border-box;
}

.item-info {
  padding: 12px;
  flex-grow: 1;
  font-size: 14px;
  line-height: 16px;
  font-weight: 300;
}

.item-info-value {
  font-size: 18px;
  font-weight: 700;
  line-height: 20px;
  display: flex;
  align-items: center;
}

.item-info-media {
  border: 1px solid var(--grey-800);
  border-radius: 4px;
}

.item-info-media .item-info-value {
  color: var(--success-300);
}

.item-paginacao {
  padding: 8px 12px;
  display: flex;
  justify-content: space-between;
}

.item-consulta-lojas {
  color: var(--warning-500);
}

.item-venda-perdida {
  color: var(--danger-500);
}
</style>
