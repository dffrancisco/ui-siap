import axios from "axios";
import { iCliente, iMotorista, iTotalizador } from "../interface";

const caminho = 'taap/entregarReceber'

type iGetMotoristasPendentesFunction = () => Promise<iMotorista[]>
type iGetClientesPendentesFunction = () => Promise<iCliente[]>
type iGetTotalizadoresFunction = () => Promise<iTotalizador>

const getMotoristasPendentes: iGetMotoristasPendentesFunction = async () => {
    let { data } = await axios.post(caminho, {
        call: 'getMotoristasPendentes'
    })

    return data;
}

const getClientesPendentes: iGetClientesPendentesFunction = async () => {
    let { data } = await axios.post(caminho, {
        call: 'getClientesPendentes'
    })

    return data;
}

const getTotalizadores: iGetTotalizadoresFunction = async () => {
    let { data } = await axios.post(caminho, {
        call: 'getTotalizadores'
    })

    return data;
}

export default {
    getMotoristasPendentes,
    getClientesPendentes,
    getTotalizadores,
}