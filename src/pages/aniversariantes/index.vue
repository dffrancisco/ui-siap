<script setup lang="ts">
import { onMounted } from "vue";
import { mesesToSelect } from "../../constants/constants";
import {
  actions,
  state,
  semanasComAniversariantes,
  aniversariantesPorSemana,
} from "./aniversariantes";

onMounted(async () => {
  actions.init();
});
</script>

<template>
  <v-container>
    <title>Aniversariantes</title>

    <div class="pa-5" style="max-width: 1200px; margin: 0 auto">
      <v-row>
        <v-col cols="9">
          <strong>ANIVERSARIANTES (TODAS AS LOJAS)</strong>
        </v-col>
        <v-col cols="3">
          <v-select
            label="Mês"
            v-model.lazy="state.mes"
            hide-details
            :density="'compact'"
            :items="mesesToSelect"
            @update:model-value="actions.getAniversariantesMes"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <div class="aniversariantes">
            <div class="aniversariantes__semanas">
              <div
                v-for="(semana, index) in semanasComAniversariantes"
                class="aniversariantes__semana"
              >
                <div class="aniversariantes__lista">
                  <span>SEMANA {{ index + 1 }}</span>
                  <div class="aniversariantes__cards">
                    <div
                      v-for="aniversariante in aniversariantesPorSemana[semana]"
                      class="aniversariantes__card-container"
                    >
                      <v-card class="aniversariantes__card">
                        <v-avatar
                          size="40px"
                          color="primary"
                          class="aniversariantes__card__avatar"
                        >
                          <v-img
                            :src="
                              actions.getFotoAniversarianteURL(
                                aniversariante.CPF
                              )
                            "
                            aspect-ratio="1"
                            cover
                          />
                        </v-avatar>
                        <div class="aniversariantes__card__nome">
                          <span>{{ aniversariante.NOME }}</span>
                        </div>
                      </v-card>
                      <div class="aniversariantes__card__dia">
                        {{ aniversariante.DIA }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>

    <div id="pnCodigoTela">aniversariantes</div>

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

<style lang="scss" scoped>
.aniversariantes {
  max-width: 1200px;

  &__semanas {
    width: 100%;
    display: flex;
    gap: 16px;
  }

  &__semana {
    flex-grow: 1;
    min-width: 0;
  }

  &__lista {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 12px;
  }

  &__cards {
    display: flex;
    flex-direction: column;
  }

  &__card-container {
    height: 64px;
  }

  &__card {
    margin-top: 6px;
    padding: 6px;
    display: flex;
    align-items: center;

    &__avatar {
      opacity: 1;
      margin-right: 6px;
    }

    &__nome {
      font-weight: 700;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }

    &__dia {
      position: relative;
      top: -40px;
      left: -10px;
      background-color: #a5dc86;
      width: 20px;
      height: 20px;
      border: 1px solid #a5dc86;
      border-radius: 100%;
      text-align: center;
      font-size: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
