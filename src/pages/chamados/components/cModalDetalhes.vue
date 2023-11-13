<script setup lang="ts">
import { state } from "../chamados";
import { dataBrasil } from "@/ts/utils";

const prioridadeMappings = {
  Lowest: { label: "Baixíssima", icon: "mdi-arrow-down-bold" },
  Low: { label: "Baixa", icon: "mdi-arrow-down" },
  Medium: { label: "Média", icon: "mdi-arrow-right" },
  High: { label: "Alta", icon: "mdi-arrow-up" },
  Highest: { label: "Altíssima", icon: "mdi-arrow-up-bold" },
};

function getTraducaoPrioridade(prioridade: string) {
  return prioridadeMappings[prioridade]?.label || prioridade;
}

function getPrioridadeIcon(prioridade: string) {
  return prioridadeMappings[prioridade]?.icon || "";
}

function getPrioridadeIconColor(prioridade: string) {
  if (prioridade === "Medium") {
    return "yellow";
  } else if (prioridade === "Low" || prioridade === "Lowest") {
    return "blue";
  } else {
    return "red";
  }
}

function getStatusIcon(status: string) {
  if (status === "Tarefas pendentes") {
    return "mdi-clock-outline";
  } else if (status === "Concluído") {
    return "mdi-checkbox-marked-circle";
  } else if (status === "STAND BY") {
    return "mdi-pause-circle-outline";
  } else if (status === "Em andamento") {
    return "mdi-progress-clock";
  } else {
    return "mdi-information";
  }
}
</script>

<template>
  <div class="detalhes-chamado">
    <div class="detalhes-container">
      <div class="detalhe">
        <span>Solicitante: {{ state.detalhes.solicitante }}</span>
      </div>

      <v-divider vertical class="divider"></v-divider>

      <div class="detalhe">
        <span>Data: {{ state.detalhes.dataFormatada }}</span>
      </div>

      <v-divider vertical class="divider"></v-divider>

      <div class="detalhe">
        <span>Prioridade:</span>
        <v-icon :color="getPrioridadeIconColor(state.detalhes.prioridade)">
          {{ getPrioridadeIcon(state.detalhes.prioridade) }}
        </v-icon>
        {{ getTraducaoPrioridade(state.detalhes.prioridade) }}
      </div>

      <v-divider vertical class="divider"></v-divider>

      <div class="detalhe">
        <span>Status: {{ state.detalhes.statusJira }}</span>
        <v-icon>{{ getStatusIcon(state.detalhes.statusJira) }}</v-icon>
      </div>
    </div>
    <v-divider></v-divider>

    <div class="detalhes-responsavel">
      <div class="detalhe-descricao">
        <span><u>Descrição:</u> {{ state.detalhes.descricao }}</span>
      </div>

      <div class="detalhe">
        <span><u>Responsável:</u> {{ state.detalhes.responsavel }}</span>
      </div>
    </div>
    <v-divider></v-divider>

    <div class="comentarios">
      <span class="titleComents">Comentários:</span>
      <div
        class="comentario"
        v-for="comentario in state.detalhes.comentarios"
        :key="comentario.criacao"
      >
        <div>
          <span>Autor: {{ comentario.autor }}</span>
        </div>
        <div>
          <span>Data: {{ dataBrasil(comentario.criacao) }}</span>
        </div>
        <div class="comentarios-comentario">
          <span>Comentário: "{{ comentario.texto }}"</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detalhes-responsavel {
  margin-left: 5px;
}
.detalhe-descricao {
  margin-right: 20px;
  margin-bottom: 10px;
  margin-top: 20px;
}
.divider {
  margin-right: 20px;
}
.detalhes-container {
  display: flex;
  justify-content: space-between;
}
.detalhes-chamado {
  width: 90%;
  margin-top: 10px;
  margin-left: 20px;
  padding: 20px;
  border: 1px solid #878686;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.detalhe {
  margin-right: 20px;
  margin-bottom: 10px;
}

.comentarios {
  margin-top: 20px;
}

.comentario {
  border: 1px solid #878686;
  border-radius: 8px;
  padding: 10px;
  margin-top: 10px;
}

.comentarios-comentario {
  margin-top: 5px;
}

.titleComents {
  text-decoration-line: underline;
  margin-left: 5px;
}
</style>
