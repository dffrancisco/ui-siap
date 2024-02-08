<script setup lang="ts">
import xModal, { iModalCreate } from "@/plugins/xModal/xModal";
import printJS from "print-js";
import { defineProps, computed, onMounted, nextTick, reactive } from "vue";
import ModalQrCode from "./modalQrCode.vue";
import { iDeletarFalta, iFaltaFeriadoFolga } from "../interface";
import gerenciarFolhaPontoDetalhesService from "./../services/gerenciarFolhaPontoDetalhes.service";
import Swal from "sweetalert2";
import { confirmaCodigo } from "@/ts/utils";

const props = defineProps<{
  dadosAusencia;
  funcionario;
  horaChegada;
  horaAlmocoInicial;
  horaAlmocoFinal;
  horaSaida;
  tiposDeFalta;
  opened: boolean;
}>();

const emit = defineEmits(["exibirFaltaFeriadoOuFolga"]);

const state = reactive({
  loading: false,
  justificativa: "",
  selectedCID: "",
  showCIDAutocomplete: false,
  hideButtons: false,
  selectedFalta: "",
  selectedFaltaTipo: "",
  modalQrCode: <iModalCreate>(<unknown>null),
  modalQrCodeOpened: false,
  inserirFalta: <unknown>null,
  deletarFalta: <unknown>null,
});

const showSalvarFeriadoFolga = computed(() => {
  if (state.justificativa) {
    const selectedFalta = props.tiposDeFalta.find((item) => item.DESCRICAO === state.justificativa);
    return selectedFalta && (selectedFalta.DESCRICAO === "Dia de Folga" || selectedFalta.DESCRICAO === "Feriado");
  } else {
    return false;
  }
});

const preencherJustificativa = (DESCRICAO: string) => {
  state.justificativa = DESCRICAO;
  state.showCIDAutocomplete = DESCRICAO === "Atestado";

  const isFeriadoFolga = DESCRICAO === "Dia de Folga" || DESCRICAO === "Feriado";
  state.hideButtons = isFeriadoFolga;

  const selectedFalta = props.tiposDeFalta.find((item) => item.DESCRICAO === DESCRICAO);
  if (selectedFalta) {
    state.selectedFaltaTipo = selectedFalta.TIPO;
  }
};

function imprimirJustificativa() {
  const conteudoElement = criarHTMLParaPDF();

  printJS({
    documentTitle: "Justificativa de ausência",
    printable: conteudoElement,
    type: "html",
  });
}

function criarHTMLParaPDF() {
  const justificativaValor = state.justificativa ? state.justificativa : "";

  const conteudoHTML = `
    <div id="justificativaPDF">
      <p>JUSTIFICATIVA DE AUSÊNCIA</p>
      <p>Eu, ${props.funcionario.nome}, brasileiro (a), de CPF ${props.funcionario.cpf}, profissional lotado no cargo ${props.funcionario.cargo}, na empresa REAL ACESSÓRIOS venho justificar ao RH, minha ausência que foi devido a: ${justificativaValor}. No dia ${props.dadosAusencia}, motivos pelos quais impossibilitaram minha presença na empresa, bem como o desempenho das respectivas funções. Solicito, portanto, o abono da falta, visto que a mesma ocorreu por motivo de força maior e foi devidamente justificada.</p>
      <p>Por ser expressão da verdade, firmo a presente.</p>
      <p>Brasília-DF, __/__/____.</p>
      <p>${props.funcionario.nome}</p>
    </div>
  `;

  const tempElement = document.createElement("div");
  tempElement.innerHTML = conteudoHTML;

  return tempElement;
}

const tipoAusenciaDisabled = computed(() => {
  if (
    props.horaChegada != null &&
    props.horaAlmocoInicial != null &&
    props.horaAlmocoFinal != null &&
    props.horaSaida != null
  ) {
    return true;
  } else {
    return false;
  }
});

const buttonsDisabled = computed(() => {
  return !state.selectedFalta || !state.justificativa;
});

function modal() {
  state.modalQrCode = new xModal.create({
    width: 400,
    height: 550,
    el: "#modalQrCode",
    theme: "xModal-blue",
    onOpen: () => {
      state.modalQrCodeOpened = true;
    },
    onClose: () => {
      state.modalQrCodeOpened = false;
    },
  });
}

function abrirModalQrCode() {
  state.modalQrCode.open();
}

