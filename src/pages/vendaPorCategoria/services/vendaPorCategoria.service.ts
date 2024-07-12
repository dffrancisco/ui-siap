import axios from "axios";
import { iGetVendasPorCategoriaResponse, iParamGetVendasPorCategoria } from "../interfaces";

const caminho = 'siap/vendaPorCategoria'

type iGetVendasPorCategoriaFunction = (param: iParamGetVendasPorCategoria) =>
    Promise<iGetVendasPorCategoriaResponse[]>

const getVendasPorCategoria: iGetVendasPorCategoriaFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getVendasPorCategoria",
        param
    })

    return data;
}

export default {
    getVendasPorCategoria
};