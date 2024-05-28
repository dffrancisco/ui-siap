<template>
  <v-card
    height="700"
    class="container-principal"
  >
    <div class="header px-3 pt-3 pb-2">
      <v-icon color="primary">mdi-chevron-left mdi-36px</v-icon>
      <div class="container-contato">
        <strong>FULANO DE TAL</strong>
        <span class="container-contato__numero">+55 (61) 99999-9999</span>
      </div>
    </div>

    <div class="container-chat pt-2">
      <div class="container-msgs px-2 ga-2">
        <div class="container-msg-recebida">
          <div class="msg-recebida">
            <span class="msg-recebida__textMsg px-2">
              Olá bem vindo a real acessórios! A sua loja de autopeças.
            </span>
            <span class="msg-recebida__hora px-2">12:00</span>
          </div>
        </div>

        <div class="container-msg-enviada">
          <div class="msg-enviada">
            <span class="msg-enviada__textMsg px-2">
              Olá bem vindo a real acessórios! A sua loja de autopeças.
            </span>
            <span class="msg-enviada__hora px-2">12:00</span>
          </div>
        </div>
      </div>
    </div>
  </v-card>
</template>

<style scoped>
.container-principal {
  background-color: #f2f2f2;
}

.header {
  display: flex;
  align-items: center;
}

.container-contato {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
}

.container-contato__numero {
  font-size: 10px;
  color: gray;
}

.container-chat {
  background-image: url("https://s3-alpha-sig.figma.com/img/351a/cdb5/ea7901e17f7cb0d61068f0f1d8f1f95d?Expires=1717977600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=on1xqvitfl9vfI6Cvn7iCm4m78OlcQC4Dhw~lsSn~lPAnos8sqJ17hSvLRjAXTVGJA~YfpQu7e3WHGixHHLFmUY5jH51O4ExHlPkMxmxtfV8Zp0~9uMUIFscKjq0U3uhxrlpDvbezV25RsXPXOO1ylfEwiawinSnkuRqf0dD4ILidDePzZgvkpmW0zV1WgOodmkEUBa8Ao46mT4YecCXUMWmnfu24trAn95HDgJ4d06ALi9tq0h5pr50fgWI2Nak9C04aYs-o--vGQR7ZtdsYYhgnpeLPuT7yXC2qzI2rNciAnJctOQlQrteH0f4jVuz2k0ajnSg4TUFz4e-nP-OQg__") !important;
  background-size: cover;
  flex-grow: 1;
}

.container-msgs {
  display: flex;
  align-items: end;
  flex-direction: column-reverse;
  overflow: auto;
  max-height: 620px;
}

.container-msg-enviada {
  display: flex;
  justify-content: end;
  width: 100%;
}

.msg-enviada {
  background-color: transparent;
  border-radius: 8px 0px 8px 8px;
  border-right: 10px solid transparent;
  border-top: 8px solid #dcf7c5;
  display: flex;
  align-items: end;
  flex-direction: column;
}

.msg-enviada__textMsg {
  font-size: 14px;
  max-width: 250px;
  text-align: justify;
  background-color: #dcf7c5;
}

.msg-enviada__hora {
  font-size: 10px;
  color: gray;
  background-color: #dcf7c5;
  width: 100%;
  text-align: end;
}

.container-msg-recebida {
  display: flex;
  justify-content: start;
  width: 100%;
}

.msg-recebida {
  background-color: transparent;
  border-radius: 0px 8px 8px 8px;
  border-left: 10px solid transparent;
  border-top: 8px solid #f2f2f2;
  display: flex;
  align-items: end;
  flex-direction: column;
}

.msg-recebida__textMsg {
  font-size: 14px;
  max-width: 250px;
  text-align: justify;
  background-color: #f2f2f2;
}

.msg-recebida__hora {
  font-size: 10px;
  color: gray;
  background-color: #f2f2f2;
  width: 100%;
  text-align: end;
}
</style>
