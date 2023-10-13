<script lang="ts" setup>
import utils, { formatValor } from "@/ts/utils";
import { nextTick, ref } from "vue";
import { actions, state } from "../descontoOrcamento";

nextTick(() => {
  state.edtDesconto = document.getElementById("edtDesconto");
});

let percenter = ref(0);
// let valorFinal = ref(0);
let desconto = ref(0);

const calcDesconto = () => {
  // if (state.valorDesconto == "") {
  //   percenter.value = 0;
  //   // valorFinal.value = state.dataOrcamento.VALOR;
  //   return;
  // }

  // desconto.value = utils.formatValorUSA(state.descontoValor);
  // valorFinal.value = state.dataOrcamento.VALOR - desconto.value;
  percenter.value = (desconto.value / state.dataOrcamento.VALOR) * 100;
};
</script>

<template>
  <v-card class="mt-n3 pr-2">
    <div class="text-right">
      <div>
        <v-chip color="cyan" label size="small" class="ma-1"
          >Desconto Marca:
          <b class="pl-2">
            {{ formatValor(state.dataOrcamento.DESCONTO_MARCA) }}
          </b>
        </v-chip>
      </div>

      <div>
        <v-chip color="success" label size="small" class="ma-1"
          >Desconto Vendedor:
          <b class="pl-2">
            {{ formatValor(state.dataOrcamento.DESCONTO_VENDEDOR) }}
          </b>
        </v-chip>
      </div>

      <div>
        <v-chip color="primary" label size="small" class="ma-1"
          >Desconto Gerente:
          <b class="pl-2">
            {{ formatValor(state.dataOrcamento.DESCONTO_GERENTE) }}
          </b>
        </v-chip>
      </div>

      <!-- <div>
        <v-chip color="error" label size="small" class="ma-1"
          >Total Desconto:
          <b class="pl-2">
            {{ formatValor(state.dataOrcamento.DESCONTO) }}
          </b>
        </v-chip>
      </div> -->
    </div>

    <v-row>
      <v-col cols="2">
        <v-btn
          size="small"
          @click="actions.removeDescontoGerente()"
          class="elevation-0 ml-3 mt-2"
        >
          <v-icon>mdi-trash-can</v-icon>
        </v-btn></v-col
      >
      <v-col cols="10">
        <div class="text-right mr-1">
          <v-chip color="success" label>
            <span class="text-subtitle-1">
              {{
                utils.formatValor(
                  state.dataOrcamento.VALOR + state.dataOrcamento.DESCONTO
                )
              }}
            </span>
          </v-chip>

          <v-chip color="error" label class="ma-2">
            <div class="d-flex flex-column">
              <span class="text-subtitle-1">
                -{{ utils.formatValor(state.dataOrcamento.DESCONTO) }}
              </span>
              <span class="mt-n2 text-caption">
                {{ utils.formatValor(actions.getPercentTotalDesconto()) }}%
              </span>
            </div>
          </v-chip>

          <v-chip color="primary" label>
            <span class="text-h6">
              {{
                utils.formatValor(
                  state.dataOrcamento.VALOR + state.dataOrcamento.VALOR_MONTAGEN
                )
              }}
            </span>
          </v-chip>
        </div>
      </v-col>
    </v-row>

    <!-- <v-row>
      <v-col cols="6"></v-col>
      <v-col cols="6" style="height: 50px">
      </v-col>

      <v-col cols="6"></v-col>
      <v-col cols="6">
        <div>Percentual de Desconto {{ utils.formatValor(percenter) }}%</div>
        <div class="text-right mr-2 text-h5">
          <b>{{
            utils.formatValor((state.dataOrcamento.VALOR | 0) - desconto)
          }}</b>
        </div>
        <div class="text-right mt-2">
          <v-btn>Salvar</v-btn>
        </div>
      </v-col>
    </v-row> -->
  </v-card>
</template>
