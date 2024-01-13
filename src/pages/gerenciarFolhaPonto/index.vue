<script setup lang="ts">
import { onMounted, ref } from "vue";
import { actions, state } from "./gerenciarFolhaPonto";

const selectedFuncionario = ref<string | null>(null);

const meses = [
  { text: "Janeiro", value: 1 },
  { text: "Fevereiro", value: 2 },
  { text: "Março", value: 3 },
  { text: "Abril", value: 4 },
  { text: "Maio", value: 5 },
  { text: "Junho", value: 6 },
  { text: "Julho", value: 7 },
  { text: "Agosto", value: 8 },
  { text: "Setembro", value: 9 },
  { text: "Outubro", value: 10 },
  { text: "Novembro", value: 11 },
  { text: "Dezembro", value: 12 },
];

const anos: number[] = [];

const mesSelect = ref(new Date().getMonth() + 1);
const anoSelect = ref(new Date().getFullYear());

for (let i = 0; i < 20; i++) {
  const anoAtual = 2024 - 10 + i;
  anos.push(anoAtual);
}

onMounted(async () => {
  actions.getFuncionarios(mesSelect.value, anoSelect.value);
});
</script>

<template>
  <v-container>
    <title>Gerenciar Folha de Ponto</title>
    <div class="pa-5" style="max-width: 1100px; margin: 0 auto">
      <v-row>
        <v-col cols="12">
          <div>
            <strong>Gerenciar Folha de Ponto</strong>
            <v-card class="pa-5 cardFolhaPonto">
              <v-row>
                <v-col cols="5">
                  <v-autocomplete
                    label="Funcionário"
                    v-model="selectedFuncionario"
                    :items="
                      state.funcionarios.map(
                        (funcionario) => funcionario.NOME_COMP
                      )
                    "
                  ></v-autocomplete>
                </v-col>
                <v-col cols="2">
                  <v-autocomplete
                    label="Mês"
                    id="mes"
                    v-model="mesSelect"
                    item-title="text"
                    item-value="value"
                    :items="meses"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="3">
                  <v-autocomplete
                    label="Ano"
                    id="ano"
                    v-model="anoSelect"
                    :items="anos"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="2"
                  ><v-btn icon color="primary" size="small">
                    <v-icon> mdi-magnify</v-icon>
                  </v-btn></v-col
                >
              </v-row>
            </v-card>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="pt-0">
          <div class="funcionarios">
            <strong>FUNCIONÁRIOS</strong>

            <div class="funcionarios__lista">
              <v-card
                v-for="funcionario in state.funcionarios"
                class="funcionarios__lista__card"
              >
                <div class="funcionarios__lista__card__contador">
                  <v-avatar
                    size="60px"
                    color="primary"
                    :title="funcionario.LOGIN"
                    class="funcionarios__lista__avatar"
                  >
                    <v-img
                      :src="actions.getFotoFuncionarioURL(funcionario.CPF)"
                      aspect-ratio="1"
                      cover
                    ></v-img>
                  </v-avatar>
                </div>

                <strong class="funcionarios__lista__card__nome">
                  {{ funcionario.NOME_COMP }}
                </strong>
                <span class="funcionarios__lista__card__info">
                  {{ funcionario.CARGO }}
                </span>
                <span class="funcionarios__lista__card__faltas">
                  Pontos não batidos:
                </span>
                <span class="funcionarios__lista__card__faltas">
                  Pontos incompletos:
                </span>
                <span class="funcionarios__lista__card__faltas">
                  Quantidade de justificativas:
                </span>
              </v-card>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>
    <div id="pnCodigoTela">folhaPonto</div>
    <v-overlay
      :model-value="state.loading"
      class="align-center justify-center"
      persistent
    >
      <v-progress-circular
        color="primary"
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<style scoped>
.funcionarios {
  .funcionarios__lista {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    max-height: 650px;
    overflow-y: scroll;
    margin-top: 8px;
  }

  .funcionarios__lista__avatar {
    cursor: pointer;
    opacity: 1;
    border: 1px solid #0000002f;
  }

  .funcionarios__lista__card {
    width: 330px;
    height: 190px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 12px;
    cursor: pointer;
    position: relative;

    .funcionarios__lista__card__contador {
      position: absolute;
      top: 20px;
      left: 25px;
    }

    .funcionarios__lista__card__info {
      margin-left: 90px;
      margin-bottom: 40px;
      font-size: 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #5a6069;
    }

    .funcionarios__lista__card__nome {
      margin-left: 90px;
      font-size: 12px;
      color: #2a2a2a;
      display: flex;
      align-items: left;
      justify-content: left;
    }

    .funcionarios__lista__card__faltas {
      margin-left: 15px;
      font-size: 13px;
      font-style: bold;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #5a6069;
    }
  }
}
</style>
