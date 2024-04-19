import { computed, nextTick, onMounted, reactive, watch } from "vue";
import { iResponseFuncionarios, iResponseMetasVendedoresEMontadores } from "../interfaces";
import Swal from "sweetalert2";
import xModal, { iModalCreate } from "@/plugins/xModal/xModal";
import utils from "@/ts/utils";

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
        funcionarioSelecionado: <iResponseMetasVendedoresEMontadores>{},
        inputFuncionario: <HTMLInputElement>{},
        metaVendedores: [],
        metaMontadores: [],
        funcionarios: [],
        infoFuncionario: [],
        opcaoMeta: 0,
    })

    watch(
        () => props.opened,
        () => {
            if (props.opened) {
                state.loading = true;
                state.inputFuncionario = <any>document.getElementById("inputFuncionario").focus();
                state.funcionarios = props.funcionarios;
                state.metaMontadores = props.metaMontadores;
                state.metaVendedores = props.metaVendedores;
                state.mes = props.mes;
                state.ano = props.ano;

                state.infoFuncionario = props.metaVendedores.filter(funcionario => funcionario.VALOR_META !== 0 && funcionario.VALOR_META !== null);

                state.opcaoMeta = props.optionSelect
                if (state.opcaoMeta == 1) {
                    selecionarMontadores()
                }
                setTimeout(() => {
                    state.loading = false;
                }, 500);
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

    const funcionarioFiltrado = () => {

        state.funcionarioSelecionado = state.funcionarios
            .find(funcionario => funcionario.COD_FUNCIONARIO == state.codFuncionarioSelecionado)


        if (!state.funcionarioSelecionado) {
            state.isVendedoresSelected = true;
            state.isMontadoresSelected = false;
            state.infoFuncionario = props.metaVendedores.filter(funcionario => funcionario.VALOR_META !== 0 && funcionario.VALOR_META !== null);

            emit("opcaoCargoEscolhido", 0);
        } else {
            state.infoFuncionario = [];
            state.infoFuncionario.push(state.funcionarioSelecionado);
        }

        return state.infoFuncionario
    }

    const atribuirMetaIndividual = (funcionarioSelecionado) => {

        if (funcionarioSelecionado?.CARGO != "MONTADOR") {
            state.isVendedoresSelected = true;
            state.isMontadoresSelected = false;
            emit("opcaoCargoEscolhido", 0);
        }

        if (funcionarioSelecionado?.CARGO == "MONTADOR") {
            state.isVendedoresSelected = false;
            state.isMontadoresSelected = true;
            emit("opcaoCargoEscolhido", 1);
        }

        if (!funcionarioSelecionado || Object.keys(funcionarioSelecionado).length == 0) {
            Swal.fire({
                icon: "error",
                text: "Escolha um funcionário.",
            });
            return;
        }

        state.funcionarioSelecionado = funcionarioSelecionado;
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
        state.infoFuncionario = props.metaVendedores.filter(funcionario => funcionario.VALOR_META !== 0 && funcionario.VALOR_META !== null);
        emit("opcaoCargoEscolhido", 0);
    };

    const selecionarMontadores = () => {
        state.isVendedoresSelected = false;
        state.isMontadoresSelected = true;
        state.infoFuncionario = props.metaMontadores.filter(funcionario => funcionario.VALOR_META !== 0 && funcionario.VALOR_META !== null);
        emit("opcaoCargoEscolhido", 1);
    };

    const enviarDadosMeta = (dadosParaInserirMeta: { funcionario: iResponseFuncionarios, valorMeta: number }) => {
        const arrayAtualizaMeta = [
            {
                "CPF": dadosParaInserirMeta.funcionario.CPF,
                "VALOR_META": utils.formatValorUSA(dadosParaInserirMeta.valorMeta.toString()),
            }
        ];

        arrayAtualizaMeta.forEach((itemAtualizaMeta) => {
            const funcionarioIndex = state.infoFuncionario.findIndex((funcionario) => funcionario.CPF === itemAtualizaMeta.CPF);

            if (funcionarioIndex !== -1) {
                state.infoFuncionario[funcionarioIndex].VALOR_META = itemAtualizaMeta.VALOR_META;
            }
        });

        emit("inserirMeta", dadosParaInserirMeta);
    };

    const fecharModal = () => {
        state.modalAtribuirMetaIndividual.close();
    }

    const totalMetas = computed(() => {
        let totalDistribuido = 0;
        let qtdFuncionarios = state.infoFuncionario.length

        state.infoFuncionario.forEach((item) => {
            totalDistribuido += item?.VALOR_META || 0;
        });

        return { totalDistribuido, qtdFuncionarios };
    });


    return {
        actions,
        state,
        selecionarVendedores,
        selecionarMontadores,
        atribuirMetaIndividual,
        funcionariosOrdenados,
        enviarDadosMeta,
        fecharModal,
        funcionarioFiltrado,
        totalMetas
    }
}

