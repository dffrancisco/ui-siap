<script setup lang="ts">
import { onMounted } from "vue";
import { actions, state } from "./entregarReceber";
import utils from "@/ts/utils";

onMounted(async () => {
  actions.init();
});
</script>

<template>
  <v-container>
    <title>Entregar Receber</title>

    <div class="pa-5" style="max-width: 1200px; margin: 0 auto">
      <v-row>
        <v-col cols="3">
          <div class="totais">
            <strong>TOTALIZADORES</strong>
            <div class="cards-totalizadores">
              <v-card class="card-total">
                <strong class="card-total__valor"
                  >R$ {{ utils.formatValor(state.totalizadores.VALOR) }}</strong
                >
                <span class="card-total__descricao"
                  >Entregar Receber Pendente</span
                >
              </v-card>
              <v-card
                v-for="pagamento in state.totalizadores.PAGAMENTOS"
                class="card-total"
              >
                <strong class="card-total__valor"
                  >R$ {{ utils.formatValor(pagamento.TOTAL) }}</strong
                >
                <span class="card-total__descricao">
                  {{ pagamento.DESCRICAO_PAGAMENTO }}
                </span>
              </v-card>
            </div>
          </div>
        </v-col>
        <v-col cols="9">
          <v-row>
            <v-col cols="6">
              <div class="motoristas">
                <strong>MOTORISTAS COM PENDÊNCIAS</strong>
                <div class="motoristas__lista">
                  <v-badge
                    :content="state.qtdTotalPendenciasMotoristas"
                    color="error"
                  >
                    <v-avatar
                      size="50px"
                      color="primary"
                      title="Todos motoristas"
                      class="motoristas__lista__avatar"
                      @click="actions.onClickMotorista(null)"
                    >
                      <v-icon color="#fff" size="30px">
                        mdi-account-group
                      </v-icon>
                    </v-avatar>
                  </v-badge>
                  <v-badge
                    v-for="motorista in state.motoristas"
                    :content="motorista.QTD"
                    color="error"
                  >
                    <v-avatar
                      size="50px"
                      color="primary"
                      :title="motorista.NOME_MOTORISTA"
                      class="motoristas__lista__avatar"
                      @click="
                        actions.onClickMotorista(motorista.COD_FUNCIONARIO)
                      "
                    >
                      <v-img
                        :src="actions.getFotoMontadorURL(motorista.CPF)"
                        aspect-ratio="1"
                        cover
                      />
                    </v-avatar>
                  </v-badge>
                </div>
              </div>
            </v-col>
            <v-col cols="12" class="pt-0">
              <div class="clientes">
                <strong>CLIENTES ENTREGAR / RECEBER</strong>
                <div class="clientes__lista">
                  <v-card
                    class="clientes__lista__card"
                    @click="actions.onClickCliente(null)"
                  >
                    <div class="clientes__lista__card__contador">
                      <v-badge
                        color="primary"
                        :content="state.totalizadores.QTD"
                        inline
                      ></v-badge>
                    </div>
                    <strong class="clientes__lista__card__valor">
                      {{ utils.formatValor(state.totalizadores.VALOR) }}
                    </strong>
                    <span class="clientes__lista__card__nome">
                      Entregar Receber Pendente
                    </span>
                  </v-card>
                  <v-card
                    v-for="cliente in state.clientes"
                    class="clientes__lista__card"
                    @click="actions.onClickCliente(cliente.ID_CLIENTE)"
                  >
                    <div class="clientes__lista__card__contador">
                      <v-badge
                        color="primary"
                        :content="cliente.QTD"
                        inline
                      ></v-badge>
                    </div>
                    <strong class="clientes__lista__card__valor">
                      {{ utils.formatValor(cliente.VALOR) }}
                    </strong>
                    <span class="clientes__lista__card__nome">
                      {{ cliente.CLIENTE }}
                    </span>
                  </v-card>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>

    <div id="pnCodigoTela">entregarReceber</div>

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
.cards-totalizadores {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
}
.card-total {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px;
  width: 100%;

  &__valor {
    font-size: 22px;
    color: #2a2a2a;
  }

  &__descricao {
    color: #5a6069;
    text-transform: capitalize;
  }
}

.motoristas {
  &__lista {
    display: flex;
    gap: 24px;
    margin-top: 12px;

    &__avatar {
      cursor: pointer;
      opacity: 1;
    }
  }
}

.clientes {
  &__lista {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    max-height: 450px;
    overflow-y: scroll;
    margin-top: 8px;

    &__card {
      width: 190px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 12px;
      cursor: pointer;

      &__contador {
        position: absolute;
        top: 10px;
        left: 5px;
      }

      &__nome {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #5a6069;
      }

      &__valor {
        font-size: 22px;
        color: #2a2a2a;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>
