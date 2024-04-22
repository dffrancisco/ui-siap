import axios from "axios";
import { iFuncionario, iMesEAno, iMetaMontador, iMetaVendedor, iMetaInserida, } from "../interfaces"

const caminho = "siap/metas";

type iGetMetasVendedores = (param: iMesEAno) => Promise<iMetaVendedor[]>
type iGetMetasMontadores = (param: iMesEAno) => Promise<iMetaMontador[]>
type iGetFuncionarios = (param: iMesEAno) => Promise<iFuncionario[]>
type iInserirMeta = (param: iMetaInserida) => Promise<iMetaInserida>

const getMetasVendedores: iGetMetasVendedores = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getMetasVendedores",
        param,
    });

    return data;
}

const getMetasMontadores: iGetMetasMontadores = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getMetasMontadores",
        param,
    });

    return data;
}

const getFuncionarios: iGetFuncionarios = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getFuncionarios",
        param,
    });

    return data;
}

const inserirMeta: iInserirMeta = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "inserirMeta",
        param,
    });
    return data;
};

export default {
    getMetasVendedores,
    getMetasMontadores,
    getFuncionarios,
    inserirMeta
}