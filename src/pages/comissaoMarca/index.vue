<script setup lang="ts">
import {
  state,
  actions,
  dataHoje,
  totalizadorVendedores,
  totalizadorItens,
  disabledBtnImprimir,
} from "./comissaoMarca";
import { nextTick } from "vue";
import { configVMoney } from "../../constants/constants";
import ModalMarcas from "./components/modalMarcas.vue";
import ModalProdutos from "./components/modalProdutos.vue";

nextTick(async () => {
  actions.init();
});
</script>
<template>
  <v-container
    class="main-container"
    style="width: auto; margin: 0 auto"
  >
    <div class="left-side">
      <v-card class="pa-5 left-card">
        <div class="data-container">
          <div class="input-data">
            <span>Data Inicial</span>
            <input
              v-model="state.dataInicial"
              id="DATA_INICIAL"
              name="DATA_INICIAL"
              type="date"
              class="ss obr"
              maxlength="10"
              :max="dataHoje"
              @keydown.enter="state.inputDataFinal.focus()"
            />
          </div>
          <div class="input-data">
            <span>Data Final</span>
            <input
              v-model="state.dataFinal"
              id="DATA_FINAL"
              name="DATA_FINAL"
              type="date"
              class="ss obr"
              :max="dataHoje"
              @keydown.enter.prevent="actions.validarInputs"
              maxlength="10"
            />
          </div>
        </div>

        <div class="inputVendedor">
          <v-autocomplete
            :clearable="true"
            label="Funcionário"
            multiple
            v-model="state.selectedFuncionario"
            :items="state.funcionarios"
            item-title="NOME_COMP"
            item-value="COD_FUNCIONARIO"
          ></v-autocomplete>
        </div>

        <div class="valorItem">
          <input
            id="inputValor"
            :clearable="false"
            v-model.lazy="state.inputValor"
            :model-modifiers="{ number: true }"
            v-money3="{ ...configVMoney, max: 1000000 }"
            autofocus
          />
        </div>

        <div class="marcasEProdutos">
          <div class="marcas">
            <div>
              <span class="ml-2">Marcas / Produtos</span>
              <v-icon
                class="iconAddMarcas"
                size="large"
                color="primary"
                title="Adicionar Marca"
                @click="actions.openModalMarcas"
              >
                mdi-plus-circle
              </v-icon>
            </div>
            <div class="marcasCard">
              <template v-if="state.marcaEscolhida.length > 0">
                <div
                  v-for="item in state.marcaEscolhida"
                  :key="item.marca?.ID_MARCA"
                  class="marca-item mt-2"
                >
                  <div>
                    <span class="ml-1">{{ item.marca.DESCRICAO }}</span
                    ><br />
                    <v-icon
                      class="ml-1"
                      size="large"
                      color="primary"
                      @click="actions.removerMarca(item.marca)"
                    >
                      mdi-delete
                    </v-icon>
                    <v-icon
                      size="large"
                      color="primary"
                      @click="actions.editarMarca(item.marca.ID_MARCA)"
                    >
                      mdi-plus-circle
                    </v-icon>
                  </div>
                  <div v-if="item.produtos.length > 0">
                    <div
                      v-for="produto in item.produtos"
                      :key="produto.descricaoSelecionados"
                      class="produto-item"
                    >
                      <span
                        >{{ produto.descricaoSelecionados }} <br />{{
                          produto.produtosEscolhidos.length
                        }}
                        itens</span
                      >
                      <div class="ml-2">
                        <v-icon
                          size="large"
                          color="primary"
                          @click="actions.editarProdutos(produto, item.marca.ID_MARCA)"
                        >
                          mdi-pencil
                        </v-icon>
                        <v-icon
                          size="large"
                          color="primary"
                          @click="actions.removerProdutos(item.marca.ID_MARCA, produto.descricaoSelecionados)"
                        >
                          mdi-delete
                        </v-icon>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="spanSemMarca"><span>Nenhuma marca selecionada</span></div>
              </template>
            </div>
          </div>
        </div>

        <div class="divBtn pt-4">
          <v-btn
            title="Consultar"
            class="consultarBtn"
            color="#3680AB"
            @click.prevent="actions.validarInputs"
          >
            Consultar
          </v-btn>
        </div>
      </v-card>
    </div>

    <v-divider
      vertical
      class="divider"
      :thickness="4"
    ></v-divider>

    <div class="right-side">
      <div class="radio-group">
        <v-card
          width="700px"
          height="550px"
        >
          <v-tabs
            v-model="state.tab"
            bg-color="primary"
          >
            <v-tab value="agrupadoPorVendedor">Agrupado por Vendedor</v-tab>
            <v-tab
              value="agrupadoPorItem"
              @click="actions.getDadosVendaMarcaPorItens"
              >Agrupado por Item</v-tab
            >
          </v-tabs>

          <v-card-text>
            <v-window v-model="state.tab">
              <v-window-item value="agrupadoPorVendedor">
                <v-data-table-virtual
                  class="tableComissaoMarca"
                  no-data-text="Não há dados disponíveis"
                  v-model:itemsPerPage="state.totalItems"
                  style="border-radius: 5px; max-width: 660px"
                  height="430"
                  fixed-header
                  :headers="state.headers"
                  :loading="state.loading"
                  :items="[...state.dadosParaRelatorioVendedor, totalizadorVendedores]"
                  :row-props="actions.getClassCorLinha"
                >
                </v-data-table-virtual>
              </v-window-item>
              <v-window-item value="agrupadoPorItem">
                <v-data-table-virtual
                  class="tableComissaoMarca"
                  no-data-text="Não há dados disponíveis"
                  v-model:itemsPerPage="state.totalItems"
                  style="border-radius: 5px; max-width: 660px"
                  height="430"
                  fixed-header
                  :headers="state.headers2"
                  :loading="state.loading"
                  :items="[...state.dadosParaRelatorioItens, totalizadorItens]"
                  :row-props="actions.getClassCorLinha"
                >
                </v-data-table-virtual>
              </v-window-item>
            </v-window>
          </v-card-text>
          <div class="btnPrint">
            <v-btn
              color="primary"
              @click="actions.relatorio"
              :disabled="disabledBtnImprimir"
              icon="mdi-printer"
              size="36px"
              title="Imprimir"
            />
          </div>
        </v-card>
      </div>
      <div id="pnCodigoTela">COMISSÃO_MARCA</div>
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
      ></v-progress-circular>
    </v-overlay>
  </v-container>
  <div
    id="modalMarcas"
    style="display: none"
  >
    <ModalMarcas
      :marcas="state.marcas"
      :modalOpened="state.modalMarcasOpened"
      @close-modal="actions.fecharModalMarcas"
      @marca-escolhida="actions.adcMarcaNoCard"
    />
  </div>

  <div
    id="modalProdutos"
    style="display: none"
  >
    <ModalProdutos
      :produtos="state.produtos"
      :produtosEditar="state.produtosEditar"
      :modalOpened="state.modalProdutosOpened"
      @close-modal="actions.fecharModalProdutos"
      @produtos-escolhidos="actions.adcProdutosNoCard"
    />
  </div>
