<script setup lang="ts">
import { useRoute } from "vue-router";
import CardOrcamento from "./components/cardOrcamento.vue";
import CardOrcamentoGroup from "./components/cardOrcamentoGroup.vue";
import CardPesquisaOrcamento from "./components/cardPesquisaOrcamento.vue";
import { actions, computeds, state } from "./cabongoOrcamento";
import ModalAlterarProduto from "./components/modalAlterarProduto.vue";
import ModalAdicionarItem from "./components/modalAdicionarItem.vue";
import { reactive } from "vue";
import { iItemOrcamento } from "./interface";

const route = useRoute();
state.id_sociedade = parseInt(route?.query?.id_sociedade as string);
state.meuCNPJ = route?.query.meuCNPJ as string;
state.dataOrcamento = route?.query?.data as string;
const itensSelecionados = reactive({
  endEstoque: "",
  endExcesso: "",
  quantidadeProduto: 0,
  acao: "",
});

function abrirModalAlterProduto(tipo: "quantidade" | "endEstoque", props: iItemOrcamento) {
  itensSelecionados.endEstoque = props.END_ESTOQUE;
  itensSelecionados.endExcesso = props.END_EXCESSO;
  itensSelecionados.quantidadeProduto = props.QUANTIDADE_ESTOQUE;
  itensSelecionados.acao = tipo;
  actions.modalAlterarProdutoOpened();
}

actions.init();
</script>
<template>
  <v-container>
    <title>Cabongo-orçamento</title>
    <v-card
      class="pa-5"
      style="max-width: 900px; min-height: 500px; max-height: 700px; margin: 0 auto; overflow-y: auto"
    >
      <label></label>
      <CardPesquisaOrcamento />
      <CardOrcamentoGroup
        v-for="orcamentoLoja in computeds.orcamento.value"
        :num-orcamento="orcamentoLoja.dadosOrcamento.NUM_ORCAMENTO"
        :status-orcamento="orcamentoLoja.dadosOrcamento.STATUS"
        :data-orcamento="orcamentoLoja.dadosOrcamento.DATA"
        :hora-orcamento="orcamentoLoja.dadosOrcamento.HORA"
        :valor-orcamento="orcamentoLoja.dadosOrcamento.VALOR"
        :status-bg="orcamentoLoja.dadosOrcamento.STATUS"
        :nome-cliente="orcamentoLoja.dadosOrcamento.NOME_CLIENTE"
        :vendedor="orcamentoLoja.dadosOrcamento.LOGIN"
      >
        <CardOrcamento
          v-for="itens in orcamentoLoja.itens"
          :produto="itens"
          @abrir-modal="abrirModalAlterProduto"
        />
      </CardOrcamentoGroup>
    </v-card>
  </v-container>

  <v-dialog v-model="state.modalAlterarProdutoOpened">
    <ModalAlterarProduto
      :end-estoque="itensSelecionados.endEstoque"
      :end-excessao="itensSelecionados.endExcesso"
      :quantidade="itensSelecionados.quantidadeProduto"
      :acao="itensSelecionados.acao"
    />
  </v-dialog>
  <v-dialog v-model="state.modalAdicionarItemOpened">
    <ModalAdicionarItem />
  </v-dialog>
</template>
<style></style>
