<script setup lang="ts">
import utils from "@/ts/utils";
import QrcodeVue from "qrcode.vue";
import { nextTick, reactive, ref, watch } from "vue";
import stateLogin from "../../login/login";
import globalState from "@/store/globalState";
import $ from "jquery";
import { iRegistrarDocumentoAusencia, iRegistrarFalta } from "../interface";
import Swal from "sweetalert2";
import gerenciarFolhaPontoDetalhesService from "../services/gerenciarFolhaPontoDetalhes.service";

const props = defineProps({
  dadosParaQrCode: {
    type: Object,
  },
  opened: {
    type: Boolean,
  },
});

const emit = defineEmits(["exibirDadosAtualizados", "fecharModalQrCode"]);

const state = reactive({
  inserirDadosDocumento: <any>null,
  inserirJustificativa: <any>null,
  loading: false,
  nomeDoDocumento: "",
  tipoDocumento: "ausencia",
});

const qrData = ref("");
var intervalId;
var cpf;

function gerarQrCode() {
  let cpf = props.dadosParaQrCode.cpf;
  let nomeFunc = props.dadosParaQrCode.loginFuncionario;
  let tipoDocumento = state.tipoDocumento;
  let usuario = stateLogin.state.login.LOGIN;
  let dataDocArquivo = props.dadosParaQrCode.data;
  dataDocArquivo = ajustarData(dataDocArquivo);

  const chave = gerarChave(cpf, tipoDocumento, usuario, nomeFunc, dataDocArquivo);

  qrData.value = `http://192.168.100.202/siap+/funcionario_doc_imagem/?chave=${chave}`;

  console.log(qrData.value);
  console.log(cpf, tipoDocumento, usuario, nomeFunc, dataDocArquivo);

  setTimeout(() => {
    intervalId = setInterval(verificarArquivos, 2000);
  }, 1000);
}

function gerarChave(cpf, tipoDocumento, usuario, nomeFunc, dataDocArquivo) {
  return utils.base64_encode(`${cpf}|${tipoDocumento}|${usuario}|${nomeFunc}|${dataDocArquivo}`);
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
        state.nomeDoDocumento = r[0].file;
        exibirArquivo(state.nomeDoDocumento);
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

  setTimeout(() => {
    state.loading = true;
    moverArquivoTemp(nomeDoDocumento);
  }, 2000);
}

function uploadArquivoPeloBotao(event) {
  state.loading = true;
  const file = event.target.files[0];
  const imgUrl = URL.createObjectURL(file);

  const imgElement = document.createElement("img");
  imgElement.src = imgUrl;
  imgElement.style.width = "200px";
  imgElement.style.height = "200px";
  imgElement.style.objectFit = "cover";

  const qrGenerate = document.getElementById("qr-generate");
  qrGenerate.innerHTML = "";
  qrGenerate.appendChild(imgElement);

  if (file.size > 1500000) {
    resizeImage(file, function (resizedFile) {
      console.log("diminuindo a imagem");
      uploadPDF(resizedFile, state.tipoDocumento);
    });
  } else {
    uploadPDF(file, state.tipoDocumento);
  }
}

function resizeImage(file, callback) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const newWidth = 800;
      const newHeight = (img.height / img.width) * newWidth;

      canvas.width = newWidth;
      canvas.height = newHeight;

      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      canvas.toBlob(function (blob) {
        const resizedFile = new File([blob], file.name, { type: file.type });
        callback(resizedFile);
      }, file.type);
    };
    //@ts-ignore
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

