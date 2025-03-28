<script setup lang="ts">
import { onMounted } from "vue";
import { state, actions, stateTabs, regimeTributarioOptions } from "./configuracaoNfe";
import AbaRegimeTributario from "./components/AbaRegimeTributario.vue";
import AbaPis from "./components/AbaPis.vue";
import AbaCofins from "./components/AbaConfins.vue";

onMounted(async () => {
  await actions.init();
  await actions.getDadosParaInputs();
});

const tabOptions = [
  { value: "configuracaoNfe", label: "Configuração NFE" },
  { value: "regimeTributario", label: "Regime Tributário" },
  { value: "pis", label: "PIS" },
  { value: "cofins", label: "Cofins" },
];

const changeTab = (tabValue: string) => {
  stateTabs.selectedTab = tabValue;
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
        justify="start"
        class="mb-1"
      >
        <v-col
          cols="auto"
          v-for="option in tabOptions"
          :key="option.value"
        >
          <v-btn
            color="primary"
            class="pa-1 mr-1"
            small
            @click="changeTab(option.value)"
          >
            {{ option.label }}
          </v-btn>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="3">
          <v-select
            v-model="state.nfeConfig.REGIME_TRIBUTARIO"
            label="Regime Tributário"
            :items="regimeTributarioOptions"
            item-title="text"
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
      </v-row>

      <v-card
        v-show="stateTabs.selectedTab === 'regimeTributario'"
        class="aba-flutuante"
      >
        <AbaRegimeTributario :regimeTributarioLista="[state.regimeTributarioLista]" />
      </v-card>

      <v-card
        v-show="stateTabs.selectedTab === 'pis'"
        class="aba-flutuante"
      >
        <AbaPis :pis="[state.pis]" />
      </v-card>

      <v-card
        v-show="stateTabs.selectedTab === 'cofins'"
        class="aba-flutuante"
      >
        <AbaCofins :cofins="[state.cofins]" />
      </v-card>

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
          >Editar</v-btn
        >
        <v-btn
          color="primary"
          class="ma-1"
          @click="actions.btnSave"
          >Salvar</v-btn
        >
        <v-btn
          color="primary"
          class="ma-1"
          @click="actions.btnCancel"
          >Cancelar</v-btn
        >
      </v-row>
    </v-card>
  </v-container>
</template>

<style scoped>
.aba-flutuante {
  position: absolute;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 1400px;
  max-height: 459px;
  background: white;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  padding: 20px;
  z-index: 100;
}
</style>
