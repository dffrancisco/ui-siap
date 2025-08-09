import { computed, reactive } from "vue";
import { iOrcamento, iVendedor } from "./interfaces";
import Swal from "sweetalert2";
import servicetrocarVendedor from './services/trocarVendedor.service';
import xAuthManager from "@/plugins/xAuthManager";


export const state = reactive({
    loading: false,
    orcamento: <iOrcamento>{},
    numOrcamento: '',
    vendedores: <iVendedor[]>[],
    novoVendedor: <iVendedor>{
        NOME_COMP: ''
    },

})

export const actions = {

    init() {
        actions.getVendedores();
        try {

        } finally {
            state.loading = false;
        }
    },
    async getVendedores() {
        try {
            state.vendedores = await servicetrocarVendedor.getVendedores();

        } catch (error) {
            Swal.fire({
                text: error?.response?.data?.msg || 'Ocorreu um erro ao buscar vendedores',
                icon: "error"
            })
        }
    },

    async getOrcamento() {
        clearNovoVendedor()

        try {
            state.loading = true;
            state.orcamento = await servicetrocarVendedor.getOrcamento(parseInt(state.numOrcamento))

            if (!state.orcamento.NUM_ORCAMENTO) {
                Swal.fire({
                    text: "Orçamento não encontrado",
                    icon: "warning"
                })

            }

        } catch (error) {
            Swal.fire({
                text: error?.response?.data?.msg || 'Ocorreu um erro ao buscar orçamentos',
                icon: "error"
            })

        } finally {
            state.loading = false;
        }



    },
    async onClickTrocar(novoVendedor) {
      console.log(novoVendedor, "qqqqqqqq")

      if (!novoVendedor.COD_FUNCIONARIO) {
        return Swal.fire({
          text: "Selecione o vendedor",
          icon: "warning"
        })
      }

      if (novoVendedor.COD_FUNCIONARIO == this.orcamento.COD_FUNCIONARIO) {
        return Swal.fire({
          text: "O novo vendedor não pode ser igual ao vendedor atual",
          icon: "warning"
        })
      }

      xAuthManager("Autorizar troca de vendedor", async (dados) => {
        try {
          this.loading = true
          this.orcamento = await servicetrocarVendedor.updateVendedor({
            COD_FUNCIONARIO: novoVendedor.COD_FUNCIONARIO,
            NUM_ORCAMENTO: this.orcamento.NUM_ORCAMENTO,
            COD_FUNCIONARIO: parseInt(dados.cod_funcionario)
          })

          Swal.fire({
            text: "Vendedor alterado com sucesso",
            icon: "success"
          })
        } catch (error) {
          Swal.fire({
            text: error?.response?.data?.msg || 'Ocorreu um erro ao atualizar vendedor',
            icon: "error"
          })
        } finally {
          this.loading = false
        }
      })
    }
  }
    

const clearNovoVendedor = () => {
    state.novoVendedor = {
        NOME_COMP: '',
        COD_FUNCIONARIO: undefined,
        CPF: '',
    }
}





