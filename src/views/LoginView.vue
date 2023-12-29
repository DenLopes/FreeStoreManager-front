<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const email = ref('admin@admin.com')
const password = ref('123456')
</script>
<template>
  <div class="flex justify-center h-full items-center">
    <div class="hero min-h-screen bg-base-200">
      <div class="card bg-base-100 hero-content flex-col lg:flex-row-reverse">
        <div class="text-center lg:text-left">
          <h1 class="text-5xl font-bold">Faça o login!!</h1>
          <p class="py-6 max-w-xl mx-auto ">
            Nosso sistema apresenta uma interface simples e intuitiva para que você possa gerenciar seu açougue de forma fácil e rápida.
          </p>
        </div>
        <div class="divider divider-horizontal"></div>
        <div class="shrink-0 w-full max-w-sm">
          <form
            @submit.prevent="useAuthStore().login(email, password)"
            class="flex flex-col gap-4 w-full p-6"
          >
            <span class="text-2xl font-bold">Login</span>
            <input
              v-model="email"
              type="text"
              placeholder="email"
              class="input input-bordered w-full max-w-xs"
            />
            <input
              v-model="password"
              type="password"
              placeholder="senha"
              class="input input-bordered w-full max-w-xs"
            />
            <!-- <span class="text-xs text-left -mt-2 text-secondary underline cursor-pointer"
              >Esqueceu a senha?</span
            > -->
            <button type="submit" class="btn btn-primary w-20 self-end">Entrar</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
