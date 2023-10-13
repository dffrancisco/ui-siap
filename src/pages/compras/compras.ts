import axios from 'axios';
import utils from '@/ts/utils';
import { reactive } from 'vue'
import Swal from 'sweetalert2';
import { msgConfirm } from '@/ts/message';
import globalState from '@/store/globalState'
import xGridV2, { ixGridCreate } from '@/plugins/xGridV2';

const caminho = "siap/compras"
const mapa = {
    COD_PRODUTO: 'A',
    DESC_PRODUTO: 'B',
    END_ESTOQUE: 'C',
    FOTO: 'D',
    NUM_FABRICANTE: 'E',
    NUM_FABRICANTE2: 'F',
    QUANTIDADE: 'G',
    UNIDADE: 'H',
    VENDA: 'I',
    CUSTO: 'J',
    CARRO: 'L',
    MARCA: 'M',
    NEW_CADASTRO: 'N',
    CURVA_ABC_G: 'CG',
    CURVA_ABC_M: 'CM',
    VALOR_VENDA: 'VV'
}


// interface _ixGridCreate extends ixGridCreate {
//     dataSource: (obj?: object) => iCarro
// }

export const state = reactive(({
    xgProduto: <ixGridCreate>{},

    displayProduto: {
        defalt: true,
        simples: {
            columns: {
                'Descrição Produto -- (quando online produto da CENTRAL)': { dataField: mapa.DESC_PRODUTO, compare: 'produto' }
            },
            heightLine: 95
        },
        mult: {
            columns: {
                'Nº Fabricante': { dataField: mapa.NUM_FABRICANTE, width: '10%' },
                'Descrição Produto': { dataField: mapa.DESC_PRODUTO },
                'Curva G': { dataField: mapa.CURVA_ABC_M, width: '7%', style: 'text-align:center' },
                'Curva M': { dataField: mapa.CURVA_ABC_G, width: '7%', style: 'text-align:center' },
                'Carro': { dataField: mapa.CARRO, width: '15%' },
                'Qto': { dataField: mapa.QUANTIDADE, width: '5%', style: 'text-align: center' },
                'Preço': { dataField: mapa.VALOR_VENDA, width: '8%', render: utils.formatValor, style: 'text-align: right' }
            },
            heightLine: 30
        },
        uso: {
            columns: {},
            heightLine: 40
        },
    },

}))


export const actions = {

    grids() {

        state.xgProduto = new xGridV2.create({
            el: "#xgProduto",
            height: 130,
            heightLine: state.displayProduto.uso.heightLine,
            columns: state.displayProduto.uso.columns,
            compare: {
                produto: (r) => {
                    let foto = r[mapa.FOTO] == 'F' ? '<i style="font-size: 14px" class="fa fa-camera"></i>' : '';

                    return '<v-row></v-row>' +
                        '<div class="aGrid">' +
                        '<div class="row">' +
                        '<div class="col s11">' +
                        '    <span>Descrição ' + r[mapa.COD_PRODUTO] + ' Foto ' + r[mapa.FOTO] + ' </span>' +
                        '    <label class="vverd">' + r[mapa.DESC_PRODUTO] + '</label>' +
                        '</div>' +
                        '<div class="col s1">' +
                        '    <span>Foto</span>' +
                        '    <label >' + foto + '</label>' +
                        '</div>' +
                        '</div>' +
                        '<div class="row">' +
                        '<div class="col s4">' +
                        '    <span>Carro Compra</span>' +
                        '    <label>' + r[mapa.CARRO] + '</label>' +
                        '</div>' +
                        '<div class="col s3">' +
                        '    <span>Nº Fabricante</span>' +
                        '    <label>' + r[mapa.NUM_FABRICANTE] + '</label>' +
                        '</div>' +
                        // '<div class="col s3">' +
                        // '    <span>Nº Fabricante2</span>' +
                        // '    <label>' + r[mapa.NUM_FABRICANTE2] + '</label>' +
                        // '</div>' +
                        // '<div class="col s2">' +
                        // '    <span>ABC G</span>' +
                        // // '    <label>' + corCurvaABC(r[mapa.CURVA_ABC_G]) + '</label>' +
                        // '</div>' +
                        // '</div>' +
                        // '<div class="row">' +
                        // '<div class="col s4">' +
                        // '    <span>Marca</span>' +
                        // '    <label style="font-size:16px; padding-top: 3;" class="truncate">' + r[mapa.MARCA] + '</label>' +
                        // '</div>' +
                        // //                                '<div class="col s3">' +
                        // //                                '    <span>Quantidade</span>' +
                        // //                                '    <label>' + r[mapa.QUANTIDADE] + '</label>' +
                        // //                                '</div>' +
                        // '<div class="col s3">' +
                        // '   <span>Custo</span>' +
                        // '    <label>' + utils.formatValor(r[mapa.CUSTO]) + '</label>' +
                        // '</div>' +
                        // '<div class="col s3">' +
                        // '    <span>Venda</span>' +
                        // '    <label>' + utils.formatValor(r[mapa.VENDA]) + '</label>' +
                        // '</div>' +
                        '<div class="col s2">' +
                        '    <span>ABC M</span>' +
                        // '    <label>' + corCurvaABC(r[mapa.CURVA_ABC_M]) + '</label>' +
                        '</div></div></div>';

                }
            },

        });

    },

    async getProdutos() {
        let { data } = await axios.post(caminho, {
            call: 'getProdutos',
            idCarro: '9999',
            idMarca: 194,
            numFabricante: '',
            descProduto: ''
        })


        state.xgProduto.source(data);

        // console.log(data);
    }



}


export default { state, actions }