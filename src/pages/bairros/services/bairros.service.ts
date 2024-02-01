import axios from "axios";
import { 
        iGetBairrosResponse, 
        iGetDuplicidadeResponse,
        iParamDuplicity, 
        iParamGetBairros 
} from "../interfaces"

const caminho = 'siap/bairros';

type iGetBairrosFunction = (param: iParamGetBairros) => Promise<iGetBairrosResponse>;
type iGetDuplicidadeFunction = (param: iParamDuplicity) => Promise<iGetDuplicidadeResponse>;

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
}

export default {
    getBairros,
    getDuplicidade
}