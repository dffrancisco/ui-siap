<script lang="ts" setup>
import { onMounted } from "vue";
import { mesesToSelect } from "../../constants/constants";
import { actions, state } from "./produtosEntreLojas";
import Loading from "@/components/Loading.vue";
import ModalProdutos from "./components/ModalProdutos.vue";

onMounted(async () => {
  await actions.init();
});
</script>

<template>
  <v-container>
    <v-card
      max-width="900"
      class="ma-auto"
    >
      <div class="pa-4">
        <div class="d-flex align-center ga-8 mb-4">
          <v-row>
            <v-col cols="7">
              <v-autocomplete
                v-model="state.filterSearch.loja"
                label="Loja"
                :clearable="false"
                :items="state.lojas"
                item-title="NOME"
                item-value="ID_SOCIEDADE"
              ></v-autocomplete>
            </v-col>
            <v-col>
              <v-autocomplete
                v-model="state.filterSearch.mes"
                label="Mês"
                item-value="value"
                item-title="title"
                :clearable="false"
                :items="mesesToSelect"
              ></v-autocomplete>
            </v-col>
            <v-col cols="2">
              <v-text-field
                v-model="state.filterSearch.ano"
                :clearable="false"
                maxlength="4"
                v-mask="'####'"
                label="Ano"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-btn
            size="small"
            color="primary"
            icon="mdi-magnify mdi-24px"
            @click="actions.onClickBtnSearch"
            :disabled="state.loadingLojas"
          ></v-btn>
        </div>

        <v-progress-linear
          indeterminate
          v-if="state.loadingLojas"
        ></v-progress-linear>
        <div id="gridPrincipal"> </div>

        <div class="mt-2 d-flex justify-end">
          <v-btn
            :disabled="state.btnPrintDisable"
            color="primary"
            ><v-icon class="mr-2">mdi-printer</v-icon>imprimir</v-btn
          >
        </div>
      </div>
    </v-card>

    <v-dialog
      v-model="state.modalProdutosOpened"
      max-width="800"
    >
      <ModalProdutos
        :lojaSelecionada="state.dbLojaSelecionada"
        :filter-search="state.setFilterSearch"
        :loja-origem="state.lojaOrigem"
        @close-modal="state.modalProdutosOpened = false"
      />
    </v-dialog>

    <div id="pnCodigoTela">produtosEntreLojas</div>

    <Loading :loading="state.loading" />
  </v-container>
</template>
