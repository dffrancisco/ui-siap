<script setup lang="ts">
import utils from "@/ts/utils";
import { confirmaCodigo } from "@/ts/utils";
import Swal from "sweetalert2";

// regra que sera usada futuramente na modal
confirmaCodigo({
    msg: "Confirma exclusão deste registro?",
    call: async function () {
        try {
            await
                Swal.fire({
                    icon: "success",
                    title: "Ausência deletada com sucesso!",
                    showConfirmButton: false,
                    timer: 2500,
                });
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Ocorreu um erro ao deletar a falta.",
            });
        }
    },
});




</script>

<template>
    <v-card>
        <p> Deseja liberar o crédito {{}} </p>

        <v-btn class="bg-green"> confirmar </v-btn>
        <v-btn class="bg-orange"> cancelar </v-btn>

    </v-card>
</template>

<style scoped></style>
