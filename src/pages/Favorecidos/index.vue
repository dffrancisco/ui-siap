<script setup lang="ts">
import { actions, state } from "./favorecidos";
import { onMounted, onUnmounted } from "vue";
import { useEventListener } from "@vueuse/core";

const eventListener = useEventListener(document, "keydown", async (event) => {
  if (event.key === "F1") {
    document.getElementById("edtSearch").focus();
    event.preventDefault();
    event.stopPropagation();
  }
});

onMounted(async () => {
  actions.init();
});

onUnmounted(() => {
  removeEventListener("keydown", eventListener);
});

const vinculoMap = {
  AD: "Administrativo",
  OP: "Operacional",
  RH: "Pessoal",
};
</script>

<template>
  <v-container>
    <title>Gerenciar Clientes</title>
    <v-card
      width="700"
      class="pa-5 ma-auto"
    >
      <div id="pnCampos">
        <v-row class="mt-n1">
          <v-col cols="6"
            ><span>Nome do Favorecido</span>
            <input
              v-model="state.dbFavorecido.NM_FAVORECIDO"
              type="text"
              id="NM_FAVORECIDO"
              name="NM_FAVORECIDO"
              class="obr ss"
              maxlength="60"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="6">
            <span>Tipo de Vínculo</span>
            <select
              v-model="state.dbFavorecido.TP_VINCULO"
              id="TP_VINCULO"
              name="TP_VINCULO"
              class="obr ss"
            >
              <option
                v-for="(value, key) in vinculoMap"
                :key="key"
                :value="key"
              >
                {{ value }}
              </option>
            </select>
          </v-col>
        </v-row>
        <v-row class="mt-n1">
          <v-col cols="6">
            <span>Nome da Matriz</span>
            <input
              v-model="state.dbFavorecido.NM_MATRIZ"
              type="text"
              id="NM_MATRIZ"
              name="NM_MATRIZ"
              class="obr ss"
              maxlength="60"
              autocomplete="off"
              v-mask="0"
            />
          </v-col>
          <v-col cols="3">
            <span>CNPJ</span>
            <input
              v-model="state.dbFavorecido.NR_CNPJ"
              type="text"
              id="NR_CNPJ"
              name="NR_CNPJ"
              class="obr ss"
              maxlength="18"
              v-mask="'##.###.###/####-##'"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="3">
            <span>CPF</span>
            <input
              v-model="state.dbFavorecido.NR_CPF"
              type="text"
              id="NR_CPF"
              name="NR_CPF"
              class="obr ss"
              maxlength="14"
              v-mask="'###.###.###-##'"
              autocomplete="off"
            />
          </v-col>
        </v-row>
        <v-row class="mt-n1">
          <v-col cols="3">
            <span>Banco</span>
            <select
              v-model="state.dbFavorecido.CD_BANCO"
              id="bankSelect"
              name="bankSelect"
              class="obr ss"
            >
              <option value="">Selecione um banco</option>
              <option value="392">BANCO MERCANTIL DE SÃO PAULO S.A.</option>
              <option value="394">BANCO BMC S.A.</option>
              <option value="399">HSBC BANK BRASIL S.A. - BANCO MÚLTIPLO</option>
              <option value="409">UNIÃO DE BANCOS BRASILEIROS S.A.</option>
              <option value="422">BANCO SAFRA S.A.</option>
              <option value="452">BANCO RURAL S.A.</option>
              <option value="456">BANCO DE TOKYO-MITSUBISHI UFJ BRASIL S.A.</option>
              <option value="464">BANCO SUMITOMO MITSUI BRASILEIRO S.A.</option>
              <option value="477">CITIBANK N.A.</option>
              <option value="479">BANCO ITAÚBANCO S.A.</option>
              <option value="487">DEUTSCHE BANK S.A. - BANCO ALEMÃO</option>
              <option value="488">JPMORGAN CHASE BANK</option>
              <option value="492">ING BANK N.V.</option>
              <option value="505">BANCO CREDIT SUISSE (BRASIL) S.A.</option>
              <option value="600">BANCO LUSO BRASILEIRO S.A.</option>
              <option value="604">BANCO INDUSTRIAL DO BRASIL S.A.</option>
              <option value="610">BANCO VR S.A.</option>
              <option value="611">BANCO PAULISTA S.A.</option>
              <option value="612">BANCO GUANABARA S.A.</option>
              <option value="623">BANCO PANAMERICANO S.A.</option>
              <option value="626">BANCO INTERCAP S.A.</option>
              <option value="630">BANCO RENDIMENTO S.A.</option>
              <option value="633">BANCO TRIÂNGULO S.A.</option>
              <option value="637">BANCO SOFISA S.A.</option>
              <option value="641">BANCO PROSPER S.A.</option>
              <option value="643">BANCO ALVORADA S.A.</option>
              <option value="652">BANCO ITAÚ HOLDING FINANCEIRA S.A.</option>
              <option value="653">BANCO ITAÚ S.A.</option>
              <option value="654">BANCO INDUSVAL S.A.</option>
              <option value="655">BANCO VOTORANTIM S.A.</option>
              <option value="6565">REDSDFDSFSD</option>
              <option value="707">BANCO DAYCOVAL S.A.</option>
              <option value="719">BANCO INTERNACIONAL DO FUNCHAL (BRASIL) S.A.</option>
              <option value="735">BANCO GERDAU S.A.</option>
              <option value="745">BANCO CITIBANK S.A.</option>
              <option value="746">BANCO RABOBANK INTERNATIONAL BRASIL S.A.</option>
              <option value="748">BANCO COOPERATIVO SICREDI S.A.</option>
              <option value="751">BANCO SIMPLES S.A.</option>
              <option value="752">DRESDNER BANK BRASIL S.A. - BANCO MÚLTIPLO</option>
              <option value="753">BANCO BNP PARIBAS BRASIL S.A.</option>
              <option value="755">BANCO MERRILL LYNCH DE INVESTIMENTOS S.A.</option>
              <option value="756">BANCO COOPERATIVO DO BRASIL S.A.</option>
              <option value="757">NU PAGAMENTOS S.A.</option>
              <option value="070">BANCO REGIONAL DE BRASÍLIA S.A.</option>
              <option value="208">BANCO UBS PACTUAL S.A.</option>
              <option value="210">DRESDNER BANK LATEINAMERIKA AKTIENGESELLSCHAFT</option>
              <option value="214">BANCO DIBENS S.A.</option>
              <option value="215">BANCO COMERCIAL E DE INVESTIMENTO SUDAMERIS S.A.</option>
              <option value="222">BANCO CALYON BRASIL S.A.</option>
              <option value="224">BANCO FIBRA S.A.</option>
              <option value="225">BANCO BRASCAN S.A.</option>
              <option value="229">BANCO CRUZEIRO DO SUL S.A.</option>
              <option value="230">UNICARD BANCO MÚLTIPLO S.A.</option>
              <option value="233">BANCO GE CAPITAL S.A.</option>
              <option value="237">BANCO BRADESCO S.A.</option>
              <option value="243">BANCO UBS S.A.</option>
              <option value="246">BANCO BOAVISTA INTERATLÂNTICO S.A.</option>
              <option value="248">BANCO INVESTCRED UNIBANCO S.A.</option>
              <option value="249">BANCO SCHAHIN S.A.</option>
              <option value="252">BANCO FININVEST S.A.</option>
              <option value="254">BANCO CACIQUE S.A.</option>
              <option value="318">BANCO BMG S.A.</option>
              <option value="320">BANCO INDUSTRIAL E COMERCIAL S.A.</option>
              <option value="341">BANCO ITAÚ S.A.</option>
              <option value="352">BANCO J. P. MORGAN S.A.</option>
              <option value="356">BANCO ABN AMRO REAL S.A.</option>
              <option value="366">BANCO SOCIÉTÉ GÉNÉRALE BRASIL S.A.</option>
              <option value="369">BANCO WESTLB DO BRASIL S.A.</option>
              <option value="376">BANCO J. P. MORGAN S.A.</option>
              <option value="389">BANCO MERCANTIL DO BRASIL S.A.</option>
            </select>
          </v-col>

          <v-col cols="3">
            <span>Agência</span>
            <input
              v-model="state.dbFavorecido.CD_AGENCIA"
              type="text"
              id="CD_AGENCIA"
              name="CD_AGENCIA"
              class="obr ss"
              maxlength="10"
              v-mask="'####-#'"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="3">
            <span>Nº da Conta</span>
            <input
              v-model="state.dbFavorecido.NR_CONTA"
              type="text"
              id="NR_CONTA"
              name="NR_CONTA"
              class="obr ss"
              maxlength="15"
              v-mask="'#####-#'"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="3">
            <span>Operação</span>
            <input
              v-model="state.dbFavorecido.CD_OPERACAO"
              type="text"
              id="CD_OPERACAO"
              name="CD_OPERACAO"
              class="obr ss"
              maxlength="3"
              autocomplete="off"
            />
          </v-col>
        </v-row>

        <div class="mt-2 d-flex ga-2">
          <input
            v-model="state.edtSearch"
            type="text"
            placeholder="F1 - Buscar"
            :disabled="state.pnSearch"
            @keydown.enter.prevent="actions.search()"
            @keydown.arrow-down="state.gridPrincipal.focus(0)"
            id="edtSearch"
            class="ss"
          />

          <v-btn
            :disabled="state.pnSearch"
            size="30"
            color="primary"
            @click="actions.search()"
            icon="mdi-magnify"
          />
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
          size="50"
        ></v-progress-circular>
      </v-overlay>

      <div
        id="gridPrincipal"
        class="mt-2"
      ></div>

      <div
        id="pnBotoes"
        class="mt-2"
        style="text-align: center"
      ></div>
    </v-card>

    <div id="pnCodigoTela">Favorecidos</div>
  </v-container>
</template>

<style scoped>
.ss {
  margin-right: 5px;
  margin-top: 1px;
}
</style>
