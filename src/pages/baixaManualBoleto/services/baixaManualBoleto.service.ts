import axios from "axios";
import { iClientesFaturados, iGetClientesFaturados } from "../interfaces";
type iGetClientesFaturadosFuction = (param: iGetClientesFaturados, offset: number) => Promise<iClientesFaturados>


const caminho = 'siap/baixaManualBoleto'

const getClientesFaturados: iGetClientesFaturadosFuction = async (param, offset) => {
    const { data } = await axios.post(caminho, {
        call: "getClientesFaturados",
        offset,
        param
    });

    return data;
}

export default {
    getClientesFaturados,
}