<script setup lang="ts">
import { onMounted, computed, reactive } from "vue";
import { state, actions } from "./configuracaoNfe";
import ModalRegimeTributario from "./components/AbaRegimeTributario.vue";
import ModalPis from "./components/AbaPis.vue";
import ModalCofins from "./components/AbaConfins.vue";

if (!state.regimeTributarioLista) {
  state.regimeTributarioLista = [];
}

onMounted(async () => {
  await actions.init();
  await actions.getDadosParaInputs();
});

const regimeOptions = computed(() => {
  return state.regimeTributarioLista.map((item) => ({
    text: item.DESCRICAO,
    value: item.ID_REGIME_TRIBUTARIO,
  }));
});

const modalState = reactive({
  selectedOption: "configuracaoNfe",
  modalOpen: false,
});

const modalOptions = [
  { value: "configuracaoNfe", label: "Configuração NFE" },
  { value: "regimeTributario", label: "Regime Tributário" },
  { value: "pis", label: "PIS" },
  { value: "cofins", label: "Cofins" },
];

const openModal = (optionValue: string) => {
  modalState.selectedOption = optionValue;
  modalState.modalOpen = true;
};

const closeModal = () => {
  modalState.modalOpen = false;
};
</script>

<template>
  <v-container>
    <v-card
      width="880"
      class="pa-5 ma-auto"
    >
      <v-overlay
        :value="state.loading"
        absolute
      >
        <v-progress-circular
          indeterminate
          color="primary"
          size="50"
        />
      </v-overlay>

      <v-row
        justify="center"
        class="mb-4"
      >
        <v-col
          cols="auto"
          class="d-flex align-center"
          v-for="option in modalOptions"
          :key="option.value"
        >
          <v-btn
            color="primary"
            @click="openModal(option.value)"
          >
            {{ option.label }}
          </v-btn>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="3">
          <v-select
            v-model="state.nfeConfig.REGIME_TRIBUTARIO"
            :items="regimeOptions"
            label="Regime Tributário"
            item-text="text"
            item-value="value"
            outlined
          />
        </v-col>

        <v-col cols="2">
          <v-text-field
            v-model="state.pis.P_VALOR"
            label="Pis"
            readonly
            disabled
            outlined
          />
        </v-col>

        <v-col cols="2">
          <v-text-field
            v-model="state.cofins.P_VALOR"
            label="Cofins"
            readonly
            disabled
            outlined
          />
        </v-col>

        <v-col cols="2">
          <v-text-field
            v-model="state.nfeConfig.LOCAL_XML"
            label="Local XML"
            outlined
          />
        </v-col>

        <v-col cols="3">
          <v-text-field
            v-model="state.nfeConfig.LOCAL_PDF"
            label="Local PDF"
            outlined
          />
        </v-col>
      </v-row>

      <v-divider class="my-4"></v-divider>
      <h4 class="mb-2">Informações CFOP</h4>
      <v-row dense>
        <v-col cols="3">
          <v-text-field
            v-model="state.nfeConfig.CFOP_TRANSP"
            label="CFOP Transporte"
            outlined
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="state.nfeConfig.CFOP_MONTAGEM_INTERNO"
            label="CFOP Montagem Interno"
            outlined
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="state.nfeConfig.CFOP_MONTAGEM_INTERESTADUAL"
            label="CFOP Montagem Interestadual"
            outlined
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="state.nfeConfig.CFOP_ECF_INTERNO"
            label="CFOP ECF Interno"
            outlined
          />
        </v-col>
      </v-row>

      <v-row
        dense
        class="mt-4"
      >
        <v-col cols="4">
          <v-text-field
            v-model="state.nfeConfig.CFOP_ECF_INTERESTADUAL"
            label="CFOP ECF Interestadual"
            outlined
          />
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="state.nfeConfig.CFOP_DEV_INTERNO"
            label="CFOP Dev. Interno"
            outlined
          />
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="state.nfeConfig.CFOP_DEV_INTERESTADUAL"
            label="CFOP Dev. Interestadual"
            outlined
          />
        </v-col>
      </v-row>

      <v-divider class="my-4"></v-divider>
      <v-row dense>
        <v-col cols="4">
          <v-text-field
            v-model="state.nfeConfig.EMIT_IM"
            label="Inscrição Municipal"
            outlined
          />
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="state.nfeConfig.EMIT_CNAE"
            label="CNAE"
            outlined
          />
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="state.nfeConfig.PROD_CEST"
            label="Prod. CEST"
            outlined
          />
        </v-col>
      </v-row>

      <v-divider class="my-4"></v-divider>
      <v-row dense>
        <v-col cols="4">
          <v-text-field
            v-model="state.nfeConfig.CST"
            label="CST"
            outlined
          />
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="state.nfeConfig.COD_LISTA_SERVICO"
            label="Cod. Lista Serviço"
            outlined
          />
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="state.nfeConfig.NCM_MONTAGEM_GERAL"
            label="NCM Montagem Geral"
            outlined
          />
        </v-col>
      </v-row>

      <v-row
        class="mt-5"
        justify="center"
      >
        <v-btn
          color="primary"
          class="ma-1"
          @click="actions.btnEdit"
        >
          Editar
        </v-btn>
        <v-btn
          color="primary"
          class="ma-1"
          @click="actions.btnSave"
        >
          Salvar
        </v-btn>
        <v-btn
          color="primary"
          class="ma-1"
          @click="actions.btnCancel"
        >
          Cancelar
        </v-btn>
      </v-row>
    </v-card>

    <v-dialog
      v-model="modalState.modalOpen"
      max-width="800px"
    >
      <template v-if="modalState.selectedOption === 'configuracaoNfe'">
        <ModalConfiguracaoNfe @close="closeModal" />
      </template>
      <template v-else-if="modalState.selectedOption === 'regimeTributario'">
        <ModalRegimeTributario @close="closeModal" />
      </template>
      <template v-else-if="modalState.selectedOption === 'pis'">
        <ModalPis @close="closeModal" />
      </template>
      <template v-else-if="modalState.selectedOption === 'cofins'">
        <ModalCofins @close="closeModal" />
      </template>
    </v-dialog>
  </v-container>
</template>
