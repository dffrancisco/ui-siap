import axios from "axios";
import { 
        iGetBairrosResponse, 
        iGetDuplicidadeResponse,
        iToInsertResponse,
        iParamDuplicity, 
        iParamGetBairros, 
        iParamToInsert,
        iParamToUpdate,
        iToUpdateResponse
} from "../interfaces"

const caminho = 'siap/bairros';

type iGetBairrosFunction = (param: iParamGetBairros) => Promise<iGetBairrosResponse>;
type iGetDuplicidadeFunction = (param: iParamDuplicity) => Promise<iGetDuplicidadeResponse>;
type iToInsertFunction = (param: iParamToInsert) => Promise<iToInsertResponse>;
type iToUpdateFunction = (param: iParamToUpdate) => Promise<iToUpdateResponse>;

const getBairros: iGetBairrosFunction = async ({param, offset}) => {
    let {data} = await axios.post(caminho, {
        call: "getBairros",
        offset,
        param
    });

    return data;
};

const getDuplicidade: iGetDuplicidadeFunction = async ({field, value}) => {
    let {data} = await axios.post(caminho, {
        call: "getDuplicidade",
        field,
        value
    });

    return data;
};

const toInsert: iToInsertFunction = async (newParams) => {
    let {data} = await axios.post(caminho, {
        call: "insert",
        param: newParams
    });

    return data;
};

const toUpdate: iToUpdateFunction = async (param: iParamToUpdate) => {
    let {data} = await axios.post(caminho, {
        call: "update",
        param
    });

    return data;
};

const toDelete = async (id_bairro: number) => {
    let {data} = await axios.post(caminho, {
        call: "delete",
        param: {
            ID_BAIRRO: id_bairro
        }
    });

    return data;
}

export default {
    getBairros,
    getDuplicidade,
    toInsert,
    toUpdate,
    toDelete
}