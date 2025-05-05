<script lang="ts" setup>
import utils from "@/ts/utils";
import { actions, state } from "./valePecaAutorizacao";
import CardDataTables from "./components/CardDataTables.vue";
import CardInfo from "./components/CardInfo.vue";
import ModalSelecionarFuncionario from "./components/ModalSelecionarFuncionario.vue";
import Loading from "@/components/Loading.vue";
import { onMounted } from "vue";

onMounted(async () => {
  await actions.getFuncionarios();
});
</script>

<template>
  <v-container>
    <v-card
      class="ma-auto"
      max-width="900"
      max-height="550"
    >
      <v-card-item>
        <div class="d-flex justify-space-between">
          <div class="d-flex ga-4 align-center">
            <v-avatar
              size="60"
              class="border-md"
            >
              <v-img
                cover
                :src="utils.getFotoFuncionarioURL(state.funcionario?.CPF || 'error')"
                ><template v-slot:error>
                  <v-icon
                    size="50"
                    class="mt-1"
                    >mdi-account</v-icon
                  >
                </template></v-img
              >
            </v-avatar>
            <div class="d-flex flex-column text-body-1">
              <span><strong>Nome: </strong>{{ state.funcionario?.NOME_COMP || "-" }}</span>
              <span><strong>Cargo: </strong>{{ state.funcionario?.CARGO || "-" }}</span>
              <span
                ><strong>Data Admissão: </strong
                >{{ utils.dataBrasil(state.funcionario?.DATA_ADMISSAO) || "-" }}</span
              >
            </div>
          </div>

          <div>
            <v-btn
              icon="mdi-magnify mdi-24px"
              color="primary"
              size="small"
              @click="state.modalSelecionarFuncionarioOpened = true"
            ></v-btn>
          </div>
        </div>

        <div class="mt-4">
          <v-row>
            <v-col
              cols="8"
              class="d-flex"
            >
              <CardDataTables
                :items-orc="state.orcamento?.ITENS"
                :vales-funcionario="state.valesFuncionario"
              />
            </v-col>

            <v-col class="d-flex">
              <CardInfo
                @liberar-vale="actions.limparStates"
                @pesquisar-orc="actions.getOrcamento"
                :orcamento="state.orcamento"
                :vales-funcionario="state.valesFuncionario"
                :cod-funcionario="state.funcionario?.COD_FUNCIONARIO"
              />
            </v-col>
          </v-row>
        </div>
      </v-card-item>
    </v-card>

    <v-dialog
      max-width="500"
      v-model="state.modalSelecionarFuncionarioOpened"
      :retain-focus="false"
    >
      <ModalSelecionarFuncionario
        @close="state.modalSelecionarFuncionarioOpened = false"
        @selecionar-funcionario="actions.selecionarFuncionario"
        :funcionarios="state.listaFuncionarios"
      />
    </v-dialog>

    <Loading :loading="state.loading" />

    <div id="pnCodigoTela"> valePecaAutorizacao </div>
  </v-container>
</template>
