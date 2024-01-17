import axios from 'axios';
import { state } from '../corredores';
import { 
    iCorredor, 
    iLocalidade, 
    iParamGetCorredores,
    iFieldDuplicity,
    iCorredorResponse,
    iParamToInsert, 
    iGetDuplicityResponse,
    iParamToUpdate
} from '../interfaces';

const caminho = 'siap/corredores'

type iGetCorredoresFunction = (param: iParamGetCorredores) => Promise<iCorredorResponse[]>;
type iGetDuplicityFunction = (param: iFieldDuplicity) => Promise<iGetDuplicityResponse[]>
type iToInsertFunction = (param: iParamToInsert) => Promise<void>
type iToUpdateFunction = (param: iParamToUpdate) => Promise<void>

const getCorredores: iGetCorredoresFunction =  async ({ offset, param }) => {
    let { data } = await axios.post(caminho, {
        call: 'getCorredores',
        offset,
        param
    })
    return data;
}

const getLocalidades = async () => {
    let { data } = await axios.post(caminho, {
        call: "getLocalidades"
    });

    state.dsLocalidades = data;

    return state;
}

const getDuplicidade: iGetDuplicityFunction = async ({ field, value }) => {
    let { data } = await axios.post(caminho, {
        call: "getDuplicidade",
        field,
        value,
    });

    return data;
};

const toInsert: iToInsertFunction = async (newFields) => {
    let { data } = await axios.post(caminho, {
        call: "insert",
        param: newFields
    })

    return data
}

const toDelete = async () => {
    return axios.post(caminho, {
        call: "delete",
        cod_corredor: state.gridPrincipal.dataSource().ID,
    });
};

const toUpdate: iToUpdateFunction = async (param: any) => {
    console.log(param)
    let { data } = await axios.post(caminho, {
        call: 'update',
        param
    })

    return data
}

export default { 
    getCorredores, 
    getLocalidades, 
    toInsert,
    getDuplicidade,
    toUpdate,
    toDelete
 }