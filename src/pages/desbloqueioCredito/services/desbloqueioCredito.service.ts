import axios from "axios";
const caminho = 'siap/desbloqueioCredito'

const getEnviaChave  = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getEnviaChave",
        param
    });
    return data;
}

export default {getEnviaChave}