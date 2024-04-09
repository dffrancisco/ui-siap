<script setup lang="ts">
import { defineProps } from "vue";
import { iMesEAno, iPropsMetas } from "../interfaces";
import { setup } from "./modalDistribuirMetas";
import utils from "@/ts/utils";
import ModalAtribuirMetaIndividual from "./modalAtribuirMetaIndividual.vue";

const props = defineProps({
  dadosParaDistribuirMetas: {
    type: Object as () => iPropsMetas,
  },
  mesEAno: {
    type: Object as () => iMesEAno,
  },
  opened: {
    type: Boolean,
  },
});

const {
  actions,
  state,
  vendedores,
  montadores,
  atribuirMetaIndividual,
  vendedorSelecionado,
  montadorSelecionado,
} = setup(props);
</script>

<template>
  <div
    class="modal-distribuir-metas"
    style="max-width: 1000px; margin: 0 auto"
  >
    <div class="mb-n2 mt-2 d-flex justify-center">
      <v-chip
        variant="outlined"
        append-icon="mdi-sale"
        class="ma-2"
        :class="{ selected: state.isVendedoresSelected }"
        color="green"
        title="Vendedores"
        @click.prevent="actions.selectVendedores"
      >
        Vendedores
      </v-chip>

      <v-chip
        variant="outlined"
        append-icon="mdi-wrench"
        class="ma-2"
        :class="{ selected: state.isMontadoresSelected }"
        color="orange"
        title="Montadores"
        @click.prevent="actions.selectMontadores"
      >
        Montadores
      </v-chip>
    </div>

    <div class="ml-13 mt-7">
      <v-row>
        <v-col
          cols="12"
          sm="8"
        >
          <v-text-field label="Funcionário"></v-text-field>
        </v-col>
        <v-col
          cols="12"
          sm="4"
        >
          <v-btn
            title="Adicionar meta"
            class="mr-4 mb-4 ml-10"
            color="primary"
            >Adicionar meta
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <div class="mr-10 ml-10">
      <v-row>
        <v-col
          cols="12"
          sm="8"
        >
          <v-chip variant="plain"> Funcionários: </v-chip>
          <span class="tagSpan">12</span>
        </v-col>
        <v-col
          cols="12"
          sm="4"
        >
          <v-chip variant="plain"> Total Distribuído: </v-chip>
          <span class="tagSpan">134.000.00,00</span>
        </v-col>
      </v-row>
    </div>

    <div class="funcionarios ml-11 mt-3">
      <div class="funcionarios__lista">
        <div
          class="funcionarios__lista"
          v-if="state.isVendedoresSelected"
        >
          <v-card
            class="funcionarios__lista__card"
            v-for="vendedor in vendedores"
            :key="vendedor.ID_VENDEDOR"
          >
            <div class="funcionarios__lista__card__usuario">
              <v-avatar
                size="50px"
                color="primary"
                :title="vendedor.LOGIN"
                class="funcionarios__lista__avatar"
              >
                <v-img
                  :src="actions.getFotoFuncionarioURL(vendedor.CPF)"
                  aspect-ratio="1"
                  cover
                ></v-img>
              </v-avatar>
              <div class="funcionarios__lista__card__info">
                <div class="funcionarios__lista__card__nome">{{ vendedor.LOGIN }}</div>
                <div class="funcionarios__lista__card__meta">{{ utils.formatValor(vendedor.VALOR_TOTAL) }}</div>
              </div>
              <v-icon
                class="funcionarios__lista__card__icon"
                size="x-large"
                color="primary"
                @click.prevent="atribuirMetaIndividual(vendedor)"
              >
                mdi-pen
              </v-icon>
            </div>
          </v-card>
        </div>

        <div
          v-if="state.isMontadoresSelected"
          class="funcionarios__lista"
        >
          <v-card
            class="funcionarios__lista__card"
            v-for="montador in montadores"
            :key="montador.ID_VENDEDOR"
          >
            <div class="funcionarios__lista__card__usuario">
              <v-avatar
                size="50px"
                color="primary"
                :title="montador.LOGIN"
                class="funcionarios__lista__avatar"
              >
                <v-img
                  :src="actions.getFotoFuncionarioURL(montador.CPF)"
                  aspect-ratio="1"
                  cover
                ></v-img>
              </v-avatar>
              <div class="funcionarios__lista__card__info">
                <div class="funcionarios__lista__card__nome">{{ montador.LOGIN }}</div>
                <div class="funcionarios__lista__card__meta">{{ utils.formatValor(montador.VALOR_TOTAL) }}</div>
              </div>
              <v-icon
                class="funcionarios__lista__card__icon"
                size="x-large"
                color="primary"
                @click.prevent="atribuirMetaIndividual(montador)"
              >
                > mdi-pen
              </v-icon>
            </div>
          </v-card>
        </div>
      </div>
    </div>
  </div>

  <div
    id="modalAtribuirMetaIndividadual"
    title="Atribuir Meta"
    style="display: none"
  >
    <ModalAtribuirMetaIndividual
      v-if="vendedorSelecionado || montadorSelecionado"
      :mesEAno="{
        mes: state.mes,
        ano: state.ano,
      }"
      :dadosParaAtribuirMetaIndividual="{
        vendedor: vendedorSelecionado,
        montador: montadorSelecionado,
      }"
      :opened="state.modalAtribuirMetaIndividualOpened"
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
</template>

<style scoped>
.modal-distribuir-metas {
  padding: 5px;
}

.tagSpan {
  font-size: 16px;
  font-weight: 480;
}

.selected {
  background-color: rgba(191, 228, 240, 0.741);
  font-weight: 580;
  border: 2px solid #001d7bcd;
}

.funcionarios {
  .funcionarios__lista {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    max-height: calc(100vh - 240px);
  }

  .funcionarios__lista__card {
    width: 210px;
    height: 80px;
    border-radius: 10px;
  }

  .funcionarios__lista__avatar {
    cursor: pointer;
    margin-left: 5px;
    margin-top: 5px;
    opacity: 1;
    border: 1px solid #0000002f;
    flex-shrink: 0; /* Evita que o avatar afete o tamanho do card */
  }

  .funcionarios__lista__card__usuario {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px; /* Espaçamento interno */
  }

  .funcionarios__lista__card__nome {
    font-size: 13px;
    color: #515151;
  }

  .funcionarios__lista__card__meta {
    font-size: 16px;
    font-size: 16px;
    font-weight: 450;
  }

  .funcionarios__lista__card__icon {
    cursor: pointer;
  }
}
</style>
