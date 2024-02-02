<script setup lang="ts">
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import { useEventListener } from "@vueuse/core";
import { onUnmounted, onMounted, nextTick, reactive } from "vue";
import Swal from "sweetalert2";
import { iCliente, iParamGetCliente } from "../interfaces";
import serviceBloquearCliente from "../services/bloquearCliente.service";

const state = reactive({
  gridCliente: <ixGridCreate>{},
  dbCliente: <iCliente>{},

  search: null,

  edtClienteSearch: <HTMLInputElement>{},

  loading: false,
});

const emit = defineEmits(["cancelar", "clienteSelecionado"]);

function grids() {
  state.gridCliente = new xGridV2.create({
    el: "#gridCliente",
    height: 175,
    count: true,
    columns: {
      CNPJ: { dataField: "CGC_CLIENTE", width: "25%" },
      Cliente: { dataField: "NOME", compare: "colorir" },
    },
    query: {
      async execute(rs) {
        let data = await getClientes({
          offset: rs.offset,
          param: rs.param,
        });
        state.gridCliente.querySourceAdd(data);
      },
    },
    compare: {
      colorir: (r) => {
        if (r.BLOQUEADO == 1) {
          return '<span style="color: red">' + r.value + "<span>";
        } else {
          return r.value;
        }
      },
    },
    sideBySide: {
      el: "#clienteCampos",
      vModel(r) {
        state.dbCliente = r;
      },
      frame: {
        el: "#btnClientes",
        buttons: {
          Cancel: {
            html: "Cancelar",
            state: "select",
            click: modalClienteClose,
          },
          Ok: {
            html: "OK",
            state: "select",
            click: selecionarCliente,
          },
        },
      },
    },
    enter: selecionarCliente,
    dblClick: selecionarCliente,
  });
}

function searchClientes() {
  state.gridCliente.queryOpen({
    NOME: state.edtClienteSearch.value.toUpperCase(),
  });
}

function selecionarCliente() {
  const cliente = state.gridCliente.dataSource();

  if (!cliente) {
    Swal.fire({
      icon: "warning",
      title: "Selecione um Cliente",
    });
    return;
  }

  emit("clienteSelecionado", cliente);
}

function modalClienteClose() {
  emit("cancelar");

  state.search = null;
}

async function getClientes({ offset, param }: iParamGetCliente) {
  try {
    state.loading = true;
    const data = await serviceBloquearCliente.getClientes({ offset, param });
    state.loading = false;

    return data;
  } catch (error) {
    state.loading = false;
    Swal.fire({
      icon: "error",
      title: "Erro ao carregar os clientes!",
    });
  }
}

onMounted(() => {
  nextTick(() => {
    grids();

    state.gridCliente.queryOpen({
      NOME: ""
    });

    state.edtClienteSearch = <any>document.getElementById("edtClienteSearch");
  });
});
</script>

<template>
  <v-container class="pa-1 pt-0">
    <title>Clientes</title>
    <div id="clienteCampos">
      <div class="d-flex justify-end my-4">
        <input
          type="text"
          v-model="state.search"
          style="margin: 5px 0 5px"
          autofocus
          placeholder="F1 - Localizar"
          @keydown.enter="searchClientes"
          @keyup.arrow-down="state.gridCliente.focus(0)"
          id="edtClienteSearch"
          class="ss"
        />
        <v-btn
          size="small"
          class="ml-2 mt-1 elevation-0"
          color="primary"
          @click="searchClientes"
        >
          Localizar
        </v-btn>
      </div>
      <div id="gridCliente"></div>
      <div
        id="btnClientes"
        class="mt-3"
        style="text-align: center"
      >
      </div>
    </div>
  </v-container>
</template>

<style scoped>
#btnClientes {
  display: flex;
  justify-content: space-between;
}
</style>
