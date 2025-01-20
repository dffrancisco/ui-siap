import axios from "axios";
import { iCategorias, iGetItens, iItemAdcPedido, iItens, iPedidosInsumos } from "../interfaces";
type iGetCategoriasFunction = () => Promise<iCategorias[]>;
type iGetItensFunction = (param: iGetItens) => Promise<iItens[]>;
type iGetPedidosFunction = (ano: number | string) => Promise<iPedidosInsumos[]>;
type iSetItemPedido = (item: iItemAdcPedido) => Promise<any>;
type iDeleteItemPedido = (idItem: number) => Promise<string>;
type iFinalizarPedido = (idPedido: number) => Promise<string>;;

const caminho = 'siap/solicitarInsumos'

const getCategorias: iGetCategoriasFunction = async () => {
    let { data } = await axios.post(caminho, {
        call: "getCategorias"
    });
    return data;
}

const getItens: iGetItensFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getItens",
        param,
    });
    return data;
}

const iniciarPedido = async () => {
    let { data } = await axios.post(caminho, {
        call: "iniciarPedido"
    });
    return data;
}

const getPedidos: iGetPedidosFunction = async (ano) => {
    let { data } = await axios.post(caminho, {
        call: "getPedidos",
        ano
    });
    return data;
}

const adicionarItemAoPedido: iSetItemPedido = async (item) => {
    let { data } = await axios.post(caminho, {
        call: "adicionarItemAoPedido",
        item,
    });
    return data;
}

const removerItemDoPedido: iDeleteItemPedido = async (idItem) => {
    let { data } = await axios.post(caminho, {
        call: "removerItemDoPedido",
        idItem,
    });
    return data;
}

const finalizarPedido: iFinalizarPedido = async (idPedido) => {
    let { data } = await axios.post(caminho, {
        call: "finalizarPedido",
        idPedido,
    });
    return data;
}

export default {
    getCategorias,
    getItens,
    iniciarPedido,
    getPedidos,
    adicionarItemAoPedido,
    removerItemDoPedido,
    finalizarPedido,
}