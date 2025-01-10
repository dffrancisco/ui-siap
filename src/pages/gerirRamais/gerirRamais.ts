import { nextTick, reactive } from "vue";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import Swal from "sweetalert2";
import { msgConfirm } from "@/ts/message";
import { iRamal, iSetor, iParamToGetRamal, iParamToInsertRamal, iFieldDuplicity, iParamToUpdateRamal } from "./interfaces";
import utils from "@/ts/utils";
import serviceGerirRamais from "./services/gerirRamais.service";
import { useEventListener } from "@vueuse/core";
import LogoRealShopCar from "@/assets/Logo-Real-Shop-Car-menor.png";



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
        await actions.dadosParaInput();
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
                Setor: { dataField: "nome" },
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
                duplicity: {
                    dataField: ["nome"],
                    async execute(rs) {
                        let dup = await actions.getDuplicidade({
                            value: rs.value.toUpperCase(),
                            field: rs.field,
                        });
                        if (dup && Object.keys(dup).length > 0) {
                            state.gridPrincipal.showMessageDuplicity(
                                rs.text + " já cadastrado!"
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
                document.getElementById("btnUpdate")?.click();
            },
        });
    },

    async dadosParaInput() {
        try {
            state.loading = true;


            const [setores, ramais] = await Promise.all([
                serviceGerirRamais.getSetores({ param: {}, offset: 0 }),
                serviceGerirRamais.getRamais({ offset: 0, param: {} }),
            ]);


            state.setores = setores;
            state.lojas = [...new Map(ramais.map(item => [item.loja, item.loja])).values()];
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao carregar dados para os inputs.",
            });
        } finally {
            state.loading = false;
        }
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

    async getDuplicidade({ value, field }: iFieldDuplicity) {
        try {

            if (!value) {
                return null;
            }
            const data = await serviceGerirRamais.getDuplicidade({ value, field });
            return data;
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Erro ao verificar duplicidade!",
                text: "Erro ao executar verificação de duplicidade",
            });
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
                id_ramal: state.dbRamal.id_ramal,
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
            loja: searchValue

        });
    },

    async onClickImprimir() {
        try {
            state.loading = true;

            const dadosRamais = state.gridPrincipal.data();
            const dadosTratados = Array.isArray(dadosRamais) ? dadosRamais : [dadosRamais];

            if (!dadosTratados.length) {
                Swal.fire({
                    icon: "warning",
                    text: "Não há dados para a impressão.",
                });
                return;
            }

            //gepeto
            const dadosAgrupados = dadosTratados.reduce((acc, item) => {
                let loja = acc.find((l) => l.loja === item.loja);
                if (!loja) {
                    loja = { loja: item.loja || "---", setores: [] };
                    acc.push(loja);
                }
                loja.setores.push({
                    nome: item.nome || "---",
                    ramal: item.ramal || "---",
                    setor: item.setor || "---",
                });
                return acc;
            }, []);

            const corPastelAleatoria = () => {
                const r = Math.floor((Math.random() * 127) + 127);
                const g = Math.floor((Math.random() * 127) + 127);
                const b = Math.floor((Math.random() * 127) + 127);
                return `rgb(${r}, ${g}, ${b})`;
            };

            const titulo = `
                <div style="text-align: center; margin-bottom: 20px;">
                    <strong style="font-size: 16px;">Relatório de Ramais</strong>
                </div>
            `;

            const corpo = dadosAgrupados.map((loja) => {
                const corHeader = corPastelAleatoria();

                const setoresHtml = loja.setores
                    .map(
                        (setor) => `
                            <tr>
                                <td style="padding: 4px; border: 1px solid #ccc;">${setor.nome}</td>
                                <td style="padding: 4px; border: 1px solid #ccc;">${setor.ramal}</td>
                            </tr>`
                    )
                    .join("");

                return `
                    <div class="card">
                        <div class="card-header" style="background-color: ${corHeader}; color: #000;">
                            ${loja.loja}
                        </div>
                        <div class="card-body">
                            <table style="width: 100%; font-size: 12px;">
                                <thead>

                                    <tr style="background-color: #f2f2f2;">
                                        <th style="padding: 4px; border: 1px solid #ccc;">Nome</th>
                                        <th style="padding: 4px; border: 1px solid #ccc;">Ramal</th>
                                    </tr>
                                    
                                </thead>
                                <tbody>
                                    ${setoresHtml}
                                </tbody>
                            </table>
                        </div>
                    </div>
                `;
            });

            const layout = `
                <html>
                    <head>
                        <title>Definição do relatório de ramais.</title>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <style>
                            @media print {
                                body {
                                    -webkit-print-color-adjust: exact;
                                    print-color-adjust: exact;
                                }
                                .card-header {
                                    color: #000;
                                    -webkit-print-color-adjust: exact;
                                }
                            }
                            body {
                                margin: 0;
                                padding: 10px;
                                font-family: Arial, sans-serif;
                                font-size: 12px;
                            }
                            .container {
                                display: flex;
                                flex-wrap: wrap; 
                                gap: 20px;
                                justify-content: flex-start;
                            }
                            .card {
                                flex: 0 0 calc(25% - 20px);
                                border: 1px solid #ddd;
                                box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
                                padding: 10px;
                                background-color: #fff;
                                box-sizing: border-box;
                            }
                            .card-header {
                                display: flex;
                                font-weight: bold;
                                text-align: center;
                                margin-bottom: 10px;
                                font-size: 14px;
                                padding: 5px;
                                border-bottom: 1px solid #ddd;
                            }
                            .card-body {
                                display: flex;
                                flex-direction: column;
                                gap: 10px;
                            }
                            table {
                                width: 100%;
                                border-collapse: collapse;
                            }
                            th, td {
                                padding: 4px;
                                border: 1px solid #ccc;
                                text-align: left;
                            }
                            thead tr {
                                background-color: #f2f2f2;
                            }
                            .footer {
                                margin-top: 20px;
                                display: flex;
                                justify-content: flex-end; /* Move o conteúdo para a direita */
                                align-items: center;
                            }
                            .footer img {
                                height: 50px;
                            }
                        </style>
                    </head>
                    <body>
                        ${titulo}
                        <div class="container">
                            ${corpo.join("")}
                        </div>
                        <div class="footer">
                            <img src="../assets/Logo-Real-Shop-Car-menor.png" alt="Logo da Empresa" width="135">
                        </div>
                    </body>
                </html>
            `;
            //gepeto
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
    }


};

export default { state, actions, eventListener };
