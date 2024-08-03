import { computed, reactive } from "vue";
import metasService from './services/metas.service'
import Swal from "sweetalert2";
import {
    iDadosMetaCard, iMetasTracada, iGetMetasTracadasParam, iGetValoresParam, iValores, iFeriados,
    iPrevisao, iGetFeriadosParam
} from "./interfaces";

import moment, { Moment } from "moment";

export const META_GERAL = 0
export const META_DIURNA = 1
export const META_NOTURNA = 2

export const state = reactive({
    metasTracada: <iMetasTracada>{},
    valores: <iValores>{},
    data: moment().format('YYYY-MM-DD'),
    loading: false,
    mostrarValores: true,
    radioAlternarMetas: META_GERAL,
    feriados: <iFeriados>{},
    previsao: <iPrevisao>{}
})

export const actions = {
    async btnPesquisarMetas() {
        let dataIsValid = moment(state.data).isValid();

        if (!dataIsValid) {
            Swal.fire({
                icon: "warning",
                text: "Data inválida."
            })
            return;
        }

        await actions.getMetasTracadas()

        if (!state.metasTracada) {
            Swal.fire({
                icon: "info",
                text: "Nenhuma meta encontrada para a data informada."
            })

            state.valores = {} as iValores
            state.previsao = {} as iPrevisao

            return;
        }

        await actions.getValores()
        await actions.getFeriados()

        actions.calcularPrevisao()
    },

    salvarMetasNoCache(key: string, metas: iMetasTracada) {
        const timestamp = moment().toISOString();
        localStorage.setItem(key, JSON.stringify({ timestamp, metas }));
    },

    getMetasCache(key: string, tempo: number) {
        const cached = localStorage.getItem(key);

        if (!cached) return null;

        const { timestamp, metas } = JSON.parse(cached);
        const tempoCache = moment(timestamp);
        const agora = moment();
        const diff = agora.diff(tempoCache, 'milliseconds'); // Calcula a diferença em milissegundos

        // Verifica se o cache ainda é válido
        if (diff > tempo) {
            localStorage.removeItem(key);
            return null;
        }

        return metas;
    },

    async getMetasTracadas() {
        try {
            state.loading = true;

            // Define a chave do cache com base no mês da meta
            const mes = moment(state.data).format('YYYY-MM');
            const cacheKey = `metasTracadas_${mes}`;

            // Tenta obter dados do cache
            const cachedData = actions.getMetasCache(cacheKey, 12 * 60 * 60 * 1000); // 12 horas em milissegundos

            if (cachedData) {
                state.metasTracada = cachedData;
                return;
            }

            // Se não houver cache faz a requisição
            let param = {
                data: state.data,
            };

            const data = await metasService.getMetasTracadas(param);
            state.metasTracada = data[0];

            // Salva os dados no cache
            actions.salvarMetasNoCache(cacheKey, state.metasTracada);

        } catch (erro) {
            Swal.fire({
                icon: "error",
                text: "Ocorreu um erro ao buscar as metas traçadas."
            });
        } finally {
            state.loading = false;
        }
    },

    async getFeriados() {
        try {
            state.loading = true

            let param: iGetFeriadosParam = {
                data: state.data
            }

            const data = await metasService.getFeriados(param)

            state.feriados = data;

        } catch (erro) {
            Swal.fire({
                icon: "error",
                text: "Ocorreu um erro ao buscar os feriados."
            })
        } finally {
            state.loading = false
        }
    },

    async getValores() {
        try {
            state.loading = true

            let param: iGetValoresParam = {
                data: state.data,
                noturno: computeds.lojaIsNoturna.value
            }

            const data = await metasService.getValores(param)

            state.valores = data;

        } catch (erro) {
            Swal.fire({
                icon: "error",
                text: "Ocorreu um erro ao buscar os valores."
            })
        } finally {
            state.loading = false
        }
    },

    calcularPorcentagem(venda: number, meta: number) {
        let porcentagem = Number(((venda / meta) * 100).toFixed(2))

        if (isNaN(porcentagem) || !isFinite(porcentagem)) {
            porcentagem = 0
        }

        return porcentagem;
    },

    contarDiasUteis(dataInicio: Moment, dataFim: Moment) {
        let contador = 0;
        const diffDias = dataFim.diff(dataInicio, 'days');

        for (let i = 0; i <= diffDias; i++) {
            const diaAtual = dataInicio.clone().add(i, 'days');
            if (diaAtual.isoWeekday() !== 7) { // isoWeekday() retorna 7 para domingo
                contador++;
            }
        }

        return contador;
    },

    calcularDiasUteis(data: string) {
        const dataAtual = moment(data);
        const inicioMes = dataAtual.clone().startOf('month');
        const fimMes = dataAtual.clone().endOf('month');

        const qtdDiasUteis = actions.contarDiasUteis(inicioMes, fimMes);
        const qtdUteisCorridos = actions.contarDiasUteis(inicioMes, dataAtual);
        const qtdDiasParaFimMesUteis = actions.contarDiasUteis(dataAtual, fimMes);

        return {
            qtdDiasUteis,
            qtdUteisCorridos,
            qtdDiasParaFimMesUteis
        };
    },

    calcularPrevisao() {
        let diasUteis = actions.calcularDiasUteis(state.data);

        // Calcular a média de vendas diária
        let diasUteisCorridos = diasUteis.qtdUteisCorridos;
        let feriadosCorridos = state.feriados.qtdFeriadosCorridos;
        let mediaVenda = (state.valores.vendasAcu - state.valores.vendas) / (diasUteisCorridos - feriadosCorridos);

        // Calcular o valor desejado até o fim do mês
        let diasParaFimMesUteis = diasUteis.qtdDiasParaFimMesUteis;

        if (diasParaFimMesUteis == 0) {
            diasParaFimMesUteis = 1
        }

        let feriadosParaFimMes = state.feriados.qtdFeriadosParaFimMes;

        let desejado = (state.metasTracada.geral - (state.valores.vendasAcu - state.valores.vendas)) / (diasParaFimMesUteis - feriadosParaFimMes);

        // Calcular a previsão de vendas para o restante do mês
        let diasUteisDoMes = diasUteis.qtdDiasUteis;
        let feriadosDoMes = state.feriados.qtdFeriadosDoMes;
        let previsaoValor = mediaVenda * (diasUteisDoMes - feriadosDoMes);

        // Calcular a porcentagem de previsão em relação à meta
        let previsaoPorcentagem = ((previsaoValor / state.metasTracada.geral) * 100).toFixed(2);

        state.previsao = {
            mediaVenda,
            desejado,
            previsaoValor,
            previsaoPorcentagem
        };
    }

}

