import { mesesToSelect } from "@/constants/constants";
import { computed, reactive } from "vue";
import { iMesEAno, iResponseFuncionarios, iResponseMetaInserida, iResponseMetasVendedoresEMontadores } from "./interfaces";
import Swal from "sweetalert2";
import metasService from "./services/metas.service"
import xModal, { iModalCreate } from "@/plugins/xModal/xModal";
import utils from "@/ts/utils";
import moment from "moment";


export const state = reactive({
    mes: new Date().getMonth() + 1,
    ano: moment().year(),
    loading: false,
    totalItems: 0,
    itemsPerPage: 10,
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
    ],
    metaNaoSeAplica: "Não se aplica."
})

export const meses = mesesToSelect;

// export const anos = computed(() => {
//     const anosArray: number[] = [];
//     const anoAtual = new Date().getFullYear();

//     for (let i = 0; i < 10; i++) {
//         const ano = anoAtual - 9 + i;
//         anosArray.push(ano);
//     }

//     return anosArray;
// });


export const vendedorOuMontador = [
    { title: 'Vendedores', value: 0 },
    { title: 'Montadores', value: 1 },
]

export const totalizadorMetas = computed(() => {
    let arrayMeta;
    let meta = 0;
    let metaAcumulada = 0;
    let metaDoDia = 0;
    let metaPrevisao = 0;
    let percentualMetaAcumulada = 0;
    let percentualMetaDoDia = 0;
    let percentualMetaPrevisao = 0;

    if (state.opcaoMeta === 0) {
        arrayMeta = state.vendedoresArray;
    } else {
        arrayMeta = state.montadoresArray;
    }

    arrayMeta.forEach((item) => {
        meta += item.VALOR_META || 0;
        metaAcumulada += item.VALOR_TOTAL || 0;
        metaDoDia += item.META_DIARIA || 0;
        metaPrevisao += item.PREVISAO || 0;
    });

    if (meta > 0) {
        percentualMetaAcumulada = parseFloat(((metaAcumulada / meta) * 100).toFixed(1));
        percentualMetaDoDia = parseFloat(((metaDoDia / meta) * 100).toFixed(1));
        percentualMetaPrevisao = parseFloat(((metaPrevisao / meta) * 100).toFixed(1));
    }

    return { meta, metaAcumulada, metaDoDia, metaPrevisao, percentualMetaAcumulada, percentualMetaDoDia, percentualMetaPrevisao };
});


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

    atualizarOpcaoMeta(opcaoCargoEscolhido: number) {
        state.opcaoMeta = opcaoCargoEscolhido;
    },

    async inserirMeta(dadosParaInserirMeta: { funcionario: iResponseMetasVendedoresEMontadores, valorMeta: number }) {
        state.loading = true;

        const param = {
            cargo: state.opcaoMeta,
            cod_funcionario: dadosParaInserirMeta.funcionario.COD_FUNCIONARIO,
            valorMeta: utils.formatValorUSA(dadosParaInserirMeta.valorMeta.toString()),
            mes: state.mes,
            ano: state.ano
        }

        try {
            state.metaInserida = await metasService.inserirMeta(param);

            if (state.opcaoMeta === 1) {

                setTimeout(() => {
                    actions.atualizarDadosMetasMontadores()
                }, 1000)
            }

            if (state.opcaoMeta === 0) {

                setTimeout(() => {
                    actions.atualizarDadosMetasVendedores()
                }, 1000)
            }

            Swal.fire({
                icon: "success",
                title: "Meta inserida com sucesso.",
                showConfirmButton: false,
                timer: 2000,
            });

        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Ocorreu um erro ao inserir a meta do funcionario.",
            });
        } finally {
            state.loading = false;
        }

    },

    async atualizarDadosMetasVendedores() {
        await Promise.all([
            actions.getMetasVendedores(state.mes, state.ano)
        ]);
    },


    async atualizarDadosMetasMontadores() {
        await Promise.all([
            actions.getMetasMontadores(state.mes, state.ano)
        ]);
    },


    async getMetasVendedores(mes: number, ano: number) {
        state.loading = true;
        const param: iMesEAno = {
            mes: mes,
            ano: ano,
        }

        try {
            state.metaVendedores = await metasService.getMetasVendedores(param);
            state.vendedoresArray = Object.values(state.metaVendedores);
            state.totalItems = state.vendedoresArray.length

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
            state.metaMontadores = await metasService.getMetasMontadores(param);
            state.montadoresArray = Object.values(state.metaMontadores);
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Ocorreu um erro ao buscar as metas dos montadores.",
            });
        } finally {
            state.loading = false;
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

        if (!state.funcionarios || !Array.isArray(state.funcionarios) || state.funcionarios.length === 0) {
            await actions.getFuncionarios(mes, ano);
        }

        await actions.getMetasVendedores(state.mes, state.ano);
        await actions.getMetasMontadores(state.mes, state.ano);

        state.modalDistribuirMetas.open();
    },

    formatPrevisao(previsao) {
        return previsao === 0 ? 'Não se aplica' : previsao;
    },

}
