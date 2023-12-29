<script setup>
import MeatOutilined from '../assets/MeatOutilined.vue';

</script>

<template>
  <body class="relative flex flex-nowrap h-full">
    <div class="absolute w-full h-full bg-primary/5 overflow-hidden">
      <div class="flex flex-col justify-center items-center h-full">
        <div class="flex flex-wrap justify-center items-center">
          <MeatOutilined v-for="n in 300" class="w-10 h-10 m-6" fill-opacity="0.08" :key="n"/>
        </div>
      </div>
    </div>
    <div class="h-full w-full">
      <RouterView />
    </div>
  </body>
</template>

<style scoped>
</style>
