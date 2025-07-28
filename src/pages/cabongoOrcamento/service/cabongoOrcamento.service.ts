import axios from "axios";

const caminho = 'siap/cabongoOrcamento'


const getOrcamentoLoja = async () => {
    let { data } = await axios.post(caminho, {
        call: 'getOrcamentoLoja',
    })
    return data
}

export default {
    getOrcamentoLoja
}