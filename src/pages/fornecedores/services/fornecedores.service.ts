import axios from "axios";
import { iParamGetFornecedor, iFornecedores } from '../interfaces';

const caminho = "siap/fornecedores";

const getFornecedores = async ({ param, offset }: iParamGetFornecedor): Promise<iFornecedores[]> => {
    const { data } = await axios.post(caminho, {
        call: "getFornecedores",
        offset,
        param,
    });
    return data;
};



export default {
    getFornecedores,
};
