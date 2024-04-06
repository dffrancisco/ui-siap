import { mesesToSelect } from "@/constants/constants";
import { computed, reactive } from "vue";
import { iMesEAno } from "./interfaces";
import Swal from "sweetalert2";
import metasService from "./services/metas.service"
import xModal, { iModalCreate } from "@/plugins/xModal/xModal";


export const state = reactive({
    mes: new Date().getMonth() + 1,
    ano: new Date().getFullYear(),
    loading: false,
    totalItems: 0,
    itemsPerPage: 5,
    search: (""),
    opcaoMeta: "Vendedores",
    vendedores: {},
    modalDistribuirMetas: <iModalCreate>(<unknown>null),
    modalDistribuirMetasOpened: false,
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

export const vendedorOuMontador = {
    options: [
        { title: 'Vendedores', value: 'Vendedores' },
        { title: 'Montadores', value: 'Montadores' },
    ],
};

export const headers = [
    {
        title: "Funcionário",
        key: "FUNCIONARIO",
        sortable: true,
    },
    {
        title: "Meta",
        key: "META",
        sortable: true,
    },
    {
        title: "Atingido",
        key: "ATINGIDO",
        sortable: true,
    },
    {
        title: "Previsão",
        key: "PREVISAO",
        sortable: true,
    },
    {
        title: "Média Diária",
        key: "MEDIA_DIARIA",
        sortable: true,
    },
    {
        title: "Progresso",
        key: "PROGRESSO",
        sortable: true,
    },
];

export const actions = {

    async init(mes: number, ano: number) {
        state.loading = true;
        actions.modal();

        await actions.getMetasVendedores(mes, ano);

        state.loading = false;
    },

    modal() {
        state.modalDistribuirMetas = new xModal.create({
            height: 750,
            width: 1100,
            el: "#modalDistribuirMetas",
            theme: "xModal-bublue",
            onOpen: () => {
                state.modalDistribuirMetasOpened = true;
            },
            onClose: () => {
                state.modalDistribuirMetasOpened = false;
            },
        });
    },

    async getMetasVendedores(mes: number, ano: number) {
        state.loading = true;


        const param: iMesEAno = {
            mes: mes,
            ano: ano,
        }

        try {
            state.vendedores = await metasService.getMetasVendedores(param);
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Ocorreu um erro ao buscar as metas dos vendedores.",
            });
        } finally {
            state.loading = false;
        }
    },

    distribuirMetas() {
        state.modalDistribuirMetas.open();
    }



}
