import axios from "axios"
import { iFiltro, iGetDadosToSelectsResponse, iGetAvariasResponse, iGetImgsResponse, iFinalizarAvariaParam, iFinalizarAvariaResponse, iDeletarAvariaResponse } from "../interfaces"

const caminho = 'siap/revisaoAvarias'

type iGetDadosToSelects = () => Promise<iGetDadosToSelectsResponse>
type iGetAvariasFunction = (filtros: iFiltro) => Promise<iGetAvariasResponse[]>
type iGetImgsFunction = (idAvaria: number) => Promise<iGetImgsResponse>
type iFinalizarAvariaFunction = (param: iFinalizarAvariaParam) => Promise<iFinalizarAvariaResponse>
type iDeletarAvariaFunction = (idAvaria: number) => Promise<iDeletarAvariaResponse>

const getDadosToSelects: iGetDadosToSelects = async () => {
    const { data } = await axios.post(caminho, {
        call: 'getDadosToSelects'
    })

    return data;
}

const getAvarias: iGetAvariasFunction = async (filtros) => {
    const { data } = await axios.post(caminho, {
        call: 'getAvarias',
        filtros
    })

    return data;
}

const getImgs: iGetImgsFunction = async (idAvaria) => {
    const { data } = await axios.post(caminho, {
        call: 'getImgs',
        idAvaria
    })

    return data;
}

const finalizarAvaria: iFinalizarAvariaFunction = async (param) => {
    const { data } = await axios.post(caminho, {
        call: 'finalizarAvaria',
        param
    })

    return data;
}

const deletarAvaria: iDeletarAvariaFunction = async (idAvaria) => {
    const { data } = await axios.post(caminho, {
        call: 'deletarAvaria',
        idAvaria
    })

    return data;
}

export default {
    getDadosToSelects,
    getAvarias,
    getImgs,
    finalizarAvaria,
    deletarAvaria
}