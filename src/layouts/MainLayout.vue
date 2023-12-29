<script setup>
import { ref } from 'vue'
import {
  ArrowLeftOnRectangleIcon
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '../stores/authStore'
import { useRoute, useRouter } from 'vue-router'
import MeatOutilinedSvg from '@/assets/MeatSvg.vue'

const drawerOpen = ref(false)
const router = useRouter()

const drawerItems = [
  {
    name: 'Vendas',
    icon: 'fa-cart-plus',
    to: { name: 'Vendas' }
  },
  {
    name: 'Clientes',
    icon: 'fa-users',
    to: { name: 'Clientes' }
  },
  {
    name: 'Fornecedores',
    icon: 'fa-truck',
    to: { name: 'Fornecedores' }
  },
  {
    name: 'Compras',
    icon: 'fa-box-open',
    to: { name: 'Compras' }
  }
]

const clickedDrawerItem = (toName) => {
  drawerOpen.value = false
  router.push(toName)
}
</script>
<template>
  <body class="h-screen">
    <!-- Page content -->
    <div class="flex flex-col flex-nowrap h-full">
      <div class="navbar bg-base-200">
        <div class="flex-1">
          <button
            class="btn btn-ghost text-xl text-secondary"
            @click="$router.push({ name: 'Dashboard' })"
          >
            <v-icon name="fa-desktop" class="w-7 h-7" />
            <span class="p-2"> ACG </span>
          </button>
        </div>
        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn btn-square btn-ghost">
            <v-icon name="fa-user-tie" class="w-7 h-7" />
          </div>
          <ul
            tabindex="0"
            class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <a
                class="flex h-12 items-center"
                @click.prevent.stop="$router.push({ name: 'Usuarios' })"
              >
                <v-icon name="fa-user-plus" class="w-6 h-6 mr-2" />
                <span>Usuarios</span>
              </a>
            </li>
            <li class="mt-auto">
              <a class="flex h-12 items-center" @click.prevent.stop="useAuthStore().logout()">
                <ArrowLeftOnRectangleIcon class="w-6 h-6 mr-2 text-red-600" />
                <span class="text-red-600">Sair</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div class="flex overflow-hidden h-full">
        <ul
          class="menu p-4 w-20 hover:w-64 min-h-full bg-base-200 text-base-content overflow-hidden transition-all ease-in-out delay-75 duration-150"
        >
          <li>
            <a class="flex h-12 items-center" @click="clickedDrawerItem({ name: 'Produtos' })">
              <MeatOutilinedSvg class="w-8 h-8 mr-2" />
              <span> Produtos </span>
            </a>
          </li>
          <li v-for="item in drawerItems" :key="item">
            <a class="flex h-12 items-center" @click="clickedDrawerItem(item.to)">
              <v-icon :name="item.icon" class="w-8 h-8 mr-2" />
              <span>{{ item.name }}</span>
            </a>
          </li>
        </ul>
        <div class="flex flex-col flex-nowrap w-full h-full p-4 overflow-auto bg">
          <span class="p-2 font-medium text-lg">{{ useRoute().meta.title }}</span>
          <div class="overflow-auto">
            <RouterView />
          </div>
        </div>
      </div>
    </div>
  </body>
</template>
