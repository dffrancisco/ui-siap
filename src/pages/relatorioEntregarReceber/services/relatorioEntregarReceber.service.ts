import axios from "axios";
// import { iParamsParaRelatorio, iResponseDadosProdutosVendidos } from "../interfaces";

const caminho = 'siap/relatorioEntregarReceber';

// type iGetDadosProdutosVendidos = (param: iParamsParaRelatorio) => Promise<iResponseDadosProdutosVendidos>;


const getDadosParaRelatorio: any = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getDadosParaRelatorio",
        param
    });
    return data;
}

export default {
    getDadosParaRelatorio
}
