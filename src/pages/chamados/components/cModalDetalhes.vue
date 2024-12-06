<script setup lang="ts">
import { state } from "../chamados";
import { dataBrasil } from "@/ts/utils";
import { computed, ref } from "vue";
import serviceChamados from "../services/chamados.service";

const prioridadeMappings = {
  Lowest: { label: "Baixíssima", icon: "mdi-arrow-down-bold" },
  Low: { label: "Baixa", icon: "mdi-arrow-down" },
  Medium: { label: "Média", icon: "mdi-arrow-right" },
  High: { label: "Alta", icon: "mdi-arrow-up" },
  Highest: { label: "Altíssima", icon: "mdi-arrow-up-bold" },
};

const comentariosFiltrados = computed(() => {
  return state.detalhes.comentarios?.filter((comentario) => comentario.autor !== "Real Acessórios Dev");
});

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

function imgChamadoFormatado(img: string) {
  return `https://reallatas.com.br/chamados/${state.cnpj}/${img}`;
}

const novoComentario = ref("");
const anexo = ref<File | null>(null);

async function enviarComentario() {
  if (!novoComentario.value.trim() && !anexo.value) {
    alert("Por favor, envie um comentário ou anexe um arquivo.");
    return;
  }

  try {
    state.loading = true;

    if (novoComentario.value.trim()) {
      //console.log("Enviando comentário:", novoComentario.value);
      await serviceChamados.enviarComentario(novoComentario.value);
    } else if (anexo.value) {
      //console.log("Enviando anexo:", anexo.value.name);
      //await serviceChamados.enviarAnexo(anexo.value);
    }
  } catch (error) {
    console.error("Erro ao enviar:", error);
  } finally {
    state.loading = false;
    novoComentario.value = "";
    anexo.value = null;
  }
}
</script>

<template>
  <v-card
    max-height="auto"
    class="pa-2 modalDetalhes"
  >
    <div class="detalhes-container">
      <div class="detalhe">
        <label>Solicitante: </label>
        <label>{{ state.detalhes.solicitante }}</label>
      </div>

      <v-divider
        vertical
        class="divider"
      ></v-divider>

      <div class="detalhe">
        <label>Data: </label>
        <label>{{ state.detalhes.dataFormatada }}</label>
      </div>

      <v-divider
        vertical
        class="divider"
      ></v-divider>

      <div class="detalhe">
        <label>Prioridade:</label>
        <label>
          <v-icon :color="getPrioridadeIconColor(state.detalhes.prioridade)">
            {{ getPrioridadeIcon(state.detalhes.prioridade) }}
          </v-icon>
          {{ getTraducaoPrioridade(state.detalhes.prioridade) }}
        </label>
      </div>

      <v-divider
        vertical
        class="divider"
      ></v-divider>

      <div class="detalhe">
        <label>Status: </label>
        <label>
          {{ state.detalhes.statusJira }}
          <v-icon class="ml-2">{{ getStatusIcon(state.detalhes.statusJira) }}</v-icon>
        </label>
      </div>
    </div>

    <v-divider></v-divider>

    <v-row>
      <v-col cols="6">
        <div class="detalhe-descricao">
          <label class="pt-2">Descrição:</label>
          <label>{{ state.detalhes.descricao }}</label>

          <div class="pt-5">
            <label>Responsável:</label><br />
            <label>{{ state.detalhes.responsavel }}</label></div
          >
        </div></v-col
      >

      <v-col cols="6">
        <div v-if="state.imagensChamado">
          <label class="ml-2">Imagens do chamado:</label>

          <div class="mt-2 containerImg">
            <PhotoProvider
              v-for="img in state.imagensChamado"
              :default-backdrop-opacity="0.8"
            >
              <PhotoConsumer :src="imgChamadoFormatado(img)">
                <img
                  :src="imgChamadoFormatado(img)"
                  class="view-box img-miniatura"
                />
              </PhotoConsumer>
            </PhotoProvider>
          </div>
        </div>
      </v-col>
    </v-row>

    <v-divider></v-divider>

    <div
      class="comentarios"
      v-if="state.detalhes.comentarios"
    >
      <label class="ml-1">Comentários:</label>
      <div
        class="comentario"
        v-for="comentario in comentariosFiltrados"
        :key="comentario.criacao"
      >
        <div>
          <label>Autor: {{ comentario.autor }}</label>
        </div>
        <div>
          <label>Data: {{ dataBrasil(comentario.criacao) }}</label>
        </div>
        <div class="comentarios-comentario">
          <label>Comentário: {{ comentario.texto }}</label>
        </div>
      </div>

      <v-divider class="mt-4"></v-divider>
    </div>
    <!-- Novo comentário ou anexo -->
    <div class="novo-comentario mt-4">
      <v-textarea
        v-model="novoComentario"
        outlined
        label="Escreva seu comentário"
        rows="2"
        :disabled="!!anexo"
      ></v-textarea>

      <v-row>
        <v-col cols="9">
          <v-file-input
            v-model="anexo"
            label="Anexos"
            variant="outlined"
            accept=".pdf, .jpg, .jpeg"
            density="compact"
            :disabled="!!novoComentario.trim()"
            class="mt-2"
          ></v-file-input>
        </v-col>
        <v-col cols="3">
          <v-btn
            color="primary"
            class="mt-2"
            width="200px"
            @click="enviarComentario"
            >Enviar</v-btn
          >
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<style scoped>
.novo-comentario {
  display: flex;
  flex-direction: column;
}

.containerImg {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: start;
  max-height: 180px;
  overflow-y: auto;
  padding: 8px;
}

.img-miniatura {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  object-fit: cover;
  object-position: center;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.img-miniatura:hover {
  transform: scale(1.1);
}

.detalhes-responsavel {
  margin-left: 5px;
}

.detalhe-descricao {
  margin-right: 20px;
  display: flex;
  flex-direction: column;
}

.divider {
  margin-right: 20px;
}

.detalhes-container {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.comentarios {
  margin-top: 10px;
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

.detalhe {
  padding: 5px;
}

.modalDetalhes {
  font-size: 12px;
}
</style>