</template>

<style>
.v-overlay__scrim {
  background-color: black;
}

.cor-zebrada-1 {
  background-color: #f0f0f0;
}

.cor-zebrada-2 {
  background-color: #fff;
}
</style>

<style scoped>
.main-container {
  display: flex;
}

.left-side {
  padding: 10px;
  width: 40%;
}

.right-side {
  flex: 1;
  padding: 10px;
}

.left-card {
  width: 100%;
  min-height: 550px;
}

.divider {
  width: 2px;
  margin-left: 5px;
  margin-right: -15px;
  margin-top: 5px;
  height: 580px;
  min-height: 580px;
}

.data-container {
  display: flex;
  gap: 12px;
}

.input-data {
  width: 145px;
}

.inputVendedor {
  width: 300px;
  padding-top: 20px;
}

.valorItem {
  width: 300px;
  height: 40px;
  margin-top: 16px;
  font-size: 14px;
  transition: border-color 0.3s;
  border: 1px solid rgba(0, 0, 0, 0.42);
  border-radius: 4px;
  padding: 6px 10px;
}

#inputValor {
  padding-top: 5px;
}

.marcasEProdutos {
  display: flex;
  gap: 12px;
  padding-top: 20px;
  width: 300px;
  max-height: 400px;
}

.iconAddMarcas {
  margin-left: 150px;
}

.marcasCard,
.produtosCard {
  max-height: 250px;
  overflow-y: auto;
  border-radius: 10px;
}

.produtos,
.marcas {
  width: 300px;
}

.spanSemMarca {
  padding: 20px;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
}

.produto-item,
.marca-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  margin-top: 5px;
  width: auto;
  border: 1px solid #ccc;
  border-radius: 10px;
}

.v-icon {
  cursor: pointer;
}

.divBtn {
  margin-left: 80px;
  margin-top: 5px;
}

.consultarBtn {
  font-weight: 600;
  text-align: center;
}

.radio-group {
  display: flex;
  margin-left: 20px;
}

.radio-button {
  width: auto;
  margin-left: 50%;
  margin-top: -40px;
}

.tableComissaoMarca {
  margin-left: 20px;
}

.btnPrint {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 20px;
  margin-top: -25px;
}

#pnCodigoTela {
  margin-top: 30px;
  margin-right: 150px;
}
</style>
