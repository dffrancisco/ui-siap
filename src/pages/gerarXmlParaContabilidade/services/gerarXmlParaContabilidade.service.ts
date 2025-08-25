import axios from "axios";
import { iParamGerarXml } from "../interfaces";
type iGerarXmlParaContabilidade = (param: iParamGerarXml) => Promise<string>

const caminho = 'taap/gerarXmlParaContabilidade'

const gerarXmlParaContabilidade: iGerarXmlParaContabilidade = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "gerarXmlParaContabilidade",
        param
    });
    return data;
}


export default {
    gerarXmlParaContabilidade,
}