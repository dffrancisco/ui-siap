import axios from "axios";
type iGetDadosIniciaisConfigBoleto = () => Promise<any>
const caminho = "siap/configBoleto";

const getDadosIniciaisConfigBoleto: iGetDadosIniciaisConfigBoleto = async () => {
    let { data } = await axios.post(caminho, {
        call: "getDadosIniciaisConfigBoleto"
    });
    return data;
}

export default {
    getDadosIniciaisConfigBoleto
};