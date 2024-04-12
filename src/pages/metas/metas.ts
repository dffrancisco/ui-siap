import { mesesToSelect } from "@/constants/constants";
import { computed, reactive } from "vue";
import { iMesEAno, iResponseFuncionarios, iResponseMetaInserida, iResponseMetasVendedoresEMontadores } from "./interfaces";
import Swal from "sweetalert2";
import metasService from "./services/metas.service"
import xModal, { iModalCreate } from "@/plugins/xModal/xModal";
import utils from "@/ts/utils";


export const state = reactive({
    mes: new Date().getMonth() + 1,
    ano: 2023,
    loading: false,
    totalItems: 0,
    itemsPerPage: 5,
    search: (""),
    opcaoMeta: 0,
    metaVendedores: <iResponseMetasVendedoresEMontadores>{},
    metaMontadores: <iResponseMetasVendedoresEMontadores>{},
    montadoresArray: [],
    vendedoresArray: [],
    funcionarios: <iResponseFuncionarios>{},
    modalDistribuirMetas: <iModalCreate>(<unknown>null),
    modalDistribuirMetasOpened: false,
    metaInserida: <iResponseMetaInserida>{},
    headers: <any>[
        {
            title: "Funcionário",
            key: "LOGIN",
            sortable: true,
        },
        {
            title: "Meta",
            key: "VALOR_META",
            sortable: true,
            align: 'center',
            value: (item: any) => utils.formatValor(item.VALOR_META)
        },
        {
            title: "Atingido",
            key: "ATINGIDO",
            sortable: true,
            align: 'center',
            value: (item: any) => utils.formatValor(item.ATINGIDO)
        },
        {
            title: "Previsão",
            key: "PREVISAO",
            sortable: true,
            align: 'center'
        },
        {
            title: "Média Diária",
            key: "MEDIA_DIARIA",
            sortable: true,
            align: 'center',
            value: (item: any) => utils.formatValor(item.MEDIA_DIARIA)
        },
        {
            title: "Progresso",
            key: "PROGRESSO",
            sortable: true,
            align: 'center'
        },
    ]
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


export const vendedorOuMontador = [
    { title: 'Vendedores', value: 0 },
    { title: 'Montadores', value: 1 },
]

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
        await Promise.all([
            actions.getMetasVendedores(state.mes, state.ano),
            actions.getMetasMontadores(state.mes, state.ano)
        ]);
    },

    async getMetasVendedores(mes: number, ano: number) {
        const param: iMesEAno = {
            mes: mes,
            ano: ano,
        }

        try {
            state.metaVendedores = await metasService.getMetasVendedores(param);

            state.vendedoresArray = Object.values(state.metaVendedores);
            // console.log(state.metaVendedores);

        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Ocorreu um erro ao buscar as metas dos vendedores.",
            });
        }
    },

    async getMetasMontadores(mes: number, ano: number) {
        const param: iMesEAno = {
            mes: mes,
            ano: ano,
        }
        try {
            state.metaMontadores = await metasService.getMetasMontadores(param);
            state.montadoresArray = Object.values(state.metaMontadores);

            // console.log(state.metaMontadores);

        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Ocorreu um erro ao buscar as metas dos montadores.",
            });
        }
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

        if (state.opcaoMeta === 0) {
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
    },

    formatPrevisao(previsao) {
        return previsao === 0 ? 'Não se aplica' : previsao;
    },

}
