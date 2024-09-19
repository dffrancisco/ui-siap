<script setup lang="ts">
import { onMounted } from "vue";
import { actions, state, computeds } from "./filtro";
import ModalAddItensFiltro from "./components/modalAddItensFiltro.vue";
import ModalVisualizarFiltro from "./components/modalVisualizarFiltro.vue";
import ModalNovoFiltro from "./components/modalNovoFiltro.vue";

onMounted(async () => {
  actions.init();
});
</script>

<template>
  <v-container>
    <v-card
      class="pa-5"
      style="width: 900px; margin: 0 auto"
    >
      <div class="divInputs">
        <v-text-field
          id="getFiltro"
          label="Pesquisar Filtro"
          class="getFiltro"
          autocomplete="off"
          item-title="title"
          item-value="value"
          :clearable="true"
          v-model="state.searchFiltro"
          append-inner-icon="mdi-magnify"
        ></v-text-field>
        <v-btn
          title="Novo"
          class="novoFiltroBtn"
          color="primary"
          @click="actions.novoFiltro"
        >
          + Novo
        </v-btn>
      </div>

      <v-data-table-virtual
        class="tableFiltros"
        style="border-radius: 5px; padding-top: 20px"
        height="400"
        :headers="state.headers"
        :items="computeds.filtros.value"
        fixed-header
        :loading="state.loading"
        :row-props="actions.getClassCorLinha"
      >
        <template v-slot:item.acoes="{ item }">
          <div style="display: flex">
            <v-icon
              size="large"
              color="primary"
              title="Ver detalhes e add+ itens"
              :disabled="item.DATA_FIM != null"
              @click="actions.selectFiltro(item.ID_FILTRO)"
            >
              mdi-playlist-plus
            </v-icon>
            <v-icon
              size="large"
              class="ml-1"
              color="primary"
              title="Imprimir"
              @click="actions.imprimirFiltroSelecionado(item.ID_FILTRO)"
            >
              mdi-printer-outline
            </v-icon>
            <v-icon
              size="large"
              color="primary"
              class="ml-1"
              title="Deletar Filtro"
              :disabled="item.DATA_FIM != null"
              @click="actions.deletarFiltro(item.ID_FILTRO)"
            >
              mdi-delete-outline
            </v-icon>
            <v-icon
              size="large"
              color="primary"
              class="ml-1"
              :disabled="item.DATA_FIM != null"
              :title="item.DATA_FIM == null ? 'Finalizar Filtro' : 'Filtro Finalizado'"
              @click="actions.finalizarFiltro(item.ID_FILTRO)"
            >
              mdi-checkbox-marked-outline
            </v-icon>
          </div>
        </template>
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

      <div class="pt-6 btnPrint">
        <v-btn
          color="primary"
          @click="actions.onClickImprimirFiltros"
          icon="mdi-printer"
          size="36px"
          title="Imprimir"
        />
      </div>
    </v-card>
    <div id="pnCodigoTela">filtro</div>
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

  <v-dialog
    v-model="state.modalNovoFiltroOpened"
    transition="dialog-transition"
    variant="flat"
    :persistent="false"
    @click:outside="actions.closeModalNovoFiltro"
  >
    <ModalNovoFiltro
      :filtroEditar="state.filtroEditar"
      @closeModalNovoFiltro="actions.closeModalNovoFiltro"
      @novoFiltro="actions.criarNovoFiltro"
      @nomeFiltroEConferente="actions.updateFiltroEConferente"
    />
  </v-dialog>

  <v-dialog
    v-model="state.modalVisualizarFiltroOpened"
    transition="dialog-transition"
    variant="flat"
    :persistent="false"
    @click:outside="actions.closeModalVisualizarFiltro"
  >
    <ModalVisualizarFiltro
      :dadosFiltroSelecionado="state.dadosDoFiltroSelecionado"
      @editarDadosFiltro="actions.editarDadosFiltroSelecionado"
      @addItensFiltro="actions.addItensFiltro"
      @closeModalVisualizarFiltro="actions.closeModalVisualizarFiltro"
      @removerItemState="actions.removerItemState"
    />
  </v-dialog>

  <v-dialog
    v-model="state.modalAddItensFiltroOpened"
    transition="dialog-transition"
    variant="flat"
    :persistent="false"
    @click:outside="actions.closeModalAddItensFiltro"
  >
    <ModalAddItensFiltro
      :nomeFiltro="state.nomeNovoFiltro"
      :idFiltro="state.idFiltro"
      :conferente="state.conferente"
      @closeModalAddItensFiltro="actions.closeModalAddItensFiltro"
      @cancelarModalAddItensFiltro="actions.cancelarModalAddItensFiltro"
    />
  </v-dialog>
</template>

<style>
.v-overlay__scrim {
  background-color: black;
}

.cor-zebrada-1 {
  background-color: #f0f0f0;
}
</style>

<style scoped>
.divInputs {
  display: flex;
  align-items: center;
  width: 100%;
}

.btnPrint {
  display: flex;
  justify-content: flex-end;
  margin-top: -10px;
}

.getFiltro {
  width: 350px;
}

.novoFiltroBtn {
  font-weight: 600;
  text-align: center;
  margin-left: 370px;
}
</style>
