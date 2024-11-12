import axios from "axios";
import { iClientes, iGetClientes } from "../interfaces";
type iGetClientesFuction = (param: iGetClientes, offset: number) => Promise<iClientes>

const caminho = 'siap/cliente'


const getClientes: iGetClientesFuction = async (param, offset) => {
    const { data } = await axios.post(caminho, {
        call: "getClientes",
        offset,
        param
    });

    return data;
}

export default {
    getClientes,
}