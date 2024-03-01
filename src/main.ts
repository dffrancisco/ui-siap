import axios from "axios";
import App from './App.vue';
import router from "./router";
import { createApp } from 'vue';
import { Buffer } from "buffer";
import vuetify from "./plugins/vuetify";
import Maska from "maska";
import VueMask from "@devindex/vue-mask";
import money, { Money3Directive } from 'v-money3'

import config from "./ts/config";
import { setupInterceptorsTo } from "./pages/login/interceptor";

const app = createApp(App)

setupInterceptorsTo(axios);

axios.defaults.baseURL = config.SERVER + ":" + config.PORT

//@ts-ignore
window.Buffer = Buffer;

app.use(vuetify)
app.use(VueMask);
app.use(Maska);
app.use(money)
app.use(router)

app.directive('money3', Money3Directive)

app.config.globalProperties.axios = axios;
app.mount('#app')

