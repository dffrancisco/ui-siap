import axios from "axios";
import { iGetClientesFaturadosParam, iGetClientesFaturadosResponse } from "../interfaces";

const caminho = 'siap/faturarCliente'

type iGetClientesFaturadosFuctions = (param: iGetClientesFaturadosParam, offset: number) =>
    Promise<iGetClientesFaturadosResponse>

const getClientesFaturados: iGetClientesFaturadosFuctions = async (param, offset) => {
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