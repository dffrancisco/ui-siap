import axios from 'axios';
import { iGetRelatorioMontagensResponse, iParamGetRelatorioMontagens } from '../interfaces';

const caminho = "siap/consultaMontagem"

type iGetRelatorioMontagensFunction = (param: iParamGetRelatorioMontagens) => Promise<iGetRelatorioMontagensResponse[]>;

const getRelatorioMontagens: iGetRelatorioMontagensFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getRelatorioMontagens",
        param
    });
    return data
};

export default {
    getRelatorioMontagens
}