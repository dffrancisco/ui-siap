import axios from "axios";
import { iGetChamadosResponse, iParamGetChamados, iVerDetalhesChamadoResponse } from "../interfaces";

type iGetChamadosFunction = (param: iParamGetChamados) => Promise<iGetChamadosResponse>
type iVerDetalhesChamadoFunction = (keyJira: string) => Promise<iVerDetalhesChamadoResponse>

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

export default {
    getChamados,
    verDetalhesChamado
}