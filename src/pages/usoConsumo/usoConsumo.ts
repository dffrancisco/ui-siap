import { reactive } from "vue";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import Swal from "sweetalert2";
import utils, { iColumnPrint } from "@/ts/utils";
import moment from 'moment';
import serviceUsoConsumo from './services/usoConsumo.service';
import { iParamsUsoConsumo, iResponseUsoConsumo, iDadosUsoConsumo } from './interfaces';
import { formatISO, parseISO, isBefore } from 'date-fns';

export const state = reactive({
    loading: false,
    dataInicio: formatISO(new Date(), { representation: 'date' }),
    dataFim: formatISO(new Date(), { representation: 'date' }),
    dadosRelatorio: [] as iDadosUsoConsumo[],

    headers: <any>[
        { title: "Data", key: "DATA", sortable: true, align: "left" },
        { title: "Descrição", key: "DESCRICAO", sortable: true, align: "left" },
        { title: "Chave", key: "CHAVE", sortable: true, align: "left" },
        { title: "Valor", key: "VALOR", sortable: true, align: "right" },
    ],
});

export const actions = {
    async init() {

        this.getDadosParaRelatorio();
    },

    async getDadosParaRelatorio() {
        if (isBefore(parseISO(state.dataFim), parseISO(state.dataInicio))) {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'A data final não pode ser anterior à data inicial.'
            });
            return;
        }

        try {
            state.loading = true;
            const params: iParamsUsoConsumo = {
                dataInicio: state.dataInicio,
                dataFim: state.dataFim
            };
            const response: iResponseUsoConsumo = await serviceUsoConsumo.getDadosParaRelatorio(params);
            state.dadosRelatorio = response.dadosRelatorio;

            if (state.dadosRelatorio.length === 0) {
                Swal.fire('Atenção', 'Nenhum dado foi retornado para os filtros aplicados.', 'warning');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erro ao buscar dados',
                text: 'Não foi possível obter os dados do relatório. Tente novamente mais tarde.'
            });
        } finally {
            state.loading = false;
        }
    },

    async onClickImprimir() {
        if (!actions.validarInputs()) {
            return;
        }

        if (!state.dadosRelatorio) {
            Swal.fire({
                icon: 'warning',
                text: 'Não há dados para realizar a impressão.',
            });
            return;
        }

        try {
            state.loading = true;
            let relatorio = state.dadosRelatorio;
            const relatorioAjustado = actions.formatarDadosImpressao([...relatorio]);

            if (!relatorioAjustado || !relatorioAjustado) {
                Swal.fire({
                    icon: 'warning',
                    text: 'Não há dados ajustados para imprimir.',
                });
                return;
            }

            const columns: iColumnPrint[] = [
                { key: 'DATA', label: 'Data', align: 'left' },
                { key: 'DESCRICAO', label: 'Descrição', align: 'left' },
                { key: 'CHAVE', label: 'Chave', align: 'left' },
                { key: 'VALOR', label: 'Valor', align: 'right' },
            ];

            const titulo = `
                <div style="text-align: center;">
                    <strong style="font-size: 16px;"> Relatório Curva ABC </strong>
                </div>
            `;

            await utils.printComCabecalho(columns, relatorioAjustado, titulo);
        } catch (error) {
            console.error("Erro ao imprimir o relatório:", error);
            Swal.fire({
                icon: 'error',
                text: 'Erro ao imprimir relatório.',
            });
        } finally {
            state.loading = false;
        }
    },




    formatarDadosImpressao(data: any[]) {
        return data.map(item => ({
            ...item,
            ULTIMA_ENTRADA: item.ULTIMA_ENTRADA ? moment(item.ULTIMA_ENTRADA).format('DD/MM/YYYY') : '----',
        }));
    },



    getClassCorLinha(dados: any) {
        let classe = dados.index % 2 == 0 ? 'cor-zebrada-1' : 'cor-zebrada-2';
        return { class: classe };
    },

};




