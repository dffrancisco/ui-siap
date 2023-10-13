import axios from "axios";
import state from "./globalState";
import xModal from "@/plugins/xModal/xModal";
import xGrid from "@/plugins/xGridV2/index";

let dateTimeCurrent = new Date();

let controleLoad = false;
export default {
  async begin() {

    if (controleLoad) return

    controleLoad = true
    await this.getDataHora()

    controleLoad = false;

  },

  async getDataHora() {


    const { data } = await axios.post("/index", {
      call: "getDataHora",
    });



    if (data.length == 1) {
      const dt = data[0];
      state.DIA = String(dt.DIA).padStart(2, "0");
      state.MES = String(dt.MES).padStart(2, "0");
      state.ANO = dt.ANO;
      state.DATA = `${state.DIA}/${state.MES}/${state.ANO}`;

      dateTimeCurrent.setDate(dt.DIA);
      dateTimeCurrent.setMonth(dt.MES);
      dateTimeCurrent.setFullYear(dt.ANO);
      dateTimeCurrent.setHours(dt.H, dt.M, dt.S);

      let h: string, m: string, s: string;
      setInterval(() => {
        h = ("0" + dateTimeCurrent.getHours()).substr(-2);
        m = ("0" + dateTimeCurrent.getMinutes()).substr(-2);
        s = ("0" + dateTimeCurrent.getSeconds()).substr(-2);
        state.HORA = `${h}:${m}:${s}`;
        dateTimeCurrent.setSeconds(Number(s) + 1);
      }, 1000);
    } else {
      console.log("error data não localizada");
    }
  },

  async getEmpresa() {
    let rs = await axios.post("/empresa", {
      call: "getEmpresa",
    });

    if (!rs.data.length) {
      return rs.data;
    }

    state.empresa = rs.data[0];
    sessionStorage.setItem("empresa" + state.nomeSistema, JSON.stringify(rs.data[0]));
  },

  getProdutoThumb(codProduto: string | number, size = 100): string {
    return state.urlFotoThumb + '?img=' + state.urlFotoProduto + codProduto + '.jpg&s=' + size;
  },

  getProdutoFoto(codProduto: string): string {
    return state.urlFotoProduto + codProduto + '.jpg';
  },

  getFuncionarioThumb(cpf: string, size = 100): string {
    let _cpf = cpf.split('.').join('').split('-').join('').split('/').join('');
    return state.urlFotoThumb + '?img=' + state.urlFotoFuncionario + _cpf + '.jpg&s=' + size;

  },

  getFuncionarioFoto(cpf: string): string {
    let _cpf = cpf.split('.').join('').split('-').join('').split('/').join('');
    return state.urlFotoFuncionario + _cpf + '.jpg';
  },

  setThemeComponents(setRunTime?: false) {
    // let bar = document.getElementById("bgBar");

    if (state.theme.current.dark) {
      xModal.setTheme("xModal-xAtila-dark");
      xGrid.setTheme("x-bocatan");
      document.querySelector('html').classList.add('dark')
    } else {
      xModal.setTheme("xModal-xAtila");
      xGrid.setTheme("x-whiteV2");
      document.querySelector('html').classList.remove('dark')
    }


    // if (setRunTime) {
    //   if (state.theme.current.dark) {
    //     let elxGrid = document.getElementsByClassName('x-whiteV2');
    //     for (let i in elxGrid)
    //       elxGrid[i].classList.replace('x-whiteV2', 'x-darkV2')

    //   } else {
    //     let elxGrid = document.getElementsByClassName('x-darkV2');
    //     for (let i in elxGrid)
    //       elxGrid[i].classList.replace('x-darkV2', 'x-whiteV2')
    //   }

    // }


  },

  toggleTheme() {

    state.theme.name = state.theme.current.dark ? "light" : "dark";
    localStorage.setItem("defaultTheme", state.theme.name);
    this.setThemeComponents(true);
  },


};
