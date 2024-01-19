import { computed, nextTick, reactive } from "vue";
import { RouteLocationNormalizedLoaded } from "vue-router";
// import { useDate } from "vuetify/lib/framework.mjs";


export const state = reactive({
    loading: false,
    codFuncionario: 0,
    cpf: <string | null>null,
    mes: 1,
    ano: 2024
})

export const meses = computed(() => [
    { text: "Janeiro", value: 1 },
    { text: "Fevereiro", value: 2 },
    { text: "Março", value: 3 },
    { text: "Abril", value: 4 },
    { text: "Maio", value: 5 },
    { text: "Junho", value: 6 },
    { text: "Julho", value: 7 },
    { text: "Agosto", value: 8 },
    { text: "Setembro", value: 9 },
    { text: "Outubro", value: 10 },
    { text: "Novembro", value: 11 },
    { text: "Dezembro", value: 12 },
]);

export const anos = computed(() => {
    const anosArray: number[] = [];
    const anoAtual = new Date().getFullYear();

    for (let i = 0; i < 20; i++) {
        const ano = anoAtual - 10 + i;
        anosArray.push(ano);
    }

    return anosArray;
});

export const actions = {

    getFotoFuncionarioURL(cpf: string) {
        if (!cpf) {
            return "";
        }

        const cpfSanitizado = cpf.replaceAll('.', '').replaceAll('-', '');
        return `http://www.reallatas.com.br/foto_funcionarios/${cpfSanitizado}.jpg`

    },


    init(route: RouteLocationNormalizedLoaded) {
        nextTick(async () => {
            state.loading = true;

            state.codFuncionario = Number(route.query.cod_funcionario)
            state.cpf = String(route.query.cpf)
            state.mes = Number(route.query.mes)
            state.ano = Number(route.query.ano)

            console.log(state.codFuncionario, state.cpf, state.mes, state.ano);


            state.loading = false;
        })
    }
}

// export const calendario = {
//     data: () => ({
//         focus: '',
//         events: [],
//         colors: [
//             'blue',
//             'indigo',
//             'deep-purple',
//             'cyan',
//             'green',
//             'orange',
//             'grey darken-1',
//         ],
//         names: [
//             'Meeting',
//             'Holiday',
//             'PTO',
//             'Travel',
//             'Event',
//             'Birthday',
//             'Conference',
//             'Party',
//         ],
//     }),
//     mounted() {
//         const adapter = useDate()
//         this.fetchEvents({
//             start: adapter.startOfDay(adapter.startOfMonth(new Date())),
//             end: adapter.endOfDay(adapter.endOfMonth(new Date())),
//         })
//     },
//     methods: {
//         getEventColor(event) {
//             return event.color
//         },
//         fetchEvents({ start, end }) {
//             const events = []

//             const min = start
//             const max = end
//             const days = (max.getTime() - min.getTime()) / 86400000
//             const eventCount = this.rnd(days, days + 20)

//             for (let i = 0; i < eventCount; i++) {
//                 const allDay = this.rnd(0, 3) === 0
//                 const firstTimestamp = this.rnd(min.getTime(), max.getTime())
//                 const first = new Date(firstTimestamp - (firstTimestamp % 900000))
//                 const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000
//                 const second = new Date(first.getTime() + secondTimestamp)

//                 events.push({
//                     title: this.names[this.rnd(0, this.names.length - 1)],
//                     start: first,
//                     end: second,
//                     color: this.colors[this.rnd(0, this.colors.length - 1)],
//                     allDay: !allDay,
//                 })
//             }

//             this.events = events
//         },
//         rnd(a, b) {
//             return Math.floor((b - a + 1) * Math.random()) + a
//         },
//     },
// }

export default { state, actions, meses, anos }
