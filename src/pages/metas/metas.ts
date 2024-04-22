import { mesesToSelect } from "@/constants/constants";
import { computed, reactive } from "vue";
import { iMesEAno, iMetaInserida, iMetaVendedor, iMetaMontador, iFuncionario } from "./interfaces";
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
    itemsPerPage: 50,
    search: "",
    opcaoMeta: 0,
    metaVendedores: <iMetaVendedor[]>[],
    metaMontadores: <iMetaMontador[]>[],
    funcionarios: <iFuncionario[]>[],
    modalDistribuirMetas: <iModalCreate>(<unknown>null),
    modalDistribuirMetasOpened: false,
    metaInserida: <iMetaInserida>{},
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
            align: 'center',
            value: (item: any) => utils.formatValor(item.PREVISAO)
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
    metaNaoSeAplica: "---",
    itensTipoCargo: [
        { title: 'Vendedores', value: 0 },
        { title: 'Montadores', value: 1 },
    ]
})

export const meses = mesesToSelect;

export const metas = computed(() => {

    if (state.opcaoMeta === 0) {
        return state.metaVendedores;
    } else {
        return state.metaMontadores;
    }

})

export const totalizadorMetas = computed(() => {
    let arrayMeta;
    let meta = 0;
    let metaAcumulada = 0;
    let metaDoDia = 0;
    let metaPrevisao = 0;
    let valorVendaPorDia = 0;
    let percentualMetaAcumulada = 0;
    let percentualMetaDoDia = 0;
    let percentualMetaPrevisao = 0;

    if (state.opcaoMeta === 0) {
        arrayMeta = state.metaVendedores;
    } else {
        arrayMeta = state.metaMontadores;
    }

    arrayMeta.forEach((item: iMetaVendedor | iMetaMontador) => {
        meta += item.VALOR_META || 0;
        metaAcumulada += item.VALOR_LIQUIDO || 0;
        metaDoDia += item.META_DIARIA || 0;
        metaPrevisao += item.PREVISAO || 0;
        valorVendaPorDia += item.VALOR_DIA || 0;
    });

    if (meta > 0) {
        percentualMetaAcumulada = parseFloat(((metaAcumulada / meta) * 100).toFixed(1));
        percentualMetaDoDia = parseFloat(((valorVendaPorDia / metaDoDia) * 100).toFixed(1));
        percentualMetaPrevisao = parseFloat(((metaPrevisao / meta) * 100).toFixed(1));
    }

    return { meta, metaAcumulada, metaDoDia, metaPrevisao, percentualMetaAcumulada, percentualMetaDoDia, percentualMetaPrevisao };
});


export const actions = {

    async init() {
        state.loading = true;
        actions.createModal();
        await actions.getMetasVendedores(state.mes, state.ano);
        await actions.getMetasMontadores(state.mes, state.ano);
        state.loading = false;
    },

    createModal() {
        state.modalDistribuirMetas = new xModal.create({
            height: 680,
            width: 1280,
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

    async inserirMeta(dadosParaInserirMeta: { funcionario: iFuncionario, valorMeta: number }) {
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
                await actions.getMetasMontadores(state.mes, state.ano)
            }

            if (state.opcaoMeta === 0) {
                await actions.getMetasVendedores(state.mes, state.ano)
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

    async getMetasVendedores(mes: number, ano: number) {
        state.loading = true;
        const param: iMesEAno = {
            mes: mes,
            ano: ano,
        }

        try {
            state.metaVendedores = await metasService.getMetasVendedores(param);
            state.totalItems = state.metaVendedores.length

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
            state.metaMontadores = Object.values(state.metaMontadores);
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

    async getMetas() {
        await actions.getMetasVendedores(state.mes, state.ano);
        await actions.getMetasMontadores(state.mes, state.ano);
    },

    async distribuirMetas(mes: number, ano: number) {

        if (state.funcionarios.length === 0) {
            await actions.getFuncionarios(mes, ano);
        }
        state.modalDistribuirMetas.open();
    }
}
