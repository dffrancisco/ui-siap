import moment from "moment";
import { reactive } from "vue";
import { mesesToSelect } from "@/constants/constants";
import Swal from "sweetalert2";
import { msgConfirm } from "@/ts/message";
import serviceGerarXmlParaContabilidade from "./services/gerarXmlParaContabilidade.service";
import { iParamGerarXml } from "./interfaces";

const ano = moment().year();
const mes = moment().month() == 0 ? 12 : moment().month()

export const meses = mesesToSelect;

export const state = reactive({
    optionSelect: "1",
    loading: false,
    dataInicio: moment().subtract(1, "month").startOf("month").format("YYYY-MM-DD"),
    dataFim: moment().subtract(1, "month").endOf("month").format("YYYY-MM-DD"),
    mes: mes,
    ano: ano,
});

export const actions = {
    validarInputs() {

        if (state.optionSelect == "0") {

            if (!state.dataInicio || !state.dataFim) {
                Swal.fire({
                    icon: "warning",
                    text: "Insira datas válidas para continuar",
                });
                return;
            }

            const inicio = moment(state.dataInicio);
            const fim = moment(state.dataFim);

            if (!inicio.isSame(fim, "month")) {
                Swal.fire({
                    icon: "warning",
                    text: "As datas devem estar dentro do mesmo mês",
                });
                return;
            }

        } else if (state.optionSelect == "1") {

            if (!state.mes || !state.ano || state.ano > ano) {
                Swal.fire({
                    icon: "warning",
                    text: "Insira um mês e ano válidos para continuar",
                });
                return;
            }
        }

        actions.gerarXmlParaContabilidade();
    },

    async gerarXmlParaContabilidade() {
        if (
            await msgConfirm(
                "Confirmação",
                "Gostaria de gerar o XML das notas fiscais para a Contabilidade?"
            )
        ) {
            let param: iParamGerarXml = {
                dataInicio: "",
                dataFim: "",
                ano: 2024,
                mes: 0,
                nomeMes: "",
                buscarNotasEntrada: false,
            };

            //dataInicio e dataFim
            if (state.optionSelect == "0") {
                param.dataInicio = state.dataInicio;
                param.dataFim = state.dataFim;
                const inicio = moment(state.dataInicio);
                param.ano = inicio.year();
                param.mes = inicio.month() + 1;
                const nomeMes = meses.find((m) => m.value === param.mes)?.title || "";
                param.nomeMes = nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1);
                param.buscarNotasEntrada = false;

                //mes e ano   
            } else if (state.optionSelect == "1") {
                const inicioMes = moment(`${state.ano}-${state.mes}-01`).startOf("month");
                const fimDoMes = moment(inicioMes).endOf("month");
                param.dataInicio = inicioMes.format("YYYY-MM-DD");
                param.dataFim = fimDoMes.format("YYYY-MM-DD");
                param.mes = state.mes;
                param.ano = state.ano;
                const nomeMes = meses.find((m) => m.value === state.mes)?.title || "";
                param.nomeMes = nomeMes;
                param.buscarNotasEntrada = true;
            }

            try {
                state.loading = true;
                await serviceGerarXmlParaContabilidade.gerarXmlParaContabilidade(param);

                Swal.fire({
                    icon: "success",
                    title: "XML gerados com sucesso.",
                    showConfirmButton: false,
                    timer: 1000,
                });
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    text: error?.response?.data?.msg || "Ocorreu um erro ao gerar os xml!",
                });
            } finally {
                state.loading = false;
            }
        }
    },
};
