<template>
  <v-container>
    <v-card
      class="pa-5"
      style="margin: 0 auto"
      width="1167px"
    >
      <div class="btns">
        <v-btn color="#3680AB"> Localizar devolução (F1) </v-btn>
        <v-btn color="#3680AB"> Nova devolução (F2) </v-btn>
      </div>

      <!-- componente dados do fornecedor /-->
      <div class="pt-5">
        <v-row>
          <v-col>
            <h2 class="pb-2 font-weight-regular">Dados do Fornecedor</h2>
            <div class="container"
              ><v-row>
                <v-col cols="3">
                  <label>CNPJ: </label>
                  <p>-</p>
                </v-col>
                <v-col>
                  <label>Fornecedor: </label>
                  <p>-</p>
                </v-col>
              </v-row>
            </div>
          </v-col>
          <v-col>
            <h2 class="pb-2 font-weight-regular">Notas vinculadas (0)</h2>
            <div class="container">
              <span>Nenhuma nota vinculada, necessário adicionar itens!</span>
            </div>
          </v-col>
        </v-row>
      </div>

      <!-- componente dados da transportadora -->
      <div class="pt-5">
        <h2 class="pb-2 font-weight-regular">Dados da Transportadora</h2>
        <div class="container">
          <v-row>
            <v-col cols="8">
              <label>Nome:</label>
              <p>-</p>
            </v-col>
            <v-col cols="2">
              <label>Frete por conta:</label>
              <p>-</p>
            </v-col>
            <v-col>
              <label>Valor:</label>
              <p>-</p>
            </v-col>
            <v-col>
              <button disabled>
                <v-icon
                  size="25px"
                  color="#2d9cdb"
                >
                  mdi-plus-circle-outline
                </v-icon>
              </button>
            </v-col>
          </v-row>
        </div>
      </div>

      <!-- componente dados da devolucao -->
      <div class="pt-5">
        <h2 class="pb-2 font-weight-regular">Dados da Devolução</h2>
        <div class="container">
          <v-row>
            <v-col cols="2">
              <label>N° Nota:</label>
              <p>-</p>
            </v-col>
            <v-col cols="6">
              <label>Chave:</label>
              <p>-</p>
            </v-col>
            <v-col cols="2">
              <label>Data:</label>
              <p>-</p>
            </v-col>
            <v-col>
              <label>Valor:</label>
              <p>-</p>
            </v-col>
          </v-row>
        </div>
      </div>

      <!-- componente itens -->
      <div
        class="pt-5"
        style="min-height: 210px"
      >
        <h2 class="pb-2 font-weight-regular">Itens</h2>
        <div class="cards">
          <v-card
            v-for="i in 6"
            :key="i"
            class="card"
          >
            <button>
              <v-icon size="25px"> mdi-plus-circle-outline </v-icon>
            </button>
            <p> NOVO ITEM (F3) </p>
          </v-card>
        </div>
      </div>

      <div class="btns pt-5">
        <div class="d-flex flex-wrap ga-2">
          <v-btn
            color="#3680AB"
            title="DELETAR DEVOLUÇÃO"
            ><v-icon size="24px">mdi-delete</v-icon>
          </v-btn>
          <v-btn color="#3680AB">
            <v-icon
              size="24px"
              class="mr-2"
              >mdi-printer</v-icon
            >Prévia</v-btn
          >
        </div>
        <v-btn color="#3680AB"> Finalizar (F4) </v-btn>
      </div>
    </v-card>
  </v-container>
</template>

<style scoped>
h2 {
  font-size: 16px;
}
.btns {
  display: flex;
  justify-content: space-between;
}

.container {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px;
  min-height: 68px;
  display: flex;
  align-items: center;
}

.container button {
  padding-top: 2px;
}

.container span {
  color: #2d9cdb;
  font-size: medium;
}

.card {
  width: 362px;
  height: 77px;
  border-radius: 8px;
  background-color: #d9d9d9;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #2d9cdb;
  margin-bottom: 4px;
}
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  overflow: auto;
  height: 184px;
}
</style>
