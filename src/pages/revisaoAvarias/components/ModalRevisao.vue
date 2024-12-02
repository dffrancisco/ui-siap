<script lang="ts" setup>
import { onMounted, reactive } from "vue";
import { iAvaria, iAvariaDestino, iFuncionario } from "../interfaces";
import serviceRevisaoAvarias from "../services/serviceRevisaoAvarias.service";
import Swal from "sweetalert2";
import moment from "moment";
import { msgConfirm } from "@/ts/message";

const props = defineProps({
  avaria: {
    type: Object as () => iAvaria,
    required: true,
  },
  destinos: {
    type: Array as () => iAvariaDestino[],
    required: true,
  },
  funcionarios: {
    type: Array as () => iFuncionario[],
    required: true,
  },
});

const emits = defineEmits(["closeModal", "finalizarAvaria"]);

const origemConteudo = [
  {
    value: "L",
    label: "Na Loja",
  },
  {
    value: "D",
    label: "Na Devolução do Cliente",
  },
  {
    value: "F",
    label: "Ao Receber do Fornecedor",
  },
];

const state = reactive({
  dbAvaria: <iAvaria>{},
  loading: false,
  imgs: <string[]>[],
  cnpjEmpresa: "",
});

const actions = {
  async init() {
    state.dbAvaria = { ...props.avaria };
    await actions.getImgs();
  },

  closeModal() {
    emits("closeModal");
  },

  imgAvariaFormatada(img: string) {
    const cnpjSanitizado = state.cnpjEmpresa.replace(/[.\-\/]/g, "");
    return `https://reallatas.com.br/avarias/${cnpjSanitizado}/${img}`;
  },

  async btnRevisar() {
    if (
      !state.dbAvaria.ORIGEM_AVARIA ||
      !state.dbAvaria.COD_FUNCIONARIO_IDENTIFICOU ||
      !state.dbAvaria.ID_AVARIA_DESTINO ||
      state.dbAvaria?.DESCRICAO_AVARIA.trim() == ""
    ) {
      Swal.fire({
        title: "Todos os campos são obrigatórios.",
        icon: "warning",
      });
      return;
    }

    let destinoLocalizado = props.destinos.find((destino) => {
      return destino.ID_AVARIA_DESTINO === state.dbAvaria.ID_AVARIA_DESTINO;
    });

    if (
      await msgConfirm(
        "Confirmação",
        `Tem certeza que deseja revisar o produto "${state.dbAvaria.DESC_PRODUTO}" com o destino "${destinoLocalizado.DESCRICAO}" ?`
      )
    ) {
      await actions.finalizarAvaria();
    }
  },

  async getImgs() {
    try {
      state.loading = true;
      const data = await serviceRevisaoAvarias.getImgs(props.avaria.ID_AVARIA);

      state.imgs = data.imgs;
      state.cnpjEmpresa = data.cnpjEmpresa;
    } catch (error) {
      Swal.fire({
        title: "Erro ao carregar imagens",
        text: error.message,
        icon: "error",
      });
    } finally {
      state.loading = false;
    }
  },

  async finalizarAvaria() {
    try {
      state.loading = true;

      const data = await serviceRevisaoAvarias.finalizarAvaria({
        COD_FUNCIONARIO_IDENTIFICOU: state.dbAvaria.COD_FUNCIONARIO_IDENTIFICOU,
        ID_AVARIA: state.dbAvaria.ID_AVARIA,
        ID_AVARIA_DESTINO: state.dbAvaria.ID_AVARIA_DESTINO,
        ORIGEM_AVARIA: state.dbAvaria.ORIGEM_AVARIA,
        DESCRICAO: state.dbAvaria.DESCRICAO_AVARIA,
        COD_PRODUTO: state.dbAvaria.COD_PRODUTO,
      });

      if (data.success) {
        Swal.fire({
          title: data.msg,
          icon: "success",
        });

        emits("finalizarAvaria", {
          ID_AVARIA: state.dbAvaria.ID_AVARIA,
          COD_FUNCIONARIO_IDENTIFICOU: state.dbAvaria.COD_FUNCIONARIO_IDENTIFICOU,
          ID_AVARIA_DESTINO: state.dbAvaria.ID_AVARIA_DESTINO,
          DATA_HORA_VALIDACAO: moment(),
          NOME_FUNCIONARIO_VALIDOU: "VINICIUS MEDEIROS",
          DESCRICAO_AVARIA: state.dbAvaria.DESCRICAO_AVARIA,
          ORIGEM_AVARIA: state.dbAvaria.ORIGEM_AVARIA,
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Erro ao finalizar avaria",
        text: error.message,
        icon: "error",
      });
    } finally {
      state.loading = false;
    }
  },
};

onMounted(async () => {
  await actions.init();
});
</script>

<template>
  <v-card>
    <div class="d-flex justify-space-between align-center px-4 py-2">
      <v-card-title class="pa-0">Revisar Avaria</v-card-title>
      <v-icon
        size="x-large"
        title="Fechar"
        @click="actions.closeModal"
        >mdi-close
      </v-icon>
    </div>

    <v-divider></v-divider>

    <div class="pa-4">
      <div>
        <v-row>
          <v-col cols="4">
            <v-text-field
              v-model="state.dbAvaria.NUM_FABRICANTE"
              readonly
              label="Nº Fabricante"
              :clearable="false"
            ></v-text-field>
          </v-col>
          <v-col cols="8">
            <v-text-field
              v-model="state.dbAvaria.DESC_PRODUTO"
              readonly
              label="Produto"
              :clearable="false"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-select
              v-model="state.dbAvaria.ORIGEM_AVARIA"
              :items="origemConteudo"
              item-value="value"
              item-title="label"
              label="Origem*"
              :readonly="state.dbAvaria.FINALIZADO == 'S'"
              :clearable="false"
            ></v-select>
          </v-col>
          <v-col>
            <v-select
              v-model="state.dbAvaria.COD_FUNCIONARIO_IDENTIFICOU"
              :items="props.funcionarios"
              :readonly="state.dbAvaria.FINALIZADO == 'S'"
              item-value="COD_FUNCIONARIO"
              item-title="LOGIN"
              label="Identificador da Avaria*"
              :clearable="false"
            ></v-select>
          </v-col>
          <v-col>
            <v-select
              v-model="state.dbAvaria.ID_AVARIA_DESTINO"
              :items="props.destinos"
              :readonly="state.dbAvaria.FINALIZADO == 'S'"
              item-value="ID_AVARIA_DESTINO"
              item-title="DESCRICAO"
              label="Destino*"
              :clearable="false"
            ></v-select>
          </v-col>

          <v-col cols="12">
            <v-textarea
              v-model="state.dbAvaria.DESCRICAO_AVARIA"
              label="Descrição da Avaria*"
              :readonly="state.dbAvaria.FINALIZADO == 'S'"
              rows="2"
              :clearable="state.dbAvaria.FINALIZADO == 'N'"
            ></v-textarea>
          </v-col>
        </v-row>
      </div>

      <div class="mt-4">
        <span class="text-h6">Fotos</span>

        <div class="mt-2 containerImg">
          <PhotoProvider
            v-for="img in state.imgs"
            :default-backdrop-opacity="0.8"
          >
            <PhotoConsumer :src="actions.imgAvariaFormatada(img)">
              <img
                :src="actions.imgAvariaFormatada(img)"
                class="view-box img-miniatura"
            /></PhotoConsumer>
          </PhotoProvider>
        </div>
      </div>

      <div class="mt-4 d-flex justify-space-between align-center">
        <div
          ><span
            v-if="props.avaria.FINALIZADO == 'S'"
            class="text-body-1"
            >Revisada por {{ state.dbAvaria.NOME_FUNCIONARIO_VALIDOU }} em
            {{ moment(state.dbAvaria.DATA_HORA_VALIDACAO).format("DD/MM/YYYY") }} ás
            {{ moment(state.dbAvaria.DATA_HORA_VALIDACAO).format("HH:mm") }}</span
          ></div
        >
        <v-btn
          v-if="props.avaria.FINALIZADO == 'N'"
          color="primary"
          @click="actions.btnRevisar"
          >revisar</v-btn
        >
      </div>
    </div>
  </v-card>

  <v-overlay
    :model-value="state.loading"
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

<style>
.PhotoSlider__Wrapper .PhotoSlider__BannerWrap {
  background-color: rgba(0, 0, 0, 0);
}

.PhotoSlider__Wrapper .PhotoSlider__BannerWrap .PhotoSlider__BannerRight svg:nth-child(1),
.PhotoSlider__Wrapper .PhotoSlider__BannerWrap .PhotoSlider__BannerRight svg:nth-child(4),
.PhotoSlider__Wrapper .PhotoSlider__BannerWrap .PhotoSlider__BannerRight svg:nth-child(5) {
  display: none;
}

.PhotoSlider__Wrapper .PhotoSlider__BannerWrap .PhotoSlider__Counter {
  color: transparent;
}
</style>

<style scoped>
.img-miniatura {
  width: 180px;
  border-radius: 8px;
  max-height: 120px;
  object-fit: cover;
  object-position: center;
  cursor: pointer;
}

.containerImg {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-height: 180px;
  overflow: auto;
}
</style>
