import utils, { swalDarkError } from '@/ts/utils';
import Swal from "sweetalert2";
import { computed, reactive } from "vue";
import ModalAbrirCartoes from './components/modalAbrirCartoes.vue';
import cartoes from './services/cartoes.service';
import { iCartoes } from './interfaces';
import { title } from 'process';
import { param } from 'jquery';
import { useEventListener } from '@vueuse/core';

export const state = reactive({
    acao: "",
    parcelas: 0,
    bandeira: "",
    loading: false,
    modalAbrirCartoes: false,
    item: {},
    cartoes: <iCartoes[]>[],
    headers: <any>[
        {
            title: 'Descrição', key: 'DESCRICAO',
        },
        {
            title: 'Qtd', key: 'QTD'
        },
        {
            title: 'Ações',
            key: 'inf',
            sortable: false,
            align: 'center',
        },
    ],
});

export const actions = {

    init: async () => {
        await actions.getCartoes();
    },

    onClickAdicionar: () => {
        state.acao = "incluir"
        state.modalAbrirCartoes = true;
    },
    onClickAlterar: (item: any) => {
        state.acao = "alterar"
        state.modalAbrirCartoes = true;
        state.item = item
    },

    closeModal: () => {
        state.modalAbrirCartoes = false;
    },


    resetForm() {
        state.parcelas = 0;
    },

    handleSalvarCartao(data: { bandeira: string; parcelas: number; acao: string, idItem: number | null }) {

        if (data.acao === "incluir") {


            actions.submitForm(data.bandeira, data.parcelas);

            return

        }
        if (data.acao === "alterar") {
            actions.updateCartoes(data.bandeira, data.idItem, data.parcelas)
        }
        state.modalAbrirCartoes = false;

    },


    async submitForm(DESCRICAO, PARCELAMENTO) {
        try {
            state.loading = true

            const response = await cartoes.insertCartoes({ DESCRICAO, PARCELAMENTO });
            state.cartoes.unshift(response);

            Swal.fire({
                icon: 'success',
                text: 'Cartão salvo com sucesso!',
            });

            actions.resetForm();
            state.modalAbrirCartoes = false;
        }
        catch (error) {
            Swal.fire({
                icon: 'error',
                text: error?.response?.data?.msg || "Ocorreu um erro ao inserir os dados"
            })
        }
        finally {
            state.loading = false
        }

    },


    updateCartoes: async (DESCRICAO, COD_BANDEIRA_CARTAO, PARCELAMENTO) => {

        try {
            state.loading = true

            const response = await cartoes.updateCartoes({ DESCRICAO, COD_BANDEIRA_CARTAO, PARCELAMENTO })
            const index = state.cartoes.findIndex(
                item => item.COD_BANDEIRA_CARTAO === COD_BANDEIRA_CARTAO
            );

            if (index !== -1) {
                state.cartoes.splice(index, 1, response);
            }

            Swal.fire({
                icon: 'success',
                text: 'Cartão alterado com sucesso!',
            });

        }
        catch (error) {
            Swal.fire({
                icon: 'error',
                text: error?.response?.data?.msg || "Ocorreu um erro ao inserir os dados"
            })

        }
        finally {
            state.loading = false
        }
    },



    getCartoes: async () => {
        try {
            let dados = await cartoes.getCartoes()
            state.cartoes = dados;

        } catch (error) {
            swalDarkError('Ocorreu um erro ao buscar as bandeiras do cartão')
        }
    },

}

export const eventListener = useEventListener(document, "keydown", async (event) => {
    if (!state.modalAbrirCartoes) {
        state.acao = "incluir"
        if (event.key === "F1" && state.acao === "incluir") {
            event.preventDefault();
            event.stopPropagation();
            state.modalAbrirCartoes = true
        }

    }
});

