import { mesesToSelect } from "@/constants/constants";
import { computed, reactive } from "vue";
import { iMesEAno, iResponseFuncionarios, iResponseGetMetasVendedores, iResponseMetaInserida } from "./interfaces";
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
    metaVendedores: {},
    metaMontadores: <iResponseGetMetasVendedores>{},
    montadoresArray: [] as any,
    funcionarios: <iResponseFuncionarios>{},
    modalDistribuirMetas: <iModalCreate>(<unknown>null),
    modalDistribuirMetasOpened: false,
    metaInserida: <iResponseMetaInserida>{}
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

    async init() {
        state.loading = true;
        actions.modal();
        await actions.getMetasVendedores(state.mes, state.ano);
        await actions.getMetasMontadores(state.mes, state.ano);
        state.loading = false;
    },

    modal() {
        state.modalDistribuirMetas = new xModal.create({
            height: 680,
            width: 1266,
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

    async inserirMeta(dadosParaInserirMeta: { funcionario: iResponseFuncionarios, valorMeta: number }) {
        state.loading = true;

        const param = {
            cargo: dadosParaInserirMeta.funcionario.CARGO,
            cod_funcionario: dadosParaInserirMeta.funcionario.COD_FUNCIONARIO,
            valorMeta: dadosParaInserirMeta.valorMeta,
            mes: state.mes,
            ano: state.ano
        }

        try {
            state.metaInserida = await metasService.inserirMeta(param);
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Ocorreu um erro ao inserir a meta do funcionario.",
            });
        } finally {
            state.loading = false;
        }


    },

    async atualizarDadosMetas() {
        await actions.getMetasVendedores(state.mes, state.ano);
        await actions.getMetasMontadores(state.mes, state.ano);
    },

    async getMetasVendedores(mes: number, ano: number) {
        // state.loading = true;


        const param: iMesEAno = {
            mes: mes,
            ano: ano,
        }

        try {
            state.metaVendedores = await metasService.getMetasVendedores(param);
            console.log(state.metaVendedores);

        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Ocorreu um erro ao buscar as metas dos vendedores.",
            });
        }
        // finally {
        //     state.loading = false;
        // }
    },

    async getMetasMontadores(mes: number, ano: number) {
        // state.loading = true;

        const param: iMesEAno = {
            mes: mes,
            ano: ano,
        }
        try {
            state.metaMontadores = await metasService.getMetasMontadores(param);

            state.montadoresArray = Object.values(state.metaMontadores);


            // state.metaMontadores = data.COD_FUNCIONARIO((montador: iResponseGetMetasVendedores) => ({
            //     ...montador,
            // }))
            console.log(state.metaMontadores);

        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Ocorreu um erro ao buscar as metas dos montadores.",
            });
        }
        // finally {
        //     state.loading = false;
        // }
    },

    async getFuncionarios(mes: number, ano: number) {
        state.loading = true;

        const param: iMesEAno = {
            mes: mes,
            ano: ano,
        }
        try {
            state.funcionarios = await metasService.getFuncionarios(param);
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Ocorreu um erro ao buscar os funcionários.",
            });
        } finally {
            state.loading = false;
        }
    },

    async onClickMetas() {
        if (state.opcaoMeta === 'Vendedores') {
            await actions.getMetasVendedores(state.mes, state.ano);
        } else {
            await actions.getMetasMontadores(state.mes, state.ano);
        }
    },



    async distribuirMetas(mes: number, ano: number) {
        state.loading = true;

        // Verifica se a lista de funcionários está vazia ou não foi definida
        if (!state.funcionarios || !Array.isArray(state.funcionarios) || state.funcionarios.length === 0) {

            await actions.getFuncionarios(mes, ano);
        }

        state.modalDistribuirMetas.open();

        state.loading = false;
    }

}
