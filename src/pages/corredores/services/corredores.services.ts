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
    iDiffToUpdate
} from '../interfaces';

const caminho = 'siap/corredores'

type iGetCorredoresFunction = (param: iParamGetCorredores) => Promise<iCorredorResponse[]>;
type iGetDuplicityFunction = (param: iFieldDuplicity) => Promise<iGetDuplicityResponse[]>
type iToInsertFunction = (param: iParamToInsert) => Promise<void>
type iToUpdateFunction = (diff: iDiffToUpdate) => Promise<void>

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

const toUpdate: iDiffToUpdate = async ({ diff }) => {
    console.log(diff)
    let { data } = await axios.post(caminho, {
        call: 'update',
        cod_corredor: state.gridPrincipal.dataSource().ID,
        diff
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