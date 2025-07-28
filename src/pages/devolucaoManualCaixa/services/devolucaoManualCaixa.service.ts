import axios from "axios";
import { iDadosDaDevolucao, iDadosDoCaixa } from "../interfaces";
const caminho = 'siap/devolucaoManualCaixa'
type iGetDadosDaDevolucao = (param:string) => Promise <iDadosDaDevolucao[]>

const getCaixasDoDia = async () => {
    let { data } = await axios.post(caminho, {
        call: "getCaixasDoDia",
    });
    return data;
}

const getDadosDaDevolucao:iGetDadosDaDevolucao = async (idDevolucao) =>{
    let {data} = await axios.post(caminho,{
        call:"getDadosDaDevolucao",
        param:{
            idDevolucao
        }
    });
    return data;
}

 export default {getCaixasDoDia, getDadosDaDevolucao}