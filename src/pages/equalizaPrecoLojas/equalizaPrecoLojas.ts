import { nextTick, reactive } from "vue";
import serviceEqualizaPrecoLojas from "./services/equalizaPrecoLojas.service";
import Swal from "sweetalert2";
import { iItemNota, iNota, iParamGetItensNotas, iParamUpdateProdutos } from "./interfaces";
import utils, { iColumnPrint } from "@/ts/utils";
import xAuthManager from "@/plugins/xAuthManager";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import moment from "moment";
import { useEventListener } from "@vueuse/core";

export const state = reactive({
    loading: false,
    xgNotas: <ixGridCreate>{},
    xgItensNotas: <ixGridCreate>{},
    dbNotasOriginal: <iNota[]>[],
    dbItensNotaOriginal: <iItemNota[]>[],
    dbNotas: <iNota[]>[],
    dbItensNota: <iItemNota[]>[],
    filtroNota: "",
    filtroItemNota: "",
    inputFiltroNota: <HTMLInputElement>null,
    inputFiltroItensNota: <HTMLInputElement>null,
});

export const actions = {
    init() {
        state.inputFiltroNota = document.getElementById('inputFiltroNota') as HTMLInputElement
        state.inputFiltroItensNota = document.getElementById('inputFiltroItensNota') as HTMLInputElement
        actions.criarGrids()
        actions.getNotas();
    },

    criarGrids() {
        state.xgNotas = new xGridV2.create({
            el: "#xgNotas",
            height: 450,
            heightLine: 30,
            columns: {
                Loja: { dataField: "loja", width: "35%" },
                "Nº Nota": { dataField: "NUM_NOTA", right: true },
                Data: {
                    dataField: "DATA",
                    width: "19%",
                    render: utils.dataBrasil,
                    center: true,
                },
                Hora: { dataField: "HORA", width: "15%", center: true },
                Qto: { dataField: "QTO_ITENS", width: "10%", center: true },
            },
            dblClick: (r: iNota) => {
                actions.getItensNotas({
                    ID_ENTRADA: r.ID_ENTRADA,
                    CNPJ: r.CNPJ,
                });
            },
            enter: (r: iNota) => {
                actions.getItensNotas({
                    ID_ENTRADA: r.ID_ENTRADA,
                    CNPJ: r.CNPJ,
                });
            },
            onKeyDown: {
                46: () => {
                    xAuthManager("Deletar nota?", () => {
                        actions.deleteNota();
                    });
                },
            },
        });

        state.xgItensNotas = new xGridV2.create({
            el: "#xgItensNotas",
            height: 400,
            count: true,
            heightLine: 35,
            columns: {
                "Nº Fab.": { dataField: "NUM_FABRICANTE", width: "15%" },
                "Descrição do Produto": { dataField: "DESC_PRODUTO", width: "43%" },
                "Custo: Atual/Novo": {
                    dataField: "CUSTO_N",
                    compare: "statusCusto",
                    right: true,
                },
                "Venda: Atual/Novo": {
                    dataField: "VENDA_N",
                    compare: "statusVenda",
                    right: true,
                },
                "Atual.": {
                    dataField: "ATUALIZAR",
                    compare: "atualizar",
                    center: true,
                    width: "7%"
                },
            },
            onKeyDown: {
                32: (dados) => {
                    // @ts-ignore
                    if (dados.ATUALIZAR == "S") state.xgItensNotas.dataSource("ATUALIZAR", "N");
                    // @ts-ignore
                    else state.xgItensNotas.dataSource("ATUALIZAR", "S");
                },
                // codigo antigo abaixo do que falta migrar
                // "ctrl+66": r => {
                //     moviProdutoSet.open({
                //         COD_PRODUTO: r.COD_PRODUTO,
                //         pathURL: "../superClass/movimentacao_produto/",
                //         width: 1201,
                //         historicoEntradaCompacto: false,
                //     });
                // },
            },
            compare: {
                statusCusto: function (r: iItemNota) {
                    let vl = "";
                    let icon = ' <i class="fa fa-arrow-left" style="color: #edeeef;"></i>';
                    const custo = Number(r.CUSTO) || 0;
                    const custoN = Number(r.CUSTO_N) || 0;

                    if (custo > custoN)
                        vl = ' <i class="fa fa-arrow-down" style="color: green"></i>';
                    else if (custo < custoN)
                        vl = ' <i class="fa fa-arrow-up" style="color: red"></i>';
                    else if (custo == custoN) vl = ' <i class="fa fa-circle"></i>';

                    return (
                        "<div><span>" +
                        utils.formatValor(custo) +
                        icon +
                        '</span><br><span style="color:blue" >' +
                        utils.formatValor(custoN) +
                        vl +
                        "</span></div>"
                    );
                },
                statusVenda: function (r: iItemNota) {
                    let vl = "";
                    let icon = ' <i class="fa fa-arrow-left" style="color: #edeeef;"></i>';

                    // Garante que os valores são números antes de comparar
                    const venda = Number(r.VENDA) || 0;
                    const vendaN = Number(r.VENDA_N) || 0;

                    if (venda > vendaN)
                        vl = ' <i class="fa fa-arrow-down" style="color: green"></i>';
                    else if (venda < vendaN)
                        vl = ' <i class="fa fa-arrow-up" style="color: red;"></i>';
                    else if (venda == vendaN)
                        vl = ' <i class="fa fa-circle" style="color: #9dd1ea;"></i>';

                    return (
                        "<div><span>" +
                        utils.formatValor(venda) +
                        icon +
                        '</span><br><span style="color:blue">' +
                        utils.formatValor(vendaN) +
                        vl +
                        "</span></div>"
                    );
                },
                atualizar: (r: iItemNota) => {
                    if (r.ATUALIZAR == "N")
                        return `<span style="color:red" >${r.ATUALIZAR}</span>`;
                    if (r.ATUALIZAR == "S") return r.ATUALIZAR;
                },
            },
        });
    },

    async getNotas() {
        try {
            state.loading = true;
            state.dbNotas = await serviceEqualizaPrecoLojas.getNotas();
            state.dbNotasOriginal = [...state.dbNotas]
            state.xgNotas.source(state.dbNotas);
        } catch (error) {
            Swal.fire({ icon: "error", text: "Erro ao buscar as notas." });
        } finally {
            state.loading = false;
        }
    },

    async getItensNotas(param: iParamGetItensNotas) {
        try {
            state.loading = true;
            state.dbItensNota = await serviceEqualizaPrecoLojas.getItensNotas(param);
            state.xgItensNotas.source(state.dbItensNota);
            state.dbItensNotaOriginal = [...state.dbItensNota];
        } catch (error) {
            Swal.fire({ icon: "error", text: "Erro ao buscar os itens da nota." });
        } finally {
            state.loading = false;
        }
    },

    searchNota() {
        try {
            const termo = state.filtroNota.toLowerCase().trim();

            if (!termo) {
                state.xgNotas.source(state.dbNotasOriginal);
                return;
            }

            const notasFiltradas = state.dbNotasOriginal.filter(nota => {
                const numNotaStr = nota.NUM_NOTA?.toString()?.toLowerCase() || '';
                const lojaStr = nota.loja?.toLowerCase() || '';

                return (
                    lojaStr.includes(termo) ||
                    numNotaStr.includes(termo)
                );
            });

            state.xgNotas.source(notasFiltradas);
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Ocorreu um erro ao filtrar as notas",
            });
        }
    },

    searchItemNota() {
        const termo = state.filtroItemNota.toLowerCase().trim();

        if (!termo) {
            state.xgItensNotas.source(state.dbItensNotaOriginal);
            return;
        }

        const itensFiltrados = state.dbItensNotaOriginal.filter(item => {
            return (
                (item.NUM_FABRICANTE && item.NUM_FABRICANTE.toLowerCase().includes(termo)) ||
                (item.DESC_PRODUTO && item.DESC_PRODUTO.toLowerCase().includes(termo))
            );
        });

        state.dbItensNota = itensFiltrados;
        state.xgItensNotas.source(itensFiltrados);
    },

    getClassCorLinha(dados: any) {
        let classe = dados.index % 2 == 0 ? "cor-zebrada-1" : "";
        return { class: classe };
    },

    async imprimir() {
        try {
            const dadosItemNota = actions.formatarDadosImpressao([...state.dbItensNota]);

            const columns: iColumnPrint[] = [
                { key: 'NUM_FABRICANTE', label: 'Nº Fabricante', width: '15%' },
                { key: 'DESC_PRODUTO', label: 'Identificado Por', width: '40%' },
                { key: 'CUS_ATU_NOV', label: 'Cus-Atu/Nov', width: '18%', align: 'center' },
                { key: 'VEN_ATU_NOV', label: 'Ven-Atu/Nov', width: '18%', align: 'center' },
                { key: 'ATUALIZAR', label: 'Atual.', width: '9%' },
            ];

            const titulo = `
                        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-top: 10px">
                            <span>Data: ${moment().format('DD/MM/YYYY')}</span>
                            <strong style="font-size: 20px;">Equaliza Preço Lojas</strong>
                        </div>
                    `;

            await utils.printComCabecalho(columns, dadosItemNota, titulo);

        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao imprimir o relatório."
            });
        }
    },

    formatarDadosImpressao(data: iItemNota[]) {
        return data.map(item => ({
            ...item,
            CUS_ATU_NOV: `${utils.formatValor(item.CUSTO)} - ${utils.formatValor(item.CUSTO_N)}`,
            VEN_ATU_NOV: `${utils.formatValor(item.VENDA)} - ${utils.formatValor(item.VENDA_N)}`,
        }))
    },

    async atualizar() {

        if (!state.xgNotas.dataSource()) {
            Swal.fire({
                icon: "warning",
                text: "Selecione uma nota para atualizar os preços."
            });
            return;
        }

        const itensParaAtualizar = state.dbItensNota.filter(item => item.ATUALIZAR === 'S');

        if (!itensParaAtualizar.length) {
            Swal.fire({
                icon: "warning",
                text: "Nenhum item selecionado para atualização."
            });
            return;
        }

        xAuthManager("Atualizar preços?", async () => {
            try {
                state.loading = true;

                const notaSelecionada = state.xgNotas.dataSource();

                let param: iParamUpdateProdutos = {
                    loja: notaSelecionada.loja,
                    idEntrada: notaSelecionada.ID_ENTRADA,
                    numNota: notaSelecionada.NUM_NOTA,
                    dataNota: utils.dataBrasil(notaSelecionada.DATA),
                    itensNota: itensParaAtualizar,
                    cnpj: notaSelecionada.CNPJ
                }

                let response = await serviceEqualizaPrecoLojas.atualizarProdutos(param);

                state.xgItensNotas.source(response.itensAtualizados);

                Swal.fire('Sucesso!', 'Produtos atualizados com sucesso.', 'success');
            } catch (error) {
                Swal.fire({ icon: "error", text: "Erro ao atualizar os preços." });
            } finally {
                state.loading = false;
            }
        });
    },

    async deleteNota() {
        try {
            state.loading = true;
            await serviceEqualizaPrecoLojas.deleteNota({
                ID_ENTRADA: state.xgNotas.dataSource().ID_ENTRADA,
                CNPJ: state.xgNotas.dataSource().CNPJ,
            });

            state.xgItensNotas.clear();
            state.xgNotas.deleteLine();
        } catch (error) {
            Swal.fire({ icon: "error", text: "Erro ao excluir a nota." });
        } finally {
            state.loading = false;
        }
    },
};

export const eventListener = useEventListener(document, "keydown", async (event) => {
    if (event.key === "F1") {
        nextTick(() => {
            state.inputFiltroNota.focus();

        });
        event.preventDefault();
        event.stopPropagation();
    }

    if (event.key === "F2") {
        nextTick(() => {
            state.inputFiltroItensNota.focus();

        });
        event.preventDefault();
        event.stopPropagation();
    }
});