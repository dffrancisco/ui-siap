<script setup lang="ts">
import { state, actions } from "./carroCliente";
import { nextTick, onUnmounted } from "vue";
import carroClienteSearch from "./components/carroClienteSearch.vue";
import { useEventListener } from "@vueuse/core";
import $ from "jquery";

nextTick(async () => {
    $(".ss").attr("autocomplete", "off");

    state.edtSearch = <any>document.getElementById("edtSearch");

    actions.grids();
    actions.getModelos();
    state.gridPrincipal.queryOpen({ PLACA: "" }, () => {
        state.gridPrincipal.focus();
    });

});

onUnmounted(() => {
    removeEventListener("keydown", eventListener);
});

const eventListener = useEventListener(document, "keydown", async (event) => {
    if (event.key === "F1") {
        state.edtSearch.select();
        event.preventDefault();
        event.stopPropagation();
    }
});

</script>

<template>
    <v-container>
        <title>Carro Cliente</title>
        <v-card
            class="pa-5"
            style="width: 700px; margin: 0 auto"
        >
            <div id="pnCampos">
                <v-row>
                    <v-col cols="3">
                        <span>Placa</span>
                        <input
                            v-model="state.dbCarroCliente.PLACA"
                            type="text"
                            id="PLACA"
                            name="PLACA"
                            required
                            class="obr ss"
                            maxlength="8"
                            autocomplete="off"
                            v-mask="'AAA-AAAA'"
                        />
                    </v-col>
                    <v-col cols="4">
                        <span>Modelo</span>
                        <select
                            v-model="state.dbCarroCliente.MODELO"
                            name="MODELO"
                            id="MODELO"
                            class="obr ss"
                        >
                            <option
                                v-for="carro in state.listaModelos"
                                :value="carro.DESCRICAO"
                            >
                                {{ carro.DESCRICAO }}
                            </option>
                        </select>
                    </v-col>
                    <v-col cols="2">
                        <span>Ano</span>
                        <input
                            v-model.lazy="state.dbCarroCliente.ANO"
                            type="text"
                            id="ANO"
                            name="ANO"
                            required
                            class="obr ss"
                            maxlength="4"
                            autocomplete="off"
                            :oninput="actions.digitarApenasNumeros"
                        />
                    </v-col>
                    <v-col cols="3">
                        <span>Cor</span>
                        <input
                            v-model.lazy="state.dbCarroCliente.COR"
                            type="text"
                            id="COR"
                            name="COR"
                            required
                            class="obr ss"
                            maxlength="15"
                            autocomplete="off"
                        />
                    </v-col>
                </v-row>
            </div>

            <carroClienteSearch />

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

            <div id="gridPrincipal"></div>

            <div
                id="pnBotoes"
                class="mt-3"
                style="text-align: center"
            ></div>

        </v-card>
        <div id="pnCodigoTela">CARRO_CLIENTE</div>
    </v-container>
</template>
