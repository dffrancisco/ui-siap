<script setup lang="ts">
import { state, actions } from "./documentosFuncionarios";
import { nextTick, onUnmounted } from "vue";
import { useEventListener } from "@vueuse/core";
import $ from "jquery";
import documentosFuncionariosSearch from "./components/documentosFuncionariosSearch.vue"

nextTick(async () => {
    $(".ss").attr("autocomplete", "off");

    state.edtSearch = <any>document.getElementById("edtSearch");

    actions.grids();
    state.gridPrincipal.queryOpen({ descricao: "" }, () => {
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
        <title>Documentos Funcionarios</title>
        <v-card
            class="pa-5"
            style="width: 700px; margin: 0 auto"
        >
            <div id="pnCampos">
                <v-row>
                    <v-col cols="5">
                        <span>Descrição</span>
                        <input
                            v-model="state.dbDocumentosFuncionarios.descricao"
                            type="text"
                            id="descricao"
                            name="descricao"
                            required
                            class="obr ss"
                            maxlength="50"
                            autocomplete="off"
                        />
                    </v-col>
                    <v-col cols="4">
                        <span>Pasta</span>
                        <input
                            type="text"
                            v-model="state.dbDocumentosFuncionarios.pasta"
                            id="pasta"
                            name="pasta"
                            required
                            class="obr ss"
                            maxlength="50"
                            autocomplete="off"
                        >
                    </v-col>
                    <v-col cols="3">
                        <span>Controle</span>
                        <select
                            v-model="state.dbDocumentosFuncionarios.controle"
                            name="controle"
                            id="controle"
                            class="obr ss"
                        >
                            <option value="1">Penalidades</option>
                            <option value="2">Documentos</option>    
                        </select>
                    </v-col>
                </v-row>
            </div>

            <documentosFuncionariosSearch />

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
        <div id="pnCodigoTela">DOCUMENTOS_FUNCIONARIOS</div>
    </v-container>
</template>