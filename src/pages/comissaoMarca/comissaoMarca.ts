import moment from "moment";
import { computed, reactive } from "vue";
import { iFuncionario, iMarcas, iProdutos, iGetProdutosParam, iProdutosEscolhidos, iDadosParaRelatorio, iParamParaRelatorio, iTabs } from "./interfaces";
import Swal from "sweetalert2";
import comissaoMarcaService from "./services/comissaoMarca.service";
import xModal, { iModalCreate } from "@/plugins/xModal/xModal";
import utils, { iColumnPrint } from "@/ts/utils";
import printJS from "print-js";

export const state = reactive({
    loading: false,
    totalItems: 0,
    itemsPerPage: 30,
    inputValor: "",
    funcionarios: <iFuncionario[]>[],
    selectedFuncionario: <number[]>[],
    modalMarcas: <iModalCreate>{},
    modalMarcasOpened: false,
    marcas: <iMarcas[]>[],
    marcaEscolhida: <Array<{ marca: iMarcas, produtos: iProdutosEscolhidos[] }>>[],
    modalProdutos: <iModalCreate>{},
    modalProdutosOpened: false,
    produtos: <iProdutos[]>[],
    produtosEditar: <iProdutosEscolhidos | null>null,
    produtosEscolhidos: <iProdutosEscolhidos[]>[],
    dadosParaRelatorioVendedor: <iDadosParaRelatorio[]>[],
    dadosParaRelatorioItens: <iDadosParaRelatorio[]>[],
    dataInicial: moment().format('YYYY-MM-DD'),
    dataFinal: moment().format('YYYY-MM-DD'),
    inputDataInicial: <HTMLInputElement>{},
    inputDataFinal: <HTMLInputElement>{},
    tab: <iTabs>{},
    headers: <any>[
        {
            title: "Funcionário",
            key: "VENDEDOR",
            sortable: true,
        },
        {
            title: "Marca",
            key: "MARCA",
            sortable: true,
            align: 'center',
        },
        {
            title: "Quantidade",
            key: "QTD",
            sortable: true,
            align: 'center',
        },
        {
            title: "Valor",
            key: "VALOR",
            sortable: true,
            value: (item: any) => utils.formatValor(item.VALOR)
        },
        {
            title: "Valor p/ item",
            key: "VALOR_P_ITEM",
            value: () => state.inputValor
        },
        {
            title: "Total p/ item",
            key: "TOTAL_P_ITEM",
            value: (item: any) => utils.formatValor(item.QTD * parseFloat(state.inputValor.replace(',', '.').trim()))
        }
    ],
    headers2: <any>[
        {
            title: "Produto",
            key: "PRODUTO",
            sortable: true,
        },
        {
            title: "Marca",
            key: "MARCA",
            sortable: true,
            align: 'center',
        },
        {
            title: "Quantidade",
            key: "QTD",
            sortable: true,
            align: 'center',
        },
        {
            title: "Valor",
            key: "VALOR",
            sortable: true,
            value: (item: any) => utils.formatValor(item.VALOR)
        }
    ],
})

export const dataHoje = moment().format('YYYY-MM-DD');

export const totalizadorVendedores = computed(() => {
    let totalQtd = 0;
    let totalValor = 0;
    let totalPorItem = 0;

    state.dadosParaRelatorioVendedor.forEach(item => {
        totalQtd += item.QTD;
        totalValor += item.VALOR;
        totalPorItem += item.QTD * parseFloat(state.inputValor.replace(',', '.').trim());
    });

    return {
        VENDEDOR: 'TOTAL',
        MARCA: '',
        QTD: totalQtd,
        VALOR: totalValor,
        VALOR_P_ITEM: state.inputValor,
        TOTAL_P_ITEM: totalPorItem
    };
});

export const totalizadorItens = computed(() => {
    let totalQtdItem = 0;
    let totalValorItem = 0;

    state.dadosParaRelatorioItens.forEach(item => {
        totalQtdItem += item.QTD;
        totalValorItem += item.VALOR;
    });

    return {
        PRODUTO: 'TOTAL',
        MARCA: '',
        QTD: totalQtdItem,
        VALOR: totalValorItem,
    }
})

