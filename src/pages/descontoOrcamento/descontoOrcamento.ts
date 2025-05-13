import axios from "axios";
import { nextTick, reactive } from "vue";
import xGrid, { ixGridCreate } from '@/plugins/xGridV2'
import utils, { formatValor, formatValorUSA, show } from "@/ts/utils";
import xModal, { iModalCreate } from "@/plugins/xModal/xModal";
import { iDescontoMarca, iItensOrcamento, iOrcamento } from './interfaces'
import globalActions from '@/store/globalActions'
import globalState from '@/store/globalState'
import { useEventListener } from "@vueuse/core";
import Swal from "sweetalert2";
import xAuthManager from "@/plugins/xAuthManager";
import login from "../login/login";
import mixpanel from "mixpanel-browser";
// import xAuthManager from "@/plugins/xAuthManager/xAuthManager";

const caminho = "siap/descontoOrcamento"

export const state = reactive({
  load: false,
  codTela: 'DESC_ORCAMENTO',
  edtNumOrcamento: '',
  descontoValor: '0,00',
  descontoPercent: '0,00',
  valorItem: 0,
  edtDesconto: <any>{},
  edtDescontoItemValor: <any>{},
  edtDescontoItemPercent: <any>{},
  edtEstoque: <any>{},
  fotoVendedor: '',
  fotoMontador: '',
  obs: '',
  gdItensOrcamento: <ixGridCreate>{},
  dataDescontoMarca: <iDescontoMarca[]>{},
  dataOrcamento: <iOrcamento>{},
  pnDesconto: <iModalCreate>(<unknown>null),
  pnUpdateProduto: <iModalCreate>{},
  produtoSelected: <iItensOrcamento>{},
  animate__shakeX: '',
  descontoPermitido: false,
  timeAuth: 0,
  cod_funcionario: -1
});



