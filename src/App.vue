<script setup lang="ts">
import { nextTick, ref } from "vue";
import ReloadPWA from "./components/ReloadPWA.vue";
import { useTheme } from "vuetify";
import xCalk from "@/plugins/xCalk/xCalk.js";
import globalState from "@/store/globalState";
import xModal from "./plugins/xModal/xModal";
import xGridV2 from "./plugins/xGridV2";
import $ from "jquery";
import globalActions from "./store/globalActions";

globalState.calc = new xCalk();
globalState.theme = useTheme();

xGridV2.setTheme("x-whiteV2");
xModal.setTheme("xModal-xAtila");

let install = ref(false);
let deferredPrompt: null;

nextTick(() => {
  window.addEventListener("appinstalled", () => {
    console.log("a2hs installed, --");
  });

  if (
    window.matchMedia("(display-mode: standalone)").matches ||
    //@ts-ignore
    window.navigator.standalone === true
  ) {
    install.value = false;
    console.log("display-mode is standalone");
  }

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    //@ts-ignore
    deferredPrompt = e;
    install.value = true;
    console.log("beforeinstallprompt");

    setTimeout(() => {
      install.value = false;
    }, 10000);
  });

  //@ts-ignore
  window.$ = $;

  // setTimeout(() => {
  //   $(document).find(".ss").addClass("btnClear");
  //   $(document)
  //     .on("input", ".btnClear", function () {
  //       var tog = this.value ? "addClass" : "removeClass";
  //       if (this.value.length == 1)
  //         if ($(this).css("text-align") == "right") $(this)[tog]("x-l");
  //         else $(this)[tog]("x-r");
  //     })
  //     .on("mousemove", ".x-r, .x-l", function (e) {
  //       if ($(this).hasClass("x-r"))
  //         var tog =
  //           this.offsetWidth - 20 <
  //           e.clientX - this.getBoundingClientRect().left
  //             ? "addClass"
  //             : "removeClass";
  //       else
  //         var tog =
  //           e.clientX - this.getBoundingClientRect().left < 20
  //             ? "addClass"
  //             : "removeClass";
  //       $(this)[tog]("onX");
  //     })
  //     .on("touchstart click", ".onX", function (ev) {
  //       let el = this;

  //       el.value = "";
  //       console.log(this);

  //       // $(this).removeClass("x-l x-r onX").val("");
  //       $(this).removeClass("x-l x-r onX");

  //       ev.preventDefault();
  //     })
  //     .on("focusout", ".btnClear", function () {
  //       $(this).removeClass("x-l x-r onX");
  //     })
  //     .on("focusin", ".btnClear", function () {
  //       if (!$(this).prop("readonly"))
  //         if ($(this).css("text-align") == "right")
  //           this.value ? $(this).addClass("x-l") : "";
  //         else this.value ? $(this).addClass("x-r") : "";
  //     });
  // }, 100);

  globalActions.setThemeComponents();
});

const installApp = () => {
  install.value = false;
  //@ts-ignore
  deferredPrompt.prompt();

  //@ts-ignore
  deferredPrompt.userChoice.then((choiceResult: any) => {
    if (choiceResult.outcome === "accepted") {
      console.log("User accepted the A2HS prompt");
    } else {
      console.log("User dismissed the A2HS prompt");
    }

    deferredPrompt = null;
  });
};
</script>

<template>
  <!-- <ReloadPWA /> -->

  <!-- <van-popup class="elevation-4" v-model:show="install" closeable close-icon-position="top-right" :overlay="false"
		round position="bottom" :style="{ height: '140px', maxWidth: '500px' }">
		<div class="ml-5 mr-5 mt-5">
			<h4 class="pt-4">Gostaria de instalar o vCaixa</h4>
		</div>
		<div class="ma-4">
			<van-button @click="installApp()" type="primary" size="large">Instalar</van-button>
		</div>
	</van-popup> -->
  <v-app>
    <!-- <v-app-bar></v-app-bar> -->
    <router-view></router-view>
  </v-app>
</template>

<style lang="scss">
@import "vuetify/styles";
@import "./plugins/xModal/xModal.css";
@import "./plugins/xGridV2/index.css";
@import "@mdi/font/css/materialdesignicons.css";
@import "./plugins/xCalk/style.css";
@import "./plugins/xMenu/xMenu.css";
@import "sweetalert2/src/sweetalert2.scss";
@import "@/assets/index.scss";
@import "animate.css";
@import "@/styles/global.scss";

#pnCalk .xModal-modal-content {
  margin: 0 !important;
  padding: 0 !important;
}

#pnCalk {
  top: 260px;
  left: 115px;
}
</style>
