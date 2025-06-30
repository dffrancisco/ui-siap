import axios from "axios";
const caminho = 'siap/desbloqueioCredito'

const getCredito  = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getCredito",
        param
    });
    return data;
}


export default {getCredito}