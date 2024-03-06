<script setup lang="ts">
import globalState from "@/store/globalState";
import { defineProps } from "vue";
import printJS from "print-js";
import { sleep } from "@/ts/utils";

const props = defineProps({
  dadosParaImpressao: {
    type: Object as () => any,
  },
});

function formatarDataAdmissao(dataString: string): string {
  const data = new Date(dataString);
  const dia = data.getDate().toString().padStart(2, "0");
  const mes = (data.getMonth() + 1).toString().padStart(2, "0");
  const ano = data.getFullYear().toString();
  return `${dia}/${mes}/${ano}`;
}

const formatarDadosTable = (funcionario) => {
  const diasNoMes = [];
  const totalDias = new Date(props.dadosParaImpressao.ano, props.dadosParaImpressao.mes, 0).getDate();

  for (let dia = 1; dia <= totalDias; dia++) {
    const data = new Date(props.dadosParaImpressao.ano, props.dadosParaImpressao.mes - 1, dia);
    const diaSemana = data.toLocaleDateString("pt-BR", { weekday: "long" });

    // Verifica se há registro de ponto e de falta para este dia
    const pontoDia =
      funcionario.pontos && Array.isArray(funcionario.pontos)
        ? funcionario.pontos.find((ponto) => new Date(ponto.DATA).getDate() === dia)
        : null;
    const faltaDia =
      funcionario.faltas && Array.isArray(funcionario.faltas)
        ? funcionario.faltas.find((falta) => new Date(falta.DATA).getDate() === dia)
        : null;

    // Definindo os valores de entrada/saída e justificativa/status
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
    const justificativa =
      pontoDia && pontoDia.JUSTIFICATIVA
        ? pontoDia.JUSTIFICATIVA
        : faltaDia && (faltaDia.STATUS || faltaDia.JUSTIFICATIVA)
        ? faltaDia.STATUS || faltaDia.JUSTIFICATIVA
        : "";

    diasNoMes.push({
      data: data.toLocaleDateString(),
      diaSemana,
      entrada1,
      saida1,
      entrada2,
      saida2,
      justificativa,
    });
  }

  return diasNoMes;
};

const print = async () => {
  await sleep(200);

  printJS({
    printable: "imprimir_folha_ponto",
    type: "html",
    scanStyles: false,
  });
};
</script>

<template>
  <div
    id="imprimir_folha_ponto"
    style="font-size: 12px"
  >
    <div v-if="props.dadosParaImpressao">
      <div
        v-for="(funcionario, key) in props.dadosParaImpressao.dadosFuncionarios"
        :key="key"
      >
        <table
          width="100%"
          class="tbTitulo"
          style="border: 1px solid black; padding: 4px; text-align: center"
        >
          <tr>
            <td
              rowspan="4"
              style="width: 150px"
              ><img
                src="src/assets/Logo-Real-Shop-Car-menor.png"
                width="135"
            /></td>
            <td
              style="font-weight: bold; font-size: 12px"
              name="razao"
              ><span> {{ globalState.empresa.RAZAO_SOCIAL }}</span></td
            >
          </tr>
          <tr>
            <td style="font-size: 12px"
              ><span name="cidade"></span>{{ globalState.empresa.BAIRRO }}-{{ globalState.empresa.UF }}</td
            >
            <td style="font-size: 12px">Bairro: <span name="bairro"></span>{{ globalState.empresa.ENDERECO }}</td>

            <td style="font-size: 12px">CNPJ:<span name="cnpj"></span> {{ globalState.empresa.CGC_EMPRESA }}</td>
          </tr>
          <tr>
            <td style="font-size: 12px">CEP: <span name="cep"></span>{{ globalState.empresa.CEP }}</td>
            <td style="font-size: 12px">Telefone: <span name="fone"></span>{{ globalState.empresa.TELEFONE1 }}</td>
            <td style="font-size: 12px"
              >Inscrição: <span name="inscricao"></span>{{ globalState.empresa.INSCRICAO }}</td
            >
          </tr>
        </table>
        <div
          class="infoFunc"
          style="
            text-align: center;
            font-size: 12px;
            font-weight: bold;
            border: 1px solid black;
            padding: 4px;
            text-align: center;
          "
        >
          {{ funcionario.NOME_COMP }} - CPF: {{ funcionario.CPF }} - Cargo: {{ funcionario.CARGO }} - Admissão:
          {{ formatarDataAdmissao(funcionario.DATA_ADMISSAO) }}
        </div>
        <table
          class="tabela"
          style="width: 100%; border-collapse: collapse"
        >
          <thead>
            <tr>
              <th style="border: 1px solid black; background-color: #f2f2f2">Dia da Semana</th>
              <th style="border: 1px solid black; background-color: #f2f2f2">Data</th>
              <th style="border: 1px solid black; background-color: #f2f2f2">Entrada</th>
              <th style="border: 1px solid black; background-color: #f2f2f2">Saída</th>
              <th style="border: 1px solid black; background-color: #f2f2f2">Entrada</th>
              <th style="border: 1px solid black; background-color: #f2f2f2">Saída</th>
              <th style="border: 1px solid black; background-color: #f2f2f2">Justificativa</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(dia, index) in formatarDadosTable(funcionario)"
              :key="dia.data"
              :style="{
                backgroundColor: index % 2 === 0 ? '#d9dce590' : '',
              }"
            >
              <td style="border: 1px solid black; padding: 4px; text-align: center">{{ dia.diaSemana }}</td>
              <td style="border: 1px solid black; padding: 4px; text-align: center">{{ dia.data }}</td>
              <td style="border: 1px solid black; padding: 4px; text-align: center">{{ dia.entrada1 }}</td>
              <td style="border: 1px solid black; padding: 4px; text-align: center">{{ dia.saida1 }}</td>
              <td style="border: 1px solid black; padding: 4px; text-align: center">{{ dia.entrada2 }}</td>
              <td style="border: 1px solid black; padding: 4px; text-align: center">{{ dia.saida2 }}</td>
              <td style="border: 1px solid black; padding: 4px; text-align: center">{{ dia.justificativa }}</td>
            </tr>
          </tbody>
        </table>
        <br /><br />
        <div style="float: left; width: 50%; text-align: center; font-size: 14px">
          <span>______________________________________________</span><br />
          <span>Assinatura do Gerente</span>
        </div>
        <div style="float: left; width: 50%; text-align: center; font-size: 14px">
          <span>______________________________________________</span><br />
          <span>{{ funcionario.NOME_COMP }}</span>
        </div>
        <br /><br /><br />
      </div>
    </div>
  </div>

  <v-btn
    color="primary"
    class="btnImprimir"
    @click="print()"
  >
    <v-icon>mdi-printer-settings</v-icon>
    Imprimir
  </v-btn>
</template>

<style>
.btnImprimir {
  position: fixed;
  bottom: 10px;
  right: 10px;
  margin-right: 10px;
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
  background-color: #f2f2f2;
}
</style>
