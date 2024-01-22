<script setup lang="ts">

</script>

<template>
  <div class="container">
    <v-card >
      <v-list style="margin-top: -20px;">
        <div class="modal-head">
          <span>Ajuda</span>
          <button @click="console.log('fechei')" class="modal-button">X</button>
        </div>
        <v-list-item>
          <strong>BEMA-42</strong>: Bematech MP-4200 TH
        </v-list-item>
        <v-list-item>
          <strong>BEMA-28</strong>: Bematech MP-2800 TH | Epson TM T20
        </v-list-item>
        <v-list-item>
          <strong>DARUMA</strong>: Daruma
        </v-list-item>
      </v-list>
    </v-card>
  </div>
</template>

<style scoped>
div {
  padding-top: 10px;
}

.container {
  display: flex; 
  justify-content: center; 
  align-items: center;
}
.help {
  margin: 5px;
  border-radius: 4px;
  background-color: #3a9fb1; 
  color: #fff;
  height: -30px; 
  display: flex; 
  align-items: space; 
  justify-content: center;
}
.modal-head {

  display: flex;
  justify-content: space-between;

  margin: 3px;
  background: #3680ab;
  padding: 0.4em 1em;
  border: 1px solid #367fa9;
  color: #ffffff;
  font-weight: bold;
  border-radius: 4px;
  -webkit-user-select: none;
}

.modal-head button {
  right: 0.3em;
  top: 50%;
  width: 20px;
  margin: 0.4px 0 0 0;
  padding: 1px;
  padding-left: 2px;
  height: 20px;
  outline: 0;
}

.modal-button {
  margin-right: 0.3em;
  text-align: center;
  padding: 0;
  border-radius: 4px;
  padding: 0.4em 1em;
  border: 1px solid #367fa9;
  background: #3680ab !important; /**/
  color: #ffffff;
  font-weight: bold;
  margin-left: 3px;
}
</style>