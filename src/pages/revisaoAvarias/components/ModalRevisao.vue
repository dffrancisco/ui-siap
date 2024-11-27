<script lang="ts" setup>
import { computed, onMounted, reactive } from "vue";
import { iAvaria, iAvariaDestino, iFuncionario } from "../interfaces";

const props = defineProps({
  avaria: {
    type: Object as () => iAvaria,
    required: true,
  },
  destinos: {
    type: Array as () => iAvariaDestino[],
    required: true,
  },
  funcionarios: {
    type: Array as () => iFuncionario[],
    required: true,
  },
});

const emits = defineEmits(["closeModal"]);

const origemConteudo = [
  {
    value: "L",
    label: "Na Loja",
  },
  {
    value: "D",
    label: "Na Devolução do Cliente",
  },
  {
    value: "F",
    label: "Ao Receber do Fornecedor",
  },
];

const state = reactive({
  dbAvaria: <iAvaria>{},
});

const actions = {
  closeModal() {
    emits("closeModal");
  },
};

const computeds = {
  origemDescricao: computed(() => {
    switch (state.dbAvaria.ORIGEM_AVARIA) {
      case "L":
        return "Loja";
      case "D":
        return "Devolução";
      case "F":
        return "Fornecedor";
    }
  }),
};

onMounted(() => {
  state.dbAvaria = { ...props.avaria };
});
</script>

<template>
  <v-card>
    <div class="d-flex justify-space-between align-center px-4 py-2">
      <v-card-title class="pa-0">Revisar Avaria</v-card-title>
      <v-icon
        size="x-large"
        title="Fechar"
        @click="actions.closeModal"
        >mdi-close
      </v-icon>
    </div>

    <v-divider></v-divider>

    <div class="pa-4">
      <div>
        <v-row>
          <v-col cols="4">
            <v-text-field
              v-model="state.dbAvaria.NUM_FABRICANTE"
              disabled
              label="Nº Fabricante"
            ></v-text-field>
          </v-col>
          <v-col cols="8">
            <v-text-field
              v-model="state.dbAvaria.DESC_PRODUTO"
              disabled
              label="Produto"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-select
              v-model="state.dbAvaria.ORIGEM_AVARIA"
              :items="origemConteudo"
              item-value="value"
              item-title="label"
              label="Origem*"
              :clearable="false"
            ></v-select>
          </v-col>
          <v-col>
            <v-select
              v-model="state.dbAvaria.COD_FUNCIONARIO_IDENTIFICOU"
              :items="props.funcionarios"
              item-value="COD_FUNCIONARIO"
              item-title="LOGIN"
              label="Identificador da Avaria*"
              :clearable="false"
            ></v-select>
          </v-col>
          <v-col>
            <v-select
              v-model="state.dbAvaria.ID_AVARIA_DESTINO"
              :items="props.destinos"
              item-value="ID_AVARIA_DESTINO"
              item-title="DESCRICAO"
              label="Destino*"
              :clearable="false"
            ></v-select>
          </v-col>

          <v-col cols="12">
            <v-textarea
              v-model="state.dbAvaria.DESCRICAO_AVARIA"
              label="Descrição da Avaria*"
              rows="3"
            ></v-textarea>
          </v-col>
        </v-row>
      </div>

      <div class="mt-4">
        <span class="text-h6">Fotos</span>
      </div>

      <div class="mt-4 d-flex justify-space-between align-center">
        <div
          ><span
            v-if="props.avaria.FINALIZADO == 'S'"
            class="text-body-1"
            >Revisada por Vinicius em 26/11/2024 ás 16h49</span
          ></div
        >
        <v-btn
          v-if="props.avaria.FINALIZADO == 'N'"
          color="primary"
          >revisar</v-btn
        >
      </div>
    </div>
  </v-card>
</template>
