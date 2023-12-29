<script setup>
import { defineAsyncComponent, ref } from 'vue'
import axios from '@/services/axios'
import DefaultTable from '../components/DefaultTable.vue'
import { showToast } from '@/composables/toast.js'
const DefaultModal = defineAsyncComponent(() => import('../components/DefaultModal.vue'))
const DefaultInput = defineAsyncComponent(() => import('../components/DefaultInput.vue'))

const creatModal_ref = ref(null)
const editModal_ref = ref(null)
const deleteModal_ref = ref(null)
const deleteItemId = ref(null)
const tableKey = ref(0)
const createForm = ref({
  nome: '',
  email: '',
  telefone: ''
})
const editForm = ref({
  nome: '',
  email: '',
  telefone: ''
})

const saveCliente = () => {
  axios
    .post('/api/clientes', createForm.value)
    .then(() => {
      creatModal_ref.value.closeModal()
      tableKey.value++
      showToast({
        type: 'success',
        message: 'Cliente cadastrado com sucesso!'
      })
      createForm.value = {
        nome: '',
        email: '',
        telefone: ''
      }
    })
    .catch(() => {
      showToast({
        type: 'error',
        message: 'Erro ao cadastrar Cliente!'
      })
    })
}

const updateCliente = () => {
  axios
    .put(`/api/clientes/${editForm.value.id}`, editForm.value)
    .then(() => {
      editModal_ref.value.closeModal()
      tableKey.value++
      showToast({
        type: 'success',
        message: 'Cliente atualizado com sucesso!'
      })
      editForm.value = {
        nome: '',
        email: '',
        telefone: ''
      }
    })
    .catch(() => {
      showToast({
        type: 'error',
        message: 'Erro ao atualizar Cliente!'
      })
    })
}

const openEditModal = (item) => {
  editForm.value = { ...item }
  editModal_ref.value.openModal()
}

const openDeleteModal = (item) => {
  deleteItemId.value = item.id
  deleteModal_ref.value.openModal()
}

const deleteCliente = () => {
  axios
    .delete(`/api/clientes/${deleteItemId.value}`)
    .then(() => {
      deleteModal_ref.value.closeModal()
      tableKey.value++
      showToast({
        type: 'success',
        message: 'Cliente excluído com sucesso!'
      })
    })
    .catch(() => {
      showToast({
        type: 'error',
        message: 'Erro ao excluir Cliente!'
      })
    })
}

const headers = [
  {
    text: 'Nome',
    value: 'nome',
    style: 'text-left',
    class: 'text-secondary',
    bodyStyle: 'text-left'
  },
  {
    text: 'Telefone',
    value: 'telefone',
    style: 'text-left',
    class: 'text-secondary',
    bodyStyle: 'text-left'
  },
  {
    text: 'Email',
    value: 'email',
    style: 'text-left',
    class: 'text-secondary',
    bodyStyle: 'text-left'
  },
  {
    text: 'Criado em',
    value: 'created_at',
    style: 'text-left',
    class: 'text-secondary',
    bodyStyle: 'text-left'
  },
  {
    text: 'Modificado em',
    value: 'updated_at',
    style: 'text-left',
    class: 'text-secondary',
    bodyStyle: 'text-left'
  }
]
</script>
<template>
  <div>
    <Suspense>
      <DefaultTable
        :route="'/api/clientes'"
        :headers="headers"
        @onRowClick="openEditModal"
        :key="tableKey"
      >
        <template #toolbar="{ selectRow }">
          <div class="flex justify-end">
            <button
              @click="openDeleteModal(selectRow)"
              class="btn btn-outline mx-2 btn-error disabled"
              :disabled="!selectRow"
            >
              <v-icon name="fa-trash" />
            </button>
            <button
              @click="openEditModal(selectRow)"
              class="btn btn-outline mx-2 btn-primary disabled"
              :disabled="!selectRow"
            >
              Editar Cliente
            </button>
            <button @click="creatModal_ref.openModal()" class="btn btn-primary">
              Novo Cliente
            </button>
          </div>
        </template>
      </DefaultTable>
      <template #fallback>
        <div class="flex justify-center items-center h-full w-full">
          <span class="loading loading-dots loading-lg mt-16 text-primary"></span>
        </div>
      </template>
    </Suspense>
    <DefaultModal ref="creatModal_ref" @onSubmit="saveCliente()">
      <template #header>
        <div class="pb-2">
          <span class="text-2xl font-bold">Novo Cliente</span>
        </div>
      </template>
      <template #body>
        <div class="flex flex-col flex-wrap">
          <div class="flex flex-wrap">
            <div class="w-full">
              <DefaultInput v-model="createForm.nome" placeholder="Nome" required />
            </div>
          </div>
          <div class="flex flex-wrap">
            <div class="w-full sm:w-1/2">
              <DefaultInput v-model="createForm.telefone" placeholder="Telefone" />
            </div>
            <div class="w-full sm:w-1/2">
              <DefaultInput v-model="createForm.email" placeholder="Email" />
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-between pt-4">
          <button @click.prevent="creatModal_ref.closeModal()" class="btn btn-outline btn-error">
            Cancelar
          </button>
          <div class="flex justify-end">
            <button type="submit" class="btn btn-primary">Salvar</button>
          </div>
        </div>
      </template>
    </DefaultModal>
    <DefaultModal ref="editModal_ref" @onSubmit="updateCliente()">
      <template #header>
        <div class="pb-2">
          <span class="text-2xl font-bold">Editar Cliente</span>
        </div>
      </template>
      <template #body>
        <div class="flex flex-col flex-wrap">
          <div class="flex flex-wrap">
            <div class="w-full">
              <DefaultInput v-model="editForm.nome" placeholder="Nome" required />
            </div>
          </div>
          <div class="flex flex-wrap">
            <div class="w-full sm:w-1/2">
              <DefaultInput v-model="editForm.telefone" placeholder="Telefone" />
            </div>
            <div class="w-full sm:w-1/2">
              <DefaultInput v-model="editForm.email" placeholder="Email" />
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-between pt-4">
          <button @click.prevent="editModal_ref.closeModal()" class="btn btn-outline btn-error">
            Cancelar
          </button>
          <div class="flex justify-end">
            <button type="submit" class="btn btn-primary">Atualizar</button>
          </div>
        </div>
      </template>
    </DefaultModal>
    <DefaultModal ref="deleteModal_ref" @onSubmit="deleteCliente()">
      <template #header>
        <div class="pb-2">
          <span class="text-2xl font-bold">Excluir Cliente</span>
        </div>
      </template>
      <template #body>
        <div class="flex flex-col flex-wrap">
          <div class="flex flex-wrap">
            <div class="w-full">
              <span>Tem certeza que deseja excluir o Cliente?</span>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-between pt-4">
          <button @click.prevent="deleteModal_ref.closeModal()" class="btn btn-outline btn-error">
            Cancelar
          </button>
          <button type="submit" class="btn btn-primary">Excluir</button>
        </div>
      </template>
    </DefaultModal>
  </div>
</template>
