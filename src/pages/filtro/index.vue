<script setup lang="ts">
import { onMounted } from "vue";
import { actions, state } from "./filtro";
import ModalAddItensFiltro from "./components/modalAddItensFiltro.vue";
import ModalVisualizarFiltro from "./components/modalVisualizarFiltro.vue";
import ModalNovoFiltro from "./components/modalNovoFiltro.vue";
import ModalRevisaoFiltro from "./components/modalRevisaoFiltro.vue";
import utils from "@/ts/utils";

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
          @keypress.enter="actions.getFiltros()"
          v-model="state.searchFiltro"
        ></v-text-field>
        <v-select
          id="status"
          class="status"
          :clearable="false"
          label="Status"
          width="180px"
          style="margin-left: 15px"
          v-model="state.selectedStatus"
          :items="['Em Andamento', 'Finalizado', 'Todos']"
          @update:modelValue="actions.getFiltros()"
        />
        <div class="btnPesquisar">
          <v-btn
            color="primary"
            icon="mdi-magnify"
            size="36px"
            class="ml-3"
            @click="actions.getFiltros()"
          >
          </v-btn>
        </div>

        <v-btn
          title="Novo"
          class="novoFiltroBtn"
          color="primary"
          @click="actions.novoFiltro"
        >
          + Novo
        </v-btn>
      </div>

      <v-data-table-server
        class="tableFiltros"
        style="border-radius: 5px; padding-top: 20px; --v-table-row-height: 70px"
        height="400"
        items-per-page-text="Itens por página"
        v-model:itemsPerPage="state.itensPerPage"
        :items-length="state.totalItems"
        :headers="state.headers"
        :items="state.filtros"
        fixed-header
        :loading="state.loading"
        :row-props="actions.getClassCorLinha"
        @update:page="actions.updatePage"
      >
        <template v-slot:item.DATA_INICIO="{ item }">
          <div>
            <div>{{ utils.dataBrasil(item.DATA_INICIO) }}</div>
            <div>{{ utils.formatHora(item.HR_INICIO) }}</div>
          </div>
        </template>

        <template v-slot:item.DATA_FIM="{ item }">
          <div>
            <div>{{ item.DATA_FIM ? utils.dataBrasil(item.DATA_FIM) : "-" }}</div>
            <div>{{ item.HR_TERMINO ? utils.formatHora(item.HR_TERMINO) : "-" }}</div>
          </div>
        </template>
        <template v-slot:item.acoes="{ item }">
          <div style="display: flex">
            <v-icon
              size="large"
              color="primary"
              title="Alterar Filtro"
              :disabled="item.DATA_FIM != null"
              @click="actions.selectFiltro(item.ID_FILTRO)"
            >
              mdi-pen
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
              :title="item.HR_REVISAO == null ? 'Revisar Filtro' : 'Visualizar Revisão'"
              @click="
                item.HR_REVISAO == null
                  ? actions.revisarFiltro(item.ID_FILTRO)
                  : actions.revisarFiltro(item.ID_FILTRO)
              "
            >
              {{ item.HR_REVISAO == null ? "mdi-checkbox-marked-outline" : "mdi-eye-outline" }}
            </v-icon>
          </div>
        </template>
      </v-data-table-server>

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
      :funcionarios="state.funcionarios"
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
      :qtdItens="state.qtdItens"
      :marcas="state.marcas"
      :carros="state.carros"
      :itensExistentesNoFiltro="state.dadosDoFiltroSelecionado"
      @closeModalAddItensFiltro="actions.closeModalAddItensFiltro"
      @cancelarModalAddItensFiltro="actions.cancelarModalAddItensFiltro"
    />
  </v-dialog>

  <v-dialog
    v-model="state.modalRevisaoFiltroOpened"
    transition="dialog-transition"
    variant="flat"
    :persistent="false"
    @click:outside="actions.closeModalRevisaoFiltro"
  >
    <ModalRevisaoFiltro
      :dadosFiltroSelecionado="state.dadosDoFiltroSelecionado"
      @closeModalRevisaoFiltro="actions.closeModalRevisaoFiltro"
      @finalizarFiltro="actions.finalizarFiltro"
    />
  </v-dialog>
</template>

<style>
.v-overlay__scrim {
  background-color: black;
}

.v-data-table-footer {
  max-height: 2px;
  padding-top: 20px;
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
  margin-top: -30px;
}

.getFiltro {
  width: 350px;
}

.novoFiltroBtn {
  font-weight: 600;
  text-align: center;
  margin-left: 180px;
}
</style>
