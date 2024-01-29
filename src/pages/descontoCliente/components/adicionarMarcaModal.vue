<script setup lang="ts">
import { actions, state } from '../descontoCliente';
</script>

<template>
    <v-container class="pa-1">
        <title>Adicionar Marca</title>
        <div id="marcasAdicionadasCampos">
            <v-row>
                <v-col cols="8">
                    <span>Marca</span>
                    <input 
                        type="text"
                        v-model="state.dbMarcaAdicionada.DESCRICAO"
                        class="obr ss"
                        :disabled="true"
                    >
                </v-col>
                <v-col>
                    <span>Desconto %</span>
                    <input 
                        type="text"
                        v-model="state.dbMarcaAdicionada.DESCONTO"
                        class="obr ss"
                        v-money3="state.configVMoney"
                        style="text-align: end;"
                    >
                </v-col>
            </v-row>
            <v-row class="mb-1 mt-1">
                    <v-col>
                        <span>Data Inicial (Opcional)</span>
                        <input 
                            type="text"
                            v-model="state.dbMarcaAdicionada.DATA_INICIAL"
                            class=" ss"
                            placeholder="DD/MM/AAAA"
                            v-mask="'##/##/####'"
                            maxlength="10"
                        >
                    </v-col>
                    <v-col cols="">
                        <span>Data Final (Opcional)</span>
                        <input 
                            type="text"
                            v-model="state.dbMarcaAdicionada.DATA_FINAL"
                            class=" ss"
                            placeholder="DD/MM/AAAA"
                            v-mask="'##/##/####'"
                            maxlength="10"
                        >
                    </v-col>
                </v-row>
                <div id="btnMarcasAdicionadas"></div>
        </div>
    </v-container>
</template>

<style scoped> 
    #btnMarcasAdicionadas {
        display: flex;
        justify-content: space-between;
    }
</style>