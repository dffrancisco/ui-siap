import { onMounted, reactive, ref } from "vue";


export const setup = (props: any) => {


    const state = reactive({
        loading: false,
    })

    const vendedores = ref([]);

    onMounted(() => {
        vendedores.value = props.dadosParaDistribuirMetas.vendedores;
    });

    const actions = {
        // async init(mes: number, ano: number) {
        //     state.loading = true;


        //     state.loading = false;
        // },


        getFotoFuncionarioURL(cpf: string) {
            if (!cpf) {
                return "";
            }

            const cpfSanitizado = cpf.replaceAll(".", "").replaceAll("-", "");
            return `https://www.reallatas.com.br/_serverAPP/thumb.php?img=http://www.reallatas.com.br/foto_funcionarios/${cpfSanitizado}.jpg`;
        },


    }

    return {
        actions,
        state,
        vendedores
    }
}

