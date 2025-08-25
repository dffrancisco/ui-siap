import axios from 'axios';
import {
    iGetMontagensResponse,
    iParamGetMontagens,
    iParamGetMontagemDetalhes,
    iGetMontagemDetalhesResponse
} from '../interfaces';

const caminho = "taap/consultaMontagem"

type iGetRelatorioMontagensFunction = (param: iParamGetMontagens) => Promise<iGetMontagensResponse[]>;
type iGetMontagemDetalhesFunction = (param: iParamGetMontagemDetalhes) => Promise<iGetMontagemDetalhesResponse>;

const getMontagens: iGetRelatorioMontagensFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getMontagens",
        param
    });
    return data
};

const getMontagemDetalhes: iGetMontagemDetalhesFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getMontagemDetalhes",
        param,
    })
    return data
}

export default {
    getMontagens,
    getMontagemDetalhes,
}