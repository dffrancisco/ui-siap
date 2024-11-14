<script setup lang="ts">
import { state, actions } from "./cliente";
import ModalCliente from "./components/ModalCliente.vue";
import { onMounted } from "vue";

onMounted(async () => {
  actions.init();
});
</script>
<template>
  <v-container>
    <v-card
      :width="950"
      class="ma-auto pa-4"
    >
      <div class="btns">
        <v-btn
          title="Pesquisar Clientes"
          id="btnGetClientes"
          color="primary"
          @click="state.modalClienteOpened = true"
        >
          Pesquisar Cliente (F1)
          <v-icon class="ml-2">mdi-magnify</v-icon>
        </v-btn>
        <v-btn
          id="btnNovoCliente"
          color="primary"
          @click="actions.novoCliente"
        >
          Novo Cliente (F2)
        </v-btn>
      </div>

      <v-row class="mt-2">
        <v-col cols="3"
          ><v-text-field
            v-model="state.cnpj_cpf"
            label="CNPJ / CPF"
            id="inputCNPJ_CPF"
            maxLength="20"
            :clearable="false"
            :disabled="state.desativarInputs"
          >
          </v-text-field
        ></v-col>
        <v-col cols="6">
          <v-text-field
            v-model="state.razaoSocial"
            label="Razão Social / Nome"
            maxLength="50"
            :clearable="false"
            :disabled="state.desativarInputs"
          >
          </v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="state.inscricaoEstadual"
            label="Inscrição Estadual / Identidade"
            maxLength="17"
            :clearable="false"
            :disabled="state.desativarInputs"
          >
          </v-text-field>
        </v-col>
      </v-row>

      <v-row class="mt-2">
        <v-col cols="2">
          <v-text-field
            v-model="state.apelido"
            label="Apelido Cliente"
            maxLength="25"
            :clearable="false"
            :disabled="state.desativarInputs"
          >
          </v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="state.telefone"
            label="Telefone"
            maxLength="15"
            :clearable="false"
            :disabled="state.desativarInputs"
          >
          </v-text-field>
        </v-col>
        <v-col cols="3"
          ><v-text-field
            v-model="state.telefoneAdicional"
            label="Telefone Adicional"
            maxLength="15"
            :clearable="false"
            :disabled="state.desativarInputs"
          >
          </v-text-field
        ></v-col>
        <v-col cols="2"
          ><v-text-field
            v-model="state.contatoFinanceiro"
            label="Contato Financeiro"
            maxLength="60"
            :clearable="false"
            :disabled="state.desativarInputs"
          >
          </v-text-field
        ></v-col>
        <v-col cols="2">
          <v-text-field
            v-model="state.contatoCompras"
            label="Contato Compras"
            maxLength="60"
            :clearable="false"
            :disabled="state.desativarInputs"
          >
          </v-text-field>
        </v-col>
      </v-row>

      <v-row class="mt-2">
        <v-col cols="5">
          <v-text-field
            v-model="state.email"
            label="E-mail"
            maxLength="200"
            :clearable="false"
            :disabled="state.desativarInputs"
          >
          </v-text-field
        ></v-col>
        <v-col cols="5">
          <v-text-field
            v-model="state.emailParaBoletos"
            label="Email p/ Boletos"
            maxLength="200"
            :clearable="false"
            :disabled="state.desativarInputs"
          >
          </v-text-field>
        </v-col>
        <v-col cols="2">
          <v-select
            v-model="state.boletoEmail"
            :items="[
              { text: 'Sim', value: 1 },
              { text: 'Não', value: 0 },
            ]"
            item-title="text"
            item-value="value"
            label="Ativar Envio"
            :clearable="false"
            :disabled="state.desativarInputs"
          >
          </v-select>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="3">
          <v-text-field
            v-model="state.cep"
            label="CEP"
            maxLength="10"
            :clearable="false"
            :disabled="state.desativarInputs"
          >
          </v-text-field
        ></v-col>
        <v-col cols="9"
          ><v-text-field
            v-model="state.endereco"
            label="Endereço"
            maxLength="40"
            :clearable="false"
            :disabled="state.desativarInputs"
          >
          </v-text-field
        ></v-col>
      </v-row>

      <v-row>
        <v-col cols="5"
          ><v-select
            v-model="state.selectBairro"
            :items="state.bairros"
            item-title="DESCRICAO"
            item-value="ID_BAIRRO"
            label="Bairro"
            :clearable="false"
            :disabled="state.desativarInputs"
          >
          </v-select
        ></v-col>
        <v-col cols="4"
          ><v-select
            v-model="state.selectCidade"
            :items="state.cidades"
            item-title="DESCRICAO"
            item-value="COD_CIDADE"
            label="Cidade"
            :clearable="false"
            :disabled="state.desativarInputs"
          >
          </v-select>
        </v-col>
        <v-col cols="2"
          ><v-select
            v-model="state.selectUF"
            :items="state.ufs"
            item-title="SIGLA"
            item-value="CODIGO"
            label="UF"
            :clearable="false"
            :disabled="state.desativarInputs"
            >UF</v-select
          ></v-col
        >
        <v-col cols="1"
          ><v-icon
            style="padding: 20px"
            title="Copiar dados do cliente"
            :disabled="state.desativarInputs"
            >mdi-content-copy</v-icon
          ></v-col
        >
      </v-row>

      <v-row>
        <v-col cols="6">
          <v-textarea
            v-model="state.obsAdministrativo"
            label="Obs. Administrativo"
            maxLength="300"
            :clearable="false"
            rows="1"
            :disabled="state.desativarInputs"
          >
          </v-textarea>
        </v-col>
        <v-col cols="6">
          <v-textarea
            v-model="state.obsVendas"
            label="Obs. Vendas"
            maxLength="250"
            :clearable="false"
            rows="1"
            :disabled="state.desativarInputs"
          >
          </v-textarea>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <div
            class="atividadeCNAE"
            v-if="state.atividadeCNAE[0]?.DESC_ATIVIDADE"
          >
            <label class="ml-2">Atividade CNAE</label>
            <v-chip-group>
              <v-chip
                v-for="atividade in state.clienteSelecionado.ATIVIDADE_CNAE"
                :key="atividade.ID_ATIVIDADE_EMPRESA"
                @click="actions.visualizarCNAE(atividade)"
              >
                {{ atividade.CNAE }}
              </v-chip>
            </v-chip-group>
          </div>
        </v-col>
      </v-row>

      <div class="d-flex justify-space-between ga-2 mt-4">
        <div class="d-flex justify-start ga-2">
          <v-btn
            title="Editar"
            icon="mdi-pen"
            size="39"
            color="primary"
            :disabled="state.desativarBtns"
            @click="actions.editarDadosCliente"
          />
          <v-btn
            class="ml-2"
            title="Excluir"
            icon="mdi-delete"
            size="39"
            :disabled="state.desativarBtns"
            color="primary"
          />
        </div>
        <div class="d-flex justify-end ga-2">
          <v-btn
            color="primary"
            variant="outlined"
            :disabled="state.desativarBtns"
            @click="actions.cancelar"
            >cancelar</v-btn
          >
          <v-btn
            color="primary"
            :disabled="state.desativarBtns"
            @click="actions.insertNovoCliente"
            >salvar</v-btn
          >
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

.atividadeCNAE {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  max-height: 200px;
  overflow-y: auto;
  overflow-x: auto;
}
</style>
