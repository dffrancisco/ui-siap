import axios from "axios";
import { iClientesFaturados, iGetClientesFaturados, iParamGetOrcamentos } from "../interfaces";
type iGetClientesFaturadosFuction = (param: iGetClientesFaturados, offset: number) => Promise<iClientesFaturados>
type iGetOrcamentosEBoletosEmAbertoFunction = (param: iParamGetOrcamentos) => Promise<any>

const caminho = 'siap/baixaManualBoleto'

const getClientesFaturados: iGetClientesFaturadosFuction = async (param, offset) => {
    const { data } = await axios.post(caminho, {
        call: "getClientesFaturados",
        offset,
        param
    });

    return data;
}

const getOrcamentosEBoletosEmAberto: iGetOrcamentosEBoletosEmAbertoFunction = async (param: iParamGetOrcamentos) => {
    const { data } = await axios.post(caminho, {
        call: "getOrcamentosEBoletosEmAberto",
        param
    });
    return data;
}

const uploadComprovante = async (formData) => {
    try {
        const response = await $.ajax({
            url: "http://www.reallatas.com.br/baixa_manual_boleto/upload_comprovante_boleto_manual.php",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
        });

        return response;
    } catch (error) {
        console.error("Erro no upload:", error);
        throw error;
    }
};

export default {
    getClientesFaturados,
    getOrcamentosEBoletosEmAberto,
    uploadComprovante
}