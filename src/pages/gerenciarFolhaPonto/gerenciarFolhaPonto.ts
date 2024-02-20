import { reactive, computed } from "vue";
import { iFuncionario, iGetMesEAno, iTotalizador } from "./interface";
import gerenciarFolhaPontoService from "./services/gerenciarFolhaPonto.service";
import Swal from "sweetalert2";
import router from "@/router";
import printJS from "print-js";
import globalState from "@/store/globalState";

export const state = reactive({
  funcionarios: {},
  mes: new Date().getMonth() + 1,
  ano: new Date().getFullYear(),
  selectedFuncionario: <number | null>null,
  loading: false,
});

export const meses = computed(() => [
  { text: "Janeiro", value: 1 },
  { text: "Fevereiro", value: 2 },
  { text: "Março", value: 3 },
  { text: "Abril", value: 4 },
  { text: "Maio", value: 5 },
  { text: "Junho", value: 6 },
  { text: "Julho", value: 7 },
  { text: "Agosto", value: 8 },
  { text: "Setembro", value: 9 },
  { text: "Outubro", value: 10 },
  { text: "Novembro", value: 11 },
  { text: "Dezembro", value: 12 },
]);

export const anos = computed(() => {
  const anosArray: number[] = [];
  const anoAtual = new Date().getFullYear();

  for (let i = 0; i < 20; i++) {
    const ano = anoAtual - 10 + i;
    anosArray.push(ano);
  }

  return anosArray;
});

export const funcionariosOrdenados = computed(() => {
  let funcionariosArray = <iFuncionario[]>[];

  for (let indexFuncionario in state.funcionarios) {
    funcionariosArray.push(state.funcionarios[indexFuncionario]);
  }

  funcionariosArray.sort((funcionario1, funcionario2) => {
    return funcionario1.NOME_COMP > funcionario2.NOME_COMP ? 1 : -1;
  });

  return funcionariosArray;
});

export const totalizador = computed(() => {
  const total: iTotalizador = {
    QTD_A_JUSTIFICAR: 0,
    QTD_FALTAS_JUSTIFICADAS: 0,
    QTD_PONTOS_INCOMPLETOS: 0,
    QTD_PONTOS_NAO_BATIDOS: 0,
  };

  for (const func of Object.values(state.funcionarios) as iFuncionario[]) {
    if (func.QTD_A_JUSTIFICAR) total.QTD_A_JUSTIFICAR += func.QTD_A_JUSTIFICAR;
    if (func.QTD_FALTAS_JUSTIFICADAS) total.QTD_FALTAS_JUSTIFICADAS += func.QTD_FALTAS_JUSTIFICADAS;
    if (func.QTD_PONTOS_INCOMPLETOS) total.QTD_PONTOS_INCOMPLETOS += func.QTD_PONTOS_INCOMPLETOS;
    if (func.QTD_PONTOS_NAO_BATIDOS) total.QTD_PONTOS_NAO_BATIDOS += func.QTD_PONTOS_NAO_BATIDOS;
  }

  return total;
});

export const actions = {
  handleFuncionarioChange() {
    actions.getFuncionarios(state.selectedFuncionario, state.mes, state.ano);
  },

  async getFuncionarios(cod_funcionario: number, mes: number, ano: number) {
    const param: iGetMesEAno = {
      cod_funcionario: cod_funcionario,
      mes: mes,
      ano: ano,
    };

    try {
      state.funcionarios = await gerenciarFolhaPontoService.getFuncionarios(param);
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Ocorreu um erro ao buscar os funcionários",
      });
    }
  },

  getFotoFuncionarioURL(cpf: string) {
    if (!cpf) {
      return "";
    }

    const cpfSanitizado = cpf.replaceAll(".", "").replaceAll("-", "");
    return `https://www.reallatas.com.br/_serverAPP/thumb.php?img=http://www.reallatas.com.br/foto_funcionarios/${cpfSanitizado}.jpg`;
  },

  onClickFuncionario(codFuncionario: number, mes: number, ano: number) {
    let query = {
      cod_funcionario: codFuncionario,
      mes: mes,
      ano: ano,
    };

    router.push({
      name: "gerenciarFolhaPontoDetalhes",
      query,
    });
  },

  async init(codFuncionario: number, mes: number, ano: number) {
    state.loading = true;

    await actions.getFuncionarios(codFuncionario, mes, ano);

    setTimeout(() => {
      state.loading = false;
    }, 100);
  },

  imprimirFolhaPontoTodosFuncionarios() {
    const conteudo = actions.criarHTMLParaPDF();

    printJS({
      documentTitle: "Folha de Ponto",
      printable: conteudo,
      type: "html",
    });
  },

  criarHTMLParaPDF() {
    let func = "funcionario";

    let cabecalho = `
      <div class="cabecalho">
        <table width="100%" class="tbTitulo">
            <tr>
                <td rowspan="4" style="width: 150px;"><img src="src/assets/Logo-Real-Shop-Car-menor.png" width="155" alt="" /></td>
                <td colspan="3" style="font-weight: bold" name="razao">${globalState.empresa.RAZAO_SOCIAL}</td>
                <td style="width: 150px;"><span class="spData"></span> <span class="spHora"></span></td>
            </tr>
            <tr>
                <td colspan="3" name="endereco"></td>
                <td name="cnpj"></td>
            </tr>
            <tr>
                <td>Cidade.: <span name="cidade"></span> </td>
                <td>Bairro.: <span name="bairro"></span> </td>
                <td>CEP.: <span name="cep"></span> </td>
                <td> <span name="inscricao"></span> </td>
            </tr>
            <tr>
                <td colspan="2">Telefone.: <span name="fone"></span> </td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td colspan="5">
                    <div style="border-top: 1px solid #666666; border-bottom: 1px solid #666666; margin-top: 3px; text-align: center" class="pnTituloCabecalho"></div>
                </td>
            </tr>
        </table>
      </div>`;

    const conteudoHTML = `${cabecalho}<br><br><br>
    <div id="justificativaPDF">
      <p>JUSTIFICATIVA DE AUSÊNCIA</p>
      <p>Eu, ${func}, brasileiro (a), de CPF ${func}, profissional lotado no cargo ${func}, 
      na empresa REAL ACESSÓRIOS venho justificar ao RH, minha ausência que foi devido a: 
      ${func}. No dia ${func}, motivos pelos quais impossibilitaram 
      minha presença na empresa, bem como o desempenho das respectivas funções. Solicito, portanto, 
      o abono da falta, visto que a mesma ocorreu por motivo de força maior e foi devidamente justificada.</p>
      <p>Por ser expressão da verdade, firmo a presente.</p>
      <p>Brasília-DF, ___/___/_____.</p>
      <p>${func}</p>
    </div>
  `;

    const tempElement = document.createElement("div");
    tempElement.innerHTML = conteudoHTML;

    return tempElement;
  },
};

export default { state, actions, meses, anos, totalizador };
