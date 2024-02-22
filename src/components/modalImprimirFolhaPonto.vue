<script setup lang="ts">
import globalState from "@/store/globalState";
import printJS from "print-js";
import { defineProps } from "vue";

const props = defineProps({
  dadosParaImpressao: {
    type: Object as () => any,
  },
  dadosParaImpressaoIndividual: {
    type: Object as () => any,
  },
});

// const emit = defineEmits(["documentoASerImpresso"]);

function formatarDataAdmissao(dataString: string): string {
  const data = new Date(dataString);
  const dia = data.getDate().toString().padStart(2, "0");
  const mes = (data.getMonth() + 1).toString().padStart(2, "0");
  const ano = data.getFullYear().toString();
  return `${dia}/${mes}/${ano}`;
}

function imprimirFolhaDePonto() {
  const folhaPonto = criarHTMLParaPDF();
  printJS({
    documentTitle: "Folha de Ponto",
    printable: folhaPonto,
    type: "html",
  });
}

function criarHTMLParaPDF() {
  let html = "";
  let cabecalho = `
  <div class="cabecalho">
    <table
      width="100%"
      class="tbTitulo"
    >
      <tr>
        <td colspan="5">
          <div
            style="
              border-top: 1px solid #666666;
              border-bottom: 1px solid #666666;
              margin-top: 3px;
              text-align: center;
            "
            class="pnTituloCabecalho"
          ></div>
        </td>
      </tr>
      <tr>
        <td
          rowspan="4"
          style="width: 150px"
          ><img
            src="src/assets/Logo-Real-Shop-Car-menor.png"
            width="155"
            alt=""
        /></td>
        <td
          style="font-weight: bold"
          name="razao"
          >${globalState.empresa.NOME_FANTAZIA}</td
        >
      </tr>
      <tr>
        <td
          colspan="3"
          name="endereco"
        ></td>
        <td name="cnpj">${globalState.empresa.CGC_EMPRESA}</td>
      </tr>
      <tr>
        <td>Cidade.: <span name="cidade"></span>${globalState.empresa.BAIRRO}</td>
        <td>Bairro.: <span name="bairro"></span>${globalState.empresa.ENDERECO}</td>
        <td>CEP.: <span name="cep"></span>${globalState.empresa.CEP}</td>
        <td> <span name="inscricao"></span>${globalState.empresa.INSCRICAO}</td>
      </tr>
      <tr>
        <td colspan="2"
          >Telefone.: <span name="fone"></span>${globalState.empresa.TELEFONE1}</td
        >
      </tr>
      <tr>
        <td colspan="5">
          <div
            style="
              border-top: 1px solid #666666;
              border-bottom: 1px solid #666666;
              margin-top: 3px;
              text-align: center;
            "
            class="pnTituloCabecalho"
          ></div>
        </td>
      </tr>
    </table>
  </div>
  `;

  if (props.dadosParaImpressao) {
    for (const key in props.dadosParaImpressao.dadosFuncionarios) {
      const funcionario = props.dadosParaImpressao.dadosFuncionarios[key];
      html += cabecalho;
      html += `
        <div class="infoFunc">${funcionario.NOME_COMP} - CPF: ${funcionario.CPF} - Cargo: ${
        funcionario.CARGO
      } - Data Admissão: ${formatarDataAdmissao(funcionario.DATA_ADMISSAO)}</div>
        <table class="tabela">
          <thead>
            <tr>
              <th>Dia da Semana</th>
              <th>Data</th>
              <th>Entrada</th>
              <th>Saída</th>
              <th>Entrada</th>
              <th>Saída</th>
              <th>Justificativa</th>
            </tr>
          </thead>
          <tbody>
      `;

      // Obter todos os dias do mês
      const diasNoMes = new Date(props.dadosParaImpressao.ano, props.dadosParaImpressao.mes, 0).getDate();

      // Iterar sobre todos os dias do mês
      for (let dia = 1; dia <= diasNoMes; dia++) {
        const data = new Date(props.dadosParaImpressao.ano, props.dadosParaImpressao.mes - 1, dia);
        const diaSemana = data.toLocaleDateString("pt-BR", { weekday: "long" });

        // Verificar se há registro para este dia
        // Verifica se funcionario.pontos está definido e é um array antes de usar o método find
        const pontoDia =
          funcionario.pontos && Array.isArray(funcionario.pontos)
            ? funcionario.pontos.find((ponto) => new Date(ponto.DATA).getDate() === dia)
            : null;
        // Verifica se funcionario.faltas está definido e é um array antes de usar o método find
        const faltaDia =
          funcionario.faltas && Array.isArray(funcionario.faltas)
            ? funcionario.faltas.find((falta) => new Date(falta.DATA).getDate() === dia)
            : null;

        // Formatando os valores ou definindo como "-" se não houver registro
        const entrada1 = pontoDia ? new Date(pontoDia.HORA_CHEGADA).toLocaleTimeString() : "-";
        const saida1 = pontoDia
          ? pontoDia.HORA_ALMOCO_INICIAL
            ? new Date(pontoDia.HORA_ALMOCO_INICIAL).toLocaleTimeString()
            : "-"
          : "-";
        const entrada2 = pontoDia
          ? pontoDia.HORA_ALMOCO_FINAL
            ? new Date(pontoDia.HORA_ALMOCO_FINAL).toLocaleTimeString()
            : "-"
          : "-";
        const saida2 = pontoDia
          ? pontoDia.HORA_SAIDA
            ? new Date(pontoDia.HORA_SAIDA).toLocaleTimeString()
            : "-"
          : "-";
        const justificativa = pontoDia
          ? pontoDia.JUSTIFICATIVA || "-"
          : faltaDia
          ? faltaDia.STATUS || faltaDia.JUSTIFICATIVA || "-"
          : "-";

        html += `
          <tr>
            <td>${diaSemana}</td>
            <td>${data.toLocaleDateString()}</td>
            <td>${entrada1}</td>
            <td>${saida1}</td>
            <td>${entrada2}</td>
            <td>${saida2}</td>
            <td>${justificativa}</td>
          </tr>
        `;
      }

      html += `
          </tbody>
        </table>
      `;
      html += `<br><br><div style="float: left; width: 50%; text-align: center; font-size: 14px;">
    <span>Assinatura do Gerente</span><br><span>______________________________________________</span></div>
    <div style="float: left; width: 50%; text-align: center; font-size: 14px;">
    <span>${funcionario.NOME_COMP} </span><br><span>______________________________________________</span></div>
    <br><br><br><br><br><br><br><br>`;
    }
  } else if (props.dadosParaImpressaoIndividual) {
    const funcionario = props.dadosParaImpressaoIndividual;

    let rodape = `<br><br><div style="float: left; width: 50%; text-align: center; font-size: 14px;">
    <span>Assinatura do Gerente</span><br><span>______________________________________________</span></div>
    <div style="float: left; width: 50%; text-align: center; font-size: 14px;">
    <span>${funcionario.NOME_COMP} </span><br><span>______________________________________________</span></div>
    <br><br><br><br><br><br>
    `;

    html += cabecalho;
    html += `<div class="infoFunc"> ${funcionario.NOME_COMP} - CPF: ${funcionario.CPF} - Cargo: ${
      funcionario.CARGO
    } - Data Admissão: ${formatarDataAdmissao(funcionario.ADMISSAO)} </div>`;
    html += "<table class='tabela'>";
    html +=
      "<thead><tr><th>Dia da Semana</th><th>Data</th><th>Entrada</th><th>Saída</th><th>Entrada</th><th>Saída</th><th>Justificativa</th></tr></thead>";
    html += "<tbody>";

    // Obter último dia do mês
    const ultimoDia = new Date(funcionario.ano, funcionario.mes, 0);

    // Iterar sobre todos os dias do mês
    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
      const data = new Date(funcionario.ano, funcionario.mes - 1, dia);
      const diaSemana = data.toLocaleDateString("pt-BR", { weekday: "long" });

      // Verificar se há uma falta para este dia
      const falta = funcionario.faltas[`Dia:${dia}`] || { STATUS: "-", JUSTIFICATIVA: "-" };
      const statusOuJustificativa = falta.STATUS || falta.JUSTIFICATIVA || "-";

      html += `
        <tr>
          <td>${diaSemana}</td>
          <td>${data.toLocaleDateString()}</td>
          <td>${falta.HORA_CHEGADA ? new Date(falta.HORA_CHEGADA).toLocaleTimeString() : "-"}</td>
          <td>${falta.HORA_ALMOCO_INICIAL ? new Date(falta.HORA_ALMOCO_INICIAL).toLocaleTimeString() : "-"}</td>
          <td>${falta.HORA_ALMOCO_FINAL ? new Date(falta.HORA_ALMOCO_FINAL).toLocaleTimeString() : "-"}</td>
          <td>${falta.HORA_SAIDA ? new Date(falta.HORA_SAIDA).toLocaleTimeString() : "-"}</td>
          <td>${statusOuJustificativa}</td>
        </tr>`;
    }

    html += "</tbody></table>";
    html += rodape;
  }

  return html;
}
</script>

<template>
  <!-- <v-btn
    color="primary"
    class="btnPrint"
    @click="imprimirFolhaDePonto()"
  >
    <v-icon>mdi-printer-settings</v-icon>
    Imprimir
  </v-btn> -->

  <!-- <div>{{ props.dadosParaImpressao }}</div> -->

  <div
    id="folhaPonto"
    v-html="criarHTMLParaPDF()"
  >
  </div>
  <hr />
</template>

<style>
.xModal-blue .xModal-modal-foot {
  height: auto !important;
}

.btnPrint {
  margin-left: 850px;
  margin-bottom: 10px;
}

.tabela {
  width: 100%;
  border-collapse: collapse;
}

.tabela th,
.tabela td {
  border: 1px solid black;
  padding: 4px;
  text-align: center;
}

.tabela th {
  background-color: #f2f2f2; /* Cor de fundo para cabeçalho */
}

.tabela tr:nth-child(even) {
  background-color: #f2f2f2; /* Cor de fundo para linhas pares */
}

.tabela tr:hover {
  background-color: #ddd; /* Cor de fundo ao passar o mouse */
}

.infoFunc {
  text-align: center;
  align-items: center;
  font-size: 13px;
  font-weight: bold;
}
</style>
