<script setup lang="ts">
import { watch, reactive } from "vue";
import { iTransportadora, iListaTransportadoras } from "../interfaces";
import serviceDevolucaoFornecedor from "../services/devolucaoFornecedor.service";
import Swal from "sweetalert2";

const props = defineProps<{
  modalOpened: boolean;
  id_devolucaoFornecedorTransp: number | undefined;
}>();

const emits = defineEmits(["closeModalTransportadoras"]);

watch(
  () => props.modalOpened,
  () => {
    if (props.modalOpened) {
      state.dbTransportadora = {} as iTransportadora;
      state.dbTransportadora.VALOR_FRETE = state.dbTransportadora.VALOR_FRETE * 100;
      actions.getTransportadoras();
      actions.getTransportadoraDevolucao();
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
    focusOnRight: true,
    disableNegative: true,
  },

  loading: false,
});

const actions = {
  async getTransportadoras() {
    try {
      let data = await serviceDevolucaoFornecedor.getTransportadoras();
      state.listaTransportadoras = data;
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Erro ao carregar as transportadoras!",
      });
    }
  },

  async getTransportadoraDevolucao() {
    try {
      state.loading = true;
      let data = await serviceDevolucaoFornecedor.getTransportadoraDevolucao(props.id_devolucaoFornecedorTransp);
      state.dbTransportadora = data;
      state.dbTransportadora.VALOR_FRETE *= 100;
      state.loading = false;
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Erro ao carregar a transportadora da devolução!",
      });
    }
  },

  closeModalTransportadoras() {
    emits("closeModalTransportadoras");
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
              v-model="state.dbTransportadora.ID_TRANSPORTADORA"
              class="ss obr"
              name="ID_TRANSPORTADORA"
              id="ID_TRANSPORTADORA"
            >
              <option
                v-for="transportadora in state.listaTransportadoras"
                :value="transportadora.ID_TRANSPORTADORA"
              >
                {{ transportadora.NOME_TRANSPORTADORA }}</option
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
              v-model.lazy="state.dbTransportadora.VALOR_FRETE"
              v-money3="state.configVMoney"
            /> </div
        ></v-col>
      </v-row>
    </div>

    <div class="btns pt-4">
      <v-btn
        style="color: #3680ab; border: 1px solid #3680ab"
        @click="actions.closeModalTransportadoras"
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
