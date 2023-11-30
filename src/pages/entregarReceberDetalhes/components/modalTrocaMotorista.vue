<script setup lang="ts">
import { computed, reactive } from "vue";
import { iMotorista } from "../interface";
import Swal from "sweetalert2";

const state = reactive({
  novoMotorista: <iMotorista>{
    COD_FUNCIONARIO: undefined,
    NOME_MOTORISTA: "",
    CPF: "",
  },
});

const props = defineProps({
  motoristaAtual: {
    type: Object as () => iMotorista,
    default: undefined,
  },
  motoristas: {
    type: Array as () => iMotorista[],
    default: () => [],
  },
});

const emit = defineEmits(["trocarMotorista"]);

const urlAvatarMotorista = computed(() => {
  if (!props.motoristaAtual.CPF) {
    return "";
  }

  const cpf = props.motoristaAtual.CPF.replaceAll(".", "").replaceAll("-", "");
  return `http://www.reallatas.com.br/foto_funcionarios/${cpf}.jpg`;
});

const urlAvatarNovoMotorista = computed(() => {
  if (!state.novoMotorista.CPF) {
    return "";
  }

  const cpf = state.novoMotorista.CPF.replaceAll(".", "").replaceAll("-", "");
  return `http://www.reallatas.com.br/foto_funcionarios/${cpf}.jpg`;
});

const onClickTrocarMotorista = () => {
  if (
    props.motoristaAtual.COD_FUNCIONARIO == state.novoMotorista.COD_FUNCIONARIO
  ) {
    Swal.fire({
      text: "O novo motorista não poder ser o mesmo do atual",
      icon: "warning",
    });

    return;
  }

  emit("trocarMotorista", state.novoMotorista);
};
</script>

<template>
  <div class="modal-troca-motorista">
    <v-row>
      <v-col cols="12">
        <div class="d-flex align-center">
          <v-avatar size="42px" color="grey" class="mr-2">
            <v-img :src="urlAvatarMotorista" aspect-ratio="1" cover />
          </v-avatar>
          <v-text-field
            hide-details
            disabled
            :value="motoristaAtual.NOME_MOTORISTA"
          ></v-text-field>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="d-flex justify-center">
        <v-icon>mdi mdi-swap-horizontal-bold</v-icon>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <div class="d-flex align-center">
          <v-avatar size="42px" color="grey" class="mr-2">
            <v-img :src="urlAvatarNovoMotorista" aspect-ratio="1" cover />
          </v-avatar>
          <v-autocomplete
            hide-details
            variant="outlined"
            density="compact"
            :items="motoristas"
            item-value="COD_FUNCIONARIO"
            item-title="NOME_MOTORISTA"
            v-model="state.novoMotorista"
            return-object
          ></v-autocomplete>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="d-flex justify-center">
        <v-btn color="primary" @click="onClickTrocarMotorista">
          Trocar motorista
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>
