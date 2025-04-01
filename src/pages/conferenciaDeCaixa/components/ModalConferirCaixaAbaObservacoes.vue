<script setup lang="ts">
import { computeds, actions, state } from "../conferenciaDeCaixa";
import utils from "@/ts/utils";
import ModalIncluirObs from "./ModalIncluirObs.vue";
import { reactive } from "vue";

const stateObs = reactive({
  modalIncluirObsOpened: false,
});

const actionsObs = {
  salvarObs: (obs: string) => {
    actions.salvarObs(obs);
    stateObs.modalIncluirObsOpened = false;
  },
};
</script>

<template>
  <!-- <v-card
    class="pa-3"
    height="400px"
    v-if="computeds.observacoesPorCaixa.value.length === 0"
  >
    <v-alert
      type="warning"
      color="primary"
      prominent
      class="mb-4"
    >
      Não há observações cadastradas para o caixa selecionado!
    </v-alert>
  </v-card> -->

  <v-card
    class="pa-3"
    height="410px"
  >
    <v-row class="h-100">
      <v-col
        cols="2"
        class="d-flex mt-2"
      >
        <v-btn
          color="primary"
          variant="flat"
          rounded="lg"
          class="w-100"
          height="30px"
          title="Adicionar Observação"
          @click="stateObs.modalIncluirObsOpened = true"
        >
          Incluir
        </v-btn>
      </v-col>

      <v-col
        cols="10"
        class="overflow-auto mt-2"
        style="max-height: 370px"
      >
        <v-row>
          <v-col
            v-for="(observacao, index) in computeds.observacoesPorCaixa.value"
            :key="index"
            cols="12"
          >
            <v-card
              class="pa-3 d-flex align-center"
              elevation="2"
              rounded="lg"
            >
              <v-col cols="1">
                <v-avatar size="35px">
                  <v-img
                    :src="actions.getFotoFuncionarioURL(state.caixaSelected.CPF)"
                    cover
                    :title="state.caixaSelected.LOGIN"
                  ></v-img>
                </v-avatar>
              </v-col>

              <v-col cols="8">
                <div class="font-weight-bold">
                  {{ observacao }}
                </div>
              </v-col>

              <v-col cols="3">
                <div class="text-right text-caption font-weight-bold">
                  {{ utils.dataBrasil(state.caixaSelected.DATA_ABERTURA) }}
                </div>
              </v-col>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-dialog
      v-model="stateObs.modalIncluirObsOpened"
      max-width="800"
    >
      <ModalIncluirObs
        :modalOpened="stateObs.modalIncluirObsOpened"
        @closeModalIncluirObs="stateObs.modalIncluirObsOpened = false"
        @adicionarObs="actionsObs.salvarObs"
      />
    </v-dialog>
  </v-card>
</template>
