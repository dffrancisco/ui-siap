<script setup lang="ts">
import { useRoute } from "vue-router";
import { actions, state, pontosCalendario, onDataClicada, statusPontos } from "./gerenciarFolhaPontoDetalhes";
import { meses, anos } from "../gerenciarFolhaPonto/gerenciarFolhaPonto";

const route = useRoute();

actions.init(route);
</script>

<template>
  <v-container>
    <title>Detalhes dos pontos</title>
    <div
      class="pa-5"
      style="max-width: 1100px; margin: 0 auto"
    >
      <v-row>
        <v-col cols="12">
          <div>
            <strong>Detalhes dos pontos</strong>
            <v-card class="pa-5 cardFolhaPontoDetalhes">
              <v-row>
                <v-col cols="5">
                  <v-autocomplete
                    label="Mês"
                    id="mes"
                    v-model="state.mes"
                    item-title="text"
                    item-value="value"
                    :items="meses"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="5">
                  <v-autocomplete
                    label="Ano"
                    id="ano"
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
                    @click="actions.getPontos(state.codFuncionario, state.mes, state.ano)"
                  >
                    <v-icon> mdi-magnify</v-icon> </v-btn
                  ><v-btn
                    icon
                    color="primary"
                    size="small"
                    class="btnPrint"
                  >
                    <v-icon>mdi-printer</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="12"
          class="pt-0"
        >
          <div class="funcionarios">
            <div class="funcionarios__lista">
              <v-card class="funcionario__card">
                <div class="funcionario__card__usuario">
                  <v-avatar
                    size="50px"
                    color="primary"
                    class="funcionario__avatar"
                  >
                    <v-img
                      :src="actions.getFotoFuncionarioURL(state.cpf)"
                      aspect-ratio="1"
                      cover
                    >
                    </v-img>
                  </v-avatar>

                  <div class="nomeCargo">
                    <strong class="funcionario__card__nome"
                      ><b>{{ state.nome }}</b></strong
                    >
                    <span class="funcionario__card__cargo">{{ state.cargo }}</span>
                  </div>
                </div>

                <v-col>
                  <span class="funcionario__card__infos">
                    Pontos não batidos:
                    <b>{{ state.qtd_pontos_nao_batidos || 0 }}</b>
                  </span>
                  <span class="funcionario__card__infos">
                    Pontos incompletos:
                    <b>{{ state.qtd_pontos_incompletos || 0 }}</b>
                  </span>
                </v-col>

                <v-col class="infoPontosFunc">
                  <span class="funcionario__card__infos">
                    Qtd de justificativas:
                    <b>{{ state.qtd_faltas_justificadas || 0 }}</b>
                  </span>
                  <span class="funcionario__card__infos">
                    Pontos à justificar:
                    <b>{{ state.qtd_a_justificar || 0 }}</b>
                  </span>
                </v-col>
              </v-card>

              <v-card class="funcionario__card">
                <v-col>
                  <span class="funcionario__card__faltas">
                    Faltas:
                    <b></b>
                  </span>
                  <span class="funcionario__card__faltas">
                    Faltas Justificadas:
                    <b></b>
                  </span>
                  <span class="funcionario__card__faltas">
                    Falta Abonada:
                    <b></b>
                  </span>
                </v-col>

                <v-col>
                  <span class="funcionario__card__faltas">
                    Atestado:
                    <b></b>
                  </span>
                  <span class="funcionario__card__faltas">
                    Licença Maternidade:
                    <b></b>
                  </span>
                  <span class="funcionario__card__faltas">
                    Licença Paternidade:
                    <b></b>
                  </span>
                </v-col>

                <v-col>
                  <span class="funcionario__card__faltas">
                    Dia de Folga:
                    <b></b>
                  </span>
                  <span class="funcionario__card__faltas">
                    Suspenso:
                    <b></b>
                  </span>
                  <span class="funcionario__card__faltas">
                    Feriado:
                    <b></b>
                  </span>
                </v-col>
              </v-card>
            </div>
          </div>
        </v-col>
      </v-row>

      <div class="calendario">
        <v-row class="fill-height">
          <v-col>
            <v-sheet
              height="1000"
              width="1050"
            >
              <v-calendar
                ref="calendario"
                v-model="state.today"
                color="primary"
                type="month"
                :events="pontosCalendario"
                @click:event="onDataClicada"
                @update:model-value=""
              ></v-calendar>
            </v-sheet>
          </v-col>
        </v-row>
      </div>
    </div>

    <div id="pnCodigoTela">folhaPontoDetalhes</div>
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
  margin-top: 10px;
  margin-left: 20px;
}
.btnSearch {
  margin-left: 10px;
  margin-top: 10px;
}

.funcionarios__lista {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  max-height: 650px;
}

.funcionario__card {
  width: 522px;
  height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 12px;
  cursor: pointer;
  position: relative;
}

.funcionario__card__usuario {
  padding-left: 12px;
  display: flex;
  gap: 12px;
}

.funcionario__avatar {
  margin-top: 30px;
  margin-left: 20px;
  cursor: pointer;
  opacity: 1;
  border: 1px solid #0000002f;
}

.funcionario__card__faltas {
  margin-left: 20px;
  font-size: 15px;
  color: #5a6069;
}
.funcionario__card__infos {
  margin-left: 20px;
  font-size: 15px;
  color: #5a6069;
}

.funcionario__card__nome {
  font-size: 15px;
  color: #2a2a2a;
  display: flex;
  align-items: left;
  justify-content: left;
}

.funcionario__card__cargo {
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #5a6069;
}

.nomeCargo {
  margin-top: 30px;
  margin-left: 20px;
}

.infoPontosFunc {
  margin-top: -15px;
}
</style>
