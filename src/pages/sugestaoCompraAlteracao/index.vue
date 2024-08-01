<script setup lang="ts">
import { state, actions, meses, opcoes, status, filtrarSugestoes } from "./sugestaoCompraAlteracao";
import ModalAprovar from "./components/ModalAprovar.vue";
import ModalReprovar from "./components/ModalReprovar.vue";
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
      <div class="divInputs">
        <div style="display: flex; gap: 16px">
          <v-select
            id="opcoes"
            label="Compra / Alteração"
            class="opcoes"
            v-model="state.opcoes"
            item-title="title"
            item-value="value"
            :items="opcoes"
            :clearable="false"
          ></v-select>
          <v-select
            id="status"
            label="Aprovado / Reprovado"
            class="status"
            v-model="state.status"
            item-title="title"
            item-value="value"
            :items="status"
            :clearable="false"
          ></v-select>
          <v-select
            id="mes"
            label="Mês"
            class="obr mes"
            v-model="state.mes"
            item-title="title"
            item-value="value"
            :items="meses"
            :clearable="false"
          ></v-select>

          <v-text-field
            id="ano"
            class="obr ano"
            type="number"
            label="Ano"
            v-model="state.ano"
            :clearable="false"
          ></v-text-field>
        </div>
        <div class="btnPesquisar">
          <v-btn
            color="primary"
            class="mt-3"
            icon="mdi-magnify"
            size="36px"
            @click="actions.validarInputs"
          >
          </v-btn>
        </div>
      </div>

      <v-data-table-server
        class="tableSugestaoCompraAlteracao"
        items-per-page-text="Itens por página"
        v-model:itemsPerPage="state.itemsPerPage"
        :items-length="state.totalItems"
        style="border-radius: 5px; padding-top: 20px"
        height="400"
        fixed-header
        :headers="state.headers"
        :loading="state.loading"
        :items="filtrarSugestoes"
        :row-props="actions.getClassCorLinha"
        @update:page="actions.updatePage"
      >
        <template v-slot:item.TIPO="{ item }">
          <template v-if="item.TIPO == 'I'">
            <span>Compra</span>
          </template>
          <template v-if="item.TIPO == 'A'">
            <span>Alteração</span>
          </template>
        </template>

        <template v-slot:item.APROVADA="{ item }">
          <template v-if="item.APROVADA == 'S'">
            <span>Aprovado</span>
          </template>
          <template v-if="item.APROVADA == 'N'">
            <span>Reprovado</span>
          </template>
          <template v-if="item.APROVADA == null">
            <span>Aguardando</span>
          </template>
        </template>

        <template v-slot:item.apr="{ item }">
          <!-- se o item estiver status aguardando -->
          <template v-if="item.APROVADA == null">
            <v-icon
              size="large"
              color="primary"
              title="Aprovar"
              @click="actions.modalAprovar(item)"
            >
              mdi-checkbox-marked-circle-outline
            </v-icon>
            <v-icon
              size="large"
              class="pl-3"
              color="primary"
              title="Reprovar"
              @click="actions.modalReprovar(item)"
              >mdi-close-circle-outline</v-icon
            >
          </template>
          <template v-if="item.APROVADA == 'S'">
            <!-- se o item tiver sido aprovado pode reprovar -->
            <v-icon
              size="large"
              color="primary"
              title="Reprovar"
              @click="actions.modalReprovar(item)"
              >mdi-close-circle-outline</v-icon
            >
          </template>
          <template v-if="item.APROVADA == 'N'">
            <!-- se o item tiver sido reprovado pode aprovar -->
            <v-icon
              size="large"
              color="primary"
              title="Reprovar"
              @click="actions.modalAprovar(item)"
              >mdi-checkbox-marked-circle-outline</v-icon
            >
          </template>
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
    <div id="pnCodigoTela">SUGESTAO_COMPRA_ALTERAÇÃO</div>
  </v-container>

  <v-dialog
    v-model="state.modalAprovarOpened"
    transition="dialog-transition"
    variant="flat"
    :persistent="true"
    @click:outside="actions.closeModalAprovar"
  >
    <ModalAprovar
      :itemAprovar="state.itemAprovar"
      @closeModal="actions.closeModalAprovar"
      @aprovarItem="actions.aprovar"
    ></ModalAprovar>
  </v-dialog>

  <v-dialog
    v-model="state.modalReprovarOpened"
    transition="dialog-transition"
    variant="flat"
    :persistent="true"
    @click:outside="actions.closeModalReprovar"
  >
    <ModalReprovar
      :itemReprovar="state.itemReprovar"
      @closeModal="actions.closeModalReprovar"
      @reprovarItem="actions.reprovar"
    ></ModalReprovar>
  </v-dialog>
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

.v-data-table-footer {
  max-height: 2px;
  padding-top: 20px;
}

.v-field__clearable {
  display: none;
}

.v-data-table-footer__pagination {
  padding-right: 50px;
}
</style>

<style scoped>
.divInputs {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
}

.btnPesquisar {
  margin-top: -15px;
  padding-left: 10px;
}

.btnPrint {
  display: flex;
  justify-content: flex-end;
  margin-top: -10px;
}

.opcoes,
.status,
.mes,
.ano {
  width: 180px;
  border-radius: 6px;
}
</style>
