<script lang="ts" setup>
import utils from "@/ts/utils";
import { state } from "./valePecaAutorizacao";
import CardDataTables from "./components/CardDataTables.vue";
import CardInfo from "./components/CardInfo.vue";
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
                :src="utils.getFotoFuncionarioURL(state.teste.cpf)"
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
              <span><strong>Nome: </strong>{{ state.teste.nomeFuncionario || "-" }}</span>
              <span><strong>Cargo: </strong>{{ state.teste.cargo || "-" }}</span>
              <span><strong>Data Admissão: </strong>{{ state.teste.dataAdmissao || "-" }}</span>
            </div>
          </div>

          <div>
            <v-btn
              icon="mdi-magnify mdi-24px"
              color="primary"
              size="small"
            ></v-btn>
          </div>
        </div>

        <div class="mt-4">
          <v-row>
            <v-col
              cols="8"
              class="d-flex"
            >
              <CardDataTables />
            </v-col>

            <v-col class="d-flex">
              <CardInfo />
            </v-col>
          </v-row>
        </div>
      </v-card-item>
    </v-card>
    <div id="pnCodigoTela"> valePecaAutorizacao </div>
  </v-container>
</template>
