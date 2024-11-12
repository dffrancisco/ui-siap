<script setup lang="ts">
import { state, actions } from "./cliente";
import ModalCliente from "./components/ModalCliente.vue";
</script>
<template>
  <v-container>
    <v-card
      :width="900"
      class="ma-auto pa-4"
    >
      <div class="btns">
        <v-btn
          title="Pesquisar Clientes"
          id="btnLocalizarDevolucao"
          color="primary"
          @click="state.modalClienteOpened = true"
        >
          Pesquisar Cliente (F1)
          <v-icon class="ml-2">mdi-magnify</v-icon>
        </v-btn>
        <v-btn
          id="btnSelecionarFornecedor"
          color="primary"
        >
          Novo Cliente (F2)
        </v-btn>
      </div>

      <v-row class="mt-2">
        <v-col cols="4"
          ><v-text-field
            label="CNPJ / CPF"
            :clearable="false"
          >
          </v-text-field
        ></v-col>
        <v-col cols="4">
          <v-text-field
            label="Razão Social"
            :clearable="false"
          >
          </v-text-field>
        </v-col>
        <v-col cols="4">
          <v-text-field
            label="Inscrição Estadual"
            :clearable="false"
          >
          </v-text-field>
        </v-col>
      </v-row>

      <v-row class="mt-2">
        <v-col cols="4">
          <v-text-field
            label="Telefone"
            :clearable="false"
          >
          </v-text-field>
        </v-col>
        <v-col cols="4"
          ><v-text-field
            label="Telefone Adicional"
            :clearable="false"
          >
          </v-text-field
        ></v-col>
        <v-col cols="4">
          <v-text-field
            label="E-mail"
            :clearable="false"
          >
          </v-text-field>
        </v-col>
      </v-row>

      <v-row class="mt-2">
        <v-col cols="3">
          <v-text-field
            label="Email p/ Boletos"
            :clearable="false"
          >
          </v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
            label="Ativar Envio"
            :clearable="false"
          >
          </v-text-field>
        </v-col>
        <v-col cols="3"
          ><v-text-field
            label="Contato Financeiro"
            :clearable="false"
          >
          </v-text-field
        ></v-col>
        <v-col cols="3">
          <v-text-field
            label="Contato Compras"
            :clearable="false"
          >
          </v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="6">
          <v-textarea
            label="Obs. Administrativo"
            :clearable="false"
            rows="2"
          >
          </v-textarea>
        </v-col>
        <v-col cols="6">
          <v-textarea
            label="Obs. Vendas"
            :clearable="false"
            rows="2"
          >
          </v-textarea>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="3">
          <v-text-field
            label="CEP"
            :clearable="false"
          >
          </v-text-field
        ></v-col>
        <v-col cols="3"
          ><v-text-field
            label="Endereço"
            :clearable="false"
          >
          </v-text-field
        ></v-col>
        <v-col cols="2"
          ><v-text-field
            label="Bairro"
            :clearable="false"
          >
          </v-text-field
        ></v-col>
        <v-col cols="2"
          ><v-text-field
            label="Cidade"
            :clearable="false"
          >
          </v-text-field>
        </v-col>
        <v-col cols="2"><v-select label="UF">UF</v-select></v-col>
      </v-row>

      <v-row>
        <v-col
          cols="11"
          class="cardCnae"
        >
          <v-textarea
            label="Atividade CNAE"
            :clearable="false"
            rows="1"
          >
          </v-textarea
        ></v-col>
        <v-col cols="1"
          ><v-icon
            style="padding: 20px"
            title="Copiar dados do cliente"
            >mdi-content-copy</v-icon
          ></v-col
        >
      </v-row>

      <div class="d-flex justify-space-between ga-2 mt-6">
        <div class="d-flex justify-start ga-2">
          <v-btn
            title="Editar"
            icon="mdi-pen"
            size="39"
            color="primary"
          />
          <v-btn
            class="ml-2"
            title="Excluir"
            icon="mdi-delete"
            size="39"
            color="primary"
          />
        </div>
        <div class="d-flex justify-end ga-2">
          <v-btn
            color="primary"
            variant="outlined"
            >cancelar</v-btn
          >
          <v-btn color="primary">salvar</v-btn>
        </div>
      </div>
    </v-card>

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
    <div id="pnCodigoTela">cliente</div>
  </v-container>

  <!-- modalCliente -->
  <v-dialog
    v-model="state.modalClienteOpened"
    max-width="900"
  >
    <ModalCliente
      @selecionarCliente="actions.selecionarCliente"
      @closeModalCliente="state.modalClienteOpened = false"
    />
  </v-dialog>
</template>
<style scoped>
.btns {
  display: flex;
  justify-content: space-between;
}

.v-col {
  padding: 8px;
}
</style>
