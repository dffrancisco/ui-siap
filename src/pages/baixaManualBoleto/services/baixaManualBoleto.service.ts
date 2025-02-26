import axios from "axios";
import { iClientesFaturados, iGetClientesFaturados, iParamGetOrcamentos } from "../interfaces";
type iGetClientesFaturadosFuction = (param: iGetClientesFaturados, offset: number) => Promise<iClientesFaturados>
type iGetOrcamentosEBoletosEmAbertoFunction = (param: iParamGetOrcamentos) => Promise<any>

const caminho = 'siap/baixaManualBoleto'

const getClientesFaturados: iGetClientesFaturadosFuction = async (param, offset) => {
    const { data } = await axios.post(caminho, {
        call: "getClientesFaturados",
        offset,
        param
    });

    return data;
}

const getOrcamentosEBoletosEmAberto: iGetOrcamentosEBoletosEmAbertoFunction = async (param: iParamGetOrcamentos) => {
    const { data } = await axios.post(caminho, {
        call: "getOrcamentosEBoletosEmAberto",
        param
    });
    return data;
}

export default {
    getClientesFaturados,
    getOrcamentosEBoletosEmAberto
}