export const actions = {

  begin() {
    // nextTick(() => {

    (<HTMLInputElement>document.getElementById("edtNumOrcamento")).focus();

    useEventListener(document, "keydown", (event) => {
      if (event.key === "F2") {
        event.preventDefault();
        event.stopPropagation();
        (<HTMLInputElement>document.getElementById("edtNumOrcamento")).select();
      }
    });
    // });
  },

  modal() {

    state.pnDesconto = new xModal.create({
      height: 450,
      width: 600,
      el: '#pnDesconto',
      onOpen: () => {
        state.valorItem = state.produtoSelected.SUB_TOTAL;
        state.animate__shakeX = ''
        state.descontoPermitido = false
        state.descontoValor = formatValor(state.produtoSelected.DESCONTO_GERENTE)
        state.descontoPercent = '0,00'

        actions.calcPercent();

        mixpanel.track('Desconto Orçamento - UI Visualizada -  abrir modal desconto', {
          tela: 'DESC_ORCAMENTO',
          element: 'modal',
          name: 'modal desconto',
          produtoNumFabricante: state.produtoSelected.NUM_FABRICANTE,
          produtoSubTotal: state.produtoSelected.SUB_TOTAL,
          produtoQtd: state.produtoSelected.QTO,
          produtoDescontoMarca: state.produtoSelected.DESCONTO_MARCA,
          produtoDescontoVendedor: state.produtoSelected.DESCONTO_VENDEDOR,
        })

        setTimeout(function () {
          state.edtDescontoItemValor.focus()
        }, 200);

      },
      onClose() {
        state.gdItensOrcamento.focus()

        mixpanel.track('Desconto Orçamento - UI interagida - fechar modal', {
          tela: 'DESC_ORCAMENTO',
          element: 'button',
          name: 'close',
        })
      },
    })


    state.pnUpdateProduto = new xModal.create({
      el: '#pnUpdateProduto',
      height: 295,
      width: 600,
      onOpen(data) {
        setTimeout(() => state.edtEstoque.select(), 100);
      },
      onClose() {
        state.gdItensOrcamento.focus()
      },
      buttons: {
        Cancelar: {
          html: 'Cancelar',
          click(e) {
            state.pnUpdateProduto.close()
          },
        },
        Alterar: {
          html: 'Alterar',
          click() {
            actions.fnUpdateProduto()
          },
        }
      }
    })

  },

  calcPercent() {

    if (state.descontoValor == '')
      state.descontoValor = '0,00'

    let percent =
      (formatValorUSA(state.descontoValor) / state.produtoSelected.SUB_TOTAL) * 100;

    state.descontoPercent = formatValor(percent);

    state.valorItem =
      state.produtoSelected.SUB_TOTAL - formatValorUSA(state.descontoValor);

    state.animate__shakeX = ''
    state.descontoPermitido = false;

    if (percent > globalState.empresa.DESCONTO_GERAL) {
      state.animate__shakeX = 'animate__shakeX'
      state.descontoPermitido = true;
    }

    // state.animate__shakeX =
    //   percent > globalState.empresa.DESCONTO_GERAL ? "animate__shakeX" : "";
    // state.descontoPermitido =
    //   percent > globalState.empresa.DESCONTO_GERAL ? true : false;
  },

  fnUpdateProduto() {
    if (state.produtoSelected.QTO > 10) {
      Swal.fire({
        text: "Quantidade máxima de 10 produtos",
        icon: "warning"
      })
      return
    }

    xAuthManager("Alterar Produto", (data) => {
      actions.updateQtdProduto(data)
    });
  },

  async removeDescontoGerente(codProduto?: number) {

    let text = "Gostaria de remover todos os descontos do orçamento?"

    if (codProduto != undefined)
      text = "Gostaria de remove o desconto deste Item?"

    let rs = await Swal.fire({
      title: 'Desconto',
      text,
      icon: 'warning',
      confirmButtonText: 'Sim',
      showCancelButton: true,
    })

    if (rs.isConfirmed == false)
      return

    let { data } = await axios.post(caminho, {
      call: 'removeDesconto',
      dtOrcamento: state.dataOrcamento.DATA,
      numOrcamento: state.dataOrcamento.NUM_ORCAMENTO,
      codProduto
    })

    if (data.error == false)
      actions.consulta()
  },

  grid() {
    interface iCompare extends iItensOrcamento { value?: string }

    const actionProduto = (dataField) => {

      state.produtoSelected = <iItensOrcamento>{}

      if (dataField != false) {
        state.produtoSelected = dataField

        if (dataField.QTO > dataField.QTD_ESTOQUE)
          state.pnUpdateProduto.open();
        else
          state.pnDesconto.open()
      }
    }

    state.gdItensOrcamento = new xGrid.create({
      el: '#gdItensOrcamento',
      height: '300',
      heightLine: 40,
      columns: {
        'Foto': { dataField: 'FOTO', width: '7%', compare: 'getFoto', style: 'margin-top: 4px', center: true },
        'Nº Fabricante': { dataField: 'NUM_FABRICANTE', width: '12%' },
        'Descrição Produto': { dataField: 'DESC_PRODUTO', compare: 'descProduto' },
        'Qtd Est': { dataField: 'QTD_ESTOQUE', width: '5%', center: true, compare: 'verificaEstoque' },
        'Qtd': { dataField: 'QTO', width: '5%', center: true },
        'Valor': { dataField: 'VALOR', width: '8%', compare: 'valorVenda', right: true, },
        'Desc.V': { dataField: 'DESCONTO_VENDEDOR', width: '6%', compare: 'descontos', right: true, },
        'Desc.M': { dataField: 'DESCONTO_MARCA', width: '6%', compare: 'descontos', right: true, },
        'Desc.G': { dataField: 'DESCONTO_GERENTE', width: '6%', compare: 'descontos', right: true },
        'Desc.T': { dataField: 'DESCONTO', width: '6%', right: true, compare: 'descontos', style: "color:#00d1b2" },
        'Sub. Total': { dataField: 'RENTABILIDADE', width: '6%', compare: 'rentabilidade', right: true },
        // 'Sub. Total': { dataField: 'SUB_TOTAL', width: '8%', render: utils.formatValor, right: true },
      },
      compare: {
        getFoto(r) {
          if (r.value != '')
            return `<img class="desc-img" src="${globalActions.getProdutoThumb(r.COD_PRODUTO, 45)}">`
        },

        valorVenda(r) {
          // return 
          let sum = r.QTO > 1 ? utils.formatValor(r.value) : ''
          return `<div style="width: 100%; text-align: right;">
                      <div>${utils.formatValor(r.VENDA * r.QTO)}</div>
                      <div style="color:rgb(32 156 238 / 72%);">${sum}</div>
                  </div>`
        },

        descProduto(r: iCompare) {
          let color = r.QTO > r.QTD_ESTOQUE ? '#ff3860' : ''
          return `<div style="width: 100%; text-align: left;">
                      <div style="color: ${color}">(${r.CURVA_ABC_G})  ${r.value}</div>
                      <div style="color:rgb(32 156 238 / 72%);">C:${utils.formatValor(r.CUSTO)} / V:${utils.formatValor(r.VENDA)} - ${r.CARRO} - ${r.MARCA}</div>
                    </div>`
        },

        descontos(r) {
          if (r.value == 0)
            return '-'
          else {
            // console.log(r.value, r.VENDA, r.VENDA * r.QTO);
            return `<div style="width: 100%; text-align: right;">
                      <div> ${utils.formatValor(r.value)}</div>
                      <div style="color:rgb(32 156 238 / 72%); font-size:11px">${utils.formatValor(r.value / (r.VALOR_REAL * r.QTO) * 100)}%</div>                    </div>`
          }

        },

        verificaEstoque(r) {
          if (r.QTO > r.QTD_ESTOQUE) {
            return '<span style="color: #ff3860">' + r.value + '</span>';
          } else {
            return r.value;
          }
        },

        rentabilidade(r: iCompare) {
          let color = 'rgb(32 156 238 / 72%)';

          return `<div style="width: 100%; text-align: right;">
                      <div> ${utils.formatValor(r.SUB_TOTAL - r.DESCONTO)}</div>
                      <div style="color:${color}">${utils.formatValor(r.DESCONTO / (r.VALOR_REAL * r.QTO) * 100)}%</div>
                    </div>`
        },
      },
      enter(dataField) {
        actionProduto(dataField)
      },
      onKeyDown: {
        46: (ln: iItensOrcamento, e) => {
          actions.removeDescontoGerente(ln.COD_PRODUTO)
        }
      },
      dblClick(dataField) {
        actionProduto(dataField)

      },
    })

  },

  getPercentTotalDesconto() {
    return (state.dataOrcamento.DESCONTO /
      (state.dataOrcamento.VALOR +
        state.dataOrcamento.DESCONTO)) *
      100
  },

  async getOrcamento() {

    state.load = true;

    let { data } = await axios.post(caminho, {
      call: "getOrcamento",
      numOrcamento: state.edtNumOrcamento
    });

    state.load = false;

    if (data.error) {
      Swal.fire({
        text: data.msg,
        icon: "error"
      })
      return false;
    }

    state.dataOrcamento = data[0];

    state.dataDescontoMarca = [];

    if (state.dataOrcamento.ID_CLIENTE != 1)
      actions.getDescontoMarca(state.dataOrcamento.ID_CLIENTE)


    state.fotoVendedor = globalActions.getFuncionarioThumb(state.dataOrcamento.CPF, 55)
    state.fotoMontador = globalActions.getFuncionarioThumb(state.dataOrcamento.CPF_MONTADOR, 55)

    mixpanel.track('Desconto Orçamento - UI interagida - buscar orçamento', {
      tela: 'DESC_ORCAMENTO',
      element: 'button',
      name: 'buscar',
      numOrcamento: state.edtNumOrcamento,
    })

    // state.descontoValor = '0.00'
    // state.edtDesconto.focus();


  },

  async getItensOrcamento() {

    state.load = true;

    let { data } = await axios.post(caminho, {
      call: "getItensOrcamento",
      numOrcamento: state.edtNumOrcamento
    });
    actions.getObs()

    state.load = false;

    if (data.error) {
      Swal.fire({
        text: data.msg,
        icon: "error"
      })
      return false;
    }

    state.gdItensOrcamento.source(data);

    state.gdItensOrcamento.focus();

  },

  async getObs() {

    let { data } = await axios.post(caminho, {
      call: "getObs",
      numOrcamento: state.edtNumOrcamento
    });
    state.obs = data[0]?.OBS;
  },

  async getDescontoMarca(idCliente: number) {

    let { data } = await axios.post(caminho, {
      call: "getDescontoMarca",
      idCliente
    });


    if (data.error) {
      Swal.fire({
        text: data.msg,
        icon: "error"
      })
      return false;
    }

    state.dataDescontoMarca = data;

  },

  async consulta() {
    if (state.edtNumOrcamento == "") {
      await Swal.fire({
        text: "Número Orçamento é obrigatório",
        icon: "error",
      });

      return;
    }
    await actions.getOrcamento();
    await actions.getItensOrcamento();
  },

  async updateQtdProduto(token: any) {

    let { QTD_ESTOQUE } = state.gdItensOrcamento.dataSource()

    let conteudo = 'QTO: ' + QTD_ESTOQUE + ' -> ' + state.produtoSelected.QTO

    let { data } = await axios.post(caminho, {
      call: "updateQtdProduto",
      authKen: token.token,
      cod_funcionario: token.cod_funcionario,
      tela: state.codTela,
      conteudo,
      codProduto: state.produtoSelected.COD_PRODUTO,
      quantidade: state.produtoSelected.QTO
    });


    if (data.error) {
      Swal.fire({
        text: data.msg,
        icon: "error"
      })
      return false;
    }

    state.gdItensOrcamento.dataSource({ QTD_ESTOQUE: state.produtoSelected.QTO })
    state.pnUpdateProduto.close()
  },

  async setDescontoOrcamento() {
    let stopTime;


    const fn = async () => {
      if (state.descontoPermitido)
        return false;

      let { data } = await axios.post(caminho, {
        call: 'setDescontoOrcamento',
        // tk: token,
        codGerente: state.cod_funcionario,
        dtOrcamento: state.dataOrcamento.DATA,
        numOrcamento: state.dataOrcamento.NUM_ORCAMENTO,
        valorDesconto: formatValorUSA(state.descontoValor),
        valorOrcamento: state.dataOrcamento.VALOR,
        valorProduto: state.produtoSelected.VALOR * state.produtoSelected.QTO,
        obs: state.obs,
        codProduto: state.produtoSelected.COD_PRODUTO

      })

      mixpanel.track('Desconto Orçamento - UI Interagida -  salvar desconto', {
        tela: 'DESC_ORCAMENTO',
        element: 'button',
        name: 'salvar',
        produtoNumFabricante: state.produtoSelected.NUM_FABRICANTE,
        valorDesconto: formatValorUSA(state.descontoValor)
      })

      if (data.error) {
        Swal.fire({
          icon: 'error',
          text: data.msg
        })

        return
      }

      let { orc, item } = data;

      state.dataOrcamento.DESCONTO = orc.DESCONTO
      state.dataOrcamento.DESCONTO_GERENTE = orc.DESCONTO_GERENTE
      state.dataOrcamento.VALOR = orc.VALOR
      // console.log(data);

      state.gdItensOrcamento.dataSource({
        DESCONTO_GERENTE: formatValorUSA(state.descontoValor),
        SUB_TOTAL: item.SUB_TOTAL,
        DESCONTO: item.DESCONTO,
        VALOR: item.VALOR
      });

      state.gdItensOrcamento.dataSource({ RENTABILIDADE: item.SUB_TOTAL });

      state.pnDesconto.close();
    }


    if (state.timeAuth == 0) {
      xAuthManager("Alterar Produto", async (data) => {
        // console.log(data);
        state.timeAuth = 1200;
        state.cod_funcionario = data.cod_funcionario;

        fn();

        stopTime = setInterval(() => {

          state.timeAuth--

          if (state.timeAuth == 0)
            clearInterval(stopTime)

        }, 100);


      });

      return false;
    }

    fn();

  },

  async sendToCaixa() {

  },

};

export default {
  state,
  actions,
};
