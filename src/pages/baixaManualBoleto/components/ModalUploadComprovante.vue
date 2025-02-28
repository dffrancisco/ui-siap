<script setup lang="ts">
import Swal from "sweetalert2";
import serviceBaixaManualBoleto from "../services/baixaManualBoleto.service";
import { iClientesFaturados } from "../interfaces";
import { reactive } from "vue";

const emit = defineEmits(["closeModalUploadComprovante", "baixaManualBoleto"]);

const props = defineProps<{
  clienteSelecionado?: iClientesFaturados;
}>();

const state = reactive({
  loading: false,
});

const actions = {
  cancelar() {
    emit("closeModalUploadComprovante");
  },

  abrirSeletorDeComprovante() {
    const input = document.getElementById("comprovanteInput") as HTMLInputElement;
    if (input) input.click();
  },

  async uploadComprovante(event: Event) {
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

      const nomeDoArquivo = props.clienteSelecionado.CNPJ;

      const formData = new FormData();
      formData.append("file", arquivoAjustado);
      formData.append("nomeDoArquivo", nomeDoArquivo);
      formData.append("extensaoDoArquivo", extensaoDoArquivo);
      formData.append("class", "BaixaBoleto");
      formData.append("call", "uploadDoc");

      await serviceBaixaManualBoleto.uploadComprovante(formData);

      Swal.fire({ icon: "success", text: "Comprovante enviado com sucesso, baixa efetuada!" });
      emit("baixaManualBoleto");
      emit("closeModalUploadComprovante");
    } catch (error) {
      Swal.fire({ icon: "error", text: "Erro ao processar o comprovante." });
    } finally {
      target.value = "";
      state.loading = false;
    }
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
};
</script>
<template>
  <v-card
    width="310px"
    height="200px"
    class="mx-auto pa-4"
  >
    <div
      ><span class="spanTitleUpload"
        ><u>E</u>nviar Comprovante de Pagamento para finalizar baixa manual.</span
      ></div
    >
    <v-row>
      <input
        type="file"
        id="comprovanteInput"
        accept=".pdf, .jpg, .jpeg"
        style="display: none"
        @change="actions.uploadComprovante"
      />
      <v-btn
        class="iconUpload"
        icon="mdi-upload"
        size="50px"
        color="primary"
        title="Enviar Comprovante de Pagamento"
        @click="actions.abrirSeletorDeComprovante"
      />
    </v-row>
    <v-btn
      variant="outlined"
      color="primary"
      @click="actions.cancelar()"
      >Cancelar</v-btn
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
.iconUpload {
  cursor: pointer;
  margin-top: 25px;
  margin-left: 125px;
}

.spanTitleUpload {
  font-size: 15px;
}
</style>
