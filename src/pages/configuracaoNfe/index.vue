<script setup lang="ts">
import { onMounted } from "vue";
import {
  state,
  actions,
  stateTabs,
  regimeTributarioOptions,
  regimeTributarioSelecionado,
  pisSelecionado,
  cofinsSelecionado,
} from "./configuracaoNfe";
import AbaRegimeTributario from "./components/AbaRegimeTributario.vue";
import AbaPis from "./components/AbaPis.vue";
import AbaCofins from "./components/AbaCofins.vue";
import utils from "@/ts/utils";

onMounted(async () => {
  await actions.init();
});
</script>

<template>
  <v-container>
    <v-card
      max-width="800"
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
        <v-col cols="4">
          <span>Regime Tributário</span>
          <select
            v-model="regimeTributarioSelecionado"
            id="regimeTributarioSelecionado"
            name="regimeTributarioSelecionado"
            class="obr ss"
            :disabled="!state.isEditable"
          >
            <option
              v-for="option in regimeTributarioOptions"
              :key="option.value"
              :value="option"
            >
              {{ option.text }}
            </option>
          </select>
        </v-col>
        <v-col cols="4">
          <span>Valor PIS</span>
          <input
            v-model="pisSelecionado.P_VALOR"
            id="P_VALOR_PIS"
            name="P_VALOR_PIS"
            type="number"
            class="ss"
            :disabled="!state.isEditable"
          />
        </v-col>
        <v-col cols="4">
          <span>Valor Cofins</span>
          <input
            v-model="cofinsSelecionado.P_VALOR"
            id="P_VALOR_COFINS"
            name="P_VALOR_COFINS"
            type="number"
            class="ss"
            :disabled="!state.isEditable"
          />
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="6">
          <span>Local XML</span>
          <input
            v-model="state.nfeConfig.LOCAL_XML"
            id="LOCAL_XML"
            name="LOCAL_XML"
            type="text"
            class="obr ss"
            :disabled="!state.isEditable"
          />
        </v-col>
        <v-col cols="6">
          <span>Local PDF</span>
          <input
            v-model="state.nfeConfig.LOCAL_PDF"
            id="LOCAL_PDF"
            name="LOCAL_PDF"
            type="text"
            class="obr ss"
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

      <v-divider class="my-3"></v-divider>

      <h4 class="mb-2">Informações CFOP</h4>
      <v-row dense>
        <v-col cols="3">
          <span>CFOP Transporte</span>
          <input
            v-model="state.nfeConfig.CFOP_TRANSP"
            id="CFOP_TRANSP"
            name="CFOP_TRANSP"
            type="number"
            class="obr ss"
            :disabled="!state.isEditable"
          />
        </v-col>
        <v-col cols="3">
          <span>CFOP Montagem Interno</span>
          <input
            v-model="state.nfeConfig.CFOP_MONTAGEM_INTERNO"
            id="CFOP_MONTAGEM_INTERNO"
            name="CFOP_MONTAGEM_INTERNO"
            type="number"
            class="obr ss"
            :disabled="!state.isEditable"
          />
        </v-col>
        <v-col cols="3">
          <span>CFOP Montagem Interestadual</span>
          <input
            v-model="state.nfeConfig.CFOP_MONTAGEM_INTERESTADUAL"
            id="CFOP_MONTAGEM_INTERESTADUAL"
            name="CFOP_MONTAGEM_INTERESTADUAL"
            type="number"
            class="obr ss"
            :disabled="!state.isEditable"
          />
        </v-col>
        <v-col cols="3">
          <span>CFOP ECF Interno</span>
          <input
            v-model="state.nfeConfig.CFOP_ECF_INTERNO"
            id="CFOP_ECF_INTERNO"
            name="CFOP_ECF_INTERNO"
            type="number"
            class="obr ss"
            :disabled="!state.isEditable"
          />
        </v-col>
      </v-row>

      <v-row
        dense
        class="mt-2"
      >
        <v-col cols="4">
          <span>CFOP ECF Interestadual</span>
          <input
            v-model="state.nfeConfig.CFOP_ECF_INTERESTADUAL"
            id="CFOP_ECF_INTERESTADUAL"
            name="CFOP_ECF_INTERESTADUAL"
            type="number"
            class="obr ss"
            :disabled="!state.isEditable"
          />
        </v-col>
        <v-col cols="4">
          <span>CFOP Devolução Interno</span>
          <input
            v-model="state.nfeConfig.CFOP_DEV_INTERNO"
            id="CFOP_DEV_INTERNO"
            name="CFOP_DEV_INTERNO"
            type="number"
            class="obr ss"
            :disabled="!state.isEditable"
          />
        </v-col>
        <v-col cols="4">
          <span>CFOP Devolução Interestadual</span>
          <input
            v-model="state.nfeConfig.CFOP_DEV_INTERESTADUAL"
            id="CFOP_DEV_INTERESTADUAL"
            name="CFOP_DEV_INTERESTADUAL"
            type="number"
            class="obr ss"
            :disabled="!state.isEditable"
          />
        </v-col>
      </v-row>
      <v-divider class="my-3"></v-divider>
      <v-row
        dense
        class="mt-2"
      >
        <v-col cols="4">
          <span>Emitente IM</span>
          <input
            v-model="state.nfeConfig.EMIT_IM"
            id="EMIT_IM"
            name="EMIT_IM"
            type="number"
            class="obr ss"
            :disabled="!state.isEditable"
          />
        </v-col>
        <v-col cols="4">
          <span>Emitente CNAE</span>
          <input
            v-model="state.nfeConfig.EMIT_CNAE"
            id="EMIT_CNAE"
            name="EMIT_CNAE"
            type="number"
            class="obr ss"
            :disabled="!state.isEditable"
          />
        </v-col>
        <v-col cols="4">
          <span>Produto CEST</span>
          <input
            v-model="state.nfeConfig.PROD_CEST"
            id="PROD_CEST"
            name="PROD_CEST"
            type="text"
            class="obr ss"
            :disabled="!state.isEditable"
          />
        </v-col>
      </v-row>

      <v-row
        dense
        class="mt-2"
      >
        <v-col cols="4">
          <span>CST</span>
          <input
            v-model="state.nfeConfig.CST"
            id="CST"
            name="CST"
            type="text"
            class="obr ss"
            :disabled="!state.isEditable"
          />
        </v-col>
        <v-col cols="4">
          <span>Código Lista Serviço</span>
          <input
            v-model="state.nfeConfig.COD_LISTA_SERVICO"
            id="COD_LISTA_SERVICO"
            name="COD_LISTA_SERVICO"
            type="text"
            class="obr ss"
            :disabled="!state.isEditable"
          />
        </v-col>
        <v-col cols="4">
          <span>NCM Montagem Geral</span>
          <input
            v-model="state.nfeConfig.NCM_MONTAGEM_GERAL"
            id="NCM_MONTAGEM_GERAL"
            name="NCM_MONTAGEM_GERAL"
            type="text"
            class="obr ss"
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
          :disabled="!state.isEditable"
          >Salvar</v-btn
        >
        <v-btn
          color="primary"
          class="ma-1 btn-style"
          @click="actions.btnCancel"
          :disabled="!state.isEditable"
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
  <div id="pnCodigoTela">configuracaoNFe</div>
</template>

<style scoped>
.aba-flutuante {
  position: absolute;
  top: 85px;
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
