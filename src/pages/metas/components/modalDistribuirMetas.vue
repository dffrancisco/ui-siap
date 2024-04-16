<script setup lang="ts">
import { defineProps } from "vue";
import { iResponseFuncionarios, iResponseMetasVendedoresEMontadores } from "../interfaces";
import { setup } from "./modalDistribuirMetas";
import utils from "@/ts/utils";
import ModalAtribuirMetaIndividual from "./modalAtribuirMetaIndividual.vue";

const props = defineProps({
  funcionarios: {
    type: Object as () => iResponseFuncionarios,
  },
  metaMontadores: {
    type: Array as () => iResponseMetasVendedoresEMontadores[],
  },
  metaVendedores: {
    type: Array as () => iResponseMetasVendedoresEMontadores[],
  },
  optionSelect: {
    type: Number,
  },
  mes: {
    type: Number,
  },
  ano: {
    type: Number,
  },
  opened: {
    type: Boolean,
  },
});

const emit = defineEmits(["inserirMeta", "opcaoCargoEscolhido"]);

const {
  actions,
  state,
  selecionarVendedores,
  selecionarMontadores,
  enviarDadosMeta,
  fecharModal,
  atribuirMetaIndividual,
  funcionariosOrdenados,
  funcionarioFiltrado,
  totalMetas,
} = setup(emit, props);
</script>

<template>
  <div
    class="modal-distribuir-metas"
    style="max-width: 1250px; margin: 0 auto"
  >
    <div class="mb-n2 mt-2 d-flex justify-center">
      <v-chip
        variant="outlined"
        append-icon="mdi-sale"
        class="ma-2"
        :class="{ selected: state.isVendedoresSelected }"
        color="green"
        title="Vendedores"
        @click.prevent="selecionarVendedores"
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
        @click.prevent="selecionarMontadores"
      >
        Montadores
      </v-chip>
    </div>

    <div class="ml-13 mt-7">
      <v-row>
        <v-col cols="9">
          <v-autocomplete
            label="Funcionário"
            :items="funcionariosOrdenados"
            item-title="NOME_COMP"
            item-value="COD_FUNCIONARIO"
            class="funcionario__input"
            v-model="state.codFuncionarioSelecionado"
            @update:search.sync="funcionarioFiltrado"
          ></v-autocomplete>
        </v-col>

        <v-col cols="3">
          <v-btn
            title="Adicionar meta"
            class="funcionario__btn"
            color="primary"
            @click.prevent="atribuirMetaIndividual(state.funcionarioSelecionado)"
            >Adicionar meta
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <div class="funcionarios_totalizador">
      <v-row>
        <v-col cols="3">
          <v-chip
            class="funcionarios_subtitle"
            variant="plain"
          >
            Funcionários:
          </v-chip>
          <span class="tagSpan">{{ totalMetas.qtdFuncionarios }}</span>
        </v-col>
        <v-col cols="1">
          <v-chip
            class="funcionarios_subtitle"
            variant="plain"
          >
            Mês: {{ state.mes }}
          </v-chip>
        </v-col>
        <v-col cols="2">
          <v-chip
            class="funcionarios_subtitle"
            variant="plain"
          >
            Ano: {{ state.ano }}
          </v-chip>
        </v-col>
        <v-col
          cols="3"
          style="align-items: right"
        >
          <v-chip
            class="funcionarios_subtitle"
            variant="plain"
          >
            Total Distribuído:
          </v-chip>
          <span class="tagSpan">{{ utils.formatValor(totalMetas.totalDistribuido) }}</span>
        </v-col>
      </v-row>
    </div>

    <div class="funcionarios ml-7">
      <div class="funcionarios__lista">
        <v-card
          v-for="funcionario in state.infoFuncionario"
          :key="funcionarios.COD_FUNCIONARIO"
          v-if="state.infoFuncionario.length > 0"
          class="funcionarios__lista__card"
        >
          <div class="funcionarios__lista__card__usuario">
            <div>
              <v-avatar
                size="70px"
                color="primary"
                class="funcionarios__lista__avatar"
                :title="funcionario?.LOGIN"
              >
                <v-img
                  :src="actions.getFotoFuncionarioURL(funcionario?.CPF)"
                  aspect-ratio="1"
                  cover
                ></v-img>
              </v-avatar>
            </div>
            <div class="funcionarios__lista__card__info">
              <div class="funcionarios__lista__card__nome">{{ funcionario?.LOGIN }} </div>
              <div class="funcionarios__lista__card__meta">
                {{ utils.formatValor(funcionario?.VALOR_META) }}
              </div>
            </div>
            <div class="mb-8">
              <v-icon
                class="funcionarios__lista__card__icon"
                size="x-large"
                color="primary"
                @click.prevent="atribuirMetaIndividual(funcionario)"
              >
                mdi-pen
              </v-icon>
            </div>
          </div>
        </v-card>
      </div>
    </div>
  </div>

  <div
    id="modalAtribuirMetaIndividadual"
    title="Atribuir Meta"
    style="display: none; background-color: #f0f6fa"
  >
    <ModalAtribuirMetaIndividual
      :mes="state.mes"
      :ano="state.ano"
      :funcionario="state.funcionarioSelecionado"
      :opened="state.modalAtribuirMetaIndividualOpened"
      @dadosInserirMeta.sync="enviarDadosMeta"
      @fecharModalAtribuirMetaIndividual="fecharModal"
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
.funcionarios__lista__card__info {
  flex-grow: 1;
}

.modal-distribuir-metas {
  padding: 5px;
  width: 1266px;
  height: 680px;
  top: 15px;
  left: 18px;
  gap: 21px;
}

.tagSpan {
  font-weight: 480;
  font-family: "Nunito Sans", sans-serif;
  font-size: 18px;
  font-weight: 600;
  line-height: 24.55px;
  letter-spacing: -0.06428570300340652px;
  text-align: right;
}

.selected {
  background-color: rgba(191, 228, 240, 0.741);
  font-weight: 580;
  border: 2px solid #001d7bcd;
}

.funcionario__input {
  width: 900px;
  height: 56px;
  top: 93px;
  border: 1px;
}

.funcionario__btn {
  margin-left: 40px;
  font-weight: 600;
  text-align: center;
  border-radius: 8px;
  top: 5px;
}

.funcionarios_totalizador {
  padding: 5px;
  width: 1800px;
  height: 33px;
  gap: 21px;
  margin-left: 40px;
  display: flex;
}

.funcionarios__lista {
  padding: 10px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  max-height: calc(100vh - 220px);
}

.funcionarios__lista__card {
  width: 280px;
  height: 90px;
  border-radius: 14px;
  /* padding: 14px; */
  gap: 12px;
}

.funcionarios__lista__avatar {
  cursor: pointer;
  margin-left: 5px;
  opacity: 1;
  border: 1px solid #0000002f;
}

.funcionarios__lista__card__usuario {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px; /* Espaçamento interno */
}

.funcionarios__lista__card__nome {
  flex-grow: 1;
  font-family: "Nunito Sans", sans-serif;
  font-size: 15px;
  color: #515151;
}

.funcionarios__lista__card__meta {
  font-family: Nunito Sans;
  font-size: 28px;
  font-weight: 700;
  line-height: 38.19px;
  text-align: left;
}

.funcionarios__lista__card__icon {
  cursor: pointer;
}

.funcionarios_subtitle {
  font-family: "Nunito Sans", sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 24.55px;
  letter-spacing: -0.06428570300340652px;
  text-align: left;
}
</style>
