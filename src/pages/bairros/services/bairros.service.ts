import axios from "axios";
import { 
        iGetBairrosResponse, 
        iGetDuplicidadeResponse,
        iInsertResponse,
        iParamDuplicity, 
        iParamGetBairros, 
        iParamInsert,
        iParamUpdate,
        iUpdateResponse
} from "../interfaces"

const caminho = 'siap/bairros';

type iGetBairrosFunction = (param: iParamGetBairros) => Promise<iGetBairrosResponse>;
type iGetDuplicidadeFunction = (param: iParamDuplicity) => Promise<iGetDuplicidadeResponse>;
type iInsertFunction = (param: iParamInsert) => Promise<iInsertResponse>;
type iUpdateFunction = (param: iParamUpdate) => Promise<iUpdateResponse>;

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

const insert: iInsertFunction = async (newParams) => {
    let {data} = await axios.post(caminho, {
        call: "insert",
        param: newParams
    });

    return data;
};

const update: iUpdateFunction = async (param: iParamUpdate) => {
    let {data} = await axios.post(caminho, {
        call: "update",
        param
    });

    return data;
};

export default {
    getBairros,
    getDuplicidade,
    insert,
    update
}