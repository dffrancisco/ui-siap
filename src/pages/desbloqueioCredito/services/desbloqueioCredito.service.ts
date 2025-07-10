import axios from "axios";
import { iCredito } from "../interfaces";
const caminho = 'siap/desbloqueioCredito'
type iGetCredito = (param:string) => Promise<iCredito>
type iUpdateCredito = (param:string) => Promise<string>


const getCredito: iGetCredito  = async (param: string) => {
    let { data } = await axios.post(caminho, {
        call: "getCredito",
        param
    });
    return data;
}

const updateCredito:iUpdateCredito = async(param: string) => {
        let { data } = await axios.post(caminho, {
        call: "updateTabela",
        param
    });
    return data;
}


export default {getCredito, updateCredito }