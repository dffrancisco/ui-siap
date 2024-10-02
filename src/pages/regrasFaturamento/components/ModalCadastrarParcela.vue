<script lang="ts" setup>
import { onMounted, reactive } from "vue";
import { iRegraFaturamentoParcelas } from "../interfaces";
import utils from "@/ts/utils";
import Swal from "sweetalert2";

const props = defineProps({
  dbParcelaToEdit: {
    type: Object as () => iRegraFaturamentoParcelas,
    required: true,
    default: {},
  },
});

const emits = defineEmits(["closeModal", , "insertParcela", "updateParcela"]);

const state = reactive({
  dbParcela: <iRegraFaturamentoParcelas>{
    DIVISAO: 0,
    FATURAMENTO_ACIMA_DE_VALOR: 0,
    FATURAMENTO_ATE_VALOR: 0,
    ID_REGRA_FATURAMENTO_PARCELA: null,
  },
});

const actions = {
  closeModal() {
    emits("closeModal");
  },

  btnSave() {
    const faturamentoAcimaDeValor = utils.formatValorUSA(state.dbParcela.FATURAMENTO_ACIMA_DE_VALOR.toString());
    const faturamentoAteValor = utils.formatValorUSA(state.dbParcela.FATURAMENTO_ATE_VALOR.toString());

    if (faturamentoAcimaDeValor <= 0 || faturamentoAteValor <= 0 || state.dbParcela.DIVISAO <= 0) {
      Swal.fire({
        text: "Os valores devem ser diferentes de zero.",
        icon: "warning",
      });

      return;
    }

    if (state.dbParcela.ID_REGRA_FATURAMENTO_PARCELA) {
      let dbParcelaFormatada: iRegraFaturamentoParcelas = {
        ID_REGRA_FATURAMENTO_PARCELA: props.dbParcelaToEdit.ID_REGRA_FATURAMENTO_PARCELA,
        FATURAMENTO_ATE_VALOR: Number(faturamentoAteValor),
        FATURAMENTO_ACIMA_DE_VALOR: Number(faturamentoAcimaDeValor),
        DIVISAO: Number(state.dbParcela.DIVISAO),
      };

      if (JSON.stringify(dbParcelaFormatada) != JSON.stringify(props.dbParcelaToEdit)) {
        emits("updateParcela", state.dbParcela);
        return;
      }

      actions.closeModal();
    } else {
      emits("insertParcela", state.dbParcela);
    }
  },
};

onMounted(() => {
  if (props.dbParcelaToEdit.ID_REGRA_FATURAMENTO_PARCELA) {
    state.dbParcela = { ...props.dbParcelaToEdit };
  }
});
</script>

<template>
  <v-card class="pa-4">
    <v-card-title v-if="props.dbParcelaToEdit.ID_REGRA_FATURAMENTO_PARCELA">Editar Parcela</v-card-title>
    <v-card-title v-else="props.dbParcelaToEdit.ID_REGRA_FATURAMENTO_PARCELA">Nova Parcela</v-card-title>

    <div class="mt-4">
      <v-row>
        <v-col>
          <v-text-field
            v-model="state.dbParcela.FATURAMENTO_ATE_VALOR"
            label="Faturamento Até"
            v-mask-decimal.br="2"
            class="obr rounded"
            :clearable="false"
            maxlength="15"
            autofocus
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="state.dbParcela.FATURAMENTO_ACIMA_DE_VALOR"
            label="Faturamento Acima De"
            v-mask-decimal.br="2"
            class="obr rounded"
            :clearable="false"
            maxlength="15"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="state.dbParcela.DIVISAO"
            label="Divisão"
            v-mask="'##'"
            maxlength="2"
            class="obr rounded"
            :clearable="false"
          ></v-text-field>
        </v-col>
      </v-row>
    </div>

    <div class="d-flex ga-2 justify-end mt-4">
      <v-btn
        color="primary"
        variant="outlined"
        @click="actions.closeModal"
        >cancelar</v-btn
      >
      <v-btn
        color="primary"
        @click="actions.btnSave"
        >salvar</v-btn
      >
    </div>
  </v-card>
</template>
