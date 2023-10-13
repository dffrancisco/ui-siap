<script lang="ts" setup>
const props = defineProps({
  urlIMG: {
    type: String,
    require: true,
  },
  color: {
    type: String,
    default: "grey",
  },
});
</script>

<template>
  <v-avatar :color="color">
    <v-img cover :src="urlIMG" />
  </v-avatar>
</template>
