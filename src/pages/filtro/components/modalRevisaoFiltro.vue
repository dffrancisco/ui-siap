<script setup lang="ts">
import { reactive } from "vue";
import { iDadosFiltro } from "../interfaces";
import utils, { msgConfirmSemCodigo } from "@/ts/utils";
import serviceFiltro from "../services/filtro.service";
import Swal from "sweetalert2";

const props = defineProps({
  dadosFiltroSelecionado: {
    type: Array as () => iDadosFiltro[],
    required: true,
  },
});

const emit = defineEmits(["closeModalRevisaoFiltro", "finalizarFiltro"]);

const stateModalRevisaoFiltro = reactive({
  loading: false,
  dadosFiltro: [] as iDadosFiltro[],
  headers: <any>[
    {
      title: "Nº Fabricante",
      key: "NUM_FABRICANTE",
      sortable: true,
    },
    {
      title: "Descrição",
      key: "DESC_PRODUTO",
      sortable: true,
    },
    {
      title: "End. Estoque",
      key: "END_ESTOQUE",
      sortable: true,
    },
    {
      title: "End. Excesso",
      key: "END_EXCESSO",
      sortable: true,
    },
    {
      title: "Qtd Antiga",
      key: "QTO_OLD",
      sortable: true,
      align: "center",
    },
    {
      title: "Qtd Nova",
      key: "QTO_NEW",
      sortable: true,
      align: "center",
    },
    {
      title: "Conferido",
      key: "conferido",
      sortable: true,
      align: "center",
    },
  ],
});

stateModalRevisaoFiltro.dadosFiltro = props.dadosFiltroSelecionado.map((item) => ({
  ...item,
  CONFERIDO: "SIM",
}));

