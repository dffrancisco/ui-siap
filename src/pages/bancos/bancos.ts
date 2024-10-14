import { nextTick, reactive } from "vue";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import Swal from "sweetalert2";
import { msgConfirm } from "@/ts/message";
import { iBanco, iParamGetBanco, iFieldDuplicity } from "./interfaces";
import utils from "@/ts/utils";
import serviceBancos from "./services/bancos.service";


export const state = reactive({
  gridPrincipal: <ixGridCreate>{},
  pnSearch: false,
  lista: <iBanco[]>[],
  edtSearch: "",
  dbBanco: <iBanco>{},
  loading: false,
});


export const actions = {
  async init() {
    actions.grids();
    state.gridPrincipal.queryOpen({ DS_BANCO: "" }, () => {
      state.gridPrincipal.focus();
    });
  },

  grids() {
    state.gridPrincipal = new xGridV2.create({
      el: "#gridPrincipal",
      height: 200,
      count: true,
      columns: {
        "Bancos": { dataField: "DS_BANCO" },
        "Código": { dataField: "CD_BANCO" },
        "Sigla": { dataField: "SG_BANCO" },
      },
      query: {
        async execute(rs) {
          let data = await actions.getBanco({
            offset: rs.offset,
            param: rs.param,
          });

          state.gridPrincipal.querySourceAdd(data);
        },
      },
      sideBySide: {
        el: "#pnCampos",
        vModel(r) {
          state.dbBanco = r;
        },
        duplicity: {
          dataField: ["CD_BANCO"],
          async execute(rs) {
            let dup = await actions.getDuplicidade({
              value: rs.value.toUpperCase(),
              field: rs.field,
            });

            if (dup && Object.keys(dup).length > 0) {
              state.gridPrincipal.showMessageDuplicity(
                rs.text + " já cadastrado."
              );
              return true;
            }
            return false;
          },
        },
        frame: {
          el: "#pnBotoes",
          buttons: {
            novo: {
              html: "Novo",
              state: "insert",
              click: actions.btnInsert,
            },
            update: {
              html: "Alterar",
              state: "update",
              click: actions.btnEdit,
              id: "btnUpdate",
            },
            excluir: {
              html: "Excluir",
              state: "delete",
              click: actions.btnDelete,
            },
            salvar: {
              html: "Salvar",
              state: "save",
              click: actions.btnSave,
              preLoad: "Salvando",
            },
            cancela: {
              html: "Cancelar",
              state: "cancel",
              click: actions.btnCancel,
            },
          },
        },
      },
      enter: function () {
        document.getElementById("btnUpdate").click();
      },
    });
  },

  async getBanco({ offset, param }: iParamGetBanco) {
    try {
      state.loading = true;
      const data = await serviceBancos.getBancos({ offset, param });

      return data;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erro ao exibir os bancos.",
        text: error.message,
      });
    } finally {
      state.loading = false;
    }
  },


  async search() {
    const searchValue = state.edtSearch?.toUpperCase();

    state.gridPrincipal.queryOpen({
      DS_BANCO: searchValue,
    });

  },

  async getDuplicidade({ value, field }: iFieldDuplicity) {
    try {
      const data = await serviceBancos.getDuplicidade({ value, field });
      return data;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erro ao verificar duplicidade.",
        text: error.message,
      });
    }
  },

  async btnInsert() {
    state.pnSearch = true;
    state.dbBanco = {} as iBanco
    await nextTick()

    state.gridPrincipal.focusField();
    state.gridPrincipal.disable();
  },

  btnEdit() {
    if (!state.gridPrincipal.dataSource()) {
      Swal.fire({
        icon: "info",
        text: "Operação cancelada, nenhum registro selecionado.",
      });
      return false;
    }
    state.gridPrincipal.disable();
    state.gridPrincipal.focusField();
  },

  async btnDelete() {

    if (!state.gridPrincipal.dataSource()) {
      Swal.fire({
        icon: "info",
        text: "Operação cancelada selecione um registro",
      });
      return false;
    }


    if (await msgConfirm("Confirmação", "Confirma a exclusão?")) {
      await actions.toDelete();
      state.gridPrincipal.focus();
    }
  },

  async btnSave() {

    if (utils.validaOBR()) {
      return false;
    }

    if (await state.gridPrincipal.getDuplicityAll()) {
      return false;
    }

    if (state.dbBanco.CD_BANCO?.length < 3) {
      await Swal.fire({
        icon: "warning",
        text: "codigo de banco não pode ter menos de 3 caracteres.",
      });
      return false;
    }

    if (state.gridPrincipal.dataSource() == false) {
      actions.toInsert();
    } else {
      actions.toUpdate();
    }

    state.pnSearch = false;
    await nextTick();

    state.gridPrincipal.enable();
    state.gridPrincipal.focus();
  },

  async btnCancel() {
    state.pnSearch = false;
    let linhaGrid = <any>state.gridPrincipal.getIndex()
    await nextTick()

    state.gridPrincipal.enable();
    state.gridPrincipal.focus(linhaGrid);
  },

  async toDelete() {
    try {
      let cd_banco = state.dbBanco.CD_BANCO;

      state.loading = true;

      await serviceBancos.toDelete(cd_banco);

      state.gridPrincipal.deleteLine();
      await Swal.fire({
        icon: "success",
        text: "Banco deletado com sucesso.",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erro ao excluir o banco, verificar ",
        text: error.message,
      });
    } finally {
      state.loading = false;
    }
  },
  async toInsert() {
    try {
      state.loading = true;

      let newFields = {
        DS_BANCO: state.dbBanco.DS_BANCO?.toUpperCase(),
        CD_BANCO: state.dbBanco.CD_BANCO,
        SG_BANCO: state.dbBanco.SG_BANCO?.toUpperCase(),
      };

      await serviceBancos.toInsert(newFields);
      state.gridPrincipal.insertLine({ ...newFields });

      await Swal.fire({
        icon: "success",
        text: "Banco adicionado com sucesso.",
      });

    } catch (error) {
      await Swal.fire({
        icon: "error",
        text: "erro ao adicionar banco.",
      });
    } finally {
      state.loading = false;
    }
  },

  async toUpdate() {
    try {

      let param = {
        DS_BANCO: state.dbBanco.DS_BANCO?.toUpperCase(),
        CD_BANCO: state.dbBanco.CD_BANCO,
        SG_BANCO: state.dbBanco.SG_BANCO?.toUpperCase(),
      }

      state.loading = true;

      await serviceBancos.toUpdate(param);

      state.gridPrincipal.dataSource(param);

      await Swal.fire({
        icon: "success",
        text: "Banco atualizado com sucesso.",
      });

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erro ao atualizar banco!",
        text: error.message,
      });
    } finally {
      state.loading = false;
    }
  },




};

