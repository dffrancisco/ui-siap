<script setup lang="ts">
import { state, actions, meses } from "./relatorioConferenciaAlteracoes";
import { nextTick } from "vue";

nextTick(async () => {
  actions.init();
});
</script>
<template>
  <v-container>
    <v-card
      class="pa-5"
      style="width: 876px; margin: 0 auto"
    >
      <v-row
        ><v-col cols="4"
          ><v-select
            id="opcoesTela"
            label="Tela"
            class="opcoesTela"
            :items="state.telas"
            v-model="state.selectTela"
            item-title="TELA"
            item-value="TELA"
            :clearable="true"
          ></v-select
        ></v-col>

        <v-col cols="4"
          ><v-select
            id="mes"
            label="Mês"
            class="mes"
            v-model="state.mes"
            item-title="title"
            item-value="value"
            :items="meses"
            :clearable="false"
          ></v-select
        ></v-col>
        <v-col cols="4">
          <v-text-field
            id="ano"
            class="ano"
            type="number"
            label="Ano"
            v-model="state.ano"
            :clearable="false"
          ></v-text-field
        ></v-col>
      </v-row>

      <v-row
        ><v-col cols="4">
          <v-autocomplete
            :clearable="true"
            label="Funcionário"
            multiple
            v-model="state.selectedFuncionario"
            :items="state.funcionarios"
            item-title="NOME_COMP"
            item-value="COD_FUNCIONARIO"
          ></v-autocomplete
        ></v-col>
        <v-col cols="4"
          ><v-select
            id="conteudo"
            label="Conteúdo"
            class="conteudo"
            v-model="state.selectedConteudo"
            :items="state.conteudo"
            item-title="title"
            item-value="value"
            :clearable="true"
          ></v-select
        ></v-col>
        <v-col cols="3">
          <v-text-field
            v-model="state.numFabricante"
            label="Nº Fabricante"
          ></v-text-field>
        </v-col>
        <v-col cols="1">
          <div class="btnPesquisar">
            <v-btn
              color="primary"
              icon="mdi-magnify"
              size="36px"
              @click="actions.validarInputs"
            >
            </v-btn> </div
        ></v-col>
      </v-row>

      <v-data-table-server
        class="tableHistoricoConsultaLojas"
        items-per-page-text="Itens por página"
        v-model:itemsPerPage="state.itemsPerPage"
        :items-length="state.totalItems"
        style="border-radius: 5px"
        height="460"
        fixed-header
        :headers="state.headers"
        :loading="state.loading"
        :row-props="actions.getClassCorLinha"
        @update:page="actions.updatePage"
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
      </v-data-table-server>
      <div class="pt-2 btnPrint">
        <v-btn
          color="primary"
          @click="actions.onClickImprimir"
          icon="mdi-printer"
          size="36px"
          title="Imprimir"
        />
      </div>
    </v-card>
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
    <div id="pnCodigoTela">relatorioConferenciaAlteracoes</div>
  </v-container>
</template>
<style>
.v-data-table-footer {
  max-height: 2px;
  padding-top: 20px;
}

.v-data-table-footer__pagination {
  padding-right: 50px;
}
</style>
<style scoped>
.btnPrint {
  display: flex;
  justify-content: flex-end;
  margin-top: -10px;
}

.cor-zebrada-1 {
  background-color: #f0f0f0;
}
</style>
