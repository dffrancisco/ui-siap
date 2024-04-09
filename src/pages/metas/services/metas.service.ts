import axios from "axios";
import { iMesEAno, iResponseFuncionarios, iResponseMetasMontadores, iResponseMetasVendedores } from "../interfaces"


const caminho = "siap/metas";


type iGetMetasVendedores = (param: iMesEAno) => Promise<iResponseMetasVendedores>
type iGetMetasMontadores = (param: iMesEAno) => Promise<iResponseMetasMontadores>
type iGetFuncionarios = (param: iMesEAno) => Promise<iResponseFuncionarios>

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

export default {
    getMetasVendedores,
    getMetasMontadores,
    getFuncionarios
}