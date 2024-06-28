<template>
  <div>
    <slot
      name="button"
      :onPrint="printData"
    ></slot>
    <v-overlay
      :model-value="state.loading"
      class="align-center justify-center"
      persistent
    >
      <v-progress-circular
        color="primary"
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, reactive } from "vue";
import printJS from "print-js";
import axios from "axios";
import moment from "moment";

interface iColumn {
  name: string;
  key: string;
}

interface iData {
  [key: string]: any;
}

interface iEmpresaPrint {
  CGC_EMPRESA: string;
  RAZAO_SOCIAL: string;
  NOME_FANTAZIA: string;
  ENDERECO: string;
  COD_CIDADE: number;
  TELEFONE1: string;
  TELEFONE2: string;
  INSCRICAO: string;
  BAIRRO: string;
  CEP: string;
  CIDADE: string;
  UF: string;
}

const props = defineProps({
  htmlHeader: {
    type: String,
    default: "",
  },
  htmlFooter: {
    type: String,
    default: "",
  },
  columns: {
    type: Array as () => iColumn[],
    required: true,
  },
  data: {
    type: Array as () => iData[],
    required: true,
  },
});

const emit = defineEmits(["error"]);

const state = reactive({
  loading: false,
  empresa: <iEmpresaPrint>{},
});

const getEmpresa = async (): Promise<iEmpresaPrint> => {
  const { data } = await axios.post("empresa", {
    call: "getEmpresaPrint",
  });

  return data;
};

const printData = async () => {
  try {
    state.empresa = await getEmpresa();
  } catch (error) {
    console.error("erro ao buscar dados da empresa: ", error);
    emit("error");
    return;
  }

  let htmlContent = `
      <div style="text-align: center;">
        <img src="../public/Logo-Real-Shop-Car-menor.png" alt="Logo" style="height: 100px;"/>
        <div>
            <span>${state.empresa.RAZAO_SOCIAL}</span>
            <div>
                <span>${state.empresa.ENDERECO}</span>
                <span>${state.empresa.CGC_EMPRESA}</span>
            </div>
            <div>
                <span>Cidade: ${state.empresa.CIDADE}</span>
                <span>Bairro: ${state.empresa.BAIRRO}</span>
                <span>CEP: ${state.empresa.CEP}</span>
            </div>
            <div>
                <span>Cnpj: ${state.empresa.CGC_EMPRESA}</span>
                <span>Telefone: ${state.empresa.TELEFONE1}</span>
                <span>Data/Hora: ${moment().format("DD/MM/YYYY HH:mm:ss")}</span>
            </div>
        </div>
      </div>
      <table border="1" style="width: 100%; border-collapse: collapse; text-align: left;">
        <thead>
          <tr>
    `;

  // Add table headers dynamically
  props.columns.forEach((column) => {
    htmlContent += `<th>${column.name}</th>`;
  });

  htmlContent += `</tr></thead><tbody>`;

  // Add table data dynamically
  props.data.forEach((row) => {
    htmlContent += `<tr>`;
    props.columns.forEach((column) => {
      htmlContent += `<td>${row[column.key]}</td>`;
    });
    htmlContent += `</tr>`;
  });

  htmlContent += `</tbody></table>`;

  printJS({
    printable: htmlContent,
    type: "raw-html",
    style: `
        table { font-family: Arial, sans-serif; border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #dddddd; text-align: left; padding: 8px; }
        th { background-color: #f2f2f2; }
      `,
  });
};
</script>
