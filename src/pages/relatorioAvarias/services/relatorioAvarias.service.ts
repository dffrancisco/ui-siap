import axios from "axios";
import { iDadosRelatorioAvarias, iMarcas } from "../interfaces";

const caminho = 'siap/relatorioAvarias'
type iGetMarcas = () => Promise<iMarcas[]>
type iGetDadosRelatorioAvarias = (param) => Promise<iDadosRelatorioAvarias[]>

const getMarcas: iGetMarcas = async () => {
    let { data } = await axios.post(caminho, {
        call: "getMarcas",
    });

    return data;
}

const getDadosRelatorioAvarias: iGetDadosRelatorioAvarias = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getDadosRelatorioAvarias",
        param
    });

    return data;
}

export default {
    getMarcas,
    getDadosRelatorioAvarias,
};