<script setup lang="ts">
import { defineProps, defineEmits, computed } from "vue";
import utils from "@/ts/utils";

const props = defineProps<{
  caixa: {
    COD_FUNCIONARIO: number;
    LOGIN: string;
    CPF: string;
    STATUS: number;
    TROCO: number;
    HORA_ABERTURA: string;
    HORA_FECHAMENTO: string | null;
    DEVOLUCAO: number;
    SANGRIA: number;
    DINHEIRO: number;
    CONFERIDO: string | null;
  };
}>();

const emits = defineEmits(["fechar-caixa", "salvar-sangria"]);

const getFotoFuncionarioURL = (cpf: string) => {
  if (!cpf) {
    return "";
  }
  const cpfSanitizado = cpf.replaceAll(".", "").replaceAll("-", "");
  return `https://www.reallatas.com.br/_serverAPP/thumb.php?img=http://www.reallatas.com.br/foto_funcionarios/${cpfSanitizado}.jpg`;
};

const botoesVisiveis = computed(() => {
  return [props.caixa.STATUS !== 2, props.caixa.STATUS !== 2, true].filter(Boolean).length;
});
</script>

<template>
  <v-card
    class="d-flex flex-column justify-space-between pt-2"
    min-height="280px"
    :class="{
      'caixa-aberto': caixa.STATUS == 1,
      'caixa-fechado': caixa.STATUS == 2,
    }"
  >
    <v-row align="center">
      <v-col cols="3">
        <v-avatar
          size="50px"
          color="primary"
          class="ml-2 btn-bordered"
        >
          <v-img
            :src="getFotoFuncionarioURL(caixa.CPF)"
            cover
          ></v-img>
        </v-avatar>
      </v-col>
      <v-col cols="9">
        <div class="text-subtitle-1 font-weight-bold">
          <span>{{ caixa.LOGIN }}</span>
        </div>
        <div class="text-caption status-badge">
          <span>{{ caixa.STATUS == 1 ? "Caixa Aberto" : "Caixa Fechado" }}</span>
        </div>
      </v-col>
    </v-row>
    <v-divider></v-divider>

    <v-container class="pa-2">
      <v-row class="pt-2">
        <v-col cols="4">
          <span
            >Troco: <b>{{ utils.formatValor(caixa.TROCO) }}</b></span
          >
        </v-col>
        <v-col
          cols="8"
          class="d-flex justify-space-between"
        >
          <div>
            <span
              >Aberto: <b>{{ utils.formatHora(caixa.HORA_ABERTURA) }}</b></span
            >
          </div>
          <div>
            <span
              >Fechado: <b>{{ caixa.HORA_FECHAMENTO ? utils.formatHora(caixa.HORA_FECHAMENTO) : "----" }}</b></span
            >
          </div>
        </v-col>
        <v-col cols="6">
          <span
            >Devolução: <b>{{ utils.formatValor(caixa.DEVOLUCAO) }}</b></span
          >
        </v-col>
        <v-col cols="6">
          <span
            >Sangria: <b>{{ utils.formatValor(caixa.SANGRIA) }}</b></span
          >
        </v-col>
        <v-col cols="12">
          <span>
            Dinheiro no caixa:
            <span
              class="dinheiro-caixa"
              :class="{
                'badge-dinheiro-caixa-red': caixa.DINHEIRO > 400,
                'badge-dinheiro-caixa': caixa.DINHEIRO <= 400,
              }"
            >
              {{ utils.formatValor(caixa.DINHEIRO) }}
            </span>
          </span>
        </v-col>

        <v-col cols="12">
          <span
            >Conferido por:
            <b>{{ caixa.CONFERIDO && caixa.CONFERIDO.trim() !== "" ? caixa.CONFERIDO : "----" }}</b></span
          >
        </v-col>
      </v-row>
    </v-container>

    <v-divider></v-divider>
    <v-row
      :justify="botoesVisiveis === 1 ? 'center' : 'space-between'"
      class="mt-2 px-3"
    >
      <v-btn
        v-if="caixa.STATUS !== 2"
        icon="mdi-lock"
        size="40"
        color="primary"
        class="ml-5 mx-1 btn-bordered"
        title="Fechar Caixa"
        @click="emits('fechar-caixa', caixa)"
      >
        <v-icon :style="{ fontSize: '25px' }" />
      </v-btn>

      <v-btn
        v-if="caixa.STATUS !== 2"
        icon="mdi-cash-multiple"
        size="40"
        color="primary"
        class="mx-1 btn-bordered"
        title="Sangria"
        @click="emits('salvar-sangria', caixa)"
      >
        <v-icon :style="{ fontSize: '25px' }" />
      </v-btn>

      <v-btn
        icon="mdi-checkbox-marked-outline"
        size="40"
        color="primary"
        title="Conferir Caixa"
        class="mr-5 mx-1 btn-bordered"
      >
        <v-icon :style="{ fontSize: '25px' }" />
      </v-btn>
    </v-row>
  </v-card>
</template>

<style scoped>
.caixa-aberto {
  border: 2px solid #1976d2;
  background: linear-gradient(90deg, rgb(19, 84, 122), rgb(80, 146, 138));
  color: white;
}

.caixa-fechado {
  border: 2px solid #424242;
  background: linear-gradient(-11deg, rgb(134, 143, 150), rgb(89, 97, 100)) !important;
  color: white;
}

.status-badge {
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
  text-align: center;
  width: 120px;
}

.caixa-aberto .status-badge {
  background-color: #1976d2;
}

.caixa-fechado .status-badge {
  background-color: #424242;
  color: white;
}

.btn-bordered {
  border: 1px solid rgba(255, 255, 255, 0.554) !important;
}

.v-col {
  padding-top: 0 !important;
}

.dinheiro-caixa {
  padding: 2px 6px;
  border-radius: 8px;
  font-weight: bold;
  display: inline-block;
}

.badge-dinheiro-caixa-red {
  background-color: #e53935;
  color: white;
}

.badge-dinheiro-caixa {
  background-color: inherit;
  color: white;
}
</style>
