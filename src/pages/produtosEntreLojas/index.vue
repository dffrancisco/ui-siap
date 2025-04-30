<script lang="ts" setup>
import { onMounted } from "vue";
import { mesesToSelect } from "../../constants/constants";
import { actions, state } from "./produtosEntreLojas";

onMounted(async () => {
  await actions.init();
});
</script>

<template>
  <v-container>
    <v-card max-width="900">
      <div class="pa-4">
        <div class="d-flex align-center ga-8">
          <v-row>
            <v-col cols="7">
              <v-autocomplete
                v-model="state.filterSearch.loja"
                label="Loja"
                :clearable="false"
                :items="state.lojas"
                item-title="NOME"
                item-value="ID_SOCIEDADE"
              ></v-autocomplete>
            </v-col>
            <v-col>
              <v-autocomplete
                v-model="state.filterSearch.mes"
                label="Mês"
                item-value="value"
                item-title="title"
                :clearable="false"
                :items="mesesToSelect"
              ></v-autocomplete>
            </v-col>
            <v-col cols="2">
              <v-text-field
                v-model="state.filterSearch.ano"
                :clearable="false"
                maxlength="4"
                v-mask="'####'"
                label="Ano"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-btn
            size="small"
            color="primary"
            icon="mdi-magnify mdi-24px"
          ></v-btn>
        </div>

        <div
          style="border: 1px solid black; height: 450px"
          class="mt-4"
        >
        </div>
      </div>
    </v-card>

    <div id="pnCodigoTela">produtosEntreLojas</div>
  </v-container>
</template>
