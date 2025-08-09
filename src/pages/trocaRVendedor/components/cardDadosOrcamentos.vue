<script setup lang="ts">
import { de } from 'vuetify/lib/locale/index.mjs';
import { iOrcamento } from '../interfaces';
import { reactive, watch } from 'vue';
import { formatValor } from '@/ts/utils';

const state = reactive({
    orcamento: <iOrcamento>{},
    numOrcamento: '',
    vendedores: '',
    data: '',
    valor : '',
   

})
const props = defineProps({
  orcamento: {
    required: true,
    type: Object as () => iOrcamento,
  }
})
watch(() => props.orcamento, (value) => {
  state.orcamento = value
})


</script>

<template>
  <v-card
    class="card"
    max-width="450"
    border
    flat
  >
  <v-col><v-text class="titulo"> Dados do Orçamento</v-text> </v-col>
    <div class="textos d-flex">
      <v-col>
        <v-col><v-text> N° Orçamento: {{ state.orcamento.NUM_ORCAMENTO }}</v-text></v-col>
        <v-col><v-text> Valor Orçamento: {{ formatValor(state.orcamento.VALOR) }}</v-text></v-col>
      </v-col>
      <v-col>
        <v-col><v-text> Data:  {{ new Date(state.orcamento.DATA).toLocaleDateString('pt-BR') }}</v-text></v-col>
      </v-col>
    </div>
  </v-card>
</template>

<style scoped>
.card {
  border: 1px solid #bdbdbd;
}
.titulo {
  font-weight: bold;
  font-size: 15px;
}
.textos {
  font-size: 13px;
}
</style>
