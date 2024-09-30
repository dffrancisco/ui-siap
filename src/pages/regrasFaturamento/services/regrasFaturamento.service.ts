import axios from "axios";
import { iGetRegraFaturamentoResponse } from "../interfaces";

const caminho = 'siap/regrasFaturamento'

type getRegraFaturamentoFunction = () => Promise<iGetRegraFaturamentoResponse>

const getRegraFaturamento: getRegraFaturamentoFunction = async () => {
    let { data } = await axios.post(caminho, {
        call: "getRegraFaturamento"
    })

    return data
}

export default { getRegraFaturamento }