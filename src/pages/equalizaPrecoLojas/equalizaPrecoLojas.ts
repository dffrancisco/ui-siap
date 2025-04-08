import { reactive } from "vue";
import serviceEqualizaPrecoLojas from "./services/equalizaPrecoLojas.service";
import Swal from "sweetalert2";
import { iItemNota, iNota } from "./interfaces";
import utils, { iColumnPrint } from "@/ts/utils";
import moment from "moment";

export const state = reactive({
    loading: false,
    notaSelecionada: null as iNota | null,
    notas: <iNota[]>[],
    itensNota: <iItemNota[]>[],
    headersNotas: [
        { title: 'Loja', key: 'loja' },
        { title: 'Nº Nota', key: 'NUM_NOTA', align: 'end', width: '15%' },
        { title: 'Data', key: 'DATA', align: 'center', width: '19%' },
        { title: 'Hora', key: 'HORA', align: 'center', width: '15%' },
        { title: 'Qto Itens', key: 'QTO_ITENS', align: 'center', width: '10%' },
    ],
    headersItens: [
        { title: 'Nº Fabricante', key: 'NUM_FABRICANTE', width: '10%' },
        { title: 'Descrição', key: 'DESC_PRODUTO' },
        { title: 'Cus-Atu/Nov', key: 'CUSTO_N', align: 'center', width: '13%' },
        { title: 'VEN-Atu/Nov', key: 'VENDA_N', align: 'center', width: '13%' },
        { title: 'Atual', key: 'ATUALIZAR', align: 'center', width: '5%' },
    ],
    linhaSelecionadaNotas: null as number | null, // Adicione esta linha
    linhaSelecionadaItens: null as number | null, // Adicione esta linha
});

export const actions = {
    init() {
        actions.getNotas();
    },

    getClassCorLinha(dados: any) {
        let classe = dados.index % 2 == 0 ? "cor-zebrada-1" : "";

        // Verifica se é a tabela de notas (pela presença de NUM_NOTA no item)
        if (dados.item.NUM_NOTA !== undefined && state.linhaSelecionadaNotas === dados.index) {
            classe += " linha-selecionada";
        }
        // Verifica se é a tabela de itens (pela presença de NUM_FABRICANTE no item)
        else if (dados.item.NUM_FABRICANTE !== undefined && state.linhaSelecionadaItens === dados.index) {
            classe += " linha-selecionada";
        }

        return { class: classe };
    },

    async getNotas() {
        try {
            state.loading = true;
            state.notas = await serviceEqualizaPrecoLojas.getNotas();
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao buscar as notas.",
            });
        } finally {
            state.loading = false;
        }
    },

    async selecionarNota(event: Event, { item, index }: { item: iNota, index: number }) {
        try {
            state.loading = true;
            state.notaSelecionada = item;

            state.linhaSelecionadaNotas = index;
            state.linhaSelecionadaItens = null;

            state.itensNota = await serviceEqualizaPrecoLojas.getItensNotas({
                ID_ENTRADA: item.ID_ENTRADA,
                CNPJ: item.CNPJ
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao buscar os itens da nota.",
            });
        } finally {
            state.loading = false;
        }
    },

    async imprimir() {
        try {
            const dadosItemNota = actions.formatarDadosImpressao([...state.itensNota]);

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

    // async atualizar() {
    //     if (!state.notaSelecionada) return;

    //     const { value: codFuncionario } = await Swal.fire({
    //         title: 'Autorização necessária',
    //         text: 'Atualizar preços?',
    //         input: 'text',
    //         inputLabel: 'Código do Funcionário',
    //         inputPlaceholder: 'Digite seu código',
    //         showCancelButton: true,
    //         inputValidator: (value) => {
    //             if (!value) return 'Código é obrigatório!';
    //         }
    //     });

    //     if (!codFuncionario) return;

    //     try {
    //         state.loading = true;
    //         const itensParaAtualizar = state.itensNota.filter(item => item.ATUALIZAR === 'S');

    //         for (const item of itensParaAtualizar) {
    //             await serviceEqualizaPrecoLojas.updateProduto({
    //                 ...item,
    //                 COD_FUNCIONARIO: codFuncionario,
    //                 loja: state.notaSelecionada.loja,
    //                 id_entrada: state.notaSelecionada.ID_ENTRADA,
    //                 nota: state.notaSelecionada.NUM_NOTA,
    //                 data: new Date(state.notaSelecionada.DATA).toLocaleDateString('pt-BR'),
    //                 //central: state.cnpj === "05.849.121.0001-26" ? "S" : "N"
    //             });
    //         }

    //         Swal.fire('Sucesso!', 'Preços atualizados com sucesso.', 'success');
    //         await actions.selecionarNota(null, { item: state.notaSelecionada });
    //     } catch (error) {
    //         Swal.fire({
    //             icon: "error",
    //             text: "Erro ao atualizar os preços.",
    //         });
    //     } finally {
    //         state.loading = false;
    //     }
    // },

}