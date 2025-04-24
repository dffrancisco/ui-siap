import axios from 'axios';
import {
    iResponseDadosInputs,
    updatePayload
} from '../interfaces';


type iGetDadosParaInputs = () => Promise<iResponseDadosInputs>;

const caminho = 'siap/configuracaoNfe';

const getDadosParaInputs: iGetDadosParaInputs = async () => {
    const { data } = await axios.post(caminho, {
        call: 'getDadosParaInputs'
    });
    return data;
};

const updateNfeConfig = async (param: updatePayload) => {
    let { data } = await axios.post(caminho, {
        call: 'updateNfe',
        param
    });
    return data;
};


export default {
    getDadosParaInputs,
    updateNfeConfig,

};