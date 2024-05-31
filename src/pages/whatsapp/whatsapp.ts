import Swal from "sweetalert2";
import { reactive, computed } from "vue";
import whatsappService from "./services/whatsapp.service";
import { iConversaAberta, iUsuario, iDadosContatos } from "./interfaces";
import moment from "moment";
import router from "@/router";

export const state = reactive({
    loading: false,
    usuarios: <iUsuario[]>[],
    conversasAbertas: <iConversaAberta[]>[],
    lastUpdate: '00:00:00',
    interval: undefined,
    modalUltimasConversasOpened: false,
    msgsCallbell: <iDadosContatos>{}
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
            state.lastUpdate = moment().format("HH:mm:ss");
        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: 'Ocorreu um erro ao buscar as conversas abertas.',
            })
        } finally {
            state.loading = false;
        }
    },

    async getMsgsCallbell(conversa: iConversaAberta) {
        try {
            state.loading = true;
            const data = await whatsappService.getMsgsCallbell(conversa.uuid_contato);

            state.msgsCallbell = {
                telefone: conversa.telefone,
                nome: conversa.nome,
                uuid_contato: conversa.uuid_contato,
                msgs: data
            }

        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: 'Ocorreu um erro ao buscar as mensagens.',
            })
        } finally {
            state.loading = false;
        }
    },

    async atualizarDados() {
        await actions.getConversasAbertas();
    },

    formatarTempoEmMinutos(tempo: number) {
        return whatsappService.formatarTempoEmMinutos(tempo);
    },

    redirectToWhatsappPerformance() {
        router.push('/whatsappPerformance');
    },

    async openModalUltimasConversas(conversa: iConversaAberta) {
        await actions.getMsgsCallbell(conversa)
        state.modalUltimasConversasOpened = true;
    },

    closeModalUltimasConversas() {
        state.modalUltimasConversasOpened = false;
    },

    async fecharConversa() {
        await actions.atualizarDados()
        state.modalUltimasConversasOpened = false;
    },

    async init() {
        await actions.getUsuarios();
        await actions.getConversasAbertas();

        const TRINTA_SEGUNDOS = 30000;
        state.interval = setInterval(async () => {
            await actions.atualizarDados();
        }, TRINTA_SEGUNDOS);
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

        return maisLongo
    }),

    tempoMedioEsperaFila: computed(() => {
        let somaTempo = 0;

        computeds.conversasSemUsuario.value.forEach(conversa => {
            let dataHoraAberto = moment(conversa.data_hora_aberto)
            let now = moment()

            somaTempo += now.diff(dataHoraAberto, 'minutes');
        })

        let qtd = computeds.conversasSemUsuario.value.length;

        if (qtd == 0) {
            return 0;
        }

        return somaTempo / qtd
    })
}

export default { state, actions }