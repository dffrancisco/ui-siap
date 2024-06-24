<script setup lang="ts">
import { state, actions, meses } from "./vendaPerdida";
import { nextTick } from "vue";
import ModalDetalhesVendaPerdida from "./components/modalDetalhesVendaPerdida.vue";

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
      <div>
        <v-col cols="12">
          <v-row>
            <v-col cols="7">
              <v-select
                id="mes"
                label="Mês"
                v-model="state.mes"
                item-title="title"
                item-value="value"
                :items="meses"
                :clearable="false"
                @update:model-value="actions.getVendasPerdidas"
              ></v-select>
            </v-col>
            <v-col cols="5">
              <v-text-field
                id="ano"
                type="number"
                label="Ano"
                v-model="state.ano"
                :clearable="false"
                @update:model-value="actions.getVendasPerdidas"
              ></v-text-field>
            </v-col>
            <!-- <v-col cols="2">
              <div>
                <v-btn
                  color="primary"
                  class="mt-3"
                  icon="mdi-magnify"
                  size="36px"
                  @click=""
                >
                </v-btn>
              </div>
            </v-col> -->
          </v-row>
        </v-col>
      </div>

      <v-data-table-virtual
        class="tableVendaPerdida"
        v-model:itemsPerPage="state.itemsPerPage"
        items-per-page-text="Itens por página"
        no-data-text="Não há dados disponíveis"
        style="border-radius: 5px"
        height="560"
        fixed-header
        :items-length="state.totalItems"
        :headers="state.headers"
        :loading="state.loading"
        :search="state.search"
        :items="state.vendasPerdidas"
      >
        <template v-slot:item.inf="{ item }">
          <v-icon
            size="large"
            color="primary"
            title="Ver detalhes"
            @click="actions.openModalDetalhesVendaPerdida(item)"
          >
            mdi-information
          </v-icon>
        </template>
        <template v-slot:item="{ item, index }">
          <tr :style="{ backgroundColor: index % 2 === 0 ? '#fff' : '#f0f0f0', textAlign: 'end' }">
            <td style="text-align: start">{{ item.DESC_PRODUTO }}</td>
            <td>{{ item.NUM_FABRICANTE }}</td>
            <td>{{ item.NUM_FABRICANTE2 }}</td>
            <td>{{ item.DESC_MARCA }}</td>

            <td
              ><span class="qtdEstoque">{{ item.QUANTIDADE }}</span></td
            >
            <td
              ><span
                style="color: #bf3f3f"
                class="qtdVendaPerdida"
              >
                {{ item.QUANTIDADE_PERDIDA }}
              </span></td
            >

            <td>
              <v-icon
                size="large"
                color="primary"
                title="Ver detalhes"
                @click="actions.openModalDetalhesVendaPerdida(item)"
              >
                mdi-information
              </v-icon>
            </td>
          </tr>
        </template>
      </v-data-table-virtual>
      <div class="pt-2 btnPrint">
        <v-btn
          color="primary"
          @click="actions.imprimirVendasPerdidas"
          icon="mdi-printer"
          size="36px"
          title="Imprimir"
        />
      </div>
    </v-card>

    <div
      id="modalVendaPerdidaDetalhes"
      style="display: none"
    >
      <ModalDetalhesVendaPerdida
        :vendaPerdidaDetalhada="state.vendaPerdidaDetalhada"
        :modalOpened="state.modalDetalhesVendaPerdidaOpened"
      />
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

    <div id="pnCodigoTela">VENDA_PERDIDA</div>
  </v-container>
</template>

<style>
.v-overlay__scrim {
  background-color: black;
}
</style>

<style scoped>
.btnPrint {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 20px;
}

.qtdVendaPerdida {
  margin-right: 50px;
}

.qtdEstoque {
  margin-right: 10px;
}
</style>
