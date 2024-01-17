import { computed, reactive } from 'vue'
import Swal from 'sweetalert2';
import { iAniversariante } from './interface';
import entregarReceberService from './services/aniversariantes.service';
import moment from 'moment';

export const state = reactive(({
    mes: parseInt(moment().format("M")),
    aniversariantes: <iAniversariante[]>[],
    loading: false,
}))

export const aniversariantesPorSemana = computed(() => {
    const semanas = {};

    state.aniversariantes.forEach(aniversariante => {
        const ano = moment().format('YYYY');

        //@ts-ignore
        const semana = moment({ year: ano, month: state.mes - 1, day: aniversariante.DIA }).isoWeek();


        if (!semanas[semana]) {
            semanas[semana] = []
        }

        semanas[semana].push(aniversariante);
    })

    return semanas;
})

export const semanasComAniversariantes = computed(() => {
    return Object.keys(aniversariantesPorSemana.value);
})

export const actions = {

    async getAniversariantesMes() {

        try {
            state.loading = true;
            state.aniversariantes = await entregarReceberService.getAniversariantesMes(state.mes)
            state.loading = false;
        } catch (error) {
            state.loading = false;
            Swal.fire({
                icon: 'error',
                text: 'Ocorreu um erro ao buscar os aniversariantes'
            })
        }
    },

    getFotoAniversarianteURL(cpf: string) {
        if (!cpf) {
            return "";
        }

        const cpfSanitizado = cpf.replaceAll('.', '').replaceAll('-', '');
        return `http://www.reallatas.com.br/foto_funcionarios/${cpfSanitizado}.jpg`
    },

    async init() {
        state.loading = true;

        await actions.getAniversariantesMes();

        state.loading = false;
    }

}

export default { state, actions }