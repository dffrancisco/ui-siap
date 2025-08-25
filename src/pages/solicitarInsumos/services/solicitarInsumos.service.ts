import axios from "axios";
import { iDadosIniciais, iItemAdcPedido, iPedido, iResponseIdItem } from "../interfaces";
type iGetDadosIniciaisFunction = () => Promise<iDadosIniciais>
type iGetPedidosFunction = (ano: number | string) => Promise<iPedido[]>;
type iSetItemPedido = (item: iItemAdcPedido) => Promise<iResponseIdItem>;
type iDeleteItemPedido = (idItem: number) => Promise<string>;
type iFinalizarPedido = (idPedido: number) => Promise<string>;;

const caminho = 'taap/solicitarInsumos'

const getDadosIniciais: iGetDadosIniciaisFunction = async () => {
    let { data } = await axios.post(caminho, {
        call: "getDadosIniciais"
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
    getDadosIniciais,
    iniciarPedido,
    getPedidos,
    adicionarItemAoPedido,
    removerItemDoPedido,
    finalizarPedido,
}