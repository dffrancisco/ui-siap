import axios from 'axios';
import { state } from '../corredores';
import { 
    iCorredor, 
    iLocalidade, 
    iParamGetCorredores,
    iCorredorResponse,
    iParamToInsert 
} from '../interfaces';

const caminho = 'siap/corredores'

type iGetCorredoresFunction = (param: iParamGetCorredores) => Promise<iCorredorResponse[]>;
type iToInsertFunction = (param: iParamToInsert) => Promise<void>

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

const toInsert: iToInsertFunction = async (newFields) => {
    let { data } = await axios.post(caminho, {
        call: "insert",
        param: newFields
    })

    return data
}

export default { getCorredores, getLocalidades, toInsert }