<script setup>
import { defineAsyncComponent, ref, onMounted } from 'vue'
import { TrashIcon } from '@heroicons/vue/24/outline'
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
  descricao: '',
  preco: '',
  quantidade: '',
  fornecedor_id: 0
})
const editForm = ref({
  nome: '',
  descricao: '',
  preco: '',
  quantidade: '',
  fornecedor_id: 0
})
const fornecedoresOptions = ref([])

const saveProduto = () => {
  axios
    .post('/api/produtos', createForm.value)
    .then(() => {
      creatModal_ref.value.closeModal()
      tableKey.value++
      showToast({
        type: 'success',
        message: 'Produto cadastrado com sucesso!'
      })
      createForm.value = {
        nome: '',
        descricao: '',
        preco: '',
        quantidade: '',
        fornecedor_id: 0
      }
    })
    .catch(() => {
      showToast({
        type: 'error',
        message: 'Erro ao cadastrar Produto!'
      })
    })
}

const updateProduto = () => {
  axios
    .put(`/api/produtos/${editForm.value.id}`, editForm.value)
    .then(() => {
      editModal_ref.value.closeModal()
      tableKey.value++
      showToast({
        type: 'success',
        message: 'Produto atualizado com sucesso!'
      })
      editForm.value = {
        nome: '',
        descricao: '',
        preco: '',
        quantidade: '',
        fornecedor_id: 0
      }
    })
    .catch(() => {
      showToast({
        type: 'error',
        message: 'Erro ao atualizar Produto!'
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

const deleteProduto = () => {
  axios
    .delete(`/api/produtos/${deleteItemId.value}`)
    .then(() => {
      deleteModal_ref.value.closeModal()
      tableKey.value++
      showToast({
        type: 'success',
        message: 'Produto excluído com sucesso!'
      })
    })
    .catch(() => {
      showToast({
        type: 'error',
        message: 'Erro ao excluir Produto!'
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
    text: 'Descrição',
    value: 'descricao',
    style: 'text-left',
    class: 'text-secondary',
    bodyStyle: 'text-left'
  },
  {
    text: 'Preço',
    value: 'preco',
    style: 'text-left',
    class: 'text-secondary',
    bodyStyle: 'text-left'
  },
  {
    text: 'Quantidade',
    value: 'quantidade',
    style: 'text-left',
    class: 'text-secondary',
    bodyStyle: 'text-left'
  },
  {
    text: 'Fornecedor',
    value: 'fornecedor_nome',
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

onMounted(async () => {
  await axios.get('/api/fornecedores').then((response) => {
    fornecedoresOptions.value = response.data.data
  })
})
</script>
<template>
  <div>
    <Suspense>
      <DefaultTable
        :route="'/api/produtos'"
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
              Editar Produto
            </button>
            <button @click="creatModal_ref.openModal()" class="btn btn-primary">
              Novo Produto
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
    <DefaultModal ref="creatModal_ref" @onSubmit="saveProduto()">
      <template #header>
        <div class="pb-2">
          <span class="text-2xl font-bold">Novo Produto</span>
        </div>
      </template>
      <template #body>
        <div class="flex flex-col flex-wrap">
          <div class="flex w-full">
            <div class="w-full sm:w-1/2">
              <DefaultInput v-model="createForm.nome" placeholder="Nome" required />
            </div>
            <div class="w-full sm:w-1/2 p-0.5">
              <select
                v-model="createForm.fornecedor_id"
                class="select select-primary w-full pl-2 h-12"
              >
                <option disabled selected :value="0">Fonecedor</option>
                <option v-for="option in fornecedoresOptions" :key="option.id" :value="option.id">
                  {{ option.nome }}
                </option>
              </select>
            </div>
          </div>
          <div class="flex">
            <div class="w-full">
              <DefaultInput v-model="createForm.descricao" placeholder="Descrição" />
            </div>
          </div>
          <div class="flex flex-wrap">
            <div class="w-full sm:w-1/2">
              <DefaultInput type="number" v-model="createForm.preco" placeholder="Preço" />
            </div>
            <div class="w-full sm:w-1/2">
              <DefaultInput
                type="number"
                v-model="createForm.quantidade"
                placeholder="Quantidade"
              />
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
    <DefaultModal ref="editModal_ref" @onSubmit="updateProduto()">
      <template #header>
        <div class="pb-2">
          <span class="text-2xl font-bold">Editar Produto</span>
        </div>
      </template>
      <template #body>
        <div class="flex flex-col flex-wrap">
          <div class="flex flex-wrap">
            <div class="w-full sm:w-1/2">
              <DefaultInput v-model="editForm.nome" placeholder="Nome" required />
            </div>
            <div class="w-full sm:w-1/2">
              <select v-model="editForm.fornecedor_id" class="select select-primary w-full">
                <option disabled selected :value="0">Fonecedor</option>
                <option v-for="option in fornecedoresOptions" :key="option.id" :value="option.id">
                  {{ option.nome }}
                </option>
              </select>
            </div>
          </div>
          <div class="flex">
            <div class="w-full">
              <DefaultInput v-model="editForm.descricao" placeholder="Descrição" />
            </div>
          </div>
          <div class="flex flex-wrap">
            <div class="w-full sm:w-1/2">
              <DefaultInput v-model="editForm.preco" placeholder="Preço" />
            </div>
            <div class="w-full sm:w-1/2">
              <DefaultInput v-model="editForm.quantidade" placeholder="Quantidade" />
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
    <DefaultModal ref="deleteModal_ref" @onSubmit="deleteProduto()">
      <template #header>
        <div class="pb-2">
          <span class="text-2xl font-bold">Excluir Produto</span>
        </div>
      </template>
      <template #body>
        <div class="flex flex-col flex-wrap">
          <div class="flex flex-wrap">
            <div class="w-full">
              <span>Tem certeza que deseja excluir o Produto?</span>
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
