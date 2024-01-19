<script setup lang="ts">
import { actions, state } from "./montagemProduto";
import { nextTick, onUnmounted } from "vue";
import { useEventListener } from "@vueuse/core";
import produtosSearch from "./components/produtosSearch.vue";
import $ from "jquery";

const eventListener = useEventListener(document, "keydown", async (event) => {
    if (event.key === "F1") {
        state.edtSearch.select()
        event.preventDefault();
        event.stopPropagation();
    };
});

nextTick(async () => {
    $(".ss").attr("autocomplete", "off");

    state.edtSearch = <any>document.getElementById("edtSearch");

    actions.grids();
    actions.getCarros();
    state.gridPrincipal.queryOpen({DESC_MONTAGEN: ""}, () => {
        state.gridPrincipal.focus();
    });
});

onUnmounted(() => {
    removeEventListener("keydown", eventListener)
});

</script>

<template>
    <v-container>
        <title>Montagem Produto</title>
        <v-card
            class="pa-5"
            style="width: 700px; margin: 0 auto;"
        >
            <div id="pnCampos">
                <v-row>
                    <v-col cols="6">
                        <span>Descrição da Montagem</span>
                        <input
                            v-model="state.dbProdutoMontagem.DESC_MONTAGEN"
                            type="text"
                            id="DESC_MONTAGEN"
                            name="DESC_MONTAGEN"
                            required
                            class="obr ss"
                            maxlength="40"
                            autocomplete="off"
                        />
                    </v-col>
                    <v-col cols="3">
                        <span>Carro</span>
                        <select
                            v-model="state.dbProdutoMontagem.ID_CARRO"
                            name="ID_CARRO"
                            id="ID_CARRO"
                            class="obr ss"    
                        >
                            <option
                                v-for="carro in state.listaCarros"
                                :value="carro.ID_CARRO"
                            >
                                {{ carro.DESCRICAO }}
                            </option>
                        </select>
                    </v-col>
                    <v-col cols="3">
                        <span>Valor</span>
                        <input
                            v-model="state.dbProdutoMontagem.VALOR"
                            type="text"
                            id="VALOR"
                            name="VALOR"
                            required
                            class="obr ss"
                            maxlength="15"
                            autocomplete="off"
                        >
                    </v-col>
                </v-row>
            </div>

            <produtosSearch />

            <div id="gridPrincipal"></div>
            <div
                id="pnBotoes"
                class="mt-3"
                style="text-align: center"
            ></div>
        </v-card>
        <div id="pnCodigoTela">MONTAGEM_PRODUTO</div>
    </v-container>
</template>

<style scoped></style>