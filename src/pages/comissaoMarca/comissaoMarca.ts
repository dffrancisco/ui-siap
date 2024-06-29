import moment from "moment";
import { computed, reactive } from "vue";
import { iFuncionario, iMarcas, iProdutos } from "./interfaces";
import Swal from "sweetalert2";
import comissaoMarcaService from "./services/comissaoMarca.service";
import xModal, { iModalCreate } from "@/plugins/xModal/xModal";

export const state = reactive({
    loading: false,
    totalItems: 0,
    itemsPerPage: 30,
    funcionarios: <iFuncionario[]>[],
    selectedFuncionario: <number | null>null,
    modalMarcas: <iModalCreate>{},
    modalMarcasOpened: false,
    marcas: <iMarcas[]>[],
    marcasEscolhidas: <iMarcas[]>[],
    modalProdutos: <iModalCreate>{},
    modalProdutosOpened: false,
    produtos: <iProdutos[]>[],
    dataInicial: moment().format('YYYY-MM-DD'),
    dataFinal: moment().format('YYYY-MM-DD'),
    inputDataInicial: <HTMLInputElement>{},
    inputDataFinal: <HTMLInputElement>{},
    headers: <any>[]
})

export const funcionariosOrdenados = computed(() => {
    let funcionariosArray = <iFuncionario[]>[];

    for (let indexFuncionario in state.funcionarios) {
        funcionariosArray.push(state.funcionarios[indexFuncionario]);
    }

    funcionariosArray.sort((funcionario1, funcionario2) => {
        return funcionario1.NOME_COMP > funcionario2.NOME_COMP ? 1 : -1;
    });

    return funcionariosArray;
});

export const dataHoje = moment().format('YYYY-MM-DD');

export const actions = {
    async init() {
        await actions.getFuncionarios()
        await actions.createModal()
    },

    createModal() {
        state.modalMarcas = new xModal.create({
            el: "#modalMarcas",
            height: 600,
            width: 800,
            title: 'Marcas - Fabricantes',
            theme: 'xModal-blue',
            onOpen: () => { state.modalMarcasOpened = true; },
            onClose: () => { state.modalMarcasOpened = false; },
        });

        state.modalProdutos = new xModal.create({
            el: "#modalProdutos",
            height: 600,
            width: 800,
            title: 'Itens - Produtos',
            theme: 'xModal-blue',
            onOpen: () => { state.modalProdutosOpened = true; },
            onClose: () => { state.modalProdutosOpened = false; },
        });
    },

    async getMarcas() {
        state.loading = true;
        if (state.marcas.length == 0) {

            try {
                const data = await comissaoMarcaService.getMarcas();
                state.marcas = data
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    text: "Erro ao buscar as marcas."
                });
                return;
            } finally {
                state.loading = false;
            }

        }
        state.modalMarcas.open();

        state.loading = false;
    },


    async getProdutos() {
        state.loading = true;

        const idsMarcasEscolhidas = state.marcasEscolhidas.map(marca => marca.ID_MARCA);

        console.log(idsMarcasEscolhidas);

        // const param: any = {
        //     marcasEscolhidas: idsMarcasEscolhidas
        // }

        try {
            const data = await comissaoMarcaService.getProdutos({ marcasEscolhidas: idsMarcasEscolhidas });
            state.produtos = data
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao buscar os Produtos."
            });
            return;
        } finally {
            state.loading = false;
        }

        state.modalProdutos.open();

        state.loading = false;
    },

    fecharModalMarcas() {
        state.modalMarcas.close();
    },

    fecharModalProdutos() {
        state.modalProdutos.close();
    },

    getClassCorLinha(dados: any) {
        let classe = dados.index % 2 == 0 ? 'cor-zebrada-1' : 'cor-zebrada-2'
        return { class: classe }
    },

    async getFuncionarios() {
        state.loading = true;

        try {
            state.funcionarios = await comissaoMarcaService.getFuncionarios();
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Ocorreu um erro ao buscar os funcionários.",
            });
        } finally {
            state.loading = false;
        }
    },

    adcMarcaNoCard(marcaEscolhida: iMarcas) {
        state.marcasEscolhidas.push(marcaEscolhida);
    },

    removerMarca(marca: iMarcas) {
        state.marcasEscolhidas = state.marcasEscolhidas.filter(
            (m) => m.ID_MARCA !== marca.ID_MARCA
        );
    },

    adcProdutosNoCard() {

    },

    removerProdutos() {

    }
}