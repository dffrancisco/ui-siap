<script setup lang="ts">
import router from "../../router";

import login from "../login/login";
</script>

<template>
  <v-main>
    <v-container>
      <v-card
        max-width="1000"
        class="mx-auto pa-3"
      >
        <v-row>
          <div class="d-flex flex-wrap pa-6">
            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/descontoOrcamento')"
              >Desconto Orçamento
            </v-btn>

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/impressorasTermicas')"
              >Impressoras Térmicas</v-btn
            >

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/marcas')"
              >Marcas</v-btn
            >

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/aniversariantes')"
              >Aniversariantes</v-btn
            >

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/cidades')"
            >
              Cidades
            </v-btn>

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/carros')"
              >Carros
            </v-btn>

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/carroCliente')"
            >
              Carro Cliente
            </v-btn>

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/entregarReceber')"
            >
              Entregar e Receber
            </v-btn>

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/valeDinheiro')"
            >
              Vale dinheiro
            </v-btn>

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/corredores')"
            >
              Corredores
            </v-btn>

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/chamados')"
              >Chamados
            </v-btn>

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/transportadoras')"
              >Transportadoras
            </v-btn>

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/montagemProduto')"
              >Montagem Produto
            </v-btn>

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/documentosFuncionarios')"
            >
              Documentos Funcionarios
            </v-btn>

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/descontoCliente')"
            >
              Bairros
            </v-btn>

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/bloquearCliente')"
            >
              Bloquear Cliente
            </v-btn>

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/cargos')"
              >Cargos
            </v-btn>

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/vendaPorMarca')"
              >Venda Por Marca
            </v-btn>

            <v-btn
              class="mr-4 mb-4"
              @click="login.actions.confirmarSaida()"
            >
              Logout
            </v-btn>
          </div>
        </v-row>
      </v-card>
    </v-container>
  </v-main>
</template>

<style lang="scss" scoped>
// import { permissoes } from '@/helps/configuracoes'

.vMain {
  height: calc(100vh - 110px);
  width: 100%;
  display: flex;
}

.vLeft {
  width: 70vw;
}

.vRight {
  width: 30vw;
}

.vFooter {
  position: fixed;
  bottom: 0;
  height: 50px;
  width: 100%;
}
</style>
