<script setup lang="ts">
import { reactive, watch } from "vue";
import CardDadosOrcamentos from "./cardDadosOrcamentos.vue";

const props = defineProps(['buscar'])
const emit = defineEmits(['update:buscar', 'pesquisar'])

const state = reactive({
  buscar: '',
})

function pesquisar(){
  emit('pesquisar', state.buscar)
}

watch(() => props.buscar, (value) => {
  state.buscar = value
})

watch(() => state.buscar, value => {
  emit('update:buscar', value)
})
</script>

<template>
  <v-card class="cardePincipal pb-5">
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
        <CardDadosOrcamentos />
      </v-col>
      <v-col>
        <v-col>
          <div class="d-flex justify-center align-center ">
            <div class="mr-2">
              <v-avatar class="">
                <img
                  class="avatar-img"
                  :src="`https://www.reallatas.com.br/foto_funcionarios/${'06753446117'}.jpg`"
                  alt="Avatar"
                />
              </v-avatar>
            </div>
            <VTextField :model-value="'Nome da pessoa'" />
          </div>
        </v-col>
        <v-col><span class="imagem mdi mdi-swap-horizontal-bold d-flex justify-center align-center"></span></v-col>

        <v-col>
          <div class="d-flex justify-center align-center ph-5">
            <div class="mr-2">
              <v-avatar class="">
                <img
                  class="avatar-img"
                  :src="`https://www.reallatas.com.br/foto_funcionarios/${'06753446117'}.jpg`"
                  alt="Avatar"
                />
              </v-avatar>
            </div>
            <v-select
              item-title="label"
              item-value="value"
              label="Selecioner caixa"
              density="compact"
              variant="outlined"
              :hide-details="true"
            />
          </div>
        </v-col>
      </v-col>
    </v-col>
    <v-col class="d-flex justify-end pr-10">
    <v-btn 
     
      color="primary"
      text="Salvar"
      variant="flat"
      @click=""
    ></v-btn>
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
}
.nome {
  font-size: 15px;
}
</style>
