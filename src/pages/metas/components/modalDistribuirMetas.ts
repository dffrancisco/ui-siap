import { computed, nextTick, onMounted, reactive } from "vue";
import { iFuncionario } from "../interfaces";
import Swal from "sweetalert2";
import xModal, { iModalCreate } from "@/plugins/xModal/xModal";

export const setup = (emit: any, props: any) => {

    const state = reactive({
        modalAtribuirMetaIndividual: <iModalCreate>(<unknown>null),
        modalAtribuirMetaIndividualOpened: false,
        codFuncionarioSelecionado: <number>undefined,
    })

    const atribuirMetaIndividual = (codFuncionario: number) => {

        if (!codFuncionario) {
            Swal.fire({
                icon: "error",
                text: "Escolha um funcionário.",
            });
            return;
        }

        state.codFuncionarioSelecionado = codFuncionario;
        state.modalAtribuirMetaIndividual.open();
    };

    onMounted(() => {
        nextTick(() => {
            actions.createModal();
        });
    });

    const actions = {

        getFotoFuncionarioURL(cpf: string) {
            if (!cpf) {
                return "";
            }
            const cpfSanitizado = cpf.replaceAll(".", "").replaceAll("-", "");
            return `https://www.reallatas.com.br/_serverAPP/thumb.php?img=http://www.reallatas.com.br/foto_funcionarios/${cpfSanitizado}.jpg`;
        },

        createModal() {
            state.modalAtribuirMetaIndividual = new xModal.create({
                width: 300,
                height: 330,
                el: "#modalAtribuirMetaIndividadual",
                theme: "xModal-bublue",
                onOpen: () => {
                    state.modalAtribuirMetaIndividualOpened = true;
                },
                onClose: () => {
                    state.modalAtribuirMetaIndividualOpened = false;
                },
            });
        },

    }

    const selecionarVendedores = () => {
        emit("opcaoCargoEscolhido", 0);
    };

    const selecionarMontadores = () => {
        emit("opcaoCargoEscolhido", 1);
    };

    const enviarDadosMeta = (dadosParaInserirMeta: { funcionario: iFuncionario, valorMeta: number }) => {
        state.codFuncionarioSelecionado = undefined;
        emit("inserirMeta", dadosParaInserirMeta);
    };

    const fecharModal = () => {
        state.modalAtribuirMetaIndividual.close();
    }

    const metasFuncionarios = computed(() => {
        let metas = props.optionSelect == 0 ? props.metaVendedores : props.metaMontadores;

        metas = metas.filter((meta) => {
            return meta.VALOR_META > 0;
        })

        if (state.codFuncionarioSelecionado) {
            let funcionariosFiltrados = metas.filter(meta => meta.COD_FUNCIONARIO == state.codFuncionarioSelecionado)
            if (funcionariosFiltrados.length > 0) {
                return funcionariosFiltrados
            }
        }
        return metas
    });

    const totalMetas = computed(() => {
        let totalDistribuido = 0;
        let qtdFuncionarios = 0

        if (props.optionSelect == 0) {
            qtdFuncionarios = props.metaVendedores.length
            props.metaVendedores.forEach((item) => {
                totalDistribuido += item?.VALOR_META || 0;
            });
        } else {
            qtdFuncionarios = props.metaMontadores.length
            props.metaMontadores.forEach((item) => {
                totalDistribuido += item?.VALOR_META || 0;
            });
        }

        return { totalDistribuido, qtdFuncionarios };
    });

    const funcionarioSelecionado = computed(() => {
        if (!state.codFuncionarioSelecionado) {
            return {} as iFuncionario
        }

        return props.funcionarios.find(funcionario => funcionario.COD_FUNCIONARIO == state.codFuncionarioSelecionado)
    })

    return {
        actions,
        state,
        selecionarVendedores,
        selecionarMontadores,
        atribuirMetaIndividual,
        enviarDadosMeta,
        fecharModal,
        totalMetas,
        metasFuncionarios,
        funcionarioSelecionado,
    }
}

