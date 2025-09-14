import axios from "axios";
import { iCartoes, iParamCartoes, iParamUpdateCartoes } from "../interfaces";
const caminho = 'taap/cartoes'

type iGetCartaosFunction = () => Promise<iCartoes[]>;

const getCartoes: iGetCartaosFunction = async () => {
    let { data } = await axios.post(caminho, {
        call: "getCartoes",
    });
    return data
}

const insertCartoes = async (param: iParamCartoes) => {
    let { data } = await axios.post('taap/cartoes', {
        call: 'insertCartoes',
        param
    });
    return data;
}

const updateCartoes = async (param: iParamUpdateCartoes) => {
    let { data } = await axios.post(caminho, {
        call: "updateCartoes",
        param
    });

    return data
}
export default {
    getCartoes,
    updateCartoes,
    insertCartoes
}