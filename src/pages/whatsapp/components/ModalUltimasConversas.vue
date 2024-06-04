<script setup lang="ts">
import { computed } from "vue";
import { iDadosContatos } from "../interfaces";
import whatsappService from "../services/whatsapp.service";
import CardMsg from "./CardMsg.vue";
import moment from "moment";
import { msgConfirm } from "@/ts/message";
import Swal from "sweetalert2";

const props = defineProps({
  msgsCallbell: {
    type: Object as () => iDadosContatos,
    required: true,
    default: null,
  },
});

const emits = defineEmits(["closeModalUltimasConversas", "fecharConversa", "buscarConversaAntiga"]);

const actions = {
  closeModalUltimasConversas() {
    emits("closeModalUltimasConversas");
  },

  formatarTelefone(telefone: string) {
    if (telefone.length == 12) {
      const codigoPais = telefone.slice(0, 2);
      const codigoArea = telefone.slice(2, 4);
      const numero = telefone.slice(4);

      return `+${codigoPais} (${codigoArea}) ${numero.slice(0, 4)}-${numero.slice(4)}`;
    } else {
      return telefone;
    }
  },

  async fecharConversa(uuid_contato: string) {
    try {
      await whatsappService.fecharConversa(uuid_contato);
      emits("fecharConversa");
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Erro ao fechar conversa",
      });
    }
  },

  async btnFecharConversa(uuid_contato: string) {
    if (await msgConfirm("Confirmação", "Confirma fechar esta conversa?")) {
      await actions.fecharConversa(uuid_contato);
    }
  },

  buscarConversaAntiga() {
    let uuid_contato = props.msgsCallbell.uuid_contato;
    let page = props.msgsCallbell.meta.page + 1;

    emits("buscarConversaAntiga", uuid_contato, page);
  },
};

const computeds = {
  msgsAgrupadasPorData: computed(() => {
    const msgs = props.msgsCallbell.msgs;
    let ultimaData = null;
    let msgsOrdenadas = [];

    msgs.forEach((msg) => {
      let dataMsg = moment(msg.createdAt).format("DD/MM/YYYY");

      msgsOrdenadas.push({ msg, dataMsg });

      ultimaData = dataMsg;
    });

    return msgsOrdenadas;
  }),
};
</script>

<template>
  <v-card
    height="700"
    class="container-principal"
  >
    <div class="header px-2 pt-3 pb-2">
      <v-icon
        color="primary"
        size="32"
        @click="actions.closeModalUltimasConversas"
        >mdi-chevron-left</v-icon
      >
      <div class="container-contato">
        <strong>{{ props.msgsCallbell.nome }}</strong>
        <span class="container-contato__numero">{{ actions.formatarTelefone(props.msgsCallbell.telefone) }}</span>
      </div>

      <v-icon
        color="#D32F2F"
        size="32"
        title="Fechar conversa"
        @click="actions.btnFecharConversa(props.msgsCallbell.uuid_contato)"
      >
        > mdi-account-remove</v-icon
      >
    </div>

    <div class="container-chat pt-2">
      <div class="container-msgs px-2 ga-3">
        <template
          v-for="(item, index) in computeds.msgsAgrupadasPorData.value"
          :key="index"
        >
          <CardMsg :msgCallbell="item.msg" />
          <div
            v-if="
              index == computeds.msgsAgrupadasPorData.value.length - 1 ||
              (computeds.msgsAgrupadasPorData.value[index + 1] &&
                item.dataMsg != computeds.msgsAgrupadasPorData.value[index + 1].dataMsg)
            "
            class="chip-data"
          >
            <span class="chip-data__content px-2 py-1">{{ item.dataMsg }}</span>
          </div>
        </template>
        <div
          class="container-btn-msgs-antigas"
          v-if="props.msgsCallbell.meta.page != props.msgsCallbell.meta.pages"
        >
          <div
            class="btn-msgs-antigas px-4 py-2"
            @click="actions.buscarConversaAntiga"
            >VER MAIS CONVERSAS</div
          >
        </div>
      </div>
    </div>
  </v-card>
</template>

<style scoped>
.container-principal {
  background-color: #f2f2f2;
}

.chip-data {
  display: flex;
  justify-content: center;
  width: 100%;
}

.chip-data__content {
  background-color: #233142;
  color: #f2f2f2;
  border-radius: 8px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.container-contato {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.container-contato__numero {
  font-size: 10px;
  color: gray;
}

.container-chat {
  background-image: url("../assets/background_chat.png");
  background-size: cover;
  flex-grow: 1;
}

.container-msgs {
  display: flex;
  align-items: end;
  flex-direction: column-reverse;
  overflow: auto;
  max-height: 620px;
}

.container-btn-msgs-antigas {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  z-index: 1000;
}

.btn-msgs-antigas {
  background-color: #3c8dbc;
  border-radius: 4px;
  font-size: 14px;
  color: #ffffff;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.4);
}

.btn-msgs-antigas:hover {
  background-color: #4b92c2;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.4);
}
</style>
