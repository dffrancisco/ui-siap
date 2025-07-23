import axios from "axios";
const caminho = 'siap/desbloqueioCredito'

type iDesbloquearCredito = (param:string) => Promise<string>


// const getCredito:   = async () => {
//     let { data } = await axios.post(caminho, {
//         call: "getCredito",
//         param: {
            
//         }
//     });
//     return data;
// }

// const desbloquearCredito:iDesbloquearCredito = async(chave: string) => {
//         let { data } = await axios.post(caminho, {
//         call: "desbloquearCredito",
//         param: {
//             chave
//         }
//     });
//     return data;

// }


// export default {getCredito, desbloquearCredito }