export const computeds = {
    lojaIsNoturna: computed(() => {
        let lojaNoturna: 'S' | 'N' = 'N';

        if (state.metasTracada.geral_noite > 0) {
            lojaNoturna = 'S';
        }

        return lojaNoturna;
    }),

    dadosToMetaCard: computed(() => {
        if (state.radioAlternarMetas == META_DIURNA) {
            return computeds.dadosToMetaCardDiurna.value
        }

        if (state.radioAlternarMetas == META_NOTURNA) {
            return computeds.dadosToMetaCardNoturna.value
        }

        return computeds.dadosToMetaCardGeral.value
    }),

    dadosToMetaCardGeral: computed(() => {

        const cardConfig: iDadosMetaCard[] = [
            {
                nomeCard: 'Meta Geral', valorGeral: state.metasTracada?.geral, backgroudColor: '#DBEAFE', progressColor: '#60A5FA',
                porcentagem: actions.calcularPorcentagem(state.valores.vendasAcu, state.metasTracada?.geral),
                valorDiaria: state.valores.vendas, valorAcumulado: state.valores.vendasAcu

            },
            {
                nomeCard: 'Meta Mercado', valorGeral: state.metasTracada?.mercado, backgroudColor: '#FCE7F3', progressColor: '#F472B6',
                porcentagem: actions.calcularPorcentagem(state.valores.mercadoAcu, state.metasTracada?.mercado),
                valorAcumulado: state.valores.mercadoAcu, valorDiaria: state.valores.mercado
            },
            {
                nomeCard: 'Meta Montagem', valorGeral: state.metasTracada?.montagem, backgroudColor: '#D1FAE5', progressColor: '#34D399',
                porcentagem: actions.calcularPorcentagem(state.valores.montagemAcu, state.metasTracada?.montagem),
                valorAcumulado: state.valores.montagemAcu, valorDiaria: state.valores.montagem
            },
            {
                nomeCard: 'Meta Mecânica', valorGeral: state.metasTracada?.mecanica, backgroudColor: '#FEF3C7', progressColor: '#FBBF24',
                porcentagem: actions.calcularPorcentagem(state.valores.mecanicaAcu, state.metasTracada?.mecanica),
                valorAcumulado: state.valores.mecanicaAcu, valorDiaria: state.valores.mecanica
            },
            {
                nomeCard: 'Ticket Médio', valorGeral: state.metasTracada?.ticket_medio, backgroudColor: '#FEE2E2', progressColor: '#F87171',
                porcentagem: actions.calcularPorcentagem(state.valores.ticketMedioAcu, state.metasTracada?.ticket_medio),
                valorAcumulado: state.valores.ticketMedioAcu, valorDiaria: state.valores.ticketMedio
            }
        ]

        return cardConfig
    }),

    dadosToMetaCardDiurna: computed(() => {

        if (!computeds.lojaIsNoturna.value) {
            return
        }

        const {
            geral, geral_noite, mercado, mercado_noite, montagem, montagem_noite, mecanica, mecanica_noite
        } = state.metasTracada


        let geral_diurno = geral - geral_noite
        let mercado_diurno = mercado - mercado_noite
        let montagem_diurno = montagem - montagem_noite
        let mecanica_diurno = mecanica - mecanica_noite

        const cardConfig: iDadosMetaCard[] = [
            {
                nomeCard: 'Meta Geral', valorGeral: geral_diurno, backgroudColor: '#DBEAFE', progressColor: '#60A5FA',
                porcentagem: actions.calcularPorcentagem(state.valores.vendasDiurnaAcu, geral_diurno),
                valorDiaria: state.valores.vendasDiurna, valorAcumulado: state.valores.vendasDiurnaAcu

            },
            {
                nomeCard: 'Meta Mercado', valorGeral: mercado_diurno, backgroudColor: '#FCE7F3', progressColor: '#F472B6',
                porcentagem: actions.calcularPorcentagem(state.valores.mercadoDiurnoAcu, mercado_diurno),
                valorAcumulado: state.valores.mercadoDiurnoAcu, valorDiaria: state.valores.mercadoDiurno
            },
            {
                nomeCard: 'Meta Montagem', valorGeral: montagem_diurno, backgroudColor: '#D1FAE5', progressColor: '#34D399',
                porcentagem: actions.calcularPorcentagem(state.valores.montagemDiurnaAcu, montagem_diurno),
                valorAcumulado: state.valores.montagemDiurnaAcu, valorDiaria: state.valores.montagemDiurna
            },
            {
                nomeCard: 'Meta Mecânica', valorGeral: mecanica_diurno, backgroudColor: '#FEF3C7', progressColor: '#FBBF24',
                porcentagem: actions.calcularPorcentagem(state.valores.mecanicaDiurnaAcu, mecanica_diurno),
                valorAcumulado: state.valores.mecanicaDiurnaAcu, valorDiaria: state.valores.mecanicaDiurna
            },
        ]

        return cardConfig
    }),

    dadosToMetaCardNoturna: computed(() => {

        if (!computeds.lojaIsNoturna.value) {
            return
        }

        const {
            geral_noite, mercado_noite, montagem_noite, mecanica_noite
        } = state.metasTracada

        const cardConfig: iDadosMetaCard[] = [
            {
                nomeCard: 'Meta Geral', valorGeral: geral_noite, backgroudColor: '#DBEAFE', progressColor: '#60A5FA',
                porcentagem: actions.calcularPorcentagem(state.valores.vendasNoturnaAcu, geral_noite),
                valorDiaria: state.valores.vendasNoturna, valorAcumulado: state.valores.vendasNoturnaAcu

            },
            {
                nomeCard: 'Meta Mercado', valorGeral: mercado_noite, backgroudColor: '#FCE7F3', progressColor: '#F472B6',
                porcentagem: actions.calcularPorcentagem(state.valores.mercadoNoturnoAcu, mercado_noite),
                valorAcumulado: state.valores.mercadoNoturnoAcu, valorDiaria: state.valores.mercadoNoturno
            },
            {
                nomeCard: 'Meta Montagem', valorGeral: montagem_noite, backgroudColor: '#D1FAE5', progressColor: '#34D399',
                porcentagem: actions.calcularPorcentagem(state.valores.montagemNoturnaAcu, montagem_noite),
                valorAcumulado: state.valores.montagemNoturnaAcu, valorDiaria: state.valores.montagemNoturna
            },
            {
                nomeCard: 'Meta Mecânica', valorGeral: mecanica_noite, backgroudColor: '#FEF3C7', progressColor: '#FBBF24',
                porcentagem: actions.calcularPorcentagem(state.valores.mecanicaNoturnaAcu, mecanica_noite),
                valorAcumulado: state.valores.mecanicaNoturnaAcu, valorDiaria: state.valores.mecanicaNoturna
            },
        ]

        return cardConfig
    }),
}