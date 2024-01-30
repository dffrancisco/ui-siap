import axios from 'axios';
import { 
    iParamGetImpressorasTermicas, 
    iImpressorasTermicasResponse, 
    iFieldDuplicity, 
    iGetDuplicityResponse,
    iParamToInsert, 
    iParamToUpdate
} from '../intefaces';

const caminho = 'siap/impressorasTermicas';

type iGetImpressorasFunction = (param: iParamGetImpressorasTermicas) => Promise<iImpressorasTermicasResponse[]>;
type iGetDuplicityFunction = (param: iFieldDuplicity) => Promise<iGetDuplicityResponse[]> ;
type iToInsertFuction = (param: iParamToInsert) => Promise<void>;
type iToUpdateFunction = (param: iParamToUpdate) => Promise<void>;

const getImpressorasTermicas: iGetImpressorasFunction =  async ({ offset, param }) => {
    let { data } = await axios.post(caminho, {
        call: 'getImpressorasTermicas',
        offset,
        param
    })
    return data;
};

const getDrivers = async () => {
    let { data } = await axios.post(caminho, {
        call: 'getDrivers'
    });

    return data;
};

const getDuplicidade: iGetDuplicityFunction = async ({ field, value }) => {
    let { data } = await axios.post(caminho, {
        call: 'getDuplicidade',
        field,
        value
    });

    return data;
};

const toInsert: iToInsertFuction = async (newFields) => {
    
    let { data } = await axios.post(caminho, {
        call: 'insert',
        param: newFields
    })

    return data;
};

const toDelete = async (id_impressora) => {
    return await axios.post(caminho, {
        call: 'delete',
        id_impressora: id_impressora
    })
};

const toUpdate: iToUpdateFunction = async (param: any) => {
    console.log(param); 
    let { data } = await axios.post(caminho, {
        call: 'update',
        param
    })

    return data;
}

export default { 
    getImpressorasTermicas,
    getDrivers,
    getDuplicidade,
    toInsert,
    toDelete,
    toUpdate
};