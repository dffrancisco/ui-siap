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

const changeTab = (tabValue: string) => {
  stateTabs.selectedTab = tabValue;
};
</script>

<template>
  <v-container>
    <v-card
      width="800"
      class="pa-5 ma-auto"
    >
      <v-row class="mb-2">
        <v-col cols="12">
          <v-tabs
            v-model="stateTabs.selectedTab"
            background-color="primary"
            color="primary"
            grow
          >
            <v-tab value="configuracaoNfe">Configuração NFE</v-tab>
            <v-tab value="regimeTributario">Regime Tributário</v-tab>
            <v-tab value="pis">PIS</v-tab>
            <v-tab value="cofins">Cofins</v-tab>
          </v-tabs>
        </v-col>
      </v-row>

      <v-row dense>
        <v-col cols="3">
          <v-select
            v-model="state.nfeConfig.REGIME_TRIBUTARIO"
            label="Regime Tributário"
            :items="regimeTributarioOptions"
            item-title="text"
            item-value="value"
            dense
            clearable
          />
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="state.pis.P_VALOR"
            label="Pis"
            dense
          />
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="state.cofins.P_VALOR"
            label="Cofins"
            dense
          />
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="state.nfeConfig.LOCAL_XML"
            label="Local XML"
            dense
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="state.nfeConfig.LOCAL_PDF"
            label="Local PDF"
            dense
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
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="state.nfeConfig.CFOP_MONTAGEM_INTERNO"
            label="CFOP Montagem Interno"
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="state.nfeConfig.CFOP_MONTAGEM_INTERESTADUAL"
            label="CFOP Montagem Interestadual"
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="state.nfeConfig.CFOP_ECF_INTERNO"
            label="CFOP ECF Interno"
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
          />
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="state.nfeConfig.CFOP_DEV_INTERNO"
            label="CFOP Dev. Interno"
          />
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="state.nfeConfig.CFOP_DEV_INTERESTADUAL"
            label="CFOP Dev. Interestadual"
          />
        </v-col>
      </v-row>

      <v-divider class="my-4"></v-divider>
      <v-row dense>
        <v-col cols="4">
          <v-text-field
            v-model="state.nfeConfig.EMIT_IM"
            label="Inscrição Municipal"
          />
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="state.nfeConfig.EMIT_CNAE"
            label="CNAE"
          />
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="state.nfeConfig.PROD_CEST"
            label="Prod. CEST"
          />
        </v-col>
      </v-row>

      <v-divider class="my-4"></v-divider>
      <v-row dense>
        <v-col cols="4">
          <v-text-field
            v-model="state.nfeConfig.CST"
            label="CST"
          />
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="state.nfeConfig.COD_LISTA_SERVICO"
            label="Cod. Lista Serviço"
          />
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="state.nfeConfig.NCM_MONTAGEM_GERAL"
            label="NCM Montagem Geral"
          />
        </v-col>
      </v-row>

      <v-row
        class="mt-4"
        justify="center"
      >
        <v-btn
          color="primary"
          class="ma-1 btn-style"
          @click="actions.btnEdit"
          >Editar</v-btn
        >
        <v-btn
          color="primary"
          class="ma-1 btn-style"
          @click="actions.btnSave"
          >Salvar</v-btn
        >
        <v-btn
          color="primary"
          class="ma-1 btn-style"
          @click="actions.btnCancel"
          >Cancelar</v-btn
        >
      </v-row>
      <v-overlay
        :model-value="state.loading"
        class="load"
        persistent
      >
        <v-progress-circular
          color="primary"
          indeterminate
          size="64"
        ></v-progress-circular>
      </v-overlay>
    </v-card>
  </v-container>
</template>

<style scoped>
.aba-flutuante {
  position: absolute;
  top: 70px;
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

.btn-style {
  padding: 5px 7px;
  border-radius: 4px;
}
</style>
