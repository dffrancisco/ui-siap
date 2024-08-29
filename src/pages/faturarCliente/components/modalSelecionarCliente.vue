<script setup lang="ts">
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import { onMounted, reactive, Ref, ref } from "vue";

const emits = defineEmits(["closeModal"]);

const state = reactive({
  gridCliente: <ixGridCreate>{},
});

const actions = {
  async init() {
    actions.criarGrid();
  },

  criarGrid() {
    state.gridCliente = new xGridV2.create({
      el: "#gridCliente",
      count: true,
      columns: {
        "Razão Social": {},
        CNPJ: { width: "30%" },
      },
    });
  },

  closeModal() {
    emits("closeModal");
  },
};

const inputSearch = ref("inputSearch") as Ref;

onMounted(async () => {
  await actions.init();

  const inputSearchElement = inputSearch.value as HTMLInputElement;
  inputSearchElement.focus();
});
</script>

<template>
  <v-card class="pa-4 d-flex flex-grow-1">
    <div class="d-flex ga-4">
      <v-text-field
        type="text"
        placeholder="Razão social / CNPJ"
        density="compact"
        ref="inputSearch"
      />
      <div class="d-flex align-center">
        <v-btn
          icon="mdi-magnify"
          size="34"
          color="primary"
        />
      </div>
    </div>

    <div
      class="mt-4"
      id="gridCliente"
    ></div>

    <div class="d-flex justify-end ga-4 mt-4">
      <v-btn
        color="primary"
        variant="outlined"
        @click="actions.closeModal"
        >cancelar</v-btn
      >
      <v-btn color="primary">selecionar</v-btn>
    </div>
  </v-card>
</template>
