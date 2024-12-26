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

    validarInputs() {
        if (!state.dataInicio || !state.dataFim) {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Os campos de data são obrigatórios.'
            });
            return false;
        }

        if (isBefore(parseISO(state.dataFim), parseISO(state.dataInicio))) {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'A data final não pode ser anterior à data inicial.'
            });
            return false;
        }

        return true;
    },

    async getDadosParaRelatorio() {
        if (!this.validarInputs()) {
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
                Swal.fire({

                    icon: 'warning',
                    text: 'Não foi possível obter os dados do relatório.'
                });
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erro ao buscar dados',
                text: 'Não foi possível obter os dados do relatório.'
            });
        } finally {
            state.loading = false;
        }
    },

    async onClickImprimir() {
        if (!this.validarInputs()) {
            return;
        }

        if (!state.dadosRelatorio || state.dadosRelatorio.length === 0) {
            Swal.fire({
                icon: 'warning',
                text: 'Não há dados para realizar a impressão.',
            });
            return;
        }

        try {
            state.loading = true;
            const relatorioAjustado = this.formatarDadosImpressao([...state.dadosRelatorio]);

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
