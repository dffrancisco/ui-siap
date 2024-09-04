import { ixGridCreate } from "@/plugins/xGridV2";
import { reactive } from "vue";

export const state = reactive({
    loading: false,
    gridPrincipal: <ixGridCreate>{},
    search: ""
})

export const actions = {

}