export const actions = {
    async init() {
        state.inputDataFinal = <any>document.getElementById("DATA_FINAL");
        state.inputDataInicial = <any>document.getElementById("DATA_INICIAL");
        state.inputDataInicial.focus()

        await actions.getFuncionarios()
        await actions.getMarcas()
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
            height: 700,
            width: 640,
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
        state.loading = false;
    },

    openModalMarcas() {
        state.loading = true;
        state.modalMarcas.open();
        state.loading = false;
    },

    async getProdutos(idMarcaEscolhida: number) {
        state.loading = true;

        try {
            const data = await comissaoMarcaService.getProdutos({ marcaEscolhida: idMarcaEscolhida } as iGetProdutosParam);
            state.produtos = data;
        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: 'Erro ao buscar os Produtos.',
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
        const marcaExistente = state.marcaEscolhida.some(item => item.marca.ID_MARCA === marcaEscolhida.ID_MARCA);
        //O método some() testa se ao menos um dos elementos no array passa no teste implementado pela função atribuída e retorna um valor true ou false
        if (marcaExistente) {
            Swal.fire({
                icon: 'warning',
                text: 'Esta marca já foi adicionada.',
            });
            return;
        }

        state.marcaEscolhida.push({ marca: marcaEscolhida, produtos: [] });
        actions.getProdutos(marcaEscolhida.ID_MARCA);
    },

    removerMarca(marca: iMarcas) {
        state.marcaEscolhida = state.marcaEscolhida.filter(
            (item) => item.marca.ID_MARCA !== marca.ID_MARCA
        );
        actions.atualizarProdutosEscolhidos();
    },

    adcProdutosNoCard(produtosSelecionados: iProdutosEscolhidos) {
        if (produtosSelecionados.descricaoSelecionados == "Nenhuma descrição encontrada") {
            return
        }

        const marcaAtual = state.marcaEscolhida.find(item => item.marca.ID_MARCA === state.produtos[0]?.ID_MARCA);
        if (marcaAtual) {
            const produtosExistentes = marcaAtual.produtos.find(
                produto => produto.descricaoSelecionados === produtosSelecionados.descricaoSelecionados);
            if (produtosExistentes) {
                // Se o produto já existe, atualiza os produtos existentes
                produtosExistentes.produtosEscolhidos = produtosSelecionados.produtosEscolhidos;
            } else {
                // Se o produto não existe, adiciona os novos produtos
                marcaAtual.produtos.push(produtosSelecionados);
            }
        }

        state.produtosEditar = null;
        actions.atualizarProdutosEscolhidos();
    },

    removerProdutos(idMarca: number, descricaoSelecionados: string) {
        const marca = state.marcaEscolhida.find(item => item.marca.ID_MARCA === idMarca);

        if (marca) {
            marca.produtos = marca.produtos.filter(
                (produto) => produto.descricaoSelecionados !== descricaoSelecionados
            );
            actions.atualizarProdutosEscolhidos()
        }
    },

    atualizarProdutosEscolhidos() {
        state.produtosEscolhidos = state.marcaEscolhida.flatMap(item => item.produtos);
        //O método flatMap() primeiro mapeia cada elemento usando uma função de mapeamento e, em seguida, nivela o resultado em um novo array.
    },

    editarProdutos(produtosEscolhidos: iProdutosEscolhidos, idMarca: number) {
        state.produtosEditar = produtosEscolhidos
        actions.getProdutos(idMarca);
    },

    editarMarca(idMarca: number) {
        actions.getProdutos(idMarca);
    },

    validarInputs() {
        const dataInicial = moment(state.dataInicial, 'YYYY-MM-DD');
        const dataFinal = moment(state.dataFinal, 'YYYY-MM-DD');

        if (!dataInicial.isValid() || !dataFinal.isValid()) {
            Swal.fire({
                icon: "warning",
                text: "Data Inválida!"
            });
            return false;
        }

        if (dataInicial.isAfter(dataFinal)) {
            Swal.fire({
                icon: "warning",
                text: "Data inicial maior que a data final!"
            });
            return false;
        }

        const diferencaMeses = dataFinal.diff(dataInicial, 'months', true);

        if (diferencaMeses >= 3) {
            Swal.fire({
                icon: "warning",
                text: "O intervalo entre as datas não pode ser maior que três meses!"
            });
            return false;
        }

        if (state.marcaEscolhida == "" || state.produtosEscolhidos == "") {
            Swal.fire({
                icon: "warning",
                text: "Escolha ao menos uma marca e produto!",
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) {
                    actions.openModalMarcas();
                    return;
                }
            });
            return
        }
        actions.getDadosVendaMarcaPorVendedor();
    },

    async getDadosVendaMarcaPorVendedor() {
        state.loading = true;
        try {
            const param: iParamParaRelatorio = {
                cod_funcionarios: state.selectedFuncionario,
                produtos: state.produtosEscolhidos.map(item => item.produtosEscolhidos),
                data_inicial: state.dataInicial,
                data_final: state.dataFinal
            }
            const data = await comissaoMarcaService.getDadosVendaMarcaPorVendedor(param);
            state.dadosParaRelatorioVendedor = data
        } catch (error) {
            const errorMessage = error.response?.data?.msg || "Erro ao buscar os dados.";
            Swal.fire({
                icon: "error",
                text: errorMessage
            });
            return;
        } finally {
            state.loading = false;
            state.tab = 'agrupadoPorVendedor'
            state.dadosParaRelatorioItens = []
        }
    },

    async getDadosVendaMarcaPorItens() {
        if (state.marcaEscolhida.length == 0 || state.produtosEscolhidos.length == 0) {
            Swal.fire({
                icon: "warning",
                text: "Escolha ao menos um produto."
            });
            return;
        }


        if (state.dadosParaRelatorioItens.length == 0) {
            state.loading = true;
            try {
                const param: iParamParaRelatorio = {
                    cod_funcionarios: state.selectedFuncionario,
                    produtos: state.produtosEscolhidos.map(item => item.produtosEscolhidos),
                    data_inicial: state.dataInicial,
                    data_final: state.dataFinal
                }
                const data = await comissaoMarcaService.getDadosVendaMarcaPorItens(param);
                state.dadosParaRelatorioItens = data
            } catch (error) {
                const errorMessage = error.response?.data?.msg || "Erro ao buscar os dados.";
                Swal.fire({
                    icon: "error",
                    text: errorMessage
                });
                return;
            } finally {
                state.tab = 'agrupadoPorItem'
                state.loading = false;
            }

        }

    },

    formatarDadosImpressao(data) {
        return data.map(item => ({
            ...item,
            VALOR: utils.formatValor(item.VALOR),
            VALOR_P_ITEM: state.inputValor,
            TOTAL_P_ITEM: utils.formatValor(item.QTD * parseFloat(state.inputValor.replace(',', '.').trim()))
        }))
    },

    async relatorio() {
        if (state.tab == 'agrupadoPorVendedor') {
            actions.imprimirRelatorioPorVendedor()
        }

        if (state.tab == 'agrupadoPorItem') {
            actions.imprimirRelatorioItens()
        }
    },

    async imprimirRelatorioPorVendedor() {

        try {
            const relatorioPorVendedor = actions.formatarDadosImpressao([...state.dadosParaRelatorioVendedor, totalizadorVendedores.value]);

            const columns: iColumnPrint[] = [
                { key: 'VENDEDOR', label: 'Vendedor', width: '20%' },
                { key: 'MARCA', label: 'Marca', width: '20%' },
                { key: 'QTD', label: 'Quantidade', width: '20%' },
                { key: 'VALOR', label: 'Valor', width: '20%' },
                { key: 'VALOR_P_ITEM', label: 'Valor p/ item', width: '10%' },
                { key: 'TOTAL_P_ITEM', label: 'Total p/ item', width: '10%' }
            ];

            const titulo = `
                <div style="display: flex; justify-content: space-between; width: 100%; margin-top: 10px">
                    <span>&nbsp;</span>
                    <strong style="font-size: 20px">Relatório de peças vendidas por vendedor - Período: ${utils.dataBrasil(state.dataInicial)} até: ${utils.dataBrasil(state.dataFinal)}</strong>
                </div>
            `;

            const rodape = `
                <div style="margin-top: 10px">
                    <span></span>
                </div>
            `;

            await utils.printComCabecalho(columns, relatorioPorVendedor, titulo, rodape);

        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao imprimir o relatório."
            });
        }
    },

    async imprimirRelatorioItens() {

        try {
            const relatorioPorItens = actions.formatarDadosImpressao([...state.dadosParaRelatorioItens, totalizadorItens.value]);

            const columns: iColumnPrint[] = [
                { key: 'PRODUTO', label: 'Produto', width: '30%' },
                { key: 'MARCA', label: 'Marca', width: '30%' },
                { key: 'QTD', label: 'Quantidade', width: '20%' },
                { key: 'VALOR', label: 'Valor', width: '20%' }
            ];

            const titulo = `
                <div style="display: flex; justify-content: space-between; width: 100%; margin-top: 10px">
                    <span>&nbsp;</span>
                    <strong style="font-size: 20px">Relatório de peças vendidas por item - Período: ${utils.dataBrasil(state.dataInicial)} até: ${utils.dataBrasil(state.dataFinal)}</strong>
                </div>
            `;

            const rodape = `
                <div style="margin-top: 10px">
                    <span></span>
                </div>
            `;

            await utils.printComCabecalho(columns, relatorioPorItens, titulo, rodape);

        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao imprimir o relatório."
            });
        }
    }
}