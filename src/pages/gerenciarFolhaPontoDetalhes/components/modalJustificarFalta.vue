<script setup lang="ts">
import xModal from "@/plugins/xModal/xModal";
import printJS from "print-js";
import { onMounted } from "vue";
import { ref, defineProps, computed } from "vue";

const justificativa = ref<string>("");
const showCIDAutocomplete = ref(false);
const { dadosAusencia, pontos, tiposDeFalta } = defineProps(["dadosAusencia", "pontos", "tiposDeFalta"]);

const preencherJustificativa = (DESCRICAO: string) => {
  justificativa.value = DESCRICAO;
  showCIDAutocomplete.value = DESCRICAO === "Atestado";
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
  let nome = document.getElementById("nome");
  const justificativaValor = justificativa && justificativa.value ? justificativa.value : "";
  // const dataAusencia = dadosAusencia || "";

  const conteudoHTML = `
    <div id="justificativaPDF">
      <p>JUSTIFICATIVA DE AUSÊNCIA</p>
      <p>Eu, ${nome}, brasileiro (a), de CPF ${pontos.cpf}, profissional lotado no cargo ${pontos.cargo}, na empresa REAL ACESSÓRIOS venho justificar ao RH, minha ausência que foi devido a: ${justificativaValor}. No dia ${dadosAusencia}, motivos pelos quais impossibilitaram minha presença na empresa, bem como o desempenho das respectivas funções. Solicito, portanto, o abono da falta, visto que a mesma ocorreu por motivo de força maior e foi devidamente justificada.</p>
      <p>Por ser expressão da verdade, firmo a presente.</p>
      <p>Brasília-DF, __/__/____.</p>
      <p>${nome}</p>
    </div>
  `;

  const tempElement = document.createElement("div");
  tempElement.innerHTML = conteudoHTML;

  return tempElement;
}

const tipoAusenciaDisabled = computed(() => {
  return (
    pontos.HORA_CHEGADA == null &&
    pontos.HORA_ALMOCO_INICIAL == null &&
    pontos.HORA_ALMOCO_FINAL == null &&
    pontos.HORA_SAIDA == null
  );
});

function modal() {
  const modalQrCode = new xModal.create({
    width: 400,
    height: 425,
    el: "#modalQrCode",
    theme: "xModal-blue",
  });
}

onMounted(() => {
  modal();
});

const dadosDocumentoAusencia = computed(() => {});
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
          >{{ pontos.nome }}</span
        >
        <span
          class="cargoFuncionario"
          id="cargo"
        >
          - {{ pontos.cargo }}</span
        >
      </div>

      <div class="horarios">
        <v-row>
          <v-col cols="3">
            <v-autocomplete
              class="horarios__ponto"
              :class="{ vazio: pontos.HORA_CHEGADA == null }"
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
              class="horarios__ponto"
              :class="{ vazio: pontos.HORA_ALMOCO_INICIAL == null }"
              label="Início Almoço"
              id="inicioAlmoco"
              item-title="text"
              item-value="value"
              v-mask="'00:00'"
              v-model="pontos.HORA_ALMOCO_INICIAL"
            ></v-autocomplete>
          </v-col>
          <v-col cols="3">
            <v-autocomplete
              class="horarios__ponto"
              :class="{ vazio: pontos.HORA_ALMOCO_FINAL == null }"
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
              class="horarios__ponto"
              :class="{ vazio: pontos.HORA_SAIDA == null }"
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
          <v-row>
            <v-autocomplete
              :items="tiposDeFalta.map((item) => item.DESCRICAO)"
              :item-value="tiposDeFalta.map((item) => item.TIPO)"
              id="tiposDeFalta"
              label="Tipo de Ausência"
              @update:model-value="preencherJustificativa"
              :disabled="tipoAusenciaDisabled"
            ></v-autocomplete>
          </v-row>
        </v-container>
      </div>
      <div style="width: 30%"
        ><v-autocomplete
          id="cid"
          v-if="showCIDAutocomplete"
          label="CID"
        >
        </v-autocomplete>
      </div>
    </v-row>

    <div>
      <v-row>
        <v-col cols="12">
          <v-textarea
            label="Após gerar PDF, fazer upload do mesmo assinado pelo funcionário."
            id="justificativa"
            v-model="justificativa"
            :disabled="tipoAusenciaDisabled"
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
        @click="imprimirJustificativa"
      >
        <v-icon>mdi-printer-settings</v-icon>
        Justificativa
      </v-btn>
      <v-btn
        color="primary"
        class="btnSalvar"
        :dadosDocumentoAusencia="dadosDocumentoAusencia"
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
    <modal-qr-code />
  </div>
</template>

<style scoped>
.vazio {
  background-color: #fbc8c868;
  border: 1px solid rgb(254, 91, 91);
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
  margin-left: 280px;
}

.btnSalvar {
  margin-right: 5px;
}
</style>
