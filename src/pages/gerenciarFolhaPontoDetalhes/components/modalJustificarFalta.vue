<script setup lang="ts">
import { defineProps, onMounted, nextTick } from "vue";
import ModalQrCode from "./modalQrCode.vue";
import { iDadosDocumento, iPropsFuncionario, iPropsPontosDiaSelecionado, iPropsTiposDeFalta } from "../interface";
import { setup } from "./modalJustificarFalta";

const props = defineProps({
  pontos: {
    type: Object as () => iPropsPontosDiaSelecionado,
  },
  dadosAusencia: {
    type: [Date, String],
  },
  funcionario: {
    type: Object as () => iPropsFuncionario,
  },
  horaChegada: {
    type: String || null || undefined,
  },
  horaAlmocoInicial: {
    type: String || null || undefined,
  },
  horaAlmocoFinal: {
    type: String || null || undefined,
  },
  horaSaida: {
    type: String || null || undefined,
  },
  dadosDocumento: {
    type: Array as () => iDadosDocumento[],
  },
  tiposDeFalta: {
    type: Array as () => iPropsTiposDeFalta[],
  },
  opened: {
    type: Boolean,
  },
});

const emit = defineEmits(["atualizarDados", "fecharModal"]);

const {
  state,
  actions,
  showSalvarFeriadoFolga,
  jaJustificado,
  desativarBtn,
  desativarBtnVerDoc,
  desativarBtnDelete,
  desativarBotoesSeNadaSelecionado,
  dadosDocumentoAusencia,
} = setup(emit, props);

onMounted(() => {
  nextTick(() => {
    actions.modal();
  });
});
</script>

<template>
  <div class="modal-justificar-falta">
    <v-row>
      <div>
        <span
          class="dataAusencia"
          id="dataAusencia"
          >{{ "Data: " + props.dadosAusencia }} -
        </span>
        <span
          class="nomeFuncionario"
          id="nome"
          >{{ props.funcionario.nome }}</span
        >
        <span
          class="cargoFuncionario"
          id="cargo"
        >
          - {{ props.funcionario.cargo }}</span
        >
      </div>

      <div class="horarios">
        <v-row>
          <v-col cols="3">
            <v-text-field
              class="horarios__ponto"
              :class="{ vazio: props.horaChegada == null }"
              label="Chegada"
              id="chegada"
              v-model="props.horaChegada"
              disabled
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field
              class="horarios__ponto"
              :class="{ vazio: props.horaAlmocoInicial == null }"
              label="Início Almoço"
              id="inicioAlmoco"
              v-model="props.horaAlmocoInicial"
              disabled
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field
              class="horarios__ponto"
              :class="{ vazio: props.horaAlmocoFinal == null }"
              label="Fim Almoço"
              id="fimAlmoco"
              v-model="props.horaAlmocoFinal"
              disabled
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field
              class="horarios__ponto"
              :class="{ vazio: props.horaSaida == null }"
              label="Saída"
              id="saida"
              v-model="props.horaSaida"
              disabled
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
      </div>
      <div style="width: 100%">
        <v-container fluid>
          <v-row>
            <v-select
              :items="props.tiposDeFalta"
              item-value="TIPO"
              item-title="DESCRICAO"
              id="tiposDeFalta"
              label="Tipo de Ausência"
              v-model="state.selectedFalta"
              :disabled="desativarBtn || jaJustificado"
              @update:model-value="actions.preencherJustificativa"
            ></v-select>
          </v-row>
        </v-container>
      </div>
      <div style="width: 30%"
        ><v-text-field
          class="cid"
          id="cid"
          v-if="state.showCIDAutocomplete"
          label="CID"
          v-model="state.selectedCID"
          :disabled="desativarBtn || jaJustificado"
        >
        </v-text-field>
      </div>
    </v-row>

    <div>
      <v-row>
        <v-col cols="12">
          <v-textarea
            label="Após gerar PDF, fazer upload do mesmo assinado pelo funcionário."
            id="justificativa"
            v-model="state.justificativa"
            :disabled="desativarBtn || jaJustificado || showSalvarFeriadoFolga"
          >
          </v-textarea>
        </v-col>
      </v-row>
    </div>

    <div
      ><v-btn
        v-if="desativarBtnDelete"
        label="Deletar Falta"
        color="primary"
        class="btnDelete"
        :disabled="desativarBtn"
        @click="actions.deletarFalta"
      >
        <v-icon>mdi-delete</v-icon>
        Deletar Falta
      </v-btn>
      <v-btn
        v-if="desativarBtnVerDoc"
        label="Visualizar"
        color="primary"
        class="btnVisualizarDocumento"
        @click="actions.visualizarDocumento"
      >
        <v-icon>mdi-eye</v-icon>
        Visualizar
      </v-btn>
      <v-btn
        v-if="!desativarBtn"
        color="primary"
        class="btnJustificar"
        @click="actions.imprimirJustificativa"
        :disabled="desativarBtn || desativarBotoesSeNadaSelecionado || jaJustificado || showSalvarFeriadoFolga"
      >
        <v-icon>mdi-printer-settings</v-icon>
        Justificativa
      </v-btn>
      <v-btn
        color="primary"
        class="btnSalvar"
        @click="actions.salvar()"
        :disabled="desativarBtn || desativarBotoesSeNadaSelecionado || jaJustificado"
      >
        <v-icon>mdi-content-save</v-icon>
        Salvar
      </v-btn>
    </div>
  </div>

  <div
    id="modalQrCode"
    title="Enviar Documento Ausência"
    style="display: none"
  >
    <ModalQrCode
      :dadosParaQrCode="dadosDocumentoAusencia"
      :opened="state.modalQrCodeOpened"
      @fecharModalQrCode="actions.fecharModalQrCode()"
    />
  </div>

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
</template>

<style scoped>
.vazio {
  background-color: #fbc8c868;
  height: 40px;
  border: 1px solid rgb(254, 91, 91);
  font-weight: 600;
}

.cid {
  margin-left: 10px;
}
.notaRodape {
  font-size: x-small;
  padding-top: -20px;
}
.modal-justificar-falta {
  padding: 15px;
}
.horarios {
  margin-top: 10px;
  width: 100%;
  padding-bottom: 10px;
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
  margin-left: 5px;
}

.btnJustificar {
  margin-right: 5px;
  margin-left: 10px;
}

.btnSalvar {
  margin-left: 4px;
}

.btnVisualizarDocumento {
  margin-left: 10px;
}
</style>
