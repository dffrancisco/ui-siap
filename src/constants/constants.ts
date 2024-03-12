import { computed } from "vue";

export const mesesToSelect = [
    { title: "Janeiro", value: 1 },
    { title: "Fevereiro", value: 2 },
    { title: "Março", value: 3 },
    { title: "Abril", value: 4 },
    { title: "Maio", value: 5 },
    { title: "Junho", value: 6 },
    { title: "Julho", value: 7 },
    { title: "Agosto", value: 8 },
    { title: "Setembro", value: 9 },
    { title: "Outubro", value: 10 },
    { title: "Novembro", value: 11 },
    { title: "Dezembro", value: 12 },
];

export const anosToSelect = computed(() => {
    const anosArray: number[] = [];
    const anoAtual = new Date().getFullYear();

    for (let i = 0; i < 20; i++) {
        const ano = anoAtual - 10 + i;
        anosArray.push(ano);
    }

    return anosArray;
});
