<script setup lang="ts">
import { actions, state } from "../chamados";
import { dataBrasil } from "@/ts/utils";
import { computed, onMounted, reactive } from "vue";
import serviceChamados from "../services/chamados.service";
import Swal from "sweetalert2";

const stateModal = reactive({
  anexo: [],
  novoComentario: "",
  previews: [] as string[],
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
    limparAnexos();
  }
}

function removerAnexo(img: string) {
  Swal.fire({
    title: "Confirmação",
    text: "Deseja remover este anexo permanentemente?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sim, remover",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      let param = {
        nomeImagem: img,
        cnpj: state.cnpj,
      };

      try {
        state.loading = true;
        serviceChamados.removerImagemChamado(param);

        state.imagensChamado = state.imagensChamado.filter((i) => i !== img);
        Swal.fire("Removido!", "O anexo foi removido com sucesso.", "success");
      } catch (error) {
        Swal.fire({
          icon: "error",
          text: "Falha ao remover o anexo. Tente novamente.",
        });
        return;
      } finally {
        state.loading = false;
      }
    }
  });
}

function visualizarPreviaAnexo() {
  stateModal.anexo.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        stateModal.previews.push(e.target.result.toString());
      }
    };
    reader.readAsDataURL(file);
  });
}

function removerAnexoPreview(index: number) {
  stateModal.anexo.splice(index, 1);
  stateModal.previews.splice(index, 1);
}

function selecionarAnexo() {
  const file = document.getElementById("fileInputModal");
  file.click();
}

function limparAnexos() {
  stateModal.anexo = [];
  stateModal.previews = [];
}

onMounted(async () => {
  limparAnexos();
});
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
            <div
              v-for="(img, index) in state.imagensChamado"
              :key="index"
              class="image-wrapper"
            >
              <PhotoProvider :default-backdrop-opacity="0.8">
                <PhotoConsumer :src="imgChamadoFormatado(img)">
                  <img
                    :src="imgChamadoFormatado(img)"
                    class="img-miniatura"
                  />
                </PhotoConsumer>
              </PhotoProvider>
              <v-btn
                icon
                size="24"
                color="outline"
                class="remove-icon"
                @click="removerAnexo(img)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
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
        <v-col cols="10">
          <label>Anexar imagem</label>
          <v-btn
            class="ml-2"
            icon
            size="30px"
            color="primary"
            @click="selecionarAnexo"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>

          <v-file-input
            id="fileInputModal"
            style="display: none"
            v-model="stateModal.anexo"
            label="Anexos"
            variant="outlined"
            multiple
            accept=".pdf, .jpg, .jpeg"
            density="compact"
            class="mt-2"
            @change="visualizarPreviaAnexo"
          ></v-file-input>

          <PhotoProvider
            v-for="(file, index) in stateModal.previews"
            :key="index"
            :default-backdrop-opacity="0.8"
          >
            <PhotoConsumer :src="file">
              <div class="preview-wrapper">
                <img
                  :src="file"
                  class="view-box img-miniatura"
                />
                <v-btn
                  icon
                  style="margin-left: -20px; margin-top: -20px"
                  size="20px"
                  color="outline"
                  class="remove-icon-btn"
                  @click="removerAnexoPreview(index)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </div>
            </PhotoConsumer>
          </PhotoProvider>
        </v-col>
        <v-col cols="2">
          <v-btn
            color="primary"
            class="mt-2"
            width="100px"
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
  align-items: flex-start;
  justify-content: start;
  max-height: 200px;
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

.image-wrapper {
  position: relative;
  width: 90px;
  height: 90px;
}

.img-miniatura:hover {
  transform: scale(1.1);
}

.remove-icon {
  position: absolute;
  top: 4px;
  right: 4px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  transition: background-color 0.2s ease;
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

.preview-wrapper img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin-left: 20px;
  margin-bottom: -30px;
}
</style>
