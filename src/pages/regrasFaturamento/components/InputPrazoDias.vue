<script lang="ts" setup>
import { computed, reactive } from "vue";

const props = defineProps({
  prazos: {
    type: Array,
    required: true,
    default: 0,
  },
});

const emits = defineEmits(["updatePrazo"]);

const actions = {
  updatePrazo() {
    emits("updatePrazo", computeds.inputValue.value);
  },
};

const computeds = {
  inputValue: computed(() => {
    if (props.prazo != null) {
      return props.prazo;
    }
  }),
};
</script>

<template>
  <div
    class="rounded justify-center d-flex"
    style="border: 1px solid gray; width: 36px"
  >
    <input
      class="pa-2"
      style="width: 30px"
      v-model="computeds.inputValue.value"
      :clearable="false"
      :focusout="actions.updatePrazo"
    />
  </div>
</template>
