<script setup lang="ts">
defineProps<{
  orcamentos: { NUM_ORCAMENTO: number; VALOR_ORCAMENTO: number }[];
  entregarReceber?: boolean;
}>();
import utils from "@/ts/utils";
</script>

<template>
  <div class="orcamento-group">
    <div
      v-for="orc in orcamentos"
      :key="orc.NUM_ORCAMENTO"
      class="orcamento-box"
      :class="{ 'orcamento-entregar-receber': entregarReceber }"
      :title="entregarReceber ? 'E/R Dias Anteriores' : 'Nº Orc. / Valor'"
    >
      <div
        class="orcamento-numero"
        :class="{ 'orcamento-numero-entregar-receber': entregarReceber }"
      >
        {{ orc.NUM_ORCAMENTO }}
      </div>
      <div
        class="orcamento-valor"
        :class="{ 'orcamento-valor-entregar-receber': entregarReceber }"
      >
        {{ utils.formatValor(orc.VALOR_ORCAMENTO) }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.orcamento-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 4px;
  margin-left: -20px;
  gap: 2px;
}

.orcamento-box {
  display: flex;
  align-items: center;
  border: 1px solid #017bc2c7;
  border-radius: 6px;
  overflow: hidden;
  font-weight: bold;
  color: #0496ea;
  background: rgba(33, 150, 243, 0.15);
  width: fit-content;
}

.orcamento-numero {
  padding: 4px 8px;
  background: #0496ea;
  color: white;
  border-radius: 0px 8px 8px 0px;
  min-width: 54px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.orcamento-valor {
  padding: 4px 8px;
  color: #0496ea;
  border-radius: 0 6px 6px 0;
  min-width: 56px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.orcamento-numero-entregar-receber {
  background: #c2016575;
}

.orcamento-valor-entregar-receber {
  color: #c20165c1;
}

.orcamento-entregar-receber {
  border: 1px solid #c20165c7;
  color: #fb2be7;
  background: rgba(243, 33, 229, 0.15);
  margin-top: 3px;
  margin-bottom: 3px;
  margin-right: 5px;
}
</style>
