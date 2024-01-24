import axios from "axios"
import { iFieldDuplicity, iGetDuplicityResponse, iMarcasResponse, iParamGetMarcas, iParamToInsert } from "../interfaces"

const caminho = 'siap/marcas'

type iGetMarcasFunction = (param: iParamGetMarcas) => Promise<iMarcasResponse[]>;
type iGetDuplicidadeFunction = (param: iFieldDuplicity) => Promise<iGetDuplicityResponse[]>;
type iToInsertFuction = (param: iParamToInsert) => Promise<void>;

const getMarcas: iGetMarcasFunction = async({offset, param}) => {
    let { data } = await axios.post(caminho, {
        call: 'getMarcas',
        offset,
        param
    })

    return data
};

const getGrupoMarcas = async () => {
    let { data } = await axios.post(caminho,{
        call: 'getGrupoMarcas',
    })

    return data
} ;

const toInsert: iToInsertFuction = async ({newFields}) => {
    console.log(newFields);
    
    let { data } = await axios.post(caminho, {
        call: 'insert',
        param: newFields,
        // ID_MARCA_GRUPO: ID_MARCA_GRUPO,
    })

    return data
};

const getDuplicidade: iGetDuplicidadeFunction = async({field, value}) => {
    let { data } = await axios.post(caminho, {
        call: 'getDuplicidade',
        field,
        value
    })

    return data
};

const toDelete = async (id_marca) => {
    return await axios.post(caminho, {
        call: 'delete',
        id_marca: id_marca
    })
};

export default {
    getMarcas,
    getGrupoMarcas,
    toInsert,
    getDuplicidade,
    toDelete
};