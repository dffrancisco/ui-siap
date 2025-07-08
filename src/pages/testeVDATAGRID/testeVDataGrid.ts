import xGridV2, { ixGridCreate } from "@/plugins/xGridV2"
import { an } from "@fullcalendar/core/internal-common"
import { init } from "mixpanel-browser"
import { reactive } from "vue"

const frutas = [
    {
        "nome": "maçã",
        "cor": "vermelha",
        "sabor": "doce"
    },
    {
        "nome": "banana",
        "cor": "amarela",
        "sabor": "doce"
    },
    {
        "nome": "laranja",
        "cor": "laranja",
        "sabor": "cítrico"
    },
    {
        "nome": "uva",
        "cor": "roxa",
        "sabor": "doce"
    },
    {
        "nome": "manga",
        "cor": "amarela",
        "sabor": "doce"
    },
    {
        "nome": "abacaxi",
        "cor": "amarelo",
        "sabor": "ácido"
    },
    {
        "nome": "melancia",
        "cor": "vermelha",
        "sabor": "refrescante"
    },
    {
        "nome": "melancia",
        "cor": "vermelha",
        "sabor": "refrescante"
    },
    {
        "nome": "melancia",
        "cor": "vermelha",
        "sabor": "refrescante"
    },
    {
        "nome": "melancia",
        "cor": "vermelha",
        "sabor": "refrescante"
    },
    {
        "nome": "melancia",
        "cor": "vermelha",
        "sabor": "refrescante"
    },
    {
        "nome": "melancia",
        "cor": "vermelha",
        "sabor": "refrescante"
    },
    {
        "nome": "melancia",
        "cor": "vermelha",
        "sabor": "refrescante"
    },
    {
        "nome": "melancia",
        "cor": "vermelha",
        "sabor": "refrescante"
    },
    {
        "nome": "melancia",
        "cor": "vermelha",
        "sabor": "refrescante"
    },
    {
        "nome": "melancia",
        "cor": "vermelha",
        "sabor": "refrescante"
    },
    {
        "nome": "melancia",
        "cor": "vermelha",
        "sabor": "refrescante"
    }
]

interface _ixGridCreate extends ixGridCreate {
    dataSource: (obj?: object) => any
}
export const state = reactive({
    gridPrincipal: <_ixGridCreate>{},
})



export const actions = {

    init() {
        actions.grids()
        state.gridPrincipal.source(frutas)
    },

    grids() {
        state.gridPrincipal = new xGridV2.create({
            el: "#gridPrincipal",
            theme: "x-blue",
            width: '100%',
            count: true,
            multiSelect: true,
            columns: {
                'Fruta': { dataField: 'nome' },
                'Cor': { dataField: 'cor' },
                'Sabor': { dataField: 'sabor' }
            },
            sideBySide: {
                el: "#pnCampos",
                frame: {
                    el: "#pnBotoes",
                    buttons: {
                        novo: {
                            html: "Novo",
                            state: "insert",
                            click: actions.adicionar
                        },
                        cancelar: {
                            html: "cancelar",
                            state: "cancel",
                            click: actions.cancelar
                        }
                    }
                }
            }
        })


    },
    adicionar() {
        state.gridPrincipal.disable();
        state.gridPrincipal.focusField();
        state.gridPrincipal.clearElementSideBySide();
    },
    cancelar() {
        state.gridPrincipal.enable();
        state.gridPrincipal.focus();
    }



}