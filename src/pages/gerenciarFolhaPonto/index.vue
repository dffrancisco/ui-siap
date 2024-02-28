<script setup lang="ts">
import { onMounted } from "vue";
import { actions, state, funcionariosOrdenados, meses, anos, totalizador } from "./gerenciarFolhaPonto";
import modalImprimirFolhaPonto from "@/components/modalImprimirFolhaPonto.vue";

onMounted(async () => {
  actions.init(state.selectedFuncionario, state.mes, state.ano);
});
</script>

<template>
  <v-container>
    <title>Gerenciar Folha de Ponto</title>
    <div
      class="pa-5"
      style="max-width: 1100px; margin: 0 auto"
    >
      <v-row>
        <v-col cols="12">
          <v-card class="pa-5 cardFolhaPonto">
            <v-row>
              <v-col cols="5">
                <v-autocomplete
                  :clearable="true"
                  label="Funcionário"
                  v-model="state.selectedFuncionario"
                  :items="funcionariosOrdenados"
                  item-title="NOME_COMP"
                  item-value="COD_FUNCIONARIO"
                  @update:model-value="actions.onFuncionarioChange"
                ></v-autocomplete>
              </v-col>
              <v-col cols="2">
                <v-autocomplete
                  id="mes"
                  label="Mês"
                  v-model="state.mes"
                  item-title="title"
                  item-value="value"
                  :items="meses"
                ></v-autocomplete>
              </v-col>
              <v-col cols="3">
                <v-autocomplete
                  id="ano"
                  label="Ano"
                  v-model="state.ano"
                  :items="anos"
                ></v-autocomplete>
              </v-col>
              <v-col cols="2"
                ><v-btn
                  icon
                  color="primary"
                  size="small"
                  class="btnSearch"
                  title="Buscar funcionários"
                  @click="actions.getResumoPontosFuncionario(state.selectedFuncionario, state.mes, state.ano)"
                >
                  <v-icon> mdi-magnify</v-icon>
                </v-btn>
                <v-btn
                  icon
                  color="primary"
                  size="small"
                  class="btnPrint"
                  title="Imprimir folha de ponto de todos os funcionários"
                  @click.prevent="actions.imprimirFolhaPontoTodosFuncionarios()"
                >
                  <v-icon>mdi-printer</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="12"
          class="pt-0"
        >
          <div class="funcionarios">
            <strong>FUNCIONÁRIOS</strong>

            <div class="funcionarios__lista">
              <v-card
                variant="outlined"
                class="funcionarios__lista__totalizador"
              >
                <v-img
                  src="./src/assets/pessoas.svg"
                  class="imgIconTodos"
                  width="50px"
                ></v-img>

                <span class="funcionarios__lista__card__totalizador">
                  <u>TOTALIZADOR</u>
                </span>
                <span class="funcionarios__lista__card__totalizador">
                  Pontos não batidos:
                  <b>{{ totalizador.QTD_PONTOS_NAO_BATIDOS }}</b>
                </span>
                <span class="funcionarios__lista__card__totalizador">
                  Pontos incompletos:
                  <b>{{ totalizador.QTD_PONTOS_INCOMPLETOS }}</b>
                </span>
                <span class="funcionarios__lista__card__totalizador">
                  Quantidade de justificativas:
                  <b>{{ totalizador.QTD_FALTAS_JUSTIFICADAS }}</b>
                </span>
                <span
                  class="funcionarios__lista__card__totalizador"
                  :class="{
                    'com-pendencia': totalizador.QTD_A_JUSTIFICAR > 0,
                  }"
                >
                  Pontos à justificar:
                  <b>{{ totalizador.QTD_A_JUSTIFICAR }}</b>
                </span>
              </v-card>
              <v-card
                v-for="funcionario in funcionariosOrdenados"
                :key="funcionario.COD_FUNCIONARIO"
                :class="{ pendencia: funcionario.QTD_A_JUSTIFICAR > 0 }"
                class="funcionarios__lista__card"
                @click="actions.onClickFuncionario(funcionario.COD_FUNCIONARIO, state.mes, state.ano)"
              >
                <div class="funcionarios__lista__card__usuario">
                  <v-avatar
                    size="60px"
                    color="primary"
                    :title="funcionario.LOGIN"
                    :class="{
                      'funcionarios__lista__avatar--red': funcionario.QTD_A_JUSTIFICAR > 0,
                    }"
                    class="funcionarios__lista__avatar"
                  >
                    <v-img
                      :src="actions.getFotoFuncionarioURL(funcionario.CPF)"
                      aspect-ratio="1"
                      cover
                    ></v-img>
                  </v-avatar>
                  <div>
                    <strong class="funcionarios__lista__card__nome">
                      {{ funcionario.NOME_COMP }}
                    </strong>
                    <span class="funcionarios__lista__card__cargo">
                      {{ funcionario.CARGO }}
                    </span>
                  </div>
                </div>

                <span class="funcionarios__lista__card__faltas">
                  Pontos não batidos:
                  <b>{{ funcionario.QTD_PONTOS_NAO_BATIDOS }}</b>
                </span>
                <span class="funcionarios__lista__card__faltas">
                  Pontos incompletos:
                  <b>{{ funcionario.QTD_PONTOS_INCOMPLETOS }}</b>
                </span>
                <span class="funcionarios__lista__card__faltas">
                  Qtd de justificativas:
                  <b>{{ funcionario.QTD_FALTAS_JUSTIFICADAS }}</b>
                </span>
                <span
                  class="funcionarios__lista__card__faltas"
                  :class="{
                    'funcionario-com-pendencia': funcionario.QTD_A_JUSTIFICAR > 0,
                  }"
                >
                  Pontos à justificar:
                  <b>{{ funcionario.QTD_A_JUSTIFICAR }}</b>
                </span>
              </v-card>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>

    <div
      id="modalImprimirPontos"
      title="Folha de Ponto"
      style="display: none"
    >
      <modal-imprimir-folha-ponto
        :dadosParaImpressao="{
          dadosFuncionarios: state.dadosParaModalImpressao,
          mes: state.mes,
          ano: state.ano,
        }"
      />
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
.btnPrint {
  margin-top: 5px;
  margin-left: 20px;
}
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
    margin-left: 5px;
    cursor: pointer;
    opacity: 1;
    border: 1px solid #0000002f;
  }

  .funcionarios__lista__avatar--red {
    border: 2px solid red;
  }

  .funcionarios__lista__totalizador,
  .funcionarios__lista__card {
    width: 330px;
    height: 190px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 12px;
    cursor: pointer;
    position: relative;
  }

  .funcionarios__lista__card__usuario {
    padding-left: 12px;
    display: flex;
    gap: 12px;
    margin-bottom: 10px;
  }

  .funcionarios__lista__card__cargo {
    margin-bottom: 30px;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #5a6069;
  }

  .funcionarios__lista__card__nome {
    font-size: 15px;
    color: #2a2a2a;
    display: flex;
    align-items: left;
    justify-content: left;
  }

  .funcionarios__lista__card__faltas {
    margin-left: 20px;
    font-size: 15px;
    font-style: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #5a6069;
  }

  .funcionarios__lista__card__faltas.funcionario-com-pendencia {
    color: red;
  }

  .funcionarios__lista__avatar.funcionario-com-pendencia {
    border: 2px solid red;
  }
}

.funcionarios__lista__card__totalizador {
  margin-left: 40px;
  font-size: 15px;
  font-style: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #5a6069;
}

.funcionarios__lista__card__totalizador.com-pendencia {
  color: red;
}

.pendencia {
  background-color: #fbc8c868;
  border: 1px solid rgb(254, 91, 91);
}

.imgIconTodos {
  margin-left: 40px;
}

.btnSearch {
  margin-top: 5px;
}
</style>
