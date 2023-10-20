<script setup lang="ts">
import { actions, state } from "./chamados";
</script>

<template>
  <v-container class="containerChamados">
    <title>Cadastro de Chamados</title>
    <v-card class="pa-5 cardChamado">
      <h1 class="tituloChamados">Abertura de Chamados - CPD</h1>
      <span class="subtitle"
        >Preencha o formulário com as informações solicitadas para abertura de
        um chamado:</span
      >

      <div id="pnCampos" class="pnCampos">
        <v-form>
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <span>Loja</span>
              <select v-model="state.loja" id="loja" class="obr ss" required>
                <option value="">Selecionar Loja</option>
                <option value="SHN LATAS">SHN LATAS</option>
                <option value="CAPA">CAPA</option>
                <option value="CASA DA LATA">CASA DA LATA</option>
                <option value="CENTRO LATAS">CENTRO LATAS</option>
                <option value="DF ACESSORIOS">DF ACESSORIOS</option>
                <option value="FEDERAL">FEDERAL</option>
                <option value="MULTIMARCAS">MULTIMARCAS</option>
                <option value="CENTRAL PECAS">CENTRAL PECAS</option>
                <option value="REAL ACESSORIOS (SOBRADINHO)">
                  REAL ACESSORIOS (SOBRADINHO)
                </option>
                <option value="LATAS LESTE">LATAS LESTE</option>
                <option value="REAL PARAISO">REAL PARAISO</option>
                <option value="REAL GOIANIA">REAL GOIANIA</option>
                <option value="REAL FORMOSA">REAL FORMOSA</option>
                <option value="AGUAS LINDAS">AGUAS LINDAS</option>
                <option value="H CENTRAL PECAS">H CENTRAL PECAS</option>
              </select>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <span>Assunto</span>
              <select
                v-model="state.assunto"
                id="assunto"
                class="obr ss"
                required
              >
                <option value="">Selecionar Assunto</option>
                <option value="MANUTENCAO">Manutenção</option>
                <option value="DESIGN MARKETING">Design / Marketing</option>
                <option value="ERRO NO SISTEMA">Erro no Sistema</option>
                <option value="OUTROS">Outros</option>
              </select>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <span>Solicitante</span>
              <input
                v-model="state.solicitante"
                id="solicitante"
                placeholder="SOLICITANTE"
                class="obr ss"
                label="SOLICITANTE"
                required
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="state.descricao"
                id="descricao"
                class="obr ss"
                label="DESCREVA COM DETALHES O MOTIVO DO CHAMADO"
                required
                @input="state.descricao = state.descricao.toUpperCase()"
              ></v-textarea>
            </v-col>
            <v-col cols="12">
              <v-file-input
                v-if="false"
                v-model="state.anexos"
                label="Anexos"
                multiple
              ></v-file-input>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" class="d-flex justify-end">
              <v-btn
                @click="actions.resetForm"
                color="primary"
                variant="outlined"
                >Cancelar</v-btn
              >
              <v-btn
                @click="actions.submitForm"
                class="btnEnviar"
                color="primary"
                >Salvar</v-btn
              >
              <v-btn
                @click="actions.getChamados"
                class="btnBuscarChamados"
                color="primary"
                >Buscar Chamados</v-btn
              >
            </v-col>
          </v-row>
        </v-form>
      </div>
    </v-card>
  </v-container>
</template>

<style scoped>
.btnEnviar {
  margin-right: 10px;
  margin-left: 10px;
}

.cardChamado {
  width: 700px;
  margin: 0 auto;
  margin-top: 30px;
}
.pnCampos {
  margin-top: 25px;
}

.tituloChamados {
  margin-top: 10px;
  text-align: center;
  align-items: center;
  display: flex;
}

.subtitle {
  font-size: 16px;
  text-align: center;
  align-items: center;
  display: flex;
}

.btnBuscarChamados {
  margin-left: 10px;
}

@media (max-width: 768px) {
  .cardChamado {
    width: 360px;
    margin: 0 auto;
    margin-top: 20px;
  }
}
</style>
