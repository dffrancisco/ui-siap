import { nextTick, reactive } from "vue";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import Swal from "sweetalert2";
import { msgConfirm } from "@/ts/message";
import moment from 'moment';
import { iRamal, iSetor, iParamToGetRamal, iParamToInsertRamal, iParamToUpdateRamal } from "./interfaces";
import utils, { iColumnPrint } from "@/ts/utils";
import serviceGerirRamais from "./services/gerirRamais.service";
import { useEventListener } from "@vueuse/core";

export const state = reactive({
    gridPrincipal: <ixGridCreate>{},
    pnSearch: false,
    lista: <iRamal[]>[],
    edtSearch: "",
    dbRamal: <iRamal>{},
    setores: <iSetor[]>[],
    nome_lojas: <iRamal[]>[],
    lojas: <any[]>[],
    loading: false,

});

export const eventListener = useEventListener(document, "keydown", async (event) => {
    if (event.key === "F1") {
        document.getElementById("edtSearch")?.focus();
        event.preventDefault();
        event.stopPropagation();
    }
});

export const actions = {
    async init() {

        actions.grids();
        await actions.getSetores();
        state.gridPrincipal.queryOpen({ nome: "" }, () => {
            state.gridPrincipal.focus();
        });
    },

    grids() {
        state.gridPrincipal = new xGridV2.create({
            el: "#gridPrincipal",
            height: 200,
            count: true,
            columns: {
                Loja: { dataField: "loja" },
                Setor: { dataField: "id_setor" }, // ajustar dps
                Nome: { dataField: "nome" },
                Ramal: { dataField: "ramal", width: "10%", center: true },
            },
            query: {
                async execute(rs) {
                    let data = await actions.getRamais({
                        offset: rs.offset,
                        param: rs.param,
                    });
                    state.gridPrincipal.querySourceAdd(data);
                },
            },
            sideBySide: {
                el: "#pnCampos",
                vModel(r) {
                    state.dbRamal = r;
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
                document.getElementById("btnUpdate")?.click();
            },
        });
    },

    async getRamais({ offset, param }: iParamToGetRamal) {
        try {
            state.loading = true;
            const data = await serviceGerirRamais.getRamais({ offset, param });
            return data;
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao carregar ramais.",
            });
        } finally {
            state.loading = false;
        }
    },

    async getSetores() {
        try {
            state.loading = true;
            const data = await serviceGerirRamais.getSetores({ param: {}, offset: 0 });
            state.setores = data;
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao carregar setores.",
            });
        } finally {
            state.loading = false;
        }
    },

    async btnInsert() {
        state.pnSearch = true;
        state.dbRamal = {} as iRamal;
        await nextTick();
        state.gridPrincipal.focusField();
        state.gridPrincipal.disable();
    },

    btnEdit() {
        if (!state.gridPrincipal.dataSource()) {
            Swal.fire({
                icon: "info",
                text: "Nenhum registro selecionado.",
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
                text: "Selecione um registro para excluir.",
            });
            return false;
        }

        if (await msgConfirm("Confirmação", "Deseja excluir o registro?")) {
            await actions.toDelete();
            state.gridPrincipal.focus();
        }
    },

    async btnSave() {
        if (utils.validaOBR()) return false;

        if (!state.dbRamal.nome || !state.dbRamal.ramal) {
            Swal.fire({
                icon: "warning",
                title: "Campos obrigatórios",
                text: "Nome e Ramal são obrigatórios.",
            });
            return false;
        }

        if (state.gridPrincipal.dataSource() === false) {
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
        let linhaGrid = <any>state.gridPrincipal.getIndex();
        await nextTick();
        state.gridPrincipal.enable();
        state.gridPrincipal.focus(linhaGrid);
    },

    async toDelete() {
        try {
            const id_ramal = state.dbRamal.id_ramal;
            state.loading = true;
            await serviceGerirRamais.toDelete(id_ramal);
            state.gridPrincipal.deleteLine();
            Swal.fire({
                icon: "success",
                text: "Ramal excluído com sucesso!",
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Erro ao excluir o ramal",
                text: "Erro ao excluir ramal.",
            });
        } finally {
            state.loading = false;
        }
    },

    async toInsert() {
        try {
            state.loading = true;
            const newFields: iParamToInsertRamal = {
                id_sociedade: state.dbRamal.id_sociedade,
                id_setor: state.dbRamal.id_setor,
                ramal: state.dbRamal.ramal,
                nome: state.dbRamal.nome,
            };

            await serviceGerirRamais.toInsert(newFields);
            state.gridPrincipal.insertLine({ ...newFields });
            Swal.fire({
                icon: "success",
                text: "Ramal inserido com sucesso!",
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao inserir ramal.",
            });
        } finally {
            state.loading = false;
        }
    },

    async toUpdate() {
        try {
            const updatedData: iParamToUpdateRamal = {
                ...state.dbRamal,
            };

            state.loading = true;
            await serviceGerirRamais.toUpdate(updatedData);
            state.gridPrincipal.dataSource(updatedData);

            Swal.fire({
                icon: "success",
                text: "Ramal atualizado com sucesso!",
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Erro ao atualizar ramal",
                text: "Erro ao atualizar ramal.",
            });
        } finally {
            state.loading = false;
        }
    },

    async search() {
        const searchValue = state.edtSearch?.toUpperCase();
        state.gridPrincipal.queryOpen({
            nome: searchValue,

        });
    },

    async onClickImprimir() {
        try {
            state.loading = true;

            const dadosRamais = state.gridPrincipal.dataSource();
            const dadosTratados = Array.isArray(dadosRamais) ? dadosRamais : [dadosRamais];

            console.log("Dados tratados para impressão:", dadosTratados);

            if (!dadosTratados.length) {
                Swal.fire({
                    icon: "warning",
                    text: "Não há dados para realizar a impressão.",
                });
                return;
            }

            const dadosAjustados = actions.formatarDadosImpressao(dadosTratados);

            if (!dadosAjustados || !dadosAjustados.length) {
                Swal.fire({
                    icon: "warning",
                    text: "Não há dados ajustados para imprimir.",
                });
                return;
            }

            const titulo = `
                <div style="text-align: center; font-size: 18px; font-weight: bold; margin-bottom: 20px;">
                    Relatorio Gerir Ramais
                </div>
            `;

            const corpo = dadosAjustados.map((loja) => {
                const setoresHtml = loja.setores
                    .map(
                        (setor) => `
                            <div style="display: flex; justify-content: space-between; padding: 5px; border-bottom: 1px solid #ccc;">
                                <span>${setor.nome}</span>
                                <span>${setor.ramal}</span>
                                <span>${setor.setor}</span>
                            </div>`
                    )
                    .join("");

                return `
                    <div style="flex: 1 1 calc(33.333% - 20px); padding: 10px; border: 1px solid #ccc; margin-bottom: 20px;">
                        <div style="font-weight: bold; margin-bottom: 10px; text-align: center;">
                            ${loja.nome}
                        </div>
                        ${setoresHtml}
                    </div>
                `;
            });

            const layout = `
                <html>
                    <head>
                        <style>
                            body { margin: 1; padding: 10px; font-family: Arial; }
                            div { box-sizing: border-box; }
                        </style>
                    </head>
                    <body>${titulo}<div>${corpo.join("")}</div></body>
                </html>
            `;

            const printWindow = window.open("", "_blank");
            if (printWindow) {
                printWindow.document.write(layout);
                printWindow.document.close();
                printWindow.focus();
                printWindow.print();
                printWindow.close();
            }
        } catch (error) {
            console.error("Erro ao imprimir o relatório:", error);
            Swal.fire({
                icon: "error",
                text: "Erro ao imprimir relatório.",
            });
        } finally {
            state.loading = false;
        }
    },

    formatarDadosImpressao(data: any[]) {
        return data.reduce((acc, item) => {
            let loja = acc.find((l) => l.nome === item.loja);
            if (!loja) {
                loja = { nome: item.loja, setores: [] };
                acc.push(loja);
            }
            loja.setores.push({
                nome: item.nome,
                ramal: item.ramal,
                setor: item.setor,
            });
            return acc;
        }, []);
    },
};


export default { state, actions, eventListener };
