<script setup lang="ts">
import { defineProps, reactive, watch } from "vue";
import { iResponseMetasVendedoresEMontadores } from "../interfaces";
import { configVMoney } from "../../../constants/constants";

const props = defineProps({
  funcionario: {
    type: Object as () => iResponseMetasVendedoresEMontadores,
  },
  mes: {
    type: Number,
  },
  ano: {
    type: Number,
  },
  opened: {
    type: Boolean,
  },
});

const emit = defineEmits(["dadosInserirMeta", "fecharModalAtribuirMetaIndividual"]);

const state = reactive({
  funcionario: <iResponseMetasVendedoresEMontadores>{},
  loading: false,
  inputValor: "",
  mes: props.mes,
  ano: props.ano,
  inputMeta: <HTMLInputElement>{},
});

function getFotoFuncionarioURL(cpf: string) {
  if (!cpf) {
    return "";
  }
  const cpfSanitizado = cpf.replaceAll(".", "").replaceAll("-", "");
  return `https://www.reallatas.com.br/_serverAPP/thumb.php?img=http://www.reallatas.com.br/foto_funcionarios/${cpfSanitizado}.jpg`;
}

const cancelar = () => {
  emit("fecharModalAtribuirMetaIndividual");
  state.inputValor = "";
};

const salvarMeta = async () => {
  state.loading = true;
  let dadosParaInserirMeta = {
    funcionario: state.funcionario,
    valorMeta: state.inputValor,
  };

  emit("dadosInserirMeta", dadosParaInserirMeta);
  emit("fecharModalAtribuirMetaIndividual");
  state.loading = false;

  state.inputValor = "";
};

watch(
  () => props.opened,

  () => {
    if (props.opened) {
      state.loading = true;
      state.funcionario = props.funcionario;
      state.mes = props.mes;
      state.ano = props.ano;

      state.inputMeta = <any>document.getElementById("inputMeta").focus();

      state.loading = false;
    }
  }
);
</script>

<template>
  <div class="modal-atribuir-meta-individual">
    <v-avatar
      size="100px"
      color="primary"
      class="funcionarios__foto"
    >
      <v-img
        :src="getFotoFuncionarioURL(state.funcionario?.CPF)"
        aspect-ratio="2"
        cover
      ></v-img>
    </v-avatar>

    <div class="funcionarios__nome">{{ state.funcionario?.LOGIN }}</div>
    <div class="funcionarios__valorDaMeta ml-8">Valor da Meta:</div>
  </div>

  <div class="funcionarios__input">
    <input
      id="inputMeta"
      :clearable="false"
      v-model.lazy="state.inputValor"
      :model-modifiers="{ number: true }"
      v-money3="configVMoney"
      autofocus
    />
  </div>

  <v-btn
    title="Cancelar"
    class="funcionarios__btn_meta ml-7 mt-3"
    color="outline"
    @click="cancelar()"
    >Cancelar
  </v-btn>
  <v-btn
    title="Adicionar meta"
    class="funcionarios__btn_meta ml-3 mt-3"
    color="primary"
    @click="salvarMeta()"
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
