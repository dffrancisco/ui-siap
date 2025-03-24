<script setup lang="ts">
import Swal from "sweetalert2";
import serviceBaixaManualBoleto from "../services/baixaManualBoleto.service";
import { iBoleto, iClientesFaturados, iOrcamento } from "../interfaces";
import { reactive } from "vue";

const emit = defineEmits(["closeModalUploadComprovante", "baixaManualBoleto"]);

const props = defineProps<{
  clienteSelecionado?: iClientesFaturados;
  boletosSelecionados?: iBoleto[];
  orcamentosSelecionados?: iOrcamento[];
  cnpjEmpresa?: string;
}>();

const state = reactive({
  loading: false,
  justificativaBaixaManual: "",
  nomeImgComprovante: null,
  formDataImgComprovante: null,
});

const actions = {
  cancelar() {
    emit("closeModalUploadComprovante");
  },

  abrirSeletorDeComprovante() {
    const input = document.getElementById("comprovanteInput") as HTMLInputElement;
    if (input) input.click();
  },

  async resizeImage(file: File, maxSizeMB: number): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = async () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Redimensiona mantendo proporção
          let width = img.width;
          let height = img.height;
          const scaleFactor = Math.sqrt((maxSizeMB * 1024 * 1024) / (file.size || 1));

          width *= scaleFactor;
          height *= scaleFactor;

          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(new File([blob], file.name, { type: file.type }));
              } else {
                reject("Erro ao redimensionar imagem.");
              }
            },
            file.type,
            0.8 // Qualidade do JPG (80%)
          );
        };
      };
      reader.onerror = () => reject("Erro ao ler imagem.");
    });
  },

  async processarComprovante(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const formatosAceitos = ["pdf", "jpg", "jpeg"];
    const extensaoDoArquivo = file.name.split(".").pop()?.toLowerCase();
    if (!extensaoDoArquivo || !formatosAceitos.includes(extensaoDoArquivo)) {
      Swal.fire({ icon: "error", text: "Formato inválido. Apenas PDF, JPG e JPEG são permitidos." });
      return;
    }

    try {
      state.loading = true;
      let arquivoAjustado = file;

      if (file.type.startsWith("image/")) {
        arquivoAjustado = await actions.resizeImage(file, 5);
      }

      let nomeDoArquivo = "";

      props.boletosSelecionados.forEach((boleto) => {
        nomeDoArquivo += `${boleto.NUM_BOLETO}_`;
      });

      props.orcamentosSelecionados.forEach((orcamento) => {
        nomeDoArquivo += `OR${orcamento.NUM_ORCAMENTO}-${orcamento.DATA}_`;
      });

      nomeDoArquivo += `${props.clienteSelecionado.CNPJ}`;

      const formData = new FormData();
      formData.append("file", arquivoAjustado);
      formData.append("nomeDoArquivo", nomeDoArquivo);
      formData.append("extensaoDoArquivo", extensaoDoArquivo);
      formData.append("class", "BaixaBoleto");
      formData.append("call", "uploadDoc");
      formData.append("cnpjEmpresa", props.cnpjEmpresa);

      state.nomeImgComprovante = file.name;
      state.formDataImgComprovante = formData;
    } catch (error) {
      Swal.fire({ icon: "error", text: "Erro ao processar o comprovante." });
    } finally {
      target.value = "";
      state.loading = false;
    }
  },

  async uploadComprovante() {
    try {
      state.loading = true;
      const formData = state.formDataImgComprovante;
      await serviceBaixaManualBoleto.uploadComprovante(formData);
    } catch (error) {
      Swal.fire({ icon: "error", text: "Erro ao enviar o comprovante." });
    } finally {
      state.loading = false;
    }
  },

  async onClickEnviar() {
    if (!state.justificativaBaixaManual || state.justificativaBaixaManual.trim() == "") {
      Swal.fire({ icon: "warning", text: "Justificativa é obrigatória." });
      return;
    }

    if (!state.formDataImgComprovante) {
      Swal.fire({ icon: "warning", text: "Por favor, anexe um comprovante de pagamento." });
      return;
    }

    await actions.uploadComprovante();

    emit("baixaManualBoleto", state.justificativaBaixaManual);
    emit("closeModalUploadComprovante");
  },
};
</script>
<template>
  <v-card class="pa-4">
    <div
      ><span class="spanTitleUpload"
        ><u>E</u>nviar Comprovante de Pagamento para finalizar baixa manual.</span
      ></div
    >
    <div class="d-flex align-center mt-4 flex-column">
      <input
        type="file"
        id="comprovanteInput"
        accept=".pdf, .jpg, .jpeg"
        style="display: none"
        @change="actions.processarComprovante"
      />
      <v-btn
        icon="mdi-upload"
        size="50px"
        color="primary"
        title="Enviar Comprovante de Pagamento"
        @click="actions.abrirSeletorDeComprovante"
      />
      <div
        class="mt-2 d-flex"
        style="max-width: 250px"
      >
        <span class="text-truncate text-body-2">{{ state.nomeImgComprovante }}</span>
      </div>
    </div>

    <div class="mt-4">
      <v-textarea
        v-model="state.justificativaBaixaManual"
        label="Justificativa*"
        maxlength="200"
        rows="4"
      ></v-textarea>
    </div>

    <v-btn
      class="mt-4"
      variant="outlined"
      color="primary"
      @click="actions.cancelar()"
      >Cancelar</v-btn
    >

    <v-btn
      class="mt-2"
      color="primary"
      @click="actions.onClickEnviar()"
      >Enviar</v-btn
    >
  </v-card>
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
.spanTitleUpload {
  font-size: 15px;
}
</style>
