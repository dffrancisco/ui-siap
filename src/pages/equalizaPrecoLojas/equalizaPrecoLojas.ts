import { computed, nextTick, reactive } from "vue";
import serviceEqualizaPrecoLojas from "./services/equalizaPrecoLojas.service";
import Swal from "sweetalert2";
import { iItemNota, iNota } from "./interfaces";
import utils, { iColumnPrint } from "@/ts/utils";
import xAuthManager from "@/plugins/xAuthManager";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import moment from "moment";
import { useEventListener } from "@vueuse/core";

export const state = reactive({
    loading: false,
    notaSelecionada: null as iNota | null,
    xgNotas: <ixGridCreate>{},
    xgItensNotas: <ixGridCreate>{},
    dbNotasOriginal: <iNota[]>[],
    dbItensNotaOriginal: <iItemNota[]>[],
    dbNotas: <iNota[]>[],
    dbItensNota: <iItemNota[]>[],
    filtroNota: "",
    inputFiltroNota: <HTMLInputElement>null,
    inputFiltroItensNota: <HTMLInputElement>null,
    filtroItemNota: "",
    linhaSelecionadaItens: null as number | null,
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
            dblClick: (r: any) => {
                actions.getItensNotas({
                    ID_ENTRADA: r.ID_ENTRADA,
                    CNPJ: r.CNPJ,
                });
            },
            enter: (r: any) => {
                actions.getItensNotas({
                    ID_ENTRADA: r.ID_ENTRADA,
                    CNPJ: r.CNPJ,
                });
            },
            onKeyDown: {
                46: () => {
                    xAuthManager("Atualizar preços?", () => {
                        //actions.deleteNota();
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
                "Nº Fab.": { dataField: "NUM_FABRICANTE", width: "12%" },
                "Descrição do Produto": { dataField: "DESC_PRODUTO", width: "45%" },
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
                "Atualizar": {
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
                statusCusto: function (r: any) {
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
                statusVenda: function (r: any) {
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
                atualizar: (r: any) => {
                    if (r.ATUALIZAR == "N")
                        return `<span style="color:red" >${r.value}</span>`;
                    if (r.ATUALIZAR == "S") return r.value;
                },
            },
        });
    },

    async getNotas() {
        try {
            state.loading = true;
            const notas = await serviceEqualizaPrecoLojas.getNotas();
            state.dbNotas = notas;
            state.dbNotasOriginal = [...notas]
            state.xgNotas.source(notas);
        } catch (error) {
            Swal.fire({ icon: "error", text: "Erro ao buscar as notas." });
        } finally {
            state.loading = false;
        }
    },



    async getItensNotas(param: any) {
        state.notaSelecionada = param;
        try {
            state.loading = true;

            state.linhaSelecionadaItens = null;
            const itens = await serviceEqualizaPrecoLojas.getItensNotas(param);
            state.xgItensNotas.source(itens);
            state.dbItensNota = itens;
            state.dbItensNotaOriginal = [...itens];
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

        state.xgItensNotas.source(itensFiltrados);
    },


    getClassCorLinha(dados: any) {
        let classe = dados.index % 2 == 0 ? "cor-zebrada-1" : "";

        if (dados.item.NUM_FABRICANTE !== undefined && state.linhaSelecionadaItens === dados.index) {
            classe += " linha-selecionada";
        }

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
        xAuthManager("Atualizar preços?", async (codFuncionario: string) => {
            try {
                state.loading = true;
                const itensParaAtualizar = state.xgItensNotas.dataSource() as iItemNota[];

                for (const item of itensParaAtualizar) {
                    await serviceEqualizaPrecoLojas.updateProduto({
                        ...item,
                        COD_FUNCIONARIO: codFuncionario,
                        loja: state.xgNotas.dataSource().loja,
                        id_entrada: state.xgNotas.dataSource().ID_ENTRADA,
                        nota: state.xgNotas.dataSource().NUM_NOTA,
                        data: utils.dataBrasil(state.xgNotas.dataSource().DATA),
                        //central: empresa.cnpj === "05.849.121.0001-26" ? "S" : "N"
                    });
                }

                Swal.fire('Sucesso!', 'Preços atualizados com sucesso.', 'success');
            } catch (error) {
                Swal.fire({ icon: "error", text: "Erro ao atualizar os preços." });
            } finally {
                state.loading = false;
            }
        });
    },

    //   async deleteNota() {
    //     try {
    //       state.loading = true;
    //       await serviceEqualizaPrecoLojas.deleteNota({
    //         ID_ENTRADA: state.xgNotas.dataSource().ID_ENTRADA,
    //         CNPJ: state.xgNotas.dataSource().CNPJ,
    //       });

    //       state.xgItensNotas.clear();
    //       state.xgNotas.deleteLine();
    //     } catch (error) {
    //       Swal.fire({ icon: "error", text: "Erro ao excluir a nota." });
    //     } finally {
    //       state.loading = false;
    //     }
    //   },
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