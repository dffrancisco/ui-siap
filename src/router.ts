import { createRouter, createWebHashHistory } from "vue-router";
import auth from "./ts/auth";
import storeLogin from "./pages/login/login";

//@ts-ignore
import routes from "virtual:generated-pages";
import axios from "axios";
import mixpanel from "@/plugins/mixpanel";

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});


router.beforeEach((to, from, next) => {

    // console.log(to);

    if (to.query.chave != undefined) {
        // console.log(to.query.chave);
        sessionStorage.setItem(
            storeLogin.state.nameStorage,
            JSON.stringify({ token: to.query.chave })
        );
        storeLogin.state.auth == true
        axios.defaults.headers.common["Authorization"] = to.query.chave;
        storeLogin.actions.setAuth(true);
        next();
    } else {
        auth();
        if (to.name !== "login" && storeLogin.state.auth == false)
            next({ path: "login" });
        else if (to.name == "login" && storeLogin.state.auth == true)
            next({ path: "home" });
        else next();
    }
});

router.afterEach((to) => {
    mixpanel.track("Página Visitada", { page: to.fullPath });
});

export default router;