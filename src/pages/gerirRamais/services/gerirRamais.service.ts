import axios from "axios";
import {
    iParamToInsertRamal,
    iParamToUpdateRamal,
    iRamal,
    iDadosInputs,
    iGetDuplicityResponseRamal,
    iFieldDuplicity,
} from "../interfaces";
type iGetDadosParaInputs = () => Promise<iDadosInputs>


const caminho = "taap/gerirRamais";

const getRamais = async (param: string): Promise<iRamal[]> => {
    const { data } = await axios.post(caminho, {
        call: "getRamais",
        param,
    });
    return data;
};

const getDuplicidade = async ({ value, field }: iFieldDuplicity): Promise<iGetDuplicityResponseRamal> => {
    const { data } = await axios.post(caminho, {
        call: "getDuplicidade",
        value,
        field
    });
    return data;
};

const toInsert = async (newFields: iParamToInsertRamal): Promise<iRamal> => {
    const { data } = await axios.post(caminho, {
        call: "toInsert",
        param: newFields,
    });
    return data;
};

const toUpdate = async (param: iParamToUpdateRamal): Promise<iRamal> => {
    const { data } = await axios.post(caminho, {
        call: "toUpdate",
        param,
    });
    return data;
};

const toDelete = async (id_ramal: number): Promise<string> => {
    const { data } = await axios.post(caminho, {
        call: "toDelete",
        id_ramal,
    });
    return data;
};


const getDadosParaInputs: iGetDadosParaInputs = async () => {
    let { data } = await axios.post(caminho, {
        call: "getDadosParaInputs",
    });
    return data;
}

export default {
    getRamais,
    getDuplicidade,
    getDadosParaInputs,
    toInsert,
    toUpdate,
    toDelete,
};
