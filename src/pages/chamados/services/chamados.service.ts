import axios from "axios";
import { iGetChamadosResponse, iInsertChamado, iInsertChamadoResponse, iParamGetChamados, iVerDetalhesChamadoResponse } from "../interfaces";

type iGetChamadosFunction = (param: iParamGetChamados) => Promise<iGetChamadosResponse>
type iVerDetalhesChamadoFunction = (keyJira: string) => Promise<iVerDetalhesChamadoResponse>
type iInsertChamadoFunction = (param: iInsertChamado) => Promise<iInsertChamadoResponse>

const getChamados: iGetChamadosFunction = async ({ page, itemsPerPage, sortBy, search }) => {
    let { data } = await axios.post('siap/chamados', {
        call: 'getChamados',
        param: {
            page,
            itemsPerPage,
            sortBy,
            search,
        }
    });

    return data;
}

const verDetalhesChamado: iVerDetalhesChamadoFunction = async (keyJira) => {
    let { data } = await axios.post('siap/chamados', {
        call: 'verDetalhesChamado',
        param: {
            keyJira,
        },
    });
    return data;
}

const insertChamado: iInsertChamadoFunction = async (param) => {
    let { data } = await axios.post('siap/chamados', {
        call: 'insert',
        param
    });
    return data;
}


export default {
    getChamados,
    verDetalhesChamado,
    insertChamado
}