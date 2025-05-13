import axios from "axios";

const caminho = 'siap/estoqueOrganico'

type iGetDadosParaInputs = () => Promise<any>;

const getDadosParaInputs: iGetDadosParaInputs = async () => {
    let { data } = await axios.post(caminho, {
        call: "getDadosParaInputs",
    });
    return data;
}

export default {
    getDadosParaInputs
}