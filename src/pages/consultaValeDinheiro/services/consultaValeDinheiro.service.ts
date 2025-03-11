import axios from "axios";
import { iResponseDadosInput, } from "../interfaces";

const caminho = 'siap/consultaValeDinheiro'

type iGetDadosParaInputs = () => Promise<iResponseDadosInput>;


const getDadosParaInputs: iGetDadosParaInputs = async () => {
    let { data } = await axios.post(caminho, {
        call: "getDadosParaInputs",
    });
    return data;
}



export default {
    getDadosParaInputs,

}