const dadosDocumentoAusencia = computed(() => {
  const justificativaValor = state.justificativa ? state.justificativa : "";
  if (justificativaValor == undefined) {
    return {};
  }

  let cpf = props.funcionario.cpf;
  let nomeFuncionario = props.funcionario.nome;
  let data = props.dadosAusencia;

  const dadosParaQrCode = {
    cpf: cpf,
    nomeFuncionario: nomeFuncionario,
    data: data,
    justificativaValor: justificativaValor,
    cid: state.selectedCID,
  };

  return dadosParaQrCode;
});

async function salvarFaltaFeriadoOuFolga() {
  let dataFalta = props.dadosAusencia;
  dataFalta = ajustarData(dataFalta);

  const param: iFaltaFeriadoFolga = {
    falta: state.selectedFalta,
    data: dataFalta,
    cod_funcionario: props.funcionario.cod_funcionario,
    tipo: state.selectedFaltaTipo,
  };

  try {
    state.loading = true;
    state.inserirFalta = await gerenciarFolhaPontoDetalhesService.setFaltaFeriadoOuFolga(param);
    state.loading = false;
    Swal.fire({
      icon: "success",
      title: "Ausência salva com sucesso!",
      showConfirmButton: false,
      timer: 2500,
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      text: "Ocorreu um erro ao inserir a falta.",
    });
  }

  emit("exibirFaltaFeriadoOuFolga");
}

function ajustarData(dataFalta) {
  const partesData = dataFalta.split("/");
  const dataObjeto = new Date(partesData[2], partesData[1] - 1, partesData[0]);
  const ano = dataObjeto.getFullYear();
  let mes = dataObjeto.getMonth() + 1;
  let dia = dataObjeto.getDate();
  const dataFormatada = `${ano}-${mes < 10 ? "0" + mes : mes}-${dia < 10 ? "0" + dia : dia}`;

  return dataFormatada;
}

async function deletarFalta() {
  let dataFalta = props.dadosAusencia;
  dataFalta = ajustarData(dataFalta);

  const param: iDeletarFalta = {
    data: dataFalta,
    cod_funcionario: props.funcionario.cod_funcionario,
  };

  confirmaCodigo({
    msg: "Confirma exclusão deste registro?",
    call: async function () {
      try {
        state.loading = true;
        state.deletarFalta = await gerenciarFolhaPontoDetalhesService.deletarFalta(param);
        state.loading = false;
        Swal.fire({
          icon: "success",
          title: "Ausência deletada com sucesso!",
          showConfirmButton: false,
          timer: 2500,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          text: "Ocorreu um erro ao deletar a falta.",
        });
      }
      emit("exibirFaltaFeriadoOuFolga");
    },
  });
}

onMounted(() => {
  nextTick(() => {
    modal();
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
          >{{ "Data: " + dadosAusencia }} -
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
            <v-autocomplete
              :items="tiposDeFalta.map((item) => item.DESCRICAO)"
              :item-value="tiposDeFalta.map((item) => item.TIPO)"
              id="tiposDeFalta"
              label="Tipo de Ausência"
              v-model="state.selectedFalta"
              @update:model-value="preencherJustificativa"
              :disabled="tipoAusenciaDisabled"
            ></v-autocomplete>
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
          :disabled="tipoAusenciaDisabled"
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
            :disabled="tipoAusenciaDisabled"
          >
          </v-textarea>
        </v-col>
      </v-row>
    </div>

    <div
      ><v-btn
        label="Deletar Falta"
        color="primary"
        class="btnDelete"
        :disabled="tipoAusenciaDisabled"
        @click="deletarFalta"
      >
        <v-icon>mdi-delete</v-icon>
        Deletar Falta
      </v-btn>
      <v-btn
        v-if="!state.hideButtons"
        color="primary"
        class="btnJustificar"
        @click="imprimirJustificativa"
        :disabled="tipoAusenciaDisabled || buttonsDisabled"
      >
        <v-icon>mdi-printer-settings</v-icon>
        Justificativa
      </v-btn>
      <v-btn
        v-if="!state.hideButtons"
        color="primary"
        class="btnSalvar"
        @click="abrirModalQrCode()"
        :disabled="tipoAusenciaDisabled || buttonsDisabled"
      >
        <v-icon>mdi-content-save</v-icon>
        Salvar
      </v-btn>
      <v-btn
        v-if="showSalvarFeriadoFolga"
        color="primary"
        class="btnSalvarFeriadoFolga"
        @click="salvarFaltaFeriadoOuFolga"
        :disabled="tipoAusenciaDisabled || buttonsDisabled"
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
  margin-left: 200px;
}

.btnSalvar {
  margin-right: 5px;
}

.btnSalvarFeriadoFolga {
  margin-left: 350px;
}
</style>
