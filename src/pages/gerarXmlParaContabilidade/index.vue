<script setup lang="ts">
import { onMounted } from "vue";
import { actions, state, meses } from "./gerarXmlParaContabilidade";

onMounted(async () => {
  actions.init();
});
</script>

<template>
  <v-container>
    <v-card
      :max-width="800"
      class="mx-auto pa-4"
    >
      <v-row
        class="mt-2"
        justify="center"
      >
        <v-col
          cols="12"
          md="10"
        >
          <v-select
            v-model="state.optionSelect"
            :items="[
              { text: 'Data Início - Data Fim', value: '0' },
              { text: 'Mês - Ano', value: '1' },
            ]"
            item-title="text"
            item-value="value"
            label="Gerar XML por:"
            :clearable="false"
            class="obr rounded-lg"
          />
        </v-col>
      </v-row>

      <v-row
        v-if="state.optionSelect === '0'"
        class="mt-4"
        justify="center"
      >
        <v-col
          cols="12"
          md="5"
        >
          <v-text-field
            v-model="state.dataInicio"
            label="Data Início"
            type="date"
            class="obr rounded-lg"
            :clearable="false"
          />
        </v-col>
        <v-col
          cols="12"
          md="5"
        >
          <v-text-field
            v-model="state.dataFim"
            label="Data Fim"
            type="date"
            class="obr rounded-lg"
            :clearable="false"
          />
        </v-col>
      </v-row>

      <v-row
        v-if="state.optionSelect === '1'"
        class="mt-4"
        justify="center"
      >
        <v-col
          cols="12"
          md="5"
        >
          <v-select
            label="Mês"
            v-model="state.mes"
            :items="meses"
            class="obr rounded-lg"
            item-title="title"
            item-value="value"
            :clearable="false"
          />
        </v-col>
        <v-col
          cols="12"
          md="5"
        >
          <v-text-field
            label="Ano"
            type="number"
            class="obr rounded-lg"
            v-model="state.ano"
            :clearable="false"
          />
        </v-col>
      </v-row>

      <v-row
        class="mt-4"
        justify="center"
      >
        <v-col
          cols="12"
          md="10"
          class="text-center"
        >
          <v-btn
            title="Gerar XML Para Contabilidade"
            id="btnGerarXML"
            color="primary"
          >
            Gerar XML Para Contabilidade
            <v-icon class="ml-2">mdi-content-save-all</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
    <div id="pnCodigoTela">gerarXmlParaContabilidade</div>
  </v-container>
</template>

<style scoped>
.v-btn {
  width: 100%;
  max-width: 280px;
}
</style>
