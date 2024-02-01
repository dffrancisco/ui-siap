import axios from "axios";
import { iGetBairrosResponse, iParamGetBairros } from "../interfaces"

const caminho = 'siap/bairros';

type iGetBairrosFunction = (param: iParamGetBairros) => Promise<iGetBairrosResponse>;

const getBairros: iGetBairrosFunction = async ({param, offset}) => {
    let {data} = await axios.post(caminho, {
        call: "getBairros",
        offset,
        param
    });

    return data;
};

export default {
    getBairros
}