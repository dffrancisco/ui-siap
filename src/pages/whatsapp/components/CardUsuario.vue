<script setup lang="ts">
import { iConversaAberta } from "../interfaces";

const props = defineProps({
  nome: {
    type: String,
    required: true,
  },
  conversas: {
    type: Array as () => iConversaAberta[],
    required: true,
  },
});

const actions = {
  formatarDataHora: (data_hora: string) => {
    if (!data_hora) return "";

    let dia = data_hora.substring(8, 10);
    let mes = data_hora.substring(5, 7);
    let hora = data_hora.substring(11, 13);
    let minutos = data_hora.substring(14, 16);

    return `${dia}/${mes} ${hora}:${minutos}`;
  },
};
</script>

<template>
  <div class="card-usuario">
    <div
      class="card-usuario__titulo"
      :class="{ 'card-usuario__titulo--red': conversas.length > 20 }"
    >
      <strong :class="{ 'text-error': conversas.length > 20 }">{{ nome }}</strong>
    </div>
    <div class="card-usuario__corpo">
      <div
        v-if="conversas.length == 0"
        class="card-usuario__corpo--vazio"
      >
        <span>Nenhuma conversa em aberto</span>
      </div>
      <div
        v-for="conversa in conversas"
        class="card-usuario__conversa"
      >
        <div class="d-flex">
          <div class="card-usuario__conversa__nome">
            <v-icon
              size="x-small"
              class="mr-1"
              >mdi-account</v-icon
            >
            <span>{{ conversa.nome }}</span>
          </div>
          <div class="card-usuario__conversa__data-hora">
            <span>{{ actions.formatarDataHora(conversa.data_hora_aberto) }}</span>
          </div>
        </div>
        <div>
          <span class="card-usuario__conversa__telefone">{{ conversa.telefone }}</span>
        </div>
      </div>
    </div>
    <div
      class="card-usuario__rodape"
      :class="{ 'card-usuario__rodape--red': conversas.length > 20 }"
    >
      <span
        >Total conversa abertas: <strong>{{ conversas.length }}</strong></span
      >
    </div>
  </div>
</template>

<style scoped lang="scss">
.card-usuario {
  width: 246px;
  border: 1px solid rgba(82, 101, 140, 0.15);
  border-radius: 4px;
}

.card-usuario__titulo {
  min-height: 40px;
  display: flex;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid rgba(82, 101, 140, 0.15);
  background-color: rgb(249, 251, 255);
  text-transform: capitalize;
}

.card-usuario__titulo--red {
  background-color: #f7bbbb;
  border: 1px solid #f7bbbb;
}

.card-usuario__corpo {
  height: 100px;
  overflow-y: auto;
}

.card-usuario__corpo--vazio {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-usuario__conversa {
  display: flex;
  padding: 4px;
  border-bottom: 1px solid rgba(82, 101, 140, 0.15);
  flex-direction: column;
  widows: 100%;
}

.card-usuario__conversa__nome {
  flex-grow: 1;
}

.card-usuario__conversa__data-hora {
  font-size: 10px;
}

.card-usuario__conversa__telefone {
  font-size: 10px;
}

.card-usuario__rodape {
  min-height: 40px;
  display: flex;
  align-items: center;
  padding: 8px;
  border-top: 1px solid rgba(82, 101, 140, 0.15);
  background-color: rgb(249, 251, 255);
}

.card-usuario__rodape--red {
  background-color: #f7bbbb;
  border: 1px solid #f7bbbb;

  strong {
    color: red;
  }
}
</style>
