import { reactive } from "vue";
import { iEmpresa } from "@/models/interfaces";

const urlServerNuven = 'http://www.reallatas.com.br/';

const state = reactive({
  nomeSistema: 'Siap',
  defaultTheme: localStorage.getItem('defaultTheme') || 'light',
  theme: <any>{},
  calc: null,
  DIA: "",
  MES: "",
  ANO: "",
  HORA: "",
  DATA: "",
  empresa: <iEmpresa>{},
  CNPJMatriz: '05.849.121.0001-26',
  urlServerNuven: urlServerNuven,
  urlFotoProduto: urlServerNuven + 'balcao/foto/',
  urlFotoFuncionario: urlServerNuven + 'foto_funcionarios/',
  urlFotoThumb: urlServerNuven + '_serverAPP/thumb.php'

});

export default state;
