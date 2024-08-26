import { mesesToSelect } from "@/constants/constants";
import moment from "moment";
import Swal from "sweetalert2";
import { computed, reactive } from "vue";
import serviceSugestaoCompraAlteracao from './services/sugestaoCompraAlteracao.service';
import { iSugestaoCompraAlteracao } from "./interfaces";
import utils, { iColumnPrint } from "@/ts/utils";

export const opcoes = [
    { title: 'Todos', value: 'Todos' },
    { title: 'Compra', value: 'Compra' },
    { title: 'Alteração', value: 'Alteração' }
];
export const status = [
    { title: 'Todos', value: 'Todos' },
    { title: 'Aprovado', value: 'Aprovado' },
    { title: 'Reprovado', value: 'Reprovado' }
];

export const meses = mesesToSelect;
const ano = moment().year();
const mes = moment().month() + 1;

export const filtrarSugestoes = computed(() => {

    return state.sugestaoCompraAlteracao.filter(item => {
        // Filtra por 'opcoes' (Compra, Alteração ou Todos)
        const opcao = state.opcoes === "Todos" ||
            (state.opcoes === "Compra" && item.TIPO === "I") ||
            (state.opcoes === "Alteração" && item.TIPO === "A");
        // Filtra por 'status' (Aprovado, Reprovado ou Todos)
        const status = state.status === "Todos" ||
            (state.status === "Aprovado" && item.APROVADA === "S") ||
            (state.status === "Reprovado" && item.APROVADA === "N");
        return opcao && status;
    });
})

export const state = reactive({
    loading: false,
    mes: mes,
    ano: ano || "",
    opcoes: "Todos",
    status: "Todos",
    sugestaoCompraAlteracao: <iSugestaoCompraAlteracao[]>[],
    totalItems: 0,
    itemsPerPage: 30,
    page: 1,
    mesImpressao: null,
    anoImpressao: null,
    modalAprovarOpened: false,
    modalReprovarOpened: false,
    itemAprovar: {} as iSugestaoCompraAlteracao,
    itemReprovar: {} as iSugestaoCompraAlteracao,
    headers: <any>[
        {
            title: "Produto",
            key: "DESCRICAO_PRODUTO",
            sortable: false,
        },
        {
            title: "Sugestão",
            key: "SUGESTAO",
            sortable: false,
        },
        {
            title: "Tipo",
            key: "TIPO",
            sortable: false,
            align: 'center'
        },
        {
            title: "Solicitante",
            key: "SOLICITANTE",
            sortable: false,
            align: 'center'
        },
        {
            title: "Status",
            key: "APROVADA",
            sortable: false,
            sortBy: "desc",
            align: 'center'
        },
        {
            title: 'Aprovar',
            key: 'apr',
            sortable: false,
            align: 'center',
        }
    ]
})

