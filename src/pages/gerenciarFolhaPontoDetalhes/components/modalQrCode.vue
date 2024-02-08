<script setup lang="ts">
import utils from "@/ts/utils";
import QrcodeVue from "qrcode.vue";
import { nextTick, ref, watch } from "vue";
import state from "../../login/login";
import $ from "jquery";

const props = defineProps<{
  dadosParaQrCode;
  opened: boolean;
}>();

const qrData = ref("");
var intervalId;
var cpf;

function gerarQrCode() {
  let cpf = props.dadosParaQrCode.cpf;
  let nomeFunc = props.dadosParaQrCode.nomeFuncionario;
  let tipoDocumento = "ausencia";
  let usuario = state.state.login.LOGIN;
  let dataDocArquivo = props.dadosParaQrCode.data;
  dataDocArquivo = ajustarData(dataDocArquivo);

  let justificativa = props.dadosParaQrCode.justificativaValor;
  let cid = props.dadosParaQrCode.cid;

  const chave = gerarChave(cpf, tipoDocumento, usuario, nomeFunc, dataDocArquivo);

  qrData.value = `http://192.168.100.202/siap+/funcionario_doc_imagem/?chave=${chave}`;

  console.log(qrData.value);
  console.log(cpf, tipoDocumento, usuario, nomeFunc, dataDocArquivo);

  setTimeout(() => {
    intervalId = setInterval(verificarArquivos, 2000);
  }, 1000);
}

function ajustarData(dataDocArquivo) {
  const partesData = dataDocArquivo.split("/");
  const dataObjeto = new Date(partesData[2], partesData[1] - 1, partesData[0]);
  const ano = dataObjeto.getFullYear();
  let mes = dataObjeto.getMonth() + 1;
  let dia = dataObjeto.getDate();
  const dataFormatada = `${ano}-${mes < 10 ? "0" + mes : mes}-${dia < 10 ? "0" + dia : dia}`;

  return dataFormatada;
}

function verificarArquivos() {
  cpf = props.dadosParaQrCode.cpf.replaceAll(".", "").replaceAll("-", "");

  $.ajax({
    url: "https://reallatas.com.br/doc_funcionario/getFiles.php",
    type: "POST",
    dataType: "json",
    data: {
      class: "Files",
      call: "getFilesTemp",
      param: {
        cpf: cpf,
        pasta: "ausencia",
      },
    },
    success: function (r) {
      if (r.length > 0) {
        const nomeDoDocumento = r[0].file;
        exibirArquivo(nomeDoDocumento);
        clearInterval(intervalId);
      }
    },
  });
}

function exibirArquivo(nomeDoDocumento: string) {
  const imgElement = document.createElement("img");
  imgElement.src = `https://reallatas.com.br/doc_funcionario/temp/${cpf}/ausencia/${nomeDoDocumento}`;
  imgElement.style.width = "200px";
  imgElement.style.height = "200px";
  imgElement.style.objectFit = "cover";

  const qrGenerate = document.getElementById("qr-generate");
  qrGenerate.innerHTML = "";
  qrGenerate.appendChild(imgElement);
}

function gerarChave(cpf, tipoDocumento, usuario, nomeFunc, dataDocArquivo) {
  return utils.base64_encode(`${cpf}|${tipoDocumento}|${usuario}|${nomeFunc}|${dataDocArquivo}`);
}

watch(
  () => props.opened,
  (newValue) => {
    nextTick(async () => {
      if (newValue) {
        gerarQrCode();
      }
    });
  }
);
</script>

<template>
  <div class="modal-qr-code">
    <div class="row">
      <div
        class="col s6"
        style="margin-left: 70px; margin-top: 30px"
      >
        <div id="qr-generate"
          ><qrcode-vue
            :value="qrData"
            :size="200"
          />
        </div>

        <div class="center-align">
          <v-file-input
            label="Escolher Arquivo"
            variant="solo-filled"
            id="file"
            class="input-file"
            accept=".pdf, .jpg, .jpeg"
          >
          </v-file-input>
        </div>
      </div>

      <div
        class="col s-12"
        id="textQr"
        style="width: 100%; display: flex; flex-direction: row; justify-content: center; align-items: center"
      >
        <div
          id="linksApps"
          style="margin-top: 1.2rem; text-align: center"
        >
          <div style="margin-bottom: 0.5rem">
            <p style="font-size: 10px">Leia o QR Code para enviar a foto pelo celular.</p>
            <p style="font-size: 10px">Caso você não tenha o aplicativo que não leia o QR Code aperte aqui.</p>
          </div>
          <a
            style="margin: 3 auto; font-size: 1rem; color: #808080; font-weight: bold"
            target="_blank"
            href="https://apps.apple.com/br/app/qr-code/id1200318119"
            >App Store</a
          >
          |
          <a
            style="margin: 3 auto; font-size: 1rem; color: #808080; font-weight: bold"
            target="_blank"
            href="https://play.google.com/store/apps/details?id=tw.mobileapp.qrcode.banner&hl=pt_BR&gl=US"
            >Play Store</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.input-file {
  margin-left: 10px;
  margin-right: 30px;
  width: 200px;
}

#qr-generate {
  margin-top: 1rem;
  margin-bottom: 3rem;
  margin-left: 1rem;
}
</style>
