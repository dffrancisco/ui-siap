import Swal from "sweetalert2";
import { reactive, computed } from "vue";
import whatsappService from "./services/whatsapp.service";
import { iConversaAberta, iUsuario } from "./interfaces";
import moment from "moment";

export const state = reactive({
    loading: false,
    usuarios: <iUsuario[]>[],
    conversasAbertas: <iConversaAberta[]>[],
})

export const actions = {
    async getUsuarios() {
        try {
            state.loading = true;
            state.usuarios = await whatsappService.getUsuarios();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: 'Ocorreu um erro ao buscar os usuários.',
            })
        } finally {
            state.loading = false;
        }
    },

    async getConversasAbertas() {
        try {
            state.loading = true;
            state.conversasAbertas = await whatsappService.getConversasAbertas();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: 'Ocorreu um erro ao buscar as conversas abertas.',
            })
        } finally {
            state.loading = false;
        }
    },

    async init() {
        await actions.getUsuarios();
        await actions.getConversasAbertas();
    },
}

export const computeds = {
    conversasAbertasPorUsuario: computed(() => {
        let usuarios: { [key: string]: iConversaAberta[] } = {}

        state.conversasAbertas.forEach(conversa => {
            if (!usuarios[conversa.assigned_user]) {
                usuarios[conversa.assigned_user] = []
            }

            usuarios[conversa.assigned_user].push(conversa);
        })

        return usuarios;
    }),

    conversasSemUsuario: computed(() => {
        let conversas: iConversaAberta[] = [];

        state.conversasAbertas.forEach(conversa => {
            if (!conversa.assigned_user) {
                conversas.push(conversa);
            }
        })

        return conversas;
    }),

    tempoEsperaMaisLongo: computed(() => {
        let maisLongo = 0;

        computeds.conversasSemUsuario.value.forEach(conversa => {
            let dataHoraAberto = moment(conversa.data_hora_aberto)
            let now = moment()

            let diff = now.diff(dataHoraAberto, 'minutes');
            if (diff > maisLongo) {
                maisLongo = diff;
            }
        })

        return whatsappService.formatarTempoEmMinutos(maisLongo)
    }),

    tempoMedioEsperaFila: computed(() => {
        let somaTempo = 0;

        computeds.conversasSemUsuario.value.forEach(conversa => {
            let dataHoraAberto = moment(conversa.data_hora_aberto)
            let now = moment()

            somaTempo = now.diff(dataHoraAberto, 'minutes');
        })

        let qtd = computeds.conversasSemUsuario.value.length;

        return whatsappService.formatarTempoEmMinutos(somaTempo / qtd)
    })
}

export default { state, actions }