import axios from "axios";
import { iAniversariante } from "../interface";

const caminho = 'siap/aniversariantes'

type iGetAniversariantesMesFunction = (mes: number) => Promise<iAniversariante[]>

const getAniversariantesMes: iGetAniversariantesMesFunction = async (mes) => {
    let { data } = await axios.post(caminho, {
        call: 'getAniversariantesMes',
        param: {
            mes
        }
    })

    return data;
}

export default {
    getAniversariantesMes
}