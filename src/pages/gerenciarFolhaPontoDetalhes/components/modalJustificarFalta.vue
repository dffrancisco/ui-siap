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
  cnpj: {
    type: String,
  },
});

const emit = defineEmits(["atualizarDados", "fecharModal"]);

const {
  state,
  actions,
  desabilitarJustificativa,
  jaJustificado,
  desativarBtn,
  desativarBtnVerDoc,
  desativarBtnDelete,
  desabilitarBtnSalvar,
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
          class="dataAusencia pl-3"
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
    </v-row>
    <v-container>
      <div class="horarios pt-2">
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
      <div
        style="width: 100%"
        class="pa-3 pt-10"
      >
        <v-row>
          <v-select
            :items="props.tiposDeFalta"
            item-value="TIPO"
            item-title="DESCRICAO"
            id="tiposDeFalta"
            label="Tipo de Ausência"
            class="pb-2"
            v-model="state.selectedTipoFalta"
            :disabled="desativarBtn || jaJustificado"
            @update:model-value="actions.preencherJustificativa"
          ></v-select>
        </v-row>
        <v-row>
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
        <v-row>
          <v-textarea
            label="Após gerar PDF, fazer upload do mesmo assinado pelo funcionário."
            id="justificativa"
            class="pt-5"
            v-model="state.justificativa"
            :disabled="desabilitarJustificativa"
          >
          </v-textarea>
        </v-row>
      </div>
      <div class="pt-5"
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
          :disabled="desabilitarJustificativa"
        >
          <v-icon>mdi-printer-settings</v-icon>
          Justificativa
        </v-btn>
        <v-btn
          color="primary"
          class="btnSalvar"
          @click="actions.salvar()"
          :disabled="desabilitarBtnSalvar"
        >
          <v-icon>mdi-content-save</v-icon>
          Salvar
        </v-btn>
      </div>
    </v-container>
  </div>
  <div
    id="modalQrCode"
    title="Enviar Documento Ausência"
    style="display: none"
  >
    <ModalQrCode
      :dadosParaQrCode="dadosDocumentoAusencia"
      :opened="state.modalQrCodeOpened"
      :cnpj="props.cnpj"
      @fecharModalQrCode="actions.fecharModalQrCode()"
      @fecharModalJustificarFalta="actions.fecharModalJustificarFalta()"
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

.notaRodape {
  font-size: x-small;
  padding-top: -20px;
}
.modal-justificar-falta {
  padding: 15px;
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
  margin-right: 10px;
}

.btnJustificar {
  margin-right: 5px;
}

.btnSalvar {
  margin-left: 4px;
}

.btnVisualizarDocumento {
  margin-right: 10px;
}
</style>
