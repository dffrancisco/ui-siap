<script lang="ts" setup>
import { onMounted } from "vue";
import { onBeforeMount } from "@vue/runtime-core";
import { useRouter } from "vue-router";

const router = useRouter();
// onBeforeMount(() => {
//   router.push("home");
//   console.log("sdfasdf");
// });

onMounted(async () => {
  // await actions.getDataHora();
});
</script>

<template>
  <!-- <router-view></router-view> -->

  <div>estamos na pagina pincipal</div>
</template>
