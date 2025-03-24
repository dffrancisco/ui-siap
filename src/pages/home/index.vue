<script setup lang="ts">
import globalActions from "@/store/globalActions";
import router from "../../router";

import login from "../login/login";
</script>

<template>
  <v-btn
    @click="globalActions.toggleTheme()"
    variant="text"
    class="btnDark"
    color="gray"
    icon="mdi-theme-light-dark"
  ></v-btn>
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
              @click="router.push('/bairros')"
            >
              Bairros
            </v-btn>

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/descontoCliente')"
            >
              Desconto Cliente
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
              @click="router.push('/devolucaoFornecedor')"
              >Devolução Fornecedor
            </v-btn>
            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/vendaPorMarca')"
              >Venda Por Marca
            </v-btn>
            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/gerenciarFolhaPonto')"
              >Folha Ponto</v-btn
            >

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/compras')"
              >Compras
            </v-btn>

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/consultaMontagem')"
            >
              Consulta Montagem
            </v-btn>

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/vendaPorVendedor')"
              >Venda Por Vendedor</v-btn
            >

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/distribuirMetas')"
              >Distribuir Metas</v-btn
            >

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/gruposFuncionarios')"
              >Grupos Funcionarios</v-btn
            >

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/whatsapp')"
              >Whatsapp</v-btn
            >

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/whatsapp')"
              >Whatsapp Performance</v-btn
            >

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/notificacoes')"
              >Notificações</v-btn
            >

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/devolucaoDePecas')"
              >Devolução de Peças</v-btn
            >

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/vendaPerdida')"
              >Venda Perdida</v-btn
            >

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/historicoConsultaLojas')"
              >Histórico Consulta Lojas</v-btn
            >

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/vendaPorCategoria')"
              >Venda por Categoria
            </v-btn>

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/comissaoMarca')"
              >Comissão por marca
            </v-btn>

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/naturezaOperacao')"
              >Natureza Operação
            </v-btn>

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/sugestaoCompraAlteracao')"
              >Sugestão Compra/Alteração
            </v-btn>

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/filtro')"
              >Filtro
            </v-btn>

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/favorecidos')"
              >Favorecidos
            </v-btn>

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/faturarCliente')"
              >Faturar Cliente
            </v-btn>

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/regrasFaturamento')"
              >Regras de Faturamento
            </v-btn>

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/liberarCliente')"
              >Liberar Cliente
            </v-btn>

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/relatorioFaturamento')"
              >Relatorio Faturamento
            </v-btn>

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/relatorioConferenciaAlteracoes')"
              >Relatório Conferência e Alterações
            </v-btn>

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/requisicaoCompra')"
              >Requisição Compra</v-btn
            >

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/relatorioProdutosVendidos')"
              >Relatório Produtos Vendidos</v-btn
            >

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/relatorioCurvaAbc')"
              >Relatório Curva ABC
            </v-btn>

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/Bancos')"
              >Bancos
            </v-btn>

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/relatorioEntregarReceber')"
              >Relatório Entregar Receber</v-btn
            >

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/revisaoAvarias')"
              >Revisão de Avarias</v-btn
            >

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/avaliacaoEstoque')"
              >Avaliação Estoque</v-btn
            >

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/consultaCliente')"
              >Consulta Cliente</v-btn
            >

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/gerarXmlParaContabilidade')"
              >Gerar XML para Contabilidade
            </v-btn>

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/cliente')"
              >Cliente</v-btn
            >

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/abrirCaixa')"
            >
              Abrir Caixa
            </v-btn>

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/fornecedores')"
            >
              Fornecedores
            </v-btn>

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/gerirRamais')"
              >Gerir Ramais</v-btn
            >

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/usoConsumo')"
            >
              Uso Consumo
            </v-btn>

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/relatorioDeConhecimento')"
              >Relatorio de Conhecimento</v-btn
            >

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/relatorioAvarias')"
              >Relatório Avarias</v-btn
            >

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/sociedade')"
              >Sociedade</v-btn
            >

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/conhecimento')"
              >Conhecimento</v-btn
            >

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/baixaManualBoleto')"
              >Baixa de Boleto Manual</v-btn
            >

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/configBoleto')"
              >Config. Boleto</v-btn
            >

            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/consultaValeDinheiro')"
              >Consulta Vale Dinheiro</v-btn
            >
            
            <v-btn
              class="mr-4 mb-4"
              @click="router.push('/cfop')"
              >CFOP</v-btn
            >

            <v-btn
              class="mr-4 mb-4"
              @click="login.actions.confirmarSaida()"
              color="primary"
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
