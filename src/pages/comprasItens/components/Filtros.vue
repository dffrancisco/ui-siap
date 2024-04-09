<script setup lang="ts"></script>

<template>
  <div class="filtros">
    <div class="filtros-fabricante">
      <label>Nº Fabricante</label>
      <v-text-field
        variant="outlined"
        density="compact"
        bg-color="#3b4758"
      ></v-text-field>
    </div>
    <div class="filtros-descricao">
      <label>Descrição</label>
      <v-text-field
        variant="outlined"
        density="compact"
        bg-color="#3b4758"
      ></v-text-field>
    </div>
    <div class="filtros-carro">
      <label>Carro</label>
      <v-select
        variant="outlined"
        density="compact"
        bg-color="#3b4758"
      ></v-select>
    </div>
    <div class="filtros-marca">
      <label>Marca</label>
      <v-select
        variant="outlined"
        density="compact"
        bg-color="#3b4758"
      ></v-select>
    </div>
    <div class="d-flex align-end">
      <v-btn
        color="#0077e4"
        height="40"
        width="50"
        min-width="50"
        class="pa-0"
      >
        <v-icon size="x-large">mdi mdi-printer</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.filtros {
  width: 100%;
  display: flex;
  color: var(--grey-100);
  gap: 8px;
}

.filtros-fabricante {
  width: 180px;
}

.filtros-descricao {
  flex-grow: 1;
}

.filtros-carro {
  width: 220px;
}

.filtros-marca {
  width: 220px;
}
</style>
