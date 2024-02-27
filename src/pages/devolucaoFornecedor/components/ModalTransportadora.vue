<script setup lang="ts">
import { watch, reactive } from "vue";
import { iTransportadora, iListaTransportadoras } from "../interfaces";
import serviceDevolucaoFornecedor from "../services/devolucaoFornecedor.service";
import Swal from "sweetalert2";

const props = defineProps<{
  modalOpened: boolean;
}>();

watch(
  () => props.modalOpened,
  () => {
    if (props.modalOpened) {
      state.dbTransportadora = {} as iTransportadora;
      actions.getTransportadoras();
    }
  }
);

const state = reactive({
  dbTransportadora: <iTransportadora>{},
  listaTransportadoras: <iListaTransportadoras[]>[],

  configVMoney: {
    thousands: ".",
    decimal: ",",
    precision: 2,
  },

  loading: false,
});

const actions = {
  async getTransportadoras() {
    try {
      state.loading = true;
      let data = await serviceDevolucaoFornecedor.getTransportadoras();
      state.listaTransportadoras = data;
      state.loading = false;
    } catch (error) {
      state.loading = false;
      Swal.fire({
        icon: "error",
        text: "Erro ao carregar as transportadoras!",
      });
    }
  },
};
</script>

<template>
  <v-container>
    <div id="pnCampos">
      <v-row>
        <v-col cols="12">
          <h2 class="font-weight-regular">Transportadora</h2>
          <div>
            <select
              v-model="state.dbTransportadora.RAZAO_SOCIAL"
              class="ss obr"
              name="RAZAO_SOCIAL"
              id="RAZAO_SOCIAL"
            >
              <option
                v-for="transportadora in state.listaTransportadoras"
                :value="transportadora.ID_TRANSPORTADORA"
              >
                {{ transportadora.RAZAO_SOCIAL }}</option
              >
            </select>
          </div>
        </v-col>
        <v-col cols="9">
          <h2 class="font-weight-regular">Modalidade Frete</h2>
          <div>
            <select
              class="obr ss"
              name="TIPO_FRETE"
              id="TIPO_FRETE"
              v-model="state.dbTransportadora.TIPO_FRETE"
            >
              <option value="0">Por conta do emitente</option>
              <option value="1">Por conta do destinatário/remetente</option>
              <option value="2">Por conta de terceiros</option>
              <option value="3">Transporte próprio por conta do remetente</option>
              <option value="4">Transporte próprio por conta do destinatário</option>
              <option value="9">Sem transporte</option>
            </select>
          </div>
        </v-col>
        <v-col>
          <h2 class="font-weight-regular">Valor</h2>
          <div>
            <input
              class="ss obr"
              type="text"
              name="VALOR_FRETE"
              id="VALOR_FRETE"
              v-model="state.dbTransportadora.VALOR_FRETE"
              v-money3="state.configVMoney"
            /> </div
        ></v-col>
      </v-row>
    </div>

    <div class="btns pt-4">
      <v-btn
        style="color: #3680ab; border: 1px solid #3680ab"
        @click=""
        >Cancelar</v-btn
      >
      <v-btn
        color="#3680AB"
        @click=""
        >Selecionar</v-btn
      >
    </div>
  </v-container>
</template>

<style scoped>
h2 {
  font-size: 16px;
  padding-bottom: 8px;
}

.btns {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  gap: 8px;
}
</style>
