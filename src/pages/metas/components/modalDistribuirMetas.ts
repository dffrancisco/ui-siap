import { computed, nextTick, onMounted, reactive, watch } from "vue";
import metasService from "../services/metas.service";
import { iMesEAno, iResponseFuncionarios } from "../interfaces";
import Swal from "sweetalert2";
import xModal, { iModalCreate } from "@/plugins/xModal/xModal";

export const setup = (emit: any, props: any) => {

    const state = reactive({
        loading: false,
        mes: 0,
        ano: 0,
        isVendedoresSelected: true,
        isMontadoresSelected: false,
        modalAtribuirMetaIndividual: <iModalCreate>(<unknown>null),
        modalAtribuirMetaIndividualOpened: false,
        codFuncionarioSelecionado: <number>undefined,
        funcionarioSelecionado: <iResponseFuncionarios>{},
        metaVendedores: [],
        metaMontadores: [],
        funcionarios: [],
        infoFuncionario: [],
        opcaoMeta: 0
    })

    watch(
        () => props.opened,
        () => {
            if (props.opened) {
                state.loading = true;
                state.funcionarios = props.funcionarios;
                state.mes = props.mes;
                state.ano = props.ano;
                state.metaVendedores = props.metaVendedores;
                state.metaMontadores = props.metaMontadores;
                state.infoFuncionario = props.metaVendedores;
                state.opcaoMeta = props.opcaoMeta
                console.log(props.opcaoMeta);


                setTimeout(() => {
                    state.loading = false;
                }, 1000);
            }

        }
    );

    const funcionariosOrdenados = computed(() => {
        let funcionariosArray = <any[]>[];

        for (let indexFuncionario in state.funcionarios) {
            funcionariosArray.push(state.funcionarios[indexFuncionario]);
        }

        funcionariosArray.sort((funcionario1, funcionario2) => {
            return funcionario1.NOME_COMP > funcionario2.NOME_COMP ? 1 : -1;
        });

        return funcionariosArray;
    });

    const atribuirMetaIndividual = () => {

        state.funcionarioSelecionado = props.funcionarios
            .find(funcionario => funcionario.COD_FUNCIONARIO == state.codFuncionarioSelecionado)

        if (!state.funcionarioSelecionado?.LOGIN) {
            Swal.fire({
                icon: "error",
                text: "Escolha um funcionário para prosseguir.",
            });
            return;
        }

        state.modalAtribuirMetaIndividual.open();
    };


    onMounted(() => {
        nextTick(() => {
            actions.modal();
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

        modal() {
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
        state.isVendedoresSelected = true;
        state.isMontadoresSelected = false;
        state.infoFuncionario = state.metaVendedores;
    };


    const selecionarMontadores = () => {
        state.isVendedoresSelected = false;
        state.isMontadoresSelected = true;
        state.infoFuncionario = state.metaMontadores;
    };

    const mostrarInfoFuncionarioSelecionado = () => {
        if (state.codFuncionarioSelecionado) {
            const funcionarioSelecionado = props.funcionarios.find(
                (funcionario) => funcionario.COD_FUNCIONARIO == state.codFuncionarioSelecionado
            );
            if (funcionarioSelecionado) {
                if (funcionarioSelecionado.CARGO == "VENDEDOR") {
                    state.infoFuncionario = state.metaVendedores[funcionarioSelecionado.COD_FUNCIONARIO];
                } else if (funcionarioSelecionado.CARGO == "MONTADOR") {
                    state.infoFuncionario = state.metaMontadores[funcionarioSelecionado.COD_FUNCIONARIO];
                }
            }
        }
    };

    const filtrarFuncionarios = (funcionarioSelecionado: iResponseFuncionarios | null) => {
        if (funcionarioSelecionado) {
            state.funcionarios = props.funcionarios.filter(
                (funcionario) => funcionario.COD_FUNCIONARIO === funcionarioSelecionado
            );
        } else {
            state.funcionarios = props.funcionarios;
        }
    };

    const enviarDadosMeta = (dadosParaInserirMeta: { funcionario: iResponseFuncionarios, valorMeta: number }) => {
        emit("inserirMeta", dadosParaInserirMeta)
    };

    const fecharModal = () => {
        state.modalAtribuirMetaIndividual.close();
        emit("atualizarDadosMetas")
    }


    return {
        actions,
        state,
        selecionarVendedores,
        selecionarMontadores,
        filtrarFuncionarios,
        atribuirMetaIndividual,
        funcionariosOrdenados,
        enviarDadosMeta,
        fecharModal,
        mostrarInfoFuncionarioSelecionado
    }
}

