<script setup lang="ts">
import { state, actions, dataHoje, funcionariosOrdenados } from "./comissaoMarca";
import { nextTick } from "vue";
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
              @keydown.enter.prevent=""
              maxlength="10"
            />
          </div>
        </div>

        <div class="inputVendedor">
          <v-autocomplete
            :clearable="true"
            label="Funcionário"
            v-model="state.selectedFuncionario"
            :items="funcionariosOrdenados"
            item-title="NOME_COMP"
            item-value="COD_FUNCIONARIO"
          ></v-autocomplete>
        </div>

        <div class="valorItem">
          <v-text-field label="Valor"></v-text-field>
        </div>

        <div class="marcasEProdutos">
          <div class="marcas">
            <span>Marcas</span>
            <v-icon
              class="ml-14"
              size="large"
              color="primary"
              title="Adicionar Marca"
              @click="actions.getMarcas"
              >mdi-plus-circle</v-icon
            >
            <v-card class="mt-2">
              <template v-if="state.marcasEscolhidas.length > 0">
                <div
                  v-for="marca in state.marcasEscolhidas"
                  :key="marca.ID_MARCA"
                  class="marca-item"
                >
                  <span>{{ marca.DESCRICAO }}</span>
                  <v-icon
                    size="small"
                    color="primary"
                    @click="actions.removerMarca(marca)"
                  >
                    mdi-delete
                  </v-icon>
                </div>
              </template>
              <template v-else>
                <div class="spanSemMarca"><span>Nenhuma marca selecionada</span></div>
              </template>
            </v-card>
          </div>

          <div class="produtos">
            <span>Produtos</span
            ><v-icon
              class="ml-10"
              size="large"
              color="primary"
              title="Adicionar Produtos"
              @click="actions.getProdutos"
              >mdi-plus-circle</v-icon
            >
            <v-card class="mt-2">
              <!-- <template v-if="state.marcasEscolhidas.length > 0">
                <div
                  v-for="marca in state.marcasEscolhidas"
                  :key="marca.ID_MARCA"
                  class="produto-item"
                >
                  <span>{{ marca.DESCRICAO }}</span>
                  <v-icon
                    size="small"
                    color="primary"
                    @click="actions.removerProdutos()"
                  >
                    mdi-delete
                  </v-icon>
                </div>
              </template>
              <template v-else>
                <div class="spanSemProduto"><span>Nenhuma marca selecionada</span></div>
              </template> -->
            </v-card>
          </div>
        </div>
        <div class="divBtn pt-4">
          <v-btn
            title="Consultar"
            class="consultarBtn"
            color="#3680AB"
            @click.prevent=""
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
        <v-card width="700px">
          <v-radio-group>
            <div>
              <v-radio
                label="Agrupado por vendedor"
                value="one"
              ></v-radio
            ></div>
            <div class="radio-button"
              ><v-radio
                label="Agrupado por item"
                value="two"
              ></v-radio
            ></div>
          </v-radio-group>
          <v-data-table-virtual
            class="tableComissaoMarca"
            items-per-page-text="Itens por página"
            v-model:itemsPerPage="state.itemsPerPage"
            :items-length="state.totalItems"
            style="border-radius: 5px"
            height="560"
            fixed-header
            :headers="state.headers"
            :loading="state.loading"
            :row-props="actions.getClassCorLinha"
            @update:page=""
          >
            <template #no-data>
              <v-alert
                :value="true"
                icon="mdi-information"
                style="background-color: #ffffff"
              >
                Não há dados disponíveis.
              </v-alert>
            </template>
          </v-data-table-virtual>
          <div class="pt-2 btnPrint">
            <v-btn
              color="primary"
              @click=""
              icon="mdi-printer"
              size="36px"
              title="Imprimir"
            />
          </div>
        </v-card>
      </div>
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
      :modalOpened="state.modalProdutosOpened"
      @close-modal="actions.fecharModalProdutos"
      @produtos-escolhidos="actions.adcProdutosNoCard"
    />
  </div>

  <div id="pnCodigoTela">COMISSÃO_MARCA</div>
</template>

<style scoped>
.main-container {
  display: flex;
  height: 80vh;
}

.left-side {
  padding: 10px;
  width: 30%;
}

.right-side {
  flex: 1;
  padding: 10px;
}

.left-card {
  width: 100%;
  min-height: 700px;
}

.divider {
  width: 2px;
  margin-left: 5px;
  margin-right: -15px;
  margin-top: 5px;
  height: 710px;
  min-height: 710px;
}

.data-container {
  display: flex;
  gap: 12px;
}

.input-data {
  width: 126px;
}

.inputVendedor {
  width: 265px;
  padding-top: 20px;
}

.valorItem {
  width: 265px;
  padding-top: 20px;
}

.marcasEProdutos {
  display: flex;
  gap: 12px;
  padding-top: 20px;
  width: 300px;
}

.produtos,
.marcas {
  width: 120px;
}

.spanSemProduto,
.spanSemMarca {
  padding: 10px;
}

.produto-item,
.marca-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  width: auto;
  margin-top: 5px;
  border-bottom: 1px solid #ccc;
}

.produto-item span .marca-item span {
  flex-grow: 1;
}

.v-icon {
  cursor: pointer;
}

.divBtn {
  margin-left: 80px;
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
  margin-top: 20px;
  padding: 10px;
}
</style>
