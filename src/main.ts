import axios from "axios";
import App from './App.vue';
import router from "./router";
import { createApp } from 'vue';
import { Buffer } from "buffer";
import vuetify from "./plugins/vuetify";
import Maska from "maska";
import VueMask from "@devindex/vue-mask";
import money, { Money3Directive } from 'v-money3'
import VueApexCharts from "vue3-apexcharts";
import VuePhotoPreview, { PhotoProvider, PhotoConsumer } from 'vue3-photo-preview'

import config from "./ts/config";
import { setupInterceptorsTo } from "./pages/login/interceptor";
import disableAutocomplete from "./plugins/disableAutocomplete/disableAutocomplete";
import mixpanel from "@/plugins/mixpanel/";

const app = createApp(App)

setupInterceptorsTo(axios);

const pluginOptions = {
    /* see config reference */
    globalOptions: { currency: 'null', locale: 'undefined', autoDecimalDigits: true },
}

axios.defaults.baseURL = config.SERVER + ":" + config.PORT

//@ts-ignore
window.Buffer = Buffer;

app.use(vuetify)
app.use(VueMask);
app.use(Maska);
app.use(money)
app.use(router)
app.use(VueApexCharts);
app.use(VuePhotoPreview)
app.use(disableAutocomplete)

app.directive('money3', Money3Directive)

app.config.globalProperties.axios = axios;
app.config.globalProperties.$mixpanel = mixpanel;

app.mount('#app')

