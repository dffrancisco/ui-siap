<script setup lang="ts">
import { actions, state } from "../chamados";
import { dataBrasil } from "@/ts/utils";
import { computed, reactive, ref } from "vue";
import serviceChamados from "../services/chamados.service";
import Swal from "sweetalert2";

const stateModal = reactive({
  anexo: [],
  novoComentario: "",
});

const prioridadeMappings = {
  Lowest: { label: "Baixíssima", icon: "mdi-arrow-down-bold" },
  Low: { label: "Baixa", icon: "mdi-arrow-down" },
  Medium: { label: "Média", icon: "mdi-arrow-right" },
  High: { label: "Alta", icon: "mdi-arrow-up" },
  Highest: { label: "Altíssima", icon: "mdi-arrow-up-bold" },
};

const comentariosFiltrados = computed(() => {
  return state.detalhes.comentarios
    .filter((comentario) => {
      return !comentario.texto.startsWith(" Anexos:");
    })
    .map((comentario) => {
      if (comentario.autor === "Real Acessórios Dev") {
        return { ...comentario, autor: state.loginUsuario };
      }
      return comentario;
    });
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

async function enviarComentario() {
  if (!stateModal.novoComentario.trim() && (!stateModal.anexo || stateModal.anexo.length === 0)) {
    alert("Por favor, envie um comentário ou anexe um arquivo.");
    return;
  }

  try {
    state.loading = true;

    const promises = [];

    // Envio do comentário
    if (stateModal.novoComentario.trim()) {
      const param = {
        chaveJira: state.keyJira,
        comentario: stateModal.novoComentario.trim(),
        autor: state.loginUsuario,
      };
      promises.push(serviceChamados.enviarComentario(param));
    }

    // Envio dos anexos
    if (stateModal.anexo && stateModal.anexo.length > 0) {
      const files = stateModal.anexo;

      const formData = new FormData();
      formData.append("call", "uploadImg");
      formData.append("cnpj", state.cnpj);
      formData.append("idChamado", state.keyJira);

      // Redimensionar imagens antes do envio
      const redimensionados = await Promise.all(
        files.map(async (file) => {
          if (file.type.startsWith("image/")) {
            return await actions.redimensionarImagem(file, 500);
          }
          return file;
        })
      );

      redimensionados.forEach((file, index) => {
        formData.append(`files[${index}]`, file);
      });

      // Adicionar ao array de promises
      promises.push(
        serviceChamados.uploadAnexos(formData).then((result) => {
          if (!result.success) {
            throw new Error(result.msg || "Falha no upload dos arquivos");
          }

          // Atualizar chamado após envio dos anexos
          const paramUpdate = {
            chaveJira: state.keyJira,
            filePaths: result.files,
          };
          return actions.updateChamado(paramUpdate);
        })
      );
    }

    // Aguarda todas as operações (comentário e/ou anexos)
    if (promises.length > 0) {
      await Promise.all(promises);

      Swal.fire({
        icon: "success",
        text: "Comentário e/ou anexos enviados com sucesso!",
      });
    } else {
      throw new Error("Nenhuma operação foi executada.");
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      text: "Erro ao enviar comentário ou anexos. Tente novamente.",
    });
  } finally {
    state.loading = false;
    stateModal.novoComentario = "";
    stateModal.anexo = [];
    state.pnModalDetalhes.close();
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
      <v-col cols="5">
        <div class="detalhe-descricao">
          <label class="pt-2">Descrição:</label>
          <label>{{ state.detalhes.descricao }}</label>

          <div class="pt-5">
            <label>Responsável:</label><br />
            <label>{{ state.detalhes.responsavel }}</label></div
          >
        </div></v-col
      >

      <v-col cols="7">
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
      <label class="ml-2">Comentários:</label>
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

    <div class="novo-comentario mt-4">
      <v-textarea
        v-model="stateModal.novoComentario"
        outlined
        label="Escreva seu comentário"
        rows="2"
      ></v-textarea>

      <v-row>
        <v-col cols="9">
          <v-file-input
            v-model="stateModal.anexo"
            label="Anexos"
            variant="outlined"
            accept=".pdf, .jpg, .jpeg"
            density="compact"
            class="mt-2"
          ></v-file-input>
        </v-col>
        <v-col cols="3">
          <v-btn
            color="primary"
            class="mt-2"
            width="200px"
            @click="enviarComentario"
            :disabled="!stateModal.novoComentario.trim() && stateModal.anexo.length == 0"
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
  max-height: 150px;
  overflow-y: auto;
  padding: 8px;
}

.img-miniatura {
  width: 90px;
  height: 90px;
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
  margin: 5px;
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
