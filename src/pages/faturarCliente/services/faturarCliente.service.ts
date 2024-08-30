import axios from "axios";

const caminho = 'siap/faturarCliente'

type getClientesFaturadosFuctions = ({ param, offset }) => Promise<void>

const getClientesFaturados: getClientesFaturadosFuctions = async ({ param, offset }) => {
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