const actions = {
  cancelar() {
    emit("closeModalRevisaoFiltro");
  },

  getClassCorLinha(dados: any) {
    let classe = dados.index % 2 == 0 ? "cor-zebrada-1" : "cor-zebrada-2";
    return { class: classe };
  },

  async finalizarRevisao() {
    if (await msgConfirmSemCodigo("Confirmação", "Deseja finalizar esse filtro?")) {
      try {
        stateModalRevisaoFiltro.loading = true;

        let itensConferidos = stateModalRevisaoFiltro.dadosFiltro.filter((item) => item.CONFERIDO == "SIM");

        let param = {
          idFiltro: stateModalRevisaoFiltro.dadosFiltro[0].ID_FILTRO,
          qtdItensConferidos: itensConferidos.length,
          itensConferidos: stateModalRevisaoFiltro.dadosFiltro,
        };

        await serviceFiltro.finalizarFiltro(param);

        Swal.fire({
          icon: "success",
          text: "Filtro finalizado com sucesso!",
          timer: 1500,
        });
        emit("finalizarFiltro", stateModalRevisaoFiltro.dadosFiltro[0].ID_FILTRO);
      } catch (error) {
        Swal.fire({
          icon: "error",
          text: "Erro ao finalizar o filtro!",
        });
      } finally {
        stateModalRevisaoFiltro.loading = false;
      }
    }
  },
};
</script>
<template>
  <v-container>
    <v-card
      :width="900"
      class="ma-auto pa-4"
    >
      <v-card class="ma-auto pa-4 cardDadosRevisaoFiltro">
        <v-chip
          style="font-weight: bold"
          color="primary"
          >Nome do Filtro: {{ stateModalRevisaoFiltro.dadosFiltro[0]?.NOME_FILTRO || "-------" }}
        </v-chip>

        <v-chip
          style="font-weight: bold"
          color="primary"
          >Conferente: {{ stateModalRevisaoFiltro.dadosFiltro[0]?.CONFERENTE || "-------" }}
        </v-chip>

        <v-chip
          style="font-weight: bold"
          color="primary"
          >Início: {{ utils.dataBrasil(stateModalRevisaoFiltro.dadosFiltro[0]?.DT_FILTRO) }} -
          {{ utils.formatHora(stateModalRevisaoFiltro.dadosFiltro[0]?.HR_INICIO) }}
        </v-chip>

        <v-chip
          style="font-weight: bold"
          color="primary"
          >Qtd. Itens: {{ stateModalRevisaoFiltro.dadosFiltro.length }}
        </v-chip>
      </v-card>

      <v-row class="ml-2 mt-4 mb-2">
        <v-card
          :width="120"
          class="pa-2"
          style="border: 1px solid #ddd; position: relative; overflow: visible"
        >
          ITENS ALTERADOS
          <v-chip
            color="primary"
            dark
            class="chip-number"
            small
          >
            {{
              stateModalRevisaoFiltro.dadosFiltro.filter(
                (item) => item.QTO_NEW !== item.QTO_OLD && item.QTO_NEW !== null
              ).length
            }}
          </v-chip>
        </v-card>

        <v-card
          :width="120"
          class="ml-4 pa-2"
          style="border: 1px solid #ddd; position: relative; overflow: visible"
        >
          TODOS OS ITENS
          <v-chip
            color="primary"
            dark
            class="chip-number"
            small
          >
            {{ stateModalRevisaoFiltro.dadosFiltro.length }}
          </v-chip>
        </v-card>
      </v-row>

      <v-data-table-virtual
        :headers="stateModalRevisaoFiltro.headers"
        items-per-page-text="Itens por página"
        items-per-page="50"
        height="380"
        class="mb-5"
        fixed-header
        :row-props="actions.getClassCorLinha"
        :items="stateModalRevisaoFiltro.dadosFiltro"
        item-key="COD_PRODUTO"
        item-value="COD_PRODUTO"
      >
        <template v-slot:item.QTO_OLD="{ item }">
          <span>
            {{ item.QTO_OLD !== null ? item.QTO_OLD : "-" }}
          </span>
        </template>
        <template v-slot:item.QTO_NEW="{ item }">
          <span>
            {{ item.QTO_NEW !== null ? item.QTO_NEW : "-" }}
          </span>
        </template>
        <template v-slot:item.conferido="{ item }">
          <div style="display: flex; align-items: center; padding: 0; margin: 0">
            <v-checkbox
              v-model="item.CONFERIDO"
              :true-value="'SIM'"
              :false-value="'NAO'"
              color="primary"
              default="SIM"
              dense
              hide-details
              :disabled="item.QTO_NEW != null || stateModalRevisaoFiltro.dadosFiltro[0].HR_TERMINO !== null"
              :value="'SIM'"
            />
          </div>
        </template>
      </v-data-table-virtual>
      <div
        v-if="stateModalRevisaoFiltro.dadosFiltro[0].FINALIZADOR != null"
        style="margin-top: 10px"
        ><span
          >Finalizado por: {{ stateModalRevisaoFiltro.dadosFiltro[0].FINALIZADOR }} ({{
            stateModalRevisaoFiltro.dadosFiltro[0].ID_FINALIZADOR
          }})
        </span>
        <span
          >em {{ utils.dataBrasil(stateModalRevisaoFiltro.dadosFiltro[0]?.DT_TERMINO) }} -
          {{ utils.formatHora(stateModalRevisaoFiltro.dadosFiltro[0]?.HR_TERMINO) }}
        </span>
      </div>

      <div style="margin-left: 75%">
        <v-btn
          variant="outlined"
          color="primary"
          @click="actions.cancelar"
          >Fechar</v-btn
        ><v-btn
          color="primary"
          :disabled="stateModalRevisaoFiltro.dadosFiltro[0].HR_TERMINO !== null"
          @click="actions.finalizarRevisao"
          class="ml-3"
        >
          Finalizar</v-btn
        >
      </div>
    </v-card>
    <v-overlay
      :model-value="stateModalRevisaoFiltro.loading"
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
</template>
<style>
.cor-zebrada-1 {
  background-color: #f0f0f0;
}

.v-overlay__scrim {
  background-color: black;
}
</style>

<style scoped>
.cardDadosRevisaoFiltro {
  border-radius: 10px;
  border: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
}

.chip-number {
  position: absolute;
  top: -10px;
  right: -10px;
  border-radius: 50%;
  height: 24px;
  width: 24px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #a5a4a4;
  background-color: white;
}
</style>
