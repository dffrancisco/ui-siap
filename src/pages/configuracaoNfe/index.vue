<script setup lang="ts">
import { onMounted } from "vue";
import { state, actions, stateTabs, tabOptions, regimeTributarioOptions } from "./configuracaoNfe";
import AbaRegimeTributario from "./components/AbaRegimeTributario.vue";
import AbaPis from "./components/AbaPis.vue";
import AbaCofins from "./components/AbaConfins.vue";

onMounted(async () => {
  await actions.init();
  await actions.getDadosParaInputs();
});

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
          class="d-flex align-center"
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
            v-model="state.pis.ID_REGIME_TRIBUTARIO"
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

      <div v-show="stateTabs.selectedTab === 'configuracaoNfe'">
        <AbaConfiguracaoNfe :nfeConfig="state.nfeConfig" />
      </div>
      <div v-show="stateTabs.selectedTab === 'regimeTributario'">
        <AbaRegimeTributario :regimeTributarioLista="[state.regimeTributarioLista]" />
      </div>
      <div v-show="stateTabs.selectedTab === 'pis'">
        <AbaPis :pis="[state.pis]" />
      </div>
      <div v-show="stateTabs.selectedTab === 'cofins'">
        <AbaCofins :cofins="[state.cofins]" />
      </div>
    </v-card>
  </v-container>
</template>

<style scoped>
.aba-flutuante {
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  max-height: 400px;
  background: white;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  padding: 20px;
  z-index: 100;
}
</style>
