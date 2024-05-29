<template>
  <div class="container-nota">
    <div class="nota pa-2">
      <span class="nota__text">nota nota nota nota nota nota nota nota nota nota nota nota nota </span>
    </div>
  </div>
  <div class="container-msg-enviada">
    <div class="msg-enviada">
      <strong class="msg-enviada__user px-2 pb-1">VINICIUS M</strong>
      <div class="msg-enviada-foto px-2"
        ><img
          src="https://api.contentstack.io/v2/assets/575e4d1c0342dfd738264a1f/download?uid=bltada7771f270d08f6"
          class="msg-enviada-foto__img"
      /></div>
      <span class="msg-enviada__hora px-2">12:00</span>
    </div>
  </div>
  <div class="container-msg-recebida">
    <div class="msg-recebida">
      <div class="msg-recebida-foto px-2"
        ><img
          src="https://www.researchgate.net/publication/353422038/figure/fig2/AS:1048906112700416@1627090113328/Image-7-4-3-2-5-9-3-11-45-3-0-2-4-0-1-7.ppm"
          alt=""
          class="msg-recebida-foto__img"
      /></div>
      <span class="msg-recebida__hora px-2">12:00</span>
    </div>
  </div>
  <div class="container-msg-recebida">
    <div class="msg-recebida">
      <span class="msg-recebida__textMsg px-2"> Olá bem vindo a real acessórios! A sua loja de autopeças. </span>
      <span class="msg-recebida__hora px-2">12:00</span>
    </div>
  </div>
  <div class="container-msg-enviada">
    <div class="msg-enviada">
      <strong class="msg-enviada__user px-2 pb-1">VINICIUS M</strong>
      <span class="msg-enviada__textMsg px-2"> Olá bem vindo a real acessórios! A sua loja de autopeças. </span>
      <span class="msg-enviada__hora px-2">12:00</span>
    </div>
  </div>
  <div class="chip-data">
    <span class="chip-data__content px-2 py-1">28/05/2024</span>
  </div>
</template>

<style scoped>
.chip-data {
  display: flex;
  justify-content: center;
  width: 100%;
}

.chip-data__content {
  background-color: #233142;
  color: #f2f2f2;
  border-radius: 8px;
}

.container-msg-enviada {
  display: flex;
  justify-content: end;
  width: 100%;
}

.msg-enviada {
  border-radius: 8px 0px 0px 0px;
  border-right: 10px solid transparent;
  border-top: 8px solid #dcf7c5;
  display: flex;
  align-items: end;
  flex-direction: column;
}

.msg-enviada__user {
  font-size: 12px;
  color: #5585b5;
  background-color: #dcf7c5;
  width: 100%;
  text-align: start;
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
  border-radius: 0px 0px 8px 8px;
}

.container-msg-recebida {
  display: flex;
  justify-content: start;
  width: 100%;
}

.msg-recebida {
  background-color: transparent;
  border-radius: 0px 8px 0px 0px;
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
  border-radius: 0px 0px 8px 8px;
}

.msg-enviada-foto {
  background-color: #dcf7c5;
}

.msg-enviada-foto__img {
  width: 250px;
  height: 200px;
}

.msg-recebida-foto {
  background-color: #f2f2f2;
}

.msg-recebida-foto__img {
  width: 250px;
  height: 200px;
}

.container-nota {
  width: 100%;
  display: flex;
  justify-content: center;
}

.nota {
  background-color: #f8f398;
  flex-direction: column;
  display: flex;
  max-width: 300px;
  text-align: center;
}
</style>
