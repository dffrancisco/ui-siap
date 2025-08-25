import axios from "axios";
import { iFuncionario, iMesEAno, iMetaMontador, iMetaVendedor, iMetaInserida, iGruposFuncionarios, } from "../interfaces"

const caminho = "taap/distribuirMetas";

type iGetMetasVendedores = (param: iMesEAno) => Promise<iMetaVendedor[]>
type iGetMetasMontadores = (param: iMesEAno) => Promise<iMetaMontador[]>
type iGetFuncionarios = () => Promise<iFuncionario[]>
type iInserirMeta = (param: iMetaInserida) => Promise<iMetaInserida>
type iGetGruposFuncionarios = () => Promise<iGruposFuncionarios[]>

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

const getFuncionarios: iGetFuncionarios = async () => {
    let { data } = await axios.post(caminho, {
        call: "getFuncionarios",
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

const getGruposFuncionarios: iGetGruposFuncionarios = async () => {
    let { data } = await axios.post(caminho, {
        call: "getGruposFuncionarios",
    });

    return data;
}

export default {
    getMetasVendedores,
    getMetasMontadores,
    getFuncionarios,
    inserirMeta,
    getGruposFuncionarios
}