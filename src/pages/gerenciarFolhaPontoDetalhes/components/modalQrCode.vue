<script setup lang="ts">
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
    // img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// const modalQrCode = () => {

// $("#modalQrcodeDocumento").mofo({
//     width: 400,
//     height: 425,
//     title: "Cadastro de Documentos",
//     open: function () {

//         let tipoDocumento = $("#penalidades").val()
//         let cpf = $('#cpf').val()
//         let usuario = nome;
//         let nomeFunc = $('[name="LOGIN"]').val();

//         if (tipoDocumento == '' || null) {
//             tipoDocumento = $("#documentos").val()
//         }

//         function getValorData(id) {
//             return $('#' + id).val();
//         }

//         let dataArquivos = [];
//         let dataDocArquivo = "";

//         for (let input of document.querySelectorAll('input[type="date"]')) {
//             dataArquivos.push(getValorData(input.id));
//         }

//         if (dataArquivos.length) {
//             dataDocArquivo = dataArquivos.join(', ');
//         } else {
//             show("Nenhum elemento de data foi selecionado.");
//         }

//         dataDocArquivo = dataDocArquivo.trim().replace(/,/g, ' ');
//         let partesData = dataDocArquivo.split('-');

//         if (partesData.length === 3) {
//             dataDocArquivo = partesData[0] + '-' + partesData[1] + '-' + partesData[2];
//         }

//         dataDocArquivo = dataDocArquivo.replace(/\s+/g, '').replace(/\./g, '');

//         setTimeout(() => {

//             let url = 'http://192.168.100.60/siap+/funcionario_doc_imagem/?chave=';

//             let chave = gerarChave(cpf, tipoDocumento, usuario, nomeFunc, dataDocArquivo)

//             $("#qr-generate").html('');

//             $("#qr-generate").css({
//                 width: "200",
//                 height: "200",
//                 marginLeft: "20",
//                 marginTop: "4",
//             });

//             $("#qr-generate").qrcode({
//                 width: "200",
//                 height: "200",
//                 text: url + chave,
//             });

//             // Inicie o intervalo para verificar arquivos periodicamente após algum tempo
//             setTimeout(() => {
//                 intervalId = setInterval(verificarArquivos, 2000);
//             }, 1000);
//         }, 300);

//         const verificarArquivos = function () {
//             cpf = cpf.replaceAll('.', '').replaceAll('-', '');

//             $.ajax({
//                 url: 'https://reallatas.com.br/doc_funcionario/getFiles.php',
//                 type: 'POST',
//                 dataType: 'json',
//                 data: {
//                     class: 'Files',
//                     call: 'getFilesTemp',
//                     param: {
//                         cpf: cpf,
//                         pasta: tipoDocumento,
//                     }
//                 },
//                 success: function (r) {
//                     if (r.length > 0) {

//                         let nomeDoDocumento = r[0].file
//                         // Exiba o arquivo encontrado e interrompa o intervalo
//                         exibirArquivo(nomeDoDocumento);
//                         clearInterval(intervalId);
//                     }
//                 }
//             });
//         };

//         const exibirArquivo = function (nomeDoDocumento) {

//             $("#qr-generate").empty();

//             const imgElement = $("<img>").attr("src", `https://reallatas.com.br/doc_funcionario/temp/${cpf}/${tipoDocumento}/${nomeDoDocumento}`);

//             imgElement.css({
//                 width: "200px",
//                 height: "200px",
//                 objectFit: "cover",
//             });
//             $("#qr-generate").append(imgElement);

//             setTimeout(() => {
//                 $('#pnLoadDocumento').html('<div style="margin: 0 auto; padding-top: 5px; text-align: center">Salvando documento...<br><img src="img/ajax-loader.gif"/></div>');
//                 moverArquivoTemp(nomeDoDocumento);
//             }, 2000);

//         };

//         const moverArquivoTemp = function (nomeDoDocumento) {
//             $.ajax({
//                 url: 'https://reallatas.com.br/doc_funcionario/getFiles.php',
//                 type: 'POST',
//                 dataType: 'json',
//                 data: {
//                     class: 'Files',
//                     call: 'moverArquivoTemp',
//                     param: {
//                         cpf: cpf,
//                         pasta: tipoDocumento,
//                     }
//                 },
//                 success: function (rs) {
//                     if (rs.success) {
//                         insertInTable(rs, cpf.replaceAll('.', '').replaceAll('-', ''), tipoDocumento);

//                         penalidadesDocsFuncionarios.createRegistroDocumentos(nomeDoDocumento, tipoDocumento, dataDocArquivo, cpf);

//                         setTimeout(() => {
//                             $('#pnLoadDocumento').empty();
//                             $("#modalQrcodeDocumento").mofo('close');
//                             $("#qr-generate").empty();
//                             limparInputs()
//                         }, 4000);
//                     } else {
//                         show('Erro na operação.');
//                     }

//                 }
//             });
//         }
//     },
//     close: function () {
//         clearInterval(intervalId);
//         limparInputs();
//         chave = ''
//     },
// });

// }

// function gerarChave(cpf, tipoDocumento, usuario, nomeFunc, dataDocArquivo) {
// return util.base64_encode(`${cpf}|${tipoDocumento}|${usuario}|${nomeFunc}|${dataDocArquivo}`);
// }
</script>

<template>
  <div
    id="modalQrcodeDocumento"
    style="display: none"
  >
    <div class="row">
      <div
        class="col s6"
        style="margin-left: 70px; margin-top: 30px"
      >
        <div
          id="qr-generate"
          style="margin-top: 1rem; margin-bottom: 3rem; margin-left: 1rem"
        >
        </div>

        <div
          id="pnLoadDocumento"
          class="center-align"
        >
          <input
            type="file"
            name="file"
            id="file"
            class="btn-Frame-blue input-file"
            style="display: inline; margin-left: 70px"
            accept=".pdf, .jpg, .jpeg"
          />
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

<style scoped></style>
