import axios from "axios";
import { iFuncionario, iMarcas } from "../interfaces";

const caminho = 'siap/filtro'

type iGetFuncionarios = () => Promise<iFuncionario[]>
type iGetMarcas = () => Promise<iMarcas[]>


const getFuncionarios: iGetFuncionarios = async () => {
    let { data } = await axios.post(caminho, {
        call: "getFuncionarios",
    });

    return data;
}

const getMarcas: iGetMarcas = async () => {
    let { data } = await axios.post(caminho, {
        call: "getMarcas",
    });

    return data;
}

const getCarros = async () => {
    let { data } = await axios.post(caminho, {
        call: "getCarros"
    });

    return data;
}

const getFiltros = async () => {
    let { data } = await axios.post(caminho, {
        call: "getFiltros"
    });

    return data;
}

export default {
    getFuncionarios,
    getMarcas,
    getCarros,
    getFiltros
}