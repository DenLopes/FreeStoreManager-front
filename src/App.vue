<script setup>
import ToastGlobal from '@/composables/toast.js'
</script>

<template>
  <div data-theme="autumn" class="h-screen">
    <ToastGlobal />
    <RouterView />
  </div>
</template>
