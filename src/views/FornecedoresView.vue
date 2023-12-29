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
  nome_fantasia: '',
  telefone: '',
  email: ''
})
const editForm = ref({
  nome: '',
  nome_fantasia: '',
  telefone: '',
  email: ''
})

const saveFornecedor = () => {
  axios
    .post('/api/fornecedores', createForm.value)
    .then(() => {
      creatModal_ref.value.closeModal()
      tableKey.value++
      showToast({
        type: 'success',
        message: 'Fornecedor cadastrado com sucesso!'
      })
      createForm.value = {
        nome: '',
        nome_fantasia: '',
        telefone: '',
        email: ''
      }
    })
    .catch(() => {
      showToast({
        type: 'error',
        message: 'Erro ao cadastrar fornecedor!'
      })
    })
}

const updateFornecedor = () => {
  axios
    .put(`/api/fornecedores/${editForm.value.id}`, editForm.value)
    .then(() => {
      editModal_ref.value.closeModal()
      tableKey.value++
      showToast({
        type: 'success',
        message: 'Fornecedor atualizado com sucesso!'
      })
      editForm.value = {
        nome: '',
        nome_fantasia: '',
        telefone: '',
        email: ''
      }
    })
    .catch(() => {
      showToast({
        type: 'error',
        message: 'Erro ao atualizar fornecedor!'
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

const deleteFornecedor = () => {
  axios
    .delete(`/api/fornecedores/${deleteItemId.value}`)
    .then(() => {
      deleteModal_ref.value.closeModal()
      tableKey.value++
      showToast({
        type: 'success',
        message: 'Fornecedor excluído com sucesso!'
      })
    })
    .catch(() => {
      showToast({
        type: 'error',
        message: 'Erro ao excluir fornecedor!'
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
    text: 'Nome Fantasia',
    value: 'nome_fantasia',
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
        :route="'/api/fornecedores'"
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
              Editar Fornecedor
            </button>
            <button @click="creatModal_ref.openModal()" class="btn btn-primary">Novo Fornecedor</button>
          </div>
        </template>
      </DefaultTable>
      <template #fallback>
        <div class="flex justify-center items-center h-full w-full">
          <span class="loading loading-dots loading-lg mt-16 text-primary"></span>
        </div>
      </template>
    </Suspense>
    <DefaultModal ref="creatModal_ref" @onSubmit="saveFornecedor()">
      <template #header>
        <div class="pb-2">
          <span class="text-2xl font-bold">Novo Fornecedor</span>
        </div>
      </template>
      <template #body>
        <div class="flex flex-col flex-wrap">
          <div class="flex flex-wrap">
            <div class="w-full sm:w-1/2">
              <DefaultInput v-model="createForm.nome" placeholder="Nome" required />
            </div>
            <div class="w-full sm:w-1/2">
              <DefaultInput v-model="createForm.nome_fantasia" placeholder="Nome Fantasia" />
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
    <DefaultModal ref="editModal_ref" @onSubmit="updateFornecedor()">
      <template #header>
        <div class="pb-2">
          <span class="text-2xl font-bold">Editar Fornecedor</span>
        </div>
      </template>
      <template #body>
        <div class="flex flex-col flex-wrap">
          <div class="flex flex-wrap">
            <div class="w-full sm:w-1/2">
              <DefaultInput v-model="editForm.nome" placeholder="Nome" required />
            </div>
            <div class="w-full sm:w-1/2">
              <DefaultInput v-model="editForm.nome_fantasia" placeholder="Nome Fantasia" />
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
    <DefaultModal ref="deleteModal_ref" @onSubmit="deleteFornecedor()">
      <template #header>
        <div class="pb-2">
          <span class="text-2xl font-bold">Excluir Fornecedor</span>
        </div>
      </template>
      <template #body>
        <div class="flex flex-col flex-wrap">
          <div class="flex flex-wrap">
            <div class="w-full">
              <span>Tem certeza que deseja excluir o fornecedor?</span>
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
