import axios from "axios";
import { iGetDuplicityGrupoImpressaoResponse, iGetGruposImpressaoResponse, iParamGetDuplicityGrupoImpressao, iParamGetGruposImpressao } from "../interfaces";

const caminho = 'siap/gruposFuncionarios'

type iGetGruposImpressaoFunction = ({ offset, param }: iParamGetGruposImpressao) =>
    Promise<iGetGruposImpressaoResponse>
type iGetDuplicityGrupoImpressaoFunction = ({ field, value }: iParamGetDuplicityGrupoImpressao) =>
    Promise<iGetDuplicityGrupoImpressaoResponse>

const getGruposImpressao: iGetGruposImpressaoFunction = async ({ offset, param }) => {
    let { data } = await axios.post(caminho, {
        call: "getGruposImpressao",
        offset,
        param
    })
    return data;
}

const getDuplicityGrupoImpressao: iGetDuplicityGrupoImpressaoFunction = async ({ field, value }) => {
    let { data } = await axios.post(caminho, {
        call: "getDuplicityGrupoImpressao",
        field,
        value
    })
    return data;
}

export default { getGruposImpressao, getDuplicityGrupoImpressao }