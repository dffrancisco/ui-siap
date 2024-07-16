import axios from "axios";
import { iGetMarcasGruposResponse, iGetVendasPorCategoriaResponse, iParamGetVendasPorCategoria } from "../interfaces";

const caminho = 'siap/vendaPorCategoria'

type iGetVendasPorCategoriaFunction = (param: iParamGetVendasPorCategoria) =>
    Promise<iGetVendasPorCategoriaResponse[]>

type iGetMarcasGruposFunction = () => Promise<iGetMarcasGruposResponse[]>

const getVendasPorCategoria: iGetVendasPorCategoriaFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getVendasPorCategoria",
        param
    })

    return data;
}

const getMarcasGrupos: iGetMarcasGruposFunction = async () => {
    let { data } = await axios.post(caminho, {
        call: "getMarcasGrupos"
    })

    return data;
}

export default {
    getVendasPorCategoria,
    getMarcasGrupos
};