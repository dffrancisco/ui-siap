import axios from "axios";
import { iCredito } from "../interfaces";
const caminho = 'siap/desbloqueioCredito'
type iGetCredito = (param:string) => Promise<iCredito>
type iDesbloquearCredito = (param:string) => Promise<string>


const getCredito: iGetCredito  = async (chave: string) => {
    let { data } = await axios.post(caminho, {
        call: "getCredito",
        param: {
            chave
        }
    });
    return data;
}

const desbloquearCredito:iDesbloquearCredito = async(chave: string) => {
        let { data } = await axios.post(caminho, {
        call: "desbloquearCredito",
        param: {
            chave
        }
    });
    return data;

}


export default {getCredito, desbloquearCredito }