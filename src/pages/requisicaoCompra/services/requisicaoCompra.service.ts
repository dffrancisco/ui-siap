import axios from "axios";
import { iGetFavorecidosParam, iGetFavorecidosResponse } from "../interfaces";

const caminho = "siap/requisicaoCompra"

type iGetFavorecidosFunction = (param: iGetFavorecidosParam, offset: number) => Promise<iGetFavorecidosResponse>

const getFavorecidos: iGetFavorecidosFunction = async (param, offset) => {
    let { data } = await axios.post(caminho, {
        call: "getFavorecidos",
        offset,
        param
    })
    return data;
}

export default { getFavorecidos };