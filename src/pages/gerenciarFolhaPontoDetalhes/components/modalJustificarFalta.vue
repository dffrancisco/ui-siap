<script setup lang="ts">
import { ref, defineProps } from "vue";

const justificativa = ref<string>("");
const { dadosAusencia, pontos, tiposDeFalta } = defineProps(["dadosAusencia", "pontos", "tiposDeFalta"]);

const preencherJustificativa = (DESCRICAO: string) => {
  justificativa.value = DESCRICAO;
};
</script>

<template>
  <div class="modal-justificar-falta">
    <v-row>
      <div>
        <span class="dataAusencia">{{ "Data: " + dadosAusencia }}-</span>
        <span class="nomeFuncionario">{{ pontos.nome }}</span>
      </div>

      <div class="horarios">
        <v-row>
          <v-col cols="3">
            <v-autocomplete
              label="Chegada"
              id="chegada"
              item-title="text"
              item-value="value"
              v-mask="'00:00'"
              v-model="pontos.HORA_CHEGADA"
            ></v-autocomplete>
          </v-col>
          <v-col cols="3">
            <v-autocomplete
              label="Início Almoço"
              id="inicioChegada"
              item-title="text"
              item-value="value"
              v-mask="'00:00'"
              v-model="pontos.HORA_ALMOCO_INICIAL"
            ></v-autocomplete>
          </v-col>
          <v-col cols="3">
            <v-autocomplete
              label="Fim Almoço"
              id="fimAlmoco"
              item-title="text"
              item-value="value"
              v-mask="'00:00'"
              v-model="pontos.HORA_ALMOCO_FINAL"
            ></v-autocomplete>
          </v-col>
          <v-col cols="3">
            <v-autocomplete
              label="Saída"
              id="saida"
              item-title="text"
              item-value="value"
              v-mask="'00:00'"
              v-model="pontos.HORA_SAIDA"
            ></v-autocomplete>
          </v-col>
        </v-row>
      </div>

      <div style="width: 100%">
        <v-container fluid>
          <span class="motivo">Motivo</span>
          <v-row>
            <v-autocomplete
              :items="tiposDeFalta.map((item) => item.DESCRICAO)"
              :item-value="tiposDeFalta.map((item) => item.TIPO)"
              label="Tipo de Ausência"
              @update:model-value="preencherJustificativa"
            ></v-autocomplete>
          </v-row>
        </v-container>
      </div>
    </v-row>

    <div>
      <v-row>
        <v-col cols="12">
          <v-textarea
            label="Justificativa"
            v-model="justificativa"
          >
          </v-textarea>
        </v-col>
      </v-row>
    </div>

    <div
      ><v-btn
        color="primary"
        class="btnDelete"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
      <v-btn
        color="primary"
        class="btnJustificar"
      >
        <v-icon>mdi-printer-settings</v-icon>
        Justificativa
      </v-btn>
      <v-btn
        color="primary"
        class="btnSalvar"
      >
        <v-icon>mdi-content-save</v-icon>
        Salvar
      </v-btn>
    </div>
  </div>
</template>

<style scoped>
.horarios {
  margin-top: 10px;
  width: 100%;
}
.motivo {
  margin-left: 10px;
}
.nomeFuncionario {
  margin-left: 5px;
  margin-top: 10px;
}

.dataAusencia {
  margin-left: 15px;
  margin-top: 10px;
}
.btnDelete {
  margin-left: 10px;
}

.btnJustificar {
  margin-right: 5px;
  margin-left: 330px;
}

.btnSalvar {
  margin-right: 5px;
}
</style>
