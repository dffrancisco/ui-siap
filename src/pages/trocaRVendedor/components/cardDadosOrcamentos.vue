<script setup lang="ts">

</script>

<template>
        <v-card class="card " max-width="450" border flat >
        <v-col><v-text class="titulo"> Dados do Orçamento</v-text></v-col>
        <div class="textos d-flex" > 
        <v-col>
           <v-col><v-text> N° Orçamento:</v-text></v-col>
           <v-col><v-text> Valor Orçamento:</v-text></v-col>
           
          </v-col>
            <v-col>
            <v-col><v-text> Data:</v-text></v-col>
            </v-col>
            </div>
        </v-card>
 
</template>

<style scoped>
.card{
  border: 1px solid #BDBDBD;  
}
.titulo{
  font-weight: bold;
  font-size: 15px;
}
.textos{
  font-size: 13px;
}
</style>
