<script setup lang="ts">
import { reactive } from "vue";

const state = reactive({
  configVMoney: {
    thousands: ".",
    decimal: ",",
    precision: 2,
  },
});
</script>

<template>
  <v-container>
    <div id="pnCampos">
      <v-row>
        <v-col cols="12">
          <h2 class="font-weight-regular">Transportadora</h2>
          <div>
            <select
              class="ss obr"
              value=""
            >
              <option
                v-for="i in 13"
                :value="i"
              >
                {{ i }}</option
              >
            </select>
          </div>
        </v-col>
        <v-col cols="9">
          <h2 class="font-weight-regular">Modalidade Frete</h2>
          <div>
            <select
              class="obr ss"
              value=""
            >
              <option value="0">Por conta do emitente</option>
              <option value="1">Por conta do destinatário/remetente</option>
              <option value="2">Por conta de terceiros</option>
              <option value="3">Transporte próprio por conta do remetente</option>
              <option value="4">Transporte próprio por conta do destinatário</option>
              <option value="9">Sem transporte</option>
            </select>
          </div>
        </v-col>
        <v-col>
          <h2 class="font-weight-regular">Valor</h2>
          <div>
            <input
              class="ss obr"
              type="text"
              v-money3="state.configVMoney"
            /> </div
        ></v-col>
      </v-row>
    </div>

    <div class="btns pt-4">
      <v-btn
        style="color: #3680ab; border: 1px solid #3680ab"
        @click=""
        >Cancelar</v-btn
      >
      <v-btn
        color="#3680AB"
        @click=""
        >Selecionar</v-btn
      >
    </div>
  </v-container>
</template>

<style scoped>
h2 {
  font-size: 16px;
  padding-bottom: 8px;
}

.btns {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  gap: 8px;
}
</style>
