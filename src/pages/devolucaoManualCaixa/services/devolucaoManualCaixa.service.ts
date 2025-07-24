import axios from "axios";
const caminho = 'siap/devolucaoManualCaixa'

const getCaixasDoDia = async () => {
    let { data } = await axios.post(caminho, {
        call: "getCaixasDoDia",
    });
    return data;
}

 export default {getCaixasDoDia}