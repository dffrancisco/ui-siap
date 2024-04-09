import { nextTick, onMounted, reactive, ref, watch } from "vue";
import metasService from "../services/metas.service";
import { iMesEAno, iResponseMetasMontadores, iResponseMetasVendedores } from "../interfaces";
import Swal from "sweetalert2";
import xModal, { iModalCreate } from "@/plugins/xModal/xModal";

export const setup = (props: any) => {

    const state = reactive({
        loading: false,
        mes: 0,
        ano: 0,
        isVendedoresSelected: true,
        isMontadoresSelected: false,
        modalAtribuirMetaIndividual: <iModalCreate>(<unknown>null),
        modalAtribuirMetaIndividualOpened: false,
        // vendedores: [],
        // montadores: [],
    })

    let vendedores = ref([]);
    let montadores = ref([]);

    watch(
        () => props.opened,

        () => {
            if (props.opened) {
                state.loading = true;
                vendedores.value = props.dadosParaDistribuirMetas.vendedores;
                montadores.value = props.dadosParaDistribuirMetas.montadores;
                state.mes = props.mesEAno.mes;
                state.ano = props.mesEAno.ano;
                state.loading = false;
            }

        }
    );

    const vendedorSelecionado = ref<iResponseMetasVendedores | null>(null);
    const montadorSelecionado = ref<iResponseMetasMontadores | null>(null);

    const atribuirMetaIndividual = (item: iResponseMetasVendedores | iResponseMetasMontadores) => {
        if ("ID_VENDEDOR" in item) {
            vendedorSelecionado.value = item;
            montadorSelecionado.value = null;
            state.modalAtribuirMetaIndividual.open();
        } else {
            montadorSelecionado.value = item;
            vendedorSelecionado.value = null;
            state.modalAtribuirMetaIndividual.open();
        }
    };

    onMounted(() => {
        nextTick(() => {
            actions.modal();
        });
    });

    const actions = {


        getFotoFuncionarioURL(cpf: string) {
            if (!cpf) {
                return "";
            }
            const cpfSanitizado = cpf.replaceAll(".", "").replaceAll("-", "");
            return `https://www.reallatas.com.br/_serverAPP/thumb.php?img=http://www.reallatas.com.br/foto_funcionarios/${cpfSanitizado}.jpg`;
        },

        selectVendedores() {
            if (!state.isVendedoresSelected) {
                state.isVendedoresSelected = true;
                state.isMontadoresSelected = false;
            }
            actions.getMetasVendedores(state.mes, state.ano)
        },

        selectMontadores() {
            if (!state.isMontadoresSelected) {
                state.isMontadoresSelected = true;
                state.isVendedoresSelected = false;
            }
            actions.getMetasMontadores(state.mes, state.ano)
        },

        async getMetasVendedores(mes: number, ano: number) {
            state.loading = true;


            const param: iMesEAno = {
                mes: mes,
                ano: ano,
            }

            try {
                //@ts-ignore
                vendedores.value = await metasService.getMetasVendedores(param);
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    text: "Ocorreu um erro ao buscar as metas dos vendedores.",
                });
            } finally {
                state.loading = false;
            }
        },

        async getMetasMontadores(mes: number, ano: number) {
            state.loading = true;

            const param: iMesEAno = {
                mes: mes,
                ano: ano,
            }
            try {
                //@ts-ignore
                montadores.value = await metasService.getMetasMontadores(param);
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    text: "Ocorreu um erro ao buscar as metas dos montadores.",
                });
            } finally {
                state.loading = false;
            }
        },

        modal() {
            state.modalAtribuirMetaIndividual = new xModal.create({
                width: 300,
                height: 330,
                el: "#modalAtribuirMetaIndividadual",
                theme: "xModal-bublue",
                onOpen: () => {
                    state.modalAtribuirMetaIndividualOpened = true;
                },
                onClose: () => {
                    state.modalAtribuirMetaIndividualOpened = false;
                },
            });
        },

    }

    return {
        actions,
        state,
        vendedores,
        montadores,
        vendedorSelecionado,
        montadorSelecionado,
        atribuirMetaIndividual
    }
}

