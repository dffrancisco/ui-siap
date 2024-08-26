import axios from "axios";
import { iAprovar, iGetSugestaoCompraAlteracao, iReprovar, iResponseSugestaoCompraAlteracao } from "../interfaces";

const caminho = 'siap/sugestaoCompraAlteracao'

type iGetSugestaoCompraAlteracaoFunction = (param: iGetSugestaoCompraAlteracao) => Promise<iResponseSugestaoCompraAlteracao>;
type iAprovarFunction = (param: iAprovar) => Promise<iAprovar>
type iReprovarFunction = (param: iReprovar) => Promise<iReprovar>

const getSugestaoCompraAlteracao: iGetSugestaoCompraAlteracaoFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getSugestaoCompraAlteracao",
        param
    });
    return data;
}

const aprovarSugestao: iAprovarFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "aprovarSugestao",
        param
    });
    return data;
}


const reprovarSugestao: iReprovarFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "reprovarSugestao",
        param
    });
    return data;
}


export default {
    getSugestaoCompraAlteracao,
    aprovarSugestao,
    reprovarSugestao
}