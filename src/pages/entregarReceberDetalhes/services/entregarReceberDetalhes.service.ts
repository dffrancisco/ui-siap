import axios from "axios";
import {
    iBaixarEntregarReceberFunctionParam,
    iBaixarPendenciaFunctionParam,
    iCartaoDisponivel,
    iEntregarReceber,
    iGetEntregarReceberPendenteParam,
    iGetOrcamentosBaixaFunctionParam,
    iInsertUpdateObsEntregarReceberFunctionParam,
    iMotorista,
    iOrcamentoBaixa,
    iTrocarMotoristaFunctionParam,
    iUpdateDescPendenciaMotoristaFunctionParam,
} from "../interface";

const caminho = 'siap/entregarReceber'

type iGetMotoristas = () => Promise<iMotorista[]>
type iGetMotoristasPendentes = () => Promise<iMotorista[]>
type iGetCartoesDisponiveisFunction = () => Promise<iCartaoDisponivel[]>
type iGetEntregarReceberPendente = (param: iGetEntregarReceberPendenteParam) => Promise<iEntregarReceber[]>
type iTrocarMotoristaFunction = (param: iTrocarMotoristaFunctionParam) => Promise<void>
type iInsertUpdateObsEntregarReceberFunction = (param: iInsertUpdateObsEntregarReceberFunctionParam) => Promise<void>
type iUpdateDescPendenciaMotoristaFunction = (param: iUpdateDescPendenciaMotoristaFunctionParam) => Promise<void>
type iGetOrcamentosBaixaFunction = (param: iGetOrcamentosBaixaFunctionParam) => Promise<iOrcamentoBaixa[]>
type iBaixarPendenciaFunction = (param: iBaixarPendenciaFunctionParam) => Promise<void>
type iBaixarEntregarReceberFunction = (param: iBaixarEntregarReceberFunctionParam) => Promise<void>

const getMotoristas: iGetMotoristas = async () => {
    let { data } = await axios.post(caminho, {
        call: 'getFuncionariosMotoristas',
    })

    return data;
}

const getMotoristasPendentes: iGetMotoristasPendentes = async () => {
    let { data } = await axios.post(caminho, {
        call: 'getMotoristasPendentes',
    })

    return data;
}

const getCartoesDisponiveis: iGetCartoesDisponiveisFunction = async () => {
    let { data } = await axios.post(caminho, {
        call: 'getCartoesDisponiveis',
    })

    return data;
}

const getEntregarReceberPendente: iGetEntregarReceberPendente = async (param) => {
    let { data } = await axios.post(caminho, {
        call: 'getEntregarReceberPendente',
        param,
    })

    return data;
}

const trocarMotorista: iTrocarMotoristaFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: 'changeMotoristaPendencia',
        codFuncionario: param.codFuncionario,
        numOrcamento: param.numOrcamento,
        data: param.data
    })

    return data;
}

const insertUpdateObsEntregarReceber: iInsertUpdateObsEntregarReceberFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: 'insertUpdateObsEntregarReceber',
        numOrcamento: param.numOrcamento,
        data: param.data,
        obs: param.obs
    })

    return data;
}

const updateDescPendenciaMotorista: iUpdateDescPendenciaMotoristaFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: 'updateDescPendenciaMotorista',
        numOrcamento: param.numOrcamento,
        data: param.data,
        descPendencia: param.descPendencia
    })

    return data;
}

const getOrcamentosBaixa: iGetOrcamentosBaixaFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: 'getOrcamentosBaixa',
        numOrcamento: param.numOrcamento,
        data: param.data,
    })

    return data;
}

const baixarPendencia: iBaixarPendenciaFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: 'baixarEntregarReceberPendencia',
        numOrcamento: param.numOrcamento,
        data: param.data,
    })

    return data;
}

const baixarEntregarReceber: iBaixarEntregarReceberFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: 'baixarEntregarReceberPendencia',
        numOrcamento: param.numOrcamento,
        data: param.data,
        tipoPagamento: param.tipoPagamento,
        pagamento: param.pagamento
    })

    return data;
}

export default {
    getMotoristas,
    getMotoristasPendentes,
    getEntregarReceberPendente,
    getCartoesDisponiveis,
    trocarMotorista,
    insertUpdateObsEntregarReceber,
    updateDescPendenciaMotorista,
    getOrcamentosBaixa,
    baixarPendencia,
    baixarEntregarReceber,
}