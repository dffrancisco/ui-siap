<script setup lang="ts">
import { defineProps } from "vue";
import { iPropsVendedores } from "../interfaces";
import { setup } from "./modalDistribuirMetas";

const props = defineProps({
  dadosParaDistribuirMetas: {
    type: Object as () => iPropsVendedores,
  },
  opened: {
    type: Boolean,
  },
});

const mes = props.dadosParaDistribuirMetas.mes;
const ano = props.dadosParaDistribuirMetas.ano;

const { actions, state, vendedores } = setup(props);
</script>

<template>
  <div
    class="modal-distribuir-metas"
    style="max-width: 900px; margin: 0 auto"
  >
    <div class="mb-n2 mt-2 d-flex justify-center">
      <v-chip
        variant="outlined"
        append-icon="mdi-sale"
        class="ma-2"
        color="green"
        title="Vendedores"
      >
        Vendedores
      </v-chip>

      <v-chip
        variant="outlined"
        append-icon="mdi-wrench"
        class="ma-2"
        color="orange"
        title="Montadores"
      >
        Montadores
      </v-chip>
    </div>

    <div class="ml-15 mt-7">
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
            class="mr-4 mb-4"
            color="primary"
            >Adicionar meta
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <div class="ml-16">
      <v-row>
        <v-col
          cols="12"
          sm="8"
        >
          <span>Vendedores: </span>
          <span>12</span>
        </v-col>
        <v-col
          cols="12"
          sm="4"
        >
          <span>Total Distribuído: </span>
          <span>134.000.00,00</span>
        </v-col>
      </v-row>
    </div>

    <div
      class="funcionarios ml-15 mt-3"
      style=""
    >
      <div class="funcionarios__lista">
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
              <div class="funcionarios__lista__card__meta">{{ vendedor.VALOR_TOTAL }}</div>
            </div>
            <v-icon
              class="funcionarios__lista__card__icon"
              size="x-large"
              color="primary"
              >mdi-pen</v-icon
            >
          </div>
        </v-card>
      </div>
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
</template>

<style scoped>
.modal-distribuir-metas {
  padding: 5px;
}

.funcionarios {
  .funcionarios__lista {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    max-height: calc(100vh - 240px);
  }

  .funcionarios__lista__card {
    width: 250px;
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
    color: #000000;
  }

  .funcionarios__lista__card__icon {
    cursor: pointer;
    padding-left: 50px;
  }
}
</style>