export const actions = {
    async init() {
        actions.validarInputs()
    },

    validarInputs() {
        if (state.ano === "" || state.ano > ano.toString()) {
            Swal.fire({
                icon: "error",
                text: "Insira um ano válido para continuar"
            });
            return
        }

        if (state.mes > mes) {
            Swal.fire({
                icon: "error",
                text: "Insira um mês válido para continuar"
            });
            return
        }
        actions.getSugestaoCompraAlteracao();
    },

    async getSugestaoCompraAlteracao() {
        try {
            state.loading = true;
            let dataInicio = moment(`${state.ano}-${state.mes}-01`, 'YYYY-MM-DD').startOf('month').format('YYYY-MM-DD');
            let dataFim = moment(`${state.ano}-${state.mes}-01`, 'YYYY-MM-DD').endOf('month').format('YYYY-MM-DD');

            const data = await serviceSugestaoCompraAlteracao.getSugestaoCompraAlteracao({
                page: state.page,
                itemsPerPage: state.itemsPerPage,
                DATA_INICIO: dataInicio,
                DATA_FIM: dataFim
            });

            state.sugestaoCompraAlteracao = data.sugestaoCompraAlteracao;
            state.totalItems = data.total[0].TOTAL;

            state.mesImpressao = state.mes;
            state.anoImpressao = state.ano;
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao exibir as vendas perdidas!"
            });
        } finally {
            state.loading = false;
        }
    },

    getDadosImpresaoArquivo() {

        const dadosToPrint = filtrarSugestoes.value.map(item => ({
            DESCRICAO_PRODUTO: item.DESCRICAO_PRODUTO ?? '----------',
            SUGESTAO: item.SUGESTAO ?? '--------',
            TIPO: item.TIPO === 'I' ? 'Compra' : 'Alteração',
            SOLICITANTE: item.SOLICITANTE ?? '',
            APROVADA: item.APROVADA === 'S' ? 'Aprovado' : item.APROVADA === 'N' ? 'Reprovado' : 'Aguardando'
        }));

        let columns: iColumnPrint[] = [
            {
                key: 'DESCRICAO_PRODUTO',
                label: "Produto",
                width: '30%'
            },
            {
                key: 'SUGESTAO',
                label: "Sugestão",
                width: '40%'
            },
            {
                key: 'TIPO',
                label: "Tipo",
                align: 'center',
                width: '10%'
            },
            {
                key: 'SOLICITANTE',
                label: "Solicitante",
                width: '10%'
            },
            {
                key: 'APROVADA',
                label: "Status",
                align: 'center',
                width: '10%'
            }
        ];

        return { columns, dadosToPrint };
    },

    async onClickImprimir() {
        let { dadosToPrint, columns } = actions.getDadosImpresaoArquivo();

        let titulo = `
      <div style="display: flex; justify-content: space-between; width: 100%; margin-top: 10px">
      <span>Período: ${meses.find((mes) => mes.value === state.mesImpressao)?.title} ${state.anoImpressao}</span>
      <strong style="font-size: 20px">Sugestões de Compra/Alteração</strong>
      </div>
      `;

        try {
            state.loading = true

            await utils.printComCabecalho(columns, dadosToPrint, titulo);
        } catch (error) {
            console.error(error);
        } finally {
            state.loading = false
        }
    },

    modalAprovar(item: iSugestaoCompraAlteracao) {
        state.itemAprovar = item
        state.modalAprovarOpened = true;
    },

    modalReprovar(item: iSugestaoCompraAlteracao) {
        state.itemReprovar = item
        state.modalReprovarOpened = true;
    },

    async aprovar(sugestaoAprovar: { sugestaoAprovar: iSugestaoCompraAlteracao }) {
        state.loading = true;

        const param = {
            id_produto_sugestao: sugestaoAprovar.sugestaoAprovar.ID_PRODUTO_SUGESTAO,
            aprovada: 'S'
        }

        try {
            await serviceSugestaoCompraAlteracao.aprovarSugestao(param);

            Swal.fire({
                icon: "success",
                title: "Sugestão aprovada.",
                showConfirmButton: false,
                timer: 1000,
            });

        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Ocorreu um erro ao aprovar a sugestão.",
            });
        } finally {
            state.loading = false;
            state.modalAprovarOpened = false;
            await actions.getSugestaoCompraAlteracao();
        }
    },

    async reprovar(sugestaoReprovar: { sugestaoReprovar: iSugestaoCompraAlteracao }) {
        state.loading = true;

        const param = {
            id_produto_sugestao: sugestaoReprovar.sugestaoReprovar.ID_PRODUTO_SUGESTAO,
            aprovada: 'N'
        }

        try {
            await serviceSugestaoCompraAlteracao.reprovarSugestao(param);

            Swal.fire({
                icon: "success",
                title: "Sugestão reprovada.",
                showConfirmButton: false,
                timer: 1000,
            });

        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Ocorreu um erro ao reprovar a sugestão.",
            });
        } finally {
            state.loading = false;
            state.modalReprovarOpened = false;
            await actions.getSugestaoCompraAlteracao();
        }
    },

    updatePage(newPage: number) {
        state.page = newPage;
        actions.getSugestaoCompraAlteracao();
    },

    getClassCorLinha(dados: any) {
        let classe = dados.index % 2 == 0 ? 'cor-zebrada-1' : 'cor-zebrada-2'
        return { class: classe }
    },

    closeModalAprovar() {
        state.modalAprovarOpened = false;
    },

    closeModalReprovar() {
        state.modalReprovarOpened = false;
    }
}