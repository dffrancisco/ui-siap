<script setup lang="ts">
import { computed, reactive, watch } from "vue";
import CardDadosOrcamentos from "./cardDadosOrcamentos.vue";
import { iVendedor } from "../interfaces";

const props = defineProps(["buscar", "orcamento", "avatar", "avatar2", "vendedores", "novoVendedor"]);
const emit = defineEmits(["update:buscar", "pesquisar", "trocar"]);

const state = reactive({
  buscar: "",
  orcamento: {
    NOME_COMP: "",
    NUM_ORCAMENTO: Number,
  },
  vendedores: [],
  novoVendedor: <iVendedor>{
    NOME_COMP: "",
  },
});

function pesquisar() {
  emit("pesquisar", state.buscar);
}

watch(
  () => props.buscar,
  (v) => (state.buscar = v)
);
watch(
  () => state.buscar,
  (v) => emit("update:buscar", v)
);
watch(
  () => props.orcamento,
  (v) => (state.orcamento = v)
);
watch(
  () => props.vendedores,
  (v) => (state.vendedores = v)
);
watch(
  () => props.novoVendedor,
  (v) => (state.novoVendedor = v)
);
const urlAvatarNovoMontador = computed(() => {
  if (!state.novoVendedor.CPF) {
    return "";
  }

  const cpf = state.novoVendedor.CPF.replaceAll(".", "").replaceAll("-", "");
  return `http://www.reallatas.com.br/foto_funcionarios/${cpf}.jpg`;
});

</script>

<template>
  <v-card class="cardePincipal pb-5 cmx-auto pa-3">
    <v-col
      cols="12"
      sm="6"
      md="5"
      class="d-flex mt-5"
    >
      <v-text-field
        class="px-2"
        label="N° Orçamento"
        variant="outlined"
        density="compact"
        :hide-details="true"
        v-model="state.buscar"
        @keypress.enter.stop="pesquisar"
      />

      <v-btn
        icon="mdi-magnify"
        color="primary"
        size="small"
        @click.prevent="pesquisar"
      ></v-btn>
    </v-col>
    <v-col
      cols="12"
      md="12"
      class="d-flex"
    >
      <v-col
        cols="12"
        md="6"
      >
        <CardDadosOrcamentos :orcamento="props.orcamento" />
      </v-col>
      <v-col cols="6">
        <v-row>
          <v-col cols="12">
            <div class="d-flex align-center">
              <v-avatar
                size="42px"
                color="grey"
                class="mr-2"
              >
                <v-img
                  :src="props.avatar"
                  aspect-ratio="1"
                  cover
                />
              </v-avatar>
              <v-text-field
                hide-details
                disabled
                :value="state.orcamento.NOME_COMP"
              ></v-text-field>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="12"
            class="d-flex justify-center"
          >
            <v-icon>mdi mdi-swap-horizontal-bold</v-icon>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <div class="d-flex align-center">
              <v-avatar
                size="42px"
                color="grey"
                class="mr-2"
              >
                <v-img
                  :src="urlAvatarNovoMontador"
                  aspect-ratio="1"
                  cover
                />
              </v-avatar>

              <v-select
                hide-details
                variant="outlined"
                density="compact"
                :items="state.vendedores"
                item-value="COD_FUNCIONARIO"
                item-title="NOME_COMP"
                v-model="state.novoVendedor"
                return-object
                :disabled="!state.orcamento.NUM_ORCAMENTO"
              ></v-select>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-col>
    <v-col class="d-flex justify-end pr-10">
      <v-row>
        <v-col
          cols="12"
          class="d-flex justify-end"
        >
          <v-btn
            @click="emit('trocar', state.novoVendedor)"
            color="primary"
            :disabled="!state.orcamento.NUM_ORCAMENTO"
          >
            Trocar
          </v-btn>
        </v-col>
        {{ state.novoVendedor.COD_FUNCIONARIO }}
      </v-row>
    </v-col>
  </v-card>
</template>

<style scoped>
.cardPrincipal {
  margin: auto;
}
.imagem {
  font-size: 18px;
}
.avatar-img {
  width: 100%;
  height: 100%;
  font-size: 18px;
}
.nome {
  font-size: 15px;
}
.avatar-img2 {
  width: 100%;
  height: 100%;
  font-size: 18px;
}
.imagem2 {
  font-size: 18px;
}
</style>
