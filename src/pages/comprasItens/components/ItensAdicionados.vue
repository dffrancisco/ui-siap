<script setup lang="ts">
import { iCabecalhoCompra } from "../interfaces";

const props = defineProps({
  cabecalho: {
    type: Object as () => iCabecalhoCompra,
    default: {},
  },
});
</script>

<template>
  <div class="detalhes-itens">
    <div class="detalhes-dados-item">
      <div class="detalhes-dados-item-cabecalho">
        <div class="detalhes-dados-item-cabecalho-opcao detalhes-dados-item-cabecalho-opcao-selecionada">
          <span>Itens não adicionados</span>
        </div>
        <div class="detalhes-dados-item-cabecalho-opcao">
          <span>Itens adicionados</span>
        </div>
        <v-spacer />
        <div class="d-flex align-center">
          <v-icon title="Modo Grid">mdi mdi-menu</v-icon>
          <v-icon title="Modo Individual">mdi mdi-id-card</v-icon>
        </div>
      </div>
      <div class="detalhes-dados-item-info">
        <v-row>
          <v-col
            cols="11"
            class="d-flex flex-column"
          >
            <span>Descrição</span>
            <strong class="detalhes-dados-item-info-value">FAROL 123</strong>
          </v-col>
          <v-col
            cols="1"
            class="d-flex align-center"
            title="Ver foto"
          >
            <v-icon>mdi mdi-camera</v-icon>
          </v-col>
        </v-row>
        <v-row class="mt-0">
          <v-col
            cols="3"
            class="d-flex flex-column"
          >
            <span>Carro</span>
            <strong class="detalhes-dados-item-info-value">ARGO</strong>
          </v-col>
          <v-col
            cols="3"
            class="d-flex flex-column"
          >
            <span>Nº Fabricante</span>
            <strong class="detalhes-dados-item-info-value">123</strong>
          </v-col>
          <v-col
            cols="2"
            class="d-flex flex-column"
          >
            <span>Nº Fabricante 2</span>
            <strong class="detalhes-dados-item-info-value">456</strong>
          </v-col>
          <v-col
            cols="2"
            class="d-flex flex-column"
          >
            <span>Curva G</span>
            <strong class="detalhes-dados-item-info-value">A</strong>
          </v-col>
          <v-col
            cols="2"
            class="d-flex flex-column"
          >
            <span>Curva M</span>
            <strong class="detalhes-dados-item-info-value">B</strong>
          </v-col>
        </v-row>
        <v-row class="mt-0">
          <v-col
            cols="4"
            class="d-flex flex-column py-5"
          >
            <span>Marca</span>
            <strong class="detalhes-dados-item-info-value">ARTEB</strong>
          </v-col>
          <v-col
            cols="2"
            class="py-4"
          >
            <div class="d-flex flex-column detalhes-dados-item-info-media px-2 py-1">
              <span>Média</span>
              <strong class="detalhes-dados-item-info-value">2</strong>
            </div>
          </v-col>
          <v-col
            cols="2"
            class="d-flex flex-column py-5"
          >
            <span>Qtd. Atual</span>
            <strong class="detalhes-dados-item-info-value">3</strong>
          </v-col>
          <v-col
            cols="2"
            class="d-flex flex-column py-5"
          >
            <span>Custo</span>
            <strong class="detalhes-dados-item-info-value">25,00</strong>
          </v-col>
          <v-col
            cols="2"
            class="d-flex flex-column py-5"
          >
            <span>Venda</span>
            <strong class="detalhes-dados-item-info-value">50,00</strong>
          </v-col>
        </v-row>
      </div>
      <div class="detalhes-dados-item-paginacao">
        <v-icon>mdi mdi-arrow-left</v-icon>
        <v-icon>mdi mdi-arrow-right</v-icon>
      </div>
    </div>
    <div class="detalhes-itens-progresso">
      <VProgressLinear
        model-value="50"
        color="primary"
        :rounded-bar="true"
      />
    </div>
    <div class="detalhes-itens-resumo">
      <div class="d-flex justify-space-around ma-0">
        <div
          cols="3"
          class="d-flex flex-column align-center"
        >
          <span>Itens Vistos</span>
          <strong>5</strong>
        </div>
        <div
          cols="3"
          class="d-flex flex-column align-center"
        >
          <span>Itens Atual</span>
          <strong>5</strong>
        </div>
        <div
          cols="3"
          class="d-flex flex-column align-center"
        >
          <span>Qtd Itens</span>
          <strong>20</strong>
        </div>
        <div
          cols="3"
          class="d-flex flex-column align-center"
        >
          <span>Itens Restantes</span>
          <strong>15</strong>
        </div>
      </div>
    </div>
    <div class="detalhes-ultimo-item">
      <span class="mr-2">Último item adicionado: </span>
      <strong class="detalhes-ultimo-item-value">FAROL ARTEB LD 00/</strong>
    </div>
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
.detalhes-itens {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 788px;
}

.detalhes-dados-item {
  display: flex;
  flex-direction: column;
  background-color: var(--grey-900);
  flex-grow: 1;
  border-radius: 8px;
}

.detalhes-dados-item-cabecalho {
  display: flex;
  gap: 40px;
  padding: 0 24px;
  background-color: var(--grey-800);
  height: 40px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  font-size: 14px;
}

.detalhes-dados-item-cabecalho-opcao {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 150px;
}

.detalhes-dados-item-cabecalho-opcao-selecionada {
  color: var(--primary-500);
  border-bottom: 1px solid var(--primary-500);
}

.detalhes-dados-item-info {
  padding: 12px;
  flex-grow: 1;
  font-size: 14px;
  line-height: 16px;
  font-weight: 300;
}

.detalhes-dados-item-info-value {
  font-size: 18px;
  font-weight: 700;
  line-height: 20px;
}

.detalhes-dados-item-info-media {
  border: 1px solid var(--grey-800);
  border-radius: 4px;
}

.detalhes-dados-item-info-media .detalhes-dados-item-info-value {
  color: var(--success-300);
}

.detalhes-dados-item-paginacao {
  padding: 8px 12px;
  display: flex;
  justify-content: space-between;
}

.detalhes-itens-resumo {
  padding: 12px;
  width: 100%;
  background-color: var(--grey-900);
  border-radius: 8px;
}

.detalhes-ultimo-item {
  padding: 12px;
  width: 100%;
  background-color: var(--grey-900);
  border-radius: 8px;
}

.detalhes-ultimo-item-value {
  font-size: 16px;
  font-weight: 900;
}
</style>
