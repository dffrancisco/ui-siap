<script setup lang="ts">
import { defineProps, reactive, watch } from "vue";
import { iMesEAno, iPropsAtribuirMetaIndividual } from "../interfaces";
import { configVMoney } from "../../../constants/constants";

const props = defineProps({
  dadosParaAtribuirMetaIndividual: {
    type: Object as () => iPropsAtribuirMetaIndividual,
  },
  mesEAno: {
    type: Object as () => iMesEAno,
  },
  opened: {
    type: Boolean,
  },
});

const state = reactive({
  vendedor: props.dadosParaAtribuirMetaIndividual.vendedor,
  montador: props.dadosParaAtribuirMetaIndividual.montador,
  loading: false,
  inputValor: "",
  mes: props.mesEAno.mes,
  ano: props.mesEAno.ano,
});

function getFotoFuncionarioURL(cpf: string) {
  if (!cpf) {
    return "";
  }
  const cpfSanitizado = cpf.replaceAll(".", "").replaceAll("-", "");
  return `https://www.reallatas.com.br/_serverAPP/thumb.php?img=http://www.reallatas.com.br/foto_funcionarios/${cpfSanitizado}.jpg`;
}

watch(
  () => props.opened,

  () => {
    if (props.opened) {
      state.loading = true;
      state.vendedor = props.dadosParaAtribuirMetaIndividual.vendedor;
      state.montador = props.dadosParaAtribuirMetaIndividual.montador;
      state.mes = props.mesEAno.mes;
      state.ano = props.mesEAno.ano;
      state.loading = false;
    }
  }
);
</script>

<template>
  <div>
    <v-avatar
      size="100px"
      color="primary"
      class="funcionarios__foto"
    >
      <v-img
        :src="
          getFotoFuncionarioURL(state.vendedor ? state.vendedor.CPF : state.montador ? state.montador.CPF : '')
        "
        aspect-ratio="2"
        cover
      ></v-img>
    </v-avatar>

    <div class="funcionarios__nome">{{
      state.vendedor ? state.vendedor.LOGIN : state.montador ? state.montador.LOGIN : ""
    }}</div>
    <div class="funcionarios__valorDaMeta ml-8">Valor da Meta:</div>
  </div>

  <div class="funcionarios__input">
    <input
      :clearable="false"
      v-model.lazy="state.inputValor"
      :model-modifiers="{ number: true }"
      v-money3="configVMoney"
    />
  </div>

  <v-btn
    title="Cancelar"
    class="funcionarios__btn_meta ml-7 mt-3"
    color="outline"
    >Cancelar
  </v-btn>
  <v-btn
    title="Adicionar meta"
    class="funcionarios__btn_meta ml-3 mt-3"
    color="primary"
    >Salvar
  </v-btn>

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
.funcionarios__foto {
  cursor: pointer;
  margin-left: 100px;
  margin-top: 5px;
  opacity: 1;
  border: 1px solid #0000002f;
  flex-shrink: 0;
}

.funcionarios__nome {
  font-size: 18px;
  color: #252525;
  text-align: center;
  padding-top: 15px;
  font-weight: 530;
}

.funcionarios__valorDaMeta {
  padding-top: 15px;
}

.funcionarios__btn_meta {
  border-radius: 10px;
}

.funcionarios__input input {
  border: 1px solid rgba(0, 0, 0, 0.42);
  border-radius: 4px;
  padding: 6px 10px;
  margin-top: 5px;
  margin-left: 25px;
  font-size: 16px;
  width: 225px;
  transition: border-color 0.3s;
}

.funcionarios__input input:focus {
  outline: none;
  border-color: #1976d2; /* cor de foco padrão do Vuetify */
  box-shadow: 0 0 0 1px #1976d2; /* sombra de foco padrão do Vuetify */
}

.funcionarios__input input::placeholder {
  color: rgba(0, 0, 0, 0.42); /* cor do placeholder padrão do Vuetify */
}
</style>
