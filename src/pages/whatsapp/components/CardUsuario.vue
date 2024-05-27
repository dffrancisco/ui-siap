<script setup lang="ts">
import { computed } from "vue";
import { iConversaAberta } from "../interfaces";
import moment from "moment";

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

  showIconAlert(conversa: iConversaAberta) {
    let dataHoraAgora = moment();
    let dataHoraInicioConversa = moment(conversa.data_hora_aberto);
    let diffHoras = dataHoraAgora.diff(dataHoraInicioConversa, "minutes");

    return diffHoras > 30 && conversa.data_hora_humano == null && conversa.assigned_user ? true : false;
  },

  countDiasConversa(conversa: iConversaAberta) {
    let dataHoraAgora = moment();
    let dataHoraInicioConversa = moment(conversa.data_hora_aberto);
    let diffDias = dataHoraAgora.diff(dataHoraInicioConversa, "days");

    return diffDias;
  },
};

const computeds = {
  countErrors: computed(() => {
    let errorCount = 0;
    for (let conversa of props.conversas) {
      if (actions.showIconAlert(conversa)) {
        errorCount++;
      }
    }
    return errorCount;
  }),
};
</script>

<template>
  <div class="card-usuario">
    <div
      class="card-usuario__titulo"
      :class="{ 'card-usuario__titulo--red': conversas.length > 20 }"
    >
      <strong :class="{ 'text-error': conversas.length > 20 }">{{ nome }}</strong>
      <div
        v-if="computeds.countErrors.value > 0"
        class="chip-qtd-errors"
      >
        <span class="chip-qtd-errors__count">{{ computeds.countErrors.value }}</span>
      </div>
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
        <div class="d-flex justify-space-between">
          <span class="card-usuario__conversa__telefone">{{ conversa.telefone }}</span>
          <div class="d-flex ga-1">
            <div
              class="chip-qtd-dias"
              v-if="actions.countDiasConversa(conversa) > 0"
              :title="'Conversa aberta há ' + actions.countDiasConversa(conversa) + ' dias.'"
            >
              <strong class="chip-qtd-dias__count">{{ actions.countDiasConversa(conversa) }}d</strong>
            </div>
            <v-icon
              v-if="actions.showIconAlert(conversa)"
              color="#D32F2F"
              title="Operador não começou o atendimento"
              >mdi-alert-circle</v-icon
            >
          </div>
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
  justify-content: space-between;
  gap: 4px;
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

.chip-qtd-errors {
  border: 1px solid #ff0000;
  border-radius: 10px;
  padding: 2px 6px;
  background-color: #fde7e7;
}

.chip-qtd-errors__count {
  color: #ff0000;
}

.chip-qtd-dias {
  border: 1px solid #ff0000;
  border-radius: 10px;
  padding: 0px 3px;
}

.chip-qtd-dias__count {
  color: #ff0000;
  font-size: 10px;
}
</style>
