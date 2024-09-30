<script setup lang="ts">
import { onMounted, onUnmounted, reactive, watch } from "vue";
import { iCliente, iParamGetCliente } from "../interfaces";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import Swal from "sweetalert2";
import serviceLiberarCliente from "../services/liberarCliente.service";
import { useEventListener } from "@vueuse/core";

const stateClientes = reactive({
  loading: false,
  gridLiberarCliente: <ixGridCreate>{},
  clientes: <iCliente>{},
  search: null,
  edtClienteSearch: <HTMLInputElement>{},
});

const props = defineProps<{
  modalLiberarClienteOpened: boolean;
}>();

watch(
  () => props.modalLiberarClienteOpened,
  () => {
    if (props.modalLiberarClienteOpened) {
      stateClientes.gridLiberarCliente.queryOpen({
        CLIENTE: "",
      });
      stateClientes.search = null;
    }
  }
);

const emit = defineEmits(["cancelar", "clienteSelecionado"]);

function grids() {
  stateClientes.gridLiberarCliente = new xGridV2.create({
    el: "#gridLiberarCliente",
    height: 330,
    width: 680,
    count: true,
    columns: {
      CLIENTE: { dataField: "CLIENTE", width: "60%", compare: "colorir" },
      CNPJ: { dataField: "CNPJ", width: "20%", compare: "colorir" },
      FATURADO: { dataField: "TIPO COMPRA", center: true, compare: "faturado" },
    },
    query: {
      async execute(rs) {
        let data = await getClientes({
          offset: rs.offset,
          param: rs.param,
        });
        stateClientes.gridLiberarCliente.querySourceAdd(data);
      },
    },
    compare: {
      colorir: (r) => {
        if (r.BLOQUEADO == "1") {
          return '<span style="color: red">' + r.value + "<span>";
        } else {
          return r.value;
        }
      },
      faturado: (r) => {
        let textoFaturado = r.FATURADO == 1 ? "Faturado" : "Não Faturado";

        if (r.BLOQUEADO == "1") {
          // Retorna o texto com cor vermelha se estiver bloqueado
          return '<span style="color: red">' + textoFaturado + "</span>";
        } else {
          return textoFaturado;
        }
      },
    },
    sideBySide: {
      el: "#clienteCampos",
      vModel(r) {
        stateClientes.clientes = r;
      },
      frame: {
        el: "#btnGridLiberarCliente",
        buttons: {
          Cancel: {
            html: "Cancelar",
            state: "select",
            click: modalClienteClose,
          },
          Ok: {
            html: "Selecionar",
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

function selecionarCliente() {
  const cliente: iCliente = stateClientes.gridLiberarCliente.dataSource();

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
}

async function getClientes({ offset, param }: iParamGetCliente) {
  try {
    stateClientes.loading = true;
    const data = await serviceLiberarCliente.getClientes({ offset, param });
    stateClientes.loading = false;

    return data;
  } catch (error) {
    stateClientes.loading = false;
    Swal.fire({
      icon: "error",
      title: "Erro ao carregar os clientes!",
    });
  }
}

function searchClientes() {
  stateClientes.gridLiberarCliente.queryOpen({
    CLIENTE: stateClientes.edtClienteSearch.value.toUpperCase(),
  });
}

const eventListener = useEventListener(document, "keydown", async (event) => {
  if (event.key === "F1") {
    stateClientes.edtClienteSearch.select();
    event.preventDefault();
    event.stopPropagation();
  }
});

onMounted(() => {
  grids();
  stateClientes.edtClienteSearch = <any>document.getElementById("edtClienteSearch");
});

onUnmounted(() => {
  removeEventListener("keydown", eventListener);
});
</script>
<template>
  <v-container class="pa-1 pt-0">
    <div id="clienteCampos">
      <div class="d-flex justify-end my-4">
        <input
          type="text"
          v-model="stateClientes.search"
          style="margin: 5px 0 5px"
          autofocus
          placeholder="F1 - Localizar"
          @keydown.enter="searchClientes"
          @keyup.arrow-down="stateClientes.gridLiberarCliente.focus(0)"
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
      <div id="gridLiberarCliente"></div>
      <div
        id="btnGridLiberarCliente"
        class="mt-3"
        style="text-align: center"
      ></div>
    </div>
  </v-container>

  <v-overlay
    :model-value="stateClientes.loading"
    class="align-center justify-center"
    persistent
  >
    <v-progress-circular
      color="primary"
      indeterminate
      size="64"
    ></v-progress-circular>
  </v-overlay>
</template>
<style scoped>
#btnGridLiberarCliente {
  display: flex;
  justify-content: space-between;
}
</style>
