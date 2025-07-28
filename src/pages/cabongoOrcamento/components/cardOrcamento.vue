<script setup lang="ts"></script>
<template>
  <div class="container bg-grey-lighten-3 d-flex justify-space-between align-center">
    <div class="d-flex flex-column ga-2">
      <div class="d-flex ga-5">
        <div>
          <input
            type="text"
            class="obr ss"
            name="DESCRICAO"
            maxlength="20"
          />
        </div>
        <div>
          <input
            type="number"
            class="obr ss"
            maxlength="5"
          />
        </div>
      </div>
      <label>RETROV 10/LE 4PTS C?C (VIVACE)</label>
      <div class="d-flex ga-5">
        <label>Carro: <span> UNO</span></label>
        <label>Marca: <span>RETROVEX</span></label>
      </div>
    </div>
    <div class="d-flex flex-column">
      <label>Endereço: <span> 516156561561651561</span></label>
      <label>Quantidade atual:<span> 64155665</span></label>
    </div>
  </div>
</template>
<style scoped>
.container {
  padding: 10px 20px;
  border-radius: 10px;
}
</style>
