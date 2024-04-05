import { mesesToSelect } from "@/constants/constants";
import { computed, reactive } from "vue";


export const state = reactive({
    mes: new Date().getMonth() + 1,
    ano: new Date().getFullYear(),
    loading: false,
})

export const meses = mesesToSelect;

export const anos = computed(() => {
    const anosArray: number[] = [];
    const anoAtual = new Date().getFullYear();

    for (let i = 0; i < 10; i++) {
        const ano = anoAtual - 9 + i;
        anosArray.push(ano);
    }

    return anosArray;
});