<script setup lang="ts">
import { onMounted } from "vue";
import { state, actions, stateTabs, regimeTributarioOptions } from "./configuracaoNfe";
import AbaRegimeTributario from "./components/AbaRegimeTributario.vue";
import AbaPis from "./components/AbaPis.vue";
import AbaCofins from "./components/AbaCofins.vue";
import { computed } from "vue";

onMounted(async () => {
  await actions.init();
});

const regimeTributarioSelecionado = computed({
  get: () => {
    return (
      regimeTributarioOptions.find(
        (option) => String(option.value) === String(state.nfeConfig.REGIME_TRIBUTARIO)
      ) || {
        text: "",
        value: null,
      }
    );
  },
  set: (newValue) => {
    state.nfeConfig.REGIME_TRIBUTARIO = String(newValue.value);
  },
});
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
            v-model="regimeTributarioSelecionado"
            label="Regime Tributário"
            :items="regimeTributarioOptions"
            item-title="text"
            item-value="value"
            maxlength="100"
            dense
            :clearable="false"
            :disabled="!state.isEditable"
          />
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="state.pisSelecionado.P_VALOR"
            label="Pis"
            maxlength="15"
            dense
            :clearable="false"
            :disabled="!state.isEditable"
          />
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="state.cofinsSelecionado.P_VALOR"
            label="Cofins"
            maxlength="15"
            dense
            :clearable="false"
            :disabled="!state.isEditable"
          />
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="state.nfeConfig.LOCAL_XML"
            label="Local XML"
            maxlength="255"
            dense
            :clearable="false"
            :disabled="!state.isEditable"
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="state.nfeConfig.LOCAL_PDF"
            label="Local PDF"
            maxlength="255"
            dense
            :clearable="false"
            :disabled="!state.isEditable"
          />
        </v-col>
      </v-row>

      <v-card
        v-show="stateTabs.selectedTab === 'regimeTributario'"
        class="aba-flutuante"
      >
        <AbaRegimeTributario
          :regime-tributario="state.regimeTributarioLista"
          :abaOpened="stateTabs.selectedTab == 'regimeTributario' ? true : false"
          :isEditable="state.isEditable"
        />
      </v-card>

      <v-card
        v-show="stateTabs.selectedTab === 'pis'"
        class="aba-flutuante"
      >
        <AbaPis
          :pis="state.pisLista"
          :abaOpened="stateTabs.selectedTab == 'pis' ? true : false"
          :isEditable="state.isEditable"
        />
      </v-card>

      <v-card
        v-show="stateTabs.selectedTab === 'cofins'"
        class="aba-flutuante"
      >
        <AbaCofins
          :cofins="state.cofinsLista"
          :abaOpened="stateTabs.selectedTab == 'cofins' ? true : false"
          :isEditable="state.isEditable"
        />
      </v-card>

      <v-divider class="my-4"></v-divider>

      <h4 class="mb-2">Informações CFOP</h4>
      <v-row dense>
        <v-col cols="3">
          <v-text-field
            v-model="state.nfeConfig.CFOP_TRANSP"
            label="CFOP Transporte"
            :clearable="false"
            :disabled="!state.isEditable"
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="state.nfeConfig.CFOP_MONTAGEM_INTERNO"
            label="CFOP Montagem Interno"
            :clearable="false"
            :disabled="!state.isEditable"
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="state.nfeConfig.CFOP_MONTAGEM_INTERESTADUAL"
            label="CFOP Montagem Interestadual"
            maxlength="4"
            :clearable="false"
            :disabled="!state.isEditable"
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="state.nfeConfig.CFOP_ECF_INTERNO"
            label="CFOP ECF Interno"
            maxlength="4"
            :clearable="false"
            :disabled="!state.isEditable"
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
            maxlength="4"
            :clearable="false"
            :disabled="!state.isEditable"
          />
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="state.nfeConfig.CFOP_DEV_INTERNO"
            label="CFOP Dev. Interno"
            maxlength="4"
            :clearable="false"
            :disabled="!state.isEditable"
          />
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="state.nfeConfig.CFOP_DEV_INTERESTADUAL"
            label="CFOP Dev. Interestadual"
            maxlength="4"
            :clearable="false"
            :disabled="!state.isEditable"
          />
        </v-col>
      </v-row>

      <v-divider class="my-4"></v-divider>
      <v-row dense>
        <v-col cols="4">
          <v-text-field
            v-model="state.nfeConfig.EMIT_IM"
            label="Inscrição Municipal"
            maxlength="7"
            :clearable="false"
            :disabled="!state.isEditable"
          />
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="state.nfeConfig.EMIT_CNAE"
            label="CNAE"
            maxlength="7"
            :clearable="false"
            :disabled="!state.isEditable"
          />
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="state.nfeConfig.PROD_CEST"
            label="Prod. CEST"
            maxlength="7"
            :clearable="false"
            :disabled="!state.isEditable"
          />
        </v-col>
      </v-row>

      <v-divider class="my-4"></v-divider>
      <v-row dense>
        <v-col cols="4">
          <v-text-field
            v-model="state.nfeConfig.CST"
            maxlength="2"
            :clearable="false"
            label="CST"
            :disabled="!state.isEditable"
          />
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="state.nfeConfig.COD_LISTA_SERVICO"
            maxlength="10"
            :clearable="false"
            label="Cod. Lista Serviço"
            :disabled="!state.isEditable"
          />
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="state.nfeConfig.NCM_MONTAGEM_GERAL"
            maxlength="10"
            :clearable="false"
            label="NCM Montagem Geral"
            :disabled="!state.isEditable"
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
    </v-card>
  </v-container>
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