async function uploadPDF(file, tipoDocumento) {
  let formData = new FormData();

  let cpf = props.dadosParaQrCode.cpf;
  let usuario = stateLogin.state.login.LOGIN;
  let nomeFunc = props.dadosParaQrCode.loginFuncionario;
  let dataDocArquivo = props.dadosParaQrCode.data;
  dataDocArquivo = ajustarData(dataDocArquivo);

  formData.append("file", file);
  formData.append("cpf", cpf);
  formData.append("tipoDocumento", tipoDocumento);
  formData.append("usuario", usuario);
  formData.append("nomeFunc", nomeFunc);
  formData.append("dataDocArquivo", dataDocArquivo);
  formData.append("class", "Files");
  formData.append("call", "uploadPdf");

  try {
    const rs = await gerenciarFolhaPontoDetalhesService.uploadPDF(formData);

    const rsObj = JSON.parse(rs);
    const nomeDoDocumento = rsObj.log.arquivo;
    createRegistroAusencia(nomeDoDocumento, tipoDocumento);
    clearInterval(intervalId);
  } catch (error) {
    console.error(error);
  }
}

function moverArquivoTemp(nomeDoDocumento: string) {
  let tipoDocumento = "ausencia";
  $.ajax({
    url: "https://reallatas.com.br/doc_funcionario/getFiles.php",
    type: "POST",
    dataType: "json",
    data: {
      class: "Files",
      call: "moverArquivoTemp",
      param: {
        cpf: cpf,
        pasta: tipoDocumento,
      },
    },
    success: function (rs) {
      if (rs.success) {
        createRegistroAusencia(nomeDoDocumento, tipoDocumento);
      }
    },
    error: function (error) {
      console.log(error);
    },
  });
}

async function createRegistroAusencia(nomeDoDocumento: string, tipoDocumento: string) {
  let cpf = props.dadosParaQrCode.cpf;
  let usuario = stateLogin.state.login.LOGIN;
  let dataDocArquivo = props.dadosParaQrCode.data;
  dataDocArquivo = ajustarData(dataDocArquivo);

  let dataAtual = new Date();
  let options = { year: "numeric", month: "2-digit", day: "2-digit" };
  //@ts-ignore
  let dataUpload = dataAtual.toLocaleDateString("pt-BR", options);
  dataUpload = dataUpload.split("/").reverse().join("-");

  const param: iRegistrarDocumentoAusencia = {
    nomeDoDocumento: nomeDoDocumento,
    cpf: cpf,
    docPasta: tipoDocumento,
    dataPonto: dataDocArquivo,
    dataUpload: dataUpload,
    usuario: usuario,
    cnpj: globalState.empresa.CGC_EMPRESA,
  };

  try {
    state.inserirDadosDocumento = await gerenciarFolhaPontoDetalhesService.createRegistroDocumento(param);
    const id_documento = state.inserirDadosDocumento.id_doc_funcionario;

    Swal.fire({
      icon: "success",
      title: "Documento salvo com sucesso!",
      showConfirmButton: false,
      timer: 2500,
    });

    setFalta(dataDocArquivo, id_documento);
  } catch (error) {
    Swal.fire({
      icon: "error",
      text: "Ocorreu um erro ao inserir o documento.",
    });
  }
}

async function setFalta(dataDocArquivo, id_documento) {
  let cod_funcionario = props.dadosParaQrCode.cod_funcionario;
  let falta = props.dadosParaQrCode.falta;
  let justificativa = props.dadosParaQrCode.justificativaValor;
  let cid = props.dadosParaQrCode.cid;
  let tipoFalta = props.dadosParaQrCode.tipoFalta;
  console.log(cod_funcionario, falta, justificativa, cid, tipoFalta, dataDocArquivo, id_documento);

  const param: iRegistrarFalta = {
    cod_funcionario: cod_funcionario,
    falta: falta,
    justificativa: justificativa,
    cid: cid,
    tipoFalta: tipoFalta,
    dataDocArquivo: dataDocArquivo,
    id_documento: id_documento,
  };

  try {
    state.inserirJustificativa = await gerenciarFolhaPontoDetalhesService.setFalta(param);
    emit("fecharModalQrCode");
  } catch (error) {
    Swal.fire({
      icon: "error",
      text: "Ocorreu um erro ao inserir a falta.",
    });
  }

  state.loading = false;
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
            @change="uploadArquivoPeloBotao"
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
