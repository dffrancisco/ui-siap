<script setup lang="ts">
import { ref, defineProps } from "vue";
const emit = defineEmits(["justificarAusencia"]);
const props = defineProps(["dataAusencia"]);
console.log(props);
</script>

<template>
  <div class="modal-justificar-falta">
    <v-row>
      <span>FULANO</span>
      <span>- 01/02/2024</span>
      <v-row>
        <v-col cols="3">
          <v-autocomplete
            label="Chegada"
            id="chegada"
            dense
            item-title="text"
            item-value="value"
          ></v-autocomplete>
        </v-col>
        <v-col cols="3">
          <v-autocomplete
            label="Início Almoço"
            id="inicioChegada"
            dense
            item-title="text"
            item-value="value"
          ></v-autocomplete>
        </v-col>
        <v-col cols="3">
          <v-autocomplete
            label="Fim Almoço"
            id="fimAlmoco"
            dense
            item-title="text"
            item-value="value"
          ></v-autocomplete>
        </v-col>
        <v-col cols="3">
          <v-autocomplete
            label="Saída"
            id="saida"
            dense
            item-title="text"
            item-value="value"
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-textarea label="Justificativa"> </v-textarea>
        </v-col>
      </v-row>
    </v-row>

    <div>
      <v-container fluid>
        <span>Motivo</span>
        <v-row>
          <!-- Primeira coluna -->
          <v-col cols="6">
            <v-radio
              label="Option One"
              value="one"
            ></v-radio>
            <v-radio
              label="Option 2 (string)"
              value="2"
            ></v-radio>
            <v-radio
              label="Option 3 (integer)"
              :value="3"
            ></v-radio>
            <v-radio
              label="Option 3 (integer)"
              :value="4"
            ></v-radio>
          </v-col>

          <v-col cols="6">
            <v-radio
              label="Option Four"
              value="four"
            ></v-radio>
            <v-radio
              label="Option 5 (string)"
              value="5"
            ></v-radio>
            <v-radio
              label="Option 6 (integer)"
              :value="6"
            ></v-radio>
            <v-radio
              label="Option 6 (integer)"
              :value="6"
            ></v-radio>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div
      ><v-btn variant="tonal">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
      <v-btn variant="tonal"> Button </v-btn>
      <v-btn variant="tonal"> Button </v-btn>
    </div>
  </div>
</template>
