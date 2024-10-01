import axios from "axios";
import { iGetRegraFaturamentoResponse, iUpdateOrInsertRegraFaturamentoParam, iUpdateOrInsertRegraFaturamentoResponse } from "../interfaces";

const caminho = 'siap/regrasFaturamento'

type getRegraFaturamentoFunction = () => Promise<iGetRegraFaturamentoResponse>
type updateOrInsertRegraFaturamentoFunction = (param: iUpdateOrInsertRegraFaturamentoParam) =>
    Promise<iUpdateOrInsertRegraFaturamentoResponse>

const getRegraFaturamento: getRegraFaturamentoFunction = async () => {
    let { data } = await axios.post(caminho, {
        call: "getRegraFaturamento"
    })

    return data
}

const updateOrInsertRegraFaturamento: updateOrInsertRegraFaturamentoFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "updateOrInsertRegraFaturamento",
        param
    })

    return data;
}

export default { getRegraFaturamento, updateOrInsertRegraFaturamento }