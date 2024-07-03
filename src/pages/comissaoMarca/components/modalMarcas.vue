<script setup lang="ts">
import { nextTick, reactive, ref, watch } from "vue";
import { iMarcas } from "../interfaces";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";

const props = defineProps<{
  marcas: iMarcas[];
  modalOpened: boolean;
}>();

const emit = defineEmits(["marcaEscolhida", "closeModal"]);

watch(
  () => props.modalOpened,
  () => {
    if (props.modalOpened) {
      state.gridMarcas.source(props.marcas);
      inputRef.value?.focus();
    }
  }
);

const inputRef = ref<HTMLInputElement | null>(null);

const state = reactive({
  gridMarcas: <ixGridCreate>{},
  disabledSearch: false,
  edtSearch: "",
  selecionada: <iMarcas[]>[],
});

const actions = {
  criarGrid() {
    state.gridMarcas = new xGridV2.create({
      el: "#gridMarcas",
      width: 750,
      height: 390,
      count: false,
      columns: {
        Descrição: {
          dataField: "DESCRICAO",
          center: true,
        },
        "Grupo Marca": {
          dataField: "GRUPO",
          center: true,
        },
      },
      enter: function () {
        actions.selecionarMarca();
      },
      dblClick: function () {
        actions.selecionarMarca();
      },
    });
  },
  search() {
    const searchTerm = state.edtSearch.trim().toUpperCase();
    const filteredData = props.marcas.filter((marca) => marca.DESCRICAO.toUpperCase().includes(searchTerm));
    state.gridMarcas.source(filteredData);
    state.selecionada = filteredData;
    state.gridMarcas.focus();
  },
  selecionarMarca() {
    state.selecionada = state.gridMarcas.dataSource();

    let marcaEscolhida = state.selecionada;
    emit("marcaEscolhida", marcaEscolhida);
    emit("closeModal");
  },
  cancelar() {
    emit("closeModal");
  },
};

nextTick(() => {
  actions.criarGrid();
});
</script>
<template>
  <v-container>
    <div>
      <div class="d-flex justify-end my-2 pb-2">
        <input
          ref="inputRef"
          clearable="true"
          type="text"
          v-model="state.edtSearch"
          style="margin: 5px 0 5px"
          autofocus
          placeholder="Localizar"
          :disabled="state.disabledSearch"
          @keydown.enter="actions.search()"
          @keyup.arrow-down="state.gridMarcas.focus(0)"
          class="ss"
        />
        <v-btn
          :disabled="state.disabledSearch"
          size="small"
          class="ml-2 elevation-0"
          color="primary"
          icon="mdi-magnify"
          @click="actions.search()"
        >
        </v-btn>
      </div>
      <div id="gridMarcas"></div>

      <div class="btns d-flex justify-end pt-5">
        <v-btn
          style="color: #3680ab; border: 1px solid #3680ab"
          @click="actions.cancelar()"
          >Cancelar</v-btn
        >
        <v-btn
          class="ml-5"
          color="#3680AB"
          @click="actions.selecionarMarca()"
          >Selecionar</v-btn
        >
      </div>
    </div>
  </v-container>
</template>
