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
      :max-width="1000"
      class="ma-auto pa-4"
    >
      <div class="btns">
        <v-btn
          title="Pesquisar Clientes"
          id="btnGetClientes"
          color="primary"
          @click="state.modalClienteOpened = true"
          :disabled="!state.desativarInputs"
        >
          Pesquisar (F1)
          <v-icon class="ml-2">mdi-magnify</v-icon>
        </v-btn>
        <v-btn
          id="btnNovoCliente"
          color="primary"
          :disabled="!state.desativarInputs"
          @click="actions.novoCliente"
        >
          Novo (F2)
        </v-btn>
      </div>

      <v-row class="mt-2">
        <v-col cols="3">
          <template v-if="state.cnpjMode">
            <!-- CNPJ Mode -->
            <v-text-field
              v-model="state.cnpj_cpf"
              label="CNPJ - (F3) p/ CPF *"
              id="inputCNPJ"
              maxLength="18"
              v-mask="'##.###.###.####-##'"
              :clearable="false"
              :disabled="state.desativarInputs || state.idCliente != null"
              @blur="actions.verificarSeClienteExiste"
            ></v-text-field>
          </template>
          <template v-else>
            <!-- CPF Mode -->
            <v-text-field
              v-model="state.cnpj_cpf"
              label="CPF - (F3) p/ CNPJ *"
              maxLength="14"
              v-mask="'###.###.###-##'"
              :clearable="false"
              :disabled="state.desativarInputs || state.idCliente != null"
              @blur="actions.verificarSeClienteExiste"
            ></v-text-field>
          </template>
        </v-col>

        <v-col cols="5">
          <v-text-field
            v-model="state.razaoSocial"
            label="Razão Social / Nome *"
            id="inputRazaoSocial"
            maxLength="50"
            :clearable="false"
            :disabled="state.desativarInputs"
          ></v-text-field>
        </v-col>

        <v-col cols="4">
          <v-text-field
            v-model="state.apelido"
            label="Apelido Cliente"
            maxLength="25"
            :clearable="false"
            :disabled="state.desativarInputs"
          >
          </v-text-field>
        </v-col>
      </v-row>

      <v-row class="mt-2">
        <template v-if="!state.cnpjMode">
          <v-col cols="3">
            <v-select
              v-model="state.produtorRural"
              :items="[
                { text: 'Sim', value: 'S' },
                { text: 'Não', value: 'N' },
              ]"
              @update:model-value="actions.onChangeProdutorRural()"
              item-title="text"
              item-value="value"
              label="Produtor Rural"
              :clearable="false"
              :disabled="state.desativarInputs"
            ></v-select>
          </v-col>
        </template>

        <template v-if="state.cnpjMode || state.produtorRural == 'S'">
          <v-col cols="3">
            <v-text-field
              v-model="state.inscricaoEstadual"
              :label="state.contribuinteICMS == 'S' ? 'Inscrição Estadual *' : 'Inscrição Estadual'"
              maxLength="17"
              :clearable="false"
              :disabled="state.desativarInputs"
            ></v-text-field>
          </v-col>
        </template>

        <v-col cols="2.5">
          <v-text-field
            v-model="state.telefone"
            label="Telefone"
            maxLength="15"
            v-mask="'(##) ####-####'"
            :clearable="false"
            :disabled="state.desativarInputs"
          >
          </v-text-field>
        </v-col>
        <v-col cols="2.5"
          ><v-text-field
            v-model="state.telefoneAdicional"
            label="Telefone Adicional"
            maxLength="15"
            v-mask="'(##) ####-####'"
            :clearable="false"
            :disabled="state.desativarInputs"
          >
          </v-text-field
        ></v-col>

        <!-- Campos exclusivos de CNPJ -->
        <template v-if="state.cnpjMode">
          <v-col cols="2">
            <v-text-field
              v-model="state.contatoFinanceiro"
              label="Cont. Financeiro"
              maxLength="60"
              :clearable="false"
              :disabled="state.desativarInputs"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="state.contatoCompras"
              label="Cont. Compras"
              maxLength="60"
              :clearable="false"
              :disabled="state.desativarInputs"
            ></v-text-field>
          </v-col>
        </template>
      </v-row>

      <v-row class="mt-2">
        <v-col cols="4">
          <v-text-field
            v-model="state.email"
            label="E-mail"
            maxLength="200"
            :clearable="false"
            :disabled="state.desativarInputs"
          >
          </v-text-field
        ></v-col>
        <v-col cols="4">
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
            label="Enviar Boletos"
            :clearable="false"
            :disabled="state.desativarInputs"
          >
          </v-select>
        </v-col>
        <v-col cols="2">
          <v-select
            v-model="state.contribuinteICMS"
            :items="[
              { text: 'Sim', value: 'S' },
              { text: 'Não', value: 'N' },
            ]"
            item-title="text"
            item-value="value"
            label="Contribuinte ICMS"
            :clearable="false"
            :disabled="state.desativarInputs"
          >
          </v-select>
        </v-col>
      </v-row>

      <v-divider class="mt-5 mb-5"></v-divider>

      <v-row>
        <v-col cols="2">
          <v-text-field
            v-model="state.cep"
            label="CEP *"
            v-mask="'#####-###'"
            maxLength="9"
            :clearable="false"
            :disabled="state.desativarInputs"
            @blur="actions.preencherEndereco"
          >
          </v-text-field
        ></v-col>
        <v-col cols="2"
          ><v-select
            v-model="state.selectUF"
            :items="state.ufs"
            item-title="SIGLA"
            item-value="CODIGO"
            label="UF *"
            :clearable="false"
            :disabled="state.desativarInputs"
            >UF</v-select
          ></v-col
        >
        <v-col cols="4"
          ><v-select
            v-model="state.selectCidade"
            :items="state.cidades"
            item-title="DESCRICAO"
            item-value="COD_CIDADE"
            label="Cidade *"
            :clearable="false"
            :disabled="state.desativarInputs"
            @update:model-value="actions.atualizarTextoCidade"
          >
          </v-select>
        </v-col>
        <v-col cols="4">
          <v-select
            v-model="state.selectBairro"
            :items="state.bairros"
            item-title="DESCRICAO"
            item-value="ID_BAIRRO"
            label="Bairro *"
            :clearable="false"
            :disabled="state.desativarInputs"
            @update:model-value="actions.atualizarTextoBairro"
          >
          </v-select>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="6"
          ><v-text-field
            v-model="state.endereco"
            label="Endereço*"
            maxLength="40"
            :clearable="false"
            :disabled="state.desativarInputs"
        
          >
          </v-text-field
        ><small style="float: right;">{{ state.endereco?.length || 0 }} / 40</small> </v-col>
        <v-col
          cols="6"
          class="containerCnae"
        >
          <label class="labelCnae">Cnae</label>
          <div style="display: flex; align-items: center">
            <div class="atividadeCNAE">
              <v-chip-group>
                <v-chip
                  v-for="atividade in state.atividadeCNAE"
                  :key="atividade.ID_ATIVIDADE_EMPRESA"
                  @click="actions.visualizarCNAE(atividade)"
                  size="xsmall"
                >
                  {{ atividade.CNAE }}
                </v-chip>
              </v-chip-group>
            </div>
            <v-icon
              title="Buscar CNAE do cliente"
              :disabled="!state.idCliente || !state.desativarInputs"
              size="16px"
              class="ml-2"
              @click="actions.buscarCNAE"
            >
              mdi-refresh</v-icon
            >
          </div>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="6">
          <v-textarea
            v-model="state.obsAdministrativo"
            label="Obs. Administrativo"
            maxLength="300"
            :clearable="false"
            rows="2"
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
            rows="2"
            :disabled="state.desativarInputs"
          >
          </v-textarea>
        </v-col>
      </v-row>

      <div class="d-flex justify-space-between ga-2 mt-4">
        <div class="d-flex justify-start ga-2">
          <v-btn
            title="Editar"
            icon="mdi-pen"
            size="39"
            color="primary"
            :disabled="!state.idCliente || !state.desativarInputs"
            @click="actions.editarDadosCliente"
          />
          <v-btn
            class="ml-2"
            title="Excluir"
            icon="mdi-delete"
            size="39"
            color="primary"
            :disabled="!state.idCliente || !state.desativarInputs"
            @click="actions.deletarCliente"
          />
          <v-btn
            class="ml-2"
            size="39"
            color="primary"
            title="Copiar dados do cliente"
            :disabled="!state.cnpj_cpf || !state.desativarInputs"
            @click="actions.copiarDadosCliente"
            icon="mdi-content-copy"
          />
        </div>
        <div class="d-flex justify-end ga-2">
          <v-btn
            color="primary"
            variant="outlined"
            :disabled="state.desativarInputs"
            @click="actions.cancelar"
            >cancelar</v-btn
          >
          <v-btn
            color="primary"
            @click="actions.validarInsertOuUpdate"
            :disabled="state.desativarInputs"
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
      @selecionarCliente="actions.salvarClienteSelecionadoNaState"
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
  padding: 10px;
}

.containerCnae {
  position: relative;
}

.atividadeCNAE {
  display: flex;
  flex-direction: row;
  gap: 2px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  height: 40px;
  overflow-x: auto;
  position: relative;
  z-index: 5;
  width: 100%;
}

.labelCnae {
  position: absolute;
  top: 0px;
  left: 20px;
  background-color: #fff;
  z-index: 10;
}
</style>
