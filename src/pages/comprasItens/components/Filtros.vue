<script setup lang="ts">
import { reactive, watch } from "vue";
import { iCarro, iMarca } from "../interfaces";

const props = defineProps({
  idMarcaInicial: {
    type: Number,
    default: undefined,
  },
  carros: {
    type: Array as () => iCarro[],
    required: true,
  },
  marcas: {
    type: Array as () => iMarca[],
    required: true,
  },
});

const emit = defineEmits(["buscarProdutos", "abrirModalImpressao", "focarNosItensNaoAdicionados", "ordenar"]);

const state = reactive({
  edtNumFabricante: undefined,
  edtDescricao: undefined,
  edtCarro: undefined,
  edtMarca: undefined,
  tempoNovaBusca: 1000,
  modalImpressaoOpened: false,
});

const actions = {
  onClickLabel: (label: "num_fabricante" | "descricao") => {
    emit("ordenar", label);
  },
  onMarcaUpdate: () => {
    if (state.edtMarca) {
      actions.callEmitBuscarProdutos();
    }
  },
  callEmitBuscarProdutos: () => {
    clearInterval(stopTime);

    emit("buscarProdutos", {
      ID_MARCA: state.edtMarca,
      ID_CARRO: state.edtCarro,
      DESC_PRODUTO: state.edtDescricao,
      NUM_FABRICANTE: state.edtNumFabricante,
    });
  },

  onKeydownContainerFiltro(e: KeyboardEvent): void {
    if (e.key == "F1") {
      let elemento = document.getElementById("edtNumFabricante");
      elemento.click();
      e.preventDefault();
      return;
    }

    if (e.key == "F2") {
      let elemento = document.getElementById("edtDescricao");
      elemento.click();
      e.preventDefault();
      return;
    }

    if (e.key == "F3") {
      let elemento = document.getElementById("edtCarro");
      elemento.click();
      e.preventDefault();
      return;
    }

    if (e.key == "F6") {
      let elemento = document.getElementById("edtMarca");
      elemento.click();
      e.preventDefault();
      return;
    }

    if (e.key == "F8") {
      emit("focarNosItensNaoAdicionados");
    }

    if (e.altKey && (e.key == "I" || e.key == "i")) {
      emit("focarNosItensNaoAdicionados");
    }

    if (e.altKey && (e.key == "P" || e.key == "p")) {
      emit("abrirModalImpressao");
      e.preventDefault();
    }
  },
};

watch(
  () => props.idMarcaInicial,
  () => {
    if (props.idMarcaInicial) {
      state.edtMarca = props.idMarcaInicial;
    }
  }
);

let stopTime;

watch(
  () => [state.edtNumFabricante, state.edtDescricao],
  ([newNumFabricante, newDescricao], [oldNumFabricante, oldDescricao]) => {
    clearInterval(stopTime);

    stopTime = setInterval(() => {
      state.tempoNovaBusca = state.tempoNovaBusca - 100;

      if (state.tempoNovaBusca == 0) {
        state.tempoNovaBusca = 1000;

        if (newNumFabricante != oldNumFabricante) {
          actions.callEmitBuscarProdutos();
          return;
        }

        if (newDescricao != oldDescricao) {
          actions.callEmitBuscarProdutos();
        }
      }
    }, 100);
  }
);
</script>

<template>
  <div
    class="filtros"
    tabindex="0"
    @keydown="actions.onKeydownContainerFiltro"
  >
    <div class="filtros-fabricante">
      <label @click="actions.onClickLabel('num_fabricante')">Nº Fabricante (F1)</label>
      <v-text-field
        id="edtNumFabricante"
        v-model="state.edtNumFabricante"
        variant="outlined"
        density="compact"
        bg-color="#3b4758"
        @keypress.enter="actions.callEmitBuscarProdutos"
      ></v-text-field>
    </div>
    <div class="filtros-descricao">
      <label @click="actions.onClickLabel('descricao')">Descrição (F2)</label>
      <v-text-field
        id="edtDescricao"
        v-model="state.edtDescricao"
        variant="outlined"
        density="compact"
        bg-color="#3b4758"
        @keypress.enter="actions.callEmitBuscarProdutos"
      ></v-text-field>
    </div>
    <div class="filtros-carro">
      <label>Carro (F3)</label>
      <v-autocomplete
        id="edtCarro"
        v-model="state.edtCarro"
        variant="outlined"
        density="compact"
        bg-color="#3b4758"
        :items="props.carros"
        item-value="ID_CARRO"
        item-title="NOME_CARRO"
        @update:model-value="actions.callEmitBuscarProdutos"
      ></v-autocomplete>
    </div>
    <div class="filtros-marca">
      <label>Marca (F6)</label>
      <v-autocomplete
        id="edtMarca"
        v-model="state.edtMarca"
        variant="outlined"
        density="compact"
        bg-color="#3b4758"
        :items="props.marcas"
        item-value="ID_MARCA"
        item-title="NOME_MARCA"
        :clearable="false"
        @update:model-value="actions.onMarcaUpdate"
      ></v-autocomplete>
    </div>
    <div class="d-flex align-end">
      <v-btn
        color="#0077e4"
        height="40"
        width="50"
        min-width="50"
        class="pa-0"
        title="Imprimir (Alt+P)"
        @click="emit('abrirModalImpressao')"
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
