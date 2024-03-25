import axios from "axios";
import { iGetVendasPorMarcaResponse, iParamGetVendasPorMarca } from "../interfaces";
const caminho = 'siap/vendaPorMarca'

type iGetVendasPorMarcaFunction = (param: iParamGetVendasPorMarca) => Promise<iGetVendasPorMarcaResponse[]>

const getVendasPorMarca: iGetVendasPorMarcaFunction = async ({ param }) => {
    let { data } = await axios.post(caminho, {
        call: "getVendasPorMarca",
        param
    })

    return data;
}

export default { getVendasPorMarca };