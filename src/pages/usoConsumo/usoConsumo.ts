import { reactive } from "vue";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import Swal from "sweetalert2";
import { msgConfirm } from "@/ts/message";
import serviceUsoConsumo from './services/usoConsumo.service';
import { iParamsUsoConsumo, iResponseUsoConsumo, iDadosUsoConsumo } from './interfaces';


import { formatISO, parseISO, isBefore } from 'date-fns';

export const state = reactive({
    loading: false,
    dataInicio: formatISO(new Date(), { representation: 'date' }),
    dataFim: formatISO(new Date(), { representation: 'date' }),
    dadosRelatorio: [] as iDadosUsoConsumo[],

    headers: [
        { title: "Data", key: "DATA", sortable: true, align: "left" },
        { title: "Número da Nota", key: "NUM_NOTA", sortable: true, align: "left" },
        { title: "Descrição", key: "DESCRICAO", sortable: true, align: "left" },
        { title: "Chave", key: "CHAVE", sortable: true, align: "left" },
        { title: "Valor", key: "VALOR", sortable: true, align: "right" },
    ],
});

export const actions = {
    async init() {

        this.getDadosRelatorio();
    },

    async getDadosRelatorio() {
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
        if (state.dadosRelatorio.length === 0) {
            Swal.fire('Atenção', 'Nenhum dado disponível para impressão.', 'warning');
            return;
        }


        try {
            state.loading = true;

            await utils.printRelatorio(state.dadosRelatorio, state.headers);
        } catch (error) {
            console.error('Error printing report:', error);
            Swal.fire('Erro', 'Falha ao imprimir o relatório.', 'error');
        } finally {
            state.loading = false;
        }
    },
};
