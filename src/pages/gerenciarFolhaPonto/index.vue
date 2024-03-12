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
                <v-select
                  id="mes"
                  label="Mês"
                  v-model="state.mes"
                  item-title="title"
                  item-value="value"
                  :items="meses"
                  :clearable="false"
                ></v-select>
              </v-col>
              <v-col cols="3">
                <v-select
                  id="ano"
                  label="Ano"
                  v-model="state.ano"
                  :items="anos"
                  :clearable="false"
                ></v-select>
              </v-col>
              <v-col cols="2"
                ><v-btn
                  icon
                  color="primary"
                  size="x-small"
                  class="btnSearch"
                  title="Buscar funcionários"
                  @click="actions.getResumoPontosFuncionario(state.selectedFuncionario, state.mes, state.ano)"
                >
                  <v-icon> mdi-magnify</v-icon>
                </v-btn>
                <v-btn
                  icon
                  color="primary"
                  size="x-small"
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
            <div class="funcionarios__lista">
              <v-card class="funcionarios__lista__totalizador">
                <div>
                  <span
                    class="funcionarios__lista__card__totalizador"
                    style="color: #b17500"
                  >
                    Pontos não batidos:
                    <v-chip
                      variant="outlined"
                      color="#b17500"
                      class="ml-2"
                      title="PONTOS NÃO BATIDOS"
                      >{{ totalizador.QTD_PONTOS_NAO_BATIDOS }}</v-chip
                    >
                  </span>
                  <span
                    class="funcionarios__lista__card__totalizador px-10"
                    style="color: #b142f5"
                  >
                    Pontos incompletos:
                    <v-chip
                      variant="outlined"
                      color="#B142F5"
                      class="ml-2"
                      title="PONTOS INCOMPLETOS"
                      >{{ totalizador.QTD_PONTOS_INCOMPLETOS }}</v-chip
                    >
                  </span>
                  <span
                    class="funcionarios__lista__card__totalizador pr-10"
                    style="color: #d50000"
                  >
                    Pontos à justificar:
                    <v-chip
                      variant="outlined"
                      color="#D50000"
                      class="ml-2 chip_ponto_a_justificar"
                      title="PONTOS À JUSTIFICAR"
                      >{{ totalizador.QTD_A_JUSTIFICAR }}</v-chip
                    >
                  </span>
                  <span
                    class="funcionarios__lista__card__totalizador"
                    style="color: #4880ff"
                  >
                    Pontos justificados:
                    <v-chip
                      variant="outlined"
                      color="#4880FF"
                      title="PONTOS JUSTIFICADOS"
                      class="ml-2"
                      >{{ totalizador.QTD_FALTAS_JUSTIFICADAS }}</v-chip
                    >
                  </span>
                </div>
              </v-card>
              <v-card
                v-for="funcionario in funcionariosOrdenados"
                :key="funcionario.COD_FUNCIONARIO"
                :class="{ pendencia_card: funcionario.QTD_A_JUSTIFICAR > 0 }"
                class="funcionarios__lista__card"
                @click="actions.onClickFuncionario(funcionario.COD_FUNCIONARIO, state.mes, state.ano)"
              >
                <div class="funcionarios__lista__card__usuario">
                  <div class="funcionario_card_avatar">
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
                  </div>
                  <div>
                    <div class="funcionarios__lista__dados">
                      <p class="funcionarios__lista__card__nome">
                        {{ funcionario.NOME_COMP }}
                      </p>
                      <p class="funcionarios__lista__card__cargo">
                        {{ funcionario.CARGO }}
                      </p>

                      <div class="funcionarios__lista__card__chip">
                        <v-chip
                          variant="outlined"
                          color="#b17500"
                          title="PONTOS NÃO BATIDOS"
                          >{{ funcionario.QTD_PONTOS_NAO_BATIDOS }}</v-chip
                        >
                        <v-chip
                          variant="outlined"
                          color="#B142F5"
                          title="PONTOS INCOMPLETOS"
                          >{{ funcionario.QTD_PONTOS_INCOMPLETOS }}</v-chip
                        >
                        <v-chip
                          variant="outlined"
                          color="#D50000"
                          title="PONTOS À JUSTIFICAR"
                          >{{ funcionario.QTD_A_JUSTIFICAR }}</v-chip
                        >
                        <v-chip
                          variant="outlined"
                          color="#4880FF"
                          title="PONTOS JUSTIFICADOS"
                          >{{ funcionario.QTD_FALTAS_JUSTIFICADAS }}</v-chip
                        >
                      </div>
                    </div>
                  </div>
                </div>
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
      <modalImprimirFolhaPonto
        :dadosParaImpressao="{
          dadosFuncionarios: state.dadosParaModalImpressao,
          mes: state.mes,
          ano: state.ano,
        }"
        :empresa="state.empresa"
      />
    </div>

    <div id="pnCodigoTela">FOLHA_PONTO</div>
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
  }

  .funcionarios__lista__avatar {
    margin-left: 8px;
    cursor: pointer;
    opacity: 1;
    border: 1px solid #0000002f;
  }

  .funcionarios__lista__avatar--red {
    border: 2px solid red;
  }

  .funcionarios__lista__card__usuario {
    display: flex;
    flex-direction: row;
    gap: 12px;
    width: 330px;
    height: 90px;
  }

  .funcionarios__lista__card__cargo {
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #5a6069;
  }

  .funcionarios__lista__card__nome {
    font-size: 14px;
    font-weight: bold;
    width: 222px;
    color: #202224;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.funcionarios__lista__totalizador {
  height: 50px;
  width: 97%;
  flex-direction: row;
  display: flex;
  justify-content: center;
  align-items: center;
}

.funcionarios__lista__card__totalizador {
  font-size: 16px;
  font-weight: bold;
  color: #202224;
}

.funcionarios__lista__card__chip {
  display: flex;
  gap: 10px;
}

.funcionario_card_avatar {
  display: flex;
  align-items: center;
  justify-content: center;
}

.funcionarios__lista__dados {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  padding: 4px 8px 4px 8px;
}

.pendencia_card {
  background-color: #fbc8c868;
}

.chip_ponto_a_justificar {
  background-color: #ffcdd2;
}

.imgIconTodos {
  margin-left: 40px;
  width: 50px;
  height: 60px;
}

.btnSearch {
  margin-top: 5px;
}